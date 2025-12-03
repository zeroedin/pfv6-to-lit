import { LitElement } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

/**
 * Flex item - A flex item is a child of a flex layout.
 *
 * @element pfv6-flex-item
 */
@customElement('pfv6-flex-item')
export class Pfv6FlexItem extends LitElement {
  /**
   * Disable Shadow DOM - children exist naturally in Light DOM
   */
  createRenderRoot() {
    return this;
  }

  /**
   * Spacers at various breakpoints.
   * @example spacer="md" or spacer="md sm:lg"
   */
  @property({ type: String, reflect: true })
  spacer?: string;

  /**
   * Whether to add flex: grow at various breakpoints.
   */
  @property({ type: String, reflect: true })
  grow?: string;

  /**
   * Whether to add flex: shrink at various breakpoints.
   */
  @property({ type: String, reflect: true })
  shrink?: string;

  /**
   * Value to add for flex property at various breakpoints.
   * @example flex="1" or flex="1 lg:2"
   */
  @property({ type: String, reflect: true })
  flex?: string;

  /**
   * Value to add for align-self property at various breakpoints.
   * @example align-self="center"
   */
  @property({ type: String, attribute: 'align-self', reflect: true })
  alignSelf?: string;

  /**
   * Value to use for margin: auto at various breakpoints.
   * @example align="right"
   */
  @property({ type: String, reflect: true })
  align?: string;

  /**
   * Whether to set width: 100% at various breakpoints.
   */
  @property({ type: String, attribute: 'full-width', reflect: true })
  fullWidth?: string;

}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-flex-item': Pfv6FlexItem;
  }
}
