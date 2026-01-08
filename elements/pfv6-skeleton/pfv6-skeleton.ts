import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import styles from './pfv6-skeleton.css';

/**
 * Skeleton is a type of loading state that allows you to expose content incrementally.
 * For content that may take a long time to load, use a progress bar in place of a skeleton.
 *
 * @element pfv6-skeleton
 *
 * @cssprop --pf-c-skeleton--BackgroundColor - Background color of the skeleton
 * @cssprop --pf-c-skeleton--Width - Width of the skeleton
 * @cssprop --pf-c-skeleton--Height - Height of the skeleton
 * @cssprop --pf-c-skeleton--BorderRadius - Border radius of the skeleton
 * @cssprop --pf-c-skeleton--before--PaddingBlockEnd - Padding block end for the ::before pseudo-element
 * @cssprop --pf-c-skeleton--before--Height - Height of the ::before pseudo-element
 * @cssprop --pf-c-skeleton--before--Content - Content for the ::before pseudo-element
 * @cssprop --pf-c-skeleton--after--LinearGradientAngle - Angle of the gradient animation
 * @cssprop --pf-c-skeleton--after--LinearGradientColorStop1 - First color stop of the gradient
 * @cssprop --pf-c-skeleton--after--LinearGradientColorStop2 - Second color stop of the gradient
 * @cssprop --pf-c-skeleton--after--LinearGradientColorStop3 - Third color stop of the gradient
 * @cssprop --pf-c-skeleton--after--TranslateX - X translation of the gradient animation
 * @cssprop --pf-c-skeleton--after--AnimationName - Name of the animation
 * @cssprop --pf-c-skeleton--after--AnimationDuration - Duration of the animation
 * @cssprop --pf-c-skeleton--after--AnimationIterationCount - Iteration count of the animation
 * @cssprop --pf-c-skeleton--after--AnimationTimingFunction - Timing function of the animation
 * @cssprop --pf-c-skeleton--after--AnimationDelay - Delay of the animation
 */
@customElement('pfv6-skeleton')
export class Pfv6Skeleton extends LitElement {
  static styles = styles;

  /**
  * The width of the skeleton. Must specify pixels or percentage.
  */
  @property({ type: String })
  width?: string;

  /**
  * The height of the skeleton. Must specify pixels or percentage.
  */
  @property({ type: String })
  height?: string;

  /**
  * The font size height of the skeleton.
  */
  @property({ type: String, attribute: 'font-size' })
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

  /**
  * The shape of the skeleton.
  */
  @property({ type: String })
  shape?: 'circle' | 'square';

  /**
  * Text read just to screen reader users.
  */
  @property({ type: String, attribute: 'screenreader-text' })
  screenreaderText?: string;

  render() {
    const classes = {
      circle: this.shape === 'circle',
      square: this.shape === 'square',
      [`text-${this.fontSize}`]: !!this.fontSize,
    };

    const styles: Record<string, string> = {};
    if (this.width) {
      styles['--pf-c-skeleton--Width'] = this.width;
    }
    if (this.height) {
      styles['--pf-c-skeleton--Height'] = this.height;
    }

    return html`
      <div
        id="container"
        class=${classMap(classes)}
        style=${styleMap(styles)}
      >
        ${this.screenreaderText ? html`<span class="screen-reader">${this.screenreaderText}</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-skeleton': Pfv6Skeleton;
  }
}
