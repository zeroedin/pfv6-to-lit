import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-helper-text-item.css';

/**
 * Helper text item component for displaying individual help, error, or warning messages.
 *
 * @alias Helper Text Item
 *
 * Variants include default icons:
 * - `indeterminate`: Minus icon
 * - `warning`: Exclamation triangle icon
 * - `success`: Check circle icon
 * - `error`: Exclamation circle icon
 *
 * @slot - Default slot for helper text content
 * @slot icon - Custom icon (overrides default variant icon)
 * @cssprop --pf-v6-c-helper-text__item--Gap - Gap between icon and text
 * @cssprop --pf-v6-c-helper-text__item-icon--Color - Icon color
 * @cssprop --pf-v6-c-helper-text__item-icon--FontSize - Icon size
 * @cssprop --pf-v6-c-helper-text__item--m-warning__icon--Color - Warning icon color
 * @cssprop --pf-v6-c-helper-text__item--m-success__icon--Color - Success icon color
 * @cssprop --pf-v6-c-helper-text__item--m-error__icon--Color - Error icon color
 * @cssprop --pf-v6-c-helper-text__item--m-indeterminate__icon--Color - Indeterminate icon color
 */
@customElement('pfv6-helper-text-item')
export class Pfv6HelperTextItem extends LitElement {
  static styles = styles;

  /**
  * Variant styling of the helper text item. Will also render a default icon,
  * which can be overridden with the icon slot.
  */
  @property({ type: String, reflect: true })
  variant: 'default' | 'indeterminate' | 'warning' | 'success' | 'error' = 'default';

  /**
  * Text that is only accessible to screen readers in order to announce the variant
  * of a helper text item. This prop is only used when the variant prop has a value
  * other than "default".
  */
  @property({ type: String, attribute: 'screen-reader-text' })
  screenReaderText?: string;

  private _getDefaultIcon(): TemplateResult | null {
    switch (this.variant) {
      case 'indeterminate':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img">
            <path d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"></path>
          </svg>
        `;
      case 'warning':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 576 512" aria-hidden="true" role="img">
            <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
          </svg>
        `;
      case 'success':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img">
            <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
          </svg>
        `;
      case 'error':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img">
            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path>
          </svg>
        `;
      default:
        return null;
    }
  }

  private _getScreenReaderText(): string {
    // Provide default "{variant} status" when variant is not 'default'
    // to match React behavior
    if (this.variant !== 'default') {
      return this.screenReaderText ?? `${this.variant} status`;
    }
    return this.screenReaderText ?? '';
  }

  render() {
    const isNotDefaultVariant = this.variant !== 'default';
    const defaultIcon = this._getDefaultIcon();
    const srText = this._getScreenReaderText();
    const shouldRenderSRText = isNotDefaultVariant && srText;

    const classes = {
      warning: this.variant === 'warning',
      success: this.variant === 'success',
      error: this.variant === 'error',
      indeterminate: this.variant === 'indeterminate',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <span class="icon">
          <slot name="icon">${defaultIcon}</slot>
        </span>

        <span class="text">
          <slot></slot>
          ${shouldRenderSRText ? html`
            <span class="screen-reader">: ${srText};</span>
          ` : null}
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-helper-text-item': Pfv6HelperTextItem;
  }
}
