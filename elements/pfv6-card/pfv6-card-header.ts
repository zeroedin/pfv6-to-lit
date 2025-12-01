import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './pfv6-card-header.css';

/**
 * Event fired when card expand toggle is clicked
 */
export class Pfv6CardExpandEvent extends Event {
  constructor(public expanded: boolean) {
    super('expand', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when selectable action (checkbox/radio) changes
 */
export class Pfv6CardSelectableChangeEvent extends Event {
  constructor(public checked: boolean) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when clickable action is clicked
 */
export class Pfv6CardClickableClickEvent extends Event {
  constructor() {
    super('click', { bubbles: true, composed: true });
  }
}

/**
 * Card Header Component
 * 
 * The header section of a card that can contain:
 * - Expand toggle button (for expandable cards)
 * - Selectable actions (checkbox/radio for selectable cards)
 * - Clickable actions (button/link for clickable-only cards)
 * - Title content (slotted CardTitle)
 * - Action buttons/menus
 * 
 * @element pfv6-card-header
 * 
 * @slot - Default slot for CardTitle and other header content
 * @slot actions - Action buttons, dropdowns, etc.
 * 
 * @fires expand - Dispatched when expand toggle is clicked
 * 
 * @csspart header - The header container
 * @csspart header-main - The main content area (title)
 * @csspart header-toggle - The expand toggle button
 * @csspart actions - The actions container
 * @csspart selectable-actions - The selectable actions container (checkbox/radio/clickable button)
 */
@customElement('pfv6-card-header')
export class Pfv6CardHeader extends LitElement {
  static readonly styles = styles;

  /**
   * Whether the expand toggle is positioned on the right instead of left
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'toggle-right-aligned' })
  toggleRightAligned = false;

  /**
   * Whether header content should wrap
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-wrap' })
  hasWrap = false;

  /**
   * Whether actions have no offset
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'actions-no-offset' })
  actionsNoOffset = false;

  /**
   * Callback for expand toggle. If provided, renders expand toggle button.
   * Set this attribute to enable expandable card functionality.
   * Listen to the 'expand' event to handle expansion.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  expandable = false;

  /**
   * Whether the card is currently expanded (used for toggle icon rotation)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * Type of selectable input ('single' = radio, 'multiple' = checkbox)
   * If set, renders checkbox or radio input for selectable cards.
   * @type {'single' | 'multiple' | undefined}
   */
  @property({ type: String, attribute: 'selectable-variant' })
  selectableVariant?: 'single' | 'multiple';

  /**
   * ID for the selectable input element
   * @type {string | undefined}
   */
  @property({ type: String, attribute: 'selectable-id' })
  selectableId?: string;

  /**
   * Name attribute for the selectable input (required for radio groups)
   * @type {string | undefined}
   */
  @property({ type: String, attribute: 'selectable-name' })
  selectableName?: string;

  /**
   * Whether the selectable input is checked/selected
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'selectable-checked' })
  selectableChecked = false;

  /**
   * Whether the selectable input is disabled
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'selectable-disabled' })
  selectableDisabled = false;

  /**
   * Whether the selectable input is hidden (for clickable-only cards)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'selectable-hidden' })
  selectableHidden = false;

  /**
   * Accessible label for the selectable input
   * @type {string | undefined}
   */
  @property({ type: String, attribute: 'selectable-aria-label' })
  selectableAriaLabel?: string;

  /**
   * Space-delimited IDs that label the selectable input
   * @type {string | undefined}
   */
  @property({ type: String, attribute: 'selectable-aria-labelledby' })
  selectableAriaLabelledby?: string;

  /**
   * Whether this is a clickable-only card (renders button instead of checkbox)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'clickable-only' })
  clickableOnly = false;

  /**
   * Link href for clickable-only cards (renders <a> instead of <button>)
   * @type {string | undefined}
   */
  @property({ type: String, attribute: 'clickable-href' })
  clickableHref?: string;

  /**
   * Whether clickable link should open in new tab
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'clickable-external' })
  clickableExternal = false;

  #handleExpandToggle = (e: MouseEvent) => {
    e.stopPropagation();
    
    const event = new Pfv6CardExpandEvent(!this.expanded);
    this.dispatchEvent(event);
  };

  #handleSelectableChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    
    const event = new Pfv6CardSelectableChangeEvent(input.checked);
    this.dispatchEvent(event);
  };

  #handleClickableClick = (e: MouseEvent) => {
    const event = new Pfv6CardClickableClickEvent();
    this.dispatchEvent(event);
  };

  #renderExpandToggle(): TemplateResult | string {
    if (!this.expandable) return '';

    return html`
      <button
        id="expand-toggle"
        part="header-toggle"
        class="header-toggle"
        aria-expanded=${this.expanded ? 'true' : 'false'}
        aria-label=${this.expanded ? 'Collapse card' : 'Expand card'}
        @click=${this.#handleExpandToggle}
      >
        <svg
          class="header-toggle-icon"
          fill="currentColor"
          height="1em"
          width="1em"
          viewBox="0 0 320 512"
          aria-hidden="true"
        >
          <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
        </svg>
      </button>
    `;
  }

  #renderSelectableActions(): TemplateResult | string {
    // Clickable-only cards render a button or link overlay
    if (this.clickableOnly) {
      if (this.clickableHref) {
        return html`
          <div id="selectable-actions" part="selectable-actions" class="selectable-actions">
            <a
              href=${this.clickableHref}
              class="clickable-action"
              target=${ifDefined(this.clickableExternal ? '_blank' : undefined)}
              rel=${ifDefined(this.clickableExternal ? 'noopener noreferrer' : undefined)}
              aria-label=${ifDefined(this.selectableAriaLabel)}
              aria-labelledby=${ifDefined(this.selectableAriaLabelledby)}
              @click=${this.#handleClickableClick}
            ></a>
          </div>
        `;
      }

      return html`
        <div id="selectable-actions" part="selectable-actions" class="selectable-actions">
          <button
            class="clickable-action"
            aria-label=${ifDefined(this.selectableAriaLabel)}
            aria-labelledby=${ifDefined(this.selectableAriaLabelledby)}
            @click=${this.#handleClickableClick}
          ></button>
        </div>
      `;
    }

    // Selectable cards with checkbox/radio
    if (!this.selectableVariant) return '';

    const inputType = this.selectableVariant === 'single' ? 'radio' : 'checkbox';
    const inputId = this.selectableId || `card-selectable-${Math.random().toString(36).substring(2, 11)}`;

    return html`
      <div 
        id="selectable-actions" 
        part="selectable-actions" 
        class=${classMap({ 
          'selectable-actions': true,
          hidden: this.selectableHidden
        })}
      >
        <input
          type=${inputType}
          id=${inputId}
          name=${ifDefined(this.selectableName)}
          .checked=${this.selectableChecked}
          ?disabled=${this.selectableDisabled}
          aria-label=${ifDefined(this.selectableAriaLabel)}
          aria-labelledby=${ifDefined(this.selectableAriaLabelledby)}
          @change=${this.#handleSelectableChange}
        />
        <label for=${inputId} class="visually-hidden">
          ${this.selectableAriaLabel || 'Select card'}
        </label>
      </div>
    `;
  }

  #hasActions(): boolean {
    const actionsSlot = this.querySelector('[slot="actions"]');
    return !!actionsSlot;
  }

  render(): TemplateResult {
    const headerClasses = {
      'toggle-right': this.toggleRightAligned,
      wrap: this.hasWrap,
    };

    const actionsClasses = {
      'no-offset': this.actionsNoOffset,
    };

    const hasActions = this.#hasActions();

    return html`
      <div 
        id="header"
        part="header"
        class=${classMap(headerClasses)}
      >
        ${this.#renderExpandToggle()}
        ${this.#renderSelectableActions()}
        
        <div id="header-main" part="header-main" class="header-main">
          <slot></slot>
        </div>

        ${hasActions ? html`
          <div 
            id="actions" 
            part="actions" 
            class=${classMap(actionsClasses)}
          >
            <slot name="actions"></slot>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-card-header': Pfv6CardHeader;
  }
}


