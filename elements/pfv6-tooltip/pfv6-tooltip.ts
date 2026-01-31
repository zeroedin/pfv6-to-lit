import { LitElement, html } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { query } from 'lit/decorators/query.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  computePosition,
  flip,
  shift,
  offset,
  autoPlacement,
  type Placement,
  type Middleware,
} from '@floating-ui/dom';
import styles from './pfv6-tooltip.css';

/**
 * Tooltip component that displays contextual information on trigger element hover, focus, or click.
 *
 * @summary Provides tooltips for elements using Floating UI positioning
 * @slot - Trigger element that shows the tooltip on interaction
 * @fires tooltip-hidden - Dispatched after tooltip hide animation completes
 * @cssprop --pf-v6-c-tooltip--MaxWidth - Maximum width of tooltip (default: 18.75rem)
 * @cssprop --pf-v6-c-tooltip--BoxShadow - Box shadow of tooltip
 * @cssprop --pf-v6-c-tooltip__content--PaddingBlockStart - Top padding of content
 * @cssprop --pf-v6-c-tooltip__content--PaddingInlineEnd - Right padding of content
 * @cssprop --pf-v6-c-tooltip__content--PaddingBlockEnd - Bottom padding of content
 * @cssprop --pf-v6-c-tooltip__content--PaddingInlineStart - Left padding of content
 * @cssprop --pf-v6-c-tooltip__content--Color - Text color of content
 * @cssprop --pf-v6-c-tooltip__content--BackgroundColor - Background color of content
 * @cssprop --pf-v6-c-tooltip__content--FontSize - Font size of content
 * @cssprop --pf-v6-c-tooltip__content--BorderRadius - Border radius of content
 * @cssprop --pf-v6-c-tooltip__arrow--Width - Width of arrow
 * @cssprop --pf-v6-c-tooltip__arrow--Height - Height of arrow
 * @cssprop --pf-v6-c-tooltip__arrow--BackgroundColor - Background color of arrow
 * @cssprop --pf-v6-c-tooltip__arrow--m-top--TranslateX - Arrow X translation for top position
 * @cssprop --pf-v6-c-tooltip__arrow--m-top--TranslateY - Arrow Y translation for top position
 * @cssprop --pf-v6-c-tooltip__arrow--m-top--Rotate - Arrow rotation for top position
 * @cssprop --pf-v6-c-tooltip__arrow--m-right--TranslateX - Arrow X translation for right position
 * @cssprop --pf-v6-c-tooltip__arrow--m-right--TranslateY - Arrow Y translation for right position
 * @cssprop --pf-v6-c-tooltip__arrow--m-right--Rotate - Arrow rotation for right position
 * @cssprop --pf-v6-c-tooltip__arrow--m-bottom--TranslateX - Arrow X translation for bottom position
 * @cssprop --pf-v6-c-tooltip__arrow--m-bottom--TranslateY - Arrow Y translation for bottom position
 * @cssprop --pf-v6-c-tooltip__arrow--m-bottom--Rotate - Arrow rotation for bottom position
 * @cssprop --pf-v6-c-tooltip__arrow--m-left--TranslateX - Arrow X translation for left position
 * @cssprop --pf-v6-c-tooltip__arrow--m-left--TranslateY - Arrow Y translation for left position
 * @cssprop --pf-v6-c-tooltip__arrow--m-left--Rotate - Arrow rotation for left position
 */
@customElement('pfv6-tooltip')
export class Pfv6Tooltip extends LitElement {
  static styles = styles;

  /** Track all tooltip instances for global keyboard handling */
  private static instances = new Set<Pfv6Tooltip>();

  /** ElementInternals for host-level ARIA */
  #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** Tooltip content text */
  @property({ type: String })
  content = '';

  /** Tooltip position */
  @property({ type: String })
  position: 'auto' | Placement = 'top';

  /** Distance of the tooltip from its trigger element (in pixels) */
  @property({ type: Number })
  distance = 15;

  /** If true, tries to keep the tooltip in view by flipping it if necessary */
  @property({ type: Boolean, reflect: true, attribute: 'enable-flip' })
  enableFlip = true;

  /** Delay in milliseconds before the tooltip appears */
  @property({ type: Number, attribute: 'entry-delay' })
  entryDelay = 300;

  /** Delay in milliseconds before the tooltip disappears */
  @property({ type: Number, attribute: 'exit-delay' })
  exitDelay = 300;

  /**
  * Tooltip trigger events: mouseenter, focus, click, or manual
  * Can be space-separated combination (e.g., "mouseenter focus")
  * Set to "manual" to control visibility programmatically via isVisible property
  */
  @property({ type: String })
  trigger = 'mouseenter focus';

  /** Flag to indicate that the text content is left aligned */
  @property({ type: Boolean, reflect: true, attribute: 'is-content-left-aligned' })
  isContentLeftAligned = false;

  /** Visibility when trigger is 'manual' */
  @property({ type: Boolean, reflect: true, attribute: 'is-visible' })
  isVisible = false;

  /** Maximum width of the tooltip */
  @property({ type: String, attribute: 'max-width' })
  maxWidth = '18.75rem';

  /** Minimum width of the tooltip */
  @property({ type: String, attribute: 'min-width' })
  minWidth?: string | undefined;

  /** Z-index of the tooltip */
  @property({ type: Number, attribute: 'z-index' })
  zIndex = 9999;

  /** CSS fade transition animation duration in milliseconds */
  @property({ type: Number, attribute: 'animation-duration' })
  animationDuration = 300;

  /**
  * When true, disables screen reader announcements for tooltip content.
  * Use when the trigger element already has an accessible label.
  */
  @property({ type: Boolean, reflect: true })
  silent = false;

  /** ID of an external trigger element (alternative to slotted trigger) */
  @property({ type: String, attribute: 'trigger-id' })
  triggerId?: string | undefined;

  /** Internal visibility state */
  @state()
  private _visible = false;

  /** Current placement after Floating UI calculations */
  @state()
  private _currentPlacement: Placement = 'top';

  /** Tooltip element reference */
  @query('#tooltip')
  private _tooltipElement!: HTMLElement;

  /** Trigger element reference */
  private _triggerElement: HTMLElement | null = null;

  /** Entry timeout ID */
  private _entryTimeoutId: number | undefined;

  /** Exit timeout ID */
  private _exitTimeoutId: number | undefined;

  /** Hide timeout ID (for animation) */
  private _hideTimeoutId: number | undefined;

  /** Cleanup function for Floating UI */
  private _cleanupFloating?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    // Set initial ariaLive value based on silent prop
    this.#internals.ariaLive = this.silent ? 'off' : 'polite';
    this._setupTriggerElement();
    Pfv6Tooltip.instances.add(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupEventListeners();
    this._clearTimeouts();
    this._cleanupFloating?.();
    Pfv6Tooltip.instances.delete(this);
  }

  updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    // Update ariaLive when silent prop changes
    if (changedProperties.has('silent')) {
      this.#internals.ariaLive = this.silent ? 'off' : 'polite';
    }

    if (changedProperties.has('isVisible')) {
      if (this.trigger === 'manual') {
        if (this.isVisible) {
          this._show();
        } else {
          this._hide();
        }
      }
    }

    if (changedProperties.has('trigger') || changedProperties.has('triggerId')) {
      this._cleanupEventListeners();
      this._setupTriggerElement();
    }

    if (this._visible && this._triggerElement) {
      this._updatePosition();
    }
  }

  private _setupTriggerElement(): void {
    // First try external trigger via ID
    if (this.triggerId) {
      const externalTrigger = document.getElementById(this.triggerId);
      if (externalTrigger) {
        this._triggerElement = externalTrigger;
        this._setupEventListeners();
        return;
      }
    }

    // Fall back to slotted trigger element
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    if (slot) {
      const elements = slot.assignedElements();
      if (elements.length > 0) {
        this._triggerElement = elements[0] as HTMLElement;
        this._setupEventListeners();
      }
    }
  }

  private _setupEventListeners(): void {
    if (!this._triggerElement || this.trigger === 'manual') {
      return;
    }

    const triggerOnMouseenter = this.trigger.includes('mouseenter');
    const triggerOnFocus = this.trigger.includes('focus');
    const triggerOnClick = this.trigger.includes('click');

    if (triggerOnMouseenter) {
      this._triggerElement.addEventListener('mouseenter', this._handleMouseEnter);
      this._triggerElement.addEventListener('mouseleave', this._handleMouseLeave);
      // Also handle tooltip element hover
      if (this._tooltipElement) {
        this._tooltipElement.addEventListener('mouseenter', this._handleTooltipMouseEnter);
        this._tooltipElement.addEventListener('mouseleave', this._handleTooltipMouseLeave);
      }
    }

    if (triggerOnFocus) {
      this._triggerElement.addEventListener('focus', this._handleFocus);
      this._triggerElement.addEventListener('blur', this._handleBlur);
    }

    if (triggerOnClick) {
      document.addEventListener('click', this._handleDocumentClick);
    }

    // Always listen for Escape key
    document.addEventListener('keydown', this._handleKeyDown);
  }

  private _cleanupEventListeners(): void {
    if (this._triggerElement) {
      this._triggerElement.removeEventListener('mouseenter', this._handleMouseEnter);
      this._triggerElement.removeEventListener('mouseleave', this._handleMouseLeave);
      this._triggerElement.removeEventListener('focus', this._handleFocus);
      this._triggerElement.removeEventListener('blur', this._handleBlur);
    }

    if (this._tooltipElement) {
      this._tooltipElement.removeEventListener('mouseenter', this._handleTooltipMouseEnter);
      this._tooltipElement.removeEventListener('mouseleave', this._handleTooltipMouseLeave);
    }

    document.removeEventListener('click', this._handleDocumentClick);
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  private _handleMouseEnter = (): void => {
    this._clearExitTimeout();
    this._entryTimeoutId = window.setTimeout(() => {
      this._show();
    }, this.entryDelay);
  };

  private _handleMouseLeave = (): void => {
    this._clearEntryTimeout();
    this._exitTimeoutId = window.setTimeout(() => {
      this._hide();
    }, this.exitDelay);
  };

  private _handleTooltipMouseEnter = (): void => {
    this._clearExitTimeout();
  };

  private _handleTooltipMouseLeave = (): void => {
    this._exitTimeoutId = window.setTimeout(() => {
      this._hide();
    }, this.exitDelay);
  };

  private _handleFocus = (): void => {
    this._clearExitTimeout();
    this._entryTimeoutId = window.setTimeout(() => {
      this._show();
    }, this.entryDelay);
  };

  private _handleBlur = (): void => {
    this._clearEntryTimeout();
    this._exitTimeoutId = window.setTimeout(() => {
      this._hide();
    }, this.exitDelay);
  };

  private _handleDocumentClick = (event: MouseEvent): void => {
    const target = event.target as Node;
    if (this._triggerElement?.contains(target)) {
      if (this._visible) {
        this._hide();
      } else {
        this._show();
      }
    } else if (this._visible && !this._tooltipElement?.contains(target)) {
      this._hide();
    }
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this._visible) {
      this._hide();
    }
    if (event.key === 'Enter' && this._triggerElement?.contains(event.target as Node)) {
      if (!this._visible) {
        this._show();
      } else {
        this._hide();
      }
    }
  };

  private _clearTimeouts(): void {
    this._clearEntryTimeout();
    this._clearExitTimeout();
    this._clearHideTimeout();
  }

  private _clearEntryTimeout(): void {
    if (this._entryTimeoutId !== undefined) {
      clearTimeout(this._entryTimeoutId);
      this._entryTimeoutId = undefined;
    }
  }

  private _clearExitTimeout(): void {
    if (this._exitTimeoutId !== undefined) {
      clearTimeout(this._exitTimeoutId);
      this._exitTimeoutId = undefined;
    }
  }

  private _clearHideTimeout(): void {
    if (this._hideTimeoutId !== undefined) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = undefined;
    }
  }

  private async _show(): Promise<void> {
    this._clearHideTimeout();
    this._visible = true;
    this.requestUpdate();
    await this.updateComplete;
    this._updatePosition();
    // Setup Floating UI auto-update
    this._setupFloatingAutoUpdate();
    // Screen reader announcements are now handled automatically via
    // ElementInternals.ariaLive on the host element
  }

  private _hide(): void {
    this._visible = false;
    this._cleanupFloating?.();

    // Dispatch event after animation completes
    this._hideTimeoutId = window.setTimeout(() => {
      this.dispatchEvent(new Event('tooltip-hidden', { bubbles: true, composed: true }));
    }, this.animationDuration);
  }

  private async _updatePosition(): Promise<void> {
    if (!this._triggerElement || !this._tooltipElement) {
      return;
    }

    const middleware: Middleware[] = [
      offset(this.distance),
    ];

    if (this.position === 'auto' && this.enableFlip) {
      middleware.push(autoPlacement());
    } else {
      if (this.enableFlip) {
        middleware.push(flip());
      }
    }

    middleware.push(shift({ padding: 5 }));
    // Note: Arrow positioning is handled via CSS based on placement classes,
    // matching React's approach. We don't use Floating UI's arrow middleware.

    const options: { middleware: Middleware[]; placement?: Placement } = {
      middleware,
    };
    if (this.position !== 'auto') {
      options.placement = this.position;
    }

    const { x, y, placement } = await computePosition(
      this._triggerElement,
      this._tooltipElement,
      options
    );

    this._currentPlacement = placement;

    // Position tooltip
    Object.assign(this._tooltipElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    // Arrow positioning is handled via CSS based on placement classes
  }

  private _setupFloatingAutoUpdate(): void {
    if (!this._triggerElement || !this._tooltipElement) {
      return;
    }

    // Simple auto-update on scroll/resize
    const handleUpdate = () => this._updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    this._cleanupFloating = () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }

  private _getPlacementClasses(): Record<string, boolean> {
    const [base, modifier] = this._currentPlacement.split('-');

    return {
      'top': base === 'top',
      'bottom': base === 'bottom',
      'left': base === 'left',
      'right': base === 'right',
      'top-start': base === 'top' && modifier === 'start',
      'top-end': base === 'top' && modifier === 'end',
      'bottom-start': base === 'bottom' && modifier === 'start',
      'bottom-end': base === 'bottom' && modifier === 'end',
      'left-start': base === 'left' && modifier === 'start',
      'left-end': base === 'left' && modifier === 'end',
      'right-start': base === 'right' && modifier === 'start',
      'right-end': base === 'right' && modifier === 'end',
    };
  }

  render(): TemplateResult {
    const classes = {
      ...this._getPlacementClasses(),
    };

    const tooltipStyles: Record<string, string> = {
      'max-width': this.maxWidth,
      'z-index': this.zIndex.toString(),
      '--pfv6-c-tooltip--AnimationDuration': `${this.animationDuration}ms`,
    };
    if (this.minWidth) {
      tooltipStyles['min-width'] = this.minWidth;
    }

    const contentClasses = {
      'text-align-left': this.isContentLeftAligned,
    };

    return html`
      <slot @slotchange=${this._handleSlotChange}></slot>
      ${this._visible ? html`
        <div
          id="tooltip"
          class=${classMap(classes)}
          role="tooltip"
          aria-label=${this.content}
          style=${styleMap(tooltipStyles)}
        >
          <div id="arrow"></div>
          <div id="content" class=${classMap(contentClasses)}>
            ${this.content}
          </div>
        </div>
      ` : null}
    `;
  }

  private _handleSlotChange = (): void => {
    this._cleanupEventListeners();
    this._setupTriggerElement();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-tooltip': Pfv6Tooltip;
  }
}
