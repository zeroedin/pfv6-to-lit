import { LitElement, html, nothing, isServer } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { consume } from '@lit/context';
import { ComboboxController } from '@patternfly/pfe-core/controllers/combobox-controller.js';
import { InternalsController } from '@patternfly/pfe-core/controllers/internals-controller.js';
import { textInputGroupContext, type TextInputGroupContext } from './context.js';
import './pfv6-text-input-group-icon.js';
import styles from './pfv6-text-input-group-main.css';

/**
 * Option element interface for combobox functionality.
 * Options should have a `value` property and implement the PfOption pattern.
 */
interface ComboboxOption extends HTMLElement {
  value: string;
  selected?: boolean;
  active?: boolean;
}

/* eslint-disable @stylistic/max-len */
const STATUS_ICON_PATHS: Record<string, string> = {
  success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
};
/* eslint-enable @stylistic/max-len */

/**
 * Event fired when the input value changes.
 *
 * Equivalent to React's onChange callback.
 * The originalEvent contains the native input change event.
 * Access the value via event.value or event.originalEvent.target.value
 */
export class Pfv6TextInputGroupMainChangeEvent extends Event {
  constructor(
    public value: string,
    public originalEvent: Event
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Text input group main component containing the input field.
 *
 * When used as a combobox, slot option elements (implementing `value`, `selected`, `active`
 * properties) in the `options` slot. The component handles cross-root ARIA automatically
 * using feature detection for `ariaActiveDescendantElement` with fallback cloning.
 *
 * @fires Pfv6TextInputGroupMainChangeEvent - Fired when input value changes
 * @fires focus - Fired when input receives focus
 * @fires blur - Fired when input loses focus
 * @fires open - Fired when the listbox opens (combobox mode)
 * @fires close - Fired when the listbox closes (combobox mode)
 * @slot - Default slot for additional content before the input
 * @slot icon - Slot for icon to be shown on the left side
 * @slot options - Slot for option elements when used as combobox
 * @cssprop --pf-v6-c-text-input-group__main--PaddingInlineStart - Padding inline start
 * @cssprop --pf-v6-c-text-input-group__main--PaddingInlineEnd - Padding inline end
 */
@customElement('pfv6-text-input-group-main')
export class Pfv6TextInputGroupMain extends LitElement {
  static styles = styles;
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  #internals = InternalsController.of(this);
  #initialValue = '';
  #hasOptions = false;

  #combobox = ComboboxController.of<ComboboxOption>(this, {
    getItems: () => this.options,
    getFallbackLabel: () => this.accessibleLabel
      || this.#internals.computedLabelText
      || this.placeholder
      || '',
    getListboxElement: () => this._listbox ?? null,
    getToggleButton: () => this._input ?? null,
    getComboboxInput: () => this._input ?? null,
    isExpanded: () => this.expanded,
    requestShowListbox: () => this.#requestShowListbox(),
    requestHideListbox: () => this.#requestHideListbox(),
    setItemHidden: (item, hidden) => {
      item.hidden = hidden;
    },
    isItem: (item): item is ComboboxOption =>
      !!item && 'value' in item && typeof item.value === 'string',
    setItemActive: (item, active) => {
      item.active = active;
      if (this.expanded && active) {
        item.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
      }
    },
    setItemSelected: (item, selected) => {
      item.selected = selected;
      if (selected && this._input) {
        this._input.value = item.value;
        this.value = item.value;
      }
    },
  });

  @query('#input') private _input?: HTMLInputElement;
  @query('#listbox') private _listbox?: HTMLElement;

  @consume({ context: textInputGroupContext, subscribe: true })
  @state()
  private _context: TextInputGroupContext | undefined;

  /** Type that the input accepts */
  @property({ type: String })
  type:
    | 'text'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'time'
    | 'url' = 'text';

  /** Suggestion that will show up like a placeholder even with text in the input */
  @property({ type: String })
  hint?: string;

  /** Accessibility label for the input. Used when no external label is associated. */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel = 'Type to filter';

  /** Value for the input */
  @property({ type: String })
  value = '';

  /** Placeholder value for the input */
  @property({ type: String })
  placeholder?: string;

  /** Name for the input */
  @property({ type: String })
  name?: string;

  /** Whether the listbox is expanded. Only applies when options are slotted. */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  @state()
  private hasIcon = false;

  /** List of option elements from light DOM */
  get options(): ComboboxOption[] {
    if (isServer) {
      return [];
    }
    return Array.from(this.querySelectorAll<ComboboxOption>('[slot="options"]'))
        .filter((el): el is ComboboxOption =>
          'value' in el && typeof el.value === 'string'
        );
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#initialValue = this.value;
  }

  updated(changed: PropertyValues<this>): void {
    if (changed.has('value')) {
      this.#internals.setFormValue(this.value);
    }
    if (changed.has('_context')) {
      this.#combobox.disabled = this._context?.isDisabled ?? false;
    }
  }

  formResetCallback(): void {
    this.value = this.#initialValue;
  }

  formDisabledCallback(_disabled: boolean): void {
    this.requestUpdate();
  }

  #requestShowListbox(): void | boolean {
    if (!this.#hasOptions) {
      return false;
    }
    this.expanded = true;
    this.dispatchEvent(new Event('open', { bubbles: true }));
  }

  #requestHideListbox(): void {
    this.expanded = false;
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }

  #handleOptionsSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this.#hasOptions = slot.assignedElements().length > 0;
    if (this.#hasOptions) {
      // Update combobox items when options change
      this.#combobox.items = this.options;
    }
  }

  #handleIconSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this.hasIcon = slot.assignedElements().length > 0;
  }

  #handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new Pfv6TextInputGroupMainChangeEvent(input.value, e));
  }

  #handleFocus(): void {
    this.dispatchEvent(new FocusEvent('focus', { bubbles: true, composed: true }));
  }

  #handleBlur(): void {
    this.dispatchEvent(new FocusEvent('blur', { bubbles: true, composed: true }));
  }

  render() {
    const isDisabled = this._context?.isDisabled ?? false;
    const validated = this._context?.validated;
    const showStatusIcon = !!validated;
    const statusIconPath = validated ? STATUS_ICON_PATHS[validated] : '';
    const hideLightDomOptions = !ComboboxController.supportsCrossRootActiveDescendant;

    const classes = {
      icon: this.hasIcon,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
        <label id="label" for="input">${this.accessibleLabel}</label>
        <span id="text">
          ${this.hint ? html`
            <input
              id="hint-input"
              class="hint"
              type="text"
              disabled
              aria-hidden="true"
              .value=${this.hint}
            />
          ` : nothing}
          ${this.hasIcon ? html`
            <pfv6-text-input-group-icon>
              <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
            </pfv6-text-input-group-icon>
          ` : html`
            <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
          `}
          <input
            id="input"
            type=${this.type}
            ?disabled=${isDisabled}
            .value=${this.value}
            placeholder=${ifDefined(this.placeholder)}
            name=${ifDefined(this.name)}
            @input=${this.#handleChange}
            @focus=${this.#handleFocus}
            @blur=${this.#handleBlur}
          />
          ${showStatusIcon ? html`
            <pfv6-text-input-group-icon is-status>
              <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 24 24" aria-hidden="true">
                <path d=${statusIconPath}></path>
              </svg>
            </pfv6-text-input-group-icon>
          ` : nothing}
        </span>
        ${this.#hasOptions ? html`
          <div id="listbox-container" ?hidden=${!this.expanded}>
            <div id="listbox" role="listbox" aria-label=${this.accessibleLabel}>
              ${this.#combobox.renderItemsToShadowRoot()}
              <slot name="options"
                    ?hidden=${hideLightDomOptions}
                    @slotchange=${this.#handleOptionsSlotChange}></slot>
            </div>
          </div>
        ` : html`
          <slot name="options" @slotchange=${this.#handleOptionsSlotChange}></slot>
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-text-input-group-main': Pfv6TextInputGroupMain;
  }
}
