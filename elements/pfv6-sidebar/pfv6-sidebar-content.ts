import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import styles from './pfv6-sidebar-content.css';

/**
 * Sidebar content component - Contains the main content area of a sidebar.
 *
 * @slot - Default slot for content
 */
@customElement('pfv6-sidebar-content')
export class Pfv6SidebarContent extends LitElement {
  static readonly styles = styles;

  /**
  * Removes the background color
  */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-background' })
  hasNoBackground = false;

  /**
  * Adds padding to the content
  */
  @property({ type: Boolean, reflect: true, attribute: 'has-padding' })
  hasPadding = false;

  /**
  * Variant of the sidebar content background
  * @type {'default' | 'secondary'}
  * @default 'default'
  */
  @property({ type: String, reflect: true, attribute: 'background-variant' })
  backgroundVariant: 'default' | 'secondary' = 'default';

  render() {
    const classes = {
      'no-background': this.hasNoBackground,
      'padding': this.hasPadding,
      'secondary': this.backgroundVariant === 'secondary'
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
    'pfv6-sidebar-content': Pfv6SidebarContent;
  }
}
