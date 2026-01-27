import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-toggle-group-item-element.css';

/**
 * Toggle group item element for wrapping icon or text content.
 *
 * @summary Internal wrapper for toggle group item content
 * @alias ToggleGroupItemElement
 *
 * @slot - Default slot for icon or text content
 */
@customElement('pfv6-toggle-group-item-element')
export class Pfv6ToggleGroupItemElement extends LitElement {
  static readonly styles = styles;

  /** Variant type for the element (icon or text) */
  @property({ type: String, reflect: true })
  variant: 'icon' | 'text' = 'text';

  render() {
    const classes = {
      icon: this.variant === 'icon',
      text: this.variant === 'text',
    };

    return html`
      <span class=${classMap(classes)}>
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-toggle-group-item-element': Pfv6ToggleGroupItemElement;
  }
}
