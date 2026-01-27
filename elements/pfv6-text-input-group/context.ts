import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Context interface for sharing state between TextInputGroup and its children.
 */
export interface TextInputGroupContext {
  isDisabled: boolean;
  validated: 'success' | 'warning' | 'error' | undefined;
}

/**
 * Create context with root to handle late-upgrading context consumers.
 * This is critical for slotted content that may upgrade after the provider.
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const textInputGroupContext = createContextWithRoot<TextInputGroupContext>(
  Symbol('text-input-group-context')
);
