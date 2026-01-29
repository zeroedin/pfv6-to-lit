import { fileURLToPath } from 'url';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { litCss } from 'web-dev-server-plugin-lit-css';
import { routerPlugin } from './dev-server/plugins/router.ts';
import { injectImportMapPlugin } from './dev-server/plugins/inject-import-map.ts';
import { demoListPlugin } from './dev-server/plugins/demo-list.ts';

/**
 * Redirect .js requests to .ts files for elements and lib directories.
 * This ensures the file watcher detects .ts changes and triggers live reload.
 */
function liveReloadTsChangesMiddleware(ctx, next) {
  if (!ctx.path.includes('node_modules')
      && ctx.path.match(/\/(elements|lib)\/.*\.js$/)) {
    ctx.redirect(ctx.path.replace('.js', '.ts'));
  } else {
    return next();
  }
}

/**
 * Set ETag based on file modification time for elements/lib JS files.
 * When files change, ETag changes, forcing browser to re-fetch.
 */
async function cacheBusterMiddleware(ctx, next) {
  await next();
  if (ctx.path.match(/\/(elements|lib)\/.*\.(js|ts)$/)) {
    try {
      const filePath = ctx.path.endsWith('.ts')
        ? join(process.cwd(), ctx.path)
        : join(process.cwd(), ctx.path.replace('.js', '.ts'));
      const stats = await stat(filePath);
      const mtime = stats.mtime.getTime();
      ctx.response.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      ctx.response.set('Pragma', 'no-cache');
      ctx.response.etag = `modified-${mtime}`;
    } catch {
      // File doesn't exist as .ts, ignore
    }
  }
}

export default {
  rootDir: ".",
  watch: true,
  watchOptions: {
    ignored: ['**/node_modules/**', '**/.wireit/**'],
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      tsx: true,
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
    litCss({
      // Exclude dev-server styles, patternfly-react CSS, lightdom CSS, and /styles/ directory from Lit CSS transformation
      exclude: /dev-server\/styles\/.*\.css$|patternfly-react\/dist\/.*\.css$|.*-lightdom\.css$|styles\/.*\.css$/,
    }),
    routerPlugin(),
    injectImportMapPlugin(),
    demoListPlugin(),
    // Watch TypeScript files and trigger reload on changes
    {
      name: 'watch-ts-files',
      serverStart(args) {
        // Add TypeScript files to file watcher
        args.fileWatcher.add('elements/**/*.ts');
        args.fileWatcher.add('lib/**/*.ts');
      },
    },
  ],
  middleware: [
    liveReloadTsChangesMiddleware,
    cacheBusterMiddleware,
    function setCorrectMimeTypes(context, next) {
      // Ensure CSS files from patternfly-react are served with correct MIME type
      // BUT don't interfere with litCss-transformed component CSS imports
      if (context.url && context.url.includes('patternfly-react/dist/') && context.url.endsWith('.css')) {
        return next().then(() => {
          if (context.response.is('application/javascript')) {
            context.response.type = 'text/css';
          }
        });
      }
      return next();
    }
  ],
}

