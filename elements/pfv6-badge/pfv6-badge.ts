import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-badge.css';

/**
 * Badge component for displaying counts or status indicators.
 *
 * @alias Badge
 *
 * @slot - Default slot for badge content (typically numbers or short text)
 *
 * @cssprop --pf-v6-c-badge--BorderColor - Border color of the badge
 * @cssprop --pf-v6-c-badge--BorderWidth - Border width of the badge
 * @cssprop --pf-v6-c-badge--BorderRadius - Border radius of the badge
 * @cssprop --pf-v6-c-badge--FontSize - Font size of the badge
 * @cssprop --pf-v6-c-badge--FontWeight - Font weight of the badge
 * @cssprop --pf-v6-c-badge--PaddingInlineEnd - Inline end padding of the badge
 * @cssprop --pf-v6-c-badge--PaddingInlineStart - Inline start padding of the badge
 * @cssprop --pf-v6-c-badge--Color - Text color of the badge
 * @cssprop --pf-v6-c-badge--MinWidth - Minimum width of the badge
 * @cssprop --pf-v6-c-badge--BackgroundColor - Background color of the badge
 * @cssprop --pf-v6-c-badge--m-read--BackgroundColor - Background color when read
 * @cssprop --pf-v6-c-badge--m-read--Color - Text color when read
 * @cssprop --pf-v6-c-badge--m-read--BorderColor - Border color when read
 * @cssprop --pf-v6-c-badge--m-unread--BackgroundColor - Background color when unread
 * @cssprop --pf-v6-c-badge--m-unread--Color - Text color when unread
 * @cssprop --pf-v6-c-badge--m-disabled--Color - Text color when disabled
 * @cssprop --pf-v6-c-badge--m-disabled--BorderColor - Border color when disabled
 * @cssprop --pf-v6-c-badge--m-disabled--BackgroundColor - Background color when disabled
 */
@customElement('pfv6-badge')
export class Pfv6Badge extends LitElement {
  static styles = styles;

  /**
  * Adds styling to the badge to indicate it has been read.
  * When true, badge uses read styling (typically muted colors).
  * When false, badge uses unread styling (typically bold/prominent colors).
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-read' })
  isRead = false;

  /**
  * Adds styling to the badge to indicate it is disabled.
  * Disabled badges appear visually muted and non-interactive.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  /**
  * Text announced by screen readers to provide context about the badge.
  * Example: "Unread Messages" for a notification count badge.
  */
  @property({ type: String, attribute: 'screen-reader-text' })
  screenReaderText?: string | undefined;

  render() {
    const classes = {
      read: this.isRead,
      unread: !this.isRead,
      disabled: this.isDisabled,
    };

    return html`
      <span id="badge" class=${classMap(classes)}>
        <slot></slot>
        ${this.screenReaderText ? html`
          <span class="screen-reader">${this.screenReaderText}</span>
        ` : ''}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-badge': Pfv6Badge;
  }
}
