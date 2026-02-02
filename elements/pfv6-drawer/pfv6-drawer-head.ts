import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import styles from './pfv6-drawer-head.css';

/**
 * Drawer head component for header content in the drawer panel.
 *
 * @summary DrawerHead component
 * @alias DrawerHead
 *
 * @slot - Default slot for head content
 */
@customElement('pfv6-drawer-head')
export class Pfv6DrawerHead extends LitElement {
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
    'pfv6-drawer-head': Pfv6DrawerHead;
  }
}
