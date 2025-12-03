import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import './pfv6-flex-item.js';

import styles from './pfv6-flex.css';


// Type for responsive properties
type ResponsiveValue<T extends string> = {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// Helper to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to convert kebab-case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Parse compound attribute string: "value" or "value sm:otherValue lg:anotherValue"
function parseCompoundAttribute<T extends string>(
  value: string | null,
  options: {
    prefix?: string;           // e.g., "gap", "spacer"
    enumMap?: Record<string, string>; // e.g., { "1": "flex_1" }
  } = {}
): ResponsiveValue<T> | undefined {
  if (!value) return undefined;
  
  const parts = value.trim().split(/\s+/);
  const result: Record<string, T> = {};
  
  parts.forEach((part) => {
    let breakpoint: string;
    let val: string;
    
    if (part.includes(':')) {
      const splitParts = part.split(':', 2);
      breakpoint = splitParts[0] || 'default';
      val = splitParts[1] || '';
    } else {
      // First value without prefix is 'default'
      breakpoint = 'default';
      val = part;
    }
    
    // Apply transformations
    let finalValue = val;
    
    // Apply enum mapping if provided (e.g., "1" -> "flex_1")
    if (options.enumMap && options.enumMap[val]) {
      finalValue = options.enumMap[val] || val;
    } else if (options.prefix) {
      // Add prefix with hyphen if value starts with number: "2xl" -> "gap-2xl"
      // Otherwise capitalize: "xs" -> "gapXs" (toKebabCase will convert to "gap-xs")
      if (/^\d/.test(val)) {
        finalValue = options.prefix + '-' + val;
      } else {
        finalValue = options.prefix + capitalize(val);
      }
    } else {
      // Convert kebab-case to camelCase if needed
      finalValue = toCamelCase(val);
    }
    
    result[breakpoint] = finalValue as T;
  });
  
  return result as ResponsiveValue<T>;
}

// Serialize responsive value back to compound string
function serializeCompoundAttribute<T extends string>(
  value: ResponsiveValue<T> | undefined,
  options: {
    prefix?: string;
    enumMap?: Record<string, string>;
  } = {}
): string | null {
  if (!value) return null;
  
  // If only default is set, return simple value
  if (value.default && !value.sm && !value.md && !value.lg && !value.xl && !value['2xl']) {
    let val: string = value.default;
    
    // Remove prefix if present
    if (options.prefix) {
      val = val.replace(new RegExp(`^${options.prefix}`, 'i'), '');
      val = val.charAt(0).toLowerCase() + val.slice(1);
    }
    
    // Reverse enum mapping if needed
    if (options.enumMap) {
      const reverseMap = Object.fromEntries(
        Object.entries(options.enumMap).map(([k, v]) => [v, k])
      );
      const mapped = reverseMap[val];
      if (mapped) val = mapped;
    }
    
    return val;
  }
  
  // For complex responsive values, don't reflect
  return null;
}

// Specialized converters
const gapConverter = (prefix: string) => ({
  fromAttribute: (value: string | null) => parseCompoundAttribute(value, { prefix }),
  toAttribute: (value: ResponsiveValue<string> | undefined) => serializeCompoundAttribute(value, { prefix })
});

const flexConverter = () => ({
  fromAttribute: (value: string | null) => parseCompoundAttribute(value, {
    enumMap: {
      'default': 'flexDefault',
      'none': 'flexNone',
      '1': 'flex_1',
      '2': 'flex_2',
      '3': 'flex_3',
      '4': 'flex_4'
    }
  }),
  toAttribute: (value: ResponsiveValue<string> | undefined) => serializeCompoundAttribute(value, {
    enumMap: {
      'default': 'flexDefault',
      'none': 'flexNone',
      '1': 'flex_1',
      '2': 'flex_2',
      '3': 'flex_3',
      '4': 'flex_4'
    }
  })
});

const alignmentConverter = () => ({
  fromAttribute: (value: string | null) => {
    if (!value) return undefined;
    const result = parseCompoundAttribute(value);
    // Additional kebab-case to camelCase for compound words
    if (result) {
      const processed: Record<string, string> = {};
      Object.keys(result).forEach(key => {
        const k = key as keyof typeof result;
        const val = result[k];
        if (val) {
          processed[key] = toCamelCase(val);
        }
      });
      return processed as typeof result;
    }
    return result;
  },
  toAttribute: (value: ResponsiveValue<string> | undefined) => serializeCompoundAttribute(value)
});

const simpleConverter = () => ({
  fromAttribute: (value: string | null) => parseCompoundAttribute(value),
  toAttribute: (value: ResponsiveValue<string> | undefined) => serializeCompoundAttribute(value)
});

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
  @property({ type: Object, converter: gapConverter('spacer') })
  spacer?: ResponsiveValue<'spacerNone' | 'spacerXs' | 'spacerSm' | 'spacerMd' | 'spacerLg' | 'spacerXl' | 'spacer2xl' | 'spacer3xl' | 'spacer4xl'>;

  /**
   * Space items at various breakpoints.
   * @example space-items="none" or space-items="md sm:lg"
   */
  @property({ type: Object, converter: gapConverter('spaceItems'), attribute: 'space-items' })
  spaceItems?: ResponsiveValue<'spaceItemsNone' | 'spaceItemsXs' | 'spaceItemsSm' | 'spaceItemsMd' | 'spaceItemsLg' | 'spaceItemsXl' | 'spaceItems2xl' | 'spaceItems3xl' | 'spaceItems4xl'>;

  /**
   * Gap between items at various breakpoints.
   * @example gap="2xl" or gap="md sm:lg xl:2xl"
   */
  @property({ type: Object, converter: gapConverter('gap') })
  gap?: ResponsiveValue<'gap' | 'gapNone' | 'gapXs' | 'gapSm' | 'gapMd' | 'gapLg' | 'gapXl' | 'gap2xl' | 'gap3xl' | 'gap4xl'>;

  /**
   * Gap between rows at various breakpoints.
   * @example row-gap="2xl" or row-gap="md sm:lg"
   */
  @property({ type: Object, converter: gapConverter('rowGap'), attribute: 'row-gap' })
  rowGap?: ResponsiveValue<'rowGap' | 'rowGapNone' | 'rowGapXs' | 'rowGapSm' | 'rowGapMd' | 'rowGapLg' | 'rowGapXl' | 'rowGap2xl' | 'rowGap3xl' | 'rowGap4xl'>;

  /**
   * Gap between columns at various breakpoints.
   * @example column-gap="2xl" or column-gap="md sm:lg"
   */
  @property({ type: Object, converter: gapConverter('columnGap'), attribute: 'column-gap' })
  columnGap?: ResponsiveValue<'columnGap' | 'columnGapNone' | 'columnGapXs' | 'columnGapSm' | 'columnGapMd' | 'columnGapLg' | 'columnGapXl' | 'columnGap2xl' | 'columnGap3xl' | 'columnGap4xl'>;

  /**
   * Whether to add flex: grow at various breakpoints.
   * @example grow="grow" or grow="grow md:grow"
   */
  @property({ type: Object, converter: simpleConverter() })
  grow?: ResponsiveValue<'grow'>;

  /**
   * Whether to add flex: shrink at various breakpoints.
   * @example shrink="shrink"
   */
  @property({ type: Object, converter: simpleConverter() })
  shrink?: ResponsiveValue<'shrink'>;

  /**
   * Value to add for flex property at various breakpoints.
   * @example flex="1" or flex="1 lg:2"
   */
  @property({ type: Object, converter: flexConverter() })
  flex?: ResponsiveValue<'flexDefault' | 'flexNone' | 'flex_1' | 'flex_2' | 'flex_3' | 'flex_4'>;

  /**
   * Value to add for flex-direction property at various breakpoints.
   * @example direction="column" or direction="column lg:row"
   */
  @property({ type: Object, converter: simpleConverter() })
  direction?: ResponsiveValue<'column' | 'columnReverse' | 'row' | 'rowReverse'>;

  /**
   * Value to add for align-items property at various breakpoints.
   * @example align-items="center" or align-items="flex-start md:center"
   */
  @property({ type: Object, converter: alignmentConverter(), attribute: 'align-items' })
  alignItems?: ResponsiveValue<'alignItemsFlexStart' | 'alignItemsFlexEnd' | 'alignItemsCenter' | 'alignItemsStretch' | 'alignItemsBaseline'>;

  /**
   * Value to add for align-content property at various breakpoints.
   * @example align-content="center"
   */
  @property({ type: Object, converter: alignmentConverter(), attribute: 'align-content' })
  alignContent?: ResponsiveValue<'alignContentFlexStart' | 'alignContentFlexEnd' | 'alignContentCenter' | 'alignContentStretch' | 'alignContentSpaceBetween' | 'alignContentSpaceAround'>;

  /**
   * Value to add for align-self property at various breakpoints.
   * @example align-self="center" or align-self="flex-start md:center"
   */
  @property({ type: Object, converter: alignmentConverter(), attribute: 'align-self' })
  alignSelf?: ResponsiveValue<'alignSelfFlexStart' | 'alignSelfFlexEnd' | 'alignSelfCenter' | 'alignSelfStretch' | 'alignSelfBaseline'>;

  /**
   * Value to use for margin: auto at various breakpoints.
   * @example align="right"
   */
  @property({ type: Object, converter: alignmentConverter() })
  align?: ResponsiveValue<'alignLeft' | 'alignRight'>;

  /**
   * Value to add for justify-content property at various breakpoints.
   * @example justify-content="flex-start" or justify-content="flex-start md:space-between"
   */
  @property({ type: Object, converter: alignmentConverter(), attribute: 'justify-content' })
  justifyContent?: ResponsiveValue<'justifyContentFlexStart' | 'justifyContentFlexEnd' | 'justifyContentCenter' | 'justifyContentSpaceBetween' | 'justifyContentSpaceAround' | 'justifyContentSpaceEvenly'>;

  /**
   * Value to set to display property at various breakpoints.
   * @example display="inline-flex"
   */
  @property({ type: Object, converter: alignmentConverter() })
  display?: ResponsiveValue<'flex' | 'inlineFlex'>;

  /**
   * Whether to set width: 100% at various breakpoints.
   * @example full-width="full-width"
   */
  @property({ type: Object, converter: alignmentConverter(), attribute: 'full-width' })
  fullWidth?: ResponsiveValue<'fullWidth'>;

  /**
   * Value to set for flex-wrap property at various breakpoints.
   * @example flex-wrap="nowrap" or flex-wrap="wrap md:nowrap"
   */
  @property({ type: Object, converter: simpleConverter(), attribute: 'flex-wrap' })
  flexWrap?: ResponsiveValue<'wrap' | 'wrapReverse' | 'nowrap'>;

  /**
   * Modifies the flex layout element order property.
   * @example order="2" or order="2 md:-1 lg:1"
   */
  @property({ type: Object, converter: simpleConverter() })
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
        classes[addPrefix(this.#toKebabCase(property.default))] = true;
      }
      if (property.sm) {
        classes[`${addPrefix(this.#toKebabCase(property.sm))}-sm`] = true;
      }
      if (property.md) {
        classes[`${addPrefix(this.#toKebabCase(property.md))}-md`] = true;
      }
      if (property.lg) {
        classes[`${addPrefix(this.#toKebabCase(property.lg))}-lg`] = true;
      }
      if (property.xl) {
        classes[`${addPrefix(this.#toKebabCase(property.xl))}-xl`] = true;
      }
      if (property['2xl']) {
        classes[`${addPrefix(this.#toKebabCase(property['2xl']))}-2xl`] = true;
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

  #toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-flex': Pfv6Flex;
  }
}
