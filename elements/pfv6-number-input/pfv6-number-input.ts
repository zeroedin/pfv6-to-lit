import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@pfv6/elements/pfv6-input-group/pfv6-input-group.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import '@pfv6/elements/pfv6-text-input/pfv6-text-input.js';
import styles from './pfv6-number-input.css';

/**
 * Event fired when minus button is clicked.
 */
export class Pfv6NumberInputMinusEvent extends Event {
  constructor(
    public name?: string
  ) {
    super('minus', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when plus button is clicked.
 */
export class Pfv6NumberInputPlusEvent extends Event {
  constructor(
    public name?: string
  ) {
    super('plus', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when input value changes.
 */
export class Pfv6NumberInputChangeEvent extends Event {
  constructor(
    public value: number | string
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when input is blurred.
 * Uses 'input-blur' to avoid collision with native blur events.
 */
export class Pfv6NumberInputBlurEvent extends Event {
  constructor(
    public value: number | string
  ) {
    super('input-blur', { bubbles: true, composed: true });
  }
}

/**
 * Number input component with increment/decrement controls.
 *
 * This component uses Shadow DOM with Form-Associated Custom Element (FACE)
 * pattern for native form integration.
 *
 * @summary Number input with increment/decrement controls
 * @alias NumberInput
 *
 * ## Architecture: Shadow DOM + FACE
 *
 * **Rationale**:
 * - Input is internal to shadow DOM (no slot required)
 * - Native form integration via ElementInternals
 * - Single source of truth for value/name/min/max
 * - No duplicate attributes needed
 *
 * @fires Pfv6NumberInputMinusEvent - Fired when minus button is clicked
 * @fires Pfv6NumberInputPlusEvent - Fired when plus button is clicked
 * @fires Pfv6NumberInputChangeEvent - Fired when input value changes
 * @fires {Pfv6NumberInputBlurEvent} input-blur - Fired when input loses focus
 *
 * @cssprop --pf-v6-c-number-input--c-form-control--width-base - Base width calculation (padding + border)
 * @cssprop --pf-v6-c-number-input--c-form-control--width-icon - Extra width to accommodate a status icon
 * @cssprop --pf-v6-c-number-input--c-form-control--width-chars - Width of the input in characters (default: 4)
 * @cssprop --pf-v6-c-number-input--c-form-control--Width - Calculated total width of the input
 * @cssprop --pf-v6-c-number-input__icon--FontSize - Font size of the minus/plus icons
 * @cssprop --pf-v6-c-number-input__unit--c-input-group--MarginInlineStart - Spacing between unit and input group
 *
 * @example
 * ```html
 * <pfv6-number-input
 *   value="5"
 *   min="0"
 *   max="10"
 *   name="quantity"
 *   accessible-label="Quantity"
 * ></pfv6-number-input>
 * ```
 *
 * @example With unit
 * ```html
 * <pfv6-number-input value="100" unit="%" unit-position="after"></pfv6-number-input>
 * ```
 */
@customElement('pfv6-number-input')
export class Pfv6NumberInput extends LitElement {
  static styles = styles;
  static formAssociated = true;
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  #internals: ElementInternals;
  #initialValue: number | '' = 0;

  @query('input[type="number"]')
  private _input!: HTMLInputElement;

  /**
   * Value of the number input.
   * Can be a number or empty string.
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === '') {
          return '';
        }
        const num = Number(value);
        return isNaN(num) ? '' : num;
      },
      toAttribute: (value: number | '') => {
        return value === '' ? '' : String(value);
      },
    },
  })
  value: number | '' = 0;

  /**
   * Form name attribute.
   */
  @property({ type: String, reflect: true })
  name = '';

  /**
   * Sets the width of the number input to a number of characters.
   */
  @property({ type: Number, attribute: 'width-chars' })
  widthChars?: number | undefined;

  /**
   * Indicates the whole number input should be disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the input is required.
   */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * Whether the input is readonly.
   */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  /**
   * Value to indicate if the input is modified to show validation state.
   */
  @property({ type: String, reflect: true })
  validated: 'default' | 'error' | 'warning' | 'success' = 'default';

  /**
   * Unit to display with the number input.
   */
  @property({ type: String })
  unit?: string | undefined;

  /**
   * Position of the unit in relation to the number input.
   */
  @property({ type: String, reflect: true, attribute: 'unit-position' })
  unitPosition: 'before' | 'after' = 'after';

  /**
   * Minimum value of the number input.
   * Disables the minus button when value reaches this minimum.
   */
  @property({ type: Number })
  min?: number | undefined;

  /**
   * Maximum value of the number input.
   * Disables the plus button when value reaches this maximum.
   */
  @property({ type: Number })
  max?: number | undefined;

  /**
   * Step value for increment/decrement operations.
   * Used by arrow keys and as hint for plus/minus buttons.
   */
  @property({ type: Number })
  step = 1;

  /**
   * Accessible label for the input (maps to aria-label).
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel = 'Input';

  /**
   * Accessible label of the minus button.
   */
  @property({ type: String, attribute: 'minus-btn-accessible-label' })
  minusBtnAccessibleLabel = 'Minus';

  /**
   * Accessible label of the plus button.
   */
  @property({ type: String, attribute: 'plus-btn-accessible-label' })
  plusBtnAccessibleLabel = 'Plus';

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Store initial value for form reset
    this.#initialValue = this.value;
    this.#updateFormValue();
  }

  /**
   * Get the current numeric value, defaulting to 0 if value is empty string.
   */
  #getCurrentValue(): number {
    return typeof this.value === 'number' ? this.value : 0;
  }

  /**
   * Check if minus button should be disabled.
   */
  #isMinusDisabled(): boolean {
    if (this.disabled) {
      return true;
    }
    if (this.min !== undefined) {
      return this.#getCurrentValue() <= this.min;
    }
    return false;
  }

  /**
   * Check if plus button should be disabled.
   */
  #isPlusDisabled(): boolean {
    if (this.disabled) {
      return true;
    }
    if (this.max !== undefined) {
      return this.#getCurrentValue() >= this.max;
    }
    return false;
  }

  /**
   * Update form value via ElementInternals.
   */
  #updateFormValue() {
    if (this.value === '') {
      this.#internals.setFormValue(null);
    } else {
      this.#internals.setFormValue(String(this.value));
    }
  }

  /**
   * Validate the input.
   */
  #validate() {
    if (this.required && this.value === '') {
      this.#internals.setValidity(
        { valueMissing: true },
        'Please fill out this field.',
        this._input
      );
    } else {
      this.#internals.setValidity({});
    }
  }

  /**
   * Handle minus button click.
   */
  #handleMinusClick = (event: MouseEvent) => {
    event.preventDefault();
    // Don't dispatch if button should be disabled
    if (this.#isMinusDisabled()) {
      return;
    }
    this.dispatchEvent(new Pfv6NumberInputMinusEvent(this.name));
  };

  /**
   * Handle plus button click.
   */
  #handlePlusClick = (event: MouseEvent) => {
    event.preventDefault();
    // Don't dispatch if button should be disabled
    if (this.#isPlusDisabled()) {
      return;
    }
    this.dispatchEvent(new Pfv6NumberInputPlusEvent(this.name));
  };

  /**
   * Handle input change event.
   * Forward to component's change event.
   */
  #handleInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = input.value === '' ? '' : Number(input.value);
    this.value = value;
    this.dispatchEvent(new Pfv6NumberInputChangeEvent(value));
  };

  /**
   * Handle input blur event.
   * Normalizes the value and fires input-blur event.
   */
  #handleInputBlur = () => {
    // Normalize the value (convert to number string)
    const normalizedValue = this.value === '' ? '' : Number(this.value);

    this.dispatchEvent(new Pfv6NumberInputChangeEvent(normalizedValue));
    this.dispatchEvent(new Pfv6NumberInputBlurEvent(normalizedValue));
  };

  /**
   * Handle keydown on input.
   * Allow arrow up/down to trigger plus/minus.
   */
  #handleInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && !this.#isPlusDisabled()) {
      event.preventDefault();
      this.dispatchEvent(new Pfv6NumberInputPlusEvent(this.name));
    } else if (event.key === 'ArrowDown' && !this.#isMinusDisabled()) {
      event.preventDefault();
      this.dispatchEvent(new Pfv6NumberInputMinusEvent(this.name));
    }
  };

  /**
   * FACE callback: Called when the form is reset.
   */
  formResetCallback() {
    this.value = this.#initialValue;
    this.#updateFormValue();
  }

  /**
   * FACE callback: Called when the form's disabled state changes.
   */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
   * FACE callback: Called when browser restores form state.
   */
  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') {
      const num = Number(state);
      this.value = isNaN(num) ? '' : num;
    }
    this.#validate();
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    // Update form value when value changes
    if (changedProperties.has('value')) {
      this.#updateFormValue();
    }

    // Validate when required or value changes
    if (changedProperties.has('required') || changedProperties.has('value')) {
      this.#validate();
    }
  }

  render() {
    const unitContent = this.unit ? html`
      <div id="unit">${this.unit}</div>
    ` : null;

    return html`
      <div
        id="container"
        style=${ifDefined(this.widthChars !== undefined ? `--pf-v6-c-number-input--c-form-control--width-chars: ${this.widthChars}` : undefined)}
      >
        ${this.unit && this.unitPosition === 'before' ? unitContent : null}
        <pfv6-input-group>
          <pfv6-input-group-item>
            <pfv6-button
              variant="control"
              ?is-disabled=${this.#isMinusDisabled()}
              accessible-label=${this.minusBtnAccessibleLabel}
              @click=${this.#handleMinusClick}
            >
              <span slot="icon" id="minus-icon">
                <svg
                  fill="currentColor"
                  height="1em"
                  width="1em"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                </svg>
              </span>
            </pfv6-button>
          </pfv6-input-group-item>
          <pfv6-input-group-item>
            <pfv6-text-input validated=${this.validated}>
              <input
                type="number"
                .value=${this.value === '' ? '' : String(this.value)}
                ?disabled=${this.disabled}
                ?required=${this.required}
                ?readonly=${this.readonly}
                min=${ifDefined(this.min)}
                max=${ifDefined(this.max)}
                step=${ifDefined(this.step)}
                aria-label=${this.accessibleLabel}
                aria-invalid=${this.validated === 'error' ? 'true' : 'false'}
                @input=${this.#handleInputChange}
                @blur=${this.#handleInputBlur}
                @keydown=${this.#handleInputKeyDown}
              />
            </pfv6-text-input>
          </pfv6-input-group-item>
          <pfv6-input-group-item>
            <pfv6-button
              variant="control"
              ?is-disabled=${this.#isPlusDisabled()}
              accessible-label=${this.plusBtnAccessibleLabel}
              @click=${this.#handlePlusClick}
            >
              <span slot="icon" id="plus-icon">
                <svg
                  fill="currentColor"
                  height="1em"
                  width="1em"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                >
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                </svg>
              </span>
            </pfv6-button>
          </pfv6-input-group-item>
        </pfv6-input-group>
        ${this.unit && this.unitPosition === 'after' ? unitContent : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-number-input': Pfv6NumberInput;
  }
}
