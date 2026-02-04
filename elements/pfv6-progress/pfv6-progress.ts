import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref, createRef } from 'lit/directives/ref.js';
import './pfv6-progress-bar.js';
import './pfv6-progress-helper-text.js';
import '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import styles from './pfv6-progress.css';

/**
 * A progress component displays the completion status of a task or process with a visual indicator.
 *
 * @alias Progress
 * @summary Visual indicator showing task completion status
 * @cssprop --pf-v6-c-progress--GridGap - Spacing between progress component rows
 * @cssprop --pf-v6-c-progress__bar--Height - Height of progress bar
 * @cssprop --pf-v6-c-progress__bar--BackgroundColor - Background color of progress bar
 * @cssprop --pf-v6-c-progress__bar--BorderRadius - Border radius of progress bar
 * @cssprop --pf-v6-c-progress__bar--BorderColor - Border color of progress bar
 * @cssprop --pf-v6-c-progress__bar--BorderWidth - Border width of progress bar
 * @cssprop --pf-v6-c-progress__measure--m-static-width--MinWidth - Minimum width for static measure display
 * @cssprop --pf-v6-c-progress__status--Gap - Spacing between status elements
 * @cssprop --pf-v6-c-progress__status-icon--Color - Color of status icon
 * @cssprop --pf-v6-c-progress__indicator--Height - Height of progress indicator
 * @cssprop --pf-v6-c-progress__indicator--BackgroundColor - Background color of progress indicator
 * @cssprop --pf-v6-c-progress__indicator--BorderWidth - Border width of progress indicator
 * @cssprop --pf-v6-c-progress__indicator--BorderColor - Border color of progress indicator
 * @cssprop --pf-v6-c-progress__helper-text--MarginBlockStart - Top margin of helper text
 * @cssprop --pf-v6-c-progress--m-success__indicator--BackgroundColor - Indicator color for success state
 * @cssprop --pf-v6-c-progress--m-warning__indicator--BackgroundColor - Indicator color for warning state
 * @cssprop --pf-v6-c-progress--m-danger__indicator--BackgroundColor - Indicator color for danger state
 * @cssprop --pf-v6-c-progress--m-success__status-icon--Color - Icon color for success state
 * @cssprop --pf-v6-c-progress--m-warning__status-icon--Color - Icon color for warning state
 * @cssprop --pf-v6-c-progress--m-danger__status-icon--Color - Icon color for danger state
 * @cssprop --pf-v6-c-progress--m-inside__indicator--MinWidth - Minimum width of inside indicator
 * @cssprop --pf-v6-c-progress--m-inside__measure--Color - Text color for inside measure
 * @cssprop --pf-v6-c-progress--m-success--m-inside__measure--Color - Text color for inside measure in success state
 * @cssprop --pf-v6-c-progress--m-warning--m-inside__measure--Color - Text color for inside measure in warning state
 * @cssprop --pf-v6-c-progress--m-danger--m-inside__measure--Color - Text color for inside measure in danger state
 * @cssprop --pf-v6-c-progress--m-inside__measure--FontSize - Font size for inside measure
 * @cssprop --pf-v6-c-progress--m-outside__measure--FontSize - Font size for outside measure
 * @cssprop --pf-v6-c-progress--m-sm__bar--Height - Height of small progress bar
 * @cssprop --pf-v6-c-progress--m-sm__measure--FontSize - Font size for measure in small size
 * @cssprop --pf-v6-c-progress--m-lg__bar--Height - Height of large progress bar
 */
@customElement('pfv6-progress')
export class Pfv6Progress extends LitElement {
  static readonly styles = styles;

  /** Size variant of progress */
  @property({ type: String, reflect: true })
  size?: 'sm' | 'md' | 'lg' | undefined;

  /** Where the measure percent will be located */
  @property({ type: String, reflect: true, attribute: 'measure-location' })
  measureLocation: 'outside' | 'inside' | 'top' | 'none' = 'top';

  /** Status variant of progress */
  @property({ type: String, reflect: true })
  variant?: 'danger' | 'success' | 'warning' | undefined;

  /** Title above progress */
  @property({ type: String })
  override title = '';

  /** Text description of current progress value to display instead of percentage */
  @property({ type: String })
  label?: string | undefined;

  /** Actual value of progress */
  @property({ type: Number })
  value = 0;

  /** Minimal value of progress */
  @property({ type: Number })
  min = 0;

  /** Maximum value of progress */
  @property({ type: Number })
  max = 100;

  /** Accessible text description of current progress value, for when value is not a percentage */
  @property({ type: String, attribute: 'value-text' })
  valueText?: string | undefined;

  /** Indicate whether to truncate the string title */
  @property({ type: Boolean, reflect: true, attribute: 'is-title-truncated' })
  isTitleTruncated = false;

  /** Position of the tooltip which is displayed if title is truncated */
  @property({ type: String, attribute: 'tooltip-position' })
  tooltipPosition: 'auto' | 'top' | 'bottom' | 'left' | 'right' = 'top';

  /** Accessible label for the progress bar */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** ID of element that labels the progress bar */
  @property({ type: String, attribute: 'accessible-labelledby' })
  accessibleLabelledby?: string | undefined;

  /** ID(s) of elements that describe the progress bar */
  @property({ type: String, attribute: 'accessible-describedby' })
  accessibleDescribedby?: string | undefined;

  /** Helper text content */
  @property({ type: String, attribute: 'helper-text' })
  helperText?: string | undefined;

  @state()
  private scaledValue = 0;

  @state()
  private tooltipText = '';

  private titleRef = createRef<HTMLDivElement>();
  private generatedId = `pfv6-progress-${Math.random().toString(36).substr(2, 9)}`;

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (
      changedProperties.has('value')
      || changedProperties.has('min')
      || changedProperties.has('max')
    ) {
      this.#calculateScaledValue();
    }

    if (changedProperties.has('title') && this.title) {
      this.#checkTitleTruncation();
    }
  }

  #calculateScaledValue() {
    const range = this.max - this.min;
    const normalizedValue = this.value - this.min;
    this.scaledValue = Math.min(100, Math.max(0, Math.floor((normalizedValue / range) * 100))) || 0;
  }

  #checkTitleTruncation() {
    if (!this.isTitleTruncated || !this.titleRef.value) {
      return;
    }

    requestAnimationFrame(() => {
      const element = this.titleRef.value;
      if (element && element.offsetWidth < element.scrollWidth) {
        this.tooltipText = this.title || '';
      } else {
        this.tooltipText = '';
      }
    });
  }

  #handleTitleMouseEnter = () => {
    if (this.isTitleTruncated) {
      this.#checkTitleTruncation();
    }
  };

  #handleTitleFocus = () => {
    if (this.isTitleTruncated) {
      this.#checkTitleTruncation();
    }
  };

  #getVariantIcon() {
    /* eslint-disable @stylistic/max-len */
    const icons: Record<string, { path: string; viewBox: string }> = {
      success: {
        path: 'M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z',
        viewBox: '0 0 512 512',
      },
      danger: {
        path: 'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z',
        viewBox: '0 0 512 512',
      },
      warning: {
        path: 'M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z',
        viewBox: '0 0 576 512',
      },
    };
    /* eslint-enable @stylistic/max-len */

    return icons[this.variant || ''];
  }

  render() {
    const classes = {
      danger: this.variant === 'danger',
      success: this.variant === 'success',
      warning: this.variant === 'warning',
      inside: this.measureLocation === 'inside',
      outside: this.measureLocation === 'outside',
      sm: this.measureLocation === 'inside' ? false : this.size === 'sm',
      lg: this.measureLocation === 'inside' ? true : this.size === 'lg',
      singleline: !this.title,
    };

    const isTruncatedAndString = this.isTitleTruncated && typeof this.title === 'string';
    const statusIcon = this.#getVariantIcon();
    const effectiveLabelledby = this.accessibleLabelledby || (this.title ? `${this.generatedId}-description` : undefined);

    return html`
      <div id="container" class=${classMap(classes)}>
        ${this.title ? html`
          ${isTruncatedAndString ? html`
            <pfv6-tooltip
              .content=${this.tooltipText}
              .position=${this.tooltipPosition}
            >
              <div
                ${ref(this.titleRef)}
                id="${this.generatedId}-description"
                class="title truncate"
                @mouseenter=${this.#handleTitleMouseEnter}
                @focus=${this.#handleTitleFocus}
                tabindex="0"
              >
                ${this.title}
              </div>
            </pfv6-tooltip>
          ` : html`
            <div
              id="${this.generatedId}-description"
              class="title"
              aria-hidden="true"
            >
              ${this.title}
            </div>
          `}
        ` : null}

        ${(this.measureLocation !== 'none' || statusIcon) ? html`
          <div class="status" aria-hidden="true">
            ${(this.measureLocation === 'top' || this.measureLocation === 'outside') ? html`
              <span class="measure">${this.label || `${this.scaledValue}%`}</span>
            ` : null}
            ${statusIcon ? html`
              <span class="status-icon">
                <svg fill="currentColor" height="1em" width="1em" viewBox=${statusIcon.viewBox} aria-hidden="true">
                  <path d=${statusIcon.path}></path>
                </svg>
              </span>
            ` : null}
          </div>
        ` : null}

        <pfv6-progress-bar
          value=${this.scaledValue}
          aria-valuemin=${this.min}
          aria-valuenow=${this.value}
          aria-valuemax=${this.max}
          aria-valuetext=${ifDefined(this.valueText)}
          aria-label=${ifDefined(this.accessibleLabel)}
          aria-labelledby=${ifDefined(effectiveLabelledby)}
          aria-describedby=${ifDefined(this.accessibleDescribedby)}
        >
          ${this.measureLocation === 'inside' ? `${this.scaledValue}%` : ''}
        </pfv6-progress-bar>

        ${this.helperText ? html`
          <pfv6-progress-helper-text>${this.helperText}</pfv6-progress-helper-text>
        ` : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-progress': Pfv6Progress;
  }
}
