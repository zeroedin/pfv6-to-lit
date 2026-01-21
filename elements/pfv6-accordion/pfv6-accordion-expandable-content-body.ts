import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-accordion-expandable-content-body.css';

/**
 * Accordion expandable content body component for wrapping content inside accordion content.
 *
 * @summary Accordion Expandable Content Body
 * @slot - Default slot for body content
 */
@customElement('pfv6-accordion-expandable-content-body')
export class Pfv6AccordionExpandableContentBody extends LitElement {
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
    'pfv6-accordion-expandable-content-body': Pfv6AccordionExpandableContentBody;
  }
}
