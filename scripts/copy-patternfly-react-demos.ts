#!/usr/bin/env tsx

/**
 * Copy React demo files from PatternFly React repository
 *
 * This script:
 * 1. Scans .cache/patternfly-react/packages/react-core/src/components/ for examples
 * 2. Copies .tsx demo files directly
 * 3. Converts .md files to individual .tsx files (like Panel)
 * 4. Generates demos.json manifest for routing
 *
 * IMPORTANT: PatternFly has TWO types of components:
 * - Components: patternfly-react/packages/react-core/src/components/ (Button, Card, etc.)
 * - Layouts: patternfly-react/packages/react-core/src/layouts/ (Gallery, Grid, Flex, etc.)
 *
 * Layout components are skipped naturally since we only scan /components/ directory.
 */

import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractInlineCodeFromMd, isBareJsx, transformBareJsx } from './lib/patternfly-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const cacheDir = join(projectRoot, '.cache/patternfly-react');

interface DemoMapping {
  source: string; // Original file name: "CardBasic.tsx"
  kebabCase: string; // URL-friendly name: "basic-cards"
  exportName: string; // React export name: "CardBasic"
}

interface ComponentDemos {
  sourceComponent: string; // Original component name: "Card"
  demos: Record<string, string>; // kebab-case → source file mapping
}

interface Manifest {
  version: string;
  generatedAt: string;
  clonePath: string;
  components: Record<string, ComponentDemos>;
}

/**
 * Convert PascalCase to kebab-case for URL routing
 * Examples:
 * - CardBasic → basic
 * - CardExpandableWithIcon → expandable-with-icon
 * - CheckboxDisabled → disabled
 * - CheckboxWithDescriptionBody → with-description-body
 *
 * @param pascalCase - PascalCase string to convert
 * @param componentName - Component name to remove from prefix
 * @returns kebab-case string
 */
function toKebabCase(pascalCase: string, componentName: string): string {
  // Remove component prefix (e.g., "Card" from "CardBasic")
  let withoutPrefix = pascalCase;
  if (pascalCase.startsWith(componentName)) {
    withoutPrefix = pascalCase.slice(componentName.length);
  }

  // If nothing left after removing prefix, use the component name
  // Example: "Card" component with "Card.tsx" demo → "cards"
  if (!withoutPrefix) {
    return `${componentName.toLowerCase()}s`;
  }

  // Convert to kebab-case
  const kebab = withoutPrefix
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');

  return kebab;
}

/**
 * Get the installed version from package.json
 *
 * @param packageName - Name of the package to get version for
 * @returns Package version string
 */
async function getPackageVersion(packageName: string): Promise<string> {
  try {
    const packageJsonPath = join(projectRoot, 'node_modules', packageName, 'package.json');
    const content = await readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.version;
  } catch (error) {
    console.error(`Failed to get version for ${packageName}:`, error);
    throw error;
  }
}

/**
 * Copy demo files for a component
 *
 * @param componentName - Name of the component
 * @param examplesDir - Source directory with examples
 * @param targetDir - Target directory to copy to
 * @returns Array of demo mappings
 */
async function copyComponentDemos(
  componentName: string,
  examplesDir: string,
  targetDir: string
): Promise<DemoMapping[]> {
  const mappings: DemoMapping[] = [];

  try {
    const files = await readdir(examplesDir);

    // Copy .tsx files directly
    const tsxFiles = files.filter(f => f.endsWith('.tsx') && !f.includes('.test.'));

    for (const file of tsxFiles) {
      const sourcePath = join(examplesDir, file);
      const targetPath = join(targetDir, file);

      // Read the file content
      const content = await readFile(sourcePath, 'utf-8');

      // Extract export name (assume it matches filename without extension)
      const exportName = file.replace('.tsx', '');

      // Check if it's bare JSX and transform if needed
      let transformedContent = content;
      if (isBareJsx(content)) {
        transformedContent = transformBareJsx(content, exportName);
        console.log(`      ↪ Transformed bare JSX in ${file}`);
      }

      // Write transformed content
      await writeFile(targetPath, transformedContent, 'utf-8');

      const kebabCase = toKebabCase(exportName, componentName);

      mappings.push({
        source: file,
        kebabCase,
        exportName,
      });
    }

    if (tsxFiles.length > 0) {
      console.log(`   ✓ Copied ${tsxFiles.length} demo(s) for ${componentName}`);
    }

    // Convert .md files to .tsx (like Panel)
    const mdFiles = files.filter(f => f.endsWith('.md'));

    for (const mdFile of mdFiles) {
      const mdPath = join(examplesDir, mdFile);
      const demos = extractInlineCodeFromMd(mdPath, componentName);

      for (const demo of demos) {
        const targetPath = join(targetDir, demo.filename);
        await writeFile(targetPath, demo.code, 'utf-8');

        const kebabCase = toKebabCase(demo.exportName, componentName);

        mappings.push({
          source: demo.filename,
          kebabCase,
          exportName: demo.exportName,
        });
      }

      if (demos.length > 0) {
        console.log(`   ✓ Extracted ${demos.length} inline demo(s) from ${mdFile} for ${componentName}`);
      }

      // Also copy associated .css files if present
      const cssFile = mdPath.replace('.md', '.css');
      if (existsSync(cssFile)) {
        await copyFile(cssFile, join(targetDir, basename(cssFile)));
      }
    }

    return mappings;
  } catch (error) {
    console.error(`   ✗ Error copying demos for ${componentName}:`, error);
    return [];
  }
}

/**
 * Main function with simple filesystem scanning
 */
async function main() {
  console.log('🚀 Copying React demos from PatternFly React cache...\\n');

  try {
    // Verify cache exists
    if (!existsSync(cacheDir)) {
      console.error('❌ Cache directory not found. Run: npm run cache');
      process.exit(1);
    }

    console.log(`📌 Using PatternFly React from cache\\n`);

    // Get version from package.json
    const version = await getPackageVersion('@patternfly/react-core');

    // Build manifest
    const manifest: Manifest = {
      version,
      generatedAt: new Date().toISOString(),
      clonePath: cacheDir,
      components: {},
    };

    // Scan components directory
    const componentsDir = join(cacheDir, 'packages/react-core/src/components');

    console.log('📋 Copying component demo files...');

    const componentDirs = await readdir(componentsDir);
    let totalDemos = 0;
    let componentsWithDemos = 0;

    for (const componentName of componentDirs) {
      const componentPath = join(componentsDir, componentName);
      const examplesDir = join(componentPath, 'examples');

      // Skip if no examples directory
      if (!existsSync(examplesDir)) {
        continue;
      }

      const targetDir = join(projectRoot, 'patternfly-react', componentName);
      await mkdir(targetDir, { recursive: true });

      const mappings = await copyComponentDemos(componentName, examplesDir, targetDir);

      if (mappings.length > 0) {
        const demos: Record<string, string> = {};
        for (const mapping of mappings) {
          demos[mapping.kebabCase] = mapping.source;
        }

        manifest.components[componentName] = {
          sourceComponent: componentName,
          demos,
        };

        componentsWithDemos++;
        totalDemos += mappings.length;
      }
    }

    // Write manifest
    const manifestPath = join(projectRoot, 'patternfly-react/demos.json');
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\\n`, 'utf-8');

    console.log();
    console.log(`\\n✓ Generated manifest: patternfly-react/demos.json`);

    // Summary
    console.log('\\n✅ Done!');
    console.log(`   Components with demos: ${componentsWithDemos}`);
    console.log(`   Total component demos copied: ${totalDemos}`);
    console.log(`   Location: ${join(projectRoot, 'patternfly-react')}`);
  } catch (error) {
    console.error('\\n❌ Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as copyReactDemos };
