import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-checkbox.css';

/**
 * Checkbox component for form inputs.
 *
 * @summary A checkbox form control that integrates with native HTML forms.
 *
 * @alias Checkbox
 *
 * ## Architecture: Shadow DOM + FACE
 *
 * **Rationale**:
 * - React Checkbox renders input, label, description internally
 * - All ARIA relationships internal (label→input, description→input)
 * - Needs indeterminate state management
 * - Full styling control required
 *
 * **Shadow DOM Patterns**:
 * - Static internal IDs: `id="input"`, `id="description"`
 * - Label association: `<label for="input">`
 * - Cross-root ARIA: Not applicable (all relationships internal)
 *
 * @fires change - Native change event when checkbox state changes
 *
 * @slot - Default slot for additional content (not typically used)
 *
 * @cssprop [--pf-v6-c-check--GridGap] - Gap between checkbox elements
 * @cssprop [--pf-v6-c-check--AccentColor] - Accent color for the checkbox input
 * @cssprop [--pf-v6-c-check--m-standalone--MinHeight] - Minimum height for standalone checkbox
 * @cssprop [--pf-v6-c-check__label--disabled--Color] - Label color when disabled
 * @cssprop [--pf-v6-c-check__label--Color] - Label text color
 * @cssprop [--pf-v6-c-check__label--FontWeight] - Label font weight
 * @cssprop [--pf-v6-c-check__label--FontSize] - Label font size
 * @cssprop [--pf-v6-c-check__label--LineHeight] - Label line height
 * @cssprop [--pf-v6-c-check__description--FontSize] - Description font size
 * @cssprop [--pf-v6-c-check__description--Color] - Description text color
 * @cssprop [--pf-v6-c-check__label-required--MarginInlineStart] - Spacing before required indicator
 * @cssprop [--pf-v6-c-check__label-required--FontSize] - Required indicator font size
 * @cssprop [--pf-v6-c-check__label-required--Color] - Required indicator color
 * @cssprop [--pf-v6-c-check__input--TranslateY] - Vertical translation of checkbox input for alignment
 */
@customElement('pfv6-checkbox')
export class Pfv6Checkbox extends LitElement {
  static styles = styles;
  static formAssociated = true;
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  #internals: ElementInternals;

  @query('input[type="checkbox"]')
  private _input!: HTMLInputElement;

  /** Form name attribute */
  @property({ type: String, reflect: true })
  name = '';

  /** Form value attribute */
  @property({ type: String, reflect: true })
  value = 'on';

  /** Whether the checkbox is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Whether the checkbox is required */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Whether the checkbox is checked. If null, checkbox is indeterminate. */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Whether the checkbox is valid */
  @property({ type: Boolean, reflect: true, attribute: 'is-valid' })
  isValid = true;

  /** Label text for the checkbox */
  @property({ type: String })
  label?: string | undefined;

  /** Position of the label relative to the checkbox */
  @property({ type: String, reflect: true, attribute: 'label-position' })
  labelPosition: 'start' | 'end' = 'end';

  /** Description text for the checkbox */
  @property({ type: String })
  description?: string | undefined;

  /** Body text for the checkbox */
  @property({ type: String })
  body?: string | undefined;

  /** Accessible label for the checkbox (maps to aria-label) */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Whether the checkbox is indeterminate (partially checked) */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Whether the label wraps the checkbox input (wrapper is label element) */
  @property({ type: Boolean, reflect: true, attribute: 'is-label-wrapped' })
  isLabelWrapped = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();

    // Set initial form value
    this.#updateFormValue();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Update indeterminate state on input element
    if (changedProperties.has('indeterminate') && this._input) {
      this._input.indeterminate = this.indeterminate;
    }

    // Update form value when checked state changes
    if (changedProperties.has('checked') || changedProperties.has('value')) {
      this.#updateFormValue();
    }

    // Update ARIA attributes on host
    if (changedProperties.has('disabled')) {
      this.#internals.ariaDisabled = this.disabled ? 'true' : 'false';
    }

    if (changedProperties.has('required')) {
      this.#internals.ariaRequired = this.required ? 'true' : 'false';
    }

    if (changedProperties.has('isValid')) {
      this.#internals.ariaInvalid = this.isValid ? 'false' : 'true';
    }

    // Validate when required or checked properties change
    if (changedProperties.has('required') || changedProperties.has('checked')) {
      this.#validate();
    }
  }

  #updateFormValue() {
    if (this.checked) {
      this.#internals.setFormValue(this.value);
    } else {
      this.#internals.setFormValue(null);
    }
  }

  #validate() {
    // Check required constraint
    if (this.required && !this.checked) {
      this.#internals.setValidity(
        { valueMissing: true },
        'Please check this box if you want to proceed.',
        this._input
      );
      this.isValid = false;
    } else {
      this.#internals.setValidity({});
      this.isValid = true;
    }
  }

  #handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false; // Clear indeterminate on user interaction

    // Dispatch native change event (bubbles by default)
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formResetCallback() {
    this.checked = false;
    this.indeterminate = false;
    this.#updateFormValue();
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') {
      this.checked = state === this.value;
    }
    this.#validate();
  }

  render() {
    const containerClasses = {
      standalone: !this.label,
    };

    const labelClasses = {
      disabled: this.disabled,
    };

    const labelId = this.label ? 'label' : undefined;
    const descriptionId = this.description ? 'description' : undefined;
    const ariaDescribedBy = descriptionId;

    const inputElement = html`
      <input
        type="checkbox"
        class="input"
        id="input"
        .checked=${this.checked}
        .indeterminate=${this.indeterminate}
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-invalid=${this.isValid ? 'false' : 'true'}
        aria-label=${ifDefined(this.accessibleLabel)}
        aria-describedby=${ifDefined(ariaDescribedBy)}
        @change=${this.#handleChange}
      />
    `;

    // When isLabelWrapped, label text is in a <span> (wrapper label handles click)
    // When not wrapped, label has for attribute pointing to input
    const labelElement = this.label ? (this.isLabelWrapped ? html`
      <span
        id=${ifDefined(labelId)}
        class=${classMap({ label: true, ...labelClasses })}
      >
        ${this.label}
        ${this.required ? html`
          <span class="label-required" aria-hidden="true">
            &#42;
          </span>
        ` : null}
      </span>
    ` : html`
      <label
        id=${ifDefined(labelId)}
        for="input"
        class=${classMap({ label: true, ...labelClasses })}
      >
        ${this.label}
        ${this.required ? html`
          <span class="label-required" aria-hidden="true">
            &#42;
          </span>
        ` : null}
      </label>
    `) : null;

    const content = html`
      ${this.labelPosition === 'start' ? html`
        ${labelElement}
        ${inputElement}
      ` : html`
        ${inputElement}
        ${labelElement}
      `}
      ${this.description ? html`
        <span id=${ifDefined(descriptionId)} class="description">
          ${this.description}
        </span>
      ` : null}
      ${this.body ? html`
        <span class="body">
          ${this.body}
        </span>
      ` : null}
    `;

    // When isLabelWrapped, wrapper is <label> with for attribute, otherwise <div>
    return this.isLabelWrapped ? html`
      <label id="container" for="input" class=${classMap(containerClasses)}>
        ${content}
      </label>
    ` : html`
      <div id="container" class=${classMap(containerClasses)}>
        ${content}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-checkbox': Pfv6Checkbox;
  }
}
