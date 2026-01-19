import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-tooltip.css';

/**
 * Tooltip content component.
 *
 * @summary Container for tooltip text content
 * @slot - Tooltip content text
 */
@customElement('pfv6-tooltip-content')
export class Pfv6TooltipContent extends LitElement {
  static styles = styles;

  /** Flag to align text to the left */
  @property({ type: Boolean, reflect: true, attribute: 'is-left-aligned' })
  isLeftAligned = false;

  render(): TemplateResult {
    const classes = {
      'pf-m-text-align-left': this.isLeftAligned,
    };

    return html`
      <div id="content" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-tooltip-content': Pfv6TooltipContent;
  }
}
