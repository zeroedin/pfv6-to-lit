import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-jump-links-list.css';

/**
 * Nested list container for jump links items.
 *
 * @summary Jump links nested list component
 * @alias JumpLinksList
 *
 * ## Architecture: Shadow DOM with ElementInternals
 *
 * **ARIA Pattern**: Uses ElementInternals to expose `role="listitem"` at the
 * host level (since this component is a listitem that contains a nested list).
 * The internal container uses `role="list"` for the nested items.
 *
 * @slot - Default slot for nested jump links items
 */
@customElement('pfv6-jump-links-list')
export class Pfv6JumpLinksList extends LitElement {
  static styles = styles;

  #internals = this.attachInternals();

  /** Accessible label for the nested list */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  constructor() {
    super();
    // This component is a listitem that contains a nested list
    this.#internals.role = 'listitem';
  }

  render() {
    return html`
      <div id="container">
        <slot name="parent"></slot>
        <div id="list" role="list" aria-label=${ifDefined(this.accessibleLabel)}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-jump-links-list': Pfv6JumpLinksList;
  }
}
