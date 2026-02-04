import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-popover-footer.css';

/**
 * Popover footer sub-component.
 *
 * @summary Footer section of popover
 * @slot - Footer content
 */
@customElement('pfv6-popover-footer')
export class Pfv6PopoverFooter extends LitElement {
  static styles = styles;

  render(): TemplateResult {
    return html`
      <footer id="footer">
        <slot></slot>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-popover-footer': Pfv6PopoverFooter;
  }
}
