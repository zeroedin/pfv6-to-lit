/**
 * Responsive Attributes Library
 *
 * Utilities for parsing, transforming, and working with responsive attribute values
 * across breakpoints (default, sm, md, lg, xl, 2xl).
 */

import { capitalize, toCamelCase, toKebabCase } from './helpers.js';

/**
 * Responsive value structure for properties that vary by breakpoint
 */
export type ResponsiveValue<T extends string> = {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Standard breakpoint names
 */
export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export type Breakpoint = typeof BREAKPOINTS[number];

/**
 * Options for transforming values during parsing
 */
export interface TransformOptions {
  /** Add a prefix to values: "md" → "gapMd" */
  prefix?: string;
  /** Map specific values: { "1": "flex_1", "2": "flex_2" } */
  enumMap?: Record<string, string>;
  /** Case transformation to apply */
  caseTransform?: 'camel' | 'kebab' | 'pascal';
}

/**
 * Parse a compound attribute string into a ResponsiveValue
 *
 * @example
 * parseResponsiveAttribute("vertical sm:horizontal md:vertical")
 * // → { default: 'vertical', sm: 'horizontal', md: 'vertical' }
 */
export function parseResponsiveAttribute<T extends string>(
  value: string | null
): ResponsiveValue<T> | undefined {
  if (!value) return undefined;

  const result: ResponsiveValue<T> = {};
  const parts = value.trim().split(/\s+/);

  for (const part of parts) {
    // Split on colon to separate breakpoint from value
    const splitParts = part.split(':', 2);
    const breakpoint = splitParts.length > 1 ? splitParts[0] || 'default' : 'default';
    const val = splitParts.length > 1 ? splitParts[1] || '' : part;

    // Validate breakpoint and assign
    if (
      breakpoint === 'default' || breakpoint === 'sm' || breakpoint === 'md' ||
      breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
    ) {
      result[breakpoint] = val as T;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Parse a compound attribute with value transformations
 *
 * @example
 * parseResponsiveAttributeWithTransform("md sm:lg", { prefix: 'gap' })
 * // → { default: 'gapMd', sm: 'gapLg' }
 */
export function parseResponsiveAttributeWithTransform<T extends string>(
  value: string | null,
  options: TransformOptions = {}
): ResponsiveValue<T> | undefined {
  if (!value) return undefined;

  const parts = value.trim().split(/\s+/);
  const result: ResponsiveValue<T> = {};

  parts.forEach((part) => {
    // Split on colon to separate breakpoint from value
    const splitParts = part.split(':', 2);
    const breakpoint = splitParts.length > 1 ? splitParts[0] || 'default' : 'default';
    const val = splitParts.length > 1 ? splitParts[1] || '' : part;

    // Apply transformations
    let finalValue: string;

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

    // Apply case transformation if specified
    if (options.caseTransform === 'kebab') {
      finalValue = finalValue.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    } else if (options.caseTransform === 'pascal') {
      finalValue = capitalize(finalValue);
    }

    if (
      breakpoint === 'default' || breakpoint === 'sm' || breakpoint === 'md' ||
      breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
    ) {
      result[breakpoint] = finalValue as T;
    }
  });

  return result;
}

/**
 * Serialize a ResponsiveValue back to a compound attribute string
 * Reverses transformations if options are provided
 *
 * @example
 * serializeResponsiveAttribute({ default: 'gapMd', sm: 'gapLg' }, { prefix: 'gap' })
 * // → "md sm:lg"
 */
export function serializeResponsiveAttribute<T extends string>(
  value: ResponsiveValue<T> | undefined,
  options: TransformOptions = {}
): string | null {
  if (!value) return null;

  // If only default is set, return simple value
  if (value.default && !value.sm && !value.md && !value.lg && !value.xl && !value['2xl']) {
    let val = value.default;

    // Remove prefix if present
    if (options.prefix) {
      val = val.replace(new RegExp(`^${options.prefix}`, 'i'), '') as T;
      val = (val.charAt(0).toLowerCase() + val.slice(1)) as T;
    }

    // Reverse enum mapping if needed
    if (options.enumMap) {
      const reverseMap = Object.fromEntries(
        Object.entries(options.enumMap).map(([k, v]) => [v, k])
      );
      const mapped = reverseMap[val];
      if (mapped) val = mapped as T;
    }

    return val;
  }

  // For complex responsive values, don't reflect
  return null;
}

/**
 * Create a Lit property converter for responsive attributes
 *
 * @example
 * @property({ converter: createResponsiveConverter({ prefix: 'gap' }) })
 * gap?: ResponsiveValue<string>;
 */
export function createResponsiveConverter<T extends string>(
  options?: TransformOptions
): {
  fromAttribute: (value: string | null) => ResponsiveValue<T> | undefined;
  toAttribute: (value: ResponsiveValue<T> | undefined) => string | null;
} {
  return {
    fromAttribute: (value) => options
      ? parseResponsiveAttributeWithTransform<T>(value, options)
      : parseResponsiveAttribute<T>(value),
    toAttribute: (value) => options
      ? serializeResponsiveAttribute<T>(value, options)
      : null
  };
}

/**
 * Options for building CSS classes from responsive values
 */
export interface ClassBuilderOptions<T extends string> {
  /**
   * Custom callback to generate class names
   * Provides full control over class name generation
   *
   * @param value - The value at this breakpoint
   * @param breakpoint - The breakpoint name, or undefined for default
   * @returns The CSS class name to add
   */
  classNameBuilder: (value: T, breakpoint?: Breakpoint) => string;
}

/**
 * Build CSS classes from a ResponsiveValue using a custom callback
 *
 * @example
 * // Simple pattern (divider style)
 * buildResponsiveClasses(orientation, {
 *   classNameBuilder: (value, breakpoint) =>
 *     breakpoint ? `${value}-on-${breakpoint}` : value
 * })
 * // → { vertical: true, 'horizontal-on-md': true }
 *
 * @example
 * // Kebab-case with suffix (flex style)
 * buildResponsiveClasses(gap, {
 *   classNameBuilder: (value, breakpoint) => {
 *     const kebab = toKebabCase(value);
 *     return breakpoint ? `${kebab}-${breakpoint}` : kebab;
 *   }
 * })
 * // → { 'gap-md': true, 'gap-lg-sm': true }
 */
export function buildResponsiveClasses<T extends string>(
  value: ResponsiveValue<T> | undefined,
  options: ClassBuilderOptions<T>
): Record<string, boolean> {
  const classes: Record<string, boolean> = {};

  if (!value) return classes;

  // Default value (no breakpoint suffix)
  if (value.default) {
    const className = options.classNameBuilder(value.default);
    classes[className] = true;
  }

  // Breakpoint values
  for (const breakpoint of BREAKPOINTS) {
    const breakpointValue = value[breakpoint];
    if (breakpointValue) {
      const className = options.classNameBuilder(breakpointValue, breakpoint);
      classes[className] = true;
    }
  }

  return classes;
}

/**
 * Iterate over all values in a ResponsiveValue with a callback
 *
 * @example
 * forEachResponsiveValue(orientation, (value, breakpoint) => {
 *   console.log(`At ${breakpoint || 'default'}: ${value}`);
 * });
 */
export function forEachResponsiveValue<T extends string>(
  value: ResponsiveValue<T> | undefined,
  callback: (value: T, breakpoint: 'default' | Breakpoint) => void
): void {
  if (!value) return;

  if (value.default) {
    callback(value.default, 'default');
  }

  for (const breakpoint of BREAKPOINTS) {
    const breakpointValue = value[breakpoint];
    if (breakpointValue) {
      callback(breakpointValue, breakpoint);
    }
  }
}

