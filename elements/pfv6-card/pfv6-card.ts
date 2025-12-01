import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import './pfv6-card-header.js';
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
 * The Card component is a **presentational wrapper** that applies visual styling based on props.
 * Interactive behavior (expand toggle, checkbox, clickable actions) is handled by the CardHeader sub-component.
 * 
 * Supports all PatternFly v6 Card visual modifiers:
 * - Size modifiers (compact, large)
 * - Variants (default, secondary)
 * - Visual state classes (selectable, clickable, selected, current, disabled, expanded)
 * - Full height layout
 * - Plain styling
 * 
 * @element pfv6-card
 * 
 * @slot - Default slot for card sub-components (pfv6-card-header, pfv6-card-title, pfv6-card-body, pfv6-card-footer, pfv6-card-expandable-content)
 * 
 * @csspart container - The card container element
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
 * @example Basic card
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
 * @example Selectable card (interactive behavior in CardHeader)
 * ```html
 * <pfv6-card is-selectable is-selected>
 *   <pfv6-card-header selectable-actions='{"name": "card1"}'>
 *     <pfv6-card-title>Selectable Card</pfv6-card-title>
 *   </pfv6-card-header>
 *   <pfv6-card-body>This card is selectable</pfv6-card-body>
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
   * Base HTML element to render (e.g., 'div', 'article', 'section')
   * @type {string}
   * @default 'div'
   */
  @property({ type: String })
  component: keyof HTMLElementTagNameMap = 'div';

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
   * Visual state flag indicating the card can be selected.
   * Note: Actual selection behavior is handled by CardHeader with selectableActions.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-selectable' })
  isSelectable = false;

  /**
   * Visual state flag indicating the card can be clicked.
   * Note: Actual clickable behavior is handled by CardHeader with selectableActions.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-clickable' })
  isClickable = false;

  /**
   * Visual state flag indicating the card is currently selected.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-selected' })
  isSelected = false;

  /**
   * Visual state flag indicating the card is currently clicked/active (applies .pf-m-current class).
   * Note: React prop is "isClicked", CSS class is "pf-m-current".
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-clicked' })
  isClicked = false;

  /**
   * Visual state flag indicating the card is disabled.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  /**
   * Visual state flag indicating the card is expanded.
   * Note: Actual expand behavior is handled by CardHeader with onExpand callback.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;


  render(): TemplateResult {
    const containerClasses = {
      secondary: this.variant === 'secondary',
      compact: this.compact,
      large: this.large,
      'full-height': this.fullHeight,
      plain: this.plain,
      selectable: this.isSelectable,
      clickable: this.isClickable,
      selected: this.isSelected,
      current: this.isClicked,  // Note: Property is isClicked, CSS class is .current
      disabled: this.isDisabled,
      expanded: this.isExpanded,
    };

    return html`
      <div 
        id="container"
        part="container"
        class=${classMap(containerClasses)}
      >
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

