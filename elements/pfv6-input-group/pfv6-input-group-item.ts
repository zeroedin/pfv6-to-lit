import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-input-group-item.css';

/**
 * Input group item component for wrapping individual elements within an input group.
 *
 * @summary Container for input group child elements
 * @slot - Default slot for input group item content
 * @cssprop --pf-v6-c-input-group__item--offset - Offset for input group item
 * @cssprop --pf-v6-c-input-group__item--BorderWidth--base - Border width for input group item
 * @cssprop --pf-v6-c-input-group__item--BorderColor--base - Border color for input group item
 * @cssprop --pf-v6-c-input-group__item--BackgroundColor - Background color for input group item
 * @cssprop --pf-v6-c-input-group__item--AlignItems - Align items for input group item
 * @cssprop --pf-v6-c-input-group__item--m-box--PaddingInlineEnd - End padding for box variant
 * @cssprop --pf-v6-c-input-group__item--m-box--PaddingInlineStart - Start padding for box variant
 * @cssprop --pf-v6-c-input-group__item--m-box--BackgroundColor - Background color for box variant
 * @cssprop --pf-v6-c-input-group__item--m-box--BorderRadius - Border radius for box variant
 */
@customElement('pfv6-input-group-item')
export class Pfv6InputGroupItem extends LitElement {
  static styles = styles;

  /**
   * Enables box styling to the input group item
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-box' })
  isBox = false;

  /**
   * Flag to indicate if the input group item is plain
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-plain' })
  isPlain = false;

  /**
   * Flag to indicate if the input group item should fill the available horizontal space
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-fill' })
  isFill = false;

  /**
   * Flag to indicate if the input group item is disabled
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  render() {
    const classes = {
      fill: this.isFill,
      box: this.isBox,
      plain: this.isPlain,
      disabled: this.isDisabled,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-input-group-item': Pfv6InputGroupItem;
  }
}
