import { LitElement, html, type PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { 
  type ResponsiveValue, 
  createResponsiveConverter, 
  forEachResponsiveValue 
} from '../../lib/responsive-attributes.js';

import styles from './pfv6-gallery.css';

/**
 * Gallery is a layout component that displays content in a responsive grid.
 *
 * @slot - Default slot for gallery items
 *
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns - Grid template columns
 * @cssprop --pf-v6-l-gallery--GridTemplateRows - Grid template rows
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--min - Minimum width for grid items (default: 250px)
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--max - Maximum width for grid items (default: 1fr)
 * @cssprop --pf-v6-l-gallery--m-gutter--GridGap - Gap between items when hasGutter is true
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--min-on-sm - Minimum width at sm breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--min-on-md - Minimum width at md breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--min-on-lg - Minimum width at lg breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--min-on-xl - Minimum width at xl breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--min-on-2xl - Minimum width at 2xl breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--max-on-sm - Maximum width at sm breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--max-on-md - Maximum width at md breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--max-on-lg - Maximum width at lg breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--max-on-xl - Maximum width at xl breakpoint
 * @cssprop --pf-v6-l-gallery--GridTemplateColumns--max-on-2xl - Maximum width at 2xl breakpoint
 */
@customElement('pfv6-gallery')
export class Pfv6Gallery extends LitElement {
  static readonly styles = styles;
  static readonly formAssociated = true;

  /**
   * Adds space between gallery items
   */
  @property({ type: Boolean, attribute: 'has-gutter', reflect: true })
  hasGutter = false;

  /**
   * Minimum widths at various breakpoints
   * @example min-widths="250px" or min-widths="100% md:100px xl:300px"
   */
  @property({ 
    type: Object, 
    attribute: 'min-widths',
    converter: createResponsiveConverter()
  })
  minWidths?: ResponsiveValue<string>;

  /**
   * Maximum widths at various breakpoints
   * @example max-widths="1fr" or max-widths="md:280px lg:320px 2xl:400px"
   */
  @property({ 
    type: Object, 
    attribute: 'max-widths',
    converter: createResponsiveConverter()
  })
  maxWidths?: ResponsiveValue<string>;

  /**
   * Sets the base component to render (defaults to div)
   * Sets appropriate ARIA role via ElementInternals:
   * - 'ul' or 'ol' → role="list"
   * - 'article' → role="article"
   * - 'section' → role="region"
   */
  @property({ type: String })
  component: 'div' | 'section' | 'article' | 'ul' | 'ol' = 'div';

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has('component')) {
      // Map component type to ARIA role for semantic structures
      switch (this.component) {
        case 'ul':
        case 'ol':
          this.internals.role = 'list';
          break;
        case 'article':
          this.internals.role = 'article';
          break;
        case 'section':
          this.internals.role = 'region';
          break;
        default:
          this.internals.role = null;
      }
    }
  }

  render() {
    return html`
      <div id="container" 
           class=${classMap({ 'pf-m-gutter': this.hasGutter })}
           style=${styleMap(this.#getContainerStyles())}>
        <slot></slot>
      </div>
    `;
  }

  #getContainerStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    // Set PUBLIC API variables on #container
    // The private variables on :host will pick these up via var() and fallback chains
    // This maintains two-layer pattern: JS sets public API, CSS private vars reference it
    forEachResponsiveValue(this.minWidths, (value, breakpoint) => {
      const varName = breakpoint === 'default'
        ? '--pf-v6-l-gallery--GridTemplateColumns--min'
        : `--pf-v6-l-gallery--GridTemplateColumns--min-on-${breakpoint}`;
      styles[varName] = value;
    });

    // Set PUBLIC API variables on #container
    forEachResponsiveValue(this.maxWidths, (value, breakpoint) => {
      const varName = breakpoint === 'default'
        ? '--pf-v6-l-gallery--GridTemplateColumns--max'
        : `--pf-v6-l-gallery--GridTemplateColumns--max-on-${breakpoint}`;
      styles[varName] = value;
    });

    return styles;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-gallery': Pfv6Gallery;
  }
}

