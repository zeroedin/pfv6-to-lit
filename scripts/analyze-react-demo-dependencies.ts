#!/usr/bin/env tsx
/**
 * Analyzes React demo files to extract PatternFly component dependencies
 * 
 * Purpose: Before creating Lit demos, identify all PatternFly components
 * that React demos use so we can plan which components need to be built first.
 * 
 * Usage: tsx scripts/analyze-react-demo-dependencies.ts [component-name]
 * Example: tsx scripts/analyze-react-demo-dependencies.ts Card
 */

import fs from 'fs/promises';
import path from 'path';

interface ComponentUsage {
  demoFile: string;
  components: string[];
}

interface AnalysisResult {
  componentName: string;
  totalDemos: number;
  allComponentsUsed: Set<string>;
  demoDetails: ComponentUsage[];
  missingComponents: string[];
}

/**
 * Extract PatternFly component imports from a React demo file
 */
async function extractPatternFlyComponents(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Match: import { Component1, Component2, ... } from '@patternfly/react-core';
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@patternfly\/react-core['"]/g;
  
  const components: string[] = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importList = match[1];
    // Split by comma, trim whitespace, filter out empty strings
    const importedComponents = importList
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    
    components.push(...importedComponents);
  }
  
  return components;
}

/**
 * Get list of implemented pfv6 components
 */
async function getImplementedComponents(): Promise<string[]> {
  const elementsDir = path.join(process.cwd(), 'elements');
  const dirs = await fs.readdir(elementsDir, { withFileTypes: true });
  
  return dirs
    .filter(d => d.isDirectory() && d.name.startsWith('pfv6-'))
    .map(d => {
      // Convert pfv6-card → Card, pfv6-card-title → CardTitle
      const componentName = d.name
        .replace('pfv6-', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      return componentName;
    });
}

/**
 * Analyze all React demos for a given component
 */
async function analyzeComponent(componentName: string): Promise<AnalysisResult> {
  const reactDemoDir = path.join(process.cwd(), 'patternfly-react', componentName);
  
  try {
    await fs.access(reactDemoDir);
  } catch {
    throw new Error(`React demo directory not found: ${reactDemoDir}`);
  }
  
  const files = await fs.readdir(reactDemoDir);
  const tsxFiles = files.filter(f => f.endsWith('.tsx'));
  
  const allComponentsUsed = new Set<string>();
  const demoDetails: ComponentUsage[] = [];
  
  for (const file of tsxFiles) {
    const filePath = path.join(reactDemoDir, file);
    const components = await extractPatternFlyComponents(filePath);
    
    components.forEach(c => allComponentsUsed.add(c));
    
    demoDetails.push({
      demoFile: file,
      components
    });
  }
  
  // Get implemented components
  const implemented = await getImplementedComponents();
  
  // Find missing components (excluding the component itself and its sub-components)
  const componentPrefix = componentName;
  const missingComponents = Array.from(allComponentsUsed)
    .filter(c => !c.startsWith(componentPrefix)) // Exclude Card, CardTitle, CardBody, etc.
    .filter(c => !implemented.includes(c))
    .sort();
  
  return {
    componentName,
    totalDemos: tsxFiles.length,
    allComponentsUsed,
    demoDetails,
    missingComponents
  };
}

/**
 * Generate markdown report
 */
function generateReport(result: AnalysisResult): string {
  const { componentName, totalDemos, allComponentsUsed, demoDetails, missingComponents } = result;
  
  let report = `# React Demo Dependency Analysis: ${componentName}\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n\n`;
  report += `---\n\n`;
  
  report += `## Summary\n\n`;
  report += `- **Total React Demos**: ${totalDemos}\n`;
  report += `- **Total PatternFly Components Used**: ${allComponentsUsed.size}\n`;
  report += `- **Missing Components** (need to build): ${missingComponents.length}\n\n`;
  
  if (missingComponents.length > 0) {
    report += `---\n\n`;
    report += `## 🚫 Missing Components\n\n`;
    report += `**These components must be built before achieving 100% parity:**\n\n`;
    
    // Group by how many demos use each component
    const usageCount = new Map<string, number>();
    missingComponents.forEach(comp => {
      const count = demoDetails.filter(d => d.components.includes(comp)).length;
      usageCount.set(comp, count);
    });
    
    // Sort by usage count (most used first)
    const sortedMissing = missingComponents.sort((a, b) => {
      return (usageCount.get(b) || 0) - (usageCount.get(a) || 0);
    });
    
    sortedMissing.forEach(comp => {
      const count = usageCount.get(comp) || 0;
      const demos = demoDetails
        .filter(d => d.components.includes(comp))
        .map(d => d.demoFile.replace('.tsx', ''))
        .map(name => `\`${name}\``)
        .join(', ');
      
      const kebabCase = comp
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, ''); // Remove leading dash
      report += `### \`<pfv6-${kebabCase}>\`\n`;
      report += `- **Used in**: ${count} demo${count !== 1 ? 's' : ''}\n`;
      report += `- **Demos**: ${demos}\n`;
      report += `- **React Component**: \`<${comp}>\`\n\n`;
    });
  } else {
    report += `---\n\n`;
    report += `## ✅ All Dependencies Met\n\n`;
    report += `All PatternFly components used in React demos are already implemented!\n\n`;
  }
  
  report += `---\n\n`;
  report += `## 📋 All Components Used\n\n`;
  
  const sortedAll = Array.from(allComponentsUsed).sort();
  sortedAll.forEach(comp => {
    const count = demoDetails.filter(d => d.components.includes(comp)).length;
    const isImplemented = !missingComponents.includes(comp);
    const status = isImplemented ? '✅' : '❌';
    report += `- ${status} \`${comp}\` (used in ${count} demo${count !== 1 ? 's' : ''})\n`;
  });
  
  report += `\n---\n\n`;
  report += `## 📁 Per-Demo Breakdown\n\n`;
  
  demoDetails
    .sort((a, b) => a.demoFile.localeCompare(b.demoFile))
    .forEach(({ demoFile, components }) => {
      const demoName = demoFile.replace('.tsx', '');
      report += `### \`${demoName}\`\n\n`;
      
      if (components.length === 0) {
        report += `- No PatternFly components imported\n\n`;
      } else {
        components.forEach(comp => {
          const isMissing = missingComponents.includes(comp);
          const status = isMissing ? '❌' : '✅';
          report += `- ${status} \`${comp}\`${isMissing ? ' **(MISSING)**' : ''}\n`;
        });
        report += `\n`;
      }
    });
  
  return report;
}

/**
 * Main execution
 */
async function main() {
  const componentName = process.argv[2];
  
  if (!componentName) {
    console.error('Usage: tsx scripts/analyze-react-demo-dependencies.ts <ComponentName>');
    console.error('Example: tsx scripts/analyze-react-demo-dependencies.ts Card');
    process.exit(1);
  }
  
  console.log(`Analyzing React demos for: ${componentName}\n`);
  
  try {
    const result = await analyzeComponent(componentName);
    const report = generateReport(result);
    
    // Write to file
    const outputPath = path.join(
      process.cwd(),
      'elements',
      `pfv6-${componentName.toLowerCase()}`,
      'REACT_DEPENDENCIES.md'
    );
    
    await fs.writeFile(outputPath, report, 'utf-8');
    
    console.log(`✅ Analysis complete!`);
    console.log(`📄 Report saved to: ${outputPath}\n`);
    
    // Print summary to console
    console.log('Summary:');
    console.log(`- Total React Demos: ${result.totalDemos}`);
    console.log(`- Total Components Used: ${result.allComponentsUsed.size}`);
    console.log(`- Missing Components: ${result.missingComponents.length}`);
    
    if (result.missingComponents.length > 0) {
      console.log('\n🚫 Missing Components:');
      result.missingComponents.forEach(comp => {
        console.log(`   - ${comp}`);
      });
    } else {
      console.log('\n✅ All dependencies met!');
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

