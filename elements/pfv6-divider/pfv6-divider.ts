import { LitElement, html } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import { responsivePropertyConverter } from '../../lib/converters.js';

import styles from './pfv6-divider.css';

/**
 * Divider component for visually separating content.
 *
 * @element pfv6-divider
 *
 * @cssprop --pf-v6-c-divider--Height - Height of the divider
 * @cssprop --pf-v6-c-divider--BackgroundColor - Background color of the divider
 * @cssprop --pf-v6-c-divider--m-vertical--Width - Width of vertical divider
 * @cssprop --pf-v6-c-divider--m-vertical--MaxHeight - Max height of vertical divider
 * @cssprop --pf-v6-c-divider--m-inset-* - Inset spacing values
 */
@customElement('pfv6-divider')
export class Pfv6Divider extends LitElement {
  static readonly styles = styles;

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  /**
   * The component type to use
   * @type {'hr' | 'li' | 'div'}
   * @default 'hr'
   */
  @property({ type: String, reflect: true })
  component: 'hr' | 'li' | 'div' = 'hr';

  /**
   * Insets at various breakpoints.
   * Format: "value breakpoint:value" (e.g., "insetMd md:insetNone lg:inset3xl")
   *
   * Values: insetNone | insetXs | insetSm | insetMd | insetLg | insetXl | inset2xl | inset3xl
   *
   * @example
   * <pfv6-divider inset="insetMd md:insetNone lg:inset3xl"></pfv6-divider>
   */
  @property({ converter: responsivePropertyConverter })
  inset?: Record<string, string>;

  /**
   * Indicates how the divider will display at various breakpoints.
   * Vertical divider must be in a flex layout.
   * Format: "value breakpoint:value" (e.g., "horizontal md:vertical")
   *
   * Values: vertical | horizontal
   *
   * @example
   * <pfv6-divider orientation="horizontal md:vertical"></pfv6-divider>
   */
  @property({ converter: responsivePropertyConverter })
  orientation?: Record<string, string>;

  /**
   * The ARIA role of the divider when the component property has a value other than "hr".
   * @type {'separator' | 'presentation'}
   * @default 'separator'
   */
  @property({ type: String, reflect: true })
  role: 'separator' | 'presentation' = 'separator';

  /**
   * Updates the semantic role on :host based on component and role properties
   * @private
   */
  private updateRole(): void {
    if (this.component === 'hr') {
      // <hr> has implicit separator role, don't override
      this.internals.role = null;
    } else {
      // <div> and <li> need explicit role on :host
      this.internals.role = this.role;
    }
  }

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (changedProperties.has('component') || changedProperties.has('role')) {
      this.updateRole();
    }
  }

  override render(): TemplateResult {
    // Build class map from responsive properties
    const classes: Record<string, boolean> = {};

    // Add inset modifier classes
    if (this.inset) {
      Object.entries(this.inset).forEach(([breakpoint, value]) => {
        const key = breakpoint === 'default' ? value : `${value}-on-${breakpoint}`;
        classes[key] = true;
      });
    }

    // Add orientation modifier classes
    if (this.orientation) {
      Object.entries(this.orientation).forEach(([breakpoint, value]) => {
        const key = breakpoint === 'default' ? value : `${value}-on-${breakpoint}`;
        classes[key] = true;
      });
    }

    // Render different elements based on component prop
    switch (this.component) {
      case 'hr':
        return html`<hr class=${classMap(classes)} />`;
      case 'li':
      case 'div':
        // For li and div, render a div internally
        // Role is set on :host via ElementInternals
        return html`<div class=${classMap(classes)}></div>`;
      default:
        return html`<hr class=${classMap(classes)} />`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-divider': Pfv6Divider;
  }
}

