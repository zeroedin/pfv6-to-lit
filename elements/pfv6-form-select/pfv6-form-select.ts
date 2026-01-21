import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-form-select.css';

/**
 * Form select component that wraps a native HTML select element with PatternFly styling.
 *
 * This component provides visual enhancements (validation icons, styling) around a native
 * `<select>` element. The user provides the native select via the `select` slot and controls
 * it directly (including name, value, disabled, required attributes).
 *
 * For label association, wrap the component with a `<label>` element (preferred) or use
 * `<label for="id">` with the select's ID.
 *
 * @slot select - Native `<select>` element (required)
 *
 * @example
 * ```html
 * <label>
 *   Country
 *   <pfv6-form-select validated="error">
 *     <select slot="select" name="country" required>
 *       <option value="">Choose...</option>
 *       <option value="us">United States</option>
 *       <option value="ca">Canada</option>
 *     </select>
 *   </pfv6-form-select>
 * </label>
 * ```
 *
 * @example With optgroups
 * ```html
 * <pfv6-form-select>
 *   <select slot="select" name="region">
 *     <optgroup label="North America">
 *       <option value="us">United States</option>
 *       <option value="ca">Canada</option>
 *     </optgroup>
 *     <optgroup label="Europe">
 *       <option value="uk">United Kingdom</option>
 *       <option value="fr">France</option>
 *     </optgroup>
 *   </select>
 * </pfv6-form-select>
 * ```
 */
@customElement('pfv6-form-select')
export class Pfv6FormSelect extends LitElement {
  static styles = styles;

  /**
   * Value to indicate validation state.
   * - success: Select will be modified to indicate valid state
   * - warning: Select will be modified to indicate warning state
   * - error: Select will be modified to indicate error state
   * - default: No validation styling
   */
  @property({ type: String, reflect: true })
  validated: 'success' | 'warning' | 'error' | 'default' = 'default';

  @state()
  private isPlaceholder = false;

  @state()
  private isDisabled = false;

  #selectElement: HTMLSelectElement | null = null;

  #observer: MutationObserver | null = null;

  #handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const elements = slot.assignedElements();

    // Clean up previous observer
    this.#observer?.disconnect();

    // Clean up previous select listener
    if (this.#selectElement) {
      this.#selectElement.removeEventListener('change', this.#handleSelectChange);
    }

    // Find the select element
    this.#selectElement = elements.find(el => el.tagName === 'SELECT') as HTMLSelectElement | null;

    if (this.#selectElement) {
      // Listen for value changes to update placeholder state
      this.#selectElement.addEventListener('change', this.#handleSelectChange);
      this.#updatePlaceholderState();
      this.isDisabled = this.#selectElement.disabled;

      // Sync aria-invalid state (may have been set before select was slotted)
      this.#syncAriaInvalid();

      // Watch for disabled attribute changes
      this.#observer = new MutationObserver(this.#handleAttributeMutation);
      this.#observer.observe(this.#selectElement, { attributes: true, attributeFilter: ['disabled'] });
    }
  };

  #syncAriaInvalid() {
    if (!this.#selectElement) return;
    if (this.validated === 'error') {
      this.#selectElement.setAttribute('aria-invalid', 'true');
    } else {
      this.#selectElement.removeAttribute('aria-invalid');
    }
  }

  #handleAttributeMutation = () => {
    if (this.#selectElement) {
      this.isDisabled = this.#selectElement.disabled;
    }
  };

  #handleSelectChange = () => {
    this.#updatePlaceholderState();
  };

  #updatePlaceholderState() {
    if (!this.#selectElement) {
      this.isPlaceholder = false;
      return;
    }

    const [selectedOption] = this.#selectElement.selectedOptions;
    this.isPlaceholder = selectedOption?.hasAttribute('data-placeholder') ?? false;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    if (this.#selectElement) {
      this.#selectElement.removeEventListener('change', this.#handleSelectChange);
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('validated')) {
      this.#syncAriaInvalid();
    }
  }

  #renderStatusIcon() {
    if (!['success', 'warning', 'error'].includes(this.validated)) {
      return null;
    }

    /* eslint-disable @stylistic/max-len */
    const iconPaths: Record<string, string> = {
      success: 'M512 0C229.232 0 0 229.232 0 512s229.232 512 512 512 512-229.232 512-512S794.768 0 512 0zm0 928C282.256 928 96 741.744 96 512S282.256 96 512 96s416 186.256 416 416-186.256 416-416 416zm235.28-635.28L416 624 276.72 484.72a48 48 0 10-67.872 67.872l176 176a48 48 0 0067.872 0l368-368a48 48 0 10-67.872-67.872z',
      warning: 'M569.6 0c25.6 0 51.2 12.8 64 38.4L1004.8 768c25.6 38.4 25.6 89.6 0 128s-64 64-102.4 64H121.6c-38.4 0-76.8-25.6-102.4-64s-25.6-89.6 0-128L390.4 38.4C403.2 12.8 428.8 0 454.4 0h115.2zm-64 832c-38.4 0-64-25.6-64-64s25.6-64 64-64 64 25.6 64 64-25.6 64-64 64zm0-192c-38.4 0-64-25.6-64-64V256c0-38.4 25.6-64 64-64s64 25.6 64 64v320c0 38.4-25.6 64-64 64z',
      error: 'M512 0C229.232 0 0 229.232 0 512s229.232 512 512 512 512-229.232 512-512S794.768 0 512 0zm0 928C282.256 928 96 741.744 96 512S282.256 96 512 96s416 186.256 416 416-186.256 416-416 416zm-64-416V192a64 64 0 01128 0v320a64 64 0 01-128 0zm64 320a80 80 0 110-160 80 80 0 010 160z',
    };
    /* eslint-enable @stylistic/max-len */

    return html`
      <span class="icon status">
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 1024 1024" aria-hidden="true">
          <path d=${iconPaths[this.validated]}></path>
        </svg>
      </span>
    `;
  }

  render() {
    const hasStatusIcon = ['success', 'warning', 'error'].includes(this.validated);

    const classes = {
      disabled: this.isDisabled,
      placeholder: this.isPlaceholder,
      success: this.validated === 'success',
      warning: this.validated === 'warning',
      error: this.validated === 'error',
    };

    return html`
      <span id="container" class=${classMap(classes)}>
        <slot name="select" @slotchange=${this.#handleSlotChange}></slot>
        <span class="utilities">
          ${hasStatusIcon ? this.#renderStatusIcon() : null}
          <span class="toggle-icon">
            <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 320 512" aria-hidden="true">
              <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
            </svg>
          </span>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-form-select': Pfv6FormSelect;
  }
}
