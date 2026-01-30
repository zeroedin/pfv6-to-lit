import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-alert-action-link.css';

/**
 * Action link for alerts. Renders as `<a>` when href is provided, otherwise `<button>`.
 *
 * @alias AlertActionLink
 * @summary Action link for alerts.
 * @slot - Link content
 */
@customElement('pfv6-alert-action-link')
export class Pfv6AlertActionLink extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  /** URL to navigate to. When set, renders as an anchor element. */
  @property({ type: String })
  href?: string | undefined;

  render() {
    return this.href
      ? html`<a id="link" href=${this.href}><slot></slot></a>`
      : html`<button id="button" type="button"><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-alert-action-link': Pfv6AlertActionLink;
  }
}
