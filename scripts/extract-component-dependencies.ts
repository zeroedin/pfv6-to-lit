#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  shouldIgnoreComponent,
  extractImports,
  type ImportsBySource,
} from './lib/patternfly-utils.js';

const __filename = fileURLToPath(import.meta.url);

const REACT_COMPONENTS_DIR = '.cache/patternfly-react/packages/react-core/src/components';
const ELEMENTS_DIR = 'elements';

interface ComponentFiles {
  implementation: string;
  demos: string[];
}

interface SubComponentFile {
  name: string;
  path: string;
}

interface Dependencies {
  Implementation: string[] | null;
  Icons: string[] | null;
  Demo: string[] | null;
  DemoIcons: string[] | null;
}

interface ComponentAnalysis {
  name: string;
  subComponents: string[] | null;
  dependencies: Dependencies;
  converted: boolean;
}

// Convert PascalCase to kebab-case
function toKebabCase(str: string): string {
  return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
}

// Check if a component has been converted (pfv6-{component} directory exists)
function isComponentConverted(componentName: string): boolean {
  const kebabName = toKebabCase(componentName);
  const componentDir = path.join(ELEMENTS_DIR, `pfv6-${kebabName}`);
  return fs.existsSync(componentDir);
}

// Build a Set of all actual React component files
function getAllActualComponents(): Set<string> {
  const components = new Set<string>();

  if (!fs.existsSync(REACT_COMPONENTS_DIR)) {
    console.error('React components directory not found');
    return components;
  }

  // Get all component directories
  const componentDirs = fs.readdirSync(REACT_COMPONENTS_DIR)
      .filter(name => {
        const fullPath = path.join(REACT_COMPONENTS_DIR, name);
        return fs.statSync(fullPath).isDirectory();
      });

  // For each component directory, find all .tsx/.ts files
  for (const componentDir of componentDirs) {
    const fullPath = path.join(REACT_COMPONENTS_DIR, componentDir);
    const files = fs.readdirSync(fullPath);

    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        // Exclude index.ts files and add the component name
        if (file !== 'index.ts' && file !== 'index.tsx') {
          const componentName = file.replace(/\.(tsx|ts)$/, '');
          // Exclude Context files
          if (!componentName.endsWith('Context')) {
            components.add(componentName);
          }
        }
      }
    }
  }

  return components;
}

// Get the Set of all actual components once at startup
const ALL_ACTUAL_COMPONENTS = getAllActualComponents();

function isActualComponent(name: string): boolean {
  // Check if this is an actual component file in the React codebase
  return ALL_ACTUAL_COMPONENTS.has(name);
}

function isIcon(name: string): boolean {
  return name.endsWith('Icon');
}

/**
 * Extract imports from file with isActualComponent filter
 *
 * @param filePath - Path to the file to extract imports from
 * @param options - Options for extraction
 * @returns Array of import names or object with imports by source
 */
function extractImportsFromFile(
  filePath: string,
  options: { separateBySource?: boolean } = {}
): string[] | ImportsBySource {
  return extractImports(filePath, {
    separateBySource: options.separateBySource,
    filterFn: isActualComponent,
  });
}

function findComponentFiles(componentName: string): ComponentFiles | null {
  const componentDir = path.join(REACT_COMPONENTS_DIR, componentName);

  if (!fs.existsSync(componentDir)) {
    return null;
  }

  const files = fs.readdirSync(componentDir);

  // Find main component file
  const mainFile = files.find(f =>
    f === `${componentName}.tsx`
    || f === `${componentName}.ts`
  );

  if (!mainFile) {
    return null;
  }

  // Find demo files
  const examplesDir = path.join(componentDir, 'examples');
  let demoFiles: string[] = [];

  if (fs.existsSync(examplesDir)) {
    demoFiles = fs.readdirSync(examplesDir)
        .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
        .map(f => path.join(examplesDir, f));
  }

  return {
    implementation: path.join(componentDir, mainFile),
    demos: demoFiles,
  };
}

function findSubComponents(componentDir: string, componentName: string): string[] {
  if (!fs.existsSync(componentDir)) {
    return [];
  }

  const files = fs.readdirSync(componentDir);

  // Sub-components typically start with the component name
  // e.g., MenuToggle has MenuToggleCheckbox, MenuToggleAction
  const subComponents = files
      .filter(f => (f.endsWith('.tsx') || f.endsWith('.ts'))
                && f !== `${componentName}.tsx`
                && f !== `${componentName}.ts`
                && f !== `${componentName}Context.tsx`
                && f !== `${componentName}Context.ts`
                && f.startsWith(componentName))
      .map(f => f.replace(/\.tsx?$/, ''))
      .filter(name => isActualComponent(name));

  return subComponents;
}

function findAllSubComponentFiles(componentDir: string, componentName: string): SubComponentFile[] {
  if (!fs.existsSync(componentDir)) {
    return [];
  }

  const files = fs.readdirSync(componentDir);

  // Find all component files (excluding main, context, examples, deprecated, index)
  const subComponentFiles = files
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

  return subComponentFiles;
}

function categorizeImports(imports, componentName, subComponents) {
  const categories = {
    SubComponents: [],
    Implementation: [],
    Icons: [],
  };

  const subComponentSet = new Set(subComponents);

  for (const imp of imports) {
    if (imp === componentName) {
      continue;
    } // Skip self-import

    if (isIcon(imp)) {
      categories.Icons.push(imp);
    } else if (subComponentSet.has(imp)) {
      categories.SubComponents.push(imp);
    } else if (isActualComponent(imp) && !shouldIgnoreComponent(imp)) {
      categories.Implementation.push(imp);
    }
  }

  return categories;
}

function categorizeDemoImports(imports: string[]): { Demo: string[]; DemoIcons: string[] } {
  const categories = {
    Demo: [] as string[],
    DemoIcons: [] as string[],
  };

  for (const imp of imports) {
    if (isIcon(imp)) {
      categories.DemoIcons.push(imp);
    } else if (isActualComponent(imp)) {
      categories.Demo.push(imp);
    }
  }

  return categories;
}

function analyzeComponent(componentName: string): ComponentAnalysis | null {
  const files = findComponentFiles(componentName);

  if (!files) {
    console.error(`Component ${componentName} not found`);
    return null;
  }

  const componentDir = path.join(REACT_COMPONENTS_DIR, componentName);

  // Extract imports from main implementation file
  const implImports = extractImportsFromFile(
    files.implementation,
    { separateBySource: true }
  ) as ImportsBySource;

  // Find all sub-component files in the directory (file system based)
  const allSubComponentFiles = findAllSubComponentFiles(componentDir, componentName);
  const subComponentNames = allSubComponentFiles.map(sc => sc.name);

  // Extract imports from all sub-component files
  const subComponentImports = allSubComponentFiles.map(sc =>
    extractImportsFromFile(sc.path, { separateBySource: true }) as ImportsBySource
  );

  // Combine main + sub-component imports for implementation and icons
  const allImplementationImports: ImportsBySource[] = [
    implImports,
    ...subComponentImports,
  ];

  // Implementation dependencies are PatternFly components (not icons) from main + sub-components
  // Includes both @patternfly/react-core imports AND relative imports (e.g., '../Button')
  const implementation = [...new Set(
    allImplementationImports.flatMap(imp => [
      ...imp.patternfly.filter(i => !isIcon(i) && i !== componentName),
      ...imp.relative.filter(i => !isIcon(i) && i !== componentName),
    ])
  )];

  // Icons from main + sub-components (both from @patternfly/react-icons and relative)
  const allIcons = allImplementationImports.flatMap(imp => [
    ...imp.icons,
    ...imp.relative.filter(r => isIcon(r)),
  ]);
  const icons = [...new Set(allIcons)];

  // Extract imports from demo files
  const allDemoImports = files.demos.map(demoFile =>
    extractImportsFromFile(demoFile, { separateBySource: true }) as ImportsBySource
  );

  // Combine all demo imports (both @patternfly/react-core and relative imports)
  const demoComponents = [...new Set(allDemoImports.flatMap(d => [
    ...d.patternfly,
    ...d.relative.filter(r => !isIcon(r)),
  ]))];
  const demoIcons = [...new Set(allDemoImports.flatMap(d => d.icons))];

  // Demo dependencies exclude: self, sub-components, icons, and components already in implementation
  const subComponentSet = new Set(subComponentNames);
  const implementationSet = new Set(implementation);

  const demo = demoComponents.filter(imp =>
    imp !== componentName
    && !isIcon(imp)
    && !subComponentSet.has(imp)
    && !implementationSet.has(imp)
  );

  return {
    name: componentName,
    subComponents: subComponentNames.length > 0 ? subComponentNames : null,
    dependencies: {
      Implementation: implementation.length > 0 ? implementation : null,
      Icons: icons.length > 0 ? icons : null,
      Demo: demo.length > 0 ? demo : null,
      DemoIcons: demoIcons.length > 0 ? demoIcons : null,
    },
    converted: isComponentConverted(componentName),
  };
}

function getAllComponents(): string[] {
  if (!fs.existsSync(REACT_COMPONENTS_DIR)) {
    console.error('React components directory not found. Run: npm run patternfly-cache');
    process.exit(1);
  }

  return fs.readdirSync(REACT_COMPONENTS_DIR)
      .filter(name => {
        const fullPath = path.join(REACT_COMPONENTS_DIR, name);
        if (!fs.statSync(fullPath).isDirectory()) {
          return false;
        }

        // Only include directories that have a main component file
        const mainFile = path.join(fullPath, `${name}.tsx`);
        const altFile = path.join(fullPath, `${name}.ts`);
        return fs.existsSync(mainFile) || fs.existsSync(altFile);
      })
      .sort();
}

function formatYAML(data: ComponentAnalysis[]): string {
  let yaml = 'Components:\n\n';

  for (const component of data) {
    yaml += `  - ${component.name}:\n`;

    // SubComponents (outside of Dependencies)
    if (component.subComponents) {
      yaml += `    SubComponents:\n`;
      component.subComponents.forEach(sub => {
        yaml += `      - ${sub}\n`;
      });
    } else {
      yaml += `    SubComponents:\n`;
    }

    // Dependencies section
    yaml += `    Dependencies:\n`;
    const deps = component.dependencies;

    // Implementation
    if (deps.Implementation) {
      yaml += `      Implementation:\n`;
      deps.Implementation.forEach(impl => {
        yaml += `        - ${impl}\n`;
      });
    } else {
      yaml += `      Implementation:\n`;
    }

    // Icons
    if (deps.Icons) {
      yaml += `      Icons:\n`;
      deps.Icons.forEach(icon => {
        yaml += `        - ${icon}\n`;
      });
    } else {
      yaml += `      Icons:\n`;
    }

    // Demo
    if (deps.Demo) {
      yaml += `      Demo:\n`;
      deps.Demo.forEach(demo => {
        yaml += `        - ${demo}\n`;
      });
    } else {
      yaml += `      Demo:\n`;
    }

    // DemoIcons
    if (deps.DemoIcons) {
      yaml += `      DemoIcons:\n`;
      deps.DemoIcons.forEach(icon => {
        yaml += `        - ${icon}\n`;
      });
    } else {
      yaml += `      DemoIcons:\n`;
    }

    // Converted field
    yaml += `    Converted: ${component.converted}\n`;

    yaml += '\n';
  }

  return yaml;
}

// Main execution
const components = getAllComponents();
console.error(`Found ${components.length} components`);

// Filter out layout and styling components - they won't be converted
const componentsToConvert = components.filter(name => !shouldIgnoreComponent(name));
console.error(`Analyzing ${componentsToConvert.length} components (excluding ${components.length - componentsToConvert.length} layout/styling components)`);

const results: ComponentAnalysis[] = [];

for (const componentName of componentsToConvert) {
  console.error(`Analyzing ${componentName}...`);
  const analysis = analyzeComponent(componentName);
  if (analysis) {
    results.push(analysis);
  }
}

const yaml = formatYAML(results);
console.log(yaml);

console.error(`\nAnalyzed ${results.length} components`);
console.error(`Output written to stdout`);
