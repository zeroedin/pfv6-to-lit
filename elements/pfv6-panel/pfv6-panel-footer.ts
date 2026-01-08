import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-panel-footer.css';

/**
 * Panel footer component - Displays footer content at the bottom of a panel.
 *
 * @alias Panel Footer
 *
 * @slot - Default slot for footer content
 *
 * @csspart container - The container element
 *
 * @cssprop --pf-v6-c-panel__footer--PaddingBlockStart - Block start padding of the footer
 * @cssprop --pf-v6-c-panel__footer--PaddingInlineEnd - Inline end padding of the footer
 * @cssprop --pf-v6-c-panel__footer--PaddingBlockEnd - Block end padding of the footer
 * @cssprop --pf-v6-c-panel__footer--PaddingInlineStart - Inline start padding of the footer
 * @cssprop --pf-v6-c-panel__footer--BoxShadow - Box shadow of the footer
 * @cssprop --pf-v6-c-panel__footer--BorderColor - Border color of the footer
 * @cssprop --pf-v6-c-panel__footer--BorderWidth - Border width of the footer
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
