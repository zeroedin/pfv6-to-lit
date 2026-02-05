import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-slider-step.css';

/**
 * Individual step marker for the slider component.
 */
@customElement('pfv6-slider-step')
export class Pfv6SliderStep extends LitElement {
  static readonly styles = styles;

  /** Flag indicating the step is active. */
  @property({ type: Boolean, reflect: true, attribute: 'is-active' })
  isActive = false;

  /** Flag indicating that the label should be hidden. */
  @property({ type: Boolean, attribute: 'is-label-hidden' })
  isLabelHidden = false;

  /** Flag indicating that the tick should be hidden. */
  @property({ type: Boolean, attribute: 'is-tick-hidden' })
  isTickHidden = false;

  /** Step label. */
  @property({ type: String })
  label?: string;

  /** Step value (percentage). */
  @property({ type: Number })
  value?: number;

  render() {
    const classes = {
      active: this.isActive,
    };

    const style = this.value !== undefined ?
      `--pf-v6-c-slider__step--InsetInlineStart: ${this.value}%`
      : '';

    return html`
      <div id="container" class=${classMap(classes)} style=${style}>
        ${!this.isTickHidden ? html`<div id="tick"></div>` : null}
        ${!this.isLabelHidden && this.label ? html`
          <div id="label">${this.label}</div>
        ` : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-slider-step': Pfv6SliderStep;
  }
}
