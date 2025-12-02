import { LitElement, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { consume } from '@lit/context';

import { cardContext, type CardContext } from '@pfv6/elements/pfv6-card/context.js';
import styles from './pfv6-checkbox.css';

/**
 * PatternFly Checkbox Component
 * 
 * A checkbox is used to select a single item or multiple items, typically to 
 * choose elements to perform an action or to reflect a binary setting.
 * 
 * Supports all PatternFly v6 Checkbox features including:
 * - Checked/unchecked/indeterminate states
 * - Required indicator
 * - Disabled state
 * - Validation states
 * - Label positioning (before/after input)
 * - Standalone mode (no visible label)
 * - Description and body content
 * - Form integration
 * 
 * @element pfv6-checkbox
 * 
 * @slot - Default slot for label content
 * @slot description - Optional description text below the label
 * @slot body - Optional body content below the description
 * 
 * @fires change - Dispatched when the checkbox state changes
 * 
 * @csspart container - The checkbox container element
 * @csspart input - The native checkbox input element
 * @csspart label - The label element
 * @csspart description - The description element
 * @csspart body - The body element
 * 
 * @cssprop --pf-v6-c-check--GridGap - Grid gap between checkbox and label/content
 * @cssprop --pf-v6-c-check--AccentColor - Checkbox accent color (checked state)
 * @cssprop --pf-v6-c-check--m-standalone--MinHeight - Min height for standalone checkbox
 * @cssprop --pf-v6-c-check__label--disabled--Color - Label color when disabled
 * @cssprop --pf-v6-c-check__label--Color - Label text color
 * @cssprop --pf-v6-c-check__label--FontWeight - Label font weight
 * @cssprop --pf-v6-c-check__label--FontSize - Label font size
 * @cssprop --pf-v6-c-check__label--LineHeight - Label line height
 * @cssprop --pf-v6-c-check__description--FontSize - Description font size
 * @cssprop --pf-v6-c-check__description--Color - Description text color
 * @cssprop --pf-v6-c-check__label-required--MarginInlineStart - Required indicator margin
 * @cssprop --pf-v6-c-check__label-required--FontSize - Required indicator font size
 * @cssprop --pf-v6-c-check__label-required--Color - Required indicator color
 * @cssprop --pf-v6-c-check__input--TranslateY - Vertical alignment offset for input
 * 
 * @example
 * ```html
 * <!-- Basic checkbox -->
 * <pfv6-checkbox id="check1">Subscribe to newsletter</pfv6-checkbox>
 * 
 * <!-- Checked by default -->
 * <pfv6-checkbox id="check2" checked>I agree to the terms</pfv6-checkbox>
 * 
 * <!-- Disabled -->
 * <pfv6-checkbox id="check3" disabled>Disabled option</pfv6-checkbox>
 * 
 * <!-- Required with indicator -->
 * <pfv6-checkbox id="check4" required>Required field</pfv6-checkbox>
 * 
 * <!-- Indeterminate state -->
 * <pfv6-checkbox id="check5" .checked=${null}>Select all</pfv6-checkbox>
 * 
 * <!-- With description -->
 * <pfv6-checkbox id="check6">
 *   Enable notifications
 *   <span slot="description">You will receive email notifications</span>
 * </pfv6-checkbox>
 * 
 * <!-- Label before checkbox -->
 * <pfv6-checkbox id="check7" label-position="start">Label first</pfv6-checkbox>
 * 
 * <!-- Standalone (no visible label, use accessible-label) -->
 * <pfv6-checkbox id="check8" accessible-label="Select row"></pfv6-checkbox>
 * ```
 */
@customElement('pfv6-checkbox')
export class Pfv6Checkbox extends LitElement {
  static readonly styles = styles;
  static formAssociated = true;

  static readonly shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * ElementInternals for form association and ARIA attributes
   * @private
   */
  private readonly internals: ElementInternals;

  /**
   * Card context - consumed when checkbox is inside a card
   * @internal
   */
  @consume({ context: cardContext, subscribe: true })
  @property({ attribute: false })
  private _cardContext?: CardContext;

  /**
   * Reference to the native checkbox input element
   * @private
   */
  @query('input[type="checkbox"]')
  private _input!: HTMLInputElement;

  /**
   * Unique identifier for the checkbox (required for accessibility)
   */
  @property({ type: String, reflect: true })
  id = '';

  /**
   * Checkbox state: true (checked), false (unchecked), or null (indeterminate)
   */
  @property({ type: Boolean })
  checked: boolean | null = false;

  /**
   * Whether the checkbox is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the checkbox is required
   */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * Whether the checkbox state is valid
   */
  @property({ type: Boolean, reflect: true })
  valid = true;

  /**
   * Position of the label relative to the checkbox
   * - 'end': Label after checkbox (default)
   * - 'start': Label before checkbox
   */
  @property({ type: String, attribute: 'label-position', reflect: true })
  labelPosition: 'start' | 'end' = 'end';

  /**
   * Accessible label for the checkbox (use when no visible label)
   * Maps to aria-label on the input element
   * 
   * Note: Future improvement will render this as visually-hidden label text
   * instead of aria-label for better accessibility (see TODO.md)
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /**
   * Name attribute for form integration
   */
  @property({ type: String, reflect: true })
  name: string | undefined = undefined;

  /**
   * Value attribute for form integration
   */
  @property({ type: String, reflect: true })
  value: string | undefined = undefined;

  /**
   * Internal state: whether the checkbox has a visible label
   * @private
   */
  @state()
  private _hasLabel = false;

  /**
   * Internal state: whether the checkbox has description content
   * @private
   */
  @state()
  private _hasDescription = false;

  /**
   * Internal state: whether the checkbox has body content
   * @private
   */
  @state()
  private _hasBody = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  /**
   * Initialize slot detection on first connection
   * @private
   */
  connectedCallback(): void {
    super.connectedCallback();
    
    // Check for description and body slots immediately
    // This ensures they render on first load
    const descriptionSlot = this.querySelector('[slot="description"]');
    const bodySlot = this.querySelector('[slot="body"]');
    
    this._hasDescription = !!descriptionSlot;
    this._hasBody = !!bodySlot;
  }

  /**
   * Handle slot changes to detect label, description, and body presence
   * @private
   */
  #handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    const slotName = slot.name;

    if (slotName === '' || !slotName) {
      // Default slot (label)
      const nodes = slot.assignedNodes({ flatten: true });
      this._hasLabel = nodes.some(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent?.trim() ||
        node.nodeType === Node.ELEMENT_NODE
      );
    } else if (slotName === 'description') {
      const nodes = slot.assignedNodes({ flatten: true });
      this._hasDescription = nodes.length > 0;
    } else if (slotName === 'body') {
      const nodes = slot.assignedNodes({ flatten: true });
      this._hasBody = nodes.length > 0;
    }
  }

  /**
   * Handle checkbox input changes
   * @private
   */
  #handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    
    // Dispatch custom change event
    this.dispatchEvent(new Pfv6CheckboxChangeEvent(
      this.checked,
      input.indeterminate
    ));
  }

  /**
   * Update indeterminate state when checked property changes
   * Update ARIA attributes via ElementInternals
   */
  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);

    // Update indeterminate state
    if (changedProperties.has('checked') && this._input) {
      // Set indeterminate state (when checked === null)
      this._input.indeterminate = this.checked === null;
    }

    // Update ARIA attributes via ElementInternals
    if (changedProperties.has('accessibleLabel')) {
      this.internals.ariaLabel = this.accessibleLabel || null;
    }
  }

  /**
   * Focus the checkbox input
   */
  override focus(options?: FocusOptions): void {
    this._input?.focus(options);
  }

  /**
   * Blur the checkbox input
   */
  blur(): void {
    this._input?.blur();
  }

  render(): TemplateResult {
    const isStandalone = !this._hasLabel;
    const isReversed = this.labelPosition === 'start';
    const isInCard = this._cardContext?.isSelectable ?? false;

    const containerClasses = {
      standalone: isStandalone,
      'card-overlay': isInCard,
    };

    // Create input element template
    const inputElement = html`
      <input
        id=${ifDefined(this.id || undefined)}
        type="checkbox"
        part="input"
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        .checked=${live(this.checked === true)}
        .indeterminate=${this.checked === null}
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-invalid=${this.valid ? 'false' : 'true'}
        aria-label=${ifDefined(this.accessibleLabel)}
        aria-describedby=${ifDefined(this._hasDescription ? `${this.id}-description` : undefined)}
        @change=${this.#handleChange}
      />
    `;

    // Text visibility is controlled by CSS (card-overlay mode hides text visually)
    const labelElement = html`
      <label 
        id="label"
        part="label"
        for=${ifDefined(this.id || undefined)}
      >
        <slot @slotchange=${this.#handleSlotChange}></slot>${this.required ? html`<span id="required" aria-hidden="true">*</span>` : ''}
      </label>
    `;

    return html`
      <div 
        id="container" 
        class=${classMap(containerClasses)}
        part="container"
      >
        ${isReversed ? html`
          ${labelElement}
          ${inputElement}
        ` : html`
          ${inputElement}
          ${labelElement}
        `}

        ${this._hasDescription ? html`
          <div 
            id=${`${this.id}-description`}
            class="description"
            part="description"
          >
            <slot name="description" @slotchange=${this.#handleSlotChange}></slot>
          </div>
        ` : ''}

        ${this._hasBody ? html`
          <div id="body" part="body">
            <slot name="body" @slotchange=${this.#handleSlotChange}></slot>
          </div>
        ` : ''}
      </div>
    `;
  }
}

/**
 * Event dispatched when the checkbox state changes
 * 
 * @example
 * ```typescript
 * checkbox.addEventListener('change', (e: Pfv6CheckboxChangeEvent) => {
 *   console.log('Checked:', e.checked);
 *   console.log('Indeterminate:', e.indeterminate);
 * });
 * ```
 */
export class Pfv6CheckboxChangeEvent extends Event {
  constructor(
    public checked: boolean,
    public indeterminate: boolean
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-checkbox': Pfv6Checkbox;
  }
  interface HTMLElementEventMap {
    'change': Pfv6CheckboxChangeEvent;
  }
}

