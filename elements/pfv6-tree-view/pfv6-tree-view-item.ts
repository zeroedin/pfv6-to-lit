/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { consume } from '@lit/context';
import { getRandomId } from '@patternfly/pfe-core/functions/random.js';
import styles from './pfv6-tree-view-item.css';
import {
  treeViewContext,
  defaultTreeViewContext,
  type TreeViewContext,
} from './pfv6-tree-view-context.js';

import '../pfv6-badge/pfv6-badge.js';

/**
 * Event fired when a tree item is selected.
 */
export class Pfv6TreeViewItemSelectEvent extends Event {
  constructor(
    public itemId?: string
  ) {
    super('select', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when a tree item is expanded.
 */
export class Pfv6TreeViewItemExpandEvent extends Event {
  constructor(
    public itemId?: string,
    public expanded = true
  ) {
    super('expand', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when a tree item is collapsed.
 */
export class Pfv6TreeViewItemCollapseEvent extends Event {
  constructor(
    public itemId?: string
  ) {
    super('collapse', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when a tree item checkbox is checked or unchecked.
 */
export class Pfv6TreeViewItemCheckEvent extends Event {
  constructor(
    public itemId?: string,
    public checked = false,
    public indeterminate = false
  ) {
    super('check', { bubbles: true, composed: true });
  }
}

/**
 * Individual tree view item component.
 *
 * @summary Tree view item for hierarchical data
 * @slot - Default slot for nested tree view items
 * @slot icon - Custom icon for the tree item
 * @slot expanded-icon - Custom icon shown when item is expanded
 * @slot action - Action content (button, dropdown, etc.)
 * @fires {Pfv6TreeViewItemSelectEvent} select - Fired when item is selected
 * @fires {Pfv6TreeViewItemExpandEvent} expand - Fired when item is expanded
 * @fires {Pfv6TreeViewItemCollapseEvent} collapse - Fired when item is collapsed
 * @fires {Pfv6TreeViewItemCheckEvent} check - Fired when checkbox state changes
 */
@customElement('pfv6-tree-view-item')
export class Pfv6TreeViewItem extends LitElement {
  static styles = styles;
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  #internals = this.attachInternals();

  /** Tree view context consumed from parent tree-view */
  @consume({ context: treeViewContext, subscribe: true })
  @state()
  private _treeContext: TreeViewContext = defaultTreeViewContext;

  constructor() {
    super();
    this.#internals.role = 'treeitem';
  }

  /** Text content of the tree view item */
  @property({ type: String })
  name = '';

  /** Title of the tree view item (used in compact mode) */
  @property({ type: String, attribute: 'item-title' })
  itemTitle?: string;

  /** Flag indicating if node is expanded by default */
  @property({ type: Boolean, reflect: true, attribute: 'default-expanded' })
  defaultExpanded = false;

  /** Flag indicating if the node is expanded (controlled mode) */
  @property({ type: Boolean, attribute: 'is-expanded' })
  isExpanded?: boolean;

  /** Flag indicating if the item has a checkbox */
  @property({ type: Boolean, reflect: true, attribute: 'has-checkbox' })
  hasCheckbox = false;

  /** Flag indicating if checkbox is checked */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Flag indicating if checkbox is in indeterminate state */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Flag indicating if the item has a badge */
  @property({ type: Boolean, reflect: true, attribute: 'has-badge' })
  hasBadge = false;

  /** Custom badge content (number or text) */
  @property({ type: String, attribute: 'badge-content' })
  badgeContent?: string;

  /** Flag indicating if badge is read (affects styling) */
  @property({ type: Boolean, reflect: true, attribute: 'badge-is-read' })
  badgeIsRead = true;

  /** Flag indicating if item is selectable even when it has children */
  @property({ type: Boolean, reflect: true, attribute: 'is-selectable' })
  isSelectable = false;

  /** Flag indicating if item is currently selected */
  @property({ type: Boolean, reflect: true, attribute: 'is-selected' })
  isSelected = false;

  /** Flag indicating if the tree view is using compact variant */
  @property({ type: Boolean, reflect: true, attribute: 'is-compact' })
  isCompact = false;

  /** Flag indicating if item is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Internal expansion state (exposed for keyboard navigation) */
  @state()
  internalIsExpanded = false;

  /** Whether item has children - detected from slot (exposed for keyboard navigation) */
  @state()
  hasChildren = false;

  /** Generated ID for checkbox/label association */
  @state()
  private checkboxId = '';

  /** Nesting level (1-based, set automatically based on parent) */
  @state()
  level = 1;

  // Computed properties that combine explicit attributes with context values
  /** Whether compact mode is active (explicit attribute or context) */
  get effectiveIsCompact(): boolean {
    return this.isCompact || this._treeContext.isCompact;
  }

  /** Whether badges are enabled (explicit attribute or context) */
  get effectiveHasBadge(): boolean {
    return this.hasBadge || this._treeContext.hasBadges;
  }

  /** Whether checkbox is shown (explicit attribute or context) */
  get effectiveHasCheckbox(): boolean {
    return this.hasCheckbox || this._treeContext.hasCheckboxes;
  }

  /** Whether item is selectable even with children (explicit attribute or context) */
  get effectiveIsSelectable(): boolean {
    return this.isSelectable || this._treeContext.hasSelectableNodes;
  }

  /** Tracks the previous allExpanded context value to detect changes */
  #previousAllExpanded: boolean | undefined = undefined;

  override connectedCallback() {
    super.connectedCallback();
    this.internalIsExpanded = this.defaultExpanded;
    this.checkboxId = getRandomId('checkbox');

    // Detect nesting level from parent tree-view-item
    // Note: Level is per-item based on nesting, not from context
    const parentItem = this.parentElement
        ?.closest('pfv6-tree-view-item') as Pfv6TreeViewItem | null;
    if (parentItem) {
      this.level = parentItem.level + 1;
    } else {
      this.level = 1;
    }
    // All other inherited settings (isCompact, hasGuides, hasBadges, etc.) come from context
  }

  override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    // Sync allExpanded from context to internal state when it changes
    // This matches React's useEffect behavior - sync when prop changes, but allow user toggling
    // Note: We check on every willUpdate because @consume context changes may not appear in changedProperties
    const currentAllExpanded = this._treeContext.allExpanded;
    if (currentAllExpanded !== undefined) {
      if (currentAllExpanded !== this.#previousAllExpanded) {
        this.internalIsExpanded = currentAllExpanded;
      }
      this.#previousAllExpanded = currentAllExpanded;
    } else {
      // Reset tracking when allExpanded becomes undefined (uncontrolled mode)
      this.#previousAllExpanded = undefined;
    }

    // Sync controlled isExpanded prop
    if (changedProperties.has('isExpanded') && this.isExpanded !== undefined) {
      this.internalIsExpanded = this.isExpanded;
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Set ARIA states via ElementInternals
    this.#internals.ariaExpanded = this.hasChildren ? String(this.internalIsExpanded) : null;
    this.#internals.ariaChecked = this.effectiveHasCheckbox ?
      (this.indeterminate ? 'mixed' : String(this.checked))
      : null;
    this.#internals.ariaSelected = !this.effectiveHasCheckbox ? String(this.isSelected) : null;

    // Sync indeterminate state on checkbox
    if (changedProperties.has('indeterminate')) {
      const checkbox = this.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        checkbox.indeterminate = this.indeterminate;
      }
    }
  }

  #handleDefaultSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const children = slot.assignedElements();
    this.hasChildren = children.length > 0;
  };

  /** Toggle the expanded state of this item. Public API for keyboard navigation. */
  toggle(): void {
    if (this.disabled) {
      return;
    }

    const newExpandedState = !this.internalIsExpanded;
    this.internalIsExpanded = newExpandedState;

    if (newExpandedState) {
      this.dispatchEvent(new Pfv6TreeViewItemExpandEvent(this.id, true));
    } else {
      this.dispatchEvent(new Pfv6TreeViewItemCollapseEvent(this.id));
    }
  }

  /** Focus the internal node element. Public API for keyboard navigation. */
  focusNode(): void {
    // Try to focus the outer node element (button or label)
    // For selectable parents with children, the outer is a div so we fall back to delegatesFocus
    const focusable = this.shadowRoot?.querySelector<HTMLElement>('button.node, label.node');
    if (focusable) {
      focusable.focus();
    } else {
      // delegatesFocus will focus the first focusable child (e.g., toggle button)
      this.focus();
    }
  }

  #handleToggleClick = (e: Event) => {
    e.stopPropagation();
    this.toggle();
  };

  #handleNodeClick = () => {
    if (this.disabled) {
      return;
    }

    // Don't handle if clicking checkbox
    if (this.effectiveHasCheckbox) {
      return;
    }

    // Only dispatch select for leaf nodes or selectable parent nodes
    // Parent nodes without is-selectable just expand/collapse
    if (!this.hasChildren || this.effectiveIsSelectable) {
      this.dispatchEvent(new Pfv6TreeViewItemSelectEvent(this.id));
    }

    // If not selectable and has children, toggle expansion
    if (!this.effectiveIsSelectable && this.hasChildren) {
      const newExpandedState = !this.internalIsExpanded;
      this.internalIsExpanded = newExpandedState;

      if (newExpandedState) {
        this.dispatchEvent(new Pfv6TreeViewItemExpandEvent(this.id, true));
      } else {
        this.dispatchEvent(new Pfv6TreeViewItemCollapseEvent(this.id));
      }
    }
  };

  #handleCheckboxChange = (e: Event) => {
    e.stopPropagation();
    const checkbox = e.target as HTMLInputElement;
    // Update internal state to match native checkbox for responsive UX
    // Parent can override via checked/indeterminate props if fully controlled
    this.checked = checkbox.checked;
    this.indeterminate = false; // Clicking always clears indeterminate
    this.dispatchEvent(new Pfv6TreeViewItemCheckEvent(
      this.id,
      this.checked,
      this.indeterminate,
    ));
  };

  #handleSelectButtonClick = (e: Event) => {
    e.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.dispatchEvent(new Pfv6TreeViewItemSelectEvent(this.id));
  };

  render() {
    const toggleIcon = html`
      <span id="toggle-icon">
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true">
          <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
        </svg>
      </span>
    `;

    const nodeContent = html`
      <span id="node-container">
        ${this.hasChildren ?
          (this.effectiveHasCheckbox || this.effectiveIsSelectable) ?
            html`<button id="toggle" @click=${this.#handleToggleClick} aria-labelledby=${`label-${this.checkboxId}`} type="button">${toggleIcon}</button>`
            : html`<span id="toggle" @click=${this.#handleToggleClick} tabindex="-1">${toggleIcon}</span>`
          : null}
        ${this.effectiveHasCheckbox ? html`
          <span id="check">
            <input type="checkbox" id=${this.checkboxId} .checked=${this.checked} .indeterminate=${this.indeterminate} @change=${this.#handleCheckboxChange} @click=${(e: Event) => e.stopPropagation()} ?disabled=${this.disabled} />
          </span>
        ` : null}
        <span id="icon">
          ${this.internalIsExpanded ?
            html`<slot name="expanded-icon"><slot name="icon"></slot></slot>`
            : html`<slot name="icon"></slot>`}
        </span>
        ${this.effectiveIsCompact ? html`
          <span id="content">
            ${this.itemTitle ? html`<span id="title">${this.itemTitle}</span>` : null}
            ${this.effectiveIsSelectable && this.hasChildren ?
              html`<button type="button" id="text" tabindex="-1" @click=${this.#handleSelectButtonClick} ?disabled=${this.disabled}>${this.name}</button>`
              : html`<span id="text">${this.name}</span>`}
          </span>
        ` : html`
          ${this.itemTitle ? html`<span id="title">${this.itemTitle}</span>` : null}
          ${this.effectiveIsSelectable && this.hasChildren ?
            html`<button type="button" id="text" tabindex="-1" @click=${this.#handleSelectButtonClick} ?disabled=${this.disabled}>${this.name}</button>`
            : html`<span id="text">${this.name}</span>`}
        `}
        ${this.effectiveHasBadge && this.badgeContent ? html`
          <span id="count">
            <pfv6-badge ?is-read=${this.badgeIsRead}>${this.badgeContent}</pfv6-badge>
          </span>
        ` : null}
      </span>
    `;

    return html`
      <div id="container" class=${classMap({
        'expanded': this.internalIsExpanded,
        'compact': this.effectiveIsCompact,
        'no-background': this._treeContext.isNoBackground,
        'guides': this._treeContext.hasGuides,
        'nested': this.level > 1,
        'level-1': this.level === 1,
        'level-2': this.level === 2,
        'level-3': this.level === 3,
        'level-4': this.level === 4,
        'level-5': this.level === 5,
        'level-6': this.level === 6,
        'level-7': this.level === 7,
        'level-8': this.level === 8,
        'level-9': this.level === 9,
        'level-10': this.level >= 10,
      })}>
        <div id="tree-view-content">
          ${this.effectiveHasCheckbox ? html`
            <label class=${classMap({ node: true, current: this.isSelected, disabled: this.disabled })} @click=${this.#handleNodeClick} for=${this.checkboxId} id=${`label-${this.checkboxId}`}>${nodeContent}</label>
          ` : (this.effectiveIsSelectable && this.hasChildren) ? html`
            <div class=${classMap({ node: true, current: this.isSelected, disabled: this.disabled })} @click=${this.#handleNodeClick} id=${`label-${this.checkboxId}`}>${nodeContent}</div>
          ` : html`
            <button class=${classMap({ node: true, current: this.isSelected, disabled: this.disabled })} @click=${this.#handleNodeClick} type="button">${nodeContent}</button>
          `}
          <div id="action">
            <slot name="action"></slot>
          </div>
        </div>
        <div role="group" ?inert=${!this.internalIsExpanded} aria-hidden=${!this.internalIsExpanded}>
          <slot @slotchange=${this.#handleDefaultSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-tree-view-item': Pfv6TreeViewItem;
  }
}
