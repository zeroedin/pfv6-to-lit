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
import { treeViewContext, defaultTreeViewContext, type TreeViewContext } from './pfv6-tree-view-context.js';

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

  /** Flag indicating if the tree view has guides */
  @property({ type: Boolean, reflect: true, attribute: 'has-guides' })
  hasGuides = false;

  /** Flag indicating if item is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Internal expansion state */
  @state()
  private internalIsExpanded = false;

  /** Whether item has children (detected from slot) */
  @state()
  private hasChildren = false;

  /** Generated ID for checkbox/label association */
  @state()
  private checkboxId = '';

  /** Nesting level (1-based, set automatically based on parent) */
  level = 1;

  // Computed properties that combine explicit attributes with context values
  /** Whether compact mode is active (from context) */
  get effectiveIsCompact(): boolean {
    return this._treeContext.isCompact;
  }

  /** Whether guides are shown (from context) */
  get effectiveHasGuides(): boolean {
    return this._treeContext.hasGuides;
  }

  /** Whether no-background mode is active (from context) */
  get effectiveIsNoBackground(): boolean {
    return this._treeContext.isNoBackground;
  }

  /** Whether badges are enabled (explicit attribute or context) */
  get effectiveHasBadge(): boolean {
    return this.hasAttribute('has-badge') ? this.hasBadge : this._treeContext.hasBadges;
  }

  /** Whether checkbox is shown (explicit attribute or context) */
  get effectiveHasCheckbox(): boolean {
    return this.hasAttribute('has-checkbox') ? this.hasCheckbox : this._treeContext.hasCheckboxes;
  }

  /** Whether item is selectable even with children (explicit attribute or context) */
  get effectiveIsSelectable(): boolean {
    return this.hasAttribute('is-selectable') ? this.isSelectable : this._treeContext.hasSelectableNodes;
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
    if (currentAllExpanded !== undefined && currentAllExpanded !== this.#previousAllExpanded) {
      this.internalIsExpanded = currentAllExpanded;
      this.#previousAllExpanded = currentAllExpanded;
    }

    // Sync controlled isExpanded prop
    if (changedProperties.has('isExpanded') && this.isExpanded !== undefined) {
      this.internalIsExpanded = this.isExpanded;
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Set ARIA states via ElementInternals
    this.#internals.ariaLabel = this.name;
    this.#internals.ariaExpanded = this.hasChildren ? String(this.internalIsExpanded) : null;
    this.#internals.ariaChecked = this.effectiveHasCheckbox ? String(this.checked) : null;
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

  #handleToggleClick = (e: Event) => {
    e.stopPropagation();

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
  };

  #handleNodeClick = () => {
    if (this.disabled) {
      return;
    }

    // Don't handle if clicking checkbox
    if (this.effectiveHasCheckbox) {
      return;
    }

    this.dispatchEvent(new Pfv6TreeViewItemSelectEvent(this.id));

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

  #handleNodeKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#handleNodeClick();
    }
  };

  #handleCheckboxChange = (e: Event) => {
    e.stopPropagation();
    const checkbox = e.target as HTMLInputElement;
    this.dispatchEvent(new Pfv6TreeViewItemCheckEvent(
      this.id,
      checkbox.checked,
      checkbox.indeterminate,
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
      <span class="toggle-icon">
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 320 512" aria-hidden="true">
          <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
        </svg>
      </span>
    `;

    const nodeContent = html`
      <span class="node-container">
        ${this.hasChildren ?
          (this.effectiveHasCheckbox || this.effectiveIsSelectable) ?
            html`<button class="toggle" @click=${this.#handleToggleClick} aria-labelledby=${`label-${this.checkboxId}`} type="button" tabindex="-1">${toggleIcon}</button>`
            : html`<span class="toggle" @click=${this.#handleToggleClick} tabindex="-1">${toggleIcon}</span>`
          : null}
        ${this.effectiveHasCheckbox ? html`
          <span class="check">
            <input type="checkbox" id=${this.checkboxId} .checked=${this.checked} .indeterminate=${this.indeterminate} @change=${this.#handleCheckboxChange} @click=${(e: Event) => e.stopPropagation()} ?disabled=${this.disabled} tabindex="-1" />
          </span>
        ` : null}
        <span class="icon">
          ${this.internalIsExpanded ?
            html`<slot name="expanded-icon"><slot name="icon"></slot></slot>`
            : html`<slot name="icon"></slot>`}
        </span>
        ${this.effectiveIsCompact ? html`
          <span class="content">
            ${this.itemTitle ? html`<span class="title">${this.itemTitle}</span>` : null}
            ${this.effectiveIsSelectable ?
              html`<button type="button" class="text" tabindex="-1" @click=${this.#handleSelectButtonClick} ?disabled=${this.disabled}>${this.name}</button>`
              : html`<span class="text">${this.name}</span>`}
          </span>
        ` : html`
          ${this.itemTitle ? html`<span class="title">${this.itemTitle}</span>` : null}
          ${this.effectiveIsSelectable ?
            html`<button type="button" class="text" tabindex="-1" @click=${this.#handleSelectButtonClick} ?disabled=${this.disabled}>${this.name}</button>`
            : html`<span class="text">${this.name}</span>`}
        `}
        ${this.effectiveHasBadge && this.badgeContent ? html`
          <span class="count">
            <pfv6-badge ?is-read=${this.badgeIsRead}>${this.badgeContent}</pfv6-badge>
          </span>
        ` : null}
      </span>
    `;

    return html`
      <div id="container" class=${classMap({
        'expanded': this.internalIsExpanded,
        'compact': this.effectiveIsCompact,
        'no-background': this.effectiveIsNoBackground,
        'guides': this.effectiveHasGuides,
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
        <div class="tree-view-content">
          ${this.effectiveHasCheckbox ? html`
            <label class=${classMap({ node: true, current: this.isSelected, disabled: this.disabled })} @click=${this.#handleNodeClick} for=${this.checkboxId} id=${`label-${this.checkboxId}`}>${nodeContent}</label>
          ` : (this.effectiveIsSelectable && this.hasChildren) ? html`
            <div class=${classMap({ node: true, current: this.isSelected, disabled: this.disabled })} @click=${this.#handleNodeClick} id=${`label-${this.checkboxId}`} role="button" tabindex="0" @keydown=${this.#handleNodeKeydown}>${nodeContent}</div>
          ` : html`
            <button class=${classMap({ node: true, current: this.isSelected, disabled: this.disabled })} @click=${this.#handleNodeClick} type="button">${nodeContent}</button>
          `}
          <div class="action">
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
