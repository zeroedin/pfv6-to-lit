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
 * Check if all relative dependencies for a component are satisfied (converted).
 * A component can only be converted if all its relative dependencies are already converted.
 */
function hasSatisfiedDependencies(component: Component, allComponents: Component[]): boolean {
  const relativeDeps = component.dependencies?.relative || [];

  // Check if all relative dependencies are converted
  for (const depName of relativeDeps) {
    const dep = allComponents.find(c => c.name === depName);
    if (!dep || !dep.converted) {
      return false; // Dependency not converted - component is blocked!
    }
  }

  return true; // All dependencies satisfied
}

/**
 * Count only unconverted relative dependencies.
 * This gives us the actual number of blockers for a component.
 */
function getUnconvertedDependencyCount(component: Component, allComponents: Component[]): number {
  const relativeDeps = component.dependencies?.relative || [];

  return relativeDeps.filter(depName => {
    const dep = allComponents.find(c => c.name === depName);
    return !dep || !dep.converted;
  }).length;
}

// Read dependency tree
const treePath = resolve(process.cwd(), 'react-dependency-tree.json');
const tree: DependencyTree = JSON.parse(readFileSync(treePath, 'utf-8'));

// Filter to non-layout, non-styling (Content, Title), non-converted components
// AND components whose relative dependencies are all satisfied
const candidates = tree.components.filter(c =>
  c.type === 'component'
  && c.converted !== true
  && c.name !== 'Content'
  && c.name !== 'Title'
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

// Output top 6 candidates
console.log(JSON.stringify(ranked.slice(0, 6), null, 2));
