import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-panel-main-body.css';

/**
 * Panel main body component - Displays body content within the panel main area.
 *
 * @slot - Default slot for body content
 *
 * @csspart container - The container element
 */
@customElement('pfv6-panel-main-body')
export class Pfv6PanelMainBody extends LitElement {
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
    'pfv6-panel-main-body': Pfv6PanelMainBody;
  }
}
