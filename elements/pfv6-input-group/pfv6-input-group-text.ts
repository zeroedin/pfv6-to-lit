import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import './pfv6-input-group-item.js';
import styles from './pfv6-input-group-text.css';

/**
 * Input group text component for displaying text labels or static content within an input group.
 *
 * Note: React has a `component` prop to change the wrapper element type (span vs label).
 * In web components, you should wrap this element with the appropriate semantic HTML instead:
 *
 * For labels:
 * ```html
 * <label>
 *   <pfv6-input-group-text>Username</pfv6-input-group-text>
 * </label>
 * ```
 *
 * For plain text (default):
 * ```html
 * <pfv6-input-group-text>$</pfv6-input-group-text>
 * ```
 *
 * @summary Text or label wrapper for input groups
 * @slot - Default slot for text content
 * @cssprop --pf-v6-c-input-group__text--FontSize - Font size for input group text
 * @cssprop --pf-v6-c-input-group__text--Color - Text color for input group text
 * @cssprop --pf-v6-c-input-group__item--m-disabled__text--Color - Text color when disabled
 */
@customElement('pfv6-input-group-text')
export class Pfv6InputGroupText extends LitElement {
  static styles = styles;

  /**
   * Flag to indicate if the input group text is plain
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-plain' })
  isPlain = false;

  /**
   * Flag to indicate if the input group text is disabled
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  render() {
    return html`
      <pfv6-input-group-item is-box ?is-plain=${this.isPlain} ?is-disabled=${this.isDisabled}>
        <span id="container">
          <slot></slot>
        </span>
      </pfv6-input-group-item>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-input-group-text': Pfv6InputGroupText;
  }
}
