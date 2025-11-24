import type { Plugin } from '@web/dev-server-core';
import Router from '@koa/router';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Liquid } from 'liquidjs';

// Initialize LiquidJS engine
const liquid = new Liquid({
  root: join(process.cwd(), 'dev-server'),
  layouts: join(process.cwd(), 'dev-server/layouts'),
  partials: join(process.cwd(), 'dev-server'),
  extname: '',  // No default extension, specify explicitly
  cache: process.env.NODE_ENV === 'production',
});

/**
 * Demo information structure
 */
interface DemoInfo {
  name: string;
  url: string;
  title: string;
}

/**
 * Custom Elements Manifest structure (partial types we use)
 */
interface CEMDemo {
  name: string;
  url: string;
}

interface CEMDeclaration {
  customElement?: boolean;
  tagName?: string;
  demos?: CEMDemo[];
}

interface CEMModule {
  declarations?: CEMDeclaration[];
}

interface CEManifest {
  modules?: CEMModule[];
}

/**
 * React demos manifest structure
 */
interface ReactDemoManifest {
  version: string;
  generatedAt: string;
  clonePath: string;
  components: Record<string, {
    sourceComponent: string;
    demos: Record<string, string>; // kebab-case → PascalCase.tsx
  }>;
}

/**
 * Cached React manifest (loaded once)
 */
let reactManifestCache: ReactDemoManifest | null = null;

/**
 * Load React demos manifest
 */
async function loadReactManifest(): Promise<ReactDemoManifest | null> {
  if (reactManifestCache) {
    return reactManifestCache;
  }
  
  try {
    const manifestPath = join(process.cwd(), 'patternfly-react/demos.json');
    const content = await readFile(manifestPath, 'utf-8');
    reactManifestCache = JSON.parse(content);
    return reactManifestCache;
  } catch (error) {
    console.warn('[router] Could not load React demos manifest:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Formats a kebab-case demo name into a Title Case string
 */
function formatDemoTitle(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get demos for a component from CEM (Lit demos)
 */
async function getComponentDemos(componentName: string): Promise<DemoInfo[]> {
  try {
    const manifestPath = join(process.cwd(), 'custom-elements.json');
    const manifestContent = await readFile(manifestPath, 'utf-8');
    const manifest: CEManifest = JSON.parse(manifestContent);

    // Find the component's demos
    for (const module of manifest.modules || []) {
      for (const declaration of module.declarations || []) {
        if (declaration.customElement && declaration.tagName === componentName) {
          if (declaration.demos) {
            return declaration.demos
              .filter((demo) => demo.name !== 'index') // Exclude index from list
              .map((demo) => ({
                url: demo.url,
                name: demo.name,
                title: formatDemoTitle(demo.name),
              }))
              .sort((a, b) => a.title.localeCompare(b.title));
          }
        }
      }
    }
  } catch (error) {
    console.warn('[router] Could not read CEM for demos:', error instanceof Error ? error.message : error);
  }
  return [];
}

/**
 * Get PascalCase component name from pfv6-{component} format
 * e.g., 'pfv6-card' → 'Card'
 */
function getPascalCaseComponentName(kebabComponent: string): string {
  // Remove 'pfv6-' prefix and convert to PascalCase
  const withoutPrefix = kebabComponent.replace(/^pfv6-/, '');
  return withoutPrefix
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Discover React demo files from manifest
 */
async function getReactDemos(componentName: string): Promise<DemoInfo[]> {
  try {
    const manifest = await loadReactManifest();
    if (!manifest) {
      return [];
    }
    
    // Convert pfv6-card → Card
    const pascalComponentName = getPascalCaseComponentName(componentName);
    const componentData = manifest.components[pascalComponentName];
    
    if (!componentData) {
      return [];
    }
    
    // Map kebab-case names to demo info
    return Object.keys(componentData.demos)
      .map(kebabName => ({
        name: kebabName,
        title: formatDemoTitle(kebabName),
        url: `/elements/${componentName}/react/${kebabName}`,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.warn('[router] Could not read React demos from manifest:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Check if a React demo exists in manifest
 */
async function reactDemoExists(componentName: string, demoName: string): Promise<boolean> {
  try {
    const manifest = await loadReactManifest();
    if (!manifest) {
      return false;
    }
    
    const pascalComponentName = getPascalCaseComponentName(componentName);
    const componentData = manifest.components[pascalComponentName];
    
    if (!componentData) {
      return false;
    }
    
    // Check if kebab-case demo name exists in manifest
    return demoName in componentData.demos;
  } catch {
    return false;
  }
}

/**
 * Check if any React demos exist for a component
 */
async function hasReactDemos(componentName: string): Promise<boolean> {
  const demos = await getReactDemos(componentName);
  return demos.length > 0;
}

/**
 * Check if a Lit demo file exists
 */
async function litDemoExists(componentName: string, demoName: string): Promise<boolean> {
  try {
    const demoPath = join(process.cwd(), 'elements', componentName, 'demo', `${demoName}.html`);
    await readFile(demoPath, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Template context passed to LiquidJS templates
 */
interface TemplateContext {
  title: string;
  componentName: string;
  demoName: string;
  isIndex: boolean;
  isReactDemo: boolean;
  content?: string;
  scriptSrc?: string;
  // Lit demo specific
  hasReactDemo?: boolean;
  reactDemoUrl?: string;
  demos?: DemoInfo[];
  demoCount?: number;
  // React demo specific
  webComponentDemoUrl?: string;
}

/**
 * Options for rendering a template
 */
interface RenderTemplateOptions {
  componentName: string;
  componentTitle?: string;
  demoName?: string;
  isIndex?: boolean;
  isReactDemo?: boolean;
  content?: string;
  scriptSrc?: string;
  demos?: DemoInfo[];
  hasReactDemos?: boolean;
}

/**
 * Renders a template with the given context
 */
async function renderTemplate(
  templateName: 'demo.html' | 'test.html' | 'react-not-built.html' | 'demos.html',
  options: RenderTemplateOptions
): Promise<string> {
  const { componentName, demoName = 'index', isIndex = false, isReactDemo = false } = options;
  
  // Build title based on context
  let title: string;
  if (templateName === 'test.html') {
    // test.html template adds " - Visual Test" or " - React Visual Test" suffix
    title = isReactDemo
      ? `${componentName} - ${demoName} - PatternFly Elements v6`
      : `${componentName} ${demoName} - PatternFly Elements v6`;
  } else if (isReactDemo) {
    title = isIndex
      ? `${componentName} - React Demos - PatternFly Elements v6`
      : `${componentName} - ${demoName} - React Comparison - PatternFly Elements v6`;
  } else {
    title = isIndex
      ? `${componentName} - PatternFly Elements v6`
      : `${componentName} ${demoName} - PatternFly Elements v6`;
  }

  // Build context for demo.html template
  const context: TemplateContext = {
    title,
    componentName,
    demoName,
    isIndex,
    isReactDemo,
    ...(options.content !== undefined && { content: options.content }),
    ...(options.scriptSrc !== undefined && { scriptSrc: options.scriptSrc }),
    ...(options.componentTitle !== undefined && { componentTitle: options.componentTitle }),
    ...(options.demos !== undefined && { demos: options.demos }),
    ...(options.hasReactDemos !== undefined && { hasReactDemos: options.hasReactDemos }),
  };

  // Add demo-specific context for Lit demos
  if (!isReactDemo && templateName === 'demo.html') {
    const hasReact = await hasReactDemos(componentName);
    context.hasReactDemo = hasReact;
    
    // Link to corresponding React demo if it exists (but not for index pages)
    if (hasReact && !isIndex) {
      // Check if this specific demo exists in React
      const reactDemoExistsForThis = await reactDemoExists(componentName, demoName);
      context.reactDemoUrl = reactDemoExistsForThis
        ? `/elements/${componentName}/react/${demoName}`
        : `/elements/${componentName}/react`;
    } else {
      context.reactDemoUrl = '';
    }
    
    if (isIndex) {
      const demos = await getComponentDemos(componentName);
      context.demos = demos;
      context.demoCount = demos.length;
    }
  }

  // Add demo list for React index pages
  if (isReactDemo && isIndex && options.demos) {
    context.demos = options.demos;
  }

  // Add web component demo URL for React demos (but not index pages)
  if (isReactDemo && !isIndex) {
    const hasLitDemo = await litDemoExists(componentName, demoName);
    context.webComponentDemoUrl = hasLitDemo
      ? `/elements/${componentName}/demo/${demoName}`
      : `/elements/${componentName}/demo`;
  }

  return liquid.renderFile(templateName, context);
}

/**
 * Reads a file and returns its content, or null if not found
 */
async function readFileOrNull(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Router plugin for handling custom routes
 * - Serves dev-server/index.html at /
 * - Wraps component demos with full HTML boilerplate
 * - Serves React comparison demos
 */
export function routerPlugin(): Plugin {
  return {
    name: 'router-plugin',
    async serverStart({ app, fileWatcher }) {
      const router = new Router();

      // Route: / - serves dev-server/index.html (processed through LiquidJS)
      router.get('/', async (ctx) => {
        try {
          const html = await liquid.renderFile('index.html', {});
          ctx.type = 'html';
          ctx.body = html;
        } catch (error) {
          console.error('[router] Error rendering index:', error);
          ctx.status = 500;
          ctx.body = 'Error rendering index page';
        }
      });

      // Watch demo files for changes
      const demoGlob = join(process.cwd(), 'elements/*/demo/**/*.html');
      fileWatcher.add(demoGlob);

      // Watch template files (LiquidJS handles caching/reloading automatically)
      const templateFiles = [
        join(process.cwd(), 'dev-server', 'demo.html'),
        join(process.cwd(), 'dev-server', 'react-not-built.html'),
        join(process.cwd(), 'dev-server', 'test.html')
      ];
      templateFiles.forEach(file => {
        fileWatcher.add(file);
      });

      // Route: /elements/:componentName/react - React demo index page
      router.get('/elements/:componentName/react', async (ctx) => {
        const { componentName } = ctx.params;
        
        if (!componentName || componentName.includes('.')) {
          ctx.status = 404;
          return;
        }

        const demos = await getReactDemos(componentName);
        if (demos.length === 0) {
          ctx.status = 404;
          ctx.body = 'No React demos found for this component';
          return;
        }

        // Format component title
        const componentTitle = componentName
          .replace('pfv6-', '')
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        ctx.type = 'html';
        ctx.body = await renderTemplate('demos.html', {
          componentName,
          componentTitle: `${componentTitle} (React)`,
          demos,
          hasReactDemos: false, // Don't show "View React Demos" link on React index
          isReactDemo: true,
          isIndex: true,
        });
      });

      // Route: /elements/:componentName/react/:demoName - Individual React comparison demos
      router.get('/elements/:componentName/react/:demoName', async (ctx) => {
        const { componentName, demoName } = ctx.params;
        
        if (!componentName || !demoName || componentName.includes('.') || demoName.includes('.')) {
          ctx.status = 404;
          return;
        }

        // Get PascalCase component name and demo filename from manifest
        const manifest = await loadReactManifest();
        const pascalComponentName = getPascalCaseComponentName(componentName);
        const componentData = manifest?.components[pascalComponentName];
        
        if (!componentData || !(demoName in componentData.demos)) {
          ctx.status = 404;
          ctx.body = 'React comparison demo not found';
          return;
        }
        
        // Get PascalCase filename (e.g., 'CardBasic.tsx' → 'CardBasic')
        const demoFile = componentData.demos[demoName];
        if (!demoFile) {
          ctx.status = 404;
          ctx.body = 'React comparison demo not found';
          return;
        }
        const pascalDemoName = demoFile.replace('.tsx', '');
        const builtFilePath = join(process.cwd(), 'patternfly-react', 'dist', pascalComponentName, `${pascalDemoName}.js`);
        const builtFileExists = await readFileOrNull(builtFilePath) !== null;
        
        if (builtFileExists) {
          ctx.type = 'html';
          ctx.body = await renderTemplate('demo.html', {
            componentName,
            demoName,
            isReactDemo: true,
            scriptSrc: `/patternfly-react/dist/${pascalComponentName}/${pascalDemoName}.js`,
          });
        } else {
          // Source exists in manifest but not built yet
          ctx.type = 'html';
          ctx.body = await renderTemplate('react-not-built.html', { componentName });
        }
      });

      // Route: /elements/:componentName/demo
      router.get('/elements/:componentName/demo', async (ctx) => {
        const { componentName } = ctx.params;
        
        if (!componentName || componentName.includes('.')) {
          ctx.status = 404;
          return;
        }

        // Dynamically generate demo index page
        const demos = await getComponentDemos(componentName);
        
        if (demos.length === 0) {
          ctx.status = 404;
          ctx.body = 'No demos found for this component';
          return;
        }
        
        // Check if React demos exist
        const manifest = await loadReactManifest();
        const pascalComponentName = getPascalCaseComponentName(componentName);
        const hasReactDemos = !!(manifest?.components[pascalComponentName]);
        
        // Format component title
        const componentTitle = componentName
          .replace('pfv6-', '')
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        
        ctx.type = 'html';
        ctx.body = await renderTemplate('demos.html', {
          componentName,
          componentTitle,
          demos,
          hasReactDemos,
          isIndex: true,
        });
      });

      // Route: /elements/:componentName/demo/:demoName
      router.get('/elements/:componentName/demo/:demoName', async (ctx) => {
        const { componentName, demoName } = ctx.params;
        
        if (!componentName || !demoName || componentName.includes('.') || demoName.includes('.')) {
          ctx.status = 404;
          return;
        }

        const filePath = join(process.cwd(), 'elements', componentName, 'demo', `${demoName}.html`);
        const content = await readFileOrNull(filePath);
        
        if (!content) {
          ctx.status = 404;
          ctx.body = 'Demo not found';
          return;
        }

        ctx.type = 'html';
        ctx.body = await renderTemplate('demo.html', {
          componentName,
          demoName,
          content,
        });
      });

      // Route: /elements/:componentName/test/:demoName
      router.get('/elements/:componentName/test/:demoName', async (ctx) => {
        const { componentName, demoName } = ctx.params;
        
        if (!componentName || !demoName || componentName.includes('.') || demoName.includes('.')) {
          ctx.status = 404;
          return;
        }

        const filePath = join(process.cwd(), 'elements', componentName, 'demo', `${demoName}.html`);
        const content = await readFileOrNull(filePath);
        
        if (!content) {
          ctx.status = 404;
          ctx.body = 'Test demo not found';
          return;
        }

        ctx.type = 'html';
        ctx.body = await renderTemplate('test.html', {
          componentName,
          demoName,
          content,
        });
      });

      // Route: /elements/:componentName/react/test/:demoName
      router.get('/elements/:componentName/react/test/:demoName', async (ctx) => {
        const { componentName, demoName } = ctx.params;
        
        if (!componentName || !demoName || componentName.includes('.') || demoName.includes('.')) {
          ctx.status = 404;
          return;
        }

        // Get PascalCase component name and demo filename from manifest
        const manifest = await loadReactManifest();
        const pascalComponentName = getPascalCaseComponentName(componentName);
        const componentData = manifest?.components[pascalComponentName];
        
        if (!componentData || !(demoName in componentData.demos)) {
          ctx.status = 404;
          ctx.body = 'React test demo not found';
          return;
        }
        
        // Get PascalCase filename
        const demoFile = componentData.demos[demoName];
        if (!demoFile) {
          ctx.status = 404;
          ctx.body = 'React test demo not found';
          return;
        }
        const pascalDemoName = demoFile.replace('.tsx', '');
        const builtFilePath = join(process.cwd(), 'patternfly-react', 'dist', pascalComponentName, `${pascalDemoName}.js`);
        const builtFileExists = await readFileOrNull(builtFilePath) !== null;
        
        if (!builtFileExists) {
          ctx.status = 404;
          ctx.body = 'React test demo not found';
          return;
        }

        ctx.type = 'html';
        ctx.body = await renderTemplate('test.html', {
          componentName,
          demoName,
          isReactDemo: true,
          scriptSrc: `/patternfly-react/dist/${pascalComponentName}/${pascalDemoName}.js`,
        });
      });

      app.use(router.routes());
      app.use(router.allowedMethods());

      // Handle /dev-server/ paths with regular middleware
      app.use(async (ctx, next) => {
        if (ctx.path.startsWith('/dev-server/')) {
          // Remove leading slash and serve from project root
          ctx.path = ctx.path.substring(1);
        }
        await next();
      });
    },
  };
}
