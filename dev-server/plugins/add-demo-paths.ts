/**
 * Post-processing script for Custom Elements Manifest
 * Adds demo file paths to the manifest after CEM generation
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { glob } from 'glob';

interface Demo {
  name: string;
  url: string;
  path: string;
}

interface Declaration {
  customElement?: boolean;
  tagName?: string;
  demos?: Demo[];
}

interface Module {
  declarations: Declaration[];
}

interface Manifest {
  modules: Module[];
}

async function addDemoPathsToManifest(): Promise<void> {
  const manifestPath = join(process.cwd(), 'custom-elements.json');
  let manifest: Manifest;

  try {
    const manifestContent = await readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent) as Manifest;
  } catch (error) {
    console.error('Error reading custom-elements.json:', error);
    return;
  }

  // Find all demo HTML files
  const demoFiles = await glob('elements/*/demo/*.html', { cwd: process.cwd() });

  // Add demos to each component declaration
  for (const module of manifest.modules) {
    for (const declaration of module.declarations) {
      if (declaration.customElement && declaration.tagName) {
        const tagName = declaration.tagName;
        const componentDemoPath = `elements/${tagName}/demo/`;

        const demos: Demo[] = demoFiles
          .filter(file => file.startsWith(componentDemoPath))
          .map(file => {
            const demoName = file.replace(componentDemoPath, '').replace('.html', '');
            return {
              name: demoName,
              url: `/elements/${tagName}/demo/${demoName}`,
              path: file,
            };
          });

        if (demos.length > 0) {
          declaration.demos = demos;
        }
      }
    }
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Successfully added demo paths to custom-elements.json');
}

addDemoPathsToManifest();

