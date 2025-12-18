import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-panel-footer.css';

/**
 * Panel footer component - Displays footer content at the bottom of a panel.
 *
 * @slot - Default slot for footer content
 *
 * @csspart container - The container element
 */
@customElement('pfv6-panel-footer')
export class Pfv6PanelFooter extends LitElement {
  static styles = styles;

  render() {
    return html`
      <div id="container" part="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-panel-footer': Pfv6PanelFooter;
  }
}
