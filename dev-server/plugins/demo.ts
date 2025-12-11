import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadCEManifest, findComponentDeclaration } from './cem.js';

/**
 * Demo information structure
 */
export interface DemoInfo {
  name: string;
  url: string;
  title: string;
}

/**
 * React demos manifest structure
 */
export interface ReactDemoManifest {
  version: string;
  generatedAt: string;
  clonePath: string;
  components: Record<string, {
    sourceComponent: string;
    demos: Record<string, string>; // kebab-case → PascalCase.tsx
  }>;
}

/**
 * Cached React manifest (loaded once)
 */
let reactManifestCache: ReactDemoManifest | null = null;

/**
 * Load React demos manifest
 */
export async function loadReactManifest(): Promise<ReactDemoManifest | null> {
  if (reactManifestCache) {
    return reactManifestCache;
  }
  
  try {
    const manifestPath = join(process.cwd(), 'patternfly-react/demos.json');
    const content = await readFile(manifestPath, 'utf-8');
    reactManifestCache = JSON.parse(content);
    return reactManifestCache;
  } catch (error) {
    console.warn('[demo] Could not load React demos manifest:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Get PascalCase component name from pfv6-{component} format
 * e.g., 'pfv6-card' → 'Card'
 */
export function getPascalCaseComponentName(kebabComponent: string): string {
  const withoutPrefix = kebabComponent.replace(/^pfv6-/, '');
  return withoutPrefix
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Formats a kebab-case demo name into a Title Case string
 */
export function formatDemoTitle(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get demos for a component from CEM (Lit demos)
 */
export async function getComponentDemos(componentName: string): Promise<DemoInfo[]> {
  try {
    const manifest = await loadCEManifest();
    if (!manifest) {
      return [];
    }

    const declaration = findComponentDeclaration(manifest, componentName);
    if (!declaration || !declaration.demos) {
      return [];
    }

    return declaration.demos
      .map((demo) => {
        // Extract demo name from URL: /elements/pfv6-card/demo/basic -> basic
        const urlParts = demo.url.split('/');
        const demoName = urlParts[urlParts.length - 1];
        
        return {
          url: demo.url,
          name: demoName || '',
          title: formatDemoTitle(demoName || ''),
        };
      })
      .filter((demo) => demo.name && demo.name !== 'index')
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.warn('[demo] Could not read CEM for demos:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Discover React demo files from manifest
 */
export async function getReactDemos(componentName: string): Promise<DemoInfo[]> {
  try {
    const manifest = await loadReactManifest();
    if (!manifest) {
      return [];
    }
    
    const pascalComponentName = getPascalCaseComponentName(componentName);
    const componentData = manifest.components[pascalComponentName];
    
    if (!componentData) {
      return [];
    }
    
    return Object.keys(componentData.demos)
      .map(kebabName => ({
        name: kebabName,
        title: formatDemoTitle(kebabName),
        url: `/elements/${componentName}/react/${kebabName}`,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.warn('[demo] Could not read React demos from manifest:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Check if a React demo exists in manifest
 */
export async function reactDemoExists(componentName: string, demoName: string): Promise<boolean> {
  try {
    const manifest = await loadReactManifest();
    if (!manifest) {
      return false;
    }
    
    const pascalComponentName = getPascalCaseComponentName(componentName);
    const componentData = manifest.components[pascalComponentName];
    
    if (!componentData) {
      return false;
    }
    
    return demoName in componentData.demos;
  } catch {
    return false;
  }
}

/**
 * Check if any React demos exist for a component
 */
export async function hasReactDemos(componentName: string): Promise<boolean> {
  const demos = await getReactDemos(componentName);
  return demos.length > 0;
}

/**
 * Check if a Lit demo file exists
 */
export async function litDemoExists(componentName: string, demoName: string): Promise<boolean> {
  try {
    const demoPath = join(process.cwd(), 'elements', componentName, 'demo', `${demoName}.html`);
    await readFile(demoPath, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

