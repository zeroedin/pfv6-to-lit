import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { provide } from '@lit/context';
import { Pfv6TreeViewItem } from './pfv6-tree-view-item.js';
import './pfv6-tree-view-search.js';
import styles from './pfv6-tree-view.css';
import {
  treeViewContext,
  defaultTreeViewContext,
  type TreeViewContext,
} from './pfv6-tree-view-context.js';

/**
 * Tree view component for displaying hierarchical data structures.
 *
 * @summary Tree view for hierarchical navigation
 * @slot - Default slot for tree view items
 * @slot toolbar - Toolbar content displayed above the tree (typically search)
 */
@customElement('pfv6-tree-view')
export class Pfv6TreeView extends LitElement {
  static styles = styles;

  /**
   * Context value provided to child components.
   * Updated whenever relevant properties change.
   */
  @provide({ context: treeViewContext })
  @state()
  protected _context: TreeViewContext = defaultTreeViewContext;

  /** Flag indicating if the tree view has badges */
  @property({ type: Boolean, reflect: true, attribute: 'has-badges' })
  hasBadges = false;

  /** Variant presentation styles for the tree view */
  @property({ type: String, reflect: true })
  variant: 'default' | 'compact' | 'compactNoBackground' = 'default';

  /** Flag indicating if the tree view has guide lines */
  @property({ type: Boolean, reflect: true, attribute: 'has-guides' })
  hasGuides = false;

  /** Flag indicating if all nodes in the tree view should have checkboxes */
  @property({ type: Boolean, reflect: true, attribute: 'has-checkboxes' })
  hasCheckboxes = false;

  /** Flag indicating that tree nodes should be independently selectable, even when having children */
  @property({ type: Boolean, reflect: true, attribute: 'has-selectable-nodes' })
  hasSelectableNodes = false;

  /** Flag indicating whether multiple nodes can be selected in the tree view */
  @property({ type: Boolean, reflect: true, attribute: 'is-multi-selectable' })
  isMultiSelectable = false;

  /** Accessible label for the tree view */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Sets the expanded state on all tree nodes, overriding internal state */
  @property({ type: Boolean, attribute: 'all-expanded' })
  allExpanded?: boolean | undefined;

  override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    // Always update context on first render or when relevant properties change
    if (
      !this.hasUpdated
      || changedProperties.has('variant')
      || changedProperties.has('hasGuides')
      || changedProperties.has('hasBadges')
      || changedProperties.has('hasCheckboxes')
      || changedProperties.has('hasSelectableNodes')
      || changedProperties.has('isMultiSelectable')
      || changedProperties.has('allExpanded')
    ) {
      this._context = {
        isCompact: this.variant === 'compact' || this.variant === 'compactNoBackground',
        isNoBackground: this.variant === 'compactNoBackground',
        hasGuides: this.hasGuides,
        hasBadges: this.hasBadges,
        hasCheckboxes: this.hasCheckboxes,
        hasSelectableNodes: this.hasSelectableNodes,
        isMultiSelectable: this.isMultiSelectable,
        allExpanded: this.allExpanded,
      };
    }
  }


  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.#handleKeydown);
    this.addEventListener('select', this.#handleSelect as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.#handleKeydown);
    this.removeEventListener('select', this.#handleSelect as EventListener);
  }

  #handleSelect = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() !== 'pfv6-tree-view-item') {
      return;
    }

    type TreeItem = HTMLElement & {
      isSelected: boolean;
      isSelectable: boolean;
      hasChildren: boolean;
    };
    const item = target as TreeItem;

    // Only select items that are leaf nodes OR are selectable (via tree-level or per-item)
    // Items with children that aren't selectable just expand/collapse
    if (item.hasChildren && !this.hasSelectableNodes && !item.isSelectable) {
      return;
    }

    if (this.isMultiSelectable) {
      // Multi-select: toggle the clicked item's selection
      item.isSelected = !item.isSelected;
    } else {
      // Single-select: deselect all other items, select this one
      const allItems = this.querySelectorAll('pfv6-tree-view-item');
      allItems.forEach(otherItem => {
        (otherItem as HTMLElement & { isSelected: boolean }).isSelected = (otherItem === target);
      });
    }
  };

  /**
   * Gets all visible (not inside collapsed parent) and non-disabled tree items.
   * Checks ancestor tree-view-items for collapsed state since inert is in shadow DOM.
   */
  #getVisibleItems(): Pfv6TreeViewItem[] {
    return Array.from(this.querySelectorAll<Pfv6TreeViewItem>('pfv6-tree-view-item'))
        .filter(item => {
          if (item.disabled) {
            return false;
          }
          // Walk up ancestor tree-view-items to check if any are collapsed
          type ItemOrNull = Pfv6TreeViewItem | null;
          let parent = item.parentElement?.closest('pfv6-tree-view-item') as ItemOrNull;
          while (parent) {
            // If parent is collapsed, this item is not visible
            const isExpanded = parent.isExpanded ?? parent.internalIsExpanded;
            if (!isExpanded) {
              return false;
            }
            parent = parent.parentElement?.closest('pfv6-tree-view-item') as ItemOrNull;
          }
          return true;
        });
  }

  #handleKeydown = (event: KeyboardEvent) => {
    // Find the tree-view-item that contains the event target
    // With shadow DOM event retargeting, target may be the item itself or composed from within
    const target = event.target as HTMLElement;
    const item = target.closest('pfv6-tree-view-item') as Pfv6TreeViewItem | null;

    if (!item || !this.contains(item)) {
      return;
    }

    const items = this.#getVisibleItems();
    const currentIndex = items.indexOf(item);

    if (currentIndex === -1) {
      return;
    }

    const { key } = event;

    switch (key) {
      case 'ArrowDown': {
        const nextItem = items[currentIndex + 1];
        if (nextItem) {
          this.#focusItem(nextItem);
        }
        event.preventDefault();
        break;
      }

      case 'ArrowUp': {
        const prevItem = items[currentIndex - 1];
        if (prevItem) {
          this.#focusItem(prevItem);
        }
        event.preventDefault();
        break;
      }

      case 'ArrowRight': {
        // If item has children and is collapsed, expand it
        // If item has children and is expanded, move to first child
        // If item has no children, do nothing
        if (item.hasChildren) {
          const isExpanded = item.isExpanded ?? item.internalIsExpanded;
          if (!isExpanded) {
            item.toggle();
          } else {
            // Move to first child
            const selector = ':scope > pfv6-tree-view-item';
            const children = item.querySelectorAll<Pfv6TreeViewItem>(selector);
            const firstVisibleChild = [...children].find(child => !child.disabled);
            if (firstVisibleChild) {
              this.#focusItem(firstVisibleChild);
            }
          }
        }
        event.preventDefault();
        break;
      }

      case 'ArrowLeft': {
        // If item has children and is expanded, collapse it
        // If item is collapsed or has no children, move to parent
        if (item.hasChildren) {
          const isExpanded = item.isExpanded ?? item.internalIsExpanded;
          if (isExpanded) {
            item.toggle();
            event.preventDefault();
            break;
          }
        }
        // Move to parent item
        const parent = item.parentElement?.closest('pfv6-tree-view-item');
        if (parent && this.contains(parent)) {
          this.#focusItem(parent as Pfv6TreeViewItem);
        }
        event.preventDefault();
        break;
      }

      case 'Home': {
        const [firstItem] = items;
        if (firstItem && firstItem !== item) {
          this.#focusItem(firstItem);
        }
        event.preventDefault();
        break;
      }

      case 'End': {
        const lastItem = items[items.length - 1];
        if (lastItem && lastItem !== item) {
          this.#focusItem(lastItem);
        }
        event.preventDefault();
        break;
      }

      // Space is handled by the internal button click via delegatesFocus
      // Enter triggers the node's click handler
    }
  };

  /**
   * Moves focus to the specified item.
   * @param toItem - The item receiving focus
   */
  #focusItem(toItem: Pfv6TreeViewItem) {
    toItem.focusNode();
  }

  #handleToolbarSlotChange = () => {
    this.requestUpdate();
  };

  render() {
    const classes = {
      'guides': this.hasGuides,
      'compact': this.variant === 'compact' || this.variant === 'compactNoBackground',
      'no-background': this.variant === 'compactNoBackground',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot name="toolbar" @slotchange=${this.#handleToolbarSlotChange}></slot>
        <div
          role="tree"
          aria-label=${ifDefined(this.accessibleLabel)}
          aria-multiselectable=${this.isMultiSelectable ? 'true' : 'false'}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-tree-view': Pfv6TreeView;
  }
}
