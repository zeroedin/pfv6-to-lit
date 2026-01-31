import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import styles from './pfv6-backdrop.css';

/**
 * A backdrop component that renders a semi-transparent overlay, typically used behind modals and other overlays to darken/obscure background content.
 *
 * @alias Backdrop
 *
 * @slot - Optional content rendered inside the backdrop
 *
 * @cssprop --pf-v6-c-backdrop--Position - Backdrop positioning method (fixed or absolute)
 * @cssprop --pf-v6-c-backdrop--ZIndex - Z-index stacking level for backdrop overlay
 * @cssprop --pf-v6-c-backdrop--BackgroundColor - Backdrop overlay color
 *
 * @example
 * ```html
 * <pfv6-backdrop></pfv6-backdrop>
 * ```
 */
@customElement('pfv6-backdrop')
export class Pfv6Backdrop extends LitElement {
  static styles = styles;

  render() {
    return html`
      <div id="backdrop">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-backdrop': Pfv6Backdrop;
  }
}
