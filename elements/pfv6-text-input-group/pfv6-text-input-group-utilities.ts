import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-text-input-group-utilities.css';

/**
 * Text input group utilities component for action buttons and controls.
 *
 * @slot - Default slot for utility content (buttons, icons, etc.)
 */
@customElement('pfv6-text-input-group-utilities')
export class Pfv6TextInputGroupUtilities extends LitElement {
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
    'pfv6-text-input-group-utilities': Pfv6TextInputGroupUtilities;
  }
}
