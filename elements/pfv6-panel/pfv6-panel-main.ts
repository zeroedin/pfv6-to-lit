import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-panel-main.css';

/**
 * Panel main component - Contains the main content area of a panel.
 *
 * @alias Panel Main
 * @slot - Default slot for main content (typically PanelMainBody)
 *
 * @csspart container - The container element
 *
 * @cssprop --pf-v6-c-panel__main--MaxHeight - Maximum height of the main area
 * @cssprop --pf-v6-c-panel__main--Overflow - Overflow behavior of the main area
 */
@customElement('pfv6-panel-main')
export class Pfv6PanelMain extends LitElement {
  static styles = styles;

  /**
  * Max height of the panel main as a string with the value and unit (e.g., "200px")
  */
  @property({ type: String, attribute: 'max-height' })
  maxHeight?: string | undefined;

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('maxHeight')) {
      const container = this.shadowRoot?.getElementById('container');
      if (container && this.maxHeight) {
        container.style.setProperty('--pf-v6-c-panel__main--MaxHeight', this.maxHeight);
      } else if (container) {
        container.style.removeProperty('--pf-v6-c-panel__main--MaxHeight');
      }
    }
  }

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
    'pfv6-panel-main': Pfv6PanelMain;
  }
}
