import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Context for SimpleList state shared with child items.
 */
export interface SimpleListContext {
  /** The currently selected item element */
  currentItemElement: HTMLElement | undefined;
  /** Whether the list is in controlled mode */
  isControlled: boolean;
  /** Callback to update the current item */
  updateCurrentItem: (
    itemElement: HTMLElement,
    itemId?: string | number,
    itemProps?: Record<string, unknown>,
  ) => void;
}

/**
 * Context for SimpleList state shared with child items.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const simpleListContext = createContextWithRoot<SimpleListContext>(
  Symbol('simple-list-context'),
);
