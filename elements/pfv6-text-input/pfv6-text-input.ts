import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-text-input.css';

/**
 * Text input component for form input with validation states.
 *
 * This component wraps a native `<input>` element (provided by the user via slot)
 * and adds PatternFly styling, validation icons, and readonly variants.
 *
 * @summary Text input with validation and styling
 *
 * @slot input - Native `<input>` element (required)
 * @slot icon - Custom icon to display
 *
 * @cssprop --pf-v6-c-form-control--ColumnGap - Gap between input and utilities
 * @cssprop --pf-v6-c-form-control--Color - Text color of the input
 * @cssprop --pf-v6-c-form-control--FontSize - Font size of the input
 * @cssprop --pf-v6-c-form-control--LineHeight - Line height of the input
 * @cssprop --pf-v6-c-form-control--Resize - Resize behavior
 * @cssprop --pf-v6-c-form-control--OutlineOffset - Outline offset
 * @cssprop --pf-v6-c-form-control--BorderRadius - Border radius
 * @cssprop --pf-v6-c-form-control--before--BorderWidth - Border width (default state)
 * @cssprop --pf-v6-c-form-control--before--BorderStyle - Border style (default state)
 * @cssprop --pf-v6-c-form-control--before--BorderColor - Border color (default state)
 * @cssprop --pf-v6-c-form-control--before--BorderRadius - Border radius (default state)
 * @cssprop --pf-v6-c-form-control--after--BorderWidth - Border width (interactive state)
 * @cssprop --pf-v6-c-form-control--after--BorderStyle - Border style (interactive state)
 * @cssprop --pf-v6-c-form-control--after--BorderColor - Border color (interactive state)
 * @cssprop --pf-v6-c-form-control--after--BorderRadius - Border radius (interactive state)
 * @cssprop --pf-v6-c-form-control--BackgroundColor - Background color
 * @cssprop --pf-v6-c-form-control--Width - Component width
 * @cssprop --pf-v6-c-form-control--inset--base - Base inset spacing
 * @cssprop --pf-v6-c-form-control--PaddingBlockStart--base - Base block start padding
 * @cssprop --pf-v6-c-form-control--PaddingBlockEnd--base - Base block end padding
 * @cssprop --pf-v6-c-form-control--PaddingInlineEnd--base - Base inline end padding
 * @cssprop --pf-v6-c-form-control--PaddingInlineStart--base - Base inline start padding
 * @cssprop --pf-v6-c-form-control--PaddingBlockStart - Actual block start padding
 * @cssprop --pf-v6-c-form-control--PaddingBlockEnd - Actual block end padding
 * @cssprop --pf-v6-c-form-control--PaddingInlineEnd - Actual inline end padding
 * @cssprop --pf-v6-c-form-control--PaddingInlineStart - Actual inline start padding
 * @cssprop --pf-v6-c-form-control__input--PaddingBlockStart - Input block start padding
 * @cssprop --pf-v6-c-form-control__input--PaddingBlockEnd - Input block end padding
 * @cssprop --pf-v6-c-form-control__input--PaddingInlineEnd - Input inline end padding
 * @cssprop --pf-v6-c-form-control__input--PaddingInlineStart - Input inline start padding
 * @cssprop --pf-v6-c-form-control__utilities--input--PaddingInlineEnd - Utilities input inline end padding
 * @cssprop --pf-v6-c-form-control--hover--after--BorderWidth - Hover border width
 * @cssprop --pf-v6-c-form-control--hover--after--BorderColor - Hover border color
 * @cssprop --pf-v6-c-form-control--m-success--hover--after--BorderColor - Success hover border color
 * @cssprop --pf-v6-c-form-control--m-warning--hover--after--BorderColor - Warning hover border color
 * @cssprop --pf-v6-c-form-control--m-error--hover--after--BorderColor - Error hover border color
 * @cssprop --pf-v6-c-form-control--m-expanded--after--BorderWidth - Expanded border width
 * @cssprop --pf-v6-c-form-control--m-expanded--after--BorderColor - Expanded border color
 * @cssprop --pf-v6-c-form-control--m-placeholder--Color - Placeholder text color
 * @cssprop --pf-v6-c-form-control--m-readonly--BackgroundColor - Readonly background color
 * @cssprop --pf-v6-c-form-control--m-readonly--BorderColor - Readonly border color
 * @cssprop --pf-v6-c-form-control--m-readonly--hover--after--BorderColor - Readonly hover border color
 * @cssprop --pf-v6-c-form-control--m-readonly--m-plain--BackgroundColor - Readonly plain background color
 * @cssprop --pf-v6-c-form-control--m-readonly--m-plain--BorderColor - Readonly plain border color
 * @cssprop --pf-v6-c-form-control--m-readonly--m-plain--inset--base - Readonly plain inset base
 * @cssprop --pf-v6-c-form-control--m-readonly--m-plain--OutlineOffset - Readonly plain outline offset
 * @cssprop --pf-v6-c-form-control--icon--width - Icon width
 * @cssprop --pf-v6-c-form-control--m-success--after--BorderWidth - Success border width
 * @cssprop --pf-v6-c-form-control--m-success--after--BorderColor - Success border color
 * @cssprop --pf-v6-c-form-control__input--m-success--PaddingInlineEnd - Success input inline end padding
 * @cssprop --pf-v6-c-form-control--m-warning--after--BorderWidth - Warning border width
 * @cssprop --pf-v6-c-form-control--m-warning--after--BorderColor - Warning border color
 * @cssprop --pf-v6-c-form-control__input--m-warning--PaddingInlineEnd - Warning input inline end padding
 * @cssprop --pf-v6-c-form-control--m-error--after--BorderWidth - Error border width
 * @cssprop --pf-v6-c-form-control--m-error--after--BorderColor - Error border color
 * @cssprop --pf-v6-c-form-control__input--m-error--PaddingInlineEnd - Error input inline end padding
 * @cssprop --pf-v6-c-form-control--m-icon--PaddingInlineEnd - Custom icon inline end padding
 * @cssprop --pf-v6-c-form-control--m-icon--icon--width - Custom icon width
 * @cssprop --pf-v6-c-form-control--m-icon--icon--spacer - Custom icon spacer
 * @cssprop --pf-v6-c-form-control--m-icon--icon--PaddingInlineEnd - Custom icon container inline end padding
 * @cssprop --pf-v6-c-form-control__icon--Color - Icon color
 * @cssprop --pf-v6-c-form-control__icon--FontSize - Icon font size
 * @cssprop --pf-v6-c-form-control__icon--m-status--Color - Status icon color
 * @cssprop --pf-v6-c-form-control--m-success__icon--m-status--Color - Success status icon color
 * @cssprop --pf-v6-c-form-control--m-warning__icon--m-status--Color - Warning status icon color
 * @cssprop --pf-v6-c-form-control--m-error__icon--m-status--Color - Error status icon color
 * @cssprop --pf-v6-c-form-control__utilities--Gap - Utilities gap
 * @cssprop --pf-v6-c-form-control__utilities--PaddingBlockStart - Utilities block start padding
 * @cssprop --pf-v6-c-form-control__utilities--PaddingInlineEnd - Utilities inline end padding
 * @cssprop --pf-v6-danger-jiggle--TranslateX - Danger jiggle animation translate X value
 *
 * @example
 * ```html
 * <label>
 *   Email
 *   <pfv6-text-input validated="error">
 *     <input type="email" name="email" required>
 *   </pfv6-text-input>
 * </label>
 * ```
 *
 * @example
 * ```html
 * <label for="username">Username</label>
 * <pfv6-text-input>
 *   <input id="username" slot="input" type="text" name="username">
 * </pfv6-text-input>
 * ```
 */
@customElement('pfv6-text-input')
export class Pfv6TextInput extends LitElement {
  static styles = styles;

  /**
   * Validation state of the input.
   * Controls which status icon is displayed and applies validation styling.
   */
  @property({ type: String, reflect: true })
  validated: 'success' | 'warning' | 'error' | 'default' = 'default';

  /**
   * Sets the input as readonly and determines the readonly styling.
   * - 'default': Standard readonly styling
   * - 'plain': Plain text appearance
   */
  @property({ type: String, reflect: true, attribute: 'read-only-variant' })
  readOnlyVariant?: 'plain' | 'default';

  /**
   * Trim text at start (for long values that overflow).
   * When enabled, the component will scroll to show the end of the value
   * and truncate the beginning with ellipsis.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-start-truncated' })
  isStartTruncated = false;

  /**
   * Flag to apply expanded styling.
   * Used when the input controls an expandable element (like a menu).
   *
   * @deprecated Use expanded-aria-controls instead to properly link to controlled element
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /**
   * ID of the element that this input controls (for expandable menus).
   * When set, applies expanded styling and proper ARIA attributes.
   */
  @property({ type: String, attribute: 'expanded-aria-controls' })
  expandedAriaControls?: string;

  /**
   * Internal state tracking if custom icon slot has content
   */
  @state()
  private hasCustomIcon = false;

  /**
   * Reference to the slotted input element
   */
  #slottedInput?: HTMLInputElement;

  /**
   * ResizeObserver for handling start truncation
   */
  #resizeObserver?: ResizeObserver;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanupTruncation();
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    // Handle truncation setup/teardown
    if (changedProperties.has('isStartTruncated')) {
      if (this.isStartTruncated) {
        this.#setupTruncation();
      } else {
        this.#cleanupTruncation();
      }
    }

    // Apply ARIA attributes to slotted input for expansion control
    if (changedProperties.has('expandedAriaControls') || changedProperties.has('isExpanded')) {
      this.#updateInputAriaAttributes();
    }
  }

  render() {
    const hasStatusIcon = ['success', 'error', 'warning'].includes(this.validated);
    const isExpanded = this.isExpanded || !!this.expandedAriaControls;

    const classes = {
      readonly: !!this.readOnlyVariant,
      plain: this.readOnlyVariant === 'plain',
      expanded: isExpanded,
      icon: this.hasCustomIcon,
      success: this.validated === 'success',
      warning: this.validated === 'warning',
      error: this.validated === 'error',
    };

    const iconMap = {
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'exclamation-circle',
    };

    const svgPaths: Record<string, string> = {
      'check-circle':
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'
        + 'm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      'exclamation-triangle':
        'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
      'exclamation-circle':
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'
        + 'm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    };

    const iconName = iconMap[this.validated as 'success' | 'warning' | 'error'];

    return html`
      <span id="container" class=${classMap(classes)}>
        <slot @slotchange=${this.#handleInputSlotChange}></slot>
        <span id="utilities">
          <span id="custom-icon-wrapper">
            <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
          </span>
          ${hasStatusIcon && iconName ? html`
            <span id="status-icon" class="status">
              <svg
                fill="currentColor"
                height="1em"
                width="1em"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="img"
              >
                <path d=${svgPaths[iconName]}></path>
              </svg>
            </span>
          ` : null}
        </span>
      </span>
    `;
  }

  /**
   * Handle slot change for input slot
   * @param e - The slotchange event
   */
  #handleInputSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements();

    this.#slottedInput = elements.find(el => el instanceof HTMLInputElement) as HTMLInputElement;

    if (this.#slottedInput) {
      // Set initial ARIA attributes if needed
      this.#updateInputAriaAttributes();

      // Setup truncation if enabled
      if (this.isStartTruncated) {
        this.#setupTruncation();
      }

      // Add focus/blur listeners for truncation
      if (this.isStartTruncated) {
        this.#slottedInput.addEventListener('focus', this.#handleInputFocus);
        this.#slottedInput.addEventListener('blur', this.#handleInputBlur);
      }
    }
  }

  /**
   * Handle slot change for icon slot
   * @param e - The slotchange event
   */
  #handleIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasCustomIcon = slot.assignedElements().length > 0;
  }

  /**
   * Update ARIA attributes on slotted input for expansion control
   */
  #updateInputAriaAttributes() {
    if (!this.#slottedInput) {
      return;
    }

    if (this.expandedAriaControls) {
      this.#slottedInput.setAttribute('role', 'combobox');
      this.#slottedInput.setAttribute('aria-expanded', 'true');
      this.#slottedInput.setAttribute('aria-controls', this.expandedAriaControls);
    } else if (this.isExpanded) {
      this.#slottedInput.setAttribute('aria-expanded', 'true');
    } else {
      this.#slottedInput.removeAttribute('role');
      this.#slottedInput.removeAttribute('aria-expanded');
      this.#slottedInput.removeAttribute('aria-controls');
    }
  }

  /**
   * Setup truncation behavior with ResizeObserver
   */
  #setupTruncation() {
    if (!this.#slottedInput || this.#resizeObserver) {
      return;
    }

    this.#resizeObserver = new ResizeObserver(() => {
      this.#handleResize();
    });

    this.#resizeObserver.observe(this.#slottedInput);
    this.#handleResize();
  }

  /**
   * Cleanup truncation observer and listeners
   */
  #cleanupTruncation() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }

    if (this.#slottedInput) {
      this.#slottedInput.removeEventListener('focus', this.#handleInputFocus);
      this.#slottedInput.removeEventListener('blur', this.#handleInputBlur);
    }
  }

  /**
   * Handle resize for truncation
   */
  #handleResize() {
    if (!this.#slottedInput) {
      return;
    }
    this.#trimLeft(this.#slottedInput);
  }

  /**
   * Handle input focus - restore full text for truncated inputs
   */
  #handleInputFocus = () => {
    if (!this.#slottedInput || !this.isStartTruncated) {
      return;
    }

    // Scroll to show the rightmost value (restore full visibility)
    this.#slottedInput.scrollLeft = this.#slottedInput.scrollWidth;
  };

  /**
   * Handle input blur - reapply truncation
   */
  #handleInputBlur = () => {
    if (!this.#slottedInput || !this.isStartTruncated) {
      return;
    }
    this.#handleResize();
  };

  /**
   * Trim text from the left by scrolling to show the end
   * (from PatternFly React trimLeft utility)
   * @param input - The input element to trim
   */
  #trimLeft(input: HTMLInputElement) {
    const { value } = input;
    if (!value) {
      return;
    }

    // Measure if text overflows
    const { scrollWidth } = input;
    const { clientWidth } = input;

    if (scrollWidth > clientWidth) {
      // Scroll to the end to show the rightmost characters
      input.scrollLeft = scrollWidth;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-text-input': Pfv6TextInput;
  }
}
