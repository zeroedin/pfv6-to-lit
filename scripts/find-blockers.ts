#!/usr/bin/env node
/**
 * Find the next component to convert.
 *
 * The conversion-order.yaml file is already sorted in dependency order.
 * This script simply returns the first component with Converted: false.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Component {
  name: string;
  completed: boolean;
}

function parseYAML(yamlContent: string): Component[] {
  const lines = yamlContent.split('\n');
  const components: Component[] = [];
  let currentComponent: Component | null = null;

  for (const line of lines) {
    // Component name
    const componentMatch = line.match(/^  - (\w+):$/);
    if (componentMatch) {
      currentComponent = {
        name: componentMatch[1],
        completed: false
      };
      components.push(currentComponent);
      continue;
    }

    // Completed field
    const completedMatch = line.match(/^      completed:\s*(true|false)$/);
    if (completedMatch && currentComponent) {
      currentComponent.completed = completedMatch[1] === 'true';
    }
  }

  return components;
}

// Load conversion order
const yamlPath = resolve(process.cwd(), 'conversion-order.yaml');
const yamlContent = readFileSync(yamlPath, 'utf-8');
const components = parseYAML(yamlContent);

// Find first unconverted component
const next = components.find(c => !c.completed);

if (!next) {
  // eslint-disable-next-line no-console
  console.log('🎉 All components converted!');
  process.exit(0);
}

// eslint-disable-next-line no-console
console.log(`## Next Component to Convert: ${next.name}

This is the next component in dependency order that hasn't been converted yet.

---

## Next Steps

\`\`\`
Convert ${next.name} component
\`\`\`
`);
