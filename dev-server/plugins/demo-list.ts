import type { Plugin } from '@web/dev-server-core';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface DemoInfo {
  componentName: string;
  tagName: string;
  demoName: string;
  url: string;
  title: string;
}

interface ComponentComparison {
  componentName: string;
  displayName: string;
  litDemos: Array<{ name: string; url: string }>;
  reactDemos: Array<{ name: string; url: string }>;
}

/**
 * Generate component comparison table HTML
 */
async function generateComparisonTableHTML(): Promise<string> {
  const components = new Map<string, ComponentComparison>();
  
  // Read Lit demos from custom-elements.json
  try {
    const manifestPath = join(process.cwd(), 'custom-elements.json');
    const manifestContent = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const module of manifest.modules || []) {
      for (const declaration of module.declarations || []) {
        if (declaration.customElement && declaration.demos) {
          const tagName = declaration.tagName;
          const componentKey = tagName.replace('pfv6-', '');
          
          if (!components.has(componentKey)) {
            components.set(componentKey, {
              componentName: componentKey,
              displayName: componentKey
                .split('-')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
              litDemos: [],
              reactDemos: [],
            });
          }
          
          const component = components.get(componentKey)!;
          for (const demo of declaration.demos) {
            component.litDemos.push({
              name: demo.name,
              url: demo.url,
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn('[demo-list-plugin] Could not read custom-elements.json:', error instanceof Error ? error.message : error);
  }

  // Read React demos from patternfly-react/demos.json
  try {
    const reactManifestPath = join(process.cwd(), 'patternfly-react', 'demos.json');
    const reactManifestContent = await readFile(reactManifestPath, 'utf-8');
    const reactManifest = JSON.parse(reactManifestContent);

    for (const [componentName, componentData] of Object.entries<any>(reactManifest.components)) {
      // Convert PascalCase to kebab-case (e.g., "AboutModal" -> "about-modal")
      const componentKey = componentName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      
      if (!components.has(componentKey)) {
        components.set(componentKey, {
          componentName: componentKey,
          displayName: componentName,
          litDemos: [],
          reactDemos: [],
        });
      }
      
      const component = components.get(componentKey)!;
      for (const [demoName] of Object.entries(componentData.demos)) {
        component.reactDemos.push({
          name: demoName,
          url: `/elements/pfv6-${componentKey}/react/${demoName}`,
        });
      }
    }
  } catch (error) {
    console.warn('[demo-list-plugin] Could not read patternfly-react/demos.json:', error instanceof Error ? error.message : error);
  }

  // Sort components alphabetically
  const sortedComponents = Array.from(components.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  if (sortedComponents.length === 0) {
    return `<tr>
            <td colspan="3">No components available yet. Run <code>npm run compile</code> to generate manifests.</td>
          </tr>`;
  }

  return sortedComponents
    .map(component => {
      const litCell = component.litDemos.length > 0
        ? `<a href="/elements/pfv6-${component.componentName}/demo">View Lit Demos (${component.litDemos.length}) →</a>`
        : '<span style="color: #999;">N/A</span>';
      
      const reactCell = component.reactDemos.length > 0
        ? `<a href="/elements/pfv6-${component.componentName}/react">View React Demos (${component.reactDemos.length}) →</a>`
        : '<span style="color: #999;">N/A</span>';

      return `<tr>
            <td><strong>${component.displayName}</strong></td>
            <td>${litCell}</td>
            <td>${reactCell}</td>
          </tr>`;
    })
    .join('\n          ');
}

/**
 * Plugin that injects a component comparison table into dev-server/index.html
 * Reads from custom-elements.json (Lit) and patternfly-react/demos.json (React)
 */
export function demoListPlugin(): Plugin {
  return {
    name: 'demo-list-plugin',
    async transform(context) {
      // Only inject comparison table into the root index.html (served via router)
      if (context.path === '/' && context.response.is('html')) {
        const comparisonTableHTML = await generateComparisonTableHTML();
        let html = context.body as string;
        html = html.replace(
          /<tbody id="demo-comparison-tbody">[\s\S]*?<\/tbody>/,
          `<tbody id="demo-comparison-tbody">\n          ${comparisonTableHTML}\n        </tbody>`
        );
        return html;
      }
    },
  };
}
