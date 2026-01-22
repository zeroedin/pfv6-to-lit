import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import './pfv6-progress-step.js';
import styles from './pfv6-progress-stepper.css';

/**
 * Progress stepper component for displaying multi-step progress.
 *
 * @summary Progress stepper shows the user's progression through a multi-step process.
 * @alias ProgressStepper
 *
 * @slot - Default slot for pfv6-progress-step elements
 *
 * @cssprop --pf-v6-c-progress-stepper--GridTemplateRows - Grid template rows configuration
 * @cssprop --pf-v6-c-progress-stepper--GridAutoFlow - Grid auto flow direction
 * @cssprop --pf-v6-c-progress-stepper--GridTemplateColumns - Grid template columns configuration
 */
@customElement('pfv6-progress-stepper')
export class Pfv6ProgressStepper extends LitElement {
  static styles = styles;

  private internals: ElementInternals;

  /** Flag indicating the progress stepper should be centered. */
  @property({ type: Boolean, reflect: true, attribute: 'is-center-aligned' })
  isCenterAligned = false;

  /** Flag indicating the progress stepper has a vertical layout. */
  @property({ type: Boolean, reflect: true, attribute: 'is-vertical' })
  isVertical = false;

  /** Flag indicating the progress stepper should be rendered compactly. */
  @property({ type: Boolean, reflect: true, attribute: 'is-compact' })
  isCompact = false;

  /** Accessible label for the progress stepper. */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.role = 'list';
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('accessibleLabel')) {
      if (this.accessibleLabel) {
        this.internals.ariaLabel = this.accessibleLabel;
      } else {
        this.internals.ariaLabel = null;
      }
    }
  }

  render() {
    const classes = {
      center: this.isCenterAligned,
      vertical: this.isVertical,
      compact: this.isCompact,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-progress-stepper': Pfv6ProgressStepper;
  }
}
