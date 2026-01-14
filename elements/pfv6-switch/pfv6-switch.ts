import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-switch.css';

/**
 * Event fired when switch checked state changes.
 */
export class Pfv6SwitchChangeEvent extends Event {
  constructor(
    public checked: boolean
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Switch component for toggling between on/off states.
 *
 * Architecture: Shadow DOM + FACE
 *
 * Rationale:
 * - Component renders label and input internally as a single unit
 * - All ARIA relationships are internal to the component
 * - Complex state management (checked, disabled, required)
 * - Needs form participation via ElementInternals
 *
 * @summary Switch toggle component
 * @alias Switch
 *
 * @fires {Pfv6SwitchChangeEvent} change - Fired when the switch checked state changes
 *
 * @cssprop [--pf-v6-c-switch__input--checked__toggle--BackgroundColor] - Background color of the toggle when checked
 * @cssprop [--pf-v6-c-switch__input--checked__toggle--before--TranslateX] - X translation of the toggle handle when checked
 * @cssprop [--pf-v6-c-switch__toggle--BackgroundColor] - Background color of the toggle
 * @cssprop [--pf-v6-c-switch__toggle--BorderRadius] - Border radius of the toggle
 * @cssprop [--pf-v6-c-switch__toggle--Height] - Height of the toggle
 * @cssprop [--pf-v6-c-switch__toggle--Width] - Width of the toggle
 */
@customElement('pfv6-switch')
export class Pfv6Switch extends LitElement {
  static readonly styles = styles;
  static readonly formAssociated = true;

  #internals: ElementInternals;


  /** Form control name */
  @property({ type: String })
  name = '';

  /** Form control value */
  @property({ type: String, reflect: true })
  value = 'on';

  /** Whether the switch is checked */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Whether the switch is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Whether the switch is required */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Text value for the visible label */
  @property({ type: String })
  label = '';

  /** Adds an accessible name when label is not provided */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /** Initial checked state for uncontrolled mode (do not use with checked) */
  @property({ type: Boolean, attribute: 'default-checked' })
  defaultChecked?: boolean;

  /** Whether to show a check icon in the toggle */
  @property({ type: Boolean, reflect: true, attribute: 'has-check-icon' })
  hasCheckIcon = false;

  /** Whether to reverse the layout (label at start, toggle at end) */
  @property({ type: Boolean, reflect: true, attribute: 'is-reversed' })
  isReversed = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = 'switch';
  }

  connectedCallback(): void {
    super.connectedCallback();

    // Initialize from defaultChecked if not already set
    if (this.defaultChecked !== undefined && !this.checked) {
      this.checked = this.defaultChecked;
    }

    // Validate that accessible name is provided
    if (!this.label && !this.accessibleLabel) {
      console.error(
        'pfv6-switch: Switch requires either "label" or "accessible-label" property to be specified'
      );
    }
  }

  updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    // Update form value when checked state changes
    if (changedProperties.has('checked')) {
      this.#internals.setFormValue(this.checked ? this.value : null);
      this.#internals.ariaChecked = this.checked ? 'true' : 'false';
    }

    // Update ARIA disabled state
    if (changedProperties.has('disabled')) {
      this.#internals.ariaDisabled = this.disabled ? 'true' : 'false';
    }

    // Update ARIA label
    if (changedProperties.has('accessibleLabel')) {
      if (this.accessibleLabel) {
        this.#internals.ariaLabel = this.accessibleLabel;
      }
    }
  }

  /**
   * Form reset callback - resets checked state to default
   */
  formResetCallback(): void {
    this.checked = this.defaultChecked ?? false;
    this.#internals.setFormValue(this.checked ? this.value : null);
  }

  /**
   * Form disabled callback - updates disabled state
   */
  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
    this.#internals.ariaDisabled = disabled ? 'true' : 'false';
  }

  /**
   * Handle input change event
   */
  #handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;

    // Dispatch custom change event
    this.dispatchEvent(new Pfv6SwitchChangeEvent(this.checked));
  };

  render() {
    const containerClasses = {
      reverse: this.isReversed,
    };

    const hasAccessibleLabel = !!this.accessibleLabel;
    const hasVisualLabel = !!this.label;
    const isStandaloneMode = hasAccessibleLabel && !hasVisualLabel;
    const showCheckIcon = this.hasCheckIcon || isStandaloneMode;

    return html`
      <label
        id="container"
        class=${classMap(containerClasses)}
        for="input"
      >
        <input
          id="input"
          type="checkbox"
          role="none"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @change=${this.#handleChange}
        />
        <span id="toggle">
          ${showCheckIcon ? html`
            <span id="toggle-icon">
              <svg
                fill="currentColor"
                height="1em"
                width="1em"
                viewBox="0 0 512 512"
                aria-hidden="true"
                role="img"
              >
                <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg>
            </span>
          ` : null}
        </span>
        ${hasAccessibleLabel ? html`
          <span id="label" class="screen-reader">${this.accessibleLabel}</span>
        ` : hasVisualLabel ? html`
          <span id="label">${this.label}</span>
        ` : null}
        ${hasAccessibleLabel && hasVisualLabel ? html`
          <span aria-hidden="true">${this.label}</span>
        ` : null}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-switch': Pfv6Switch;
  }
}
