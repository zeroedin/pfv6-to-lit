import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { responsivePropertyConverter } from '../../lib/converters.js';
import styles from './pfv6-brand.css';

/**
 * Brand component for displaying logos and brand imagery.
 * Supports both simple images and responsive picture elements with source elements.
 * 
 * @example
 * ```html
 * <!-- Simple image -->
 * <pfv6-brand src="logo.svg" alt="Company Logo"></pfv6-brand>
 * 
 * <!-- Responsive picture with source elements -->
 * <pfv6-brand src="logo.svg" alt="Company Logo">
 *   <source srcset="logo-mobile.svg" media="(max-inline-size: 768px)">
 *   <source srcset="logo-tablet.svg" media="(max-inline-size: 1024px)">
 * </pfv6-brand>
 * 
 * <!-- With responsive sizing -->
 * <pfv6-brand 
 *   src="logo.svg" 
 *   alt="Company Logo"
 *   widths="100px md:150px lg:200px"
 *   heights="40px md:60px lg:80px">
 * </pfv6-brand>
 * ```
 * 
 * @slot - Optional source elements for responsive images. When provided, renders as a picture element.
 */
@customElement('pfv6-brand')
export class Pfv6Brand extends LitElement {
  static styles = styles;

  /**
   * URL of the image.
   * For picture elements, this serves as the fallback image URL.
   */
  @property({ type: String })
  src = '';

  /**
   * Alt text for the image (required for accessibility).
   * For picture elements, this serves as the fallback image alt text.
   */
  @property({ type: String })
  alt = '';

  /**
   * Responsive widths at various breakpoints.
   * Sets CSS custom properties for width at different breakpoints.
   * 
   * @example
   * ```html
   * <pfv6-brand widths="100px md:150px lg:200px"></pfv6-brand>
   * ```
   * 
   * Format: "default-value breakpoint:value breakpoint:value"
   * Breakpoints: sm, md, lg, xl, 2xl
   */
  @property({ converter: responsivePropertyConverter })
  widths?: Record<string, string>;

  /**
   * Responsive heights at various breakpoints.
   * Sets CSS custom properties for height at different breakpoints.
   * 
   * @example
   * ```html
   * <pfv6-brand heights="40px md:60px lg:80px"></pfv6-brand>
   * ```
   * 
   * Format: "default-value breakpoint:value breakpoint:value"
   * Breakpoints: sm, md, lg, xl, 2xl
   */
  @property({ converter: responsivePropertyConverter })
  heights?: Record<string, string>;

  /**
   * Internal state tracking whether slot has content.
   * When true, renders as picture element; when false, renders as img element.
   */
  @state()
  private hasSlottedContent = false;

  render() {
    const classes = {
      picture: this.hasSlottedContent
    };

    const inlineStyles = this.buildResponsiveStyles();

    return this.hasSlottedContent
      ? html`
          <picture 
            id="container" 
            class=${classMap(classes)}
            style=${styleMap(inlineStyles)}>
            <slot @slotchange=${this.handleSlotChange}></slot>
            <img src=${this.src} alt=${this.alt} />
          </picture>
        `
      : html`
          <img 
            id="container"
            src=${this.src} 
            alt=${this.alt}
            style=${styleMap(inlineStyles)} />
        `;
  }

  /**
   * Builds responsive CSS custom properties from widths and heights properties.
   * Follows PatternFly naming convention for breakpoint-specific variables.
   * 
   * @returns Object with CSS custom properties for inline styles
   */
  private buildResponsiveStyles(): Record<string, string> {
    const inlineStyles: Record<string, string> = {};

    if (this.widths) {
      Object.entries(this.widths).forEach(([breakpoint, value]) => {
        const varName = breakpoint === 'default'
          ? '--pf-v6-c-brand--Width'
          : `--pf-v6-c-brand--Width-on-${breakpoint}`;
        inlineStyles[varName] = value;
      });
    }

    if (this.heights) {
      Object.entries(this.heights).forEach(([breakpoint, value]) => {
        const varName = breakpoint === 'default'
          ? '--pf-v6-c-brand--Height'
          : `--pf-v6-c-brand--Height-on-${breakpoint}`;
        inlineStyles[varName] = value;
      });
    }

    return inlineStyles;
  }

  /**
   * Handles slot content changes to determine if component should render as picture or img.
   * Updates internal state to trigger re-render when slot content changes.
   */
  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    // Filter out text nodes (whitespace) and only count element nodes
    const elements = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE);
    this.hasSlottedContent = elements.length > 0;
  }

  /**
   * Initialize slot content state on first update.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    
    // Check initial slot content
    const slot = this.shadowRoot?.querySelector('slot');
    if (slot) {
      const nodes = slot.assignedNodes({ flatten: true });
      const elements = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE);
      this.hasSlottedContent = elements.length > 0;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-brand': Pfv6Brand;
  }
}

