import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Custom Elements Manifest structure (partial types we use)
 */
export interface CEMDemo {
  url: string;
  source?: {
    href: string;
  };
}

export interface CEMDeclaration {
  customElement?: boolean;
  tagName?: string;
  demos?: CEMDemo[];
}

export interface CEMModule {
  declarations?: CEMDeclaration[];
}

export interface CEManifest {
  modules?: CEMModule[];
}

/**
 * Load and parse the Custom Elements Manifest
 */
export async function loadCEManifest(): Promise<CEManifest | null> {
  try {
    const manifestPath = join(process.cwd(), 'custom-elements.json');
    const manifestContent = await readFile(manifestPath, 'utf-8');
    return JSON.parse(manifestContent);
  } catch (error) {
    console.warn(
      '[cem] Could not load custom-elements.json:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Find a component declaration in the CEM by tag name
 * @param manifest - The Custom Elements Manifest
 * @param tagName - The tag name to search for
 */
export function findComponentDeclaration(
  manifest: CEManifest,
  tagName: string
): CEMDeclaration | null {
  for (const module of manifest.modules || []) {
    for (const declaration of module.declarations || []) {
      if (declaration.customElement && declaration.tagName === tagName) {
        return declaration;
      }
    }
  }
  return null;
}

