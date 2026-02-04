import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-popover-body.css';

/**
 * Popover body sub-component.
 *
 * @summary Body section of popover
 * @slot - Body content
 */
@customElement('pfv6-popover-body')
export class Pfv6PopoverBody extends LitElement {
  static styles = styles;

  render(): TemplateResult {
    return html`
      <div id="body">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-popover-body': Pfv6PopoverBody;
  }
}
