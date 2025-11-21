import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import './pfv6-card-title.js';
import './pfv6-card-body.js';
import './pfv6-card-footer.js';
import './pfv6-card-expandable-content.js';

import styles from './pfv6-card.css';

/**
 * PatternFly Card Component
 * 
 * A card is a content container that displays entry-level information—typically 
 * within dashboards, galleries, and catalogs.
 * 
 * Supports all PatternFly v6 Card features including:
 * - Size modifiers (compact, large)
 * - Variants (default, secondary)
 * - Interactive states (selectable, clickable, disabled)
 * - Expandable content
 * - Full height layout
 * - Plain styling
 * 
 * @element pfv6-card
 * 
 * @slot - Default slot for card sub-components (pfv6-card-title, pfv6-card-body, pfv6-card-footer, pfv6-card-expandable-content)
 * @slot header-image - Card header image (e.g. brand logo)
 * @slot header-icon - Card header icon (positioned before title, e.g. for expandable cards)
 * @slot actions - Card header actions (buttons, menus, etc.)
 * 
 * @fires card-click - Dispatched when a clickable or selectable card is clicked
 * @fires card-select - Dispatched when a selectable card's selection state changes
 * @fires card-expand - Dispatched when an expandable card's expansion state changes
 * 
 * @csspart container - The card container element
 * @csspart header - The card header element
 * @csspart header-content - The card header content container (images and title)
 * @csspart title - The card title element
 * @csspart body - The card body element
 * @csspart footer - The card footer element
 * @csspart actions - The card actions container
 * @csspart expand-toggle - The expandable card toggle button
 * @csspart selectable-input - The selectable card checkbox container
 * 
 * @cssprop --pf-v6-c-card--BackgroundColor - Card background color
 * @cssprop --pf-v6-c-card--BorderColor - Card border color
 * @cssprop --pf-v6-c-card--BorderStyle - Card border style
 * @cssprop --pf-v6-c-card--BorderWidth - Card border width
 * @cssprop --pf-v6-c-card--BorderRadius - Card border radius
 * @cssprop --pf-v6-c-card--first-child--PaddingBlockStart - First child padding block start
 * @cssprop --pf-v6-c-card--child--PaddingInlineEnd - Child padding inline end
 * @cssprop --pf-v6-c-card--child--PaddingBlockEnd - Child padding block end
 * @cssprop --pf-v6-c-card--child--PaddingInlineStart - Child padding inline start
 * @cssprop --pf-v6-c-card--c-divider--child--PaddingBlockStart - Divider child padding block start
 * @cssprop --pf-v6-c-card__title-text--Color - Title text color
 * @cssprop --pf-v6-c-card__title-text--FontFamily - Title font family
 * @cssprop --pf-v6-c-card__title-text--FontSize - Title font size
 * @cssprop --pf-v6-c-card__title-text--FontWeight - Title font weight
 * @cssprop --pf-v6-c-card__title-text--LineHeight - Title line height
 * @cssprop --pf-v6-c-card__body--FontSize - Body font size
 * @cssprop --pf-v6-c-card__body--Color - Body text color
 * @cssprop --pf-v6-c-card__footer--FontSize - Footer font size
 * @cssprop --pf-v6-c-card__footer--Color - Footer text color
 * @cssprop --pf-v6-c-card--c-button--disabled--Color - Disabled button color
 * @cssprop --pf-v6-c-card--m-compact__title-text--FontSize - Compact variant title font size
 * @cssprop --pf-v6-c-card--m-compact__body--FontSize - Compact variant body font size
 * @cssprop --pf-v6-c-card--m-compact__footer--FontSize - Compact variant footer font size
 * @cssprop --pf-v6-c-card--m-compact--first-child--PaddingBlockStart - Compact variant first child padding block start
 * @cssprop --pf-v6-c-card--m-compact--child--PaddingInlineEnd - Compact variant child padding inline end
 * @cssprop --pf-v6-c-card--m-compact--child--PaddingBlockEnd - Compact variant child padding block end
 * @cssprop --pf-v6-c-card--m-compact--child--PaddingInlineStart - Compact variant child padding inline start
 * @cssprop --pf-v6-c-card--m-display-lg__title-text--FontSize - Large variant title font size
 * @cssprop --pf-v6-c-card--m-display-lg__body--FontSize - Large variant body font size
 * @cssprop --pf-v6-c-card--m-display-lg__footer--FontSize - Large variant footer font size
 * @cssprop --pf-v6-c-card--m-display-lg--first-child--PaddingBlockStart - Large variant first child padding block start
 * @cssprop --pf-v6-c-card--m-display-lg--child--PaddingInlineEnd - Large variant child padding inline end
 * @cssprop --pf-v6-c-card--m-display-lg--child--PaddingBlockEnd - Large variant child padding block end
 * @cssprop --pf-v6-c-card--m-display-lg--child--PaddingInlineStart - Large variant child padding inline start
 * @cssprop --pf-v6-c-card--m-secondary--BackgroundColor - Secondary variant background color
 * @cssprop --pf-v6-c-card--m-secondary--BorderColor - Secondary variant border color
 * @cssprop --pf-v6-c-card--m-secondary--BorderWidth - Secondary variant border width
 * @cssprop --pf-v6-c-card--m-plain--BackgroundColor - Plain modifier background color
 * @cssprop --pf-v6-c-card--m-plain--BorderColor - Plain modifier border color
 * @cssprop --pf-v6-c-card--m-rounded--BorderRadius - Rounded modifier border radius
 * @cssprop --pf-v6-c-card--m-selectable--hover--BorderColor - Selectable hover border color
 * @cssprop --pf-v6-c-card--m-selectable--hover--BorderWidth - Selectable hover border width
 * @cssprop --pf-v6-c-card--m-selectable--m-selected--BorderColor - Selected state border color
 * @cssprop --pf-v6-c-card--m-selectable--m-selected--BorderWidth - Selected state border width
 * @cssprop --pf-v6-c-card--m-selectable--m-disabled--BackgroundColor - Disabled state background color
 * @cssprop --pf-v6-c-card--m-selectable--m-disabled--BorderColor - Disabled state border color
 * @cssprop --pf-v6-c-card--m-selectable--m-disabled__title-text--Color - Disabled state title color
 * @cssprop --pf-v6-c-card--m-selectable--m-disabled__body--Color - Disabled state body color
 * @cssprop --pf-v6-c-card--m-selectable--m-disabled__footer--Color - Disabled state footer color
 * 
 * @example
 * ```html
 * <pfv6-card>
 *   <pfv6-card-title>Card Title</pfv6-card-title>
 *   <pfv6-card-body>Card body content goes here</pfv6-card-body>
 *   <pfv6-card-footer>Footer content</pfv6-card-footer>
 * </pfv6-card>
 * ```
 * 
 * @example Secondary variant
 * ```html
 * <pfv6-card variant="secondary">
 *   <pfv6-card-title>Secondary Card</pfv6-card-title>
 *   <pfv6-card-body>Card with secondary background color</pfv6-card-body>
 * </pfv6-card>
 * ```
 * 
 * @example Compact card
 * ```html
 * <pfv6-card compact>
 *   <pfv6-card-title>Compact Card</pfv6-card-title>
 *   <pfv6-card-body>Card with compact spacing</pfv6-card-body>
 * </pfv6-card>
 * ```
 * 
 * @example Expandable card
 * ```html
 * <pfv6-card expandable>
 *   <pfv6-card-title>Expandable Card</pfv6-card-title>
 *   <pfv6-card-expandable-content>
 *     <pfv6-card-body>Expandable body content</pfv6-card-body>
 *     <pfv6-card-footer>Footer content</pfv6-card-footer>
 *   </pfv6-card-expandable-content>
 * </pfv6-card>
 * ```
 * 
 * @example Customizing with CSS variables
 * ```css
 * pfv6-card {
 *   --pf-v6-c-card--BackgroundColor: #f0f0f0;
 *   --pf-v6-c-card--BorderColor: #06c;
 *   --pf-v6-c-card--BorderRadius: 8px;
 * }
 * ```
 */
@customElement('pfv6-card')
export class Pfv6Card extends LitElement {
  static readonly styles = styles;

  /**
   * Card variant - changes the visual style of the card
   * @type {'default' | 'secondary'}
   * @default 'default'
   */
  @property({ type: String, reflect: true })
  variant: 'default' | 'secondary' = 'default';

  /**
   * Modifies the card to include compact styling
   * Should not be used with `large`
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  compact = false;

  /**
   * Modifies the card to be large
   * Should not be used with `compact`
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  large = false;

  /**
   * Modifies the card so that it fills the total available height of its container
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'full-height' })
  fullHeight = false;

  /**
   * Modifies the card to include plain styling (removes border and background)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  plain = false;

  /**
   * Makes the entire card clickable/actionable
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  clickable = false;

  /**
   * Makes the card selectable with a checkbox
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  selectable = false;

  /**
   * Whether the card is currently selected (when selectable=true)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Whether the card is currently clicked (when clickable=true)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  clicked = false;

  /**
   * Makes the card expandable with a toggle
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  expandable = false;

  /**
   * Whether the card is currently expanded (when expandable=true)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * Disables the card (when selectable or clickable)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Removes the offset/padding before actions in the card header
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'actions-no-offset' })
  actionsNoOffset = false;

  /**
   * Positions the expand toggle button on the right side instead of the left
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'toggle-right-aligned' })
  toggleRightAligned = false;

  #handleCardClick = (e: MouseEvent) => {
    if (this.disabled) return;
    
    // Only handle clicks on the card itself, not on interactive children
    if (this.clickable || this.selectable) {
      const event = new Event('card-click', {
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
      
      if (this.selectable) {
        this.selected = !this.selected;
        const selectEvent = new Event('card-select', {
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(selectEvent);
      }
    }
  };

  #handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    
    // Handle Space and Enter keys for clickable/selectable cards
    if ((e.key === ' ' || e.key === 'Enter') && (this.clickable || this.selectable)) {
      e.preventDefault();
      this.#handleCardClick(e as any);
    }
  };

  #handleExpandToggle = (e: MouseEvent) => {
    if (this.disabled) return;

    e.stopPropagation(); // Prevent card click
    this.expanded = !this.expanded;

    const event = new Event('card-expand', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  };

  /**
   * Check if the card has header content (images, icons, or actions)
   */
  private _hasHeader(): boolean {
    // Check if any header slots have content
    const headerImageSlot = this.querySelector('[slot="header-image"]');
    const headerIconSlot = this.querySelector('[slot="header-icon"]');
    const actionsSlot = this.querySelector('[slot="actions"]');
    return !!(headerImageSlot || headerIconSlot || actionsSlot);
  }

  render(): TemplateResult {
    const containerClasses = {
      secondary: this.variant === 'secondary',
      compact: this.compact,
      large: this.large,
      'full-height': this.fullHeight,
      plain: this.plain,
      clickable: this.clickable,
      selectable: this.selectable,
      selected: this.selected,
      clicked: this.clicked,
      expandable: this.expandable,
      expanded: this.expanded,
      disabled: this.disabled,
      'toggle-right-aligned': this.toggleRightAligned,
    };

    const actionsClasses = {
      'pf-v6-c-card__header-actions': true,
      'no-offset': this.actionsNoOffset,
    };

    const isInteractive = this.clickable || this.selectable;
    const tabindex = isInteractive && !this.disabled ? 0 : undefined;

    return html`
      <div 
        id="container"
        part="container"
        class=${classMap(containerClasses)}
        role=${this.selectable ? 'group' : 'article'}
        tabindex=${ifDefined(tabindex)}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @click=${isInteractive ? this.#handleCardClick : undefined}
        @keydown=${isInteractive ? this.#handleKeyDown : undefined}
      >
        ${this.expandable ? html`
          <button
            id="expand-toggle"
            part="expand-toggle"
            class="expand-toggle"
            aria-expanded=${this.expanded ? 'true' : 'false'}
            aria-label=${this.expanded ? 'Collapse card' : 'Expand card'}
            @click=${this.#handleExpandToggle}
            ?disabled=${this.disabled}
          >
            <svg
              class="expand-icon"
              fill="currentColor"
              height="1em"
              width="1em"
              viewBox="0 0 320 512"
              aria-hidden="true"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
            </svg>
          </button>
        ` : ''}

        ${this.selectable ? html`
          <div
            id="selectable-input"
            part="selectable-input"
            class="selectable-input"
          >
            <input
              type="checkbox"
              id="select-checkbox"
              .checked=${this.selected}
              ?disabled=${this.disabled}
              aria-label="Select card"
              @change=${(e: Event) => {
                e.stopPropagation();
                this.selected = (e.target as HTMLInputElement).checked;
                const event = new Event('card-select', {
                  bubbles: true,
                  composed: true
                });
                this.dispatchEvent(event);
              }}
            />
            <label for="select-checkbox" class="visually-hidden">Select card</label>
          </div>
        ` : ''}

        ${this._hasHeader() ? html`
          <div id="header" part="header">
            <div id="header-content" part="header-content">
              <slot name="header-image"></slot>
              <slot name="header-icon"></slot>
            </div>
            <div id="actions" part="actions" class=${classMap(actionsClasses)}>
              <slot name="actions"></slot>
            </div>
          </div>
        ` : ''}

        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-card': Pfv6Card;
  }
}

