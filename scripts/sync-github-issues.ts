#!/usr/bin/env node

/**
 * Sync GitHub issues with tasks.json.
 *
 * JSON version - reads/writes tasks.json instead of tasks.yaml
 *
 * - Reads tasks.json
 * - Fetches existing issues from GitHub via `gh` CLI
 * - Creates issues for incomplete tasks that don't have one
 * - Updates tasks.json with issue URLs
 *
 * Usage: npm run issues:sync:json
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

const TASKS_FILE = 'tasks.json';

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

interface GitHubIssue {
  number: number;
  title: string;
  url: string;
  state: string;
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
 * Generate issue title for a task
 */
function getIssueTitle(task: Task): string {
  const kebabName = toKebabCase(task.component);

  if (task.type === 'demo') {
    const firstDemo = task.demos[0]?.replace(/\.tsx?$/, '') || 'demos';
    return `fix(${kebabName}): add demo ${firstDemo}`;
  }

  return `feat(${kebabName}): create \`<pfv6-${kebabName}>\``;
}

/**
 * Generate issue body for a task
 */
function getIssueBody(task: Task): string {
  const kebabName = toKebabCase(task.component);
  let body = '';

  if (task.type === 'ready') {
    body = `## Create component \`<pfv6-${kebabName}>\`

1. Convert React ${task.component} to Lit
2. Convert all demos`;
  } else if (task.type === 'blocked') {
    body = `## Create component \`<pfv6-${kebabName}>\`

1. Convert React ${task.component} to Lit
2. Convert all demos`;

    if (task.blockers && task.blockers.length > 0) {
      body += `\n\n**Blocked by:** ${task.blockers.join(', ')}`;
    } else if (task.demoBlockers && task.demoBlockers.length > 0) {
      body += `\n\n**Demo blockers:** ${task.demoBlockers.join(', ')}
(Component can be implemented, but all demos are blocked by these dependencies)`;
    }
  } else if (task.type === 'partial') {
    body = `## Create component \`<pfv6-${kebabName}>\`

1. Convert React ${task.component} to Lit
2. Convert demos:
${task.demos.map(d => `   - ${d.replace(/\.tsx?$/, '')}`).join('\n')}`;

    if (task.blocked && task.blocked.length > 0) {
      body += `
3. Blocked demos due to dependency creation order
${task.blocked.map(b => `   - ${b.file.replace(/\.tsx?$/, '')} by [${b.blockedBy.join(', ')}]`).join('\n')}`;
    }
  } else if (task.type === 'component') {
    body = `## Create component \`<pfv6-${kebabName}>\`

1. Convert React ${task.component} to Lit
2. No demos available yet (all blocked by dependencies)`;

    if (task.blocked && task.blocked.length > 0) {
      body += `

Blocked demos:
${task.blocked.map(b => `- ${b.file.replace(/\.tsx?$/, '')} by [${b.blockedBy.join(', ')}]`).join('\n')}`;
    }
  } else if (task.type === 'demo') {
    const demoList = task.demos.map(d => {
      const demoName = d.replace(/\.tsx?$/, '');
      const unblockedInfo = task.unblocked?.find(u => u.file === d);
      if (unblockedInfo) {
        return `- ${demoName} (unblocked by [${unblockedInfo.unblockedBy.join(', ')}])`;
      }
      return `- ${demoName}`;
    }).join('\n');

    body = `## Create demos for \`<pfv6-${kebabName}>\`

${demoList}`;
  }

  return body;
}

/**
 * Get the label for a task type
 */
function getIssueLabel(task: Task): string {
  if (task.type === 'demo') {
    return 'docs';
  }
  if (task.type === 'blocked') {
    return 'feature,blocked';
  }
  return 'feature';
}

/**
 * Fetch all issues from GitHub
 */
function fetchGitHubIssues(): GitHubIssue[] {
  try {
    const output = execSync(
      'gh issue list --state all --limit 500 --json number,title,url,state',
      { encoding: 'utf-8' }
    );
    return JSON.parse(output);
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    console.error('Make sure you have the GitHub CLI (gh) installed and authenticated.');
    process.exit(1);
  }
}

/**
 * Create a GitHub issue
 * Uses spawnSync with args array to avoid shell interpretation of backticks
 */
function createGitHubIssue(title: string, body: string, label: string): string {
  const result = spawnSync('gh', [
    'issue', 'create',
    '--title', title,
    '--body', body,
    '--label', label,
  ], { encoding: 'utf-8' });

  if (result.error) {
    console.error(`Error creating issue: ${title}`);
    throw result.error;
  }

  if (result.status !== 0) {
    console.error(`Error creating issue: ${title}`);
    console.error(result.stderr);
    throw new Error(`gh issue create failed with status ${result.status}`);
  }

  // Output is the issue URL
  return result.stdout.trim();
}

// ============================================================================
// Main Execution
// ============================================================================

if (!fs.existsSync(TASKS_FILE)) {
  console.error(`Error: ${TASKS_FILE} not found`);
  console.error('Run: npm run deps:tasks');
  process.exit(1);
}

console.log('Reading tasks.json...');
const data: TasksJSON = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
const tasks = data.tasks;
console.log(`Found ${tasks.length} tasks`);

console.log('Fetching GitHub issues...');
const issues = fetchGitHubIssues();
console.log(`Found ${issues.length} existing issues`);

// Build a map of title -> issue for quick lookup
const issuesByTitle = new Map<string, GitHubIssue>();
for (const issue of issues) {
  issuesByTitle.set(issue.title, issue);
}

let created = 0;
let matched = 0;
let warnings = 0;

for (const task of tasks) {
  const title = getIssueTitle(task);
  const existingIssue = issuesByTitle.get(title);

  if (existingIssue) {
    // Issue exists - update URL
    task.url = existingIssue.url;
    matched++;
    console.log(`✓ Task ${task.task}: Matched issue #${existingIssue.number}`);
  } else if (task.type === 'completed') {
    // Completed task without issue - warn but don't create
    warnings++;
    console.warn(
      `⚠ Task ${task.task}: Completed but no issue found (${title})`
    );
  } else {
    // Incomplete task without issue - create it
    console.log(`Creating issue for Task ${task.task}: ${title}`);
    const body = getIssueBody(task);
    const label = getIssueLabel(task);
    const url = createGitHubIssue(title, body, label);
    task.url = url;
    created++;
    console.log(`✓ Task ${task.task}: Created ${url}`);
  }
}

// Update statistics
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

console.log('\nWriting updated tasks.json...');
fs.writeFileSync(TASKS_FILE, JSON.stringify(output, null, 2));

console.log('\n=== Summary ===');
console.log(`Matched: ${matched}`);
console.log(`Created: ${created}`);
console.log(`Warnings: ${warnings}`);
