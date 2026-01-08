import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import { responsivePropertyConverter } from '../../lib/converters.js';

import styles from './pfv6-sidebar-panel.css';

/**
 * Sidebar panel component - A panel that can be positioned on the side of the content.
 *
 * @slot - Default slot for panel content
 */
@customElement('pfv6-sidebar-panel')
export class Pfv6SidebarPanel extends LitElement {
  static readonly styles = styles;

  /**
  * Indicates whether the panel is positioned statically or sticky to the top.
  * Default is sticky on small screens when the orientation is stack, and static
  * on medium and above screens when the orientation is split.
  *
  * @default 'default'
  */
  @property({ type: String, reflect: true })
  variant: 'default' | 'sticky' | 'static' = 'default';

  /**
  * Removes the background color
  */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-background' })
  hasNoBackground = false;

  /**
  * Adds padding to the panel
  */
  @property({ type: Boolean, reflect: true, attribute: 'has-padding' })
  hasPadding = false;

  /**
  * Sets the panel width at various breakpoints.
  * Format: "value breakpoint:value" (e.g., "width_25 md:width_50 lg:width_33")
  *
  * Values: default | width_25 | width_33 | width_50 | width_66 | width_75 | width_100
  *
  * @example
  * <pfv6-sidebar-panel width="width_25 md:width_50"></pfv6-sidebar-panel>
  */
  @property({ converter: responsivePropertyConverter })
  width?: Record<string, string>;

  /**
  * Variant of the sidebar panel background
  * @default 'default'
  */
  @property({ type: String, reflect: true, attribute: 'background-variant' })
  backgroundVariant: 'default' | 'secondary' = 'default';

  render() {
    const classes: Record<string, boolean> = {
      'sticky': this.variant === 'sticky',
      'static': this.variant === 'static',
      'no-background': this.hasNoBackground,
      'padding': this.hasPadding,
      'secondary': this.backgroundVariant === 'secondary',
    };

    // Add width modifier classes
    if (this.width) {
      Object.entries(this.width).forEach(([breakpoint, value]) => {
        const key = breakpoint === 'default' ? value : `${value}-on-${breakpoint}`;
        classes[key] = true;
      });
    }

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-sidebar-panel': Pfv6SidebarPanel;
  }
}
