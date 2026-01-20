import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-empty-state-actions.css';

/**
 * EmptyStateActions component for displaying action buttons within an empty state.
 *
 * @summary EmptyStateActions
 * @alias EmptyStateActions
 *
 * @slot - Default slot for action button content
 */
@customElement('pfv6-empty-state-actions')
export class Pfv6EmptyStateActions extends LitElement {
  static styles = styles;

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
    'pfv6-empty-state-actions': Pfv6EmptyStateActions;
  }
}
