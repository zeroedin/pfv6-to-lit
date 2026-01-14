import tseslint from 'typescript-eslint';
import pfe from '@patternfly/eslint-config-elements';

export default tseslint.config(
  ...pfe,
  {
    ignores: [
      '.cache/**/*',
      'patternfly-react/**/*',
      'test-results/**/*',
      'playwright-report/**/*',
      'elements/**/*.d.ts',
      'lib/**/*.d.ts',
      '**/*.js',
      '**/*.js.map',
    ],
  },
  {
    files: [
      'dev-server/**/*.ts',
      'scripts/**/*.ts',
      'vite.config.*.ts',
      'elements/**/*.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  }
);

