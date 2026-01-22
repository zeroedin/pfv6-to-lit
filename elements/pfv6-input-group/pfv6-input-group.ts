import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import './pfv6-input-group-item.js';
import './pfv6-input-group-text.js';
import styles from './pfv6-input-group.css';

/**
 * Input group component for grouping form controls and related elements.
 *
 * @summary Groups form inputs with buttons, labels, and other elements
 * @slot - Default slot for input group content (input-group-item, input-group-text, form controls)
 * @cssprop --pf-v6-c-input-group--Gap - Gap between input group items
 */
@customElement('pfv6-input-group')
export class Pfv6InputGroup extends LitElement {
  static styles = styles;

  render() {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-input-group': Pfv6InputGroup;
  }
}
