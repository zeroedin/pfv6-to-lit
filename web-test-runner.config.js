import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { litCss } from 'web-dev-server-plugin-lit-css';
import { fileURLToPath } from 'url';

export default {
  nodeResolve: true,
  files: 'elements/**/test/*.spec.ts',
  
  // Browsers to test on
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],

  // Plugins for handling TypeScript and CSS
  plugins: [
    esbuildPlugin({ 
      ts: true,
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
    litCss(),
  ],

  // Test framework configuration
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 5000,
    },
  },

  // Coverage settings
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

