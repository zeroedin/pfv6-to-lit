import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-panel-header.css';

/**
 * Panel header component - Displays header content at the top of a panel.
 *
 * @alias Panel Header
 * @slot - Default slot for header content
 *
 * @csspart container - The container element
 *
 * @cssprop --pf-v6-c-panel__header--PaddingBlockStart - Block start padding of the header
 * @cssprop --pf-v6-c-panel__header--PaddingInlineEnd - Inline end padding of the header
 * @cssprop --pf-v6-c-panel__header--PaddingBlockEnd - Block end padding of the header
 * @cssprop --pf-v6-c-panel__header--PaddingInlineStart - Inline start padding of the header
 */
@customElement('pfv6-panel-header')
export class Pfv6PanelHeader extends LitElement {
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
    'pfv6-panel-header': Pfv6PanelHeader;
  }
}
