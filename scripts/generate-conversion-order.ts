#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { shouldIgnoreComponent } from './lib/patternfly-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ComponentDependencies {
  implementation: string[];
  icons: string[];
  demo: string[];
  demoIcons: string[];
}

interface Component {
  name: string;
  subComponents: string[];
  dependencies: ComponentDependencies;
  converted: boolean;
}

interface ConversionOrder {
  list1: string[];
  list2: string[];
  list3: string[];
  list4: string[];
  list5: string[];
  list6: string[];
  list7: string[];
  list8: string[];
  list9: string[];
}

function parseYAML(yamlContent: string): Component[] {
  const lines = yamlContent.split('\n');
  const components: Component[] = [];
  let currentComponent: Component | null = null;
  let currentSection: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Component name
    const componentMatch = line.match(/^  - (\w+):$/);
    if (componentMatch) {
      currentComponent = {
        name: componentMatch[1],
        subComponents: [],
        dependencies: {
          implementation: [],
          icons: [],
          demo: [],
          demoIcons: []
        },
        converted: false
      };
      components.push(currentComponent);
      currentSection = null;
      continue;
    }

    // Section headers
    if (line.match(/^    SubComponents:$/)) {
      currentSection = 'subComponents';
      continue;
    }
    if (line.match(/^      Implementation:$/)) {
      currentSection = 'implementation';
      continue;
    }
    if (line.match(/^      Icons:$/)) {
      currentSection = 'icons';
      continue;
    }
    if (line.match(/^      Demo:$/)) {
      currentSection = 'demo';
      continue;
    }
    if (line.match(/^      DemoIcons:$/)) {
      currentSection = 'demoIcons';
      continue;
    }

    // Converted field
    const convertedMatch = line.match(/^    Converted:\s*(true|false)$/);
    if (convertedMatch && currentComponent) {
      currentComponent.converted = convertedMatch[1] === 'true';
      currentSection = null;
      continue;
    }

    // Items in sections
    if (currentSection === 'subComponents' && line.match(/^      - (.+)$/)) {
      currentComponent.subComponents.push(line.match(/^      - (.+)$/)[1]);
    }
    if (currentSection === 'implementation' && line.match(/^        - (.+)$/)) {
      currentComponent.dependencies.implementation.push(line.match(/^        - (.+)$/)[1]);
    }
    if (currentSection === 'icons' && line.match(/^        - (.+)$/)) {
      currentComponent.dependencies.icons.push(line.match(/^        - (.+)$/)[1]);
    }
    if (currentSection === 'demo' && line.match(/^        - (.+)$/)) {
      currentComponent.dependencies.demo.push(line.match(/^        - (.+)$/)[1]);
    }
    if (currentSection === 'demoIcons' && line.match(/^        - (.+)$/)) {
      currentComponent.dependencies.demoIcons.push(line.match(/^        - (.+)$/)[1]);
    }
  }

  return components;
}

function hasNoDependencies(component: Component): boolean {
  // Filter out layout and styling components
  const implDeps = component.dependencies.implementation.filter(d => !shouldIgnoreComponent(d));
  const demoDeps = component.dependencies.demo.filter(d => !shouldIgnoreComponent(d));

  return implDeps.length === 0 && demoDeps.length === 0;
}

function getAllDependencies(component: Component): string[] {
  // Combine implementation and demo dependencies (ignore icons)
  // Filter out layout and styling components (they're just CSS)
  const allDeps = [
    ...component.dependencies.implementation,
    ...component.dependencies.demo
  ];

  return allDeps.filter(dep => !shouldIgnoreComponent(dep));
}

function getSeparatedDependencies(component: Component): { implementation: string[]; demo: string[] } {
  // Get dependencies separated by source
  const implDeps = component.dependencies.implementation.filter(d => !shouldIgnoreComponent(d));
  const demoDeps = component.dependencies.demo.filter(d => !shouldIgnoreComponent(d));

  return {
    implementation: implDeps,
    demo: demoDeps
  };
}

function canBeConverted(component: Component, convertedSet: Set<string>, subComponentToParent: Map<string, string>): boolean {
  const deps = getAllDependencies(component);

  // Helper to check if a component is available (either directly or via parent)
  function isComponentAvailable(componentName: string): boolean {
    // Check if component itself is converted
    if (convertedSet.has(componentName)) {
      return true;
    }

    // Check if it's a sub-component whose parent is converted
    const parent = subComponentToParent.get(componentName);
    if (parent && convertedSet.has(parent)) {
      return true;
    }

    return false;
  }

  // All dependencies must be available
  return deps.every(dep => isComponentAvailable(dep));
}

function generateConversionOrder(components: Component[]): ConversionOrder {
  const list1: string[] = [];
  const list2: string[] = [];
  const list3: string[] = ['Button', 'Tooltip']; // Manual circular dependency break #1
  const list4: string[] = [];
  const list5: string[] = ['MenuToggle', 'Dropdown']; // Manual circular dependency break #2
  const list6: string[] = [];
  const list7: string[] = ['Form', 'TextArea']; // Manual circular dependency break #3
  const list8: string[] = [];
  const list9: string[] = ['Modal', 'Wizard']; // Manual circular dependency break #4

  const componentMap = new Map<string, Component>();
  components.forEach(c => componentMap.set(c.name, c));

  // Build a map of sub-component -> parent component
  const subComponentToParent = new Map<string, string>();
  components.forEach(component => {
    if (component.subComponents && component.subComponents.length > 0) {
      component.subComponents.forEach(subComp => {
        subComponentToParent.set(subComp, component.name);
      });
    }
  });

  // Helper to check if a component is available (either directly or via parent)
  function isComponentAvailable(componentName: string, convertedSet: Set<string>): boolean {
    // Check if component itself is converted
    if (convertedSet.has(componentName)) {
      return true;
    }

    // Check if it's a sub-component whose parent is converted
    const parent = subComponentToParent.get(componentName);
    if (parent && convertedSet.has(parent)) {
      return true;
    }

    return false;
  }

  // Manual circular dependency breaks
  const manualBreaks = new Set(['Button', 'Tooltip', 'MenuToggle', 'Dropdown', 'Form', 'TextArea', 'Modal', 'Wizard']);

  // List 1: Components with no implementation or demo dependencies
  console.warn('\n=== Building List 1: Components with no dependencies ===');
  for (const component of components) {
    // Exclude manual circular dependency breaks
    if (manualBreaks.has(component.name)) {
      continue;
    }
    if (hasNoDependencies(component)) {
      list1.push(component.name);
      console.warn(`  ✓ ${component.name}`);
    }
  }
  console.warn(`List 1 complete: ${list1.length} components\n`);

  // List 2: Iteratively add components whose dependencies are satisfied
  console.warn('=== Building List 2: Components with satisfied dependencies ===');
  const converted = new Set(list1);
  let remaining = components.filter(c => !converted.has(c.name) && !manualBreaks.has(c.name));

  let iterations = 0;
  let addedInIteration = true;

  while (addedInIteration && remaining.length > 0) {
    iterations++;
    addedInIteration = false;
    console.warn(`\n--- Iteration ${iterations} ---`);

    for (let i = remaining.length - 1; i >= 0; i--) {
      const component = remaining[i];

      if (canBeConverted(component, converted, subComponentToParent)) {
        list2.push(component.name);
        converted.add(component.name);
        remaining.splice(i, 1);
        addedInIteration = true;

        const deps = getAllDependencies(component);
        console.warn(`  ✓ ${component.name} (deps: ${deps.join(', ') || 'none'})`);
      }
    }

    if (!addedInIteration) {
      console.warn('  No more components can be added');
    } else {
      console.warn(`  Added ${list2.length} components so far`);
    }
  }
  console.warn(`\nList 2 complete: ${list2.length} components after ${iterations} iterations\n`);

  // List 3: Manual circular dependency break (Button ↔ Tooltip)
  console.warn('=== List 3: Breaking circular dependency ===');
  console.warn('  ⚡ Button + Tooltip (convert together to break cycle)');
  list3.forEach(name => converted.add(name));
  console.warn(`List 3 complete: ${list3.length} components\n`);

  // List 4: Iteratively add components whose dependencies are now satisfied (after Button + Tooltip)
  console.warn('=== Building List 4: Components unblocked by List 3 ===');
  iterations = 0;
  addedInIteration = true;

  while (addedInIteration && remaining.length > 0) {
    iterations++;
    addedInIteration = false;
    console.warn(`\n--- Iteration ${iterations} ---`);

    for (let i = remaining.length - 1; i >= 0; i--) {
      const component = remaining[i];

      if (canBeConverted(component, converted, subComponentToParent)) {
        list4.push(component.name);
        converted.add(component.name);
        remaining.splice(i, 1);
        addedInIteration = true;

        const deps = getAllDependencies(component);
        console.warn(`  ✓ ${component.name} (deps: ${deps.join(', ') || 'none'})`);
      }
    }

    if (!addedInIteration) {
      console.warn('  No more components can be added');
    } else {
      console.warn(`  Added ${list4.length} components so far`);
    }
  }
  console.warn(`\nList 4 complete: ${list4.length} components after ${iterations} iterations\n`);

  // List 5: Manual circular dependency break #2 (MenuToggle ↔ Dropdown)
  console.warn('=== List 5: Breaking circular dependency #2 ===');
  console.warn('  ⚡ MenuToggle + Dropdown (convert together to break cycle)');
  list5.forEach(name => converted.add(name));
  console.warn(`List 5 complete: ${list5.length} components\n`);

  // List 6: Iteratively add components whose dependencies are now satisfied (after MenuToggle + Dropdown)
  console.warn('=== Building List 6: Components unblocked by List 5 ===');
  iterations = 0;
  addedInIteration = true;

  while (addedInIteration && remaining.length > 0) {
    iterations++;
    addedInIteration = false;
    console.warn(`\n--- Iteration ${iterations} ---`);

    for (let i = remaining.length - 1; i >= 0; i--) {
      const component = remaining[i];

      if (canBeConverted(component, converted, subComponentToParent)) {
        list6.push(component.name);
        converted.add(component.name);
        remaining.splice(i, 1);
        addedInIteration = true;

        const deps = getAllDependencies(component);
        console.warn(`  ✓ ${component.name} (deps: ${deps.join(', ') || 'none'})`);
      }
    }

    if (!addedInIteration) {
      console.warn('  No more components can be added');
    } else {
      console.warn(`  Added ${list6.length} components so far`);
    }
  }
  console.warn(`\nList 6 complete: ${list6.length} components after ${iterations} iterations\n`);

  // List 7: Manual circular dependency break #3 (Form ↔ TextArea)
  console.warn('=== List 7: Breaking circular dependency #3 ===');
  console.warn('  ⚡ Form + TextArea (convert together to break cycle)');
  list7.forEach(name => converted.add(name));
  console.warn(`List 7 complete: ${list7.length} components\n`);

  // List 8: Iteratively add components whose dependencies are now satisfied (after Form + TextArea)
  console.warn('=== Building List 8: Components unblocked by List 7 ===');
  iterations = 0;
  addedInIteration = true;

  while (addedInIteration && remaining.length > 0) {
    iterations++;
    addedInIteration = false;
    console.warn(`\n--- Iteration ${iterations} ---`);

    for (let i = remaining.length - 1; i >= 0; i--) {
      const component = remaining[i];

      if (canBeConverted(component, converted, subComponentToParent)) {
        list8.push(component.name);
        converted.add(component.name);
        remaining.splice(i, 1);
        addedInIteration = true;

        const deps = getAllDependencies(component);
        console.warn(`  ✓ ${component.name} (deps: ${deps.join(', ') || 'none'})`);
      }
    }

    if (!addedInIteration) {
      console.warn('  No more components can be added');
    } else {
      console.warn(`  Added ${list8.length} components so far`);
    }
  }
  console.warn(`\nList 8 complete: ${list8.length} components after ${iterations} iterations\n`);

  // Helper to remove sub-components if their parent is also in the list
  function filterOutSubComponentsWithParent(blockers) {
    const parentSet = new Set(blockers);
    return blockers.filter(blocker => {
      // Check if this blocker is a sub-component
      const parent = subComponentToParent.get(blocker);
      // If it has a parent and that parent is also in the blocker list, exclude it
      if (parent && parentSet.has(parent)) {
        return false; // Exclude sub-component when parent is present
      }
      return true;
    });
  }

  // List 9: Manual circular dependency break #4 (Modal ↔ Wizard)
  console.warn('=== List 9: Breaking circular dependency #4 ===');
  console.warn('  ⚡ Modal + Wizard (convert together to break cycle)');
  console.warn(`List 9 complete: ${list9.length} components\n`);

  return { list1, list2, list3, list4, list5, list6, list7, list8, list9 };
}

function formatYAML(result: ConversionOrder, componentMap: Map<string, Component>): string {
  let yaml = '';

  const outputList = (listName: string, components: string[], comment?: string) => {
    yaml += `${listName}:\n`;
    if (comment) {
      yaml += `  ${comment}\n`;
    }
    if (components.length > 0) {
      components.forEach(name => {
        const component = componentMap.get(name);
        const completed = component ? component.converted : false;
        yaml += `  - ${name}:\n`;
        yaml += `      completed: ${completed}\n`;
      });
    } else {
      yaml += `  []\n`;
    }
    yaml += '\n';
  };

  outputList('List1_NoDependencies', result.list1);
  outputList('List2_DependenciesSatisfied', result.list2);
  outputList('List3_BreakCircularDependency', result.list3, '# Button and Tooltip must be converted together to break circular dependency');
  outputList('List4_UnblockedByList3', result.list4);
  outputList('List5_BreakCircularDependency2', result.list5, '# MenuToggle and Dropdown must be converted together to break circular dependency');
  outputList('List6_UnblockedByList5', result.list6);
  outputList('List7_BreakCircularDependency3', result.list7, '# Form and TextArea must be converted together to break circular dependency');
  outputList('List8_UnblockedByList7', result.list8);
  outputList('List9_BreakCircularDependency4', result.list9, '# Modal and Wizard must be converted together to break circular dependency');

  return yaml;
}

// Main execution
const yamlContent = fs.readFileSync('component-dependencies.yaml', 'utf-8');
const allComponents = parseYAML(yamlContent);

// Filter out layout and styling components - they won't be converted
// Keep ALL components (converted and unconverted) to show completion status
const components = allComponents.filter(c => !shouldIgnoreComponent(c.name));

const convertedCount = components.filter(c => c.converted).length;
const layoutStylingCount = allComponents.filter(c => shouldIgnoreComponent(c.name)).length;

console.warn(`\nParsed ${allComponents.length} components from YAML`);
console.warn(`Processing ${components.length} components`);
console.warn(`  Converted: ${convertedCount}`);
console.warn(`  Remaining: ${components.length - convertedCount}`);
console.warn(`  Excluded (layout/styling): ${layoutStylingCount}\n`);
console.warn('=' .repeat(60));

// Build component map for lookup
const componentMap = new Map<string, Component>();
components.forEach(c => componentMap.set(c.name, c));

const result = generateConversionOrder(components);

console.warn('=' .repeat(60));
console.warn('\n=== Summary ===');
console.warn(`List 1 (No Dependencies):           ${result.list1.length} components`);
console.warn(`List 2 (Dependencies Satisfied):    ${result.list2.length} components`);
console.warn(`List 3 (Break Circular Dep #1):     ${result.list3.length} components`);
console.warn(`List 4 (Unblocked by List 3):       ${result.list4.length} components`);
console.warn(`List 5 (Break Circular Dep #2):     ${result.list5.length} components`);
console.warn(`List 6 (Unblocked by List 5):       ${result.list6.length} components`);
console.warn(`List 7 (Break Circular Dep #3):     ${result.list7.length} components`);
console.warn(`List 8 (Unblocked by List 7):       ${result.list8.length} components`);
console.warn(`List 9 (Break Circular Dep #4):     ${result.list9.length} components`);
console.warn(`Total:                              ${result.list1.length + result.list2.length + result.list3.length + result.list4.length + result.list5.length + result.list6.length + result.list7.length + result.list8.length + result.list9.length} components\n`);

const yaml = formatYAML(result, componentMap);
console.log(yaml);
