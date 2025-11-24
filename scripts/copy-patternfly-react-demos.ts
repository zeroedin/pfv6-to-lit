#!/usr/bin/env tsx

/**
 * Copy React demo files from PatternFly React repository
 * 
 * This script:
 * 1. Clones patternfly-react repo (cached by version)
 * 2. Discovers all component examples
 * 3. Copies .tsx files to /patternfly-react/{component}/ with ORIGINAL names
 * 4. Generates /patternfly-react/demos.json manifest with name mappings for routing
 * 
 * The manifest maps kebab-case URLs to actual file names:
 * {
 *   "Card": {
 *     "basic-cards": "CardBasic.tsx",
 *     "expandable-with-icon": "CardExpandableWithIcon.tsx"
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
  const clonePath = join('/tmp', `patternfly-react-${version}`);
  
  if (existsSync(clonePath)) {
    console.log(`✓ Using cached PatternFly React ${version} at ${clonePath}`);
    return clonePath;
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
 * Discover all components in PatternFly React
 */
async function discoverComponents(clonePath: string): Promise<string[]> {
  const componentsDir = join(clonePath, 'packages/react-core/src/components');
  
  if (!existsSync(componentsDir)) {
    throw new Error(`Components directory not found: ${componentsDir}`);
  }
  
  const entries = await readdir(componentsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

/**
 * Copy example files for a component
 */
async function copyComponentExamples(
  clonePath: string,
  componentName: string,
  targetDir: string
): Promise<DemoMapping[]> {
  const examplesDir = join(clonePath, 'packages/react-core/src/components', componentName, 'examples');
  
  if (!existsSync(examplesDir)) {
    console.log(`   ⚠ No examples directory for ${componentName}`);
    return [];
  }
  
  const files = await readdir(examplesDir);
  const tsxFiles = files.filter(f => f.endsWith('.tsx'));
  
  if (tsxFiles.length === 0) {
    console.log(`   ⚠ No .tsx files found for ${componentName}`);
    return [];
  }
  
  // Create target directory
  await mkdir(targetDir, { recursive: true });
  
  const mappings: DemoMapping[] = [];
  
  for (const file of tsxFiles) {
    const sourcePath = join(examplesDir, file);
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
  
  console.log(`   ✓ Copied ${tsxFiles.length} demo(s) for ${componentName}`);
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
    
    // Discover all components
    console.log('🔍 Discovering components...');
    const allComponents = await discoverComponents(clonePath);
    console.log(`   Found ${allComponents.length} components\n`);
    
    // Copy examples for each component
    console.log('📋 Copying demo files...');
    const componentMappings: Record<string, DemoMapping[]> = {};
    let totalDemos = 0;
    
    for (const componentName of allComponents) {
      const targetDir = join(projectRoot, 'patternfly-react', componentName); // Keep PascalCase
      const mappings = await copyComponentExamples(clonePath, componentName, targetDir);
      
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

