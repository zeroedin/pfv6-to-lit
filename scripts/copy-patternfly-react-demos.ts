#!/usr/bin/env tsx

/**
 * Copy React demo files from PatternFly React repository
 * 
 * This script:
 * 1. Clones patternfly-react repo (cached by version)
 * 2. Discovers all component examples (components + layouts)
 * 3. Copies .tsx files to /patternfly-react/{component}/ with ORIGINAL names
 * 4. Generates /patternfly-react/demos.json manifest with name mappings for routing
 * 
 * IMPORTANT: PatternFly has TWO types of components:
 * - Components: patternfly-react/packages/react-core/src/components/ (Button, Card, etc.)
 * - Layouts: patternfly-react/packages/react-core/src/layouts/ (Gallery, Grid, Flex, etc.)
 * 
 * The manifest maps kebab-case URLs to actual file names:
 * {
 *   "Card": {
 *     "basic-cards": "CardBasic.tsx",
 *     "expandable-with-icon": "CardExpandableWithIcon.tsx"
 *   },
 *   "Gallery": {
 *     "basic": "GalleryBasic.tsx"
 *   }
 * }
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

interface DemoMapping {
  source: string;      // Original file name: "CardBasic.tsx"
  kebabCase: string;   // URL-friendly name: "basic-cards"
  exportName: string;  // React export name: "CardBasic"
}

interface ComponentDemos {
  sourceComponent: string;  // Original component name: "Card"
  demos: Record<string, string>;  // kebab-case → source file mapping
}

interface Manifest {
  version: string;
  generatedAt: string;
  clonePath: string;
  components: Record<string, ComponentDemos>;
}

/**
 * Get the installed version of a package
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
 * Convert PascalCase to kebab-case for URL routing
 * Examples:
 * - CardBasic → basic
 * - CardExpandableWithIcon → expandable-with-icon
 * - CheckboxDisabled → disabled
 * - CheckboxWithDescriptionBody → with-description-body
 */
function toKebabCase(pascalCase: string, componentName: string): string {
  // Remove component prefix (e.g., "Card" from "CardBasic")
  let withoutPrefix = pascalCase;
  if (pascalCase.startsWith(componentName)) {
    withoutPrefix = pascalCase.slice(componentName.length);
  }
  
  // If nothing left after removing prefix, use the component name in plural
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
 * Clone or reuse PatternFly React repository
 */
async function ensurePatternFlyReactClone(version: string): Promise<string> {
  // Use project-local .cache directory instead of /tmp for reliability
  const cacheDir = join(projectRoot, '.cache');
  const clonePath = join(cacheDir, `patternfly-react-${version}`);
  
  if (existsSync(clonePath)) {
    console.log(`✓ Using cached PatternFly React ${version} at ${clonePath}`);
    return clonePath;
  }
  
  // Ensure cache directory exists
  if (!existsSync(cacheDir)) {
    await mkdir(cacheDir, { recursive: true });
  }
  
  console.log(`📦 Cloning PatternFly React v${version}...`);
  console.log(`   This may take a minute...`);
  
  try {
    // Clone with depth 1 for speed
    await execAsync(
      `git clone --depth 1 --branch v${version} https://github.com/patternfly/patternfly-react.git "${clonePath}"`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    );
    console.log(`✓ Cloned successfully to ${clonePath}`);
    return clonePath;
  } catch (error) {
    console.error(`❌ Failed to clone PatternFly React:`, error);
    throw error;
  }
}

/**
 * Discover all components in PatternFly React (components + layouts)
 */
async function discoverComponents(clonePath: string): Promise<{ name: string; type: 'component' | 'layout' }[]> {
  const result: { name: string; type: 'component' | 'layout' }[] = [];
  
  // Discover regular components
  const componentsDir = join(clonePath, 'packages/react-core/src/components');
  if (existsSync(componentsDir)) {
    const entries = await readdir(componentsDir, { withFileTypes: true });
    const components = entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({ name: entry.name, type: 'component' as const }));
    result.push(...components);
  }
  
  // Discover layout components
  const layoutsDir = join(clonePath, 'packages/react-core/src/layouts');
  if (existsSync(layoutsDir)) {
    const entries = await readdir(layoutsDir, { withFileTypes: true });
    const layouts = entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({ name: entry.name, type: 'layout' as const }));
    result.push(...layouts);
  }
  
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Copy example files for a component or layout
 */
async function copyComponentExamples(
  clonePath: string,
  componentName: string,
  componentType: 'component' | 'layout',
  targetDir: string
): Promise<DemoMapping[]> {
  // Determine examples directory based on type
  const baseDir = componentType === 'component' 
    ? join(clonePath, 'packages/react-core/src/components', componentName, 'examples')
    : join(clonePath, 'packages/react-core/src/layouts', componentName, 'examples');
  
  if (!existsSync(baseDir)) {
    console.log(`   ⚠ No examples directory for ${componentName} (${componentType})`);
    return [];
  }
  
  const files = await readdir(baseDir);
  
  // For layouts, look for .md files (different pattern)
  if (componentType === 'layout') {
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    if (mdFiles.length === 0) {
      console.log(`   ⚠ No .md files found for ${componentName} (layout)`);
      return [];
    }
    
    // Create target directory alongside regular components
    await mkdir(targetDir, { recursive: true });
    
    // Copy .md files (will be processed by extract-layout-demos.ts later)
    for (const file of mdFiles) {
      const sourcePath = join(baseDir, file);
      const targetPath = join(targetDir, file);
      await copyFile(sourcePath, targetPath);
    }
    
    // Also copy associated .css files if present
    const cssFiles = files.filter(f => f.endsWith('.css'));
    for (const file of cssFiles) {
      const sourcePath = join(baseDir, file);
      const targetPath = join(targetDir, file);
      await copyFile(sourcePath, targetPath);
    }
    
    console.log(`   ✓ Copied ${mdFiles.length} .md file(s) for ${componentName} (layout) - needs extraction`);
    return []; // Return empty - demos will be generated by extract-layout-demos.ts
  }
  
  // For regular components, copy .tsx files
  const tsxFiles = files.filter(f => f.endsWith('.tsx'));
  
  if (tsxFiles.length === 0) {
    console.log(`   ⚠ No .tsx files found for ${componentName} (component)`);
    return [];
  }
  
  // Create target directory
  await mkdir(targetDir, { recursive: true });
  
  const mappings: DemoMapping[] = [];
  
  for (const file of tsxFiles) {
    const sourcePath = join(baseDir, file);
    const targetPath = join(targetDir, file);
    
    // Copy file with original name
    await copyFile(sourcePath, targetPath);
    
    // Extract export name (assume it matches filename without extension)
    const exportName = file.replace('.tsx', '');
    const kebabCase = toKebabCase(exportName, componentName);
    
    mappings.push({
      source: file,
      kebabCase,
      exportName,
    });
  }
  
  console.log(`   ✓ Copied ${tsxFiles.length} demo(s) for ${componentName} (component)`);
  return mappings;
}

/**
 * Generate demos.json manifest
 */
async function generateManifest(
  version: string,
  clonePath: string,
  components: Record<string, DemoMapping[]>
): Promise<void> {
  const manifest: Manifest = {
    version,
    generatedAt: new Date().toISOString(),
    clonePath,
    components: {},
  };
  
  for (const [componentName, mappings] of Object.entries(components)) {
    const demos: Record<string, string> = {};
    
    for (const mapping of mappings) {
      demos[mapping.kebabCase] = mapping.source;
    }
    
    manifest.components[componentName] = {
      sourceComponent: componentName,
      demos,
    };
  }
  
  const manifestPath = join(projectRoot, 'patternfly-react/demos.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n✓ Generated manifest: patternfly-react/demos.json`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Copying React demos from PatternFly React...\n');
  
  try {
    // Get PatternFly React version
    const version = await getPackageVersion('@patternfly/react-core');
    console.log(`📌 PatternFly React version: ${version}\n`);
    
    // Ensure clone exists
    const clonePath = await ensurePatternFlyReactClone(version);
    console.log();
    
    // Discover all components and layouts
    console.log('🔍 Discovering components and layouts...');
    const allComponents = await discoverComponents(clonePath);
    const componentCount = allComponents.filter(c => c.type === 'component').length;
    const layoutCount = allComponents.filter(c => c.type === 'layout').length;
    console.log(`   Found ${componentCount} components + ${layoutCount} layouts (${allComponents.length} total)\n`);
    
    // Copy examples for each component/layout
    console.log('📋 Copying demo files...');
    const componentMappings: Record<string, DemoMapping[]> = {};
    let totalDemos = 0;
    
    for (const { name: componentName, type: componentType } of allComponents) {
      const targetDir = join(projectRoot, 'patternfly-react', componentName); // Keep PascalCase
      const mappings = await copyComponentExamples(clonePath, componentName, componentType, targetDir);
      
      if (mappings.length > 0) {
        componentMappings[componentName] = mappings;
        totalDemos += mappings.length;
      }
    }
    
    console.log();
    
    // Generate manifest
    await generateManifest(version, clonePath, componentMappings);
    
    // Summary
    const componentsWithDemos = Object.keys(componentMappings).length;
    console.log('\n✅ Done!');
    console.log(`   Components with demos: ${componentsWithDemos}`);
    console.log(`   Total demos copied: ${totalDemos}`);
    console.log(`   Location: ${join(projectRoot, 'patternfly-react')}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as copyReactDemos };

