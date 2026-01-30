import { LitElement, html } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';
import { alertContext, type AlertContext } from './context.js';
import './pfv6-alert-icon.js';
import './pfv6-alert-action-close-button.js';
import './pfv6-alert-action-link.js';
import './pfv6-alert-group.js';
import styles from './pfv6-alert.css';

// Re-export context for consumers
export { alertContext, type AlertContext } from './context.js';

/**
 * Event fired when alert is expanded or collapsed.
 */
export class Pfv6AlertExpandEvent extends Event {
  constructor(
    public expanded: boolean,
    public id?: string,
  ) {
    super('expand', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when alert is closed.
 */
export class Pfv6AlertCloseEvent extends Event {
  constructor(public id?: string) {
    super('close', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when alert timeout completes.
 */
export class Pfv6AlertTimeoutEvent extends Event {
  constructor(public id?: string) {
    super('timeout', { bubbles: true, composed: true });
  }
}

/**
 * Alert component for displaying contextual feedback messages.
 *
 * @alias Alert
 * @summary Alert component for displaying contextual feedback messages.
 * @fires Pfv6AlertExpandEvent - Fired when alert expansion state changes
 * @fires Pfv6AlertCloseEvent - Fired when alert close button is clicked
 * @fires Pfv6AlertTimeoutEvent - Fired when alert timeout completes
 * @slot - Alert description content
 * @slot action-close - Close button (use pfv6-alert-action-close-button)
 * @slot action-links - Action links (use pfv6-alert-action-link)
 * @cssprop --pf-v6-c-alert--BackgroundColor - Alert background color
 * @cssprop --pf-v6-c-alert--BorderColor - Alert border color
 * @cssprop --pf-v6-c-alert--BorderRadius - Alert border radius
 * @cssprop --pf-v6-c-alert--BorderWidth - Alert border width
 * @cssprop --pf-v6-c-alert--BoxShadow - Alert box shadow
 * @cssprop --pf-v6-c-alert--FontSize - Alert font size
 * @cssprop --pf-v6-c-alert--GridTemplateAreas - Alert grid template areas
 * @cssprop --pf-v6-c-alert--GridTemplateColumns - Alert grid template columns
 * @cssprop --pf-v6-c-alert--PaddingBlockEnd - Alert padding block end
 * @cssprop --pf-v6-c-alert--PaddingBlockStart - Alert padding block start
 * @cssprop --pf-v6-c-alert--PaddingInlineEnd - Alert padding inline end
 * @cssprop --pf-v6-c-alert--PaddingInlineStart - Alert padding inline start
 * @cssprop --pf-v6-c-alert__action--MarginBlockEnd - Action margin block end
 * @cssprop --pf-v6-c-alert__action--MarginBlockStart - Action margin block start
 * @cssprop --pf-v6-c-alert__action--MarginInlineEnd - Action margin inline end
 * @cssprop --pf-v6-c-alert__action--TranslateY - Action translate Y
 * @cssprop --pf-v6-c-alert__action-group--PaddingBlockStart - Action group padding
 * @cssprop --pf-v6-c-alert__description--PaddingBlockStart - Description padding
 * @cssprop --pf-v6-c-alert__icon--Color - Icon color
 * @cssprop --pf-v6-c-alert__icon--FontSize - Icon font size
 * @cssprop --pf-v6-c-alert__icon--MarginBlockStart - Icon margin block start
 * @cssprop --pf-v6-c-alert__icon--MarginInlineEnd - Icon margin inline end
 * @cssprop --pf-v6-c-alert__title--Color - Title color
 * @cssprop --pf-v6-c-alert__title--FontWeight - Title font weight
 * @cssprop --pf-v6-c-alert__title--max-lines - Maximum lines for title
 * @cssprop --pf-v6-c-alert__toggle--MarginBlockEnd - Toggle margin block end
 * @cssprop --pf-v6-c-alert__toggle--MarginBlockStart - Toggle margin block start
 * @cssprop --pf-v6-c-alert__toggle--MarginInlineEnd - Toggle margin inline end
 * @cssprop --pf-v6-c-alert__toggle--MarginInlineStart - Toggle margin inline start
 * @cssprop --pf-v6-c-alert__toggle-icon--Rotate - Toggle icon rotation
 * @cssprop --pf-v6-c-alert__toggle-icon--TransitionDuration - Toggle transition
 * @cssprop --pf-v6-c-alert--m-custom--BorderColor - Custom variant border color
 * @cssprop --pf-v6-c-alert--m-custom__icon--Color - Custom variant icon color
 * @cssprop --pf-v6-c-alert--m-custom__title--Color - Custom variant title color
 * @cssprop --pf-v6-c-alert--m-danger--BorderColor - Danger variant border color
 * @cssprop --pf-v6-c-alert--m-danger__icon--Color - Danger variant icon color
 * @cssprop --pf-v6-c-alert--m-danger__title--Color - Danger variant title color
 * @cssprop --pf-v6-c-alert--m-info--BorderColor - Info variant border color
 * @cssprop --pf-v6-c-alert--m-info__icon--Color - Info variant icon color
 * @cssprop --pf-v6-c-alert--m-info__title--Color - Info variant title color
 * @cssprop --pf-v6-c-alert--m-success--BorderColor - Success variant border color
 * @cssprop --pf-v6-c-alert--m-success__icon--Color - Success variant icon color
 * @cssprop --pf-v6-c-alert--m-success__title--Color - Success variant title color
 * @cssprop --pf-v6-c-alert--m-warning--BorderColor - Warning variant border color
 * @cssprop --pf-v6-c-alert--m-warning__icon--Color - Warning variant icon color
 * @cssprop --pf-v6-c-alert--m-warning__title--Color - Warning variant title color
 * @cssprop --pf-v6-c-alert--m-inline--BackgroundColor - Inline background color
 * @cssprop --pf-v6-c-alert--m-inline--BoxShadow - Inline box shadow
 */
@customElement('pfv6-alert')
export class Pfv6Alert extends LitElement {
  static styles = styles;

  /** Alert variant */
  @property({ type: String, reflect: true })
  variant: 'success' | 'danger' | 'warning' | 'info' | 'custom' = 'custom';

  /** Alert title */
  @property({ type: String })
  title = '';

  /** Whether alert is inline */
  @property({ type: Boolean, reflect: true, attribute: 'is-inline' })
  isInline = false;

  /** Whether alert is plain */
  @property({ type: Boolean, reflect: true, attribute: 'is-plain' })
  isPlain = false;

  /** Whether alert is in a live region */
  @property({ type: Boolean, reflect: true, attribute: 'is-live-region' })
  isLiveRegion = false;

  /** Whether alert is expandable */
  @property({ type: Boolean, reflect: true, attribute: 'is-expandable' })
  isExpandable = false;

  /** Variant label text for screen readers */
  @property({ type: String, attribute: 'variant-label' })
  variantLabel?: string | undefined;

  /** Accessible label for toggle button */
  @property({ type: String, attribute: 'toggle-accessible-label' })
  toggleAccessibleLabel?: string | undefined;

  /** Truncate title to number of lines */
  @property({ type: Number, attribute: 'truncate-title' })
  truncateTitle = 0;

  /** Timeout in milliseconds. Set to 8000 for default timeout behavior. */
  @property({ type: Number })
  timeout = 0;

  /** Timeout animation duration in milliseconds */
  @property({ type: Number, attribute: 'timeout-animation' })
  timeoutAnimation = 3000;

  /** Tooltip position for truncated title */
  @property({ type: String, attribute: 'tooltip-position' })
  tooltipPosition?: 'auto' | 'top' | 'bottom' | 'left' | 'right'
    | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
    | 'left-start' | 'left-end' | 'right-start' | 'right-end' | undefined;

  /** Title heading level */
  @property({ type: String })
  component: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h4';

  /**
   * Animation state when inside alert-group (managed by parent).
   * This is an additional API not present in React - see README.md.
   */
  @property({ type: String, reflect: true })
  animation?: 'incoming' | 'outgoing' | undefined;

  /** Whether alert is expanded */
  @state()
  private isExpanded = false;

  /** Whether timeout has completed */
  @state()
  private timedOut = false;

  /** Whether timeout animation has completed */
  @state()
  private timedOutAnimation = true;

  /** Whether mouse is over alert */
  @state()
  private isMouseOver = false;

  /** Whether alert contains focus */
  @state()
  private containsFocus = false;

  /** Whether alert is dismissed */
  @state()
  private isDismissed = false;

  /** Whether tooltip should be visible */
  @state()
  private isTooltipVisible = false;

  /** Whether default slot has content */
  @state()
  private hasDescription = false;

  /** Whether action-links slot has content */
  @state()
  private hasActionLinks = false;

  private timeoutTimer: number | undefined;
  private animationTimer: number | undefined;

  // Provide context to sub-components
  @provide({ context: alertContext })
  @state()
  protected _context: AlertContext = this.#createAlertContext();

  #createAlertContext(): AlertContext {
    const capitalizedVariant = this.variant.charAt(0).toUpperCase() + this.variant.slice(1);
    return {
      title: this.title,
      variantLabel: this.variantLabel || `${capitalizedVariant} alert:`,
    };
  }

  override connectedCallback() {
    super.connectedCallback();

    // Setup timeout if configured
    if (this.timeout > 0) {
      this.timeoutTimer = window.setTimeout(() => {
        this.timedOut = true;
      }, this.timeout);
    }

    // Setup focus tracking via focusin/focusout (composes through shadow boundaries)
    this.addEventListener('focusin', this.#handleFocusIn);
    this.addEventListener('focusout', this.#handleFocusOut);

    // Listen for close events from action-close slot
    this.addEventListener('close', this.#handleClose);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }

    this.removeEventListener('focusin', this.#handleFocusIn);
    this.removeEventListener('focusout', this.#handleFocusOut);
    this.removeEventListener('close', this.#handleClose);
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Update context when relevant properties change
    if (changedProperties.has('title')
        || changedProperties.has('variant')
        || changedProperties.has('variantLabel')) {
      this._context = this.#createAlertContext();
    }

    // Check for title truncation
    if (changedProperties.has('title') || changedProperties.has('truncateTitle')) {
      this.#checkTruncation();
    }

    // Handle timeout property changes (matches React useEffect behavior)
    if (changedProperties.has('timeout')) {
      // Clear existing timer
      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = undefined;
      }
      // Reset timedOut state and start new timer if timeout > 0
      this.timedOut = false;
      if (this.timeout > 0) {
        this.timeoutTimer = window.setTimeout(() => {
          this.timedOut = true;
        }, this.timeout);
      }
    }

    // Handle timeout animation
    if (changedProperties.has('containsFocus')
        || changedProperties.has('isMouseOver')
        || changedProperties.has('timeoutAnimation')) {
      if (!this.containsFocus && !this.isMouseOver) {
        this.animationTimer = window.setTimeout(() => {
          this.timedOutAnimation = true;
        }, this.timeoutAnimation);
      } else {
        if (this.animationTimer) {
          clearTimeout(this.animationTimer);
        }
        this.timedOutAnimation = false;
      }
    }

    // Check if should dismiss
    if (changedProperties.has('timedOut')
        || changedProperties.has('timedOutAnimation')
        || changedProperties.has('isMouseOver')
        || changedProperties.has('containsFocus')) {
      const shouldDismiss = this.timedOut && this.timedOutAnimation
        && !this.isMouseOver && !this.containsFocus;
      if (shouldDismiss && !this.isDismissed) {
        this.isDismissed = true;
        this.dispatchEvent(new Pfv6AlertTimeoutEvent(this.id));
      }
    }
  }

  #handleFocusIn = () => {
    this.containsFocus = true;
    this.timedOutAnimation = false;
  };

  #handleFocusOut = (event: FocusEvent) => {
    // Only clear focus if the new focus target is outside the component
    if (!this.contains(event.relatedTarget as Node)) {
      this.containsFocus = false;
    }
  };

  #checkTruncation() {
    if (!this.truncateTitle) {
      this.isTooltipVisible = false;
      return;
    }

    const titleElement = this.shadowRoot?.querySelector('#title') as HTMLElement;
    if (titleElement) {
      const cssVar = '--pf-v6-c-alert__title--max-lines';
      titleElement.style.setProperty(cssVar, this.truncateTitle.toString());
      const showTooltip = titleElement.offsetHeight < titleElement.scrollHeight;
      this.isTooltipVisible = showTooltip;
    }
  }

  #handleToggleExpand = () => {
    this.isExpanded = !this.isExpanded;
    this.dispatchEvent(new Pfv6AlertExpandEvent(this.isExpanded, this.id));
  };

  #handleMouseEnter = () => {
    this.isMouseOver = true;
    this.timedOutAnimation = false;
  };

  #handleMouseLeave = () => {
    this.isMouseOver = false;
  };

  #handleClose = (event: Event) => {
    // Ignore our own Pfv6AlertCloseEvent to prevent infinite recursion
    if (event instanceof Pfv6AlertCloseEvent) {
      return;
    }
    // Stop the internal close event from escaping
    event.stopPropagation();
    // Dispatch the public close event
    this.dispatchEvent(new Pfv6AlertCloseEvent(this.id));
  };

  #handleDescriptionSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this.hasDescription = nodes.some(
      node => node.nodeType === Node.ELEMENT_NODE
        || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
    );
  };

  #handleActionLinksSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this.hasActionLinks = nodes.some(
      node => node.nodeType === Node.ELEMENT_NODE
        || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
    );
  };

  #renderTitle(): TemplateResult {
    const capitalizedVariant = this.variant.charAt(0).toUpperCase() + this.variant.slice(1);
    const variantLabelText = this.variantLabel || `${capitalizedVariant} alert:`;

    const titleClasses = {
      truncate: this.truncateTitle > 0,
    };

    const titleContent = html`<span class="screen-reader">${variantLabelText}</span>${this.title}`;

    // Dynamic heading level based on component property
    switch (this.component) {
      case 'h1':
        return html`<h1 id="title" class=${classMap(titleClasses)} tabindex=${this.isTooltipVisible ? 0 : -1}>${titleContent}</h1>`;
      case 'h2':
        return html`<h2 id="title" class=${classMap(titleClasses)} tabindex=${this.isTooltipVisible ? 0 : -1}>${titleContent}</h2>`;
      case 'h3':
        return html`<h3 id="title" class=${classMap(titleClasses)} tabindex=${this.isTooltipVisible ? 0 : -1}>${titleContent}</h3>`;
      case 'h5':
        return html`<h5 id="title" class=${classMap(titleClasses)} tabindex=${this.isTooltipVisible ? 0 : -1}>${titleContent}</h5>`;
      case 'h6':
        return html`<h6 id="title" class=${classMap(titleClasses)} tabindex=${this.isTooltipVisible ? 0 : -1}>${titleContent}</h6>`;
      default:
        return html`<h4 id="title" class=${classMap(titleClasses)} tabindex=${this.isTooltipVisible ? 0 : -1}>${titleContent}</h4>`;
    }
  }

  render() {
    // Don't render if dismissed
    if (this.isDismissed) {
      return null;
    }

    const classes = {
      inline: this.isInline,
      plain: this.isPlain,
      expandable: this.isExpandable,
      expanded: this.isExpanded,
      [this.variant]: true,
    };

    return html`
      <div
        id="container"
        class=${classMap(classes)}
        @mouseenter=${this.#handleMouseEnter}
        @mouseleave=${this.#handleMouseLeave}
        aria-live=${ifDefined(this.isLiveRegion ? 'polite' : undefined)}
        aria-atomic=${ifDefined(this.isLiveRegion ? 'false' : undefined)}
      >
        ${this.isExpandable ? html`
          <div id="toggle">
            <button
              id="toggle-button"
              type="button"
              aria-expanded=${this.isExpanded}
              aria-label=${this.toggleAccessibleLabel || `Toggle ${this.variantLabel || this.variant} alert: ${this.title}`}
              @click=${this.#handleToggleExpand}
            >
              <span id="toggle-icon">
                <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 320 512" aria-hidden="true">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                </svg>
              </span>
            </button>
          </div>
        ` : null}

        <pfv6-alert-icon variant=${this.variant}></pfv6-alert-icon>

        ${this.#renderTitle()}

        <slot name="action-close"></slot>

        ${!this.isExpandable || this.isExpanded ? html`
          <div id="description" ?hidden=${!this.hasDescription}>
            <slot @slotchange=${this.#handleDescriptionSlotChange}></slot>
          </div>
        ` : null}

        <div id="action-group" ?hidden=${!this.hasActionLinks}>
          <slot name="action-links" @slotchange=${this.#handleActionLinksSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-alert': Pfv6Alert;
  }
}
