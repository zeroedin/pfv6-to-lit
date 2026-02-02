import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import styles from './pfv6-drawer-panel-body.css';

/**
 * Drawer panel body component for content within the drawer panel.
 *
 * @summary DrawerPanelBody component
 * @alias DrawerPanelBody
 *
 * @slot - Default slot for panel body content
 */
@customElement('pfv6-drawer-panel-body')
export class Pfv6DrawerPanelBody extends LitElement {
  static styles = styles;

  /**
   * Indicates if there should be no padding around the drawer panel body.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-padding' })
  hasNoPadding = false;

  render() {
    const classes = {
      'no-padding': this.hasNoPadding,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-drawer-panel-body': Pfv6DrawerPanelBody;
  }
}
