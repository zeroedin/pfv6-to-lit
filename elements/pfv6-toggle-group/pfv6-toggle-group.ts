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

  #internals: ElementInternals;

  /** Modifies the toggle group to include compact styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-compact' })
  isCompact = false;

  /** Disable all toggle group items under this component */
  @property({ type: Boolean, reflect: true, attribute: 'are-all-groups-disabled' })
  areAllGroupsDisabled = false;

  /** Accessible label for the toggle group */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /**
   * Context value provided to child components.
   * Updated whenever relevant properties change.
   */
  @provide({ context: toggleGroupContext })
  @state()
  protected _context: ToggleGroupContext = {
    isCompact: false,
    areAllGroupsDisabled: false,
  };

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = 'group';
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    // Always update context on first render or when relevant properties change
    if (
      !this.hasUpdated
      || changedProperties.has('isCompact')
      || changedProperties.has('areAllGroupsDisabled')
    ) {
      this._context = {
        isCompact: this.isCompact,
        areAllGroupsDisabled: this.areAllGroupsDisabled,
      };
    }
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('accessibleLabel')) {
      this.#internals.ariaLabel = this.accessibleLabel ?? null;
    }
  }

  render() {
    const classes = {
      compact: this.isCompact,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
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
