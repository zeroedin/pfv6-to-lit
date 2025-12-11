import type { Plugin } from '@web/dev-server-core';
import Router from '@koa/router';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Liquid } from 'liquidjs';
import {
  getComponentDemos,
  getReactDemos,
  loadReactManifest,
  getPascalCaseComponentName,
  reactDemoExists,
  hasReactDemos,
  litDemoExists,
} from './demo.js';
import { registerCustomFilters } from './liquid-filters.js';

// Initialize LiquidJS engine with custom filters
const liquid = new Liquid({
  root: join(process.cwd(), 'dev-server'),
  layouts: join(process.cwd(), 'dev-server/layouts'),
  partials: join(process.cwd(), 'dev-server'),
  extname: '',
  cache: process.env.NODE_ENV === 'production',
});

// Register custom filters for formatting
registerCustomFilters(liquid);

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
          ctx.type = 'html';
          ctx.body = await liquid.renderFile('index.html', {});
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

        ctx.type = 'html';
        ctx.body = await liquid.renderFile('demos.html', {
          componentName,
          componentTitle: `${componentName.replace('pfv6-', '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} (React)`,
          demos,
          demoCount: demos.length,
          hasReactDemos: false,
          isReactDemo: true,
          isIndex: true,
          demoName: 'index',
          templateName: 'demos.html',
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
          ctx.body = await liquid.renderFile('demo.html', {
            componentName,
            demoName,
            isReactDemo: true,
            isIndex: false,
            scriptSrc: `/patternfly-react/dist/${pascalComponentName}/${pascalDemoName}.js`,
            webComponentDemoExists: await litDemoExists(componentName, demoName),
            templateName: 'demo.html',
          });
        } else {
          ctx.type = 'html';
          ctx.body = await liquid.renderFile('react-not-built.html', {
            componentName,
            demoName: 'index',
            isReactDemo: true,
            isIndex: false,
            templateName: 'react-not-built.html',
          });
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
        
        ctx.type = 'html';
        ctx.body = await liquid.renderFile('demos.html', {
          componentName,
          componentTitle: componentName.replace('pfv6-', '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          demos,
          demoCount: demos.length,
          hasReactDemos,
          isReactDemo: false,
          isIndex: true,
          demoName: 'index',
          templateName: 'demos.html',
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
        ctx.body = await liquid.renderFile('demo.html', {
          componentName,
          demoName,
          content,
          isReactDemo: false,
          isIndex: false,
          hasReactDemos: await hasReactDemos(componentName),
          reactDemoExists: await reactDemoExists(componentName, demoName),
          templateName: 'demo.html',
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
        ctx.body = await liquid.renderFile('test.html', {
          componentName,
          demoName,
          content,
          isReactDemo: false,
          isIndex: false,
          templateName: 'test.html',
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
        ctx.body = await liquid.renderFile('test.html', {
          componentName,
          demoName,
          isReactDemo: true,
          isIndex: false,
          scriptSrc: `/patternfly-react/dist/${pascalComponentName}/${pascalDemoName}.js`,
          templateName: 'test.html',
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
