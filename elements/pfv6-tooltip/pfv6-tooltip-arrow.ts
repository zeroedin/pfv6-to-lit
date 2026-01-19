import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-tooltip.css';

/**
 * Tooltip arrow component.
 *
 * @summary Decorative arrow that points to the trigger element
 */
@customElement('pfv6-tooltip-arrow')
export class Pfv6TooltipArrow extends LitElement {
  static styles = styles;

  render(): TemplateResult {
    return html`<div id="arrow"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-tooltip-arrow': Pfv6TooltipArrow;
  }
}
