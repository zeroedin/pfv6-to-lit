import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-menu-toggle-checkbox.css';

/**
 * Event fired when checkbox selection changes.
 */
export class Pfv6MenuToggleCheckboxChangeEvent extends Event {
  constructor(
    public checked: boolean,
    public originalEvent: Event
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Architecture: Shadow DOM + FACE
 *
 * Rationale:
 * - React MenuToggleCheckbox renders input and label internally
 * - All ARIA relationships internal (label wraps input)
 * - Needs indeterminate state management
 * - Full styling control required
 *
 * Checkbox component for menu toggles with built-in label support.
 *
 * @summary Checkbox for menu toggles
 * @alias MenuToggleCheckbox
 *
 * @fires Pfv6MenuToggleCheckboxChangeEvent - Fired when checkbox selection changes
 *
 * @slot - Default slot for label content
 */
@customElement('pfv6-menu-toggle-checkbox')
export class Pfv6MenuToggleCheckbox extends LitElement {
  static formAssociated = true;
  static styles = styles;

  private internals: ElementInternals;

  /**
   * CRITICAL: name property MUST use reflect: true to match native input behavior.
   *
   * WHY:
   * - Native HTMLInputElement.name reflects the name attribute (per HTML spec)
   * - Used for form submission and form.elements API
   */
  @property({ type: String, reflect: true })
  name = '';

  /**
   * CRITICAL: value property MUST use reflect: true for checkbox controls.
   *
   * WHY:
   * - Native <input type="checkbox"> uses "default/on" mode (HTML spec)
   * - Form submission uses: setFormValue(checked ? value : null)
   */
  @property({ type: String, reflect: true })
  value = 'on';

  /** Flag to show if the checkbox selection is valid or invalid */
  @property({ type: Boolean, reflect: true, attribute: 'is-valid' })
  isValid = true;

  /**
   * CRITICAL: disabled MUST use Boolean type with reflect: true in FACE components.
   *
   * WHY:
   * - Browser manages disabled state via formDisabledCallback
   * - HTML boolean attributes work on PRESENCE (not string values)
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Flag to show if the checkbox is checked when it is controlled by React state */
  @property({ type: Boolean, reflect: true, attribute: 'is-checked' })
  isChecked = false;

  /** Default checked state for form reset */
  @property({ type: Boolean, attribute: 'default-checked' })
  defaultChecked = false;

  /** Label text for the checkbox */
  @property({ type: String })
  label?: string;

  /** Accessible label for the checkbox (for standalone checkboxes without visible labels) */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /** Flag to show if checkbox is in indeterminate state */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Flag to show if the checkbox is required */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Flag to show if the checkbox is readonly */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  @state()
  private hasLabel = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#updateFormValue();
    this.#validate();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    const hasCheckChange = changedProperties.has('isChecked')
      || changedProperties.has('indeterminate')
      || changedProperties.has('value');
    if (hasCheckChange) {
      this.#updateFormValue();
      this.#updateIndeterminate();
      this.#validate();
    }

    if (changedProperties.has('required')) {
      this.#validate();
    }

    if (changedProperties.has('disabled')) {
      this.internals.ariaDisabled = this.disabled ? 'true' : 'false';
    }
  }

  #updateFormValue() {
    if (this.isChecked && !this.indeterminate) {
      this.internals.setFormValue(this.value);
    } else {
      this.internals.setFormValue(null);
    }
  }

  #validate() {
    if (this.required && !this.isChecked) {
      this.internals.setValidity(
        { valueMissing: true },
        'This field is required',
        this.shadowRoot?.querySelector('input') ?? undefined
      );
    } else {
      this.internals.setValidity({});
    }
  }

  #updateIndeterminate() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      input.indeterminate = this.indeterminate;
    }
  }

  #handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (this.readonly) {
      input.checked = this.isChecked;
      event.stopPropagation();
      return;
    }
    this.isChecked = input.checked;
    this.indeterminate = false;

    this.dispatchEvent(new Pfv6MenuToggleCheckboxChangeEvent(this.isChecked, event));
  };

  #handleSlotChange = () => {
    const slot = this.shadowRoot?.querySelector('slot');
    const nodes = slot?.assignedNodes({ flatten: true }) || [];
    this.hasLabel = nodes.some(
      node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE,
    );
  };

  // Form-associated callbacks

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formResetCallback() {
    this.isChecked = this.defaultChecked;
    this.indeterminate = false;
  }

  formStateRestoreCallback(
    state: string | File | FormData | null,
  ) {
    if (typeof state === 'string') {
      this.isChecked = state === 'on' || state === this.value;
    }
  }

  formAssociatedCallback() {
    // Form association changed - could be used for validation context
  }

  override render() {
    const classes = {
      standalone: !this.hasLabel && !this.label,
    };

    return html`
      <label id="container" class=${classMap(classes)}>
        <input
          type="checkbox"
          id="input"
          name=${this.name}
          .value=${this.value}
          ?checked=${this.isChecked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-label=${ifDefined(this.accessibleLabel)}
          aria-invalid=${!this.isValid || !this.internals.checkValidity()}
          @change=${this.#handleChange}
        />
        ${this.label || this.hasLabel ? html`
          <span id="label" aria-hidden="true">
            ${this.label}
            <slot @slotchange=${this.#handleSlotChange}></slot>
          </span>
        ` : html`<slot @slotchange=${this.#handleSlotChange}></slot>`}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-menu-toggle-checkbox': Pfv6MenuToggleCheckbox;
  }
}
