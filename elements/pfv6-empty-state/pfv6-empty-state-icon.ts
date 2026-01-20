import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import styles from './pfv6-empty-state-icon.css';

/**
 * EmptyStateIcon component wrapper for icons within an empty state header.
 *
 * @summary EmptyStateIcon
 * @alias EmptyStateIcon
 *
 * @slot - Default slot for icon content (icon or spinner component)
 */
@customElement('pfv6-empty-state-icon')
export class Pfv6EmptyStateIcon extends LitElement {
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
    'pfv6-empty-state-icon': Pfv6EmptyStateIcon;
  }
}
