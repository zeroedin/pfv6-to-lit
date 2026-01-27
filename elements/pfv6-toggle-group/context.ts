import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Context interface for ToggleGroup parent-child state sharing.
 */
export interface ToggleGroupContext {
  isCompact: boolean;
}

/**
 * Context for sharing toggle group configuration with child components.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const toggleGroupContext = createContextWithRoot<ToggleGroupContext>(
  Symbol('toggle-group-context'),
);
