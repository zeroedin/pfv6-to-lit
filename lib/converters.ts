/**
 * Shared converters for LitElement properties
 */

/**
 * Converter for responsive breakpoint properties
 *
 * Converts a space-separated string of breakpoint:value pairs into an object.
 *
 * @example
 * "sm md:lg lg:2xl" → { default: "sm", md: "lg", lg: "2xl" }
 *
 * Format: `value breakpoint:value breakpoint:value`
 * - First token (no colon) = default value
 * - `breakpoint:value` = value at that breakpoint
 *
 * @param value - Space-separated string like "sm md:lg lg:2xl"
 * @returns Object with breakpoint keys or undefined if empty
 */
export function responsivePropertyConverter(
  value: string | null
): Record<string, string> | undefined {
  if (!value) {
    return undefined;
  }

  const result: Record<string, string> = {};
  const tokens = value.trim().split(/\s+/);

  tokens.forEach((token, index) => {
    if (token.includes(':')) {
      // Format: "breakpoint:value"
      const [breakpoint, val] = token.split(':', 2);
      if (breakpoint && val) {
        result[breakpoint] = val;
      }
    } else if (index === 0) {
      // First token without colon = default value
      result.default = token;
    }
  });

  return Object.keys(result).length > 0 ? result : undefined;
}

