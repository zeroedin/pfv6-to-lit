import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-masthead-content.css';

/**
 * Masthead content component for the content area (navigation, utilities).
 *
 * @summary Container for navigation and utility content
 * @alias MastheadContent
 *
 * @slot - Default slot for content (typically navigation and utilities)
 */
@customElement('pfv6-masthead-content')
export class Pfv6MastheadContent extends LitElement {
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
    'pfv6-masthead-content': Pfv6MastheadContent;
  }
}
