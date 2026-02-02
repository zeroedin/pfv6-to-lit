import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Event fired when drawer panel expansion completes (after 250ms animation).
 */
export class Pfv6DrawerExpandEvent extends Event {
  constructor() {
    super('expand', { bubbles: true, composed: true });
  }
}

/**
 * Context interface for sharing drawer state with child components.
 */
export interface DrawerContext {
  isExpanded: boolean;
  isStatic: boolean;
  isInline: boolean;
  position: 'start' | 'end' | 'bottom' | 'left' | 'right';
}

/**
 * Context for sharing drawer configuration with child components.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const drawerContext = createContextWithRoot<DrawerContext>(
  Symbol('drawer-context'),
);
