import type { PropertyValues } from 'lit';
import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import { classMap } from 'lit/directives/class-map.js';

import { 
  type ResponsiveValue, 
  parseResponsiveAttribute, 
  buildResponsiveClasses 
} from '../../lib/responsive-attributes.js';

import styles from './pfv6-divider.css';

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
      fromAttribute: (value) => parseResponsiveAttribute<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>(value),
      toAttribute: () => null // Don't reflect complex responsive values
    }
  })
  inset?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>;

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
      fromAttribute: (value) => parseResponsiveAttribute<'vertical' | 'horizontal'>(value),
      toAttribute: () => null // Don't reflect complex responsive values
    }
  })
  orientation?: ResponsiveValue<'vertical' | 'horizontal'>;

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
    const classes = {
      // Orientation classes: "vertical", "horizontal-on-md"
      ...buildResponsiveClasses(this.orientation, {
        classNameBuilder: (value, breakpoint) => 
          breakpoint ? `${value}-on-${breakpoint}` : value
      }),
      
      // Inset classes: "inset-sm", "inset-md-on-lg"
      ...buildResponsiveClasses(this.inset, {
        classNameBuilder: (value, breakpoint) => 
          breakpoint ? `inset-${value}-on-${breakpoint}` : `inset-${value}`
      })
    };
    
    return html`
      <div id="container" class=${classMap(classes)}></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-divider': Pfv6Divider;
  }
}

