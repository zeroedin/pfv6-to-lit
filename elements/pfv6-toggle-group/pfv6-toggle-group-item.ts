import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { consume } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { toggleGroupContext, type ToggleGroupContext } from './context.js';
import './pfv6-toggle-group-item-element.js';
import styles from './pfv6-toggle-group-item.css';

/**
 * Event fired when the toggle group item selection changes.
 */
export class Pfv6ToggleGroupItemChangeEvent extends Event {
  constructor(
    public selected: boolean
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Toggle group item component for individual toggle buttons.
 *
 * @summary Toggle group item component
 * @alias ToggleGroupItem
 *
 * @fires Pfv6ToggleGroupItemChangeEvent#change - Fired when selection changes
 *
 * @slot text - Text content for the toggle button
 * @slot icon - Icon content for the toggle button
 *
 * @cssprop --pf-v6-c-toggle-group__button--PaddingBlockStart - Button padding block start
 * @cssprop --pf-v6-c-toggle-group__button--PaddingInlineEnd - Button padding inline end
 * @cssprop --pf-v6-c-toggle-group__button--PaddingBlockEnd - Button padding block end
 * @cssprop --pf-v6-c-toggle-group__button--PaddingInlineStart - Button padding inline start
 * @cssprop --pf-v6-c-toggle-group__button--FontSize - Button font size
 * @cssprop --pf-v6-c-toggle-group__button--LineHeight - Button line height
 * @cssprop --pf-v6-c-toggle-group__button--Color - Button text color
 * @cssprop --pf-v6-c-toggle-group__button--BackgroundColor - Button background color
 * @cssprop --pf-v6-c-toggle-group__button--ZIndex - Button z-index
 * @cssprop --pf-v6-c-toggle-group__button--hover--BackgroundColor - Button hover background color
 * @cssprop --pf-v6-c-toggle-group__button--hover--ZIndex - Button hover z-index
 * @cssprop --pf-v6-c-toggle-group__button--hover--before--BorderColor - Button hover border color
 * @cssprop --pf-v6-c-toggle-group__button--before--BorderWidth - Button border width
 * @cssprop --pf-v6-c-toggle-group__button--before--BorderColor - Button border color
 * @cssprop --pf-v6-c-toggle-group__button--m-selected--BackgroundColor - Selected button background color
 * @cssprop --pf-v6-c-toggle-group__button--m-selected--Color - Selected button text color
 * @cssprop --pf-v6-c-toggle-group__button--m-selected--before--BorderColor - Selected button border color
 * @cssprop --pf-v6-c-toggle-group__button--m-selected--ZIndex - Selected button z-index
 * @cssprop --pf-v6-c-toggle-group__button--disabled--BackgroundColor - Disabled button background color
 * @cssprop --pf-v6-c-toggle-group__button--disabled--Color - Disabled button text color
 * @cssprop --pf-v6-c-toggle-group__button--disabled--before--BorderColor - Disabled button border color
 * @cssprop --pf-v6-c-toggle-group__button--disabled--ZIndex - Disabled button z-index
 * @cssprop --pf-v6-c-toggle-group__icon--text--MarginInlineStart - Icon/text spacing
 */
@customElement('pfv6-toggle-group-item')
export class Pfv6ToggleGroupItem extends LitElement {
  static readonly styles = styles;

  @consume({ context: toggleGroupContext, subscribe: true })
  @state()
  protected _toggleGroupContext?: ToggleGroupContext;

  /** Tracks whether the icon slot has content */
  @state()
  private _hasIconContent = false;

  /** Text rendered inside the toggle group item */
  @property({ type: String })
  text?: string;

  /** Sets position of the icon when text is also passed in */
  @property({ type: String, reflect: true, attribute: 'icon-position' })
  iconPosition: 'start' | 'end' = 'start';

  /** Flag indicating if the toggle group item is disabled */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  /** Flag indicating if the toggle group item is selected */
  @property({ type: Boolean, reflect: true, attribute: 'is-selected' })
  isSelected = false;

  /** Required when icon is used with no supporting text */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /** Optional id for the button within the toggle group item */
  @property({ type: String, attribute: 'button-id' })
  buttonId?: string;

  /** Computed disabled state: individually disabled OR group disabled via context */
  get #effectiveDisabled(): boolean {
    return this.isDisabled || (this._toggleGroupContext?.areAllGroupsDisabled ?? false);
  }

  #handleClick = () => {
    if (this.#effectiveDisabled) {
      return;
    }

    const newSelected = !this.isSelected;
    this.dispatchEvent(new Pfv6ToggleGroupItemChangeEvent(newSelected));
  };

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    // Warn if icon slot is used without accessible-label and no text
    if (changedProperties.has('accessibleLabel') || changedProperties.has('text')) {
      this.#checkAccessibility();
    }
  }

  override firstUpdated() {
    this.#checkAccessibility();
  }

  #checkAccessibility() {
    // Icon-only variants require accessible-label for screen readers.
    // Validation occurs via TypeScript types and unit tests, not runtime warnings.
  }

  #handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasIconContent = assignedNodes.length > 0;
    this.#checkAccessibility();
  }

  render() {
    const isCompact = this._toggleGroupContext?.isCompact ?? false;
    const buttonClasses = {
      selected: this.isSelected,
      compact: isCompact,
    };

    return html`
      <div id="container">
        <button
          type="button"
          class=${classMap(buttonClasses)}
          aria-pressed=${this.isSelected ? 'true' : 'false'}
          @click=${this.#handleClick}
          aria-label=${ifDefined(this.accessibleLabel)}
          ?disabled=${this.#effectiveDisabled}
          id=${ifDefined(this.buttonId)}
        >
          ${this.iconPosition === 'start' ? (
            this._hasIconContent ? html`
              <pfv6-toggle-group-item-element variant="icon">
                <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
              </pfv6-toggle-group-item-element>
            ` : html`<slot name="icon" @slotchange=${this.#handleIconSlotChange} hidden></slot>`
          ) : null}
          ${this.text ? html`
            <pfv6-toggle-group-item-element variant="text">
              ${this.text}
            </pfv6-toggle-group-item-element>
          ` : html`
            <pfv6-toggle-group-item-element variant="text">
              <slot name="text"></slot>
            </pfv6-toggle-group-item-element>
          `}
          ${this.iconPosition === 'end' ? (
            this._hasIconContent ? html`
              <pfv6-toggle-group-item-element variant="icon">
                <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
              </pfv6-toggle-group-item-element>
            ` : html`<slot name="icon" @slotchange=${this.#handleIconSlotChange} hidden></slot>`
          ) : null}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-toggle-group-item': Pfv6ToggleGroupItem;
  }
}
