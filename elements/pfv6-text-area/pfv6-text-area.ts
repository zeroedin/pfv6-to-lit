import { LitElement, html } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-text-area.css';

/**
 * Text area component for multi-line text input with validation states.
 *
 * This component wraps a native `<textarea>` element (provided via slot) and adds
 * PatternFly styling, validation icons, and auto-resize functionality.
 *
 * @summary Multi-line text input with validation and auto-resize
 * @alias TextArea
 *
 * @slot textarea - Slot for the native `<textarea>` element (required)
 *
 * @cssprop [--pf-v6-c-form-control--Color=#151515] - Text color
 * @cssprop [--pf-v6-c-form-control--FontSize=0.875rem] - Font size
 * @cssprop [--pf-v6-c-form-control--LineHeight=1.5] - Line height
 * @cssprop [--pf-v6-c-form-control--BorderRadius=6px] - Border radius
 * @cssprop [--pf-v6-c-form-control--BackgroundColor=#ffffff] - Background color
 * @cssprop [--pf-v6-c-form-control--before--BorderWidth=1px] - Border width
 * @cssprop [--pf-v6-c-form-control--before--BorderColor=#c7c7c7] - Border color
 * @cssprop [--pf-v6-c-form-control--PaddingBlockStart--base=0.5rem] - Top padding
 * @cssprop [--pf-v6-c-form-control--PaddingBlockEnd--base=0.5rem] - Bottom padding
 * @cssprop [--pf-v6-c-form-control--PaddingInlineStart--base=1rem] - Left padding
 * @cssprop [--pf-v6-c-form-control--PaddingInlineEnd--base=1rem] - Right padding
 * @cssprop [--pf-v6-c-form-control--hover--after--BorderColor=#4394e5] - Hover border color
 * @cssprop [--pf-v6-c-form-control--m-success--after--BorderColor=#3d7317] - Success state border color
 * @cssprop [--pf-v6-c-form-control--m-warning--after--BorderColor=#f8ae54] - Warning state border color
 * @cssprop [--pf-v6-c-form-control--m-error--after--BorderColor=#b1380b] - Error state border color
 * @cssprop [--pf-v6-c-form-control--m-disabled--Color=#707070] - Disabled text color
 * @cssprop [--pf-v6-c-form-control--m-disabled--BackgroundColor=#c7c7c7] - Disabled background color
 * @cssprop [--pf-v6-c-form-control--m-readonly--BackgroundColor=#f2f2f2] - Read-only background color
 * @cssprop [--pf-v6-c-form-control--m-readonly--BorderColor=#e0e0e0] - Read-only border color
 * @cssprop [--pf-v6-c-form-control--m-readonly--m-plain--BackgroundColor=transparent] - Plain read-only background
 * @cssprop [--pf-v6-c-form-control--m-readonly--m-plain--BorderColor=transparent] - Plain read-only border
 * @cssprop [--pf-v6-c-form-control--m-resize-vertical--resize=vertical] - Vertical resize mode
 * @cssprop [--pf-v6-c-form-control--m-resize-horizontal--resize=horizontal] - Horizontal resize mode
 * @cssprop [--pf-v6-c-form-control--m-resize-both--resize=both] - Both directions resize mode
 * @cssprop [--pf-v6-c-form-control__icon--FontSize=0.875rem] - Icon font size
 * @cssprop [--pf-v6-c-form-control--m-success__icon--m-status--Color=#3d7317] - Success icon color
 * @cssprop [--pf-v6-c-form-control--m-warning__icon--m-status--Color=#f8ae54] - Warning icon color
 * @cssprop [--pf-v6-c-form-control--m-error__icon--m-status--Color=#b1380b] - Error icon color
 */
@customElement('pfv6-text-area')
export class Pfv6TextArea extends LitElement {
  static styles = styles;

  /**
   * Value to indicate if the text area is modified to show that validation state.
   * If set to success, text area will be modified to indicate valid state.
   * If set to error, text area will be modified to indicate error state.
   */
  @property({ type: String, reflect: true })
  validated: 'success' | 'warning' | 'error' | 'default' = 'default';

  /**
   * Read only variant.
   */
  @property({ type: String, reflect: true, attribute: 'read-only-variant' })
  readOnlyVariant?: 'default' | 'plain';

  /**
   * Flag to modify height based on contents.
   */
  @property({ type: Boolean, reflect: true, attribute: 'auto-resize' })
  autoResize = false;

  /**
   * Sets the orientation to limit the resize to.
   */
  @property({ type: String, reflect: true, attribute: 'resize-orientation' })
  resizeOrientation: 'horizontal' | 'vertical' | 'both' | 'none' = 'both';

  /**
   * Custom accessible label for the text area (fallback if no visual label).
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  @state()
  private _textareaElement: HTMLTextAreaElement | null = null;

  /** Internal state tracking if slotted textarea is disabled */
  @state()
  private _isDisabled = false;

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Apply accessible-label to slotted textarea if provided
    if (changedProperties.has('accessibleLabel')) {
      if (this._textareaElement) {
        if (this.accessibleLabel) {
          this._textareaElement.setAttribute('aria-label', this.accessibleLabel);
        } else {
          this._textareaElement.removeAttribute('aria-label');
        }
      }
    }

    // Apply validated state to slotted textarea
    if (changedProperties.has('validated')) {
      if (this._textareaElement) {
        this._textareaElement.setAttribute(
          'aria-invalid',
          this.validated === 'error' ? 'true' : 'false'
        );
      }
    }
  }

  #handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const elements = slot.assignedElements({ flatten: true });
    const textarea = elements.find(
      el => el.tagName === 'TEXTAREA',
    ) as HTMLTextAreaElement | undefined;

    if (textarea) {
      this._textareaElement = textarea;

      // Detect disabled state from slotted textarea
      this._isDisabled = textarea.disabled;

      // Apply initial aria-invalid state
      textarea.setAttribute('aria-invalid', this.validated === 'error' ? 'true' : 'false');

      // Apply accessible-label if provided
      if (this.accessibleLabel) {
        textarea.setAttribute('aria-label', this.accessibleLabel);
      }

      // Auto-resize setup
      if (this.autoResize) {
        this.#setAutoHeight(textarea);
        // Listen for input events to resize on content change
        textarea.addEventListener('input', this.#handleTextareaInput);
      }
    } else {
      console.error('pfv6-text-area: requires a <textarea> element in the textarea slot');
      this._textareaElement = null;
      this._isDisabled = false;
    }
  };

  #handleTextareaInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    if (this.autoResize) {
      this.#setAutoHeight(textarea);
    }
  };

  #setAutoHeight = (textarea: HTMLTextAreaElement) => {
    const container = this.shadowRoot?.getElementById('container');
    if (!container) {
      return;
    }

    // Reset height to recalculate
    container.style.setProperty('height', 'inherit');

    const computed = window.getComputedStyle(textarea);
    const containerComputed = window.getComputedStyle(container);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue('border-top-width'))
      + textarea.scrollHeight
      + parseInt(computed.getPropertyValue('border-bottom-width'))
      + parseInt(containerComputed.getPropertyValue('padding-top'))
      + parseInt(containerComputed.getPropertyValue('padding-bottom'));

    container.style.setProperty('height', `${height}px`);
  };

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up event listener
    if (this._textareaElement) {
      this._textareaElement.removeEventListener('input', this.#handleTextareaInput);
    }
  }

  #renderStatusIcon(): TemplateResult | null {
    const hasStatusIcon = ['success', 'error', 'warning'].includes(this.validated);

    if (!hasStatusIcon) {
      return null;
    }

    // Icon SVG paths from PatternFly icons
    /* eslint-disable @stylistic/max-len */
    const iconPaths = {
      success: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 14.5L6 12l1.5-1.5L11 14l6.5-6.5L19 9l-8.5 8.5z',
      warning: 'M12 2L2 22h20L12 2zm-1 7h2v6h-2V9zm0 8h2v2h-2v-2z',
      error: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
    };
    /* eslint-enable @stylistic/max-len */

    const validatedState = this.validated as 'success' | 'warning' | 'error';
    const iconPath = iconPaths[validatedState];
    const iconLabel = {
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
    }[validatedState];

    return html`
      <span id="utilities">
        <span id="icon" class="status">
          <svg
            fill="currentColor"
            height="1em"
            width="1em"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
            aria-label=${ifDefined(iconLabel)}
          >
            <path d=${iconPath}></path>
          </svg>
        </span>
      </span>
    `;
  }

  render() {
    const orientation =
      this.resizeOrientation !== 'none' ?
        `resize-${this.resizeOrientation}`
        : undefined;

    const classes = {
      disabled: this._isDisabled,
      readonly: !!this.readOnlyVariant,
      plain: this.readOnlyVariant === 'plain',
      success: this.validated === 'success',
      warning: this.validated === 'warning',
      error: this.validated === 'error',
      [`${orientation}`]: !!orientation,
    };

    return html`
      <span id="container" class=${classMap(classes)}>
        <slot name="textarea" @slotchange=${this.#handleSlotChange}></slot>
        ${this.#renderStatusIcon()}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-text-area': Pfv6TextArea;
  }
}
