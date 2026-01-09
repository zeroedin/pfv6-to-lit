import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-text-input.css';

/**
 * Text input component that wraps a native input element with PatternFly styling and validation icons.
 *
 * **IMPORTANT**: This component uses the Light DOM Slot pattern. The user provides the native `<input>` element,
 * and this component wraps it with styling and validation icons.
 *
 * @summary Text input with PatternFly styling and validation
 *
 * @slot - Native `<input>` element (required)
 * @slot custom-icon - Custom icon to render
 *
 * @cssprop --pf-v6-c-form-control--Color - Text color
 * @cssprop --pf-v6-c-form-control--FontSize - Font size
 * @cssprop --pf-v6-c-form-control--LineHeight - Line height
 * @cssprop --pf-v6-c-form-control--BackgroundColor - Background color
 * @cssprop --pf-v6-c-form-control--BorderRadius - Border radius
 * @cssprop --pf-v6-c-form-control--before--BorderWidth - Default border width
 * @cssprop --pf-v6-c-form-control--before--BorderColor - Default border color
 * @cssprop --pf-v6-c-form-control--after--BorderWidth - Focus/active border width
 * @cssprop --pf-v6-c-form-control--after--BorderColor - Focus/active border color
 * @cssprop --pf-v6-c-form-control--PaddingBlockStart - Block start (top) padding
 * @cssprop --pf-v6-c-form-control--PaddingBlockEnd - Block end (bottom) padding
 * @cssprop --pf-v6-c-form-control--PaddingInlineStart - Inline start (left in LTR) padding
 * @cssprop --pf-v6-c-form-control--PaddingInlineEnd - Inline end (right in LTR) padding
 * @cssprop --pf-v6-c-form-control--m-success__icon--Color - Success icon color
 * @cssprop --pf-v6-c-form-control--m-warning__icon--Color - Warning icon color
 * @cssprop --pf-v6-c-form-control--m-error__icon--Color - Error icon color
 */
@customElement('pfv6-text-input')
export class Pfv6TextInput extends LitElement {
  static styles = styles;

  @query('slot:not([name])')
  private defaultSlot!: HTMLSlotElement;

  private slottedInput: HTMLInputElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private originalValue = '';

  /** Validation state */
  @property({ type: String, reflect: true })
  validated: 'success' | 'warning' | 'error' | 'default' = 'default';

  /** Sets the input as readonly and determines the readonly styling */
  @property({ type: String, reflect: true, attribute: 'readonly-variant' })
  readonlyVariant?: 'plain' | 'default';

  /** Flag indicating if input is expanded (for combobox pattern) */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** Trim text at start */
  @property({ type: Boolean, reflect: true, attribute: 'is-start-truncated' })
  isStartTruncated = false;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupResizeObserver();
    this.cleanupInputListeners();

    // Clean up slot listener
    if (this.defaultSlot) {
      this.defaultSlot.removeEventListener('slotchange', this.handleSlotChange);
    }
  }

  firstUpdated() {
    // Set up slot listener after first render when defaultSlot is available
    if (this.defaultSlot) {
      this.defaultSlot.addEventListener('slotchange', this.handleSlotChange);
      // Manually trigger initial slot processing
      this.handleSlotChange();
    }
  }

  private cleanupInputListeners() {
    if (this.slottedInput) {
      this.slottedInput.removeEventListener('focus', this.handleInputFocus);
      this.slottedInput.removeEventListener('blur', this.handleInputBlur);
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('validated')) {
      this.updateValidatedState();
    }

    if (changedProperties.has('readonlyVariant')) {
      this.updateReadonlyState();
    }

    if (changedProperties.has('isStartTruncated')) {
      if (this.isStartTruncated) {
        this.setupTruncation();
      } else {
        this.cleanupResizeObserver();
      }
    }
  }

  private handleSlotChange = () => {
    // Wait for next frame to ensure slot is available after render
    requestAnimationFrame(() => {
      const nodes = this.defaultSlot?.assignedNodes({ flatten: true }) || [];
      const input = nodes.find((node): node is HTMLInputElement =>
        node instanceof HTMLInputElement
      );

      if (input && input !== this.slottedInput) {
        // Remove listeners from old input if any
        if (this.slottedInput) {
          this.slottedInput.removeEventListener('focus', this.handleInputFocus);
          this.slottedInput.removeEventListener('blur', this.handleInputBlur);
        }

        this.slottedInput = input;
        this.syncInputState();

        // Store original value before any truncation
        if (this.isStartTruncated && input.value) {
          this.originalValue = input.value;
        }

        if (this.isStartTruncated) {
          this.setupTruncation();
        }

        // Add event listeners
        input.addEventListener('focus', this.handleInputFocus);
        input.addEventListener('blur', this.handleInputBlur);
      }
    });
  };

  private syncInputState() {
    if (!this.slottedInput) {
      return;
    }

    // Sync readonly state
    if (this.readonlyVariant) {
      this.slottedInput.readOnly = true;
    }

    // Sync validated state (aria-invalid)
    if (this.validated === 'error') {
      this.slottedInput.setAttribute('aria-invalid', 'true');
    } else if (this.slottedInput.hasAttribute('aria-invalid')) {
      this.slottedInput.removeAttribute('aria-invalid');
    }
  }

  private updateValidatedState() {
    if (!this.slottedInput) {
      return;
    }

    if (this.validated === 'error') {
      this.slottedInput.setAttribute('aria-invalid', 'true');
    } else if (this.slottedInput.hasAttribute('aria-invalid')) {
      this.slottedInput.removeAttribute('aria-invalid');
    }
  }

  private updateReadonlyState() {
    if (!this.slottedInput) {
      return;
    }

    if (this.readonlyVariant) {
      this.slottedInput.readOnly = true;
    } else {
      this.slottedInput.readOnly = false;
    }
  }

  private setupTruncation() {
    if (!this.slottedInput) {
      return;
    }

    this.cleanupResizeObserver();

    // Store original value if not already stored
    if (!this.originalValue && this.slottedInput.value) {
      this.originalValue = this.slottedInput.value;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    this.resizeObserver.observe(this.slottedInput);
    this.handleResize();
  }

  private cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private handleResize = () => {
    if (!this.slottedInput || !this.isStartTruncated) {
      return;
    }

    // Use stored original value, not the current (possibly truncated) value
    const value = this.originalValue || this.slottedInput.value;
    if (!value) {
      return;
    }

    // Trim text at start
    this.trimLeft(this.slottedInput, value);
  };

  /**
   * Get the available inner width of an element (excluding padding)
   * @param node - The HTML element to measure
   */
  private getInnerWidth(node: HTMLElement): number {
    const computedStyle = getComputedStyle(node);
    let width = node.clientWidth;
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    return width;
  }

  /**
   * Get the pixel width of text using Canvas measurement (matches React's getTextWidth)
   * @param text - The text to measure
   * @param node - The HTML element for font context
   */
  private getTextWidth(text: string, node: HTMLElement): number {
    const computedStyle = getComputedStyle(node);

    // Firefox returns empty string for .font, so build it manually
    const getFontFromComputedStyle = () => {
      const fontStretchLookupTable: Record<string, string> = {
        '50%': 'ultra-condensed',
        '62.5%': 'extra-condensed',
        '75%': 'condensed',
        '87.5%': 'semi-condensed',
        '100%': 'normal',
        '112.5%': 'semi-expanded',
        '125%': 'expanded',
        '150%': 'extra-expanded',
        '200%': 'ultra-expanded',
      };

      const fontStretch = fontStretchLookupTable[computedStyle.fontStretch] || 'normal';

      return `${computedStyle.fontStyle} ${computedStyle.fontVariant} ${computedStyle.fontWeight} ${fontStretch} ${computedStyle.fontSize}/${computedStyle.lineHeight} ${computedStyle.fontFamily}`;
    };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return 0;
    }

    context.font = computedStyle.font || getFontFromComputedStyle();
    return context.measureText(text).width;
  }

  /**
   * Trim text from the left, leaving the right side visible (matches React's trimLeft)
   * @param input - The input element to truncate
   * @param value - The original text value
   */
  private trimLeft(input: HTMLInputElement, value: string) {
    const availableWidth = this.getInnerWidth(input);
    let newValue = value;

    if (this.getTextWidth(value, input) > availableWidth) {
      // Iteratively remove characters from the start until it fits
      while (this.getTextWidth(`...${newValue}`, input) > availableWidth && newValue.length > 0) {
        newValue = newValue.substring(1);
      }
      input.value = `...${newValue}`;
    } else {
      input.value = value;
    }
  }

  private handleInputFocus = () => {
    if (this.isStartTruncated && this.slottedInput) {
      // Restore full value on focus
      if (this.originalValue) {
        this.slottedInput.value = this.originalValue;
      }
      // Scroll to end
      this.slottedInput.scrollLeft = this.slottedInput.scrollWidth;
    }
  };

  private handleInputBlur = () => {
    if (this.isStartTruncated && this.slottedInput) {
      // Store original value (may have been edited by user)
      this.originalValue = this.slottedInput.value;
      // Re-apply truncation
      this.handleResize();
    }
  };

  render() {
    const hasStatusIcon = ['success', 'error', 'warning'].includes(this.validated);
    const hasCustomIcon = !!this.querySelector('[slot="custom-icon"]');
    const hasIcon = hasCustomIcon || hasStatusIcon;

    const classes = {
      readonly: !!this.readonlyVariant,
      plain: this.readonlyVariant === 'plain',
      expanded: this.isExpanded,
      icon: hasIcon,
      success: this.validated === 'success',
      error: this.validated === 'error',
      warning: this.validated === 'warning',
    };

    return html`
      <span id="container" class=${classMap(classes)}>
        <slot></slot>
        ${hasIcon ? html`
          <span class="utilities">
            ${hasCustomIcon ? html`
              <span class="icon">
                <slot name="custom-icon"></slot>
              </span>
            ` : null}
            ${hasStatusIcon ? html`
              <span class="icon status">
                ${this.renderStatusIcon()}
              </span>
            ` : null}
          </span>
        ` : null}
      </span>
    `;
  }

  private renderStatusIcon() {
    switch (this.validated) {
      case 'success':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true">
            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
          </svg>
        `;
      case 'error':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true">
            <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
          </svg>
        `;
      case 'warning':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 576 512" aria-hidden="true">
            <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
          </svg>
        `;
      default:
        return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-text-input': Pfv6TextInput;
  }
}
