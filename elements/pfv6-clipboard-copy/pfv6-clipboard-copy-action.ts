import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-clipboard-copy-action.css';

/**
 * A wrapper component for additional action buttons displayed alongside the clipboard copy functionality in inline-compact mode.
 *
 * @alias ClipboardCopyAction
 * @summary Wrapper for additional action buttons in clipboard copy
 * @slot - Default slot for action content
 */
@customElement('pfv6-clipboard-copy-action')
export class Pfv6ClipboardCopyAction extends LitElement {
  static styles = styles;

  render() {
    return html`
      <span id="container">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-clipboard-copy-action': Pfv6ClipboardCopyAction;
  }
}
