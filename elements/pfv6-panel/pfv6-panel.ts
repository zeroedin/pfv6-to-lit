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
 *
 * @cssprop --pf-v6-c-panel--Width - Width of the panel
 * @cssprop --pf-v6-c-panel--MinWidth - Minimum width of the panel
 * @cssprop --pf-v6-c-panel--MaxWidth - Maximum width of the panel
 * @cssprop --pf-v6-c-panel--BackgroundColor - Background color of the panel
 * @cssprop --pf-v6-c-panel--BoxShadow - Box shadow of the panel
 * @cssprop --pf-v6-c-panel--BorderRadius - Border radius of the panel
 * @cssprop --pf-v6-c-panel--before--BorderWidth - Border width of the ::before pseudo-element
 * @cssprop --pf-v6-c-panel--before--BorderColor - Border color of the ::before pseudo-element
 * @cssprop --pf-v6-c-panel--m-secondary--BackgroundColor - Background color for secondary variant
 * @cssprop --pf-v6-c-panel--m-secondary--before--BorderWidth - Border width for secondary variant
 * @cssprop --pf-v6-c-panel--m-bordered--before--BorderWidth - Border width for bordered variant
 * @cssprop --pf-v6-c-panel--m-bordered--before--BorderColor - Border color for bordered variant
 * @cssprop --pf-v6-c-panel--m-raised--BoxShadow - Box shadow for raised variant
 * @cssprop --pf-v6-c-panel--m-raised--BackgroundColor - Background color for raised variant
 * @cssprop --pf-v6-c-panel--m-raised--before--BorderWidth - Border width for raised variant
 * @cssprop --pf-v6-c-panel--m-scrollable__main--MaxHeight - Maximum height for scrollable main area
 * @cssprop --pf-v6-c-panel--m-scrollable__main--Overflow - Overflow behavior for scrollable main area
 * @cssprop --pf-v6-c-panel--m-scrollable__footer--BoxShadow - Box shadow for scrollable footer
 * @cssprop --pf-v6-c-panel--m-scrollable__footer--PaddingBlockStart - Block start padding for scrollable footer
 * @cssprop --pf-v6-c-panel--m-scrollable__footer--PaddingBlockEnd - Block end padding for scrollable footer
 * @cssprop --pf-v6-c-panel--m-scrollable__footer--BorderColor - Border color for scrollable footer
 * @cssprop --pf-v6-c-panel--m-scrollable__footer--BorderWidth - Border width for scrollable footer
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
