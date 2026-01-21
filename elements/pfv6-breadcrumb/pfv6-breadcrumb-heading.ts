import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-breadcrumb-heading.css';

/**
 * Breadcrumb heading component representing the current page in the breadcrumb trail.
 *
 * @alias BreadcrumbHeading
 * @summary Heading element for the current page in a breadcrumb navigation
 * @slot - Default slot for heading content
 * @slot icon - Optional slot for custom divider icon
 * @cssprop --pf-v6-c-breadcrumb__item-divider--Color - Color for divider icon
 * @cssprop --pf-v6-c-breadcrumb__item-divider--MarginInlineEnd - Right margin for divider
 * @cssprop --pf-v6-c-breadcrumb__item-divider--FontSize - Font size for divider
 * @cssprop --pf-v6-c-breadcrumb__heading--FontSize - Font size for heading
 * @cssprop --pf-v6-c-breadcrumb__link--PaddingInlineStart - Left padding for link
 * @cssprop --pf-v6-c-breadcrumb__link--PaddingInlineEnd - Right padding for link
 * @cssprop --pf-v6-c-breadcrumb__link--Color - Color for link
 * @cssprop --pf-v6-c-breadcrumb__link--TextDecorationLine - Text decoration line for link
 * @cssprop --pf-v6-c-breadcrumb__link--TextDecorationStyle - Text decoration style for link
 * @cssprop --pf-v6-c-breadcrumb__link--hover--Color - Color for link on hover
 * @cssprop --pf-v6-c-breadcrumb__link--hover--TextDecorationLine - Text decoration line for link on hover
 * @cssprop --pf-v6-c-breadcrumb__link--hover--TextDecorationStyle - Text decoration style for link on hover
 * @cssprop --pf-v6-c-breadcrumb__link--m-current--Color - Color for current link
 * @cssprop --pf-v6-c-breadcrumb__link--BackgroundColor - Background color for link
 */
@customElement('pfv6-breadcrumb-heading')
export class Pfv6BreadcrumbHeading extends LitElement {
  static styles = styles;

  readonly #internals = this.attachInternals();

  constructor() {
    super();
    this.#internals.role = 'listitem';
  }

  /**
   * HREF for breadcrumb link.
   */
  @property({ type: String })
  to?: string;

  /**
   * Target for breadcrumb link.
   */
  @property({ type: String })
  target?: string;

  /**
   * Component type to render.
   * @default 'a'
   */
  @property({ type: String })
  component: 'a' | 'button' = 'a';

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
    if (changedProperties.has('to') || changedProperties.has('component')) {
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
      current: true,
    };

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

      <h1 id="heading">
        ${this.component === 'button' && !this.to ? html`
          <button
            id="link"
            class=${classMap(linkClasses)}
            aria-current="page"
            type="button"
          >
            <slot></slot>
          </button>
        ` : this.to ? html`
          <a
            id="link"
            class=${classMap(linkClasses)}
            href=${this.to}
            target=${ifDefined(this.target)}
            aria-current="page"
          >
            <slot></slot>
          </a>
        ` : html`
          <slot></slot>
        `}
      </h1>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-breadcrumb-heading': Pfv6BreadcrumbHeading;
  }
}
