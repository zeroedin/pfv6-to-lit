import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-clipboard-copy-toggle.css';

/**
 * The clipboard copy toggle button expands or collapses the expanded content area with an animated icon indicator showing the current state.
 *
 * Uses ElementInternals for ARIA to ensure aria-controls can reference sibling elements in the parent's shadow DOM.
 *
 * @alias ClipboardCopyToggle
 * @summary Button that expands or collapses the content area with animated icon
 * @cssprop --pf-v6-c-clipboard-copy__toggle-icon--Transition - Complete transition property for the toggle icon
 * @cssprop --pf-v6-c-clipboard-copy--m-expanded__toggle-icon--Rotate - Rotation angle of the toggle icon when expanded
 */
@customElement('pfv6-clipboard-copy-toggle')
export class Pfv6ClipboardCopyToggle extends LitElement {
  static styles = styles;

  #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = 'button';
  }

  /** Whether the content is expanded */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** ID of the content element this toggle controls */
  @property({ type: String, attribute: 'content-id' })
  contentId?: string | undefined;

  override connectedCallback(): void {
    super.connectedCallback();

    // Make host focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // Handle keyboard activation
    this.addEventListener('keydown', this.#handleKeydown);

    // Update ARIA
    this.#updateAria();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.#handleKeydown);
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('isExpanded') || changedProperties.has('contentId')) {
      this.#updateAria();
    }
  }

  #updateAria(): void {
    this.#internals.ariaExpanded = String(this.isExpanded);
    // Only set aria-controls when expanded (matches React behavior)
    this.#internals.ariaControls = this.isExpanded ? (this.contentId ?? null) : null;
    // Forward aria-label from host attribute
    this.#internals.ariaLabel = this.getAttribute('aria-label') || 'Show content';
  }

  #handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  render() {
    const iconClasses = {
      'toggle-icon': true,
      'expanded': this.isExpanded,
    };

    return html`
      <svg
        class=${classMap(iconClasses)}
        fill="currentColor"
        height="1em"
        width="1em"
        viewBox="0 0 256 512"
        aria-hidden="true"
      >
        <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-clipboard-copy-toggle': Pfv6ClipboardCopyToggle;
  }
}
