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
  };
  demoDependencies: {
    patternfly?: string[];
  };
}

interface DependencyTree {
  components: Component[];
}

interface RankedComponent extends Component {
  blocks: number;
  impact: number;
}

// Read dependency tree
const treePath = resolve(process.cwd(), 'react-dependency-tree.json');
const tree: DependencyTree = JSON.parse(readFileSync(treePath, 'utf-8'));

// Filter to non-layout, non-styling (Content), non-converted components
const candidates = tree.components.filter(c =>
  c.type === 'component' && c.converted !== true && c.name !== 'Content'
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
  .map(c => ({
    ...c,
    blocks: blockedBy[c.name] || 0,
    impact: (blockedBy[c.name] || 0) / (c.totalDependencies + 1)
  }))
  .sort((a, b) => {
    // Primary sort: fewest dependencies first
    if (a.totalDependencies !== b.totalDependencies) {
      return a.totalDependencies - b.totalDependencies;
    }
    // Tiebreaker: most blocking components first
    return b.blocks - a.blocks;
  });

// Output top 6 candidates
console.log(JSON.stringify(ranked.slice(0, 6), null, 2));

