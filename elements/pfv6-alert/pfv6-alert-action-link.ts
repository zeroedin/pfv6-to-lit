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
  static styles = styles;

  render() {
    return html`
      <button class="pf-v6-c-button pf-m-link pf-m-inline" type="button">
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
