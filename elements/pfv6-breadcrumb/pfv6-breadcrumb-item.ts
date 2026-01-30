import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-breadcrumb-item.css';

/**
 * Breadcrumb item component representing a single item in the breadcrumb trail.
 *
 * @alias BreadcrumbItem
 * @summary Individual item in a breadcrumb navigation trail
 * @slot - Default slot for item content
 * @slot icon - Optional slot for custom divider icon
 * @cssprop --pf-v6-c-breadcrumb__item-divider--Color - Color for divider icon
 * @cssprop --pf-v6-c-breadcrumb__item-divider--MarginInlineEnd - Right margin for divider
 * @cssprop --pf-v6-c-breadcrumb__item-divider--FontSize - Font size for divider
 * @cssprop --pf-v6-c-breadcrumb__link--PaddingInlineStart - Left padding for link
 * @cssprop --pf-v6-c-breadcrumb__link--PaddingInlineEnd - Right padding for link
 * @cssprop --pf-v6-c-breadcrumb__link--Color - Color for link
 * @cssprop --pf-v6-c-breadcrumb__link--TextDecorationLine - Text decoration line for link
 * @cssprop --pf-v6-c-breadcrumb__link--TextDecorationStyle - Text decoration style for link
 * @cssprop --pf-v6-c-breadcrumb__link--hover--Color - Color for link on hover
 * @cssprop --pf-v6-c-breadcrumb__link--hover--TextDecorationLine - Text decoration line for link on hover
 * @cssprop --pf-v6-c-breadcrumb__link--hover--TextDecorationStyle - Text decoration style for link on hover
 * @cssprop --pf-v6-c-breadcrumb__link--m-current--Color - Color for current/active link
 * @cssprop --pf-v6-c-breadcrumb__link--BackgroundColor - Background color for link
 * @cssprop --pf-v6-c-breadcrumb__menu-toggle--MarginBlockStart - Top margin for menu toggle
 * @cssprop --pf-v6-c-breadcrumb__menu-toggle--MarginInlineEnd - Right margin for menu toggle
 * @cssprop --pf-v6-c-breadcrumb__menu-toggle--MarginBlockEnd - Bottom margin for menu toggle
 * @cssprop --pf-v6-c-breadcrumb__menu-toggle--MarginInlineStart - Left margin for menu toggle
 */
@customElement('pfv6-breadcrumb-item')
export class Pfv6BreadcrumbItem extends LitElement {
  static styles = styles;

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  readonly #internals = this.attachInternals();

  constructor() {
    super();
    this.#internals.role = 'listitem';
  }

  /**
   * HREF for breadcrumb link.
   */
  @property({ type: String })
  to?: string | undefined;

  /**
   * Flag indicating whether the item is active.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-active' })
  isActive = false;

  /**
   * Flag indicating whether the item contains a dropdown.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-dropdown' })
  isDropdown = false;

  /**
   * Target for breadcrumb link.
   */
  @property({ type: String })
  target?: string | undefined;

  /**
   * Internal state to track if this is the first item.
   */
  @state()
  private showDivider = false;

  connectedCallback() {
    super.connectedCallback();
    this.#updateShowDivider();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Re-check divider visibility if parent changes
    if (changedProperties.has('isActive') || changedProperties.has('isDropdown')) {
      this.#updateShowDivider();
    }
  }

  #updateShowDivider() {
    // Check if this is the first breadcrumb item in the parent
    const parent = this.parentElement;
    if (parent && parent.tagName === 'PFV6-BREADCRUMB') {
      const selector = 'pfv6-breadcrumb-item, pfv6-breadcrumb-heading';
      const items = Array.from(parent.querySelectorAll(selector));
      const index = items.indexOf(this);
      this.showDivider = index > 0;
    }
  }

  render() {
    const linkClasses = {
      link: true,
      current: this.isActive,
    };

    const ariaCurrent = this.isActive ? 'page' : undefined;

    return html`
      ${this.showDivider ? html`
        <span id="divider">
          <slot name="icon">
            <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true" role="img">
              <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
            </svg>
          </slot>
        </span>
      ` : null}

      ${this.isDropdown ? html`
        <span id="dropdown">
          <slot></slot>
        </span>
      ` : this.to ? html`
        <a
          id="link"
          class=${classMap(linkClasses)}
          href=${this.to}
          target=${ifDefined(this.target)}
          aria-current=${ifDefined(ariaCurrent)}
        >
          <slot></slot>
        </a>
      ` : html`
        <button
          id="link"
          class=${classMap(linkClasses)}
          aria-current=${ifDefined(ariaCurrent)}
          type="button"
        >
          <slot></slot>
        </button>
      `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-breadcrumb-item': Pfv6BreadcrumbItem;
  }
}
