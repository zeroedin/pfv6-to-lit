import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-background-image.css';

/**
 * Background Image component
 *
 * A component for displaying a fixed background image with PatternFly styling.
 *
 * @alias Background Image
 *
 * @slot - Not used (component does not accept children)
 *
 * @csspart container - The background image container element
 *
 * @cssprop --pf-v6-c-background-image--BackgroundColor - Background color
 * @cssprop --pf-v6-c-background-image--BackgroundImage - Background image URL (set via src property)
 * @cssprop --pf-v6-c-background-image--BackgroundSize--min-width - Minimum background size width
 * @cssprop --pf-v6-c-background-image--BackgroundSize--width - Background size width
 * @cssprop --pf-v6-c-background-image--BackgroundSize--max-width - Maximum background size width
 * @cssprop --pf-v6-c-background-image--BackgroundSize - Computed background size
 * @cssprop --pf-v6-c-background-image--BackgroundPosition - Background position
 */
@customElement('pfv6-background-image')
export class Pfv6BackgroundImage extends LitElement {
  static styles = styles;

  /**
  * The URL or file path of the image for the background
  */
  @property({ type: String })
  src = '';

  render() {
    return html`
      <div
        id="container"
        part="container"
        style="--pf-v6-c-background-image--BackgroundImage: url(${this.src})"
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-background-image': Pfv6BackgroundImage;
  }
}
