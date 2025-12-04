import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import styles from './pfv6-flex-item.css';

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

// Parse compound attribute string
function parseCompoundAttribute<T extends string>(
  value: string | null,
  options: {
    prefix?: string;
    enumMap?: Record<string, string>;
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
      breakpoint = 'default';
      val = part;
    }
    
    let finalValue = val;
    
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
  
  if (value.default && !value.sm && !value.md && !value.lg && !value.xl && !value['2xl']) {
    let val: string = value.default;
    
    if (options.prefix) {
      val = val.replace(new RegExp(`^${options.prefix}`, 'i'), '');
      val = val.charAt(0).toLowerCase() + val.slice(1);
    }
    
    if (options.enumMap) {
      const reverseMap = Object.fromEntries(
        Object.entries(options.enumMap).map(([k, v]) => [v, k])
      );
      const mapped = reverseMap[val];
      if (mapped) val = mapped;
    }
    
    return val;
  }
  
  return null;
}

// Specialized converters
const spacerConverter = () => ({
  fromAttribute: (value: string | null) => parseCompoundAttribute(value, { prefix: 'spacer' }),
  toAttribute: (value: ResponsiveValue<string> | undefined) => serializeCompoundAttribute(value, { prefix: 'spacer' })
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
 * Flex item - A flex item is a child of a flex layout.
 *
 * @element pfv6-flex-item
 */
@customElement('pfv6-flex-item')
export class Pfv6FlexItem extends LitElement {
  static readonly styles = styles;

  /**
   * The component type to use
   */
  @property({ type: String })
  component: string = 'div';

  /**
   * Spacers at various breakpoints.
   * @example spacer="md" or spacer="md sm:lg"
   */
  @property({ type: Object, converter: spacerConverter() })
  spacer?: ResponsiveValue<'spacerNone' | 'spacerXs' | 'spacerSm' | 'spacerMd' | 'spacerLg' | 'spacerXl' | 'spacer2xl' | 'spacer3xl' | 'spacer4xl'>;

  /**
   * Whether to add flex: grow at various breakpoints.
   */
  @property({ type: Object, converter: simpleConverter() })
  grow?: ResponsiveValue<'grow'>;

  /**
   * Whether to add flex: shrink at various breakpoints.
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
   * Value to add for align-self property at various breakpoints.
   * @example align-self="center"
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
   * Whether to set width: 100% at various breakpoints.
   */
  @property({ type: Object, converter: alignmentConverter(), attribute: 'full-width' })
  fullWidth?: ResponsiveValue<'fullWidth'>;

  /**
   * Modifies the flex layout element order property.
   * @example order="2" or order="2 md:-1 lg:1"
   */
  @property({ type: Object, converter: simpleConverter() })
  order?: ResponsiveValue<string>;

  render() {
    const containerStyles: Record<string, string> = {};
    
    // Set order CSS variables for responsive breakpoints (order can be any integer)
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
    addModifier(this.grow as Record<string, string>, ''); // No prefix - value is just 'grow'
    addModifier(this.shrink as Record<string, string>, ''); // No prefix - value is just 'shrink'
    addModifier(this.flex as Record<string, string>, ''); // No prefix - values already contain 'flex'
    addModifier(this.alignSelf as Record<string, string>, 'align-self');
    addModifier(this.align as Record<string, string>, 'align');
    addModifier(this.fullWidth as Record<string, string>, 'full-width');

    // Note: order property uses CSS variables, not classes (set in render() method)

    return classes;
  }

  #toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-flex-item': Pfv6FlexItem;
  }
}
