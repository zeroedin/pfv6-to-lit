#!/usr/bin/env node
/**
 * Find the next component to convert.
 *
 * Reads tasks.json and returns the first task with type: 'ready'.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Task {
  task: number;
  type: 'ready' | 'blocked' | 'component' | 'demo' | 'partial' | 'completed';
  component: string;
  demos: string[];
}

interface TasksJSON {
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

// Load tasks
const tasksPath = resolve(process.cwd(), 'tasks.json');
const data: TasksJSON = JSON.parse(readFileSync(tasksPath, 'utf-8'));

// Find first ready task
const next = data.tasks.find(t => t.type === 'ready');

if (!next) {
  console.log('🎉 All components converted!');
  console.log(`\nStatistics: ${data.statistics.completed}/${data.statistics.total} completed`);
  process.exit(0);
}

console.log(`## Next Component to Convert: ${next.component}

This is the next component in dependency order that is ready to convert.

**Statistics:** ${data.statistics.completed}/${data.statistics.total} completed, ${data.statistics.ready} ready

---

## Next Steps

\`\`\`
Convert ${next.component} component
\`\`\`
`);
