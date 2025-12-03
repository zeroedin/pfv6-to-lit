import type { PropertyValues } from 'lit';
import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import { classMap } from 'lit/directives/class-map.js';

import styles from './pfv6-divider.css';

/**
 * Responsive value converter for orientation and inset properties
 * Converts "vertical sm:horizontal md:vertical" to { default: 'vertical', sm: 'horizontal', md: 'vertical' }
 */
function parseResponsiveValue<T extends string>(value: string | null): { default?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T } | undefined {
  if (!value) return undefined;
  
  const result: { default?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T } = {};
  const parts = value.trim().split(/\s+/);
  
  for (const part of parts) {
    if (part.includes(':')) {
      const [breakpoint, val] = part.split(':');
      if (breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
        result[breakpoint] = val as T;
      }
    } else {
      result.default = part as T;
    }
  }
  
  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Divider - A divider is a horizontal or vertical line that is used to separate content.
 *
 * @element pfv6-divider
 * 
 * @cssprop --pf-v6-c-divider--Display - Display property for the divider
 * @cssprop --pf-v6-c-divider--Color - Color of the divider line
 * @cssprop --pf-v6-c-divider--Size - Size (thickness) of the divider line
 * @cssprop --pf-v6-c-divider--before--FlexBasis - Flex basis for the divider's ::before pseudo-element
 */
@customElement('pfv6-divider')
export class Pfv6Divider extends LitElement {
  static readonly styles = styles;
  static readonly formAssociated = true;

  /**
   * The component type to use
   */
  @property({ type: String })
  component: 'hr' | 'li' | 'div' = 'hr';

  /**
   * Insets at various breakpoints
   * 
   * Examples:
   * - inset="sm" → { default: 'sm' }
   * - inset="sm md:md lg:lg" → { default: 'sm', md: 'md', lg: 'lg' }
   */
  @property({ 
    converter: {
      fromAttribute: (value) => parseResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>(value),
      toAttribute: (value) => value ? JSON.stringify(value) : null
    }
  })
  inset?: {
    default?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    sm?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    md?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    lg?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    xl?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    '2xl'?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  };

  /**
   * Indicates how the divider will display at various breakpoints.
   * Vertical divider must be in a flex layout.
   * 
   * Examples:
   * - orientation="vertical" → { default: 'vertical' }
   * - orientation="vertical sm:horizontal md:vertical" → { default: 'vertical', sm: 'horizontal', md: 'vertical' }
   */
  @property({ 
    converter: {
      fromAttribute: (value) => parseResponsiveValue<'vertical' | 'horizontal'>(value),
      toAttribute: (value) => value ? JSON.stringify(value) : null
    }
  })
  orientation?: {
    default?: 'vertical' | 'horizontal';
    sm?: 'vertical' | 'horizontal';
    md?: 'vertical' | 'horizontal';
    lg?: 'vertical' | 'horizontal';
    xl?: 'vertical' | 'horizontal';
    '2xl'?: 'vertical' | 'horizontal';
  };

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);
    
    // Set ARIA role based on component type
    // Note: If user provides explicit role attribute, it will override internals.role automatically
    if (changed.has('component')) {
      switch (this.component) {
        case 'hr':
          // HR should explicitly get separator role
          this.internals.role = 'separator';
          break;
        case 'li':
          // List item gets listitem role for list context
          this.internals.role = 'listitem';
          break;
        case 'div':
          // Div has no semantic role by default (neutral container)
          this.internals.role = null;
          break;
      }
    }
  }

  render() {
    const classes = this.#getClasses();
    
    return html`
      <div id="container" class=${classMap(classes)}></div>
    `;
  }

  #getClasses() {
    const classes: Record<string, boolean> = {};
    
    // Orientation classes
    if (this.orientation?.default === 'vertical') {
      classes['vertical'] = true;
    } else if (this.orientation?.default === 'horizontal') {
      classes['horizontal'] = true;
    }
    
    // Responsive orientation classes
    ['sm', 'md', 'lg', 'xl', '2xl'].forEach(breakpoint => {
      const bp = breakpoint as 'sm' | 'md' | 'lg' | 'xl' | '2xl';
      const value = this.orientation?.[bp];
      if (value) {
        classes[`${value}-on-${breakpoint}`] = true;
      }
    });
    
    // Inset classes
    if (this.inset?.default) {
      classes[`inset-${this.inset.default}`] = true;
    }

    // Responsive inset classes
    ['sm', 'md', 'lg', 'xl', '2xl'].forEach(breakpoint => {
      const bp = breakpoint as 'sm' | 'md' | 'lg' | 'xl' | '2xl';
      const value = this.inset?.[bp];
      if (value) {
        classes[`inset-${value}-on-${breakpoint}`] = true;
      }
    });
    
    return classes;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-divider': Pfv6Divider;
  }
}

