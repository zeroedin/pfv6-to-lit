/**
 * Helper to dynamically discover component demos from the filesystem
 *
 * This eliminates hardcoded demo arrays in visual parity tests and ensures
 * tests automatically pick up new demos or renamed demos.
 */

import { readdirSync } from 'fs';
import { join } from 'path';

/**
 * Discovers all demo files for a given component
 *
 * @param componentName - Component name (e.g., 'card', 'checkbox', 'gallery')
 * @returns Array of demo names (without .html extension)
 *
 * @example
 * const demos = discoverDemos('card');
 * // Returns: ['basic', 'secondary', 'with-body-section-fills', ...]
 */
export function discoverDemos(componentName: string): string[] {
  const demoDir = join(process.cwd(), 'elements', `pfv6-${componentName}`, 'demo');

  try {
    const files = readdirSync(demoDir);

    // Filter to .html files, remove extension, sort alphabetically
    const demos = files
        .filter(file => file.endsWith('.html'))
        .map(file => file.replace('.html', ''))
        .sort();

    if (demos.length === 0) {
      throw new Error(`No demo files found in ${demoDir}`);
    }

    return demos;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to discover demos for ${componentName}: ${message}`);
  }
}

