import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-banner.css';

/**
 * Banner component for displaying prominent messages or notifications.
 *
 * @summary Banner displays prominent messages at the top of a page or section
 * @alias Banner
 *
 * @slot - Default slot for banner content
 *
 * @cssprop --pf-v6-c-banner--PaddingBlockStart - Block start (top) padding of the banner
 * @cssprop --pf-v6-c-banner--PaddingBlockEnd - Block end (bottom) padding of the banner
 * @cssprop --pf-v6-c-banner--PaddingInlineStart - Inline start (left/right in LTR/RTL) padding of the banner
 * @cssprop --pf-v6-c-banner--PaddingInlineEnd - Inline end (right/left in LTR/RTL) padding of the banner
 * @cssprop --pf-v6-c-banner--md--PaddingInlineStart - Inline start padding at md breakpoint
 * @cssprop --pf-v6-c-banner--md--PaddingInlineEnd - Inline end padding at md breakpoint
 * @cssprop --pf-v6-c-banner--FontSize - Font size of the banner text
 * @cssprop --pf-v6-c-banner--Color - Text color of the banner
 * @cssprop --pf-v6-c-banner--BackgroundColor - Background color of the banner
 * @cssprop --pf-v6-c-banner--BorderColor - Border color of the banner
 * @cssprop --pf-v6-c-banner--BorderWidth - Border width of the banner
 * @cssprop --pf-v6-c-banner--link--Color - Color of links inside the banner
 * @cssprop --pf-v6-c-banner--link--TextDecoration - Text decoration of links inside the banner
 * @cssprop --pf-v6-c-banner--link--hover--Color - Color of links on hover inside the banner
 * @cssprop --pf-v6-c-banner--link--disabled--Color - Color of disabled links inside the banner
 * @cssprop --pf-v6-c-banner--m-sticky--ZIndex - Z-index of sticky banner
 * @cssprop --pf-v6-c-banner--m-sticky--BoxShadow - Box shadow of sticky banner
 * @cssprop --pf-v6-c-banner--m-danger--BackgroundColor - Background color for danger status
 * @cssprop --pf-v6-c-banner--m-danger--Color - Text color for danger status
 * @cssprop --pf-v6-c-banner--m-success--BackgroundColor - Background color for success status
 * @cssprop --pf-v6-c-banner--m-success--Color - Text color for success status
 * @cssprop --pf-v6-c-banner--m-warning--BackgroundColor - Background color for warning status
 * @cssprop --pf-v6-c-banner--m-warning--Color - Text color for warning status
 * @cssprop --pf-v6-c-banner--m-info--BackgroundColor - Background color for info status
 * @cssprop --pf-v6-c-banner--m-info--Color - Text color for info status
 * @cssprop --pf-v6-c-banner--m-custom--BackgroundColor - Background color for custom status
 * @cssprop --pf-v6-c-banner--m-custom--Color - Text color for custom status
 * @cssprop --pf-v6-c-banner--m-red--BackgroundColor - Background color for red variant
 * @cssprop --pf-v6-c-banner--m-red--Color - Text color for red variant
 * @cssprop --pf-v6-c-banner--m-orangered--BackgroundColor - Background color for orangered variant
 * @cssprop --pf-v6-c-banner--m-orangered--Color - Text color for orangered variant
 * @cssprop --pf-v6-c-banner--m-orange--BackgroundColor - Background color for orange variant
 * @cssprop --pf-v6-c-banner--m-orange--Color - Text color for orange variant
 * @cssprop --pf-v6-c-banner--m-yellow--BackgroundColor - Background color for yellow variant
 * @cssprop --pf-v6-c-banner--m-yellow--Color - Text color for yellow variant
 * @cssprop --pf-v6-c-banner--m-green--BackgroundColor - Background color for green variant
 * @cssprop --pf-v6-c-banner--m-green--Color - Text color for green variant
 * @cssprop --pf-v6-c-banner--m-teal--BackgroundColor - Background color for teal variant
 * @cssprop --pf-v6-c-banner--m-teal--Color - Text color for teal variant
 * @cssprop --pf-v6-c-banner--m-blue--BackgroundColor - Background color for blue variant
 * @cssprop --pf-v6-c-banner--m-blue--Color - Text color for blue variant
 * @cssprop --pf-v6-c-banner--m-purple--BackgroundColor - Background color for purple variant
 * @cssprop --pf-v6-c-banner--m-purple--Color - Text color for purple variant
 */
@customElement('pfv6-banner')
export class Pfv6Banner extends LitElement {
  static styles = styles;

  /**
   * If set to true, the banner sticks to the top of its container
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-sticky' })
  isSticky = false;

  /**
   * Text announced by screen readers to indicate the type of banner.
   * This prop should only be passed in when the banner conveys status/severity.
   */
  @property({ type: String, attribute: 'screen-reader-text' })
  screenReaderText?: string;

  /**
   * Color options for the banner, will be overwritten by any applied using the status prop.
   * Valid values: 'red', 'orangered', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple'
   */
  @property({ type: String, reflect: true })
  color?: 'red' | 'orangered' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple';

  /**
   * Status style options for the banner, will overwrite any color applied using the color prop.
   * Valid values: 'success', 'warning', 'danger', 'info', 'custom'
   */
  @property({ type: String, reflect: true })
  status?: 'success' | 'warning' | 'danger' | 'info' | 'custom';

  render() {
    const classes = {
      sticky: this.isSticky,
      // Status takes precedence over color
      success: this.status === 'success',
      warning: this.status === 'warning',
      danger: this.status === 'danger',
      info: this.status === 'info',
      custom: this.status === 'custom',
      // Color modifiers (only applied if status is not set)
      red: !this.status && this.color === 'red',
      orangered: !this.status && this.color === 'orangered',
      orange: !this.status && this.color === 'orange',
      yellow: !this.status && this.color === 'yellow',
      green: !this.status && this.color === 'green',
      teal: !this.status && this.color === 'teal',
      blue: !this.status && this.color === 'blue',
      purple: !this.status && this.color === 'purple',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        ${this.screenReaderText ? html`
          <span class="screen-reader">${this.screenReaderText}</span>
        ` : null}
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-banner': Pfv6Banner;
  }
}
