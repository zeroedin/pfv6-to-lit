import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-text-input-group-icon.css';

/**
 * Text input group icon component for wrapping icons.
 *
 * @slot - Default slot for icon content
 */
@customElement('pfv6-text-input-group-icon')
export class Pfv6TextInputGroupIcon extends LitElement {
  static styles = styles;

  /** Flag indicating if the icon is a status icon and should inherit status styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-status' })
  isStatus = false;

  render() {
    const classes = {
      status: this.isStatus,
    };

    return html`
      <span id="container" class=${classMap(classes)}>
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-text-input-group-icon': Pfv6TextInputGroupIcon;
  }
}
