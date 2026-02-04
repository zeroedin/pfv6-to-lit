import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-progress-bar.css';

/**
 * Progress bar sub-component that displays the actual progress indicator.
 *
 * @alias ProgressBar
 * @summary Internal progress bar indicator element
 * @slot - Content to display inside the progress indicator (typically percentage for inside measurement)
 */
@customElement('pfv6-progress-bar')
export class Pfv6ProgressBar extends LitElement {
  static readonly styles = styles;

  #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = 'progressbar';
  }

  /** Actual progress value (0-100) */
  @property({ type: Number })
  value = 0;

  render() {
    return html`
      <div id="container">
        <div id="indicator" style="width: ${this.value}%">
          <span id="measure"><slot></slot></span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-progress-bar': Pfv6ProgressBar;
  }
}
