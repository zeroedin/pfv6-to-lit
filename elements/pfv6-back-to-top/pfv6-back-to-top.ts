import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-back-to-top.css';

/**
 * BackToTop component provides a button to scroll back to the top of a page or scrollable element.
 * The button appears when the user has scrolled down a certain distance and can be configured
 * to always be visible.
 *
 * @summary Back to top button for scrollable content
 * @alias BackToTop
 *
 * @slot - Default slot for button content (defaults to "Back to top" text)
 *
 * @cssprop --pf-v6-c-back-to-top--InsetInlineEnd - Right position of the button
 * @cssprop --pf-v6-c-back-to-top--InsetBlockEnd - Bottom position of the button
 * @cssprop --pf-v6-c-back-to-top--md--InsetBlockEnd - Bottom position at medium breakpoint
 * @cssprop --pf-v6-c-back-to-top--c-button--FontSize - Font size of the button
 * @cssprop --pf-v6-c-back-to-top--c-button--PaddingBlockStart - Top padding of the button
 * @cssprop --pf-v6-c-back-to-top--c-button--PaddingInlineEnd - Right padding of the button
 * @cssprop --pf-v6-c-back-to-top--c-button--PaddingBlockEnd - Bottom padding of the button
 * @cssprop --pf-v6-c-back-to-top--c-button--PaddingInlineStart - Left padding of the button
 * @cssprop --pf-v6-c-back-to-top--c-button--BoxShadow - Box shadow of the button
 */
@customElement('pfv6-back-to-top')
export class Pfv6BackToTop extends LitElement {
  static styles = styles;

  /**
   * Title to appear in back to top button.
   * @default 'Back to top'
   */
  @property({ type: String })
  title = 'Back to top';

  /**
   * Selector for the scrollable element to spy on.
   * Not passing a selector defaults to spying on window scroll events.
   */
  @property({ type: String, attribute: 'scrollable-selector' })
  scrollableSelector?: string | undefined;

  /**
   * Flag to always show back to top button.
   * When false, button only appears after scrolling down 400px.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-always-visible' })
  isAlwaysVisible = false;

  @state()
  private visible = false;

  private scrollElement: HTMLElement | Window | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.#setupScrollListener();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#removeScrollListener();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('isAlwaysVisible')) {
      this.visible = this.isAlwaysVisible;
    }

    if (changedProperties.has('scrollableSelector')) {
      this.#removeScrollListener();
      this.#setupScrollListener();
    }
  }

  #setupScrollListener() {
    if (this.scrollableSelector) {
      const scrollEl = document.querySelector(this.scrollableSelector) as HTMLElement;
      if (scrollEl instanceof HTMLElement) {
        this.scrollElement = scrollEl;
        scrollEl.addEventListener('scroll', this.#toggleVisible);
      }
    } else {
      this.scrollElement = window;
      window.addEventListener('scroll', this.#toggleVisible);
    }
  }

  #removeScrollListener() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.#toggleVisible);
      this.scrollElement = null;
    }
  }

  #toggleVisible = () => {
    if (!this.scrollElement) {
      return;
    }

    const scrolled = (this.scrollElement as Window).scrollY !== undefined ?
      (this.scrollElement as Window).scrollY
      : (this.scrollElement as HTMLElement).scrollTop;

    if (!this.isAlwaysVisible) {
      this.visible = scrolled > 400;
    }
  };

  #handleClick = () => {
    if (!this.scrollElement) {
      return;
    }

    this.scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  render() {
    const classes = {
      hidden: !this.visible,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <button id="button" type="button" @click=${this.#handleClick}>
          <span id="text">
            <slot>${this.title}</slot>
          </span>
          <span id="icon" aria-hidden="true">
            <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 320 512">
              <path d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z"></path>
            </svg>
          </span>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-back-to-top': Pfv6BackToTop;
  }
}
