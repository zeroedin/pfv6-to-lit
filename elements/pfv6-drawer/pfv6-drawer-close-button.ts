import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import '@pfv6/elements/pfv6-button/pfv6-button.js';
import '@pfv6/elements/pfv6-icon/pfv6-icon.js';

import styles from './pfv6-drawer-close-button.css';

/**
 * Event fired when drawer close button is clicked.
 */
export class Pfv6DrawerCloseEvent extends Event {
  constructor() {
    super('close', { bubbles: true, composed: true });
  }
}

/**
 * Drawer close button component that renders a plain button with a close icon.
 *
 * @summary DrawerCloseButton component
 * @alias DrawerCloseButton
 *
 * @fires Pfv6DrawerCloseEvent - Fired when close button is clicked
 */
@customElement('pfv6-drawer-close-button')
export class Pfv6DrawerCloseButton extends LitElement {
  static readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  /**
   * Accessible label for the drawer close button.
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel = 'Close drawer panel';

  #handleClick = () => {
    this.dispatchEvent(new Pfv6DrawerCloseEvent());
  };

  render() {
    return html`
      <div id="container">
        <pfv6-button
          variant="plain"
          accessible-label=${this.accessibleLabel}
          @click=${this.#handleClick}
        >
          <pfv6-icon slot="icon">
            <svg
              fill="currentColor"
              height="1em"
              width="1em"
              viewBox="0 0 352 512"
              aria-hidden="true"
            >
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
          </pfv6-icon>
        </pfv6-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-drawer-close-button': Pfv6DrawerCloseButton;
  }
}
