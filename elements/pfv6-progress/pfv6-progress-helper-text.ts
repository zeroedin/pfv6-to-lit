import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-progress-helper-text.css';

/**
 * Progress helper text sub-component for displaying additional information about progress.
 *
 * @alias ProgressHelperText
 * @summary Helper text element for progress component
 * @slot - Helper text content
 */
@customElement('pfv6-progress-helper-text')
export class Pfv6ProgressHelperText extends LitElement {
  static readonly styles = styles;

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
    'pfv6-progress-helper-text': Pfv6ProgressHelperText;
  }
}
