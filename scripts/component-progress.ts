#!/usr/bin/env node
/**
 * Display component conversion progress.
 *
 * Reads tasks.json and calculates accurate component-level progress
 * by filtering out demo tasks and counting unique components.
 *
 * Usage: npx tsx scripts/component-progress.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface Task {
  task: number;
  type: 'ready' | 'blocked' | 'component' | 'demo' | 'partial' | 'completed';
  component: string;
  demos: string[];
}

interface TasksJSON {
  tasks: Task[];
}

const tasksPath = resolve(process.cwd(), 'tasks.json');

if (!existsSync(tasksPath)) {
  console.error('Error: tasks.json not found');
  console.error('Run: npm run deps:extract && npm run deps:tasks');
  process.exit(1);
}

const data: TasksJSON = JSON.parse(readFileSync(tasksPath, 'utf-8'));

// Filter out demo tasks - only count component tasks
const componentTasks = data.tasks.filter(t => t.type !== 'demo');

// Get unique components and their completion status
// A component is completed if ANY of its tasks is marked completed
const components = new Map<string, boolean>();
componentTasks.forEach(t => {
  const isCompleted = t.type === 'completed';
  // If already marked completed, keep it; otherwise update
  if (!components.has(t.component) || isCompleted) {
    components.set(t.component, isCompleted);
  }
});

const total = components.size;
const completed = [...components.values()].filter(v => v).length;
const remaining = total - completed;
const pct = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';

// Output markdown table
console.log('');
console.log('## Progress Overview');
console.log('');
console.log('| Metric | Count |');
console.log('|--------|-------|');
console.log(`| Total components | ${total} |`);
console.log(`| ✅ Completed | ${completed} |`);
console.log(`| ⏳ Remaining | ${remaining} |`);
console.log(`| **Progress** | **${pct}%** |`);
console.log('');
