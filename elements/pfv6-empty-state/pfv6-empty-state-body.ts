import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-empty-state-body.css';

/**
 * EmptyStateBody component for displaying body content within an empty state.
 *
 * @summary EmptyStateBody
 * @alias EmptyStateBody
 *
 * @slot - Default slot for body content
 */
@customElement('pfv6-empty-state-body')
export class Pfv6EmptyStateBody extends LitElement {
  static styles = styles;

  render() {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-empty-state-body': Pfv6EmptyStateBody;
  }
}
