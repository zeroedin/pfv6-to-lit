/**
 * String utility helpers
 */

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with first letter uppercased
 * @example capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert kebab-case string to camelCase
 * @param str - The kebab-case string to convert
 * @returns The camelCase string
 * @example toCamelCase('flex-start') // 'flexStart'
 */
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase or PascalCase string to kebab-case
 * @param str - The camelCase or PascalCase string to convert
 * @returns The kebab-case string
 * @example toKebabCase('flexStart') // 'flex-start'
 * @example toKebabCase('FlexStart') // 'flex-start'
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
}
