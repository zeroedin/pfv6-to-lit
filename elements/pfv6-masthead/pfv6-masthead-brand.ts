import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-masthead-brand.css';

/**
 * Masthead brand component for housing brand content (logo, product name).
 *
 * @summary Container for brand content
 * @alias MastheadBrand
 *
 * @slot - Default slot for brand content (typically a link with logo)
 */
@customElement('pfv6-masthead-brand')
export class Pfv6MastheadBrand extends LitElement {
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
    'pfv6-masthead-brand': Pfv6MastheadBrand;
  }
}
