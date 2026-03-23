/**
 * Helper to dynamically discover component demos from the filesystem
 *
 * This eliminates hardcoded demo arrays in visual parity tests and ensures
 * tests automatically pick up new demos or renamed demos.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface ReactDemoManifest {
  components: Record<string, {
    demos: Record<string, string>;
  }>;
}

let manifestCache: ReactDemoManifest | null = null;

function loadManifest(): ReactDemoManifest | null {
  if (manifestCache) return manifestCache;
  try {
    const content = readFileSync(
      join(process.cwd(), 'patternfly-react/demos.json'), 'utf-8'
    );
    manifestCache = JSON.parse(content);
    return manifestCache;
  } catch {
    return null;
  }
}

function toPascalCase(kebab: string): string {
  return kebab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

/**
 * Resolve the React manifest key for a Lit demo name.
 * Returns the exact key if it exists, otherwise matches by .tsx filename.
 * e.g., for Panel: 'basic' → finds 'basic-panel' (via PanelBasic.tsx match)
 */
export function resolveReactDemoName(componentName: string, litDemoName: string): string {
  const manifest = loadManifest();
  if (!manifest) return litDemoName;

  const pascalComponent = toPascalCase(componentName);
  const componentData = manifest.components[pascalComponent];
  if (!componentData) return litDemoName;

  if (litDemoName in componentData.demos) return litDemoName;

  const expectedFile = `${pascalComponent}${toPascalCase(litDemoName)}.tsx`;
  for (const [key, file] of Object.entries(componentData.demos)) {
    if (file === expectedFile) return key;
  }

  return litDemoName;
}

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

