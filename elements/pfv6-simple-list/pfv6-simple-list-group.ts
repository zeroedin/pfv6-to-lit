/* eslint-disable lit-a11y/list -- slot children are validated as li elements */
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-simple-list-group.css';

/**
 * SimpleListGroup component for grouping SimpleList items with a title.
 *
 * @summary A group container for SimpleList items with an optional title
 * @alias SimpleListGroup
 * @slot - Default slot for SimpleListItem children
 * @slot title - Slot for the group title (alternative to title property)
 */
@customElement('pfv6-simple-list-group')
export class Pfv6SimpleListGroup extends LitElement {
  static styles = styles;

  /**
   * Title of the SimpleList group.
   */
  @property({ type: String })
  title = '';

  /**
   * ID for the title element, used for aria-labelledby.
   */
  @property({ type: String, attribute: 'title-id' })
  titleId = '';

  render() {
    const titleElementId = this.titleId || (this.id ? `${this.id}-title` : undefined);

    return html`
      <section id="container">
        ${this.title ? html`
          <h2 id=${ifDefined(titleElementId)} class="title">
            ${this.title}
          </h2>
        ` : html`
          <slot name="title" id=${ifDefined(titleElementId)} class="title"></slot>
        `}
        <ul class="list" aria-labelledby=${ifDefined(titleElementId)}>
          <slot></slot>
        </ul>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-simple-list-group': Pfv6SimpleListGroup;
  }
}
