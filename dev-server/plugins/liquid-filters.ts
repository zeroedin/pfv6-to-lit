import type { Liquid } from 'liquidjs';

/**
 * Register custom Liquid filters for formatting and transformations
 * @param liquid - The Liquid instance to register filters on
 */
export function registerCustomFilters(liquid: Liquid): void {
  /**
   * Convert kebab-case to Title Case
   * Example: "pfv6-card" → "Card"
   */
  liquid.registerFilter('titleCase', (str: string) => {
    return str
        .replace(/^pfv6-/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  });

  /**
   * Build demo URL for component
   * Example: ("pfv6-card", "basic", false) → "/elements/pfv6-card/demo/basic"
   */
  liquid.registerFilter('demoUrl', (componentName: string, demoName: string, isReact = false) => {
    const prefix = isReact ? 'react' : 'demo';
    return `/elements/${componentName}/${prefix}/${demoName}`;
  });

  /**
   * Build demo index URL
   * Example: ("pfv6-card", false) → "/elements/pfv6-card/demo"
   */
  liquid.registerFilter('demoIndexUrl', (componentName: string, isReact = false) => {
    const prefix = isReact ? 'react' : 'demo';
    return `/elements/${componentName}/${prefix}`;
  });
}
