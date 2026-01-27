import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { provide } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import { toggleGroupContext, type ToggleGroupContext } from './context.js';
import './pfv6-toggle-group-item.js';
import styles from './pfv6-toggle-group.css';

// Re-export context for backwards compatibility
export { toggleGroupContext, type ToggleGroupContext } from './context.js';

/**
 * Toggle group component for grouping related toggle buttons.
 *
 * @summary Toggle group component
 * @alias ToggleGroup
 *
 * @slot - Default slot for toggle group items
 *
 * @cssprop --pf-v6-c-toggle-group--m-compact__button--PaddingBlockStart - Compact button padding block start
 * @cssprop --pf-v6-c-toggle-group--m-compact__button--PaddingInlineEnd - Compact button padding inline end
 * @cssprop --pf-v6-c-toggle-group--m-compact__button--PaddingBlockEnd - Compact button padding block end
 * @cssprop --pf-v6-c-toggle-group--m-compact__button--PaddingInlineStart - Compact button padding inline start
 */
@customElement('pfv6-toggle-group')
export class Pfv6ToggleGroup extends LitElement {
  static readonly styles = styles;

  private internals: ElementInternals;

  /** Modifies the toggle group to include compact styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-compact' })
  isCompact = false;

  /** Disable all toggle group items under this component */
  @property({ type: Boolean, reflect: true, attribute: 'are-all-groups-disabled' })
  areAllGroupsDisabled = false;

  /** Accessible label for the toggle group */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /**
   * Context value provided to child components.
   * Updated whenever relevant properties change.
   */
  @provide({ context: toggleGroupContext })
  @state()
  protected _context: ToggleGroupContext = {
    isCompact: false,
  };

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    // Always update context on first render or when relevant properties change
    if (!this.hasUpdated || changedProperties.has('isCompact')) {
      this._context = {
        isCompact: this.isCompact,
      };
    }
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('accessibleLabel')) {
      this.internals.ariaLabel = this.accessibleLabel ?? null;
    }

    // Only sync disabled state when areAllGroupsDisabled changes from a previous boolean value
    // Skip initial render (when old value is undefined) to preserve individual is-disabled attributes
    if (changedProperties.has('areAllGroupsDisabled')) {
      const oldValue = changedProperties.get('areAllGroupsDisabled');
      if (typeof oldValue === 'boolean') {
        this.#updateItemsDisabledState();
      }
    }
  }

  #updateItemsDisabledState() {
    const items = this.querySelectorAll('pfv6-toggle-group-item');
    items.forEach(item => {
      if (this.areAllGroupsDisabled) {
        // Mark that this was disabled by the group, not individually
        item.setAttribute('is-disabled', '');
        item.setAttribute('data-group-disabled', '');
      } else {
        // Only remove if it was disabled by the group, not individually
        if (item.hasAttribute('data-group-disabled')) {
          item.removeAttribute('is-disabled');
          item.removeAttribute('data-group-disabled');
        }
      }
    });
  }

  render() {
    const classes = {
      compact: this.isCompact,
    };

    return html`
      <div id="container" class=${classMap(classes)} role="group">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-toggle-group': Pfv6ToggleGroup;
  }
}
