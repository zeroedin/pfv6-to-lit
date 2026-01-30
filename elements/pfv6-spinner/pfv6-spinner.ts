import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-spinner.css';

/**
 * Spinner component for indicating loading state.
 *
 * @alias Spinner
 *
 * A visual loading indicator that displays an animated circular spinner.
 * Supports preset sizes (sm, md, lg, xl) or custom diameter via CSS variable.
 * When inline, the spinner inherits the current text font size.
 *
 * @cssprop --pf-v6-c-spinner--diameter - Custom diameter of the spinner
 * @cssprop --pf-v6-c-spinner--Width - Width of the spinner (defaults to diameter)
 * @cssprop --pf-v6-c-spinner--Height - Height of the spinner (defaults to diameter)
 * @cssprop --pf-v6-c-spinner--Color - Color of the spinner stroke
 * @cssprop --pf-v6-c-spinner--AnimationDuration - Duration of one animation cycle
 * @cssprop --pf-v6-c-spinner--AnimationTimingFunction - Timing function for rotation animation
 * @cssprop --pf-v6-c-spinner--StrokeWidth - Stroke width of the spinner circle
 * @cssprop --pf-v6-c-spinner__path--StrokeWidth - Stroke width of the spinner path
 * @cssprop --pf-v6-c-spinner__path--AnimationTimingFunction - Timing function for path animation
 * @cssprop --pf-v6-c-spinner--m-sm--diameter - Diameter for small spinner
 * @cssprop --pf-v6-c-spinner--m-md--diameter - Diameter for medium spinner
 * @cssprop --pf-v6-c-spinner--m-lg--diameter - Diameter for large spinner
 * @cssprop --pf-v6-c-spinner--m-xl--diameter - Diameter for extra-large spinner
 * @cssprop --pf-v6-c-spinner--m-inline--diameter - Diameter for inline spinner
 */
@customElement('pfv6-spinner')
export class Pfv6Spinner extends LitElement {
  static styles = styles;

  /**
  * Size variant of the spinner.
  * Ignored when isInline is true.
  */
  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' | 'xl' = 'xl';

  /**
  * Text describing the current loading status.
  * Announced by screen readers to provide context.
  */
  @property({ type: String, attribute: 'accessible-valuetext' })
  accessibleValuetext = 'Loading...';

  /**
  * Custom diameter for the spinner.
  * Sets the --pf-v6-c-spinner--diameter CSS variable.
  * Example: "80px", "3rem"
  */
  @property({ type: String })
  diameter?: string;

  /**
  * When true, spinner displays inline and inherits text font size.
  * This overrides the size property.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-inline' })
  isInline = false;

  /**
  * Accessible label describing what is loading.
  * Provides context for screen reader users.
  */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  /**
  * ID of an element that describes what is loading.
  * Alternative to accessible-label for referencing existing text.
  */
  @property({ type: String, attribute: 'accessible-labelledby' })
  accessibleLabelledby?: string;

  render() {
    // Build class map for size/inline modifiers
    const classes = {
      inline: this.isInline,
      sm: this.size === 'sm' && !this.isInline,
      md: this.size === 'md' && !this.isInline,
      lg: this.size === 'lg' && !this.isInline,
      xl: this.size === 'xl' && !this.isInline,
    };

    // Determine effective aria-label:
    // 1. Use explicit accessibleLabel if provided
    // 2. If accessibleLabelledby is set, don't set aria-label (let labelledby handle it)
    // 3. Fall back to 'Contents' as default (matches React behavior)
    const effectiveAriaLabel = this.accessibleLabel
      || (!this.accessibleLabelledby ? 'Contents' : undefined);

    // Build inline style for custom diameter
    const customStyle = this.diameter ?
      `--pf-v6-c-spinner--diameter: ${this.diameter}`
      : undefined;

    return html`
      <svg
        id="spinner"
        class=${classMap(classes)}
        role="progressbar"
        aria-valuetext=${this.accessibleValuetext}
        aria-label=${ifDefined(effectiveAriaLabel)}
        aria-labelledby=${ifDefined(this.accessibleLabelledby)}
        viewBox="0 0 100 100"
        style=${ifDefined(customStyle)}
      >
        <circle id="path" cx="50" cy="50" r="45" fill="none" />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-spinner': Pfv6Spinner;
  }
}
