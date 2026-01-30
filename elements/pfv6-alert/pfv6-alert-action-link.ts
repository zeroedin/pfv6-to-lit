import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-alert-action-link.css';
import '@pfv6/elements/pfv6-button/pfv6-button.js';

/**
 * Action link for alerts. Uses Button with link variant and inline styling.
 * When href is provided, renders as an anchor element.
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
    return this.href ?
      html`<a id="link" href=${ifDefined(this.href)}><slot></slot></a>`
      : html`
        <pfv6-button variant="link" is-inline>
          <slot></slot>
        </pfv6-button>
      `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-alert-action-link': Pfv6AlertActionLink;
  }
}
