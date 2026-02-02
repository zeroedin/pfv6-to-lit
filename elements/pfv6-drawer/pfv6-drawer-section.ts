import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import styles from './pfv6-drawer-section.css';

/**
 * Drawer section component for sectioned content within the drawer.
 *
 * @summary DrawerSection component
 * @alias DrawerSection
 *
 * @slot - Default slot for section content
 *
 * @cssprop --pf-v6-c-drawer__section--BackgroundColor - Section background color
 */
@customElement('pfv6-drawer-section')
export class Pfv6DrawerSection extends LitElement {
  static styles = styles;

  /**
   * Color variant of the background of the drawer section.
   */
  @property({ type: String, reflect: true, attribute: 'color-variant' })
  colorVariant: 'default' | 'secondary' | 'no-background' = 'default';

  render() {
    const classes = {
      'no-background': this.colorVariant === 'no-background',
      'secondary': this.colorVariant === 'secondary',
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
    'pfv6-drawer-section': Pfv6DrawerSection;
  }
}
