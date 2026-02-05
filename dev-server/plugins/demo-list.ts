import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface ReactComponentData {
  demos: Record<string, unknown>;
}

export interface ComponentComparison {
  componentName: string;
  displayName: string;
  litDemos: { name: string; url: string }[];
  reactDemos: { name: string; url: string }[];
}

/**
 * Get component comparison data for the index page
 * Reads from custom-elements.json (Lit) and patternfly-react/demos.json (React)
 */
export async function getComponentComparisonData(): Promise<ComponentComparison[]> {
  const components = new Map<string, ComponentComparison>();

  // Read Lit demos from custom-elements.json
  try {
    const manifestPath = join(process.cwd(), 'custom-elements.json');
    const manifestContent = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const module of manifest.modules || []) {
      for (const declaration of module.declarations || []) {
        if (declaration.customElement && declaration.demos) {
          const { tagName } = declaration;
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
    console.warn(
      '[demo-list] Could not read custom-elements.json:',
      error instanceof Error ? error.message : error
    );
  }

  // Read React demos from patternfly-react/demos.json
  try {
    const reactManifestPath = join(process.cwd(), 'patternfly-react', 'demos.json');
    const reactManifestContent = await readFile(reactManifestPath, 'utf-8');
    const reactManifest = JSON.parse(reactManifestContent);

    for (const [componentName, componentData] of Object.entries<ReactComponentData>(
      reactManifest.components
    )) {
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
    console.warn(
      '[demo-list] Could not read patternfly-react/demos.json:',
      error instanceof Error ? error.message : error
    );
  }

  // Sort components alphabetically
  return Array.from(components.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );
}
