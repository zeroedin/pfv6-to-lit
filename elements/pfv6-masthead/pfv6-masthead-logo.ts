import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-masthead-logo.css';

/**
 * Masthead logo component for housing the logo or brand link.
 *
 * @summary Container for masthead logo content
 * @alias MastheadLogo
 *
 * @slot - Default slot for logo content
 */
@customElement('pfv6-masthead-logo')
export class Pfv6MastheadLogo extends LitElement {
  static styles = styles;

  /**
   * Link URL. When provided, renders the component as a link.
   * When omitted, renders as a span.
   */
  @property()
  href?: string;

  render() {
    if (this.href) {
      return html`
        <a id="container" href=${this.href} tabindex="0">
          <slot></slot>
        </a>
      `;
    }
    return html`
      <span id="container">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-masthead-logo': Pfv6MastheadLogo;
  }
}
