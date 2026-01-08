import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './pfv6-avatar.css';

/**
 * An avatar is a visual representation of a user or object.
 *
 * @element pfv6-avatar
 *
 * @slot - Not applicable (renders an img element)
 *
 * @cssprop --pf-v6-c-avatar--Width - Width of the avatar
 * @cssprop --pf-v6-c-avatar--BorderRadius - Border radius of the avatar
 * @cssprop --pf-v6-c-avatar--BorderWidth - Border width when bordered
 * @cssprop --pf-v6-c-avatar--BorderColor - Border color when bordered
 */
@customElement('pfv6-avatar')
export class Pfv6Avatar extends LitElement {
  static styles = styles;

  /**
  * URL of the avatar image
  */
  @property({ type: String })
  src = '';

  /**
  * Alt text for the avatar image (required for accessibility)
  */
  @property({ type: String })
  alt!: string;

  /**
  * Adds a border to the avatar
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-bordered' })
  isBordered = false;

  /**
  * Size variant of the avatar
  * - sm: Small avatar
  * - md: Medium avatar
  * - lg: Large avatar
  * - xl: Extra large avatar
  */
  @property({ type: String, reflect: true })
  size?: 'sm' | 'md' | 'lg' | 'xl';

  render() {
    const classes = {
      sm: this.size === 'sm',
      md: this.size === 'md',
      lg: this.size === 'lg',
      xl: this.size === 'xl',
      bordered: this.isBordered
    };

    return html`
      <img
        src=${ifDefined(this.src || undefined)}
        alt=${this.alt}
        class=${classMap(classes)}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-avatar': Pfv6Avatar;
  }
}
