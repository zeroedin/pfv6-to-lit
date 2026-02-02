import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import styles from './pfv6-drawer-panel-description.css';

/**
 * Provides a description within the drawer panel.
 * This should typically follow the drawer head.
 *
 * @summary DrawerPanelDescription component
 * @alias DrawerPanelDescription
 *
 * @slot - Default slot for description content
 */
@customElement('pfv6-drawer-panel-description')
export class Pfv6DrawerPanelDescription extends LitElement {
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
    'pfv6-drawer-panel-description': Pfv6DrawerPanelDescription;
  }
}
