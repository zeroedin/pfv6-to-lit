import { LitElement, html, type PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

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
   */
  @property({ type: Object, attribute: false })
  minWidths?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };

  /**
   * Maximum widths at various breakpoints
   */
  @property({ type: Object, attribute: false })
  maxWidths?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };

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

    if (changed.has('minWidths') || changed.has('maxWidths')) {
      this.#updateBreakpointVariables();
    }

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

  #updateBreakpointVariables(): void {
    // Set CSS variables for responsive min widths
    if (this.minWidths) {
      if (this.minWidths.default) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--min', this.minWidths.default);
      }
      if (this.minWidths.sm) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--min-on-sm', this.minWidths.sm);
      }
      if (this.minWidths.md) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--min-on-md', this.minWidths.md);
      }
      if (this.minWidths.lg) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--min-on-lg', this.minWidths.lg);
      }
      if (this.minWidths.xl) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--min-on-xl', this.minWidths.xl);
      }
      if (this.minWidths['2xl']) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--min-on-2xl', this.minWidths['2xl']);
      }
    }

    // Set CSS variables for responsive max widths
    if (this.maxWidths) {
      if (this.maxWidths.default) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--max', this.maxWidths.default);
      }
      if (this.maxWidths.sm) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--max-on-sm', this.maxWidths.sm);
      }
      if (this.maxWidths.md) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--max-on-md', this.maxWidths.md);
      }
      if (this.maxWidths.lg) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--max-on-lg', this.maxWidths.lg);
      }
      if (this.maxWidths.xl) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--max-on-xl', this.maxWidths.xl);
      }
      if (this.maxWidths['2xl']) {
        this.style.setProperty('--pf-v6-l-gallery--GridTemplateColumns--max-on-2xl', this.maxWidths['2xl']);
      }
    }
  }

  render() {
    return html`
      <div id="container" class=${classMap({ 'pf-m-gutter': this.hasGutter })}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-gallery': Pfv6Gallery;
  }
}

