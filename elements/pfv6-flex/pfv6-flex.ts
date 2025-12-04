import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { 
  type ResponsiveValue,
  type TransformOptions,
  createResponsiveConverter,
  toKebabCase
} from '../../lib/responsive-attributes.js';

import './pfv6-flex-item.js';

import styles from './pfv6-flex.css';

// Specialized converter options for different property types
const gapConverterOptions = (prefix: string): TransformOptions => ({ prefix });

const flexConverterOptions: TransformOptions = {
  enumMap: {
    'default': 'flexDefault',
    'none': 'flexNone',
    '1': 'flex_1',
    '2': 'flex_2',
    '3': 'flex_3',
    '4': 'flex_4'
  }
};

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
  static readonly styles = styles;

  /**
   * The component type to use
   */
  @property({ type: String })
  component: string = 'div';

  /**
   * Spacers at various breakpoints.
   * @example spacer="md" or spacer="md sm:lg xl:none"
   */
  @property({ type: Object, converter: createResponsiveConverter(gapConverterOptions('spacer')) })
  spacer?: ResponsiveValue<'spacerNone' | 'spacerXs' | 'spacerSm' | 'spacerMd' | 'spacerLg' | 'spacerXl' | 'spacer2xl' | 'spacer3xl' | 'spacer4xl'>;

  /**
   * Space items at various breakpoints.
   * @example space-items="none" or space-items="md sm:lg"
   */
  @property({ type: Object, converter: createResponsiveConverter(gapConverterOptions('spaceItems')), attribute: 'space-items' })
  spaceItems?: ResponsiveValue<'spaceItemsNone' | 'spaceItemsXs' | 'spaceItemsSm' | 'spaceItemsMd' | 'spaceItemsLg' | 'spaceItemsXl' | 'spaceItems2xl' | 'spaceItems3xl' | 'spaceItems4xl'>;

  /**
   * Gap between items at various breakpoints.
   * @example gap="2xl" or gap="md sm:lg xl:2xl"
   */
  @property({ type: Object, converter: createResponsiveConverter(gapConverterOptions('gap')) })
  gap?: ResponsiveValue<'gap' | 'gapNone' | 'gapXs' | 'gapSm' | 'gapMd' | 'gapLg' | 'gapXl' | 'gap2xl' | 'gap3xl' | 'gap4xl'>;

  /**
   * Gap between rows at various breakpoints.
   * @example row-gap="2xl" or row-gap="md sm:lg"
   */
  @property({ type: Object, converter: createResponsiveConverter(gapConverterOptions('rowGap')), attribute: 'row-gap' })
  rowGap?: ResponsiveValue<'rowGap' | 'rowGapNone' | 'rowGapXs' | 'rowGapSm' | 'rowGapMd' | 'rowGapLg' | 'rowGapXl' | 'rowGap2xl' | 'rowGap3xl' | 'rowGap4xl'>;

  /**
   * Gap between columns at various breakpoints.
   * @example column-gap="2xl" or column-gap="md sm:lg"
   */
  @property({ type: Object, converter: createResponsiveConverter(gapConverterOptions('columnGap')), attribute: 'column-gap' })
  columnGap?: ResponsiveValue<'columnGap' | 'columnGapNone' | 'columnGapXs' | 'columnGapSm' | 'columnGapMd' | 'columnGapLg' | 'columnGapXl' | 'columnGap2xl' | 'columnGap3xl' | 'columnGap4xl'>;

  /**
   * Whether to add flex: grow at various breakpoints.
   * @example grow="grow" or grow="grow md:grow"
   */
  @property({ type: Object, converter: createResponsiveConverter() })
  grow?: ResponsiveValue<'grow'>;

  /**
   * Whether to add flex: shrink at various breakpoints.
   * @example shrink="shrink"
   */
  @property({ type: Object, converter: createResponsiveConverter() })
  shrink?: ResponsiveValue<'shrink'>;

  /**
   * Value to add for flex property at various breakpoints.
   * @example flex="1" or flex="1 lg:2"
   */
  @property({ type: Object, converter: createResponsiveConverter(flexConverterOptions) })
  flex?: ResponsiveValue<'flexDefault' | 'flexNone' | 'flex_1' | 'flex_2' | 'flex_3' | 'flex_4'>;

  /**
   * Value to add for flex-direction property at various breakpoints.
   * @example direction="column" or direction="column lg:row"
   */
  @property({ type: Object, converter: createResponsiveConverter() })
  direction?: ResponsiveValue<'column' | 'columnReverse' | 'row' | 'rowReverse'>;

  /**
   * Value to add for align-items property at various breakpoints.
   * @example align-items="center" or align-items="flex-start md:center"
   */
  @property({ type: Object, converter: createResponsiveConverter(), attribute: 'align-items' })
  alignItems?: ResponsiveValue<'alignItemsFlexStart' | 'alignItemsFlexEnd' | 'alignItemsCenter' | 'alignItemsStretch' | 'alignItemsBaseline'>;

  /**
   * Value to add for align-content property at various breakpoints.
   * @example align-content="center"
   */
  @property({ type: Object, converter: createResponsiveConverter(), attribute: 'align-content' })
  alignContent?: ResponsiveValue<'alignContentFlexStart' | 'alignContentFlexEnd' | 'alignContentCenter' | 'alignContentStretch' | 'alignContentSpaceBetween' | 'alignContentSpaceAround'>;

  /**
   * Value to add for align-self property at various breakpoints.
   * @example align-self="center" or align-self="flex-start md:center"
   */
  @property({ type: Object, converter: createResponsiveConverter(), attribute: 'align-self' })
  alignSelf?: ResponsiveValue<'alignSelfFlexStart' | 'alignSelfFlexEnd' | 'alignSelfCenter' | 'alignSelfStretch' | 'alignSelfBaseline'>;

  /**
   * Value to use for margin: auto at various breakpoints.
   * @example align="right"
   */
  @property({ type: Object, converter: createResponsiveConverter() })
  align?: ResponsiveValue<'alignLeft' | 'alignRight'>;

  /**
   * Value to add for justify-content property at various breakpoints.
   * @example justify-content="flex-start" or justify-content="flex-start md:space-between"
   */
  @property({ type: Object, converter: createResponsiveConverter(), attribute: 'justify-content' })
  justifyContent?: ResponsiveValue<'justifyContentFlexStart' | 'justifyContentFlexEnd' | 'justifyContentCenter' | 'justifyContentSpaceBetween' | 'justifyContentSpaceAround' | 'justifyContentSpaceEvenly'>;

  /**
   * Value to set to display property at various breakpoints.
   * @example display="inline-flex"
   */
  @property({ type: Object, converter: createResponsiveConverter() })
  display?: ResponsiveValue<'flex' | 'inlineFlex'>;

  /**
   * Whether to set width: 100% at various breakpoints.
   * @example full-width="full-width"
   */
  @property({ type: Object, converter: createResponsiveConverter(), attribute: 'full-width' })
  fullWidth?: ResponsiveValue<'fullWidth'>;

  /**
   * Value to set for flex-wrap property at various breakpoints.
   * @example flex-wrap="nowrap" or flex-wrap="wrap md:nowrap"
   */
  @property({ type: Object, converter: createResponsiveConverter(), attribute: 'flex-wrap' })
  flexWrap?: ResponsiveValue<'wrap' | 'wrapReverse' | 'nowrap'>;

  /**
   * Modifies the flex layout element order property.
   * @example order="2" or order="2 md:-1 lg:1"
   */
  @property({ type: Object, converter: createResponsiveConverter() })
  order?: ResponsiveValue<string>;

  render() {
    // Set CSS variables for order property on #container (CSS reads from --_item-order-* variables)
    const containerStyles: Record<string, string> = {};
    
    if (this.order) {
      if (this.order.default) {
        containerStyles['--_item-order'] = this.order.default;
      }
      if (this.order.md) {
        containerStyles['--_item-order-md'] = this.order.md;
      }
      if (this.order.lg) {
        containerStyles['--_item-order-lg'] = this.order.lg;
      }
      if (this.order.xl) {
        containerStyles['--_item-order-xl'] = this.order.xl;
      }
      if (this.order['2xl']) {
        containerStyles['--_item-order-2xl'] = this.order['2xl'];
      }
    }
    
    return html`
      <div id="container" class=${classMap(this.#getClasses())} style=${styleMap(containerStyles)}>
        <slot></slot>
      </div>
    `;
  }

  #getClasses() {
    const classes: Record<string, boolean> = {};

    // Helper to add responsive modifier classes
    const addModifier = (property: Record<string, string> | undefined, prefix: string) => {
      if (!property) return;
      
      const addPrefix = (value: string) => prefix ? `${prefix}-${value}` : value;
      
      if (property.default) {
        classes[addPrefix(toKebabCase(property.default))] = true;
      }
      if (property.sm) {
        classes[`${addPrefix(toKebabCase(property.sm))}-sm`] = true;
      }
      if (property.md) {
        classes[`${addPrefix(toKebabCase(property.md))}-md`] = true;
      }
      if (property.lg) {
        classes[`${addPrefix(toKebabCase(property.lg))}-lg`] = true;
      }
      if (property.xl) {
        classes[`${addPrefix(toKebabCase(property.xl))}-xl`] = true;
      }
      if (property['2xl']) {
        classes[`${addPrefix(toKebabCase(property['2xl']))}-2xl`] = true;
      }
    };

    // Apply all responsive modifiers
    addModifier(this.spacer as Record<string, string>, 'spacer');
    addModifier(this.spaceItems as Record<string, string>, 'space-items');
    addModifier(this.gap as Record<string, string>, ''); // No prefix - values already contain 'gap'
    addModifier(this.rowGap as Record<string, string>, ''); // No prefix - values already contain 'rowGap'
    addModifier(this.columnGap as Record<string, string>, ''); // No prefix - values already contain 'columnGap'
    addModifier(this.grow as Record<string, string>, ''); // No prefix - value is just 'grow'
    addModifier(this.shrink as Record<string, string>, ''); // No prefix - value is just 'shrink'
    addModifier(this.flex as Record<string, string>, ''); // No prefix - values already contain 'flex'
    addModifier(this.direction as Record<string, string>, ''); // No prefix - values are 'column', 'row', etc.
    addModifier(this.alignItems as Record<string, string>, 'align-items');
    addModifier(this.alignContent as Record<string, string>, 'align-content');
    addModifier(this.alignSelf as Record<string, string>, 'align-self');
    addModifier(this.align as Record<string, string>, 'align');
    addModifier(this.justifyContent as Record<string, string>, 'justify-content');
    addModifier(this.display as Record<string, string>, ''); // No prefix - values are 'flex', 'inline-flex'
    addModifier(this.fullWidth as Record<string, string>, 'full-width');
    addModifier(this.flexWrap as Record<string, string>, ''); // No prefix - values are 'wrap', 'nowrap', etc.

    // Note: order property uses CSS variables, not classes (set in render() method)

    return classes;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-flex': Pfv6Flex;
  }
}
