import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { litCss } from 'web-dev-server-plugin-lit-css';
import { fileURLToPath } from 'url';

export default {
  nodeResolve: true,
  files: 'elements/**/test/*.spec.ts',
  
  // Import map for bare module specifiers
  // Maps @pfv6/elements/ to /elements/ so tests can use bare module specifiers
  importMap: {
    imports: {
      '@pfv6/elements/': '/elements/',
    },
  },
  
  // Browsers to test on
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],

  // Plugins for handling TypeScript and CSS
  plugins: [
    {
      name: 'resolve-pfv6-elements',
      transform(context) {
        // Don't transform our own modules - let the browser resolve them via import map
        if (context.path.startsWith('/elements/') && !context.path.includes('/test/')) {
          return;
        }
      },
      resolveImport({ source }) {
        // Map @pfv6/elements/ imports to /elements/ paths
        if (source.startsWith('@pfv6/elements/')) {
          return source.replace('@pfv6/elements/', '/elements/');
        }
      },
    },
    esbuildPlugin({ 
      ts: true,
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
    litCss(),
  ],
  
  // Middleware to redirect .js requests to .ts files
  // This allows bare module specifiers like @pfv6/elements/pfv6-card/context.js to work
  // The import map resolves @pfv6/elements/pfv6-card/context.js to /elements/pfv6-card/context.js
  // Then this middleware redirects .js to .ts: /elements/pfv6-card/context.ts
  middleware: [
    function(context, next) {
      // Redirect /elements/*.js to /elements/*.ts
      if (context.path.startsWith('/elements/') && context.path.endsWith('.js')) {
        context.redirect(context.path.replace('.js', '.ts'));
      } else {
        return next();
      }
    },
  ],

  // Test framework configuration
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 5000,
    },
  },

  // Coverage disabled
  coverage: false,
};

