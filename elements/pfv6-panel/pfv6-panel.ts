import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

// Auto-import sub-components
import './pfv6-panel-header.js';
import './pfv6-panel-main.js';
import './pfv6-panel-main-body.js';
import './pfv6-panel-footer.js';

import styles from './pfv6-panel.css';

/**
 * Panel component - A container that provides structured content with optional header, main content area, and footer.
 *
 * @alias Panel
 *
 * @slot - Default slot for panel content (typically PanelHeader, PanelMain, PanelFooter)
 *
 * @csspart container - The container element
 */
@customElement('pfv6-panel')
export class Pfv6Panel extends LitElement {
  static styles = styles;

  /**
  * Adds panel variant styles
  */
  @property({ type: String, reflect: true })
  variant?: 'raised' | 'bordered' | 'secondary';

  /**
  * Flag to add scrollable styling to the panel
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-scrollable' })
  isScrollable = false;

  render() {
    const classes = {
      raised: this.variant === 'raised',
      bordered: this.variant === 'bordered',
      secondary: this.variant === 'secondary',
      scrollable: this.isScrollable,
    };

    return html`
      <div id="container" class=${classMap(classes)} part="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-panel': Pfv6Panel;
  }
}
