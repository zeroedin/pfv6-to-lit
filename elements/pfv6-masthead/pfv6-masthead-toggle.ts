import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-masthead-toggle.css';

/**
 * Masthead toggle component for housing the navigation toggle button.
 *
 * @summary Container for the navigation toggle button
 * @alias MastheadToggle
 *
 * @slot - Default slot for toggle content (typically a button)
 */
@customElement('pfv6-masthead-toggle')
export class Pfv6MastheadToggle extends LitElement {
  static styles = styles;

  render() {
    return html`
      <span id="container">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-masthead-toggle': Pfv6MastheadToggle;
  }
}
