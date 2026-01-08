import tseslint from 'typescript-eslint';
import pfe from '@patternfly/eslint-config-elements';

export default tseslint.config(
  ...pfe,
  {
    ignores: [
      'elements/**/*.d.ts',
      'lib/**/*.d.ts',
      '**/*.js',
      '**/*.js.map',
    ],
  }
);

