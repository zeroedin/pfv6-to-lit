import { LitElement } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import './pfv6-flex-item.js';

/**
 * Flex layout - A flex layout is used to position items in a flexible container.
 *
 * @element pfv6-flex
 *
 * @example
 * ```html
 * <!-- Simple default-only values -->
 * <pfv6-flex direction="column">
 * 
 * <!-- Responsive values with breakpoints -->
 * <pfv6-flex direction="column lg:row">
 * <pfv6-flex gap="md sm:lg xl:2xl">
 * <pfv6-flex justify-content="flex-start md:space-between">
 * ```
 */
@customElement('pfv6-flex')
export class Pfv6Flex extends LitElement {
  /**
   * Disable Shadow DOM - children exist naturally in Light DOM
   */
  createRenderRoot() {
    return this;
  }

  /**
   * Spacers at various breakpoints.
   * @example spacer="md" or spacer="md sm:lg xl:none"
   */
  @property({ type: String, reflect: true })
  spacer?: string;

  /**
   * Space items at various breakpoints.
   * @example space-items="none" or space-items="md sm:lg"
   */
  @property({ type: String, attribute: 'space-items', reflect: true })
  spaceItems?: string;

  /**
   * Gap between items at various breakpoints.
   * @example gap="2xl" or gap="md sm:lg xl:2xl"
   */
  @property({ type: String, reflect: true })
  gap?: string;

  /**
   * Gap between rows at various breakpoints.
   * @example row-gap="2xl" or row-gap="md sm:lg"
   */
  @property({ type: String, attribute: 'row-gap', reflect: true })
  rowGap?: string;

  /**
   * Gap between columns at various breakpoints.
   * @example column-gap="2xl" or column-gap="md sm:lg"
   */
  @property({ type: String, attribute: 'column-gap', reflect: true })
  columnGap?: string;

  /**
   * Whether to add flex: grow at various breakpoints.
   * @example grow="grow" or grow="grow md:grow"
   */
  @property({ type: String, reflect: true })
  grow?: string;

  /**
   * Whether to add flex: shrink at various breakpoints.
   * @example shrink="shrink"
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
   * Value to add for flex-direction property at various breakpoints.
   * @example direction="column" or direction="column lg:row"
   */
  @property({ type: String, reflect: true })
  direction?: string;

  /**
   * Value to add for align-items property at various breakpoints.
   * @example align-items="center" or align-items="flex-start md:center"
   */
  @property({ type: String, attribute: 'align-items', reflect: true })
  alignItems?: string;

  /**
   * Value to add for align-content property at various breakpoints.
   * @example align-content="center"
   */
  @property({ type: String, attribute: 'align-content', reflect: true })
  alignContent?: string;

  /**
   * Value to add for align-self property at various breakpoints.
   * @example align-self="center" or align-self="flex-start md:center"
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
   * Value to add for justify-content property at various breakpoints.
   * @example justify-content="flex-start" or justify-content="flex-start md:space-between"
   */
  @property({ type: String, attribute: 'justify-content', reflect: true })
  justifyContent?: string;

  /**
   * Value to set to display property at various breakpoints.
   * @example display="inline-flex"
   */
  @property({ type: String, reflect: true })
  display?: string;

  /**
   * Whether to set width: 100% at various breakpoints.
   * @example full-width="full-width"
   */
  @property({ type: String, attribute: 'full-width', reflect: true })
  fullWidth?: string;

  /**
   * Value to set for flex-wrap property at various breakpoints.
   * @example flex-wrap="nowrap" or flex-wrap="wrap md:nowrap"
   */
  @property({ type: String, attribute: 'flex-wrap', reflect: true })
  flexWrap?: string;

}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-flex': Pfv6Flex;
  }
}
