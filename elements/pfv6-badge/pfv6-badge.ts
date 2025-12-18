import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-badge.css';

/**
 * Badge component for displaying counts or status indicators.
 *
 * @slot - Default slot for badge content (typically numbers or short text)
 *
 * @cssprop --pf-v6-c-badge--BackgroundColor - Background color of the badge
 * @cssprop --pf-v6-c-badge--Color - Text color of the badge
 * @cssprop --pf-v6-c-badge--FontSize - Font size of the badge
 * @cssprop --pf-v6-c-badge--MinWidth - Minimum width of the badge
 * @cssprop --pf-v6-c-badge--PaddingRight - Right padding of the badge
 * @cssprop --pf-v6-c-badge--PaddingLeft - Left padding of the badge
 * @cssprop --pf-v6-c-badge--m-read--BackgroundColor - Background color when read
 * @cssprop --pf-v6-c-badge--m-read--Color - Text color when read
 * @cssprop --pf-v6-c-badge--m-unread--BackgroundColor - Background color when unread
 * @cssprop --pf-v6-c-badge--m-unread--Color - Text color when unread
 */
@customElement('pfv6-badge')
export class Pfv6Badge extends LitElement {
  static styles = styles;

  /**
   * Adds styling to the badge to indicate it has been read.
   * When true, badge uses read styling (typically muted colors).
   * When false, badge uses unread styling (typically bold/prominent colors).
   */
  @property({ type: String, reflect: true, attribute: 'is-read' })
  isRead: 'true' | 'false' = 'false';

  /**
   * Adds styling to the badge to indicate it is disabled.
   * Disabled badges appear visually muted and non-interactive.
   */
  @property({ type: String, reflect: true, attribute: 'is-disabled' })
  isDisabled: 'true' | 'false' = 'false';

  /**
   * Text announced by screen readers to provide context about the badge.
   * Example: "Unread Messages" for a notification count badge.
   */
  @property({ type: String, attribute: 'screen-reader-text' })
  screenReaderText?: string;

  render() {
    const classes = {
      read: this.isRead === 'true',
      unread: this.isRead === 'false',
      disabled: this.isDisabled === 'true'
    };

    return html`
      <span id="badge" class=${classMap(classes)}>
        <slot></slot>
        ${this.screenReaderText ? html`
          <span id="screen-reader-text">${this.screenReaderText}</span>
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
