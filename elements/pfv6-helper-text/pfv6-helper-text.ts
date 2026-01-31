import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import './pfv6-helper-text-item.js';
import styles from './pfv6-helper-text.css';

/**
 * Helper text component for displaying informational, error, or warning text.
 *
 * @alias Helper Text
 *
 * For list semantics with multiple items, wrap in `<ul>`:
 * ```html
 * <pfv6-helper-text is-live-region>
 *   <ul>
 *     <li><pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item></li>
 *     <li><pfv6-helper-text-item variant="warning">Warning message</pfv6-helper-text-item></li>
 *   </ul>
 * </pfv6-helper-text>
 * ```
 *
 * For simple single item, use default div wrapper:
 * ```html
 * <pfv6-helper-text>
 *   <pfv6-helper-text-item>Helper text</pfv6-helper-text-item>
 * </pfv6-helper-text>
 * ```
 *
 * @slot - Default slot for helper text items
 * @cssprop --pf-v6-c-helper-text--Gap - Gap between helper text items
 * @cssprop --pf-v6-c-helper-text--FontSize - Font size for helper text
 */
@customElement('pfv6-helper-text')
export class Pfv6HelperText extends LitElement {
  static styles = styles;

  #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /**
  * Flag for indicating whether the helper text container is a live region.
  * Use this prop when you expect or intend for any helper text items within
  * the container to be dynamically updated.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-live-region' })
  isLiveRegion = false;

  /**
  * Accessible label for the helper text container. Use when wrapping multiple
  * items in a list for accessible labeling (equivalent to React's aria-label prop).
  */
  @property({ type: String, reflect: true, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    // Update ARIA via ElementInternals
    if (changedProperties.has('isLiveRegion')) {
      this.#internals.ariaLive = this.isLiveRegion ? 'polite' : 'off';
    }

    if (changedProperties.has('accessibleLabel')) {
      this.#internals.ariaLabel = this.accessibleLabel || null;
    }
  }

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
    'pfv6-helper-text': Pfv6HelperText;
  }
}
