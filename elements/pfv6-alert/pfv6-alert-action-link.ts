import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-alert-action-link.css';

/**
 * Action link button for alerts.
 *
 * @alias AlertActionLink
 * @summary Action link button for alerts.
 * @slot - Link button content
 */
@customElement('pfv6-alert-action-link')
export class Pfv6AlertActionLink extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  render() {
    return html`
      <button id="button" type="button" tabindex="-1">
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-alert-action-link': Pfv6AlertActionLink;
  }
}
