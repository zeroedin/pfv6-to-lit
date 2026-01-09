#!/usr/bin/env node
/**
 * Find blocker components - identifies the next best component to convert
 * based on dependency count and impact on other components.
 *
 * Logic:
 * 1. Filter to unconverted regular components (not layout/styling)
 * 2. Exclude components with blocking dependencies
 * 3. Rank by: fewest blockers → most impact (tiebreaker)
 *
 * A dependency is BLOCKING if:
 *   - Found in component tree (it's a real component)
 *   - AND not converted (converted !== true)
 *   - AND pfv6-* doesn't exist on disk
 *   - AND not ignored (for demo deps: not layout/icon/self-reference)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/** Components excluded from conversion (styling components) */
const EXCLUDED = new Set([
  'Content', 'Title', 'Form', 'DescriptionList',
  'DescriptionListGroup', 'DescriptionListTerm', 'DescriptionListDescription',
]);

/** Demo dependencies that don't block (layouts, enums) */
const IGNORED_DEMO_DEPS = new Set([
  'ValidatedOptions',
  'Flex', 'FlexItem', 'Grid', 'GridItem', 'Stack', 'StackItem',
  'Bullseye', 'Level', 'Split', 'SplitItem', 'Gallery', 'GalleryItem',
]);

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Component {
  name: string;
  type: string;
  converted?: boolean;
  dependencies?: { patternfly?: string[]; relative?: string[] };
  demoDependencies?: { patternfly?: string[]; relative?: string[] };
}

interface RankedComponent {
  name: string;
  blockers: string[];
  blocks: number;
  impact: number;
  deps: { implementation: string[]; demo: string[] };
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/** Global component lookup map */
const componentMap = new Map<string, Component>();

/**
 * Check if pfv6-{name} directory exists on disk.
 * Converts PascalCase to kebab-case (e.g., HelperText → helper-text)
 * @param name - Component name in PascalCase
 * @returns true if the pfv6-* directory exists
 */
function pfv6Exists(name: string): boolean {
  const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return existsSync(resolve(process.cwd(), 'elements', `pfv6-${kebabName}`));
}

/**
 * Check if a dependency is satisfied (not blocking).
 * Satisfied if: not a component OR converted OR pfv6-* exists
 * @param name - Dependency name
 * @returns true if the dependency is satisfied
 */
function isSatisfied(name: string): boolean {
  const dep = componentMap.get(name);
  // Not in tree = type/utility = satisfied
  if (!dep) {
    return true;
  }
  // Marked converted = satisfied
  if (dep.converted) {
    return true;
  }
  // pfv6-* exists on disk = satisfied
  if (pfv6Exists(name)) {
    return true;
  }
  // Otherwise not satisfied
  return false;
}

/**
 * Check if a demo dependency should be ignored.
 * Ignored: layout components, icons, self-references
 * @param depName - Dependency name
 * @param componentName - The component being checked
 * @returns true if the dependency should be ignored
 */
function isIgnored(depName: string, componentName: string): boolean {
  // Layout components and enums
  if (IGNORED_DEMO_DEPS.has(depName)) {
    return true;
  }
  // Icon components (can be inlined as SVG)
  if (depName.endsWith('Icon')) {
    return true;
  }
  // Self-references
  if (depName === componentName) {
    return true;
  }
  if (depName === `${componentName}Main`) {
    return true;
  }
  if (depName === `${componentName}Utilities`) {
    return true;
  }
  if (depName === `${componentName}Icon`) {
    return true;
  }
  return false;
}

/**
 * Get all blocking dependencies for a component.
 * Returns array of dependency names that are blocking conversion.
 * @param component - The component to check
 * @returns Array of blocking dependency names
 */
function getBlockers(component: Component): string[] {
  const blockers: string[] = [];

  // Check relative (implementation) dependencies
  // These block if not satisfied
  for (const dep of component.dependencies?.relative || []) {
    if (!isSatisfied(dep)) {
      blockers.push(dep);
    }
  }

  // Check demo PatternFly dependencies
  // These block if not ignored AND not satisfied
  for (const dep of component.demoDependencies?.patternfly || []) {
    if (!isIgnored(dep, component.name) && !isSatisfied(dep)) {
      blockers.push(dep);
    }
  }

  // Return unique blockers
  return Array.from(new Set(blockers));
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

// Load component tree
const treePath = resolve(process.cwd(), 'react-dependency-tree.json');
const tree: { components: Component[] } = JSON.parse(readFileSync(treePath, 'utf-8'));

// Build lookup map
tree.components.forEach(c => componentMap.set(c.name, c));

// Find candidates: regular components that can be converted now
const candidates = tree.components.filter(c =>
  c.type === 'component'
    && !c.converted
    && !EXCLUDED.has(c.name)
    && getBlockers(c).length === 0
);

// Calculate how many components each one blocks (for impact scoring)
const blockCount: Record<string, number> = {};
tree.components.forEach(comp => {
  const allDeps = [
    ...(comp.dependencies?.patternfly || []),
    ...(comp.demoDependencies?.patternfly || []),
  ];
  allDeps.forEach(dep => {
    blockCount[dep] = (blockCount[dep] || 0) + 1;
  });
});

// Rank candidates
const ranked: RankedComponent[] = candidates
    .map(c => {
      const blockers = getBlockers(c);
      const blocks = blockCount[c.name] || 0;
      return {
        name: c.name,
        blockers,
        blocks,
        impact: blocks / (blockers.length + 1),
        deps: {
          implementation: c.dependencies?.patternfly || [],
          demo: c.demoDependencies?.patternfly || [],
        },
      };
    })
    .sort((a, b) => {
      // Primary: fewest blockers first
      if (a.blockers.length !== b.blockers.length) {
        return a.blockers.length - b.blockers.length;
      }
      // Tiebreaker: most blocking (highest impact) first
      return b.blocks - a.blocks;
    });

// ═══════════════════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

if (ranked.length === 0) {
  // eslint-disable-next-line no-console
  console.log(`## No Components Available to Convert

All components are either:
- Already converted
- Layout/styling components (excluded)
- Blocked by unconverted dependencies

🎉 If all regular components are converted, the project is complete!
`);
  process.exit(0);
}

const [top] = ranked;

// eslint-disable-next-line no-console
console.log(`## Next Component to Convert: ${top.name}

**Blockers**: ${top.blockers.length}${top.blockers.length > 0 ? ` (${top.blockers.join(', ')})` : ''}
**Blocks**: ${top.blocks} components
**Impact**: ${top.impact.toFixed(2)}

### Why This Component?
${top.blockers.length === 0 ?
        '- Zero blockers - ready to build immediately'
        : `- Only ${top.blockers.length} blockers - minimal dependencies`}
${top.blocks > 0 ?
        `- Blocks ${top.blocks} other components - high impact`
        : '- Leaf component (blocks no others)'}

### Dependencies:
**Implementation**: ${top.deps.implementation.length ? top.deps.implementation.join(', ') : 'None'}
**Demo**: ${top.deps.demo.length ? top.deps.demo.join(', ') : 'None'}

---

## Alternatives (Next 5):

${ranked.slice(1, 6).map((c, i) =>
  `${i + 1}. **${c.name}** - ${c.blockers.length} blockers, blocks ${c.blocks} (impact: ${c.impact.toFixed(2)})`
).join('\n') || 'None'}

---

## Top Blockers (by Impact):

${[...ranked]
    .sort((a, b) => b.blocks - a.blocks)
    .slice(0, 5)
    .map((c, i) => `${i + 1}. **${c.name}** - Blocks ${c.blocks} components`)
    .join('\n')}

---

## Next Steps

\`\`\`
Convert ${top.name} component
\`\`\`
`);
