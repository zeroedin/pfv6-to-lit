#!/usr/bin/env node
/**
 * Find the next component to convert.
 *
 * Reads tasks.json and returns the first task with type: 'ready'.
 * Outputs structured information about ready and blocked demos for downstream agents.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

interface BlockedDemo {
  file: string;
  blockedBy: string[];
}

interface Task {
  task: number;
  type: 'ready' | 'blocked' | 'component' | 'demo' | 'partial' | 'completed';
  component: string;
  demos: string[];
  blocked?: BlockedDemo[];
  blockers?: string[];
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

// Find first actionable task (not completed, not blocked)
// Tasks are ordered by dependency, so blockers appear before blocked components.
// By the time we reach a blocked task, its blockers should already be completed.
const next = data.tasks.find(t => t.type !== 'completed' && t.type !== 'blocked');

if (!next) {
  console.log('🎉 All components converted!');
  console.log(`\nStatistics: ${data.statistics.completed}/${data.statistics.total} completed`);
  process.exit(0);
}

// Extract ready and blocked demo information
const readyDemos = next.demos || [];
const blockedDemos = next.blocked || [];

console.log(`## Next Component to Convert: ${next.component}

**Task Type:** ${next.type}

This is the next component in dependency order that is ready to convert.

**Statistics:** ${data.statistics.completed}/${data.statistics.total} completed, ${data.statistics.ready} ready

---

## Demo Status

### Ready Demos (${readyDemos.length})
${readyDemos.length > 0 ? readyDemos.map(d => `- ${d}`).join('\n') : '- None'}

### Blocked Demos (${blockedDemos.length})
${blockedDemos.length > 0 ? blockedDemos.map(d => `- ${d.file} (blocked by: ${d.blockedBy.join(', ')})`).join('\n') : '- None'}

---

## Machine-Parseable Data

\`\`\`json
{
  "component": "${next.component}",
  "taskType": "${next.type}",
  "readyDemos": ${JSON.stringify(readyDemos)},
  "blockedDemos": ${JSON.stringify(blockedDemos.map(d => d.file))},
  "blockedDemoDetails": ${JSON.stringify(blockedDemos)}
}
\`\`\`

---

## Next Steps

\`\`\`
Convert ${next.component} component
\`\`\`

${blockedDemos.length > 0 ? `**Note:** ${blockedDemos.length} demo(s) are blocked and should be SKIPPED during demo creation. They will be created later when their dependencies are converted.` : ''}
`);
