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
      router.get('/elements/:componentName/react/:demoName', async (ctx, next) => {
        const { componentName, demoName } = ctx.params;
        
        // If demoName contains a file extension, skip this route handler
        if (demoName && demoName.includes('.')) {
          return next();
        }
        
        if (!componentName || !demoName) {
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
      router.get('/elements/:componentName/demo/:demoName', async (ctx, next) => {
        const { componentName, demoName } = ctx.params;
        
        // If demoName contains a file extension, skip this route handler
        // Let the static file server handle it
        if (demoName && demoName.includes('.')) {
          return next();
        }
        
        if (!componentName || !demoName) {
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
      router.get('/elements/:componentName/test/:demoName', async (ctx, next) => {
        const { componentName, demoName } = ctx.params;
        
        // If demoName contains a file extension, skip this route handler
        if (demoName && demoName.includes('.')) {
          return next();
        }
        
        if (!componentName || !demoName) {
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
      router.get('/elements/:componentName/react/test/:demoName', async (ctx, next) => {
        const { componentName, demoName } = ctx.params;
        
        // If demoName contains a file extension, skip this route handler
        if (demoName && demoName.includes('.')) {
          return next();
        }
        
        if (!componentName || !demoName) {
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


      // Serve static files from demo directories BEFORE router processes them
      // This prevents the router from matching and redirecting file requests
      app.use(async (ctx, next) => {
        const segments = ctx.path.split('/').filter(s => s);
        const lastSegment = segments[segments.length - 1] || '';
        
        // Check if this looks like a file request (has extension)
        if (lastSegment && lastSegment.includes('.') && !ctx.path.endsWith('/')) {
          // Check if it's in a demo or react directory
          if (ctx.path.includes('/demo/') || ctx.path.includes('/react/')) {
            // Try to read and serve the file from the filesystem
            const filePath = join(process.cwd(), ctx.path);
            const fileContent = await readFileOrNull(filePath);
            
            if (fileContent) {
              // Determine content type based on extension
              const ext = lastSegment.split('.').pop()?.toLowerCase();
              const contentTypes: Record<string, string> = {
                'svg': 'image/svg+xml',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'webp': 'image/webp',
                'css': 'text/css',
                'js': 'text/javascript',
              };
              
              ctx.type = contentTypes[ext || ''] || 'application/octet-stream';
              ctx.body = fileContent;
              return; // Don't call next() - we've handled this request
            }
          }
        }
        
        await next();
      });

      // Redirect demo URLs without trailing slashes to versions with trailing slashes
      // Excludes paths with file extensions (static assets)
      app.use(async (ctx, next) => {
        const segments = ctx.path.split('/').filter(s => s);
        const lastSegment = segments[segments.length - 1] || '';
        const hasFileExtension = lastSegment.includes('.');
        const demoPathPattern = /^\/elements\/[^/]+\/demo\/[^/]+$/;
        const reactDemoPathPattern = /^\/elements\/[^/]+\/react\/[^/]+$/;
        
        // Only redirect if it's a demo path AND doesn't have a file extension
        if (!hasFileExtension && (demoPathPattern.test(ctx.path) || reactDemoPathPattern.test(ctx.path))) {
          ctx.status = 301;
          ctx.redirect(ctx.path + '/');
          return;
        }
        
        await next();
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

      // Handle /assets/ paths - map to dev-server/assets/patternfly/assets/
      app.use(async (ctx, next) => {
        if (ctx.path.startsWith('/assets/')) {
          // Map /assets/* to dev-server/assets/patternfly/assets/*
          ctx.path = ctx.path.replace('/assets/', 'dev-server/assets/patternfly/assets/');
        }
        await next();
      });

      // Handle /styles/ paths - map to root styles/
      app.use(async (ctx, next) => {
        if (ctx.path.startsWith('/styles/')) {
          // Map /styles/* to styles/*
          ctx.path = ctx.path.substring(1); // Remove leading slash
        }
        await next();
      });
    },
  };
}
