import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref, createRef } from 'lit/directives/ref.js';
import type { Ref } from 'lit/directives/ref.js';

import styles from './pfv6-radio.css';

/**
 * Event fired when the radio's checked state changes.
 */
export class Pfv6RadioChangeEvent extends Event {
  constructor(
    public checked: boolean,
    public value: string
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Radio component for selecting a single option from a group.
 *
 * @alias Radio
 *
 * ## Architecture: Shadow DOM + FACE
 *
 * **Rationale**:
 * - React Radio renders input, label, description internally
 * - All ARIA relationships internal (label→input, description→input)
 * - Needs form group coordination
 * - Full styling control required
 *
 * **Shadow DOM Patterns**:
 * - Static internal IDs: `id="input"`, `id="description"`
 * - Label association: `<label for="input">`
 * - Cross-root ARIA: Not applicable (all relationships internal)
 *
 * @fires {Pfv6RadioChangeEvent} change - Fires when the radio's checked state changes
 *
 * @cssprop --pf-v6-c-radio--GridGap - Gap between grid items in the radio layout
 * @cssprop --pf-v6-c-radio--AccentColor - Accent color for the radio input
 * @cssprop --pf-v6-c-radio--m-standalone--MinHeight - Minimum height for standalone radio (no label)
 * @cssprop --pf-v6-c-radio__label--disabled--Color - Color of the label when disabled
 * @cssprop --pf-v6-c-radio__label--Color - Color of the label text
 * @cssprop --pf-v6-c-radio__label--FontWeight - Font weight of the label
 * @cssprop --pf-v6-c-radio__label--FontSize - Font size of the label
 * @cssprop --pf-v6-c-radio__label--LineHeight - Line height of the label
 * @cssprop --pf-v6-c-radio__description--FontSize - Font size of the description
 * @cssprop --pf-v6-c-radio__description--Color - Color of the description text
 * @cssprop --pf-v6-c-radio__input--first-child--MarginInlineStart - Inline start margin for first-child input
 * @cssprop --pf-v6-c-radio__input--last-child--MarginInlineEnd - Inline end margin for last-child input
 * @cssprop --pf-v6-c-radio__body--MarginBlockStart - Block start margin for body text
 * @cssprop --pf-v6-c-radio__input--TranslateY - Vertical translation for input alignment
 */
@customElement('pfv6-radio')
export class Pfv6Radio extends LitElement {
  static readonly styles = styles;

  // Form-Associated Custom Element
  static readonly formAssociated = true;
  #internals: ElementInternals;

  /**
  * The name attribute for the radio group.
  * Required for radio button grouping in forms.
  */
  @property({ type: String, reflect: true })
  name!: string;

  /**
  * The value of the radio input.
  * This is the value that will be submitted with the form when this radio is checked.
  */
  @property({ type: String, reflect: true })
  value = 'on';

  /**
  * Whether the radio is checked.
  * Use this for controlled radio buttons.
  *
  * NOTE: For form-associated custom elements, the checked attribute is reflected
  * to the host element. Uses Boolean type (not string enum) for proper HTML
  * boolean attribute behavior.
  */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
  * Whether the radio is disabled.
  *
  * NOTE: For form-associated custom elements, the disabled attribute is reflected
  * to the host element and managed by the browser via formDisabledCallback.
  * Uses Boolean type (not string enum) for proper HTML boolean attribute behavior.
  */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
  * Whether the radio is required.
  *
  * NOTE: For form-associated custom elements, the required attribute is reflected
  * to the host element. Uses Boolean type (not string enum) for proper HTML
  * boolean attribute behavior.
  */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
  * Whether the radio selection is valid.
  * When false, sets aria-invalid on the input.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-valid' })
  isValid = true;

  /**
  * Label text for the radio.
  * Either label or accessible-label must be provided.
  */
  @property({ type: String })
  label?: string;

  /**
  * Position of the label relative to the radio input.
  */
  @property({ type: String, attribute: 'label-position' })
  labelPosition: 'start' | 'end' = 'end';

  /**
  * Description text displayed below the radio.
  */
  @property({ type: String })
  description?: string;

  /**
  * Body text displayed below the description.
  */
  @property({ type: String })
  body?: string;

  /**
  * Accessible label for the radio when no visible label is provided.
  * Either label or accessible-label must be provided.
  */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /**
  * Whether the wrapper element should be a label element that wraps the input.
  * When true, clicking anywhere in the component will toggle the radio.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-label-wrapped' })
  isLabelWrapped = false;

  /**
  * Internal state for the default checked value (uncontrolled mode).
  */
  @state()
  private _defaultChecked = false;

  /**
  * Internal reference to the radio input element.
  */
  #inputRef: Ref<HTMLInputElement> = createRef();

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();

    // Note: For form-associated elements, the browser will automatically call
    // formDisabledCallback() if the disabled attribute is present in HTML.
    // We don't need to manually check for it here.

    // Validation warning for accessibility
    if (!this.label && !this.accessibleLabel) {
      console.warn('pfv6-radio: Either label or accessible-label must be provided for accessibility');
    }
  }

  /**
  * Form callbacks (FACE implementation)
  */
  formResetCallback() {
    this.checked = this._defaultChecked;
    this.#internals.setFormValue(this.checked ? this.value : null);
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
    this.#internals.ariaDisabled = disabled ? 'true' : 'false';
  }

  formStateRestoreCallback(state: string | File | FormData | null, _mode: 'restore' | 'autocomplete') {
    if (typeof state === 'string') {
      this.checked = state === this.value;
    }
  }

  /**
  * Updates form value when checked state changes
  */
  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (changedProperties.has('checked')) {
      this.#internals.setFormValue(this.checked ? this.value : null);

      // Dispatch change event
      this.dispatchEvent(new Pfv6RadioChangeEvent(this.checked, this.value));
    }

    if (changedProperties.has('isValid')) {
      this.#internals.setValidity(
        !this.isValid ? { customError: true } : {},
        !this.isValid ? 'Invalid' : ''
      );
    }
  }

  /**
  * Handle radio input changes
  */
  #handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
  }

  /**
  * Handle clicks on the wrapper when it's a label
  */
  #handleWrapperClick(event: Event) {
    if (this.isLabelWrapped && !this.disabled) {
      // Prevent double-toggle from label click
      if (event.target !== this.#inputRef.value) {
        event.preventDefault();
        this.#inputRef.value?.click();
      }
    }
  }

  render() {
    const wrapperClasses = {
      standalone: !this.label,
      disabled: this.disabled,
    };

    const labelClasses = {
      disabled: this.disabled,
    };

    const isLabelWrapper = this.isLabelWrapped;

    // Radio input element - uses static id="input" (shadow DOM scoped)
    const inputElement = html`
      <input
        ${ref(this.#inputRef)}
        id="input"
        type="radio"
        class="input"
        name=${this.name}
        value=${this.value}
        ?checked=${this.checked}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?aria-invalid=${!this.isValid}
        aria-label=${ifDefined(!this.label ? this.accessibleLabel : undefined)}
        aria-describedby=${ifDefined(this.description ? 'description' : undefined)}
        @change=${this.#handleChange}
      />
    `;

    // Label element (only if label text provided)
    // When isLabelWrapped, label text is in a <span> (wrapper label handles click)
    // When not wrapped, label has for="input" pointing to static input ID
    const labelElement = this.label ? html`
      ${isLabelWrapper ? html`
        <span class=${classMap(labelClasses)}>
          ${this.label}
        </span>
      ` : html`
        <label
          for="input"
          class=${classMap(labelClasses)}
        >
          ${this.label}
        </label>
      `}
    ` : null;

    // Description element - uses static id="description" for aria-describedby
    const descriptionElement = this.description ? html`
      <span id="description" class="description">${this.description}</span>
    ` : null;

    // Body element
    const bodyElement = this.body ? html`
      <span class="body">${this.body}</span>
    ` : null;

    // Content ordering based on labelPosition
    const content = this.labelPosition === 'start' ? html`
      ${labelElement}
      ${inputElement}
      ${descriptionElement}
      ${bodyElement}
    ` : html`
      ${inputElement}
      ${labelElement}
      ${descriptionElement}
      ${bodyElement}
    `;

    // Wrapper element (div or label based on isLabelWrapped)
    // When isLabelWrapped, wrapper is <label> with for="input" pointing to static input ID
    return isLabelWrapper ? html`
      <label
        id="container"
        class=${classMap(wrapperClasses)}
        for="input"
        @click=${this.#handleWrapperClick}
      >
        ${content}
      </label>
    ` : html`
      <div
        id="container"
        class=${classMap(wrapperClasses)}
      >
        ${content}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-radio': Pfv6Radio;
  }
}
