import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import styles from './pfv6-drawer-actions.css';

/**
 * Drawer actions component for action buttons in the drawer panel head.
 *
 * @summary DrawerActions component
 * @alias DrawerActions
 *
 * @slot - Default slot for action buttons
 */
@customElement('pfv6-drawer-actions')
export class Pfv6DrawerActions extends LitElement {
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
    'pfv6-drawer-actions': Pfv6DrawerActions;
  }
}
