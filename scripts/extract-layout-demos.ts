#!/usr/bin/env tsx

/**
 * Extract React demo files from layout component Markdown documentation
 * 
 * This script:
 * 1. Scans patternfly-react/layouts/.md files
 * 2. Extracts JSX code blocks from markdown
 * 3. Generates .tsx files with proper React component wrappers
 * 4. Updates demos.json manifest with layout demo mappings
 * 
 * Layout components (Gallery, Grid, Flex, etc.) use Markdown documentation
 * with embedded JSX examples instead of separate .tsx files.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

interface ExtractedDemo {
  heading: string;       // Original heading: "With gutters"
  pascalCase: string;    // PascalCase: "WithGutters"
  filename: string;      // Filename: "GalleryWithGutters.tsx"
  kebabCase: string;     // URL routing: "with-gutters"
  imports: string[];     // Extracted import statements
  jsx: string;           // Cleaned JSX code
}

interface DemoMapping {
  source: string;      // Generated file name: "GalleryBasic.tsx"
  kebabCase: string;   // URL-friendly name: "basic"
  exportName: string;  // React export name: "GalleryBasic"
}

interface Manifest {
  version: string;
  generatedAt: string;
  clonePath: string;
  components: Record<string, {
    sourceComponent: string;
    demos: Record<string, string>;
  }>;
}

/**
 * Convert heading text to PascalCase
 * Example: "With gutters" → "WithGutters"
 */
function headingToPascalCase(heading: string): string {
  return heading
    .split(/\s+/)
    .map(word => {
      // Capitalize first letter, lowercase rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Convert heading text to kebab-case for URL routing
 * Example: "With gutters" → "with-gutters"
 * Example: "Adjusting min widths" → "adjusting-min-widths"
 */
function headingToKebabCase(heading: string): string {
  return heading
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
}

/**
 * Extract import statements from JSX code
 */
function extractImports(jsx: string): string[] {
  const importRegex = /import\s+.+?from\s+['"][^'"]+['"];?/g;
  const matches = jsx.match(importRegex) || [];
  
  // Deduplicate imports
  return Array.from(new Set(matches));
}

/**
 * Clean JSX code (remove imports, trailing semicolons, extra whitespace)
 */
function cleanJsx(jsx: string): string {
  return jsx
    // Remove import statements
    .replace(/import\s+.+?from\s+['"][^'"]+['"];?\n*/g, '')
    // Remove trailing semicolons
    .replace(/;(\s*)$/, '$1')
    .trim();
}

/**
 * Generate complete React component file content
 */
function generateComponent(
  exportName: string,
  imports: string[],
  jsx: string
): string {
  // Always include React import
  const reactImport = "import React from 'react';";
  
  // Clean up imports (remove duplicates, ensure proper formatting)
  const cleanImports = imports
    .map(imp => imp.replace(/;+$/, '').trim() + ';')
    .join('\n');
  
  return `${reactImport}
${cleanImports}

export const ${exportName}: React.FunctionComponent = () => (
  ${jsx}
);
`;
}

/**
 * Parse a markdown file and extract all demo code blocks
 */
async function parseMarkdownDemos(
  mdPath: string,
  componentName: string
): Promise<ExtractedDemo[]> {
  const content = await readFile(mdPath, 'utf-8');
  const demos: ExtractedDemo[] = [];
  
  // Regex to find headings followed by code blocks
  // Pattern: ### Heading Name \n\n ```js ... ```
  const demoRegex = /###\s+([^\n]+)\n+```(?:js|jsx)\n([\s\S]+?)```/g;
  
  let match;
  while ((match = demoRegex.exec(content)) !== null) {
    const heading = match[1].trim();
    const jsxCode = match[2].trim();
    
    // Extract imports from JSX
    const imports = extractImports(jsxCode);
    
    // Clean JSX (remove imports, trailing semicolons)
    const cleanedJsx = cleanJsx(jsxCode);
    
    // Generate names
    const pascalCase = headingToPascalCase(heading);
    const exportName = `${componentName}${pascalCase}`;
    const filename = `${exportName}.tsx`;
    const kebabCase = headingToKebabCase(heading);
    
    demos.push({
      heading,
      pascalCase,
      filename,
      kebabCase,
      imports,
      jsx: cleanedJsx,
    });
  }
  
  return demos;
}

/**
 * Generate .tsx file for a demo
 */
async function generateDemoFile(
  targetDir: string,
  demo: ExtractedDemo,
  componentName: string
): Promise<void> {
  const exportName = `${componentName}${demo.pascalCase}`;
  const content = generateComponent(exportName, demo.imports, demo.jsx);
  const filePath = join(targetDir, demo.filename);
  
  await writeFile(filePath, content, 'utf-8');
}

/**
 * Process a single layout component
 */
async function processLayoutComponent(
  layoutDir: string,
  componentName: string
): Promise<DemoMapping[]> {
  const mdFile = join(layoutDir, `${componentName}.md`);
  
  if (!existsSync(mdFile)) {
    console.log(`   ⚠ No .md file found for ${componentName}`);
    return [];
  }
  
  // Parse markdown and extract demos
  const demos = await parseMarkdownDemos(mdFile, componentName);
  
  if (demos.length === 0) {
    console.log(`   ⚠ No demos found in ${componentName}.md`);
    return [];
  }
  
  // Generate .tsx files
  const mappings: DemoMapping[] = [];
  
  for (const demo of demos) {
    await generateDemoFile(layoutDir, demo, componentName);
    
    mappings.push({
      source: demo.filename,
      kebabCase: demo.kebabCase,
      exportName: `${componentName}${demo.pascalCase}`,
    });
  }
  
  console.log(`   ✓ Generated ${demos.length} demo file(s) for ${componentName} (layout)`);
  return mappings;
}

/**
 * Update demos.json manifest with layout demos
 */
async function updateManifest(
  layoutDemos: Record<string, DemoMapping[]>
): Promise<void> {
  const manifestPath = join(projectRoot, 'patternfly-react/demos.json');
  
  // Read existing manifest
  let manifest: Manifest;
  if (existsSync(manifestPath)) {
    const content = await readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(content);
  } else {
    throw new Error('demos.json not found - run copy-patternfly-react-demos.ts first');
  }
  
  // Add layout demos to manifest
  for (const [componentName, mappings] of Object.entries(layoutDemos)) {
    const demos: Record<string, string> = {};
    
    for (const mapping of mappings) {
      demos[mapping.kebabCase] = mapping.source;
    }
    
    manifest.components[componentName] = {
      sourceComponent: componentName,
      demos,
    };
  }
  
  // Write updated manifest
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('\n✓ Updated manifest: patternfly-react/demos.json');
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Extracting layout demos from Markdown files...\n');
  
  try {
    const reactDir = join(projectRoot, 'patternfly-react');
    
    if (!existsSync(reactDir)) {
      console.log('⚠ No patternfly-react directory found - nothing to extract');
      return;
    }
    
    // Scan all component directories for .md files (layout components)
    const entries = await readdir(reactDir, { withFileTypes: true });
    const allComponents = entries
      .filter(entry => entry.isDirectory() && entry.name !== 'dist')
      .map(entry => entry.name)
      .sort();
    
    // Find which ones have .md files (layout components)
    const layoutComponents: string[] = [];
    for (const componentName of allComponents) {
      const componentDir = join(reactDir, componentName);
      const mdFile = join(componentDir, `${componentName}.md`);
      if (existsSync(mdFile)) {
        layoutComponents.push(componentName);
      }
    }
    
    if (layoutComponents.length === 0) {
      console.log('⚠ No layout components (.md files) found');
      return;
    }
    
    console.log(`📂 Found ${layoutComponents.length} layout component(s)\n`);
    
    // Process each layout component
    console.log('📝 Extracting demos from Markdown...');
    const layoutDemos: Record<string, DemoMapping[]> = {};
    let totalDemos = 0;
    
    for (const componentName of layoutComponents) {
      const componentDir = join(reactDir, componentName);
      const mappings = await processLayoutComponent(componentDir, componentName);
      
      if (mappings.length > 0) {
        layoutDemos[componentName] = mappings;
        totalDemos += mappings.length;
      }
    }
    
    // Update manifest
    if (Object.keys(layoutDemos).length > 0) {
      await updateManifest(layoutDemos);
    }
    
    // Summary
    console.log('\n✅ Done!');
    console.log(`   Layout components processed: ${Object.keys(layoutDemos).length}`);
    console.log(`   Total demos generated: ${totalDemos}`);
    console.log(`   Location: ${reactDir}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as extractLayoutDemos };

