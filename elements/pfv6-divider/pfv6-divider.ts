import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { responsivePropertyConverter } from '../../lib/converters.js';

import styles from './pfv6-divider.css';

/**
 * Divider component for visually separating content.
 *
 * @alias Divider
 *
 * For list semantics, wrap in `<li>`:
 * ```html
 * <ul>
 *   <li>Item</li>
 *   <li><pfv6-divider></pfv6-divider></li>
 *   <li>Item</li>
 * </ul>
 * ```
 *
 * To override the implicit separator role:
 * ```html
 * <pfv6-divider role="presentation"></pfv6-divider>
 * ```
 *
 * @cssprop --pf-v6-c-divider--Color - Color of the divider line
 * @cssprop --pf-v6-c-divider--Size - Width/height of the divider line (thickness)
 * @cssprop --pf-v6-c-divider--Display - Display property (default: flex)
 * @cssprop --pf-v6-c-divider--before--FlexBasis - Flex basis of divider line (spacing)
 */
@customElement('pfv6-divider')
export class Pfv6Divider extends LitElement {
  static readonly styles = styles;

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
  * ARIA role of the divider.
  * Set this to override the implicit separator role of <hr>.
  *
  * @example
  * <pfv6-divider role="presentation"></pfv6-divider>
  */
  @property({ type: String })
  role: string | null = null;

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

    // If role property is set, suppress the <hr> implicit separator role
    // This allows the host's explicit role to take precedence
    // Example: <pfv6-divider role="presentation"> renders <hr role="none"> internally
    const hrRole = this.role ? 'none' : undefined;

    return html`<hr role=${ifDefined(hrRole)} class=${classMap(classes)} />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-divider': Pfv6Divider;
  }
}
