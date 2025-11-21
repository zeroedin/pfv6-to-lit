import { LitElement, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './pfv6-card-expandable-content.css';

/**
 * PatternFly Card Expandable Content Component
 * 
 * A wrapper for expandable card content (body and footer sections).
 * Visibility is controlled by the parent card's `expanded` state.
 * 
 * @element pfv6-card-expandable-content
 * 
 * @slot - Default slot for expandable content (typically pfv6-card-body and pfv6-card-footer)
 * 
 * @example
 * ```html
 * <pfv6-card expandable>
 *   <pfv6-card-title>Title</pfv6-card-title>
 *   <pfv6-card-expandable-content>
 *     <pfv6-card-body>Body content</pfv6-card-body>
 *     <pfv6-card-footer>Footer content</pfv6-card-footer>
 *   </pfv6-card-expandable-content>
 * </pfv6-card>
 * ```
 */
@customElement('pfv6-card-expandable-content')
export class Pfv6CardExpandableContent extends LitElement {
  static readonly styles = styles;

  render(): TemplateResult {
    return html`
      <div id="expandable-content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-card-expandable-content': Pfv6CardExpandableContent;
  }
}

