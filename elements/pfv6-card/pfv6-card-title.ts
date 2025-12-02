import { LitElement, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { unsafeStatic, html as staticHtml } from 'lit/static-html.js';

import styles from './pfv6-card-title.css';

/**
 * PatternFly Card Title Component
 * 
 * A wrapper for card title content with optional semantic heading element.
 * 
 * @element pfv6-card-title
 * 
 * @slot - Default slot for title content
 * 
 * @example
 * ```html
 * <pfv6-card>
 *   <pfv6-card-title>Card Title</pfv6-card-title>
 *   <pfv6-card-body>Body content</pfv6-card-body>
 * </pfv6-card>
 * ```
 * 
 * @example With semantic heading
 * ```html
 * <pfv6-card>
 *   <pfv6-card-title component="h4">Card Title</pfv6-card-title>
 *   <pfv6-card-body>Body content</pfv6-card-body>
 * </pfv6-card>
 * ```
 */
@customElement('pfv6-card-title')
export class Pfv6CardTitle extends LitElement {
  static readonly styles = styles;

  /**
   * HTML element to use for the title wrapper
   * Allows semantic heading elements (h1-h6) or default div
   * @type {'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'}
   * @default 'div'
   */
  @property({ type: String, reflect: true })
  component: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'div';

  render(): TemplateResult {
    const titleTag = unsafeStatic(this.component);
    return staticHtml`
      <div id="container">
        <${titleTag} id="title">
          <slot></slot>
        </${titleTag}>
      </div>
    ` as unknown as TemplateResult;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-card-title': Pfv6CardTitle;
  }
}

