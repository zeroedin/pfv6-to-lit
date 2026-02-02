import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import styles from './pfv6-drawer-content-body.css';

/**
 * Drawer content body component for the main content area within DrawerContent.
 *
 * @summary DrawerContentBody component
 * @alias DrawerContentBody
 *
 * @slot - Default slot for content body
 */
@customElement('pfv6-drawer-content-body')
export class Pfv6DrawerContentBody extends LitElement {
  static styles = styles;

  /**
   * Indicates if there should be padding around the drawer content body.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-padding' })
  hasPadding = false;

  render() {
    const classes = {
      padding: this.hasPadding,
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
    'pfv6-drawer-content-body': Pfv6DrawerContentBody;
  }
}
