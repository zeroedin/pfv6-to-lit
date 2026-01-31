import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-progress-step.css';

/**
 * Progress step component for individual steps within a progress stepper.
 *
 * @summary Individual step within a progress stepper showing status and description.
 * @alias ProgressStep
 *
 * @slot - Default slot for step title content
 * @slot icon - Slot for custom step icon (overrides default variant icons)
 * @slot description - Slot for step description text
 * @slot popover - Slot for popover content (renders step title as button when used)
 *
 * @cssprop --pf-v6-c-progress-stepper__step-icon--ZIndex - Icon z-index
 * @cssprop --pf-v6-c-progress-stepper__step-icon--Width - Icon width
 * @cssprop --pf-v6-c-progress-stepper__step-icon--Height - Icon height
 * @cssprop --pf-v6-c-progress-stepper__step-icon--FontSize - Icon font size
 * @cssprop --pf-v6-c-progress-stepper__step-icon--Color - Icon color
 * @cssprop --pf-v6-c-progress-stepper__step-icon--BackgroundColor - Icon background color
 * @cssprop --pf-v6-c-progress-stepper__step-icon--BorderWidth - Icon border width
 * @cssprop --pf-v6-c-progress-stepper__step-icon--BorderColor - Icon border color
 * @cssprop --pf-v6-c-progress-stepper__step-title--Color - Title text color
 * @cssprop --pf-v6-c-progress-stepper__step-title--TextAlign - Title text alignment
 * @cssprop --pf-v6-c-progress-stepper__step-title--FontSize - Title font size
 * @cssprop --pf-v6-c-progress-stepper__step-title--FontWeight - Title font weight
 * @cssprop --pf-v6-c-progress-stepper__step-description--MarginBlockStart - Description top margin
 * @cssprop --pf-v6-c-progress-stepper__step-description--FontSize - Description font size
 * @cssprop --pf-v6-c-progress-stepper__step-description--Color - Description text color
 * @cssprop --pf-v6-c-progress-stepper__step-description--TextAlign - Description text alignment
 * @cssprop --pf-v6-c-progress-stepper__step-connector--JustifyContent - Connector alignment
 */
@customElement('pfv6-progress-step')
export class Pfv6ProgressStep extends LitElement {
  static readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = styles;

  private internals: ElementInternals;

  /** Variant of the progress step. Each variant has a default icon. */
  @property({ type: String, reflect: true })
  variant: 'default' | 'success' | 'info' | 'pending' | 'warning' | 'danger' = 'default';

  /** Flag indicating the progress step is the current step. */
  @property({ type: Boolean, reflect: true, attribute: 'is-current' })
  isCurrent = false;

  /** ID of the title of the progress step. */
  @property({ type: String, attribute: 'title-id' })
  titleId?: string | undefined;

  /** Accessible label for the progress step. Should communicate all information being communicated by the progress
   * step's icon, including the variant and the completed status. */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Internal state tracking whether popover slot has content */
  @state()
  private _hasPopover = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.role = 'listitem';
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

    if (changedProperties.has('isCurrent')) {
      if (this.isCurrent) {
        this.internals.ariaCurrent = 'step';
      } else {
        this.internals.ariaCurrent = null;
      }
    }
  }

  #renderDefaultIcon() {
    // Default icons based on variant
    switch (this.variant) {
      case 'success':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true">
            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
          </svg>
        `;
      case 'info':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true">
            <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
          </svg>
        `;
      case 'warning':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 576 512" aria-hidden="true">
            <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
          </svg>
        `;
      case 'danger':
        return html`
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true">
            <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
          </svg>
        `;
      default:
        return null;
    }
  }

  #onPopoverSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this._hasPopover = slot.assignedNodes().length > 0;
  }

  render() {
    const classes = {
      info: this.variant === 'info',
      success: this.variant === 'success',
      pending: this.variant === 'pending',
      warning: this.variant === 'warning',
      danger: this.variant === 'danger',
      current: this.isCurrent,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <div id="connector">
          <span id="icon">
            <slot name="icon">${this.#renderDefaultIcon()}</slot>
          </span>
        </div>
        <div id="main">
          ${this._hasPopover ? html`
            <button
              id=${ifDefined(this.titleId)}
              class="help-text"
              type="button"
              aria-haspopup="dialog"
            >
              <slot></slot>
              <slot name="popover" @slotchange=${this.#onPopoverSlotChange}></slot>
            </button>
          ` : html`
            <div id=${ifDefined(this.titleId)}>
              <slot></slot>
            </div>
            <slot name="popover" @slotchange=${this.#onPopoverSlotChange}></slot>
          `}
          <slot name="description"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-progress-step': Pfv6ProgressStep;
  }
}
