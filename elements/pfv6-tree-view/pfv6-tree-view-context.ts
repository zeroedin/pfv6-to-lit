import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Configuration context for tree-view components.
 * Provides inherited settings from parent tree-view to child items.
 */
export interface TreeViewContext {
  /** Whether the tree-view is using compact variant */
  isCompact: boolean;
  /** Whether guide lines are shown */
  hasGuides: boolean;
  /** Whether badges are enabled globally */
  hasBadges: boolean;
  /** Whether checkboxes are enabled globally */
  hasCheckboxes: boolean;
  /** Whether nodes with children are selectable */
  hasSelectableNodes: boolean;
  /** Whether multi-select is enabled */
  isMultiSelectable: boolean;
  /** Controlled expansion state for all items (undefined = use internal state) */
  allExpanded: boolean | undefined;
}

/**
 * Default context values when no parent tree-view provides context.
 */
export const defaultTreeViewContext: TreeViewContext = {
  isCompact: false,
  hasGuides: false,
  hasBadges: false,
  hasCheckboxes: false,
  hasSelectableNodes: false,
  isMultiSelectable: false,
  allExpanded: undefined,
};

/**
 * Lit context for tree-view configuration.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const treeViewContext = createContextWithRoot<TreeViewContext>(
  Symbol('tree-view-context'),
);
