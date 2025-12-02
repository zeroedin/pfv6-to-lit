import { LitElement, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import styles from './pfv6-card-body.css';

/**
 * PatternFly Card Body Component
 * 
 * A container for card body content. Can be used multiple times within a card
 * to create multiple body sections with individual control over fill behavior.
 * 
 * @element pfv6-card-body
 * 
 * @slot - Default slot for body content
 * 
 * @cssprop --pf-v6-c-card__body--FontSize - Body font size
 * @cssprop --pf-v6-c-card__body--Color - Body text color
 * @cssprop --pf-v6-c-card--first-child--PaddingBlockStart - Padding block start
 * @cssprop --pf-v6-c-card--child--PaddingBlockEnd - Padding block end
 * @cssprop --pf-v6-c-card--child--PaddingInlineStart - Padding inline start
 * @cssprop --pf-v6-c-card--child--PaddingInlineEnd - Padding inline end
 * 
 * @example Basic usage
 * ```html
 * <pfv6-card>
 *   <pfv6-card-title>Card Title</pfv6-card-title>
 *   <pfv6-card-body>Body content</pfv6-card-body>
 *   <pfv6-card-footer>Footer</pfv6-card-footer>
 * </pfv6-card>
 * ```
 * 
 * @example Multiple body sections
 * ```html
 * <pfv6-card>
 *   <pfv6-card-title>Card Title</pfv6-card-title>
 *   <pfv6-card-body>First body section (fills)</pfv6-card-body>
 *   <pfv6-card-body filled="false">Second body section (no fill)</pfv6-card-body>
 *   <pfv6-card-body>Third body section (fills)</pfv6-card-body>
 *   <pfv6-card-footer>Footer</pfv6-card-footer>
 * </pfv6-card>
 * ```
 */
@customElement('pfv6-card-body')
export class Pfv6CardBody extends LitElement {
  static readonly styles = styles;

  /**
   * Whether the body section should fill available height (flex-grow)
   * When 'true', the body will expand to fill available space.
   * When 'false', the body will only take up as much space as its content needs.
   * 
   * @type {'true' | 'false'}
   * @default 'true'
   */
  @property({ type: String, reflect: true })
  filled: 'true' | 'false' = 'true';

  render(): TemplateResult {
    const classes = {
      'filled': this.filled === 'true',
      'no-fill': this.filled === 'false',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-card-body': Pfv6CardBody;
  }
}
