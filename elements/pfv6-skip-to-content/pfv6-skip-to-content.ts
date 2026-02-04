import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import styles from './pfv6-skip-to-content.css';

/**
 * Skip to content component for providing keyboard users a way to bypass navigation and jump directly to main content.
 *
 * @summary Provides a skip link for keyboard navigation accessibility
 * @slot - Default slot for link text content
 *
 * @cssprop --pf-v6-c-skip-to-content--InsetBlockStart - Skip to content top positioning
 * @cssprop --pf-v6-c-skip-to-content--ZIndex - Skip to content z-index layer
 * @cssprop --pf-v6-c-skip-to-content--focus--InsetInlineStart - Skip to content inline position when focused
 *
 * @example
 * ```html
 * <pfv6-skip-to-content href="#main-content">
 *   Skip to content
 * </pfv6-skip-to-content>
 * ```
 */
@customElement('pfv6-skip-to-content')
export class Pfv6SkipToContent extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  /**
   * The skip to content link target.
   */
  @property({ type: String, reflect: true })
  href: string | undefined;

  render() {
    return html`
      <div id="container">
        <pfv6-button variant="primary" href=${ifDefined(this.href)}>
          <slot></slot>
        </pfv6-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-skip-to-content': Pfv6SkipToContent;
  }
}
