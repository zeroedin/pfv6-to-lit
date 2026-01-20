import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-empty-state-footer.css';

/**
 * EmptyStateFooter component for displaying footer content within an empty state.
 *
 * @summary EmptyStateFooter
 * @alias EmptyStateFooter
 *
 * @slot - Default slot for footer content
 */
@customElement('pfv6-empty-state-footer')
export class Pfv6EmptyStateFooter extends LitElement {
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
    'pfv6-empty-state-footer': Pfv6EmptyStateFooter;
  }
}
