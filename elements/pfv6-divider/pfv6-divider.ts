import type { PropertyValues } from 'lit';
import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import { classMap } from 'lit/directives/class-map.js';

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
   */
  @property({ type: Object })
  inset?: {
    default?: 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd' | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl';
    sm?: 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd' | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl';
    md?: 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd' | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl';
    lg?: 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd' | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl';
    xl?: 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd' | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl';
    '2xl'?: 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd' | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl';
  };

  /**
   * Indicates how the divider will display at various breakpoints.
   * Vertical divider must be in a flex layout.
   */
  @property({ type: Object })
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
      const insetValue = this.inset.default.replace('inset', '').toLowerCase();
      if (insetValue === 'none') {
        classes['inset-none'] = true;
      } else {
        classes[`inset-${insetValue}`] = true;
      }
    }
    
    // Responsive inset classes
    ['sm', 'md', 'lg', 'xl', '2xl'].forEach(breakpoint => {
      const bp = breakpoint as 'sm' | 'md' | 'lg' | 'xl' | '2xl';
      const value = this.inset?.[bp];
      if (value) {
        const insetValue = value.replace('inset', '').toLowerCase();
        if (insetValue === 'none') {
          classes[`inset-none-on-${breakpoint}`] = true;
        } else {
          classes[`inset-${insetValue}-on-${breakpoint}`] = true;
        }
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

