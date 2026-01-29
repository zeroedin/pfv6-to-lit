#!/usr/bin/env node

/**
 * Generates an ordered task list for component conversion.
 *
 * JSON version - reads dependencies.json, outputs tasks.json
 *
 * Tasks represent units of work that can be completed once dependencies are satisfied.
 * Task types:
 *   - ready: Component + all demos (no blocking deps)
 *   - blocked: Component + all demos (has implementation deps)
 *   - partial: Component + some demos (some demos blocked)
 *   - component: Just component, no demos (all demos blocked)
 *   - demo: Previously blocked demo(s) now unblocked
 *
 * Input: dependencies.json
 * Output: tasks.json
 */

import fs from 'fs';
import path from 'path';
import { shouldIgnoreComponent } from './lib/patternfly-utils.js';

const ELEMENTS_DIR = 'elements';

// ============================================================================
// Interfaces
// ============================================================================

interface BlockedDemoInfo {
  file: string;
  blockedBy: string[];
}

interface UnblockedDemoInfo {
  file: string;
  unblockedBy: string[];
}

interface Task {
  task: number;
  type: 'ready' | 'blocked' | 'component' | 'demo' | 'partial' | 'completed';
  component: string;
  demos: string[];
  blocked?: BlockedDemoInfo[];
  unblocked?: UnblockedDemoInfo[];
  blockers?: string[];
  demoBlockers?: string[];
  url?: string;
}

interface Component {
  name: string;
  subComponents: string[];
  implementationDeps: string[];
}

interface DemoInfo {
  file: string;
  dependencies: string[];
}

interface BlockedDemo {
  component: string;
  file: string;
  dependencies: string[];
}

// JSON input interfaces
interface DemoAnalysisJSON {
  file: string;
  dependencies: string[];
  demoIcons: string[];
}

interface ComponentAnalysisJSON {
  name: string;
  subComponents: string[];
  implementation: {
    dependencies: string[];
    icons: string[];
  };
  demos: DemoAnalysisJSON[];
  completed: boolean;
}

interface DependenciesJSON {
  generated: string;
  components: ComponentAnalysisJSON[];
}

// JSON output interfaces
interface TasksJSON {
  generated: string;
  statistics: {
    total: number;
    completed: number;
    ready: number;
    blocked: number;
    partial: number;
    component: number;
    demo: number;
  };
  tasks: Task[];
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
 * Convert React demo filename to HTML demo filename
 * e.g., "AccordionBordered.tsx" -> "bordered.html"
 *       "ButtonBasic.tsx" -> "basic.html"
 */
function reactDemoToHtmlFile(reactDemo: string, componentName: string): string {
  // Remove file extension
  const baseName = reactDemo.replace(/\.tsx?$/, '');
  // Remove component name prefix (e.g., "AccordionBordered" -> "Bordered")
  const withoutPrefix = baseName.startsWith(componentName)
    ? baseName.slice(componentName.length)
    : baseName;
  // Convert to kebab-case and add .html
  return toKebabCase(withoutPrefix) + '.html';
}

/**
 * Check if a task is completed based on filesystem state
 */
function isTaskCompleted(task: Task): boolean {
  const kebabName = toKebabCase(task.component);
  const componentDir = path.join(ELEMENTS_DIR, `pfv6-${kebabName}`);

  if (!fs.existsSync(componentDir)) {
    return false;
  }

  if (task.type === 'demo') {
    // For demo tasks, check each demo file exists
    const demoDir = path.join(componentDir, 'demo');
    if (!fs.existsSync(demoDir)) {
      return false;
    }
    // Check if all demos in this task have corresponding HTML files
    return task.demos.every(demo => {
      const htmlFile = reactDemoToHtmlFile(demo, task.component);
      return fs.existsSync(path.join(demoDir, htmlFile));
    });
  }

  // For 'all', 'partial', and 'component' tasks, directory existence is enough
  return true;
}

/**
 * Parse dependencies.json (JSON format - much simpler!)
 */
function parseDependencies(jsonPath: string): {
  components: Component[];
  demoDeps: Map<string, DemoInfo[]>;
} {
  const data: DependenciesJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const components: Component[] = data.components.map(c => ({
    name: c.name,
    subComponents: c.subComponents,
    implementationDeps: c.implementation.dependencies,
  }));

  const demoDeps = new Map<string, DemoInfo[]>();
  for (const c of data.components) {
    demoDeps.set(c.name, c.demos.map(d => ({
      file: d.file,
      dependencies: d.dependencies,
    })));
  }

  return { components, demoDeps };
}

// Build subcomponent to parent mapping
function buildSubComponentMap(components: Component[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const component of components) {
    for (const sub of component.subComponents) {
      map.set(sub, component.name);
    }
  }
  return map;
}

// Get implementation dependencies (normalized to parent components)
function getImplementationDeps(
  component: Component,
  subComponentToParent: Map<string, string>
): string[] {
  return component.implementationDeps
      .map(dep => subComponentToParent.get(dep) ?? dep)
      .filter(dep => dep !== component.name && !shouldIgnoreComponent(dep));
}

// Generate ordered task list
function generateTasks(
  components: Component[],
  demoDeps: Map<string, DemoInfo[]>
): Task[] {
  const tasks: Task[] = [];
  const blockedDemos: BlockedDemo[] = [];

  // Build maps
  const componentMap = new Map<string, Component>();
  components.forEach(c => componentMap.set(c.name, c));

  const subComponentToParent = buildSubComponentMap(components);

  // Track which components have been "created" (a task exists that creates the component)
  const createdComponents = new Set<string>();

  // Track remaining components (not yet processed)
  const remaining = new Set(components.map(c => c.name));

  // Track components ready for processing (impl deps satisfied) but waiting for demo deps
  const pendingForDemos = new Set<string>();

  // Track components that had ALL demos blocked (maps component name to original blockers)
  // When these are finally processed, they should be 'blocked' with demoBlockers, not 'ready'
  const hadAllDemosBlocked = new Map<string, string[]>();

  // Helper: check if implementation deps are satisfied
  function implDepsSatisfied(component: Component): boolean {
    const deps = getImplementationDeps(component, subComponentToParent);
    return deps.every(dep => createdComponents.has(dep));
  }

  // Helper: get demo deps for a demo
  function demoDepsForDemo(demo: DemoInfo): string[] {
    return demo.dependencies
        .map(dep => subComponentToParent.get(dep) ?? dep)
        .filter(dep => !shouldIgnoreComponent(dep));
  }

  // Helper: check if a demo's deps are satisfied
  function demoSatisfied(demo: DemoInfo): boolean {
    const deps = demoDepsForDemo(demo);
    return deps.every(dep => createdComponents.has(dep));
  }

  // Helper: get unsatisfied dependencies for a demo (deduplicated)
  function getBlockingDeps(demo: DemoInfo): string[] {
    const deps = demoDepsForDemo(demo);
    const unsatisfied = deps.filter(dep => !createdComponents.has(dep));
    return [...new Set(unsatisfied)].sort();
  }

  // Helper: categorize demos for a component
  function categorizeDemos(compName: string): { satisfied: string[]; blocked: BlockedDemoInfo[] } {
    const demos = demoDeps.get(compName) || [];
    const satisfied: string[] = [];
    const blocked: BlockedDemoInfo[] = [];

    for (const demo of demos) {
      if (demoSatisfied(demo)) {
        satisfied.push(demo.file);
      } else {
        blocked.push({
          file: demo.file,
          blockedBy: getBlockingDeps(demo),
        });
      }
    }

    return { satisfied, blocked };
  }

  let taskNum = 1;
  let iteration = 0;
  const maxIterations = 500;

  // Helper: Check for newly unblocked demos and create demo tasks immediately
  function createDemoTasksForUnblockedDemos(): void {
    const nowUnblocked: BlockedDemo[] = [];

    for (let i = blockedDemos.length - 1; i >= 0; i--) {
      const blocked = blockedDemos[i];
      const allDepsSatisfied = blocked.dependencies.every(dep => createdComponents.has(dep));

      if (allDepsSatisfied) {
        nowUnblocked.push(blocked);
        blockedDemos.splice(i, 1);
      }
    }

    if (nowUnblocked.length === 0) {
      return;
    }

    // Group unblocked demos by component, tracking what unblocked each
    const unblockedByComponent = new Map<string, UnblockedDemoInfo[]>();
    for (const demo of nowUnblocked) {
      if (!unblockedByComponent.has(demo.component)) {
        unblockedByComponent.set(demo.component, []);
      }
      unblockedByComponent.get(demo.component)!.push({
        file: demo.file,
        unblockedBy: [...new Set(demo.dependencies)].sort(),
      });
    }

    // Create demo tasks
    const sortedComponents = [...unblockedByComponent.keys()].sort();
    for (const compName of sortedComponents) {
      const unblockedInfos = unblockedByComponent.get(compName)!;
      const task: Task = {
        task: taskNum++,
        type: 'demo',
        component: compName,
        demos: unblockedInfos.map(u => u.file).sort(),
        unblocked: unblockedInfos.sort((a, b) => a.file.localeCompare(b.file)),
      };
      if (isTaskCompleted(task)) {
        task.type = 'completed';
      }

      tasks.push(task);
      console.error(`  Task ${task.task}: demo - ${compName} (${unblockedInfos.length} demos now unblocked)`);
    }
  }

  console.error('\n=== Generating Tasks ===\n');

  const hasWork = () => remaining.size > 0
    || pendingForDemos.size > 0
    || blockedDemos.length > 0;

  while (hasWork() && iteration < maxIterations) {
    iteration++;
    let madeProgress = false;

    // Phase 1: Move components with satisfied impl deps to pendingForDemos
    for (const compName of [...remaining]) {
      const component = componentMap.get(compName)!;
      if (implDepsSatisfied(component)) {
        remaining.delete(compName);
        pendingForDemos.add(compName);
      }
    }

    // Phase 2: Create tasks for components that are "ready" to process
    // This includes:
    //   - 'ready': No impl deps, all demos available (and wasn't blocked before)
    //   - 'blocked' with blockers: Has impl deps, all demos available
    //   - 'blocked' with demoBlockers: No impl deps, was blocked by demo deps (now available)
    // Components with ALL demos blocked wait until blockers are created
    const readyCandidates: string[] = [];

    for (const compName of pendingForDemos) {
      const component = componentMap.get(compName)!;
      const implDeps = getImplementationDeps(component, subComponentToParent);
      const demos = demoDeps.get(compName) || [];
      const { satisfied, blocked } = categorizeDemos(compName);

      // Has implementation deps - will be 'blocked' with blockers
      if (implDeps.length > 0) {
        if (demos.length === 0 || satisfied.length === demos.length) {
          readyCandidates.push(compName);
        }
        continue;
      }

      // No impl deps - check demo status
      if (demos.length === 0 || satisfied.length === demos.length) {
        // All demos available (or no demos) → ready to process
        readyCandidates.push(compName);
      } else if (satisfied.length === 0 && blocked.length > 0) {
        // ALL demos blocked → record blockers and wait
        if (!hadAllDemosBlocked.has(compName)) {
          const allBlockers = new Set<string>();
          for (const b of blocked) {
            for (const dep of b.blockedBy) {
              allBlockers.add(dep);
            }
          }
          hadAllDemosBlocked.set(compName, [...allBlockers].sort());
        }
      }
      // else: some demos available → handled in Phase 3 as 'partial'
    }

    // Process ready candidates (ready or blocked with impl deps or demoBlockers)
    readyCandidates.sort();
    for (const compName of readyCandidates) {
      const component = componentMap.get(compName)!;
      const implDeps = getImplementationDeps(component, subComponentToParent);
      const { satisfied } = categorizeDemos(compName);

      // Deduplicate blockers
      const uniqueBlockers = [...new Set(implDeps)].sort();

      // Check if this component was previously blocked by demo deps
      const demoBlockers = hadAllDemosBlocked.get(compName);

      // Determine task type - only blocked if deps are unsatisfied
      const unsatisfiedBlockers = uniqueBlockers.filter(b => !createdComponents.has(b));
      let taskType: 'ready' | 'blocked';
      if (unsatisfiedBlockers.length > 0 || demoBlockers) {
        taskType = 'blocked';
      } else {
        taskType = 'ready';
      }

      const task: Task = {
        task: taskNum++,
        type: taskType,
        component: compName,
        demos: satisfied.sort(),
        blockers: uniqueBlockers.length > 0 ? uniqueBlockers : undefined,
        demoBlockers: demoBlockers,
      };
      if (isTaskCompleted(task)) {
        task.type = 'completed';
      }

      tasks.push(task);
      let blockerInfo = '';
      if (uniqueBlockers.length > 0) {
        blockerInfo = ` [blockers: ${uniqueBlockers.join(', ')}]`;
      } else if (demoBlockers) {
        blockerInfo = ` [demoBlockers: ${demoBlockers.join(', ')}]`;
      }
      console.error(`  Task ${task.task}: ${taskType} - ${compName} (${satisfied.length} demos)${blockerInfo}`);

      createdComponents.add(compName);
      pendingForDemos.delete(compName);
      madeProgress = true;

      // Immediately check if any blocked demos are now unblocked
      createDemoTasksForUnblockedDemos();
    }

    // Phase 3: Create 'partial' tasks - components where SOME demos are satisfied
    if (!madeProgress) {
      const partialCandidates: string[] = [];
      for (const compName of pendingForDemos) {
        const { satisfied, blocked } = categorizeDemos(compName);
        if (satisfied.length > 0 && blocked.length > 0) {
          partialCandidates.push(compName);
        }
      }

      partialCandidates.sort();
      for (const compName of partialCandidates) {
        const { satisfied, blocked } = categorizeDemos(compName);
        const allDemos = demoDeps.get(compName) || [];

        const task: Task = {
          task: taskNum++,
          type: 'partial',
          component: compName,
          demos: satisfied.sort(),
          blocked: blocked,
        };
        if (isTaskCompleted(task)) {
          task.type = 'completed';
        }

        tasks.push(task);
        console.error(`  Task ${task.task}: partial - ${compName} (${satisfied.length} demos, ${blocked.length} blocked)`);

        createdComponents.add(compName);
        pendingForDemos.delete(compName);
        madeProgress = true;

        // Record blocked demos for later (need original DemoInfo for full deps)
        for (const blockedInfo of blocked) {
          const originalDemo = allDemos.find(d => d.file === blockedInfo.file)!;
          blockedDemos.push({
            component: compName,
            file: blockedInfo.file,
            dependencies: demoDepsForDemo(originalDemo),
          });
        }

        // Immediately check if any blocked demos are now unblocked
        createDemoTasksForUnblockedDemos();
      }
    }

    // Phase 4: Check if any remaining blocked demos can now be created (fallback)
    if (!madeProgress && blockedDemos.length > 0) {
      const nowUnblocked: BlockedDemo[] = [];

      for (let i = blockedDemos.length - 1; i >= 0; i--) {
        const blocked = blockedDemos[i];
        const allDepsSatisfied = blocked.dependencies.every(dep => createdComponents.has(dep));

        if (allDepsSatisfied) {
          nowUnblocked.push(blocked);
          blockedDemos.splice(i, 1);
        }
      }

      // Group unblocked demos by component
      const unblockedByComponent = new Map<string, string[]>();
      for (const demo of nowUnblocked) {
        if (!unblockedByComponent.has(demo.component)) {
          unblockedByComponent.set(demo.component, []);
        }
        unblockedByComponent.get(demo.component)!.push(demo.file);
      }

      // Create demo tasks
      const sortedComponents = [...unblockedByComponent.keys()].sort();
      for (const compName of sortedComponents) {
        const demoFiles = unblockedByComponent.get(compName)!;
        const task: Task = {
          task: taskNum++,
          type: 'demo',
          component: compName,
          demos: demoFiles.sort(),
        };
        if (isTaskCompleted(task)) {
          task.type = 'completed';
        }

        tasks.push(task);
        console.error(`  Task ${task.task}: demo - ${compName} (${demoFiles.length} demos now unblocked)`);
        madeProgress = true;
      }
    }

    // Phase 5: ONLY when stuck - create 'component' tasks (no demos can be created)
    if (!madeProgress && pendingForDemos.size > 0) {
      // Find ONE component to create as component-only to unblock others
      const componentCandidates = [...pendingForDemos].sort();

      // Pick the first one that would unblock the most demos
      let bestCandidate: string | null = null;
      let bestUnblockCount = -1;

      for (const compName of componentCandidates) {
        // Count how many blocked demos would be unblocked by creating this component
        let unblockCount = 0;
        for (const blocked of blockedDemos) {
          if (blocked.dependencies.includes(compName)) {
            unblockCount++;
          }
        }
        // Also count demos in pending components
        for (const pendingComp of pendingForDemos) {
          if (pendingComp === compName) {
            continue;
          }
          const { blocked } = categorizeDemos(pendingComp);
          for (const blockedInfo of blocked) {
            if (blockedInfo.blockedBy.includes(compName)) {
              unblockCount++;
            }
          }
        }

        if (unblockCount > bestUnblockCount) {
          bestUnblockCount = unblockCount;
          bestCandidate = compName;
        }
      }

      if (bestCandidate) {
        const compName = bestCandidate;
        const demos = demoDeps.get(compName) || [];
        const blockedInfos: BlockedDemoInfo[] = demos.map(d => {
          const unsatisfied = demoDepsForDemo(d).filter(dep => !createdComponents.has(dep));
          return {
            file: d.file,
            blockedBy: [...new Set(unsatisfied)].sort(),
          };
        });

        const task: Task = {
          task: taskNum++,
          type: 'component',
          component: compName,
          demos: [],
          blocked: blockedInfos,
        };
        if (isTaskCompleted(task)) {
          task.type = 'completed';
        }

        tasks.push(task);
        console.error(`  Task ${task.task}: component - ${compName} (0 demos, ${demos.length} blocked, unblocks ${bestUnblockCount})`);

        createdComponents.add(compName);
        pendingForDemos.delete(compName);
        madeProgress = true;

        // Record blocked demos for later
        for (const demo of demos) {
          blockedDemos.push({
            component: compName,
            file: demo.file,
            dependencies: demoDepsForDemo(demo),
          });
        }

        // Immediately check if any blocked demos are now unblocked
        createDemoTasksForUnblockedDemos();
      }
    }

    // Check for stuck state (circular implementation dependencies)
    if (!madeProgress && remaining.size > 0 && pendingForDemos.size === 0) {
      console.error(`\n  WARNING: Circular implementation dependency detected!`);
      console.error(`  Remaining components: ${[...remaining].join(', ')}`);
      console.error(`  These components have unsatisfied implementation dependencies.`);
      console.error(`  Stopping task generation.\n`);
      break;
    }

    // Safety check for truly stuck state
    const isStuckWithBlocked = !madeProgress
      && remaining.size === 0
      && pendingForDemos.size === 0
      && blockedDemos.length > 0;
    if (isStuckWithBlocked) {
      console.error(`\n  WARNING: Blocked demos cannot be unblocked!`);
      console.error(`  Remaining blocked demos: ${blockedDemos.length}`);
      for (const demo of blockedDemos.slice(0, 5)) {
        console.error(`    ${demo.component}/${demo.file} needs: ${demo.dependencies.join(', ')}`);
      }
      break;
    }
  }

  return tasks;
}

// ============================================================================
// Main Execution
// ============================================================================

const DEPENDENCIES_FILE = 'dependencies.json';

if (!fs.existsSync(DEPENDENCIES_FILE)) {
  console.error(`Error: ${DEPENDENCIES_FILE} not found`);
  console.error('Run: npm run deps:extract');
  process.exit(1);
}

const { components, demoDeps } = parseDependencies(DEPENDENCIES_FILE);

// Filter out layout and styling components
const filteredComponents = components.filter(c => !shouldIgnoreComponent(c.name));

console.error(`Loaded ${filteredComponents.length} components`);
console.error(`Loaded demo dependencies for ${demoDeps.size} components`);

const tasks = generateTasks(filteredComponents, demoDeps);

// Output as JSON
const output: TasksJSON = {
  generated: new Date().toISOString(),
  statistics: {
    total: tasks.length,
    completed: tasks.filter(t => t.type === 'completed').length,
    ready: tasks.filter(t => t.type === 'ready').length,
    blocked: tasks.filter(t => t.type === 'blocked').length,
    partial: tasks.filter(t => t.type === 'partial').length,
    component: tasks.filter(t => t.type === 'component').length,
    demo: tasks.filter(t => t.type === 'demo').length,
  },
  tasks,
};

console.log(JSON.stringify(output, null, 2));

console.error(`\n=== Summary ===`);
console.error(`Total tasks: ${tasks.length}`);
console.error(`  completed: ${tasks.filter(t => t.type === 'completed').length}`);
console.error(`  ready: ${tasks.filter(t => t.type === 'ready').length}`);
console.error(`  blocked: ${tasks.filter(t => t.type === 'blocked').length}`);
console.error(`  partial: ${tasks.filter(t => t.type === 'partial').length}`);
console.error(`  component: ${tasks.filter(t => t.type === 'component').length}`);
console.error(`  demo: ${tasks.filter(t => t.type === 'demo').length}`);
