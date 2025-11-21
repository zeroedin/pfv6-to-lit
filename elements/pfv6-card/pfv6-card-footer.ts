import { LitElement, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './pfv6-card-footer.css';

/**
 * PatternFly Card Footer Component
 * 
 * A wrapper for card footer content.
 * 
 * @element pfv6-card-footer
 * 
 * @slot - Default slot for footer content
 * 
 * @example
 * ```html
 * <pfv6-card>
 *   <pfv6-card-title>Card Title</pfv6-card-title>
 *   <pfv6-card-body>Body content</pfv6-card-body>
 *   <pfv6-card-footer>Footer content</pfv6-card-footer>
 * </pfv6-card>
 * ```
 */
@customElement('pfv6-card-footer')
export class Pfv6CardFooter extends LitElement {
  static readonly styles = styles;

  render(): TemplateResult {
    return html`
      <div id="footer">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-card-footer': Pfv6CardFooter;
  }
}

