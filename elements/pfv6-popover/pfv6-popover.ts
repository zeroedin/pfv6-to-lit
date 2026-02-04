import { LitElement, html } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { query } from 'lit/decorators/query.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  computePosition,
  flip,
  shift,
  offset,
  autoPlacement,
  type Placement,
  type Middleware,
} from '@floating-ui/dom';
import './pfv6-popover-header.js';
import './pfv6-popover-body.js';
import './pfv6-popover-footer.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import styles from './pfv6-popover.css';

/**
 * Event fired when popover begins to hide.
 */
export class Pfv6PopoverHideEvent extends Event {
  constructor() {
    super('hide', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when popover has fully hidden (after animation).
 */
export class Pfv6PopoverHiddenEvent extends Event {
  constructor() {
    super('hidden', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when popover begins to show.
 */
export class Pfv6PopoverShowEvent extends Event {
  constructor() {
    super('show', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when popover has fully shown (after animation).
 */
export class Pfv6PopoverShownEvent extends Event {
  constructor() {
    super('shown', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when popover has mounted to the DOM.
 */
export class Pfv6PopoverMountEvent extends Event {
  constructor() {
    super('mount', { bubbles: true, composed: true });
  }
}

/**
 * Event fired before popover closes. Cancelable to prevent closing.
 * Dispatched on close button click, Escape key, outside click, mouse leave, or blur.
 */
export class Pfv6PopoverShouldCloseEvent extends Event {
  constructor() {
    super('should-close', { bubbles: true, composed: true, cancelable: true });
  }
}

/**
 * Event fired before popover opens. Cancelable to prevent opening.
 * Dispatched on trigger click, mouse enter, or focus.
 */
export class Pfv6PopoverShouldOpenEvent extends Event {
  constructor() {
    super('should-open', { bubbles: true, composed: true, cancelable: true });
  }
}

/**
 * A popover is a small overlay window that provides additional information about an on-screen element.
 *
 * @alias Popover
 * @summary Floating panel which displays additional information
 * @slot - Trigger element that shows the popover on interaction
 * @slot header - Header content (alternative to header-content property)
 * @slot header-icon - Icon to display in the popover header
 * @slot body - Body content (alternative to body-content property)
 * @slot footer - Footer content
 * @fires Pfv6PopoverHideEvent - Dispatched when popover begins to hide
 * @fires Pfv6PopoverHiddenEvent - Dispatched after popover hide animation completes
 * @fires Pfv6PopoverShowEvent - Dispatched when popover begins to show
 * @fires Pfv6PopoverShownEvent - Dispatched after popover show animation completes
 * @fires Pfv6PopoverMountEvent - Dispatched when popover mounts to DOM
 * @fires Pfv6PopoverShouldCloseEvent - Dispatched before popover closes (cancelable)
 * @fires Pfv6PopoverShouldOpenEvent - Dispatched before popover opens (cancelable)
 * @cssprop --pf-v6-c-popover--FontSize - Font size of popover
 * @cssprop --pf-v6-c-popover--MinWidth - Minimum width of popover
 * @cssprop --pf-v6-c-popover--MaxWidth - Maximum width of popover
 * @cssprop --pf-v6-c-popover--BoxShadow - Box shadow of popover
 * @cssprop --pf-v6-c-popover--BorderWidth - Border width of popover
 * @cssprop --pf-v6-c-popover--BorderColor - Border color of popover
 * @cssprop --pf-v6-c-popover--BorderRadius - Border radius of popover
 * @cssprop --pf-v6-c-popover--m-danger__title-icon--Color - Danger severity icon color
 * @cssprop --pf-v6-c-popover--m-warning__title-icon--Color - Warning severity icon color
 * @cssprop --pf-v6-c-popover--m-success__title-icon--Color - Success severity icon color
 * @cssprop --pf-v6-c-popover--m-info__title-icon--Color - Info severity icon color
 * @cssprop --pf-v6-c-popover--m-custom__title-icon--Color - Custom severity icon color
 * @cssprop --pf-v6-c-popover__content--BackgroundColor - Content background color
 * @cssprop --pf-v6-c-popover__content--PaddingBlockStart - Top padding of content
 * @cssprop --pf-v6-c-popover__content--PaddingInlineEnd - Right padding of content
 * @cssprop --pf-v6-c-popover__content--PaddingBlockEnd - Bottom padding of content
 * @cssprop --pf-v6-c-popover__content--PaddingInlineStart - Left padding of content
 * @cssprop --pf-v6-c-popover__content--BorderRadius - Content border radius
 * @cssprop --pf-v6-c-popover__arrow--Width - Arrow width
 * @cssprop --pf-v6-c-popover__arrow--Height - Arrow height
 * @cssprop --pf-v6-c-popover__arrow--BoxShadow - Arrow box shadow
 * @cssprop --pf-v6-c-popover__arrow--BackgroundColor - Arrow background color
 * @cssprop --pf-v6-c-popover__arrow--m-top--TranslateX - Top arrow X translation
 * @cssprop --pf-v6-c-popover__arrow--m-top--TranslateY - Top arrow Y translation
 * @cssprop --pf-v6-c-popover__arrow--m-top--Rotate - Top arrow rotation
 * @cssprop --pf-v6-c-popover__arrow--m-right--TranslateX - Right arrow X translation
 * @cssprop --pf-v6-c-popover__arrow--m-right--TranslateY - Right arrow Y translation
 * @cssprop --pf-v6-c-popover__arrow--m-right--Rotate - Right arrow rotation
 * @cssprop --pf-v6-c-popover__arrow--m-bottom--TranslateX - Bottom arrow X translation
 * @cssprop --pf-v6-c-popover__arrow--m-bottom--TranslateY - Bottom arrow Y translation
 * @cssprop --pf-v6-c-popover__arrow--m-bottom--Rotate - Bottom arrow rotation
 * @cssprop --pf-v6-c-popover__arrow--m-left--TranslateX - Left arrow X translation
 * @cssprop --pf-v6-c-popover__arrow--m-left--TranslateY - Left arrow Y translation
 * @cssprop --pf-v6-c-popover__arrow--m-left--Rotate - Left arrow rotation
 * @cssprop --pf-v6-c-popover__arrow--m-inline-top--InsetBlockStart - Inline top arrow position
 * @cssprop --pf-v6-c-popover__arrow--m-inline-bottom--InsetBlockEnd - Inline bottom arrow position
 * @cssprop --pf-v6-c-popover__arrow--m-block-left--InsetInlineStart - Block left arrow position
 * @cssprop --pf-v6-c-popover__arrow--m-block-right--InsetInlineEnd - Block right arrow position
 * @cssprop --pf-v6-c-popover__close--InsetBlockStart - Close button top position
 * @cssprop --pf-v6-c-popover__close--InsetInlineEnd - Close button right position
 * @cssprop --pf-v6-c-popover__close--sibling--PaddingInlineEnd - Sibling padding for close button
 * @cssprop --pf-v6-c-popover__header--MarginBlockEnd - Header bottom margin
 * @cssprop --pf-v6-c-popover__title-text--Color - Title text color
 * @cssprop --pf-v6-c-popover__title-text--FontWeight - Title font weight
 * @cssprop --pf-v6-c-popover__title-text--FontSize - Title font size
 * @cssprop --pf-v6-c-popover__title-icon--MarginInlineEnd - Title icon right margin
 * @cssprop --pf-v6-c-popover__title-icon--Color - Title icon color
 * @cssprop --pf-v6-c-popover__title-icon--FontSize - Title icon font size
 * @cssprop --pf-v6-c-popover__footer--MarginBlockStart - Footer top margin
 */
@customElement('pfv6-popover')
export class Pfv6Popover extends LitElement {
  static styles = styles;

  /** ElementInternals for host-level ARIA */
  #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** Accessible label for the popover (required when no header) */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Header content text */
  @property({ type: String, attribute: 'header-content' })
  headerContent = '';

  /** Body content text */
  @property({ type: String, attribute: 'body-content' })
  bodyContent = '';

  /** Footer content text */
  @property({ type: String, attribute: 'footer-content' })
  footerContent = '';

  /** Popover position */
  @property({ type: String })
  position: 'auto' | Placement = 'top';

  /** Distance of the popover from its trigger element (in pixels) */
  @property({ type: Number })
  distance = 25;

  /** If true, tries to keep the popover in view by flipping it if necessary */
  @property({ type: Boolean, reflect: true, attribute: 'enable-flip' })
  enableFlip = true;

  /** Severity variants for an alert popover */
  @property({ type: String, attribute: 'alert-severity-variant' })
  alertSeverityVariant?: 'custom' | 'info' | 'warning' | 'success' | 'danger' | undefined;

  /** Text announced by screen reader for alert severity */
  @property({ type: String, attribute: 'alert-severity-screen-reader-text' })
  alertSeverityScreenReaderText = '';


  /** Heading level for header */
  @property({ type: String, attribute: 'header-component' })
  headerComponent: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h6';

  /**
   * Popover trigger action: click or hover
   */
  @property({ type: String, attribute: 'trigger-action' })
  triggerAction: 'click' | 'hover' = 'click';

  /** Visibility when controlled externally */
  @property({ type: Boolean, reflect: true, attribute: 'is-visible' })
  isVisible = false;

  /** Maximum width of the popover (only applied if set) */
  @property({ type: String, attribute: 'max-width' })
  maxWidth?: string | undefined;

  /** Minimum width of the popover (only applied if set) */
  @property({ type: String, attribute: 'min-width' })
  minWidth?: string | undefined;

  /** Z-index of the popover */
  @property({ type: Number, attribute: 'z-index' })
  zIndex = 9999;

  /** CSS fade transition animation duration in milliseconds */
  @property({ type: Number, attribute: 'animation-duration' })
  animationDuration = 300;

  /** ID of an external trigger element (alternative to slotted trigger) */
  @property({ type: String, attribute: 'trigger-id' })
  triggerId?: string | undefined;

  /** Flag to indicate whether to show the close button */
  @property({ type: Boolean, reflect: true, attribute: 'show-close' })
  showClose = true;

  /** Accessible label for the close button */
  @property({ type: String, attribute: 'close-btn-accessible-label' })
  closeBtnAccessibleLabel = 'Close';

  /** Hides popover on outside click */
  @property({ type: Boolean, reflect: true, attribute: 'hide-on-outside-click' })
  hideOnOutsideClick = true;

  /** Removes fixed-width and allows width to be defined by contents */
  @property({ type: Boolean, reflect: true, attribute: 'has-auto-width' })
  hasAutoWidth = false;

  /** Allows content to touch edges of popover container */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-padding' })
  hasNoPadding = false;

  /** Internal visibility state */
  @state()
  private _visible = false;

  /** Current placement after Floating UI calculations */
  @state()
  private _currentPlacement: Placement = 'top';

  /** Whether the header-icon slot has content */
  @state()
  private _hasHeaderIcon = false;

  /** Whether the header slot has content */
  @state()
  private _hasSlottedHeader = false;

  /** Whether the footer slot has content */
  @state()
  private _hasSlottedFooter = false;

  /** Popover element reference */
  @query('#popover')
  private _popoverElement!: HTMLElement;

  /** Trigger element reference */
  private _triggerElement: HTMLElement | null = null;

  /** Hide timeout ID (for animation) */
  private _hideTimeoutId: number | undefined;

  /** Shown timeout ID (for animation) */
  private _shownTimeoutId: number | undefined;

  /** Cleanup function for Floating UI */
  private _cleanupFloating?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._setupTriggerElement();
    // Defer slotted content check to ensure children are parsed
    requestAnimationFrame(() => {
      this._checkSlottedContent();
    });
    this.dispatchEvent(new Pfv6PopoverMountEvent());
  }

  private _checkSlottedContent(): void {
    // Check for slotted header and footer content in light DOM
    this._hasSlottedHeader = this.querySelector('[slot="header"]') !== null;
    this._hasSlottedFooter = this.querySelector('[slot="footer"]') !== null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupEventListeners();
    this._clearTimeouts();
    this._cleanupFloating?.();
  }

  updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    // Set ARIA on host element via ElementInternals
    if (this._visible) {
      this.#internals.role = 'dialog';
      this.#internals.ariaModal = 'true';
      this.#internals.ariaLabel = this.accessibleLabel || null;
    } else {
      this.#internals.role = null;
      this.#internals.ariaModal = null;
      this.#internals.ariaLabel = null;
    }

    if (changedProperties.has('isVisible')) {
      // Respond to external isVisible changes, but avoid re-triggering if already in sync
      if (this.isVisible && !this._visible) {
        this._show(undefined, true);
      } else if (!this.isVisible && this._visible) {
        this._hide();
      }
    }

    if (changedProperties.has('triggerAction') || changedProperties.has('triggerId')) {
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
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      const elements = slot.assignedElements();
      if (elements.length > 0) {
        this._triggerElement = elements[0] as HTMLElement;
        this._setupEventListeners();
      }
    }
  }

  private _setupEventListeners(): void {
    if (!this._triggerElement) {
      return;
    }

    if (this.triggerAction === 'click') {
      this._triggerElement.addEventListener('click', this._handleTriggerClick);
    } else if (this.triggerAction === 'hover') {
      this._triggerElement.addEventListener('mouseenter', this._handleMouseEnter);
      this._triggerElement.addEventListener('mouseleave', this._handleMouseLeave);
      this._triggerElement.addEventListener('focus', this._handleFocus);
      this._triggerElement.addEventListener('blur', this._handleBlur);
    }

    // Always listen for Escape key and outside clicks
    document.addEventListener('keydown', this._handleKeyDown);
    document.addEventListener('click', this._handleDocumentClick);
  }

  private _cleanupEventListeners(): void {
    if (this._triggerElement) {
      this._triggerElement.removeEventListener('click', this._handleTriggerClick);
      this._triggerElement.removeEventListener('mouseenter', this._handleMouseEnter);
      this._triggerElement.removeEventListener('mouseleave', this._handleMouseLeave);
      this._triggerElement.removeEventListener('focus', this._handleFocus);
      this._triggerElement.removeEventListener('blur', this._handleBlur);
    }

    document.removeEventListener('keydown', this._handleKeyDown);
    document.removeEventListener('click', this._handleDocumentClick);
  }

  private _handleTriggerClick = (event: MouseEvent): void => {
    if (this._visible) {
      const shouldCloseEvent = new Pfv6PopoverShouldCloseEvent();
      this.dispatchEvent(shouldCloseEvent);
      if (!shouldCloseEvent.defaultPrevented) {
        this._hide(event);
      }
    } else {
      const shouldOpenEvent = new Pfv6PopoverShouldOpenEvent();
      this.dispatchEvent(shouldOpenEvent);
      if (!shouldOpenEvent.defaultPrevented) {
        this._show(event, true);
      }
    }
  };

  private _handleMouseEnter = (event: MouseEvent): void => {
    const shouldOpenEvent = new Pfv6PopoverShouldOpenEvent();
    this.dispatchEvent(shouldOpenEvent);
    if (!shouldOpenEvent.defaultPrevented) {
      this._show(event, false);
    }
  };

  private _handleMouseLeave = (event: MouseEvent): void => {
    const shouldCloseEvent = new Pfv6PopoverShouldCloseEvent();
    this.dispatchEvent(shouldCloseEvent);
    if (!shouldCloseEvent.defaultPrevented) {
      this._hide(event);
    }
  };

  private _handleFocus = (event: FocusEvent): void => {
    const shouldOpenEvent = new Pfv6PopoverShouldOpenEvent();
    this.dispatchEvent(shouldOpenEvent);
    if (!shouldOpenEvent.defaultPrevented) {
      this._show(event as unknown as MouseEvent, false);
    }
  };

  private _handleBlur = (event: FocusEvent): void => {
    const shouldCloseEvent = new Pfv6PopoverShouldCloseEvent();
    this.dispatchEvent(shouldCloseEvent);
    if (!shouldCloseEvent.defaultPrevented) {
      this._hide(event as unknown as MouseEvent);
    }
  };

  private _handleDocumentClick = (event: MouseEvent): void => {
    if (!this.hideOnOutsideClick || !this._visible) {
      return;
    }

    // Use composedPath() to get the full event path including shadow DOM elements
    // This is necessary because event.target is retargeted to the shadow host
    const path = event.composedPath();
    // Filter to only Node instances (excludes window, document)
    const isNode = (n: EventTarget): n is Node => n instanceof Node;
    const isFromTrigger = this._triggerElement ?
      path.some(node =>
        node === this._triggerElement
        || (isNode(node) && this._triggerElement?.contains(node))
      )
      : false;
    const isFromPopover = this._popoverElement ?
      path.some(node =>
        node === this._popoverElement
        || (isNode(node) && this._popoverElement?.contains(node))
      )
      : false;

    if (!isFromTrigger && !isFromPopover) {
      const shouldCloseEvent = new Pfv6PopoverShouldCloseEvent();
      this.dispatchEvent(shouldCloseEvent);
      if (!shouldCloseEvent.defaultPrevented) {
        this._hide(event);
      }
    }
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this._visible) {
      const shouldCloseEvent = new Pfv6PopoverShouldCloseEvent();
      this.dispatchEvent(shouldCloseEvent);
      if (!shouldCloseEvent.defaultPrevented) {
        this._hide(event as unknown as MouseEvent);
      }
    }
  };

  private _handleCloseClick = (event: MouseEvent): void => {
    event.stopPropagation();
    const shouldCloseEvent = new Pfv6PopoverShouldCloseEvent();
    this.dispatchEvent(shouldCloseEvent);
    if (!shouldCloseEvent.defaultPrevented) {
      this._hide(event);
    }
  };

  private _clearTimeouts(): void {
    if (this._hideTimeoutId !== undefined) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = undefined;
    }
    if (this._shownTimeoutId !== undefined) {
      clearTimeout(this._shownTimeoutId);
      this._shownTimeoutId = undefined;
    }
  }

  private async _show(
    _event?: MouseEvent | KeyboardEvent,
    _withFocusTrap?: boolean
  ): Promise<void> {
    this._clearTimeouts();
    this.dispatchEvent(new Pfv6PopoverShowEvent());
    this._visible = true;
    this.isVisible = true;
    this.requestUpdate();
    await this.updateComplete;
    this._updatePosition();
    this._setupFloatingAutoUpdate();

    // Dispatch shown event after animation
    this._shownTimeoutId = window.setTimeout(() => {
      this.dispatchEvent(new Pfv6PopoverShownEvent());
    }, this.animationDuration);
  }

  private _hide(_event?: MouseEvent | KeyboardEvent): void {
    // Cancel any pending timeouts (e.g., shown event that hasn't fired yet)
    this._clearTimeouts();
    this.dispatchEvent(new Pfv6PopoverHideEvent());
    this._visible = false;
    this.isVisible = false;
    this._cleanupFloating?.();

    // Dispatch hidden event after animation completes
    this._hideTimeoutId = window.setTimeout(() => {
      this.dispatchEvent(new Pfv6PopoverHiddenEvent());
    }, this.animationDuration);
  }

  private async _updatePosition(): Promise<void> {
    if (!this._triggerElement || !this._popoverElement) {
      return;
    }

    const middleware: Middleware[] = [
      offset(this.distance),
    ];

    if (this.position === 'auto' && this.enableFlip) {
      middleware.push(autoPlacement());
    } else {
      if (this.enableFlip) {
        // Match React's default flipBehavior which tries all 12 placements
        middleware.push(flip({
          fallbackPlacements: [
            'top', 'bottom', 'left', 'right',
            'top-start', 'top-end', 'bottom-start', 'bottom-end',
            'left-start', 'left-end', 'right-start', 'right-end',
          ],
        }));
      }
    }

    middleware.push(shift({ padding: 5 }));

    const options: { middleware: Middleware[]; placement?: Placement } = {
      middleware,
    };
    if (this.position !== 'auto') {
      options.placement = this.position;
    }

    const { x, y, placement } = await computePosition(
      this._triggerElement,
      this._popoverElement,
      options
    );

    this._currentPlacement = placement;

    // Position popover
    Object.assign(this._popoverElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  private _setupFloatingAutoUpdate(): void {
    if (!this._triggerElement || !this._popoverElement) {
      return;
    }

    // Clean up any existing listeners before adding new ones
    this._cleanupFloating?.();

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
      'no-padding': this.hasNoPadding,
      'width-auto': this.hasAutoWidth,
      'custom': this.alertSeverityVariant === 'custom',
      'info': this.alertSeverityVariant === 'info',
      'warning': this.alertSeverityVariant === 'warning',
      'success': this.alertSeverityVariant === 'success',
      'danger': this.alertSeverityVariant === 'danger',
    };

    const popoverStyles: Record<string, string> = {
      'z-index': this.zIndex.toString(),
      '--pfv6-c-popover--AnimationDuration': `${this.animationDuration}ms`,
      // React's Popper.js sets min-width: auto inline, allowing content-based sizing
      'min-width': this.minWidth || 'auto',
    };

    // Only apply max-width when explicitly set
    if (this.maxWidth) {
      popoverStyles['max-width'] = this.maxWidth;
    }

    const hasHeader = this.headerContent || this._hasHeaderIcon || this._hasSlottedHeader;
    const hasFooter = this.footerContent || this._hasSlottedFooter;
    const hasCloseButton = this.showClose && this.triggerAction === 'click';

    // Header styles for padding when close button is shown
    const headerStyles = hasCloseButton ? {
      '--_popover-header-padding-inline-end':
        'var(--pf-v6-c-popover__close--sibling--PaddingInlineEnd)',
    } : {};

    return html`
      <slot @slotchange=${this._handleSlotChange}></slot>
      ${this._visible ? html`
        <div
          id="popover"
          class=${classMap(classes)}
          style=${styleMap(popoverStyles)}
        >
          <div id="arrow"></div>
          <div id="content">
            ${hasCloseButton ? html`
              <div id="close">
                <pfv6-button
                  variant="plain"
                  @click=${this._handleCloseClick}
                  accessible-label=${this.closeBtnAccessibleLabel}
                >
                  <svg slot="icon" fill="currentColor" height="1em" width="1em" viewBox="0 0 352 512" aria-hidden="true">
                    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                  </svg>
                </pfv6-button>
              </div>
            ` : null}
            <div id="header-wrapper" class=${hasHeader ? '' : 'empty'}>
              <slot name="header" @slotchange=${this._handleHeaderSlotChange}>
                <pfv6-popover-header
                  header-component=${this.headerComponent}
                  alert-severity-variant=${ifDefined(this.alertSeverityVariant)}
                  alert-severity-screen-reader-text=${this.alertSeverityScreenReaderText || (this.alertSeverityVariant ? `${this.alertSeverityVariant} alert:` : '')}
                  style=${styleMap(headerStyles)}
                >
                  <span slot="icon" class=${this._hasHeaderIcon ? '' : 'empty'}><slot name="header-icon" @slotchange=${this._handleHeaderIconSlotChange}></slot></span>
                  ${this.headerContent}
                </pfv6-popover-header>
              </slot>
            </div>
            <div id="body-wrapper">
              <slot name="body">
                <pfv6-popover-body>
                  ${this.bodyContent}
                </pfv6-popover-body>
              </slot>
            </div>
            <div id="footer-wrapper" class=${hasFooter ? '' : 'empty'}>
              <slot name="footer" @slotchange=${this._handleFooterSlotChange}>
                <pfv6-popover-footer>
                  ${this.footerContent}
                </pfv6-popover-footer>
              </slot>
            </div>
          </div>
        </div>
      ` : null}
    `;
  }

  private _handleSlotChange = (): void => {
    this._cleanupEventListeners();
    this._setupTriggerElement();
  };

  private _handleHeaderSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasSlottedHeader = assignedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE
      || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '')
    );
  };

  private _handleFooterSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasSlottedFooter = assignedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE
      || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '')
    );
  };

  private _handleHeaderIconSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    // Check if any assigned node has actual content (not just empty text nodes)
    this._hasHeaderIcon = assignedNodes.some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() !== '';
      }
      return false;
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-popover': Pfv6Popover;
  }
}
