import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-panel-main-body.css';

/**
 * Panel main body component - Displays body content within the panel main area.
 *
 * @alias Panel Main Body
 *
 * @slot - Default slot for body content
 *
 * @csspart container - The container element
 *
 * @cssprop --pf-v6-c-panel__main-body--PaddingBlockStart - Block start padding of the body
 * @cssprop --pf-v6-c-panel__main-body--PaddingInlineEnd - Inline end padding of the body
 * @cssprop --pf-v6-c-panel__main-body--PaddingBlockEnd - Block end padding of the body
 * @cssprop --pf-v6-c-panel__main-body--PaddingInlineStart - Inline start padding of the body
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
