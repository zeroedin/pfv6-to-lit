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
  arrow,
  autoPlacement,
  type Placement,
  type Middleware,
} from '@floating-ui/dom';
import './pfv6-tooltip-content.js';
import './pfv6-tooltip-arrow.js';
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
 */
@customElement('pfv6-tooltip')
export class Pfv6Tooltip extends LitElement {
  static styles = styles;

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
  minWidth?: string;

  /** Z-index of the tooltip */
  @property({ type: Number, attribute: 'z-index' })
  zIndex = 9999;

  /** CSS fade transition animation duration in milliseconds */
  @property({ type: Number, attribute: 'animation-duration' })
  animationDuration = 300;

  /** aria-labelledby or aria-describedby for tooltip */
  @property({ type: String })
  aria: 'describedby' | 'labelledby' | 'none' = 'describedby';

  /** Determines whether the tooltip is an aria-live region */
  @property({ type: String, attribute: 'aria-live' })
  ariaLive: 'off' | 'polite' = 'off';

  /** ID of an external trigger element (alternative to slotted trigger) */
  @property({ type: String, attribute: 'trigger-id' })
  triggerId?: string;

  /** Internal visibility state */
  @state()
  private _visible = false;

  /** Current placement after Floating UI calculations */
  @state()
  private _currentPlacement: Placement = 'top';

  /** Tooltip element reference */
  @query('#tooltip')
  private _tooltipElement!: HTMLElement;

  /** Arrow element reference */
  @query('pfv6-tooltip-arrow')
  private _arrowElement!: HTMLElement;

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

  /** Unique ID for ARIA association */
  private _tooltipId = `pf-tooltip-${Math.random().toString(36).substring(2, 9)}`;

  connectedCallback(): void {
    super.connectedCallback();
    this._setupTriggerElement();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupEventListeners();
    this._clearTimeouts();
    this._cleanupFloating?.();
  }

  updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

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
    this._updateARIA();
    this.requestUpdate();
    await this.updateComplete;
    this._updatePosition();
    // Setup Floating UI auto-update
    this._setupFloatingAutoUpdate();
  }

  private _hide(): void {
    this._visible = false;
    this._removeARIA();
    this._cleanupFloating?.();

    // Dispatch event after animation completes
    this._hideTimeoutId = window.setTimeout(() => {
      this.dispatchEvent(new Event('tooltip-hidden', { bubbles: true, composed: true }));
    }, this.animationDuration);
  }

  private _updateARIA(): void {
    if (this.aria === 'none' || !this._triggerElement) {
      return;
    }

    const ariaAttr = `aria-${this.aria}`;
    const existingAria = this._triggerElement.getAttribute(ariaAttr);

    if (!existingAria || !existingAria.includes(this._tooltipId)) {
      const newAria = existingAria ? `${existingAria} ${this._tooltipId}` : this._tooltipId;
      this._triggerElement.setAttribute(ariaAttr, newAria);
    }
  }

  private _removeARIA(): void {
    if (this.aria === 'none' || !this._triggerElement) {
      return;
    }

    const ariaAttr = `aria-${this.aria}`;
    const existingAria = this._triggerElement.getAttribute(ariaAttr);

    if (!existingAria) {
      return;
    }

    const newAria = existingAria.replace(new RegExp(`\\b${this._tooltipId}\\b`, 'g'), '').trim();
    if (newAria) {
      this._triggerElement.setAttribute(ariaAttr, newAria);
    } else {
      this._triggerElement.removeAttribute(ariaAttr);
    }
  }

  private async _updatePosition(): Promise<void> {
    if (!this._triggerElement || !this._tooltipElement || !this._arrowElement) {
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
    middleware.push(arrow({ element: this._arrowElement }));

    const options: { middleware: Middleware[]; placement?: Placement } = {
      middleware,
    };
    if (this.position !== 'auto') {
      options.placement = this.position;
    }

    const { x, y, placement, middlewareData } = await computePosition(
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

    // Position arrow
    const arrowData = middlewareData.arrow;
    if (arrowData) {
      const { x: arrowX, y: arrowY } = arrowData;

      const basePlacement = placement.split('-')[0] ?? 'top';
      const staticSideMap: Record<string, string> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      };
      const staticSide = staticSideMap[basePlacement] ?? 'bottom';

      const arrowStyles: Record<string, string> = {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
      };
      arrowStyles[staticSide] = '-4px';
      Object.assign(this._arrowElement.style, arrowStyles);
    }
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
      'pf-m-top': base === 'top',
      'pf-m-bottom': base === 'bottom',
      'pf-m-left': base === 'left',
      'pf-m-right': base === 'right',
      'pf-m-top-left': base === 'top' && modifier === 'start',
      'pf-m-top-right': base === 'top' && modifier === 'end',
      'pf-m-bottom-left': base === 'bottom' && modifier === 'start',
      'pf-m-bottom-right': base === 'bottom' && modifier === 'end',
      'pf-m-left-top': base === 'left' && modifier === 'start',
      'pf-m-left-bottom': base === 'left' && modifier === 'end',
      'pf-m-right-top': base === 'right' && modifier === 'start',
      'pf-m-right-bottom': base === 'right' && modifier === 'end',
    };
  }

  private _renderTooltip(): TemplateResult | null {
    if (!this._visible) {
      return null;
    }

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

    return html`
      <div
        id="tooltip"
        class=${classMap(classes)}
        role="tooltip"
        aria-labelledby="content"
        aria-live=${this.ariaLive}
        style=${styleMap(tooltipStyles)}
      >
        <pfv6-tooltip-arrow></pfv6-tooltip-arrow>
        <pfv6-tooltip-content id="content" ?is-left-aligned=${this.isContentLeftAligned}>
          ${this.content}
        </pfv6-tooltip-content>
      </div>
    `;
  }

  render(): TemplateResult {
    return html`
      <slot @slotchange=${this._handleSlotChange}></slot>
      ${this._renderTooltip()}
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
