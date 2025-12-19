import { fileURLToPath } from 'url';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { litCss } from 'web-dev-server-plugin-lit-css';
import { routerPlugin } from './dev-server/plugins/router.ts';
import { injectImportMapPlugin } from './dev-server/plugins/inject-import-map.ts';
import { demoListPlugin } from './dev-server/plugins/demo-list.ts';

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
      exclude: /dev-server\/styles\/.*\.css$|patternfly-react\/dist\/.*\.css$|.*-lightdom\.css$|^styles\/.*\.css$/,
    }),
    routerPlugin(),
    injectImportMapPlugin(),
    demoListPlugin()
  ],
  middleware: [
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

