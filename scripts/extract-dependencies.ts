#!/usr/bin/env node

/**
 * Extract component dependencies from PatternFly React.
 *
 * JSON version of extract-dependencies.ts for better performance
 * and simpler parsing in downstream scripts.
 *
 * Output: dependencies.json
 */

import fs from 'fs';
import path from 'path';
import {
  shouldIgnoreComponent,
  extractImports,
  type ImportsBySource,
} from './lib/patternfly-utils.js';

const REACT_COMPONENTS_DIR = '.cache/patternfly-react/packages/react-core/src/components';
const ELEMENTS_DIR = 'elements';

// ============================================================================
// Interfaces
// ============================================================================

interface DemoAnalysis {
  file: string;
  dependencies: string[];
  demoIcons: string[];
}

interface ComponentAnalysis {
  name: string;
  subComponents: string[];
  implementation: {
    dependencies: string[];
    icons: string[];
  };
  demos: DemoAnalysis[];
  completed: boolean;
}

interface DependenciesJSON {
  generated: string;
  components: ComponentAnalysis[];
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Convert PascalCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
}

/**
 * Check if a component has been converted (pfv6-{component} directory exists)
 */
function isComponentCompleted(componentName: string): boolean {
  const kebabName = toKebabCase(componentName);
  const componentDir = path.join(ELEMENTS_DIR, `pfv6-${kebabName}`);
  return fs.existsSync(componentDir);
}

/**
 * Build a Set of all actual React component files
 */
function getAllActualComponents(): Set<string> {
  const components = new Set<string>();

  if (!fs.existsSync(REACT_COMPONENTS_DIR)) {
    console.error('React components directory not found');
    return components;
  }

  const componentDirs = fs.readdirSync(REACT_COMPONENTS_DIR)
      .filter(name => {
        const fullPath = path.join(REACT_COMPONENTS_DIR, name);
        return fs.statSync(fullPath).isDirectory();
      });

  for (const componentDir of componentDirs) {
    const fullPath = path.join(REACT_COMPONENTS_DIR, componentDir);
    const files = fs.readdirSync(fullPath);

    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (file !== 'index.ts' && file !== 'index.tsx') {
          const componentName = file.replace(/\.(tsx|ts)$/, '');
          if (!componentName.endsWith('Context')) {
            components.add(componentName);
          }
        }
      }
    }
  }

  return components;
}

const ALL_ACTUAL_COMPONENTS = getAllActualComponents();

function isActualComponent(name: string): boolean {
  return ALL_ACTUAL_COMPONENTS.has(name);
}

function isIcon(name: string): boolean {
  return name.endsWith('Icon');
}

/**
 * Get all component directories that have a main component file
 */
function getAllComponents(): string[] {
  if (!fs.existsSync(REACT_COMPONENTS_DIR)) {
    console.error('React components directory not found. Run: npm run cache');
    process.exit(1);
  }

  return fs.readdirSync(REACT_COMPONENTS_DIR)
      .filter(name => {
        const fullPath = path.join(REACT_COMPONENTS_DIR, name);
        if (!fs.statSync(fullPath).isDirectory()) {
          return false;
        }

        const mainFile = path.join(fullPath, `${name}.tsx`);
        const altFile = path.join(fullPath, `${name}.ts`);
        return fs.existsSync(mainFile) || fs.existsSync(altFile);
      })
      .sort();
}

/**
 * Find all sub-component files in a component directory
 */
function findSubComponentFiles(
  componentDir: string, componentName: string
): { name: string; path: string }[] {
  if (!fs.existsSync(componentDir)) {
    return [];
  }

  const files = fs.readdirSync(componentDir);

  return files
      .filter(f => {
        if (!f.endsWith('.tsx') && !f.endsWith('.ts')) {
          return false;
        }
        if (f === `${componentName}.tsx` || f === `${componentName}.ts`) {
          return false;
        }
        if (f.endsWith('Context.tsx') || f.endsWith('Context.ts')) {
          return false;
        }
        if (f === 'index.ts' || f === 'index.tsx') {
          return false;
        }

        const name = f.replace(/\.tsx?$/, '');
        return isActualComponent(name);
      })
      .map(f => ({
        name: f.replace(/\.tsx?$/, ''),
        path: path.join(componentDir, f),
      }));
}

/**
 * Extract imports from a file with isActualComponent filter
 */
function extractImportsFromFile(filePath: string): ImportsBySource {
  return extractImports(filePath, {
    separateBySource: true,
    filterFn: isActualComponent,
  }) as ImportsBySource;
}

// ============================================================================
// Component Analysis
// ============================================================================

/**
 * Analyze a single demo file
 */
function analyzeDemoFile(
  demoFilePath: string,
  componentName: string,
  subComponentNames: Set<string>
): DemoAnalysis {
  const imports = extractImportsFromFile(demoFilePath);

  // Combine patternfly and relative imports
  const allImports = [
    ...imports.patternfly,
    ...imports.relative.filter(r => !isIcon(r)),
  ];

  // Get icons from both sources
  const allIcons = [
    ...imports.icons,
    ...imports.relative.filter(r => isIcon(r)),
  ];

  // Filter out: self, sub-components, icons, layout/styling components
  const dependencies = allImports.filter(imp =>
    imp !== componentName
    && !subComponentNames.has(imp)
    && !isIcon(imp)
    && !shouldIgnoreComponent(imp)
    && isActualComponent(imp)
  );

  // Demo icons (no filtering needed except deduplication)
  const demoIcons = [...new Set(allIcons)].sort();

  return {
    file: path.basename(demoFilePath),
    dependencies: [...new Set(dependencies)].sort(),
    demoIcons,
  };
}

/**
 * Analyze a component and all its demos
 */
function analyzeComponent(componentName: string): ComponentAnalysis | null {
  const componentDir = path.join(REACT_COMPONENTS_DIR, componentName);

  if (!fs.existsSync(componentDir)) {
    console.error(`Component ${componentName} not found`);
    return null;
  }

  // Find main implementation file
  const mainFile = fs.existsSync(path.join(componentDir, `${componentName}.tsx`)) ?
    path.join(componentDir, `${componentName}.tsx`)
    : path.join(componentDir, `${componentName}.ts`);

  if (!fs.existsSync(mainFile)) {
    console.error(`Main file not found for ${componentName}`);
    return null;
  }

  // Find all sub-component files
  const subComponentFiles = findSubComponentFiles(componentDir, componentName);
  const subComponentNames = new Set(subComponentFiles.map(sc => sc.name));

  // Extract imports from main implementation file
  const implImports = extractImportsFromFile(mainFile);

  // Extract imports from all sub-component files
  const subComponentImports = subComponentFiles.map(sc => extractImportsFromFile(sc.path));

  // Combine main + sub-component imports
  const allImplementationImports: ImportsBySource[] = [implImports, ...subComponentImports];

  // Implementation dependencies (PatternFly components, not icons, not self)
  const implementationDeps = [...new Set(
    allImplementationImports.flatMap(imp => [
      ...imp.patternfly.filter(i => !isIcon(i) && i !== componentName && !subComponentNames.has(i)),
      ...imp.relative.filter(i => !isIcon(i) && i !== componentName && !subComponentNames.has(i)),
    ])
  )].filter(dep => !shouldIgnoreComponent(dep) && isActualComponent(dep)).sort();

  // Implementation icons
  const implementationIcons = [...new Set(
    allImplementationImports.flatMap(imp => [
      ...imp.icons,
      ...imp.relative.filter(r => isIcon(r)),
    ])
  )].sort();

  // Find and analyze demo files
  const examplesDir = path.join(componentDir, 'examples');
  const demos: DemoAnalysis[] = [];

  if (fs.existsSync(examplesDir)) {
    const demoFiles = fs.readdirSync(examplesDir)
        .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
        .sort();

    for (const demoFile of demoFiles) {
      const demoPath = path.join(examplesDir, demoFile);
      const demoAnalysis = analyzeDemoFile(demoPath, componentName, subComponentNames);
      demos.push(demoAnalysis);
    }
  }

  return {
    name: componentName,
    subComponents: [...subComponentNames].sort(),
    implementation: {
      dependencies: implementationDeps,
      icons: implementationIcons,
    },
    demos,
    completed: isComponentCompleted(componentName),
  };
}

// ============================================================================
// Main Execution
// ============================================================================

const components = getAllComponents();
console.error(`Found ${components.length} components`);

// Filter out layout and styling components
const componentsToAnalyze = components.filter(name => !shouldIgnoreComponent(name));
console.error(`Analyzing ${componentsToAnalyze.length} components (excluding ${components.length - componentsToAnalyze.length} layout/styling components)`);

const results: ComponentAnalysis[] = [];

for (const componentName of componentsToAnalyze) {
  console.error(`Analyzing ${componentName}...`);
  const analysis = analyzeComponent(componentName);
  if (analysis) {
    results.push(analysis);
  }
}

// Output as JSON
const output: DependenciesJSON = {
  generated: new Date().toISOString(),
  components: results,
};

console.log(JSON.stringify(output, null, 2));

// Summary statistics
const totalDemos = results.reduce((sum, c) => sum + c.demos.length, 0);
const demosWithDeps = results.reduce((sum, c) =>
  sum + c.demos.filter(d => d.dependencies.length > 0).length, 0);
const completedCount = results.filter(c => c.completed).length;

console.error(`\nSummary:`);
console.error(`  Components: ${results.length}`);
console.error(`  Completed: ${completedCount}`);
console.error(`  Total demos: ${totalDemos}`);
console.error(`  Demos with dependencies: ${demosWithDeps}`);
