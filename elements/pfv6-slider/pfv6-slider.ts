import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { query } from 'lit/decorators/query.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import '../pfv6-input-group/pfv6-input-group.js';
import '../pfv6-input-group/pfv6-input-group-item.js';
import '../pfv6-input-group/pfv6-input-group-text.js';
import '../pfv6-text-input/pfv6-text-input.js';
import './pfv6-slider-step.js';
import '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import styles from './pfv6-slider.css';

/**
 * Event fired when slider value changes.
 */
export class Pfv6SliderChangeEvent extends Event {
  constructor(
    public value: number,
    public inputValue?: number
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Properties for creating custom steps in a slider.
 */
export interface SliderStepObject {
  /** Flag to hide the label. */
  isLabelHidden?: boolean;
  /** The display label for the step value. This is also used for the aria-valuetext attribute. */
  label: string;
  /** Value of the step. This value is a percentage of the slider where the tick is drawn. */
  value: number;
}

/**
 * Slider component for selecting a numeric value within a range.
 *
 * Architecture: Shadow DOM + FACE
 *
 * Rationale:
 * - Slider is a complex form control with internal state management
 * - All ARIA relationships are internal (thumb, rail, steps)
 * - Participates in form submission with numeric value
 * - Uses ElementInternals for accessibility and form integration
 *
 * @slot start-actions - Actions placed at the start of the slider
 * @slot end-actions - Actions placed at the end of the slider
 * @fires Pfv6SliderChangeEvent - Fired when the slider value changes
 * @cssprop --pf-v6-c-slider--value - Current slider value percentage
 * @cssprop --pf-v6-c-slider__value--c-form-control--width-chars - Input field width in characters
 */
@customElement('pfv6-slider')
export class Pfv6Slider extends LitElement {
  static readonly styles = styles;
  static readonly formAssociated = true;

  #internals: ElementInternals;

  @query('#rail')
  private railElement?: HTMLElement;

  @query('#thumb')
  private thumbElement?: HTMLElement;

  /** Flag indicating if the slider is discrete for custom steps. This will cause the slider to snap to the closest value. */
  @property({ type: Boolean, attribute: 'are-custom-steps-continuous' })
  areCustomStepsContinuous = false;

  /** Accessible label for the input field. */
  @property({ type: String, attribute: 'accessible-input-label' })
  accessibleInputLabel = 'Slider value input';

  /** Accessible label for the slider thumb. */
  @property({ type: String, attribute: 'accessible-thumb-label' })
  accessibleThumbLabel = 'Value';

  /** Array of custom slider step objects (value and label of each step) for the slider. */
  @property({ type: Array })
  customSteps?: SliderStepObject[] | undefined;

  /** Adds a tooltip over the slider thumb containing the current value. */
  @property({ type: Boolean, attribute: 'has-tooltip-over-thumb' })
  hasTooltipOverThumb = false;

  /** Text label that is place after the input field. */
  @property({ type: String, attribute: 'input-label' })
  inputLabel?: string | undefined;

  /** Position of the input. */
  @property({ type: String, attribute: 'input-position' })
  inputPosition: 'aboveThumb' | 'end' = 'end';

  /** Value displayed in the input field. */
  @property({ type: Number, attribute: 'input-value' })
  inputValue = 0;

  /** Adds disabled styling, and disables the slider and the input component if present. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Flag to show value input field. */
  @property({ type: Boolean, attribute: 'is-input-visible' })
  isInputVisible = false;

  /** The maximum permitted value. */
  @property({ type: Number })
  max = 100;

  /** The minimum permitted value. */
  @property({ type: Number })
  min = 0;

  /** Form control name. */
  @property({ type: String, reflect: true })
  name = '';

  /** Flag to indicate if boundaries should be shown for slider that does not have custom steps. */
  @property({ type: Boolean, attribute: 'show-boundaries' })
  showBoundaries = true;

  /** Flag to indicate if ticks should be shown for slider that does not have custom steps. */
  @property({ type: Boolean, attribute: 'show-ticks' })
  showTicks = false;

  /** The step interval. */
  @property({ type: Number })
  step = 1;

  /** Current value of the slider. */
  @property({ type: Number })
  value = 0;

  @state()
  private localValue = 0;

  @state()
  private localInputValue = 0;

  @state()
  private isDragging = false;

  private dragStartDiff = 0;
  private snapValue?: number;
  #initialValue = 0;
  #initialInputValue = 0;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  override connectedCallback() {
    super.connectedCallback();
    // Store initial values for form reset
    this.#initialValue = this.value;
    this.#initialInputValue = this.inputValue;
    this.localValue = this.value;
    this.localInputValue = this.inputValue;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up any active drag listeners
    document.removeEventListener('mousemove', this.#handleThumbMove);
    document.removeEventListener('mouseup', this.#handleThumbDragEnd);
    document.removeEventListener('touchmove', this.#handleThumbMove);
    document.removeEventListener('touchend', this.#handleThumbDragEnd);
    document.removeEventListener('touchcancel', this.#handleThumbDragEnd);
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('value')) {
      this.localValue = this.value;
      this.#updateFormValue();
    }

    if (changedProperties.has('inputValue')) {
      this.localInputValue = this.inputValue;
    }

    if (changedProperties.has('disabled')) {
      this.#internals.ariaDisabled = this.disabled ? 'true' : 'false';
    }

    if (
      changedProperties.has('localValue')
      || changedProperties.has('min')
      || changedProperties.has('max')
    ) {
      this.#updateFormValue();
    }
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
    this.#internals.ariaDisabled = disabled ? 'true' : 'false';
  }

  formResetCallback() {
    this.localValue = this.#initialValue;
    this.localInputValue = this.#initialInputValue;
    this.#updateFormValue();
  }

  #updateFormValue() {
    this.#internals.setFormValue(this.localValue.toString());
  }

  #getPercentage(current: number, max: number): number {
    return (100 * current) / max;
  }

  #getStepValue(val: number, min: number, max: number): number {
    return ((val - min) * 100) / (max - min);
  }

  #findAriaTextValue(): string {
    if (!this.areCustomStepsContinuous && this.customSteps) {
      const matchingStep = this.customSteps.find(
        stepObj => stepObj.value === this.localValue
      );
      if (matchingStep) {
        return matchingStep.label;
      }
    }
    // For continuous steps default to showing 2 decimals in tooltip
    return Number(Number(this.localValue).toFixed(2)).toString();
  }

  #handleThumbMouseDown = (e: MouseEvent) => {
    if (this.disabled) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    const isRTL = getComputedStyle(this.railElement!).direction === 'rtl';

    if (isRTL) {
      this.dragStartDiff =
        this.thumbElement!.getBoundingClientRect().right - e.clientX;
    } else {
      this.dragStartDiff =
        e.clientX - this.thumbElement!.getBoundingClientRect().left;
    }

    this.isDragging = true;
    document.addEventListener('mousemove', this.#handleThumbMove);
    document.addEventListener('mouseup', this.#handleThumbDragEnd);
  };

  #handleThumbTouchStart = (e: TouchEvent) => {
    if (this.disabled) {
      return;
    }
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    e.stopPropagation();

    const isRTL = getComputedStyle(this.railElement!).direction === 'rtl';

    if (isRTL) {
      this.dragStartDiff =
        this.thumbElement!.getBoundingClientRect().right - touch.clientX;
    } else {
      this.dragStartDiff =
        touch.clientX - this.thumbElement!.getBoundingClientRect().left;
    }

    this.isDragging = true;
    document.addEventListener('touchmove', this.#handleThumbMove, {
      passive: false,
    });
    document.addEventListener('touchend', this.#handleThumbDragEnd);
    document.addEventListener('touchcancel', this.#handleThumbDragEnd);
  };

  #handleThumbMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragging) {
      return;
    }

    if (e.type === 'touchmove') {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    const touch = 'touches' in e ? e.touches[0] : undefined;
    const clientPosition = touch?.clientX ?? (e as MouseEvent).clientX;
    const isRTL = getComputedStyle(this.railElement!).direction === 'rtl';
    let newPosition: number;

    if (isRTL) {
      newPosition =
        this.railElement!.getBoundingClientRect().right
        - clientPosition
        - this.dragStartDiff;
    } else {
      newPosition =
        clientPosition
        - this.dragStartDiff
        - this.railElement!.getBoundingClientRect().left;
    }

    const end = this.railElement!.offsetWidth - this.thumbElement!.offsetWidth;
    const start = 0;

    if (newPosition < start) {
      newPosition = 0;
    }

    if (newPosition > end) {
      newPosition = end;
    }

    const newPercentage = this.#getPercentage(newPosition, end);

    // Convert percentage to value
    const newValue =
      Math.round(((newPercentage * (this.max - this.min)) / 100 + this.min) * 100) / 100;
    this.localValue = newValue;

    if (!this.customSteps) {
      // Snap to new value if not custom steps
      this.snapValue =
        Math.round((Math.round((newValue - this.min) / this.step) * this.step + this.min) * 100)
        / 100;
      this.localValue = this.snapValue;
    }

    /* If custom steps are discrete, snap to closest step value */
    if (!this.areCustomStepsContinuous && this.customSteps) {
      const steps = this.customSteps;
      const lastStep = steps[steps.length - 1];
      let percentage = newPercentage;
      if (lastStep && lastStep.value !== 100) {
        percentage = (newPercentage * (this.max - this.min)) / 100 + this.min;
      }
      const stepIndex = steps.findIndex(stepObj => stepObj.value >= percentage);
      const currentStep = steps[stepIndex];
      const prevStep = steps[stepIndex - 1];
      if (currentStep && currentStep.value === percentage) {
        this.snapValue = currentStep.value;
      } else if (currentStep && prevStep) {
        const midpoint = (currentStep.value + prevStep.value) / 2;
        if (midpoint > percentage) {
          this.snapValue = prevStep.value;
        } else {
          this.snapValue = currentStep.value;
        }
      } else if (currentStep) {
        this.snapValue = currentStep.value;
      }
      if (this.snapValue !== undefined) {
        this.localValue = this.snapValue;
      }
    }

    // Dispatch change event (without inputValue - only slider changed)
    this.dispatchEvent(
      new Pfv6SliderChangeEvent(
        this.snapValue !== undefined ? this.snapValue : newValue
      )
    );
  };

  #handleThumbDragEnd = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.#handleThumbMove);
    document.removeEventListener('mouseup', this.#handleThumbDragEnd);
    document.removeEventListener('touchmove', this.#handleThumbMove);
    document.removeEventListener('touchend', this.#handleThumbDragEnd);
    document.removeEventListener('touchcancel', this.#handleThumbDragEnd);
  };

  #handleRailClick = (e: MouseEvent) => {
    if (this.disabled) {
      return;
    }
    this.#handleThumbMove(e);
    if (this.snapValue && !this.areCustomStepsContinuous) {
      this.localValue = this.snapValue;
      this.dispatchEvent(new Pfv6SliderChangeEvent(this.snapValue));
    }
  };

  #handleThumbClick = () => {
    if (this.disabled) {
      return;
    }
    this.thumbElement?.focus();
  };

  #handleThumbKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') {
      return;
    }
    e.preventDefault();

    const isRTL = getComputedStyle(this.railElement!).direction === 'rtl';
    let newValue: number = this.localValue;

    if (!this.areCustomStepsContinuous && this.customSteps) {
      const steps = this.customSteps;
      const stepIndex = steps.findIndex(
        stepObj => stepObj.value === this.localValue
      );
      if (key === 'ArrowRight') {
        if (isRTL) {
          const prevStep = steps[stepIndex - 1];
          if (stepIndex - 1 >= 0 && prevStep) {
            newValue = prevStep.value;
          }
        } else {
          const nextStep = steps[stepIndex + 1];
          if (stepIndex + 1 < steps.length && nextStep) {
            newValue = nextStep.value;
          }
        }
      } else if (key === 'ArrowLeft') {
        if (isRTL) {
          const nextStep = steps[stepIndex + 1];
          if (stepIndex + 1 < steps.length && nextStep) {
            newValue = nextStep.value;
          }
        } else {
          const prevStep = steps[stepIndex - 1];
          if (stepIndex - 1 >= 0 && prevStep) {
            newValue = prevStep.value;
          }
        }
      }
    } else {
      if (key === 'ArrowRight') {
        if (isRTL) {
          newValue = this.localValue - this.step >= this.min ?
            this.localValue - this.step
            : this.min;
        } else {
          newValue = this.localValue + this.step <= this.max ?
            this.localValue + this.step
            : this.max;
        }
      } else if (key === 'ArrowLeft') {
        if (isRTL) {
          newValue = this.localValue + this.step <= this.max ?
            this.localValue + this.step
            : this.max;
        } else {
          newValue = this.localValue - this.step >= this.min ?
            this.localValue - this.step
            : this.min;
        }
      }
    }

    if (newValue !== this.localValue) {
      this.localValue = newValue;
      this.dispatchEvent(new Pfv6SliderChangeEvent(newValue));
    }
  };

  #handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.localInputValue = Number(input.value);
  };

  #handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.dispatchEvent(new Pfv6SliderChangeEvent(this.localValue, this.localInputValue));
    }
  };

  #handleInputFocus = (e: Event) => {
    e.stopPropagation();
  };

  #handleInputBlur = () => {
    this.dispatchEvent(new Pfv6SliderChangeEvent(this.localValue, this.localInputValue));
  };

  #buildSteps(): SliderStepObject[] {
    const builtSteps: SliderStepObject[] = [];
    for (let i = this.min; i <= this.max; i = i + this.step) {
      const stepValue = this.#getStepValue(i, this.min, this.max);

      // If boundaries but not ticks just generate the needed steps
      if (!this.showTicks && this.showBoundaries && i !== this.min && i !== this.max) {
        continue;
      }

      builtSteps.push({
        value: stepValue,
        label: i.toString(),
        isLabelHidden: (i === this.min || i === this.max) && this.showBoundaries ? false : true,
      });
    }
    return builtSteps;
  }

  #renderInput() {
    const widthChars = this.localInputValue.toString().length;
    // Calculate width: base + (chars * 1ch)
    // Base is approximately 3.25rem (control padding + spinner width)
    const inputStyle = `--pf-v6-c-form-control--Width: calc(3.25rem + ${widthChars}ch)`;

    const textInput = html`
      <pfv6-text-input style=${inputStyle}>
        <input
          type="number"
          .value=${this.localInputValue.toString()}
          ?disabled=${this.disabled}
          aria-label=${this.accessibleInputLabel}
          @input=${this.#handleInputChange}
          @keydown=${this.#handleInputKeyDown}
          @focus=${this.#handleInputFocus}
          @blur=${this.#handleInputBlur}
        />
      </pfv6-text-input>
    `;

    return this.inputLabel ? html`
      <pfv6-input-group>
        <pfv6-input-group-item is-fill>
          ${textInput}
        </pfv6-input-group-item>
        <pfv6-input-group-text ?is-disabled=${this.disabled}>
          ${this.inputLabel}
        </pfv6-input-group-text>
      </pfv6-input-group>
    ` : textInput;
  }

  #renderThumb(minValue: number, maxValue: number) {
    const thumb = html`
      <div
        id="thumb"
        tabindex=${this.disabled ? -1 : 0}
        role="slider"
        aria-valuemin=${minValue}
        aria-valuemax=${maxValue}
        aria-valuenow=${this.localValue}
        aria-valuetext=${this.#findAriaTextValue()}
        aria-label=${this.accessibleThumbLabel}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @mousedown=${this.#handleThumbMouseDown}
        @touchstart=${this.#handleThumbTouchStart}
        @keydown=${this.#handleThumbKeyDown}
        @click=${this.#handleThumbClick}
      ></div>
    `;

    if (this.hasTooltipOverThumb) {
      return html`
        <pfv6-tooltip
          content=${this.#findAriaTextValue()}
          entry-delay="0"
          class="tabular-nums"
        >
          ${thumb}
        </pfv6-tooltip>
      `;
    }

    return thumb;
  }

  render() {
    const stylePercent = ((this.localValue - this.min) * 100) / (this.max - this.min);
    const widthChars = this.localInputValue.toString().length;
    const containerStyle = `--pf-v6-c-slider--value: ${stylePercent}%; --pf-v6-c-slider__value--c-form-control--width-chars: ${widthChars}`;

    const classes = {
      disabled: this.disabled,
    };

    const customSteps = this.customSteps;
    const firstStep = customSteps?.[0];
    const lastStep = customSteps?.[customSteps.length - 1];
    const minValue = firstStep?.value ?? this.min;
    const maxValue = lastStep?.value ?? this.max;
    const hasCustomSteps = !!(customSteps && firstStep && lastStep);

    const steps = hasCustomSteps ?
      customSteps.map(stepObj => {
        const minVal = firstStep.value;
        const maxVal = lastStep.value;
        const stepValue = this.#getStepValue(stepObj.value, minVal, maxVal);
        return {
          ...stepObj,
          value: stepValue,
        };
      })
      : this.showTicks || this.showBoundaries ?
        this.#buildSteps()
        : [];

    return html`
      <div id="container" class=${classMap(classes)} style=${containerStyle}>
        <slot name="start-actions"></slot>

        <div id="main">
          <div
            id="rail"
            role="none"
            @click=${this.#handleRailClick}
          >
            <div id="track"></div>
          </div>

          ${steps.length > 0 ? html`
            <div id="steps" aria-hidden="true">
              ${repeat(
              steps,
              step => step.value,
              step => html`
                  <pfv6-slider-step
                    .value=${step.value}
                    .label=${step.label}
                    ?is-label-hidden=${step.isLabelHidden ?? false}
                    ?is-tick-hidden=${hasCustomSteps ? false : !this.showTicks}
                    ?is-active=${step.value <= stylePercent}
                  ></pfv6-slider-step>
                `
            )}
            </div>
          ` : null}

          ${this.#renderThumb(minValue, maxValue)}

          ${this.isInputVisible && this.inputPosition === 'aboveThumb' ? html`
            <div id="value" class="floating">
              ${this.#renderInput()}
            </div>
          ` : null}
        </div>

        ${this.isInputVisible && this.inputPosition === 'end' ? html`
          <div id="value">
            ${this.#renderInput()}
          </div>
        ` : null}

        <slot name="end-actions"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-slider': Pfv6Slider;
  }
}
