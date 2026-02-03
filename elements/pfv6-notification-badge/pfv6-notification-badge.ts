import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-notification-badge.css';

/**
 * Event fired when the notification badge animation ends.
 */
export class Pfv6NotificationBadgeAnimationEndEvent extends Event {
  constructor() {
    super('animation-end', { bubbles: true, composed: true });
  }
}

/**
 * Notification badge component for displaying notification status with icons and counts.
 *
 * @summary Notification badge for displaying notification states
 * @alias NotificationBadge
 *
 * @fires Pfv6NotificationBadgeAnimationEndEvent - Fired when notification animation ends
 * @slot - Default slot for custom content (alternative to count)
 *
 * @cssprop --pf-v6-c-button--m-read--BackgroundColor - Read variant background color
 * @cssprop --pf-v6-c-button--m-read--BorderColor - Read variant border color
 * @cssprop --pf-v6-c-button--m-unread--Color - Unread variant text color
 * @cssprop --pf-v6-c-button--m-unread--BackgroundColor - Unread variant background color
 * @cssprop --pf-v6-c-button--m-unread__icon--Color - Unread variant icon color
 * @cssprop --pf-v6-c-button--m-attention--Color - Attention variant text color
 * @cssprop --pf-v6-c-button--m-attention--BackgroundColor - Attention variant background color
 * @cssprop --pf-v6-c-button--m-attention__icon--Color - Attention variant icon color
 * @cssprop --pf-v6-c-button--Gap - Gap between icon and content
 * @cssprop --pf-v6-c-button--PaddingBlockStart - Top padding
 * @cssprop --pf-v6-c-button--PaddingInlineEnd - Right padding
 * @cssprop --pf-v6-c-button--PaddingBlockEnd - Bottom padding
 * @cssprop --pf-v6-c-button--PaddingInlineStart - Left padding
 */
@customElement('pfv6-notification-badge')
export class Pfv6NotificationBadge extends LitElement {
  static readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  #internals = this.attachInternals();

  constructor() {
    super();
    this.#internals.role = 'button';
    this.#internals.ariaExpanded = 'false';
  }

  /** Adds an accessible label to the notification badge */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** A number displayed in the badge alongside the icon */
  @property({ type: Number })
  count = 0;

  /**
   * Flag for applying expanded styling and setting the aria-expanded attribute on the
   * notification badge
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** Determines the variant of the notification badge */
  @property({ type: String, reflect: true })
  variant: 'read' | 'unread' | 'attention' = 'read';

  /**
   * Flag indicating whether the notification badge animation should be triggered. Each
   * time this prop is true, the animation will be triggered a single time
   */
  @property({ type: Boolean, attribute: 'should-notify' })
  shouldNotify = false;

  /** Internal state to track animation */
  @state()
  private isAnimating = false;

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('shouldNotify')) {
      this.isAnimating = this.shouldNotify;
    }

    // Update ElementInternals ARIA properties
    if (changedProperties.has('accessibleLabel')) {
      this.#internals.ariaLabel = this.accessibleLabel ?? null;
    }
    if (changedProperties.has('isExpanded')) {
      this.#internals.ariaExpanded = this.isExpanded ? 'true' : 'false';
    }
  }

  #handleAnimationEnd = () => {
    this.dispatchEvent(new Pfv6NotificationBadgeAnimationEndEvent());
    this.isAnimating = false;
  };

  #handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  #handleClick = (event: MouseEvent) => {
    // Forward click event
    this.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: event.cancelable,
      detail: event.detail,
      clientX: event.clientX,
      clientY: event.clientY,
    }));
  };

  render() {
    const hasCount = this.count > 0;
    const isAttention = this.variant === 'attention';

    const classes = {
      notify: this.isAnimating,
      read: this.variant === 'read',
      unread: this.variant === 'unread',
      attention: this.variant === 'attention',
      clicked: this.isExpanded,
    };

    // Bell icon SVG path (read/unread variants) - matches PatternFly bell icon
    const bellIconPath = [
      'M448,0 C465.333333,0 480.333333,6.33333333 493,19 C505.666667,31.6666667 ',
      '512,46.6666667 512,64 L512,106 L514.23,106.45 C587.89,121.39 648.48,157.24 ',
      '696,214 C744,271.333333 768,338.666667 768,416 C768,500 780,568.666667 804,622 ',
      'C818.666667,652.666667 841.333333,684 872,716 C873.773676,718.829136 ',
      '875.780658,721.505113 878,724 C890,737.333333 896,752.333333 896,769 ',
      'C896,785.666667 890,800.333333 878,813 C866,825.666667 850.666667,832 832,832 ',
      'L63.3,832 C44.9533333,831.84 29.8533333,825.506667 18,813 C6,800.333333 ',
      '0,785.666667 0,769 C0,752.333333 6,737.333333 18,724 L24,716 L25.06,714.9 ',
      'C55.1933333,683.28 77.5066667,652.313333 92,622 C116,568.666667 128,500 128,416 ',
      'C128,338.666667 152,271.333333 200,214 C248,156.666667 309.333333,120.666667 ',
      '384,106 L384,63.31 C384.166667,46.27 390.5,31.5 403,19 C415.666667,6.33333333 ',
      '430.666667,0 448,0 Z M576,896 L576,897.08 C575.74,932.6 563.073333,962.573333 ',
      '538,987 C512.666667,1011.66667 482.666667,1024 448,1024 C413.333333,1024 ',
      '383.333333,1011.66667 358,987 C332.666667,962.333333 320,932 320,896 L576,896 Z',
    ].join('');

    // Attention bell icon SVG path - bell with exclamation mark
    const attentionBellIconPath = [
      'M448,0 C465.333333,0 480.333333,6.33333333 493,19 C505.666667,31.6666667 ',
      '512,46.6666667 512,64 L512,106 L514.23,106.45 C587.89,121.39 648.48,157.24 ',
      '696,214 C744,271.333333 768,338.666667 768,416 C768,500 780,568.666667 804,622 ',
      'C818.666667,652.666667 841.333333,684 872,716 C873.773676,718.829136 ',
      '875.780658,721.505113 878,724 C890,737.333333 896,752.333333 896,769 ',
      'C896,785.666667 890,800.333333 878,813 C866,825.666667 850.666667,832 832,832 ',
      'L63.3,832 C44.9533333,831.84 29.8533333,825.506667 18,813 C6,800.333333 ',
      '0,785.666667 0,769 C0,752.333333 6,737.333333 18,724 L24,716 L25.06,714.9 ',
      'C55.1933333,683.28 77.5066667,652.313333 92,622 C116,568.666667 128,500 128,416 ',
      'C128,338.666667 152,271.333333 200,214 C248,156.666667 309.333333,120.666667 ',
      '384,106 L384,63.31 C384.166667,46.27 390.5,31.5 403,19 C415.666667,6.33333333 ',
      '430.666667,0 448,0 Z M576,896 L576,897.08 C575.74,932.6 563.073333,962.573333 ',
      '538,987 C512.666667,1011.66667 482.666667,1024 448,1024 C413.333333,1024 ',
      '383.333333,1011.66667 358,987 C332.666667,962.333333 320,932 320,896 L576,896 Z ',
      'M475,192 L421,192 C400.565464,192 384,208.565464 384,229 L384,539 ',
      'C384,559.434536 400.565464,576 421,576 L475,576 C495.434536,576 512,559.434536 ',
      '512,539 L512,229 C512,208.565464 495.434536,192 475,192 Z M448,640 ',
      'C412.653776,640 384,668.653776 384,704 C384,739.346224 412.653776,768 448,768 ',
      'C483.346224,768 512,739.346224 512,704 C512,668.653776 483.346224,640 448,640 Z',
    ].join('');

    const iconPath = isAttention ? attentionBellIconPath : bellIconPath;

    // Determine notification content
    let notificationContent = null;
    if (hasCount) {
      notificationContent = html`<span class="content">${this.count}</span>`;
    } else {
      notificationContent = html`<slot></slot>`;
    }

    return html`
      <div
        id="container"
        tabindex="0"
        class=${classMap(classes)}
        @click=${this.#handleClick}
        @keydown=${this.#handleKeydown}
        @animationend=${this.#handleAnimationEnd}
      >
        <span class="icon">
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 896 1024" aria-hidden="true">
            <path d=${iconPath}></path>
          </svg>
        </span>
        ${notificationContent}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-notification-badge': Pfv6NotificationBadge;
  }
}
