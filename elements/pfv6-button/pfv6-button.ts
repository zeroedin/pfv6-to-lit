import { LitElement } from 'lit';
import { html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-button.css';
import '../pfv6-spinner/pfv6-spinner.js';

/**
 * Button component for triggering actions.
 *
 * For icon buttons, wrap in semantic HTML or provide accessible label:
 * ```html
 * <pfv6-button accessible-label="Close">
 *   <pfv6-icon slot="icon" icon="times"></pfv6-icon>
 * </pfv6-button>
 * ```
 *
 * @summary A clickable button component
 * @alias Button
 *
 * @slot - Default slot for button text content
 * @slot icon - Icon to display in button (positioned via iconPosition)
 * @slot count - Badge count to display on button
 *
 * @cssprop --pf-v6-c-button--FontSize - Button font size
 * @cssprop --pf-v6-c-button--FontWeight - Button font weight
 * @cssprop --pf-v6-c-button--LineHeight - Button line height
 * @cssprop --pf-v6-c-button--PaddingBlockStart - Button padding block start
 * @cssprop --pf-v6-c-button--PaddingInlineEnd - Button padding inline end
 * @cssprop --pf-v6-c-button--PaddingBlockEnd - Button padding block end
 * @cssprop --pf-v6-c-button--PaddingInlineStart - Button padding inline start
 * @cssprop --pf-v6-c-button--BorderRadius - Button border radius
 * @cssprop --pf-v6-c-button--Color - Button text color
 * @cssprop --pf-v6-c-button--BackgroundColor - Button background color
 * @cssprop --pf-v6-c-button--hover--Color - Button hover text color
 * @cssprop --pf-v6-c-button--hover--BackgroundColor - Button hover background color
 * @cssprop --pf-v6-c-button--active--Color - Button active text color
 * @cssprop --pf-v6-c-button--active--BackgroundColor - Button active background color
 * @cssprop --pf-v6-c-button--disabled--Color - Button disabled text color
 * @cssprop --pf-v6-c-button--disabled--BackgroundColor - Button disabled background color
 */
@customElement('pfv6-button')
export class Pfv6Button extends LitElement {
  static styles = styles;

  /** Delegate focus to the inner button/span element */
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Button variant */
  @property({ type: String, reflect: true })
  variant:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'danger'
    | 'warning'
    | 'link'
    | 'plain'
    | 'control'
    | 'stateful' = 'primary';

  /** Button size */
  @property({ type: String, reflect: true })
  size: 'default' | 'sm' | 'lg' = 'default';

  /** Button type */
  @property({ type: String, reflect: true })
  type: 'button' | 'submit' | 'reset' = 'button';

  /** State for stateful variant */
  @property({ type: String, reflect: true })
  state: 'read' | 'unread' | 'attention' = 'unread';

  /** Block display styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-block' })
  isBlock = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  /** ARIA disabled state (prevents default events but doesn't use disabled attribute) */
  @property({ type: Boolean, reflect: true, attribute: 'is-aria-disabled' })
  isAriaDisabled = false;

  /** Loading state (shows spinner) */
  @property({ type: Boolean, reflect: true, attribute: 'is-loading' })
  isLoading = false;

  /** Inline styling (for link variant) */
  @property({ type: Boolean, reflect: true, attribute: 'is-inline' })
  isInline = false;

  /** Favorite button styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-favorite' })
  isFavorite = false;

  /** Favorited state (for favorite variant) */
  @property({ type: Boolean, reflect: true, attribute: 'is-favorited' })
  isFavorited = false;

  /** Danger styling (for secondary/link variants) */
  @property({ type: Boolean, reflect: true, attribute: 'is-danger' })
  isDanger = false;

  /** Expanded state (required for hamburger variant) */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded?: boolean;

  /** Settings button variant (shows cog icon) */
  @property({ type: Boolean, reflect: true, attribute: 'is-settings' })
  isSettings = false;

  /** Hamburger button variant (shows hamburger icon) */
  @property({ type: Boolean, reflect: true, attribute: 'is-hamburger' })
  isHamburger = false;

  /** Hamburger animation variant */
  @property({ type: String, reflect: true, attribute: 'hamburger-variant' })
  hamburgerVariant?: 'expand' | 'collapse';

  /** No padding (for plain variant) */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-padding' })
  hasNoPadding = false;

  /** Icon position */
  @property({ type: String, reflect: true, attribute: 'icon-position' })
  iconPosition: 'start' | 'end' = 'start';

  /** Clicked state styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-clicked' })
  isClicked = false;

  /** Accessible label for the button */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /** Spinner accessible valuetext */
  @property({ type: String, attribute: 'spinner-accessible-valuetext' })
  spinnerAccessibleValuetext?: string;

  /** Spinner accessible label */
  @property({ type: String, attribute: 'spinner-accessible-label' })
  spinnerAccessibleLabel?: string;

  /**
  * Computes the appropriate tabindex for the inner button/span.
  * With delegatesFocus, the host's native tabindex controls tab order.
  * This only provides tabindex for inline spans (which aren't naturally focusable).
  * Matches React Button's getDefaultTabIdx() logic.
  */
  private getComputedTabIndex(): number | undefined {
    const isInlineLink = this.isInline && this.variant === 'link';

    if (this.isDisabled) {
      // Disabled inline spans need tabindex="-1" to be removed from tab order
      return isInlineLink ? -1 : undefined;
    }
    if (isInlineLink) {
      // Inline link (span) needs tabindex="0" to be focusable for delegatesFocus
      return 0;
    }
    // Regular buttons are naturally focusable, delegatesFocus handles it
    return undefined;
  }

  firstUpdated() {
    // Sync initial disabled state to slotted badges
    this.syncBadgesDisabledState();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Sync disabled state to slotted badges
    if (changedProperties.has('isDisabled')) {
      this.syncBadgesDisabledState();
    }

    // Validate hamburger + isExpanded requirement
    if (changedProperties.has('isHamburger') || changedProperties.has('isExpanded')) {
      if (this.isHamburger && this.isExpanded === undefined) {
        console.error(
          'pfv6-button: when the is-hamburger property is set, you must also provide a '
            + 'boolean value to the is-expanded property. It is expected that a hamburger '
            + 'button controls the expansion of other content.',
        );
      }
    }

    // Validate accessible name for icon-only buttons
    if (
      changedProperties.has('isSettings')
      || changedProperties.has('isHamburger')
      || changedProperties.has('isFavorite')
    ) {
      const isIconOnly = this.isSettings || this.isHamburger || this.isFavorite;
      const hasAccessibleName = this.accessibleLabel || this.hasTextContent();
      if (isIconOnly && !hasAccessibleName) {
        console.error(
          'pfv6-button: you must provide either visible text content or an accessible name '
            + 'via the accessible-label property.',
        );
      }
    }
  }

  private syncBadgesDisabledState(): void {
    const badges = this.querySelectorAll('pfv6-badge[slot="count"]');
    badges.forEach(badge => {
      if (this.isDisabled) {
        badge.setAttribute('is-disabled', '');
      } else {
        badge.removeAttribute('is-disabled');
      }
    });
  }

  private hasTextContent(): boolean {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (!slot) {
      return false;
    }

    const nodes = slot.assignedNodes({ flatten: true });
    return nodes.some(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim().length ?? 0 > 0;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        return (node as Element).textContent?.trim().length ?? 0 > 0;
      }
      return false;
    });
  }

  private renderHamburgerIcon() {
    return html`
      <svg viewBox="0 0 10 10" class="hamburger-icon" width="1em" height="1em">
        <path class="hamburger-icon-top" d="M1,1 L9,1"></path>
        <path class="hamburger-icon-middle" d="M1,5 L9,5"></path>
        <path class="hamburger-icon-arrow" d="M1,5 L1,5 L1,5"></path>
        <path class="hamburger-icon-bottom" d="M9,9 L1,9"></path>
      </svg>
    `;
  }

  private renderSettingsIcon() {
    return html`
      <svg viewBox="0 0 512 512" class="settings-icon" width="1em" height="1em" aria-hidden="true" role="img">
        <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
      </svg>
    `;
  }

  private renderFavoriteIcons() {
    return html`
      <span class="icon-favorite">
        <svg viewBox="0 0 576 512" width="1em" height="1em" aria-hidden="true" role="img">
          <path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
        </svg>
      </span>
      <span class="icon-favorited">
        <svg viewBox="0 0 576 512" width="1em" height="1em" aria-hidden="true" role="img">
          <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
        </svg>
      </span>
    `;
  }

  private renderIcon() {
    const hasSlottedIcon = this.querySelector('[slot="icon"]');
    const shouldOverrideIcon = this.isSettings || this.isHamburger || this.isFavorite;
    const hasTextContent = this.hasTextContent();

    let iconContent;

    if (this.isFavorite) {
      iconContent = this.renderFavoriteIcons();
    } else if (this.isSettings) {
      iconContent = this.renderSettingsIcon();
    } else if (this.isHamburger) {
      iconContent = this.renderHamburgerIcon();
    } else if (hasSlottedIcon && !shouldOverrideIcon) {
      iconContent = html`<slot name="icon"></slot>`;
    }

    if (!iconContent) {
      return null;
    }

    const classes = {
      'icon-start': hasTextContent && this.iconPosition === 'start',
      'icon-end': hasTextContent && this.iconPosition === 'end',
    };

    return html`
      <span class="icon ${classMap(classes)}">
        ${iconContent}
      </span>
    `;
  }

  private handleClick(event: MouseEvent) {
    if (this.isAriaDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (this.isAriaDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  render() {
    const classes = {
      [this.variant]: true,
      'settings': this.isSettings,
      'hamburger': this.isHamburger,
      'expand': this.isHamburger && this.hamburgerVariant === 'expand',
      'collapse': this.isHamburger && this.hamburgerVariant === 'collapse',
      'block': this.isBlock,
      'disabled': this.isDisabled,
      'aria-disabled': this.isAriaDisabled,
      'clicked': this.isClicked,
      'inline': this.isInline && this.variant === 'link',
      'favorite': this.isFavorite,
      'favorited': this.isFavorite && this.isFavorited,
      'danger': this.variant === 'danger'
        || (this.isDanger && (this.variant === 'secondary' || this.variant === 'link')),
      'progress': this.isLoading && this.variant !== 'plain',
      'in-progress': this.isLoading,
      'no-padding': this.hasNoPadding && this.variant === 'plain',
      [this.state]: this.variant === 'stateful',
      'small': this.size === 'sm',
      'display-lg': this.size === 'lg',
    };

    const hasTextContent = this.hasTextContent();
    const icon = this.renderIcon();
    const textContent = hasTextContent ? html`<span class="text"><slot></slot></span>` : html`<slot></slot>`;

    const isInlineLink = this.isInline && this.variant === 'link';

    const content = html`
      ${this.isLoading ? html`
        <span class="progress">
          <pfv6-spinner
            size="md"
            ?is-inline=${this.isInline}
            accessible-valuetext=${ifDefined(this.spinnerAccessibleValuetext)}
            accessible-label=${ifDefined(this.spinnerAccessibleLabel)}
          ></pfv6-spinner>
        </span>
      ` : null}
      ${this.iconPosition === 'end' ? html`
        ${textContent}
        ${icon}
      ` : html`
        ${icon}
        ${textContent}
      `}
      ${this.querySelector('[slot="count"]') ? html`
        <span class="count">
          <slot name="count"></slot>
        </span>
      ` : null}
    `;

    return isInlineLink ? html`
      <span
        id="container"
        class=${classMap(classes)}
        role="button"
        tabindex=${ifDefined(this.getComputedTabIndex())}
        aria-disabled=${this.isAriaDisabled ? 'true' : 'false'}
        aria-label=${ifDefined(this.accessibleLabel)}
        @click=${this.handleClick}
        @keydown=${this.handleKeyPress}
      >
        ${content}
      </span>
    ` : html`
      <button
        id="container"
        class=${classMap(classes)}
        type=${this.type}
        ?disabled=${this.isDisabled}
        aria-disabled=${this.isAriaDisabled ? 'true' : 'false'}
        aria-expanded=${ifDefined(this.isExpanded !== undefined ? String(this.isExpanded) : undefined)}
        aria-label=${ifDefined(this.accessibleLabel)}
        tabindex=${ifDefined(this.getComputedTabIndex())}
        @click=${this.handleClick}
        @keypress=${this.handleKeyPress}
      >
        ${content}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-button': Pfv6Button;
  }
}
