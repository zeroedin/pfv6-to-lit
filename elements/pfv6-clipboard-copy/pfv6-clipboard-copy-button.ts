import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import type { Pfv6Tooltip } from '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import styles from './pfv6-clipboard-copy-button.css';

/**
 * The clipboard copy button provides a clickable button that triggers text copying to the clipboard with integrated tooltip feedback showing copy status messages.
 *
 * @alias ClipboardCopyButton
 * @summary Button with integrated copy-to-clipboard functionality and tooltip feedback
 */
@customElement('pfv6-clipboard-copy-button')
export class Pfv6ClipboardCopyButton extends LitElement {
  static styles = styles;

  /** Variant of the button */
  @property({ type: String, reflect: true })
  variant: 'control' | 'plain' = 'control';

  /** Exit delay on the tooltip in milliseconds */
  @property({ type: Number, attribute: 'exit-delay' })
  exitDelay = 0;

  /** Entry delay on the tooltip in milliseconds */
  @property({ type: Number, attribute: 'entry-delay' })
  entryDelay = 300;

  /** Max width of the tooltip */
  @property({ type: String, attribute: 'max-width' })
  maxWidth = '100px';

  /** Position of the tooltip */
  @property({ type: String })
  position:
    | 'auto' | 'top' | 'bottom' | 'left' | 'right'
    | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
    | 'left-start' | 'left-end' | 'right-start' | 'right-end' = 'top';

  /** Removes padding from button (for inline-compact variant) */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-padding' })
  hasNoPadding = false;

  /** Tooltip content text */
  @property({ type: String, attribute: 'tooltip-content' })
  tooltipContent = '';

  #tooltip: Pfv6Tooltip | null = null;
  #hideTimer: number | null = null;
  #wasClicked = false;

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // When tooltip content changes after a click, ensure tooltip stays visible
    if (changedProperties.has('tooltipContent')
        && changedProperties.get('tooltipContent') !== undefined
        && this.#wasClicked) {
      // Get tooltip reference if not cached
      if (!this.#tooltip) {
        this.#tooltip = this.shadowRoot?.querySelector('pfv6-tooltip') as Pfv6Tooltip | null;
      }
      // Ensure tooltip is visible with updated content
      if (this.#tooltip) {
        this.#tooltip.isVisible = true;
      }

      // Schedule hide after exitDelay
      if (this.#hideTimer) {
        window.clearTimeout(this.#hideTimer);
      }
      this.#hideTimer = window.setTimeout(() => {
        if (this.#tooltip) {
          this.#tooltip.isVisible = false;
        }
      }, this.exitDelay);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#hideTimer) {
      window.clearTimeout(this.#hideTimer);
    }
  }

  #handleClick() {
    this.#wasClicked = true;
    // Show tooltip on click (since click is not in tooltip trigger)
    if (!this.#tooltip) {
      this.#tooltip = this.shadowRoot?.querySelector('pfv6-tooltip') as Pfv6Tooltip | null;
    }
    if (this.#tooltip) {
      this.#tooltip.isVisible = true;
    }
  }

  #handleTooltipHidden() {
    this.#wasClicked = false;
    this.dispatchEvent(new Event('tooltip-hidden', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <pfv6-tooltip
        trigger="mouseenter focus"
        exit-delay=${this.exitDelay}
        entry-delay=${this.entryDelay}
        max-width=${this.maxWidth}
        position=${this.position}
        content=${this.tooltipContent}
        @tooltip-hidden=${this.#handleTooltipHidden}
      >
        <pfv6-button
          type="button"
          variant=${this.variant}
          ?has-no-padding=${this.hasNoPadding}
          aria-label=${this.getAttribute('aria-label') || 'Copy to clipboard'}
          @click=${this.#handleClick}
        >
          <svg
            slot="icon"
            fill="currentColor"
            height="1em"
            width="1em"
            viewBox="0 0 448 512"
            aria-hidden="true"
          >
            <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>
          </svg>
        </pfv6-button>
      </pfv6-tooltip>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-clipboard-copy-button': Pfv6ClipboardCopyButton;
  }
}
