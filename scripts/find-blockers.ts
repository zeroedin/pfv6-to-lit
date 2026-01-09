#!/usr/bin/env node
/**
 * Find blocker components - identifies the next best component to convert
 * based on dependency count and impact on other components.
 *
 * Outputs top 6 candidates sorted by:
 * 1. Total dependencies (fewest first)
 * 2. Blocker count (most blocking components first, as tiebreaker)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Component {
  name: string;
  type: string;
  converted?: boolean;
  totalDependencies: number;
  dependencies: {
    patternfly?: string[];
    relative?: string[];
  };
  demoDependencies: {
    patternfly?: string[];
    relative?: string[];
  };
}

interface DependencyTree {
  components: Component[];
}

interface RankedComponent extends Component {
  blocks: number;
  impact: number;
}

/**
 * Demo dependencies that are ignored during dependency checking.
 * - Layout components (Flex, Grid, Stack, etc.) are translated to CSS classes
 * - ValidatedOptions is an enum/type, not a component
 */
const IGNORED_DEMO_DEPS = [
  'ValidatedOptions',
  'Flex', 'FlexItem',
  'Grid', 'GridItem',
  'Stack', 'StackItem',
  'Bullseye',
  'Level',
  'Split', 'SplitItem',
  'Gallery', 'GalleryItem'
];

/**
 * Check if all relative dependencies for a component are satisfied (converted).
 * A component can only be converted if all its relative dependencies are already converted.
 * Also checks demo dependencies since they affect demo creation.
 */
function hasSatisfiedDependencies(component: Component, allComponents: Component[]): boolean {
  const relativeDeps = component.dependencies?.relative || [];
  const demoPatternflyDeps = component.demoDependencies?.patternfly || [];

  // Check if all relative dependencies are converted
  for (const depName of relativeDeps) {
    const dep = allComponents.find(c => c.name === depName);
    if (!dep || !dep.converted) {
      return false; // Dependency not converted - component is blocked!
    }
  }

  // Check if all demo PatternFly dependencies are converted (or are special cases)
  for (const depName of demoPatternflyDeps) {
    // Skip layout components and enums - they're translated to CSS or constants
    if (IGNORED_DEMO_DEPS.includes(depName)) {
      continue;
    }
    // Skip icon components - they can be inlined as SVG
    if (depName.endsWith('Icon')) {
      continue;
    }
    // Skip self-references
    if (depName === component.name || depName === `${component.name}Main` || depName === `${component.name}Utilities` || depName === `${component.name}Icon`) {
      continue;
    }

    const dep = allComponents.find(c => c.name === depName);
    if (!dep || !dep.converted) {
      return false; // Demo dependency not converted - component is blocked!
    }
  }

  return true; // All dependencies satisfied
}

/**
 * Count only unconverted relative dependencies plus unconverted demo dependencies.
 * This gives us the actual number of blockers for a component.
 */
function getUnconvertedDependencyCount(component: Component, allComponents: Component[]): number {
  const relativeDeps = component.dependencies?.relative || [];
  const demoPatternflyDeps = component.demoDependencies?.patternfly || [];

  const unconvertedRelativeDeps = relativeDeps.filter(depName => {
    const dep = allComponents.find(c => c.name === depName);
    return !dep || !dep.converted;
  }).length;

  // Count unconverted demo dependencies (excluding special cases)
  const unconvertedDemoDeps = demoPatternflyDeps.filter(depName => {
    // Skip layout components and enums - they're translated to CSS or constants
    if (IGNORED_DEMO_DEPS.includes(depName)) {
      return false;
    }
    // Skip icon components - they can be inlined as SVG
    if (depName.endsWith('Icon')) {
      return false;
    }
    // Skip self-references
    if (depName === component.name || depName === `${component.name}Main` || depName === `${component.name}Utilities` || depName === `${component.name}Icon`) {
      return false;
    }

    const dep = allComponents.find(c => c.name === depName);
    return !dep || !dep.converted;
  }).length;

  return unconvertedRelativeDeps + unconvertedDemoDeps;
}

// Read dependency tree
const treePath = resolve(process.cwd(), 'react-dependency-tree.json');
const tree: DependencyTree = JSON.parse(readFileSync(treePath, 'utf-8'));

// Filter to non-layout, non-styling (Content, Title, Form, DescriptionList), non-converted components
// AND components whose relative dependencies are all satisfied
const candidates = tree.components.filter(c =>
  c.type === 'component'
  && c.converted !== true
  && c.name !== 'Content'
  && c.name !== 'Title'
  && c.name !== 'Form'
  && c.name !== 'DescriptionList'
  && c.name !== 'DescriptionListGroup'
  && c.name !== 'DescriptionListTerm'
  && c.name !== 'DescriptionListDescription'
  && hasSatisfiedDependencies(c, tree.components)
);

// Calculate blocker counts (how many components depend on each component)
const blockedBy: Record<string, number> = {};
tree.components.forEach(comp => {
  [...(comp.dependencies.patternfly || []),
    ...(comp.demoDependencies.patternfly || [])]
      .forEach(dep => {
        blockedBy[dep] = (blockedBy[dep] || 0) + 1;
      });
});

// Add blocker counts and sort
const ranked: RankedComponent[] = candidates
    .map(c => {
      const unconvertedDeps = getUnconvertedDependencyCount(c, tree.components);
      return {
        ...c,
        blocks: blockedBy[c.name] || 0,
        impact: (blockedBy[c.name] || 0) / (unconvertedDeps + 1),
        // Store unconverted count for debugging
        unconvertedDependencies: unconvertedDeps,
      };
    })
    .sort((a, b) => {
    // Primary sort: fewest unconverted dependencies first
      const aUnconverted = getUnconvertedDependencyCount(a, tree.components);
      const bUnconverted = getUnconvertedDependencyCount(b, tree.components);

      if (aUnconverted !== bUnconverted) {
        return aUnconverted - bUnconverted;
      }
      // Tiebreaker: most blocking components first
      return b.blocks - a.blocks;
    });

// Output formatted markdown recommendation
const top = ranked[0];
const unconvertedDeps = getUnconvertedDependencyCount(top, tree.components);

console.log(`## Next Component to Convert: ${top.name}

**Dependencies**: ${unconvertedDeps}
**Blocks**: ${top.blocks} components
**Impact Score**: ${top.blocks} / (${unconvertedDeps} + 1) = ${top.impact.toFixed(2)}

### Why This Component?
${unconvertedDeps === 0
  ? '- Has zero unconverted dependencies - ready to build immediately'
  : `- Has only ${unconvertedDeps} unconverted dependencies - minimal blockers`}
${top.blocks > 0
  ? `- Blocks ${top.blocks} other components - high impact on unblocking future work`
  : '- Leaf component (blocks no others) - good for learning the workflow'}
- Impact score of ${top.impact.toFixed(2)} provides good balance of ease and value

### Dependency Details:
**Implementation Dependencies**:
${top.dependencies?.patternfly?.length
  ? top.dependencies.patternfly.map(d => `- ${d}`).join('\n')
  : '- None'}

**Demo Dependencies**:
${top.demoDependencies?.patternfly?.length
  ? top.demoDependencies.patternfly.map(d => `- ${d}`).join('\n')
  : '- None'}

---

## Alternative Candidates (Next 5):

${ranked.slice(1, 6).map((c, i) => {
  const deps = getUnconvertedDependencyCount(c, tree.components);
  return `${i + 1}. **${c.name}** - ${deps} deps, blocks ${c.blocks} (impact: ${c.impact.toFixed(2)})`;
}).join('\n')}

---

## Top Blockers (High-Impact Components)

These components block many others but have dependencies themselves:

${[...ranked]
  .sort((a, b) => b.blocks - a.blocks)
  .slice(0, 5)
  .map((c, i) => {
    const deps = getUnconvertedDependencyCount(c, tree.components);
    return `${i + 1}. **${c.name}** - Blocks ${c.blocks} components (${deps} deps)`;
  }).join('\n')}

---

## Next Steps

To proceed with the conversion, use this prompt:

\`\`\`
Convert ${top.name} component
\`\`\`

The main conversation will execute the conversion workflow by delegating to specialized subagents in sequence (api-writer → demo-writer → css-writer → etc).
`);
