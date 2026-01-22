import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-menu-toggle-action.css';

/**
 * Action button for split-button menu toggles.
 *
 * @summary Action button component for split-button scenarios
 * @alias MenuToggleAction
 *
 * @slot - Default slot for button content
 */
@customElement('pfv6-menu-toggle-action')
export class Pfv6MenuToggleAction extends LitElement {
  static styles = styles;

  /** Flag to show if the action button is disabled */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  #handleClick = (event: Event) => {
    if (this.isDisabled) {
      event.preventDefault();
      return;
    }
    // Allow native click event to bubble
  };

  override render() {
    return html`
      <button
        id="container"
        type="button"
        ?disabled=${this.isDisabled}
        @click=${this.#handleClick}
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-menu-toggle-action': Pfv6MenuToggleAction;
  }
}
