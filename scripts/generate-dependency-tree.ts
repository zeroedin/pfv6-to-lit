#!/usr/bin/env node

/**
 * Generates a dependency tree JSON file for React components
 * This caches the dependency analysis for faster lookups
 * 
 * Run: npm run analyze-dependencies
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const REACT_COMPONENTS_PATH = join(rootDir, '.cache/patternfly-react/packages/react-core/src/components');
const REACT_LAYOUTS_PATH = join(rootDir, '.cache/patternfly-react/packages/react-core/src/layouts');
const ELEMENTS_PATH = join(rootDir, 'elements');

/**
 * Import item extracted from a file
 */
interface ImportItem {
  name: string;
  source: string;
}

/**
 * Import category type
 */
type ImportCategory = 'patternfly' | 'relative' | 'external';

/**
 * Dependency collections by category
 */
interface Dependencies {
  patternfly: string[];
  relative: string[];
}

/**
 * Component analysis result
 */
interface ComponentAnalysis {
  name: string;
  source: 'patternfly-react';
  type: 'component' | 'layout';
  converted: boolean;
  files: {
    implementation: string;
    demos: string[];
  };
  dependencies: Dependencies;
  demoDependencies: Dependencies;
  totalDependencies: number;
}

/**
 * Statistics summary
 */
interface Statistics {
  totalComponents: number;
  zeroDependencies: number;
  withDemoDependencies: number;
  averageDependencies: string;
}

/**
 * Complete dependency tree structure
 */
interface DependencyTree {
  generatedAt: string;
  sources: {
    patternflyReact: string;
  };
  components: ComponentAnalysis[];
  statistics?: Statistics;
}

/**
 * Convert absolute path to relative path from project root
 */
function toRelativePath(absolutePath: string): string {
  return relative(rootDir, absolutePath);
}

/**
 * Extract imports from a TypeScript file
 */
function extractImports(filePath: string): ImportItem[] {
  if (!existsSync(filePath)) return [];
  
  const content = readFileSync(filePath, 'utf-8');
  const imports: ImportItem[] = [];
  
  // Match import statements
  const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  
  while ((match = importRegex.exec(content)) !== null) {
    const namedImports = match[1] ? match[1].split(',').map(s => s.trim()) : [];
    const defaultImport = match[2] ? [match[2]] : [];
    const source = match[3];
    
    const allImports = [...namedImports, ...defaultImport]
      .filter((name): name is string => !!name && /^[A-Z]/.test(name)); // PascalCase (likely components)
    
    allImports.forEach(name => {
      imports.push({ name, source });
    });
  }
  
  return imports;
}

/**
 * Extract imports from markdown code blocks
 * Parses inline code examples in markdown files to find component dependencies
 */
function extractImportsFromMarkdown(mdPath: string): ImportItem[] {
  if (!existsSync(mdPath)) return [];

  const content = readFileSync(mdPath, 'utf-8');
  const imports: ImportItem[] = [];

  // Split by markdown headings (### )
  const sections = content.split(/^### /m).slice(1);

  for (const section of sections) {
    // Find inline code blocks (not file references)
    const codeMatch = section.match(/```(?:js|jsx|tsx)\n([\s\S]*?)```/);
    if (!codeMatch) continue;

    // Skip if it's a file reference
    const firstLine = codeMatch[1].trim().split('\n')[0];
    if (firstLine.includes('file=')) continue;

    const code = codeMatch[1].trim();

    // Extract imports from the code block
    const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(code)) !== null) {
      const namedImports = match[1] ? match[1].split(',').map(s => s.trim()) : [];
      const defaultImport = match[2] ? [match[2]] : [];
      const source = match[3];

      const allImports = [...namedImports, ...defaultImport]
        .filter((name): name is string => !!name && /^[A-Z]/.test(name)); // PascalCase (likely components)

      allImports.forEach(name => {
        imports.push({ name, source });
      });
    }
  }

  return imports;
}

/**
 * Categorize an import as PatternFly, relative, or other
 */
function categorizeImport(importItem: ImportItem): ImportCategory {
  const { source } = importItem;
  
  if (source.startsWith('@patternfly/react-core') || 
      source.startsWith('@patternfly/react-icons') ||
      source.startsWith('@patternfly/react-table')) {
    return 'patternfly';
  } else if (source.startsWith('../') || source.startsWith('./')) {
    return 'relative';
  }
  
  return 'external';
}

/**
 * Check if a component has been converted to LitElement
 */
function isComponentConverted(componentName: string): boolean {
  // Convert PascalCase to kebab-case
  const kebabName = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const litElementPath = join(ELEMENTS_PATH, `pfv6-${kebabName}`);
  return existsSync(litElementPath);
}

/**
 * Analyze a single component
 */
function analyzeComponent(
  componentName: string, 
  basePath: string,
  type: 'component' | 'layout' = 'component'
): ComponentAnalysis {
  const componentPath = join(basePath, componentName);
  const componentFile = join(componentPath, `${componentName}.tsx`);
  const examplesPath = join(componentPath, 'examples');
  
  const result: ComponentAnalysis = {
    name: componentName,
    source: 'patternfly-react',
    type,
    converted: isComponentConverted(componentName),
    files: {
      implementation: toRelativePath(componentFile),
      demos: []
    },
    dependencies: {
      patternfly: [],
      relative: []
    },
    demoDependencies: {
      patternfly: [],
      relative: []
    },
    totalDependencies: 0
  };
  
  // Analyze implementation file
  if (existsSync(componentFile)) {
    const imports = extractImports(componentFile);
    imports.forEach(imp => {
      const category = categorizeImport(imp);
      if (category !== 'external' && !result.dependencies[category].includes(imp.name)) {
        result.dependencies[category].push(imp.name);
      }
    });
  }
  
  // Analyze demo files (.tsx or .md)
  if (existsSync(examplesPath)) {
    const demoFiles = readdirSync(examplesPath).filter(f => f.endsWith('.tsx') && !f.includes('.test.'));
    const mdFiles = readdirSync(examplesPath).filter(f => f.endsWith('.md'));

    // Analyze .tsx demo files
    if (demoFiles.length > 0) {
      result.files.demos = demoFiles.map(f => toRelativePath(join(examplesPath, f)));

      demoFiles.forEach(demoFile => {
        const demoPath = join(examplesPath, demoFile);
        const imports = extractImports(demoPath);

        imports.forEach(imp => {
          const category = categorizeImport(imp);
          if (category !== 'external' && !result.demoDependencies[category].includes(imp.name)) {
            result.demoDependencies[category].push(imp.name);
          }
        });
      });
    }

    // Analyze .md demo files (if no .tsx files exist)
    if (demoFiles.length === 0 && mdFiles.length > 0) {
      result.files.demos = mdFiles.map(f => toRelativePath(join(examplesPath, f)));

      mdFiles.forEach(mdFile => {
        const mdPath = join(examplesPath, mdFile);
        const imports = extractImportsFromMarkdown(mdPath);

        imports.forEach(imp => {
          const category = categorizeImport(imp);
          if (category !== 'external' && !result.demoDependencies[category].includes(imp.name)) {
            result.demoDependencies[category].push(imp.name);
          }
        });
      });
    }
  }
  
  // Calculate totals
  result.totalDependencies = 
    result.dependencies.patternfly.length + 
    result.dependencies.relative.length +
    result.demoDependencies.patternfly.length +
    result.demoDependencies.relative.length;
  
  return result;
}

/**
 * Main execution
 */
function main(): void {
  console.log('🔍 Analyzing React component dependencies...\n');
  
  const dependencyTree: DependencyTree = {
    generatedAt: new Date().toISOString(),
    sources: {
      patternflyReact: toRelativePath(REACT_COMPONENTS_PATH)
    },
    components: []
  };
  
  // Analyze PatternFly React Core components
  if (existsSync(REACT_COMPONENTS_PATH)) {
    console.log('📦 Analyzing @patternfly/react-core components...');
    const reactComponents = readdirSync(REACT_COMPONENTS_PATH).filter(dir => {
      const fullPath = join(REACT_COMPONENTS_PATH, dir);
      return existsSync(join(fullPath, `${dir}.tsx`));
    });
    
    reactComponents.forEach(comp => {
      console.log(`  - ${comp}`);
      const analysis = analyzeComponent(comp, REACT_COMPONENTS_PATH, 'component');
      dependencyTree.components.push(analysis);
    });
    console.log(`✅ Analyzed ${reactComponents.length} PatternFly React components\n`);
  } else {
    console.error('❌ PatternFly React components not found!');
    console.error('   Please run: npm run patternfly-cache');
    process.exit(1);
  }
  
  // Analyze PatternFly React Layout components
  if (existsSync(REACT_LAYOUTS_PATH)) {
    console.log('📦 Analyzing @patternfly/react-core layouts...');
    const reactLayouts = readdirSync(REACT_LAYOUTS_PATH).filter(dir => {
      const fullPath = join(REACT_LAYOUTS_PATH, dir);
      return existsSync(join(fullPath, `${dir}.tsx`));
    });
    
    reactLayouts.forEach(layout => {
      console.log(`  - ${layout}`);
      const analysis = analyzeComponent(layout, REACT_LAYOUTS_PATH, 'layout');
      dependencyTree.components.push(analysis);
    });
    console.log(`✅ Analyzed ${reactLayouts.length} PatternFly React layouts\n`);
  } else {
    console.warn('⚠️  PatternFly React layouts not found (optional)');
  }
  
  // Calculate statistics
  const componentCount = dependencyTree.components.filter(c => c.type === 'component').length;
  const layoutCount = dependencyTree.components.filter(c => c.type === 'layout').length;
  const convertedCount = dependencyTree.components.filter(c => c.converted).length;
  const stats: Statistics = {
    totalComponents: dependencyTree.components.length,
    zeroDependencies: dependencyTree.components.filter(c => c.totalDependencies === 0).length,
    withDemoDependencies: dependencyTree.components.filter(c => 
      c.demoDependencies.patternfly.length > 0 ||
      c.demoDependencies.relative.length > 0
    ).length,
    averageDependencies: (
      dependencyTree.components.reduce((sum, c) => sum + c.totalDependencies, 0) / 
      dependencyTree.components.length
    ).toFixed(2)
  };
  
  dependencyTree.statistics = stats;
  
  // Write to file
  const outputPath = join(rootDir, 'react-dependency-tree.json');
  writeFileSync(outputPath, JSON.stringify(dependencyTree, null, 2));
  
  console.log('📊 Statistics:');
  console.log(`   Total: ${stats.totalComponents} (${componentCount} components + ${layoutCount} layouts)`);
  console.log(`   Converted: ${convertedCount}`);
  console.log(`   Zero dependencies: ${stats.zeroDependencies}`);
  console.log(`   With demo dependencies: ${stats.withDemoDependencies}`);
  console.log(`   Average dependencies: ${stats.averageDependencies}`);
  console.log(`\n✅ Dependency tree written to: react-dependency-tree.json`);
  
  // Show zero-dependency components
  const zeroDeps = dependencyTree.components.filter(c => c.totalDependencies === 0);
  if (zeroDeps.length > 0) {
    console.log('\n🎯 Components with zero dependencies:');
    zeroDeps.forEach(c => {
      const status = c.converted ? '✅' : '⬜';
      console.log(`   ${status} ${c.name} (${c.source})`);
    });
  }
  
  // Show converted components
  const converted = dependencyTree.components.filter(c => c.converted);
  if (converted.length > 0) {
    console.log('\n✅ Converted components:');
    converted.forEach(c => {
      console.log(`   - ${c.name}`);
    });
  }
}

main();

