import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-masthead-main.css';

/**
 * Masthead main component for the main content area (brand and toggle).
 *
 * @summary Container for the brand and toggle area
 * @alias MastheadMain
 *
 * @slot - Default slot for main content (typically toggle and brand)
 */
@customElement('pfv6-masthead-main')
export class Pfv6MastheadMain extends LitElement {
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
    'pfv6-masthead-main': Pfv6MastheadMain;
  }
}
