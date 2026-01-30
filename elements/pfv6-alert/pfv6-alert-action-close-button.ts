import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { consume } from '@lit/context';
import { alertContext, type AlertContext } from './context.js';
import styles from './pfv6-alert-action-close-button.css';

/**
 * Close button for dismissable alerts.
 *
 * @alias AlertActionCloseButton
 * @summary Close button for dismissable alerts.
 * @fires close - Fired when the close button is clicked
 */
@customElement('pfv6-alert-action-close-button')
export class Pfv6AlertActionCloseButton extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  /** Accessible label for the close button */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Variant label for the close button */
  @property({ type: String, attribute: 'variant-label' })
  variantLabel?: string | undefined;

  @consume({ context: alertContext, subscribe: true })
  private alertContextValue: AlertContext | undefined;

  #handleClick = () => {
    // Dispatch close event that parent alert can listen for
    this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));
  };

  render() {
    const title = this.alertContextValue?.title || '';
    const contextVariantLabel = this.alertContextValue?.variantLabel || '';
    const effectiveVariantLabel = this.variantLabel || contextVariantLabel;

    const computedAriaLabel = this.accessibleLabel
      || `Close ${effectiveVariantLabel} ${title}`;

    return html`
      <div id="action">
        <button
          id="close-button"
          type="button"
          tabindex="-1"
          aria-label=${computedAriaLabel}
          @click=${this.#handleClick}
        >
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 352 512" aria-hidden="true">
            <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
          </svg>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-alert-action-close-button': Pfv6AlertActionCloseButton;
  }
}
