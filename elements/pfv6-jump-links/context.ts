import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Context for JumpLinks state shared with child items.
 */
export interface JumpLinksContext {
  /** The currently active item index */
  activeIndex: number;
}

/**
 * Context for JumpLinks state shared with child items.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const jumpLinksContext = createContextWithRoot<JumpLinksContext>(
  Symbol('jump-links-context'),
);
