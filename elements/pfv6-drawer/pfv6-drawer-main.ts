import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import styles from './pfv6-drawer-main.css';

/**
 * Drawer main wrapper component.
 *
 * @summary DrawerMain component
 * @alias DrawerMain
 *
 * @slot - Default slot for drawer main content (DrawerContent and DrawerPanelContent)
 */
@customElement('pfv6-drawer-main')
export class Pfv6DrawerMain extends LitElement {
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
    'pfv6-drawer-main': Pfv6DrawerMain;
  }
}
