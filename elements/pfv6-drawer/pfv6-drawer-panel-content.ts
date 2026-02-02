import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { consume } from '@lit/context';
import { drawerContext, type DrawerContext, Pfv6DrawerExpandEvent } from './context.js';
import { responsivePropertyConverter } from '../../lib/converters.js';

import styles from './pfv6-drawer-panel-content.css';

/**
 * Event fired when drawer panel resize completes.
 */
export class Pfv6DrawerPanelResizeEvent extends Event {
  constructor(
    public width: number,
    public id?: string
  ) {
    super('resize', { bubbles: true, composed: true });
  }
}

/**
 * Drawer panel content component for the expandable panel area.
 *
 * @summary DrawerPanelContent component
 * @alias DrawerPanelContent
 *
 * @fires Pfv6DrawerPanelResizeEvent - Fired when panel resize completes
 *
 * @slot - Default slot for panel content
 *
 * @cssprop --pf-v6-c-drawer__panel--md--FlexBasis - Panel flex basis (width)
 * @cssprop --pf-v6-c-drawer__panel--md--FlexBasis--min - Panel minimum width
 * @cssprop --pf-v6-c-drawer__panel--md--FlexBasis--max - Panel maximum width
 * @cssprop --pf-v6-c-drawer__panel--BackgroundColor - Panel background color
 */
@customElement('pfv6-drawer-panel-content')
export class Pfv6DrawerPanelContent extends LitElement {
  static styles = styles;

  /**
   * Consume drawer context with subscribe: true for reactivity.
   */
  @consume({ context: drawerContext, subscribe: true })
  @state()
  protected _drawerContext?: DrawerContext;

  /**
   * Flag indicating that the drawer panel should not have a border.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-border' })
  hasNoBorder = false;

  /**
   * Flag indicating that the drawer panel should be resizable.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-resizable' })
  isResizable = false;

  /**
   * The minimum size of the drawer panel.
   */
  @property({ type: String, attribute: 'min-size' })
  minSize?: string | undefined;

  /**
   * The starting size of the drawer panel.
   */
  @property({ type: String, attribute: 'default-size' })
  defaultSize?: string | undefined;

  /**
   * The maximum size of the drawer panel.
   */
  @property({ type: String, attribute: 'max-size' })
  maxSize?: string | undefined;

  /**
   * The increment amount for keyboard drawer resizing.
   */
  @property({ type: Number })
  increment = 5;

  /**
   * Accessible label for the resizable drawer splitter.
   */
  @property({ type: String, attribute: 'resize-accessible-label' })
  resizeAccessibleLabel = 'Resize';

  /**
   * Sets the panel width at various breakpoints.
   * Format: "value breakpoint:value" (e.g., "25 lg:33 xl:50 2xl:66")
   *
   * Values: 25 | 33 | 50 | 66 | 75 | 100
   *
   * @example
   * <pfv6-drawer-panel-content width="25 lg:33 xl:50"></pfv6-drawer-panel-content>
   */
  @property({ converter: responsivePropertyConverter })
  width?: Record<string, string> | undefined;

  /**
   * Color variant of the background of the drawer panel.
   */
  @property({ type: String, reflect: true, attribute: 'color-variant' })
  colorVariant: 'default' | 'secondary' | 'no-background' = 'default';

  /**
   * Enables a focus trap on the drawer panel content.
   * Do not enable this if the drawer's isStatic prop is true.
   */
  @property({ type: Boolean, reflect: true, attribute: 'focus-trap-enabled' })
  focusTrapEnabled = false;

  /**
   * One or more IDs to use for the drawer panel's accessible label.
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /**
   * Internal state for tracking if panel is expanded (after animation completes).
   */
  @state()
  private _isExpandedInternal = false;

  /**
   * Internal state for separator value during resize.
   */
  @state()
  private _separatorValue = 0;

  /**
   * Internal state for tracking resize state.
   */
  private _isResizing = false;

  /**
   * Internal state for current width during resize.
   */
  private _currentWidth = 0;

  /**
   * Internal state for tracking if focus trap is active.
   */
  private _isFocusTrapActive = false;

  /**
   * Previously focused element before focus trap was activated.
   */
  private _previouslyFocusedElement: HTMLElement | null = null;

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up any active resize listeners
    if (this._isResizing) {
      this._isResizing = false;
      document.removeEventListener('mousemove', this.#handleMouseMove);
      document.removeEventListener('mouseup', this.#handleMouseUp);
    }
    // Clean up focus trap
    if (this._isFocusTrapActive) {
      this.#deactivateFocusTrap();
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Update internal expanded state when drawer context changes
    if (changedProperties.has('_drawerContext')) {
      const isStatic = this._drawerContext?.isStatic ?? false;
      const isExpanded = this._drawerContext?.isExpanded ?? false;

      if (isStatic) {
        // Static drawers always show content (no animation)
        this._isExpandedInternal = true;
      } else if (isExpanded) {
        this._isExpandedInternal = true;
      }
    }

    // Warn if focus trap is enabled with static drawer
    if (changedProperties.has('focusTrapEnabled') || changedProperties.has('_drawerContext')) {
      const isStatic = this._drawerContext?.isStatic ?? false;
      if (isStatic && this.focusTrapEnabled) {
        console.warn(
          `DrawerPanelContent: The focusTrapEnabled prop cannot be true if the Drawer's isStatic prop is true. This will cause a permanent focus trap.`
        );
      }
    }
  }

  /**
   * Get all tabbable elements within the panel, traversing shadow DOM boundaries.
   */
  #getTabbableElements(): HTMLElement[] {
    const result: HTMLElement[] = [];

    // Selector for tabbable elements
    const tabbableSelector = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
    ].join(', ');

    // Helper to check if element is visible
    const isVisible = (el: HTMLElement): boolean => {
      return el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0;
    };

    // Recursively find tabbable elements, traversing shadow DOM
    const findTabbable = (root: Element | ShadowRoot): void => {
      // Check slots for assigned elements (light DOM content)
      if (root instanceof Element) {
        const slots = root.querySelectorAll('slot');
        for (const slot of slots) {
          const assigned = slot.assignedElements({ flatten: true });
          for (const el of assigned) {
            if (el instanceof HTMLElement) {
              // Check if this element is tabbable
              if (el.matches(tabbableSelector) && isVisible(el)) {
                result.push(el);
              }
              // Recurse into shadow root if present
              if (el.shadowRoot) {
                findTabbable(el.shadowRoot);
              }
              // Also check children
              findTabbable(el);
            }
          }
        }
      }

      // Find direct tabbable elements (excluding slots)
      const elements = root.querySelectorAll(tabbableSelector);
      for (const el of elements) {
        if (el instanceof HTMLElement && isVisible(el) && !result.includes(el)) {
          result.push(el);
        }
      }

      // Recurse into shadow roots of child elements
      const allElements = root.querySelectorAll('*');
      for (const el of allElements) {
        if (el.shadowRoot) {
          findTabbable(el.shadowRoot);
        }
      }
    };

    // Start from slotted content
    const panel = this.shadowRoot?.getElementById('panel');
    if (panel) {
      findTabbable(panel);
    }

    // Filter out the panel itself
    return result.filter(el => el !== panel);
  }

  /**
   * Activate the focus trap.
   */
  #activateFocusTrap() {
    if (this._isFocusTrapActive) {
      return;
    }

    // Store previously focused element
    this._previouslyFocusedElement = document.activeElement as HTMLElement;
    this._isFocusTrapActive = true;

    // Add click outside listener
    document.addEventListener('click', this.#handleClickOutside, true);

    // Focus the first tabbable element (e.g., close button)
    // Only fall back to panel if no tabbable elements exist
    const tabbableElements = this.#getTabbableElements();
    const firstTabbable = tabbableElements[0];
    if (firstTabbable) {
      firstTabbable.focus();
    } else {
      // Fallback: focus the panel itself
      const panel = this.shadowRoot?.getElementById('panel');
      panel?.focus();
    }
  }

  /**
   * Deactivate the focus trap.
   */
  #deactivateFocusTrap() {
    if (!this._isFocusTrapActive) {
      return;
    }

    this._isFocusTrapActive = false;
    document.removeEventListener('click', this.#handleClickOutside, true);

    // Restore focus to previously focused element
    if (this._previouslyFocusedElement) {
      this._previouslyFocusedElement.focus();
      this._previouslyFocusedElement = null;
    }
  }

  /**
   * Handle click outside the panel to close drawer.
   */
  #handleClickOutside = (event: MouseEvent) => {
    if (!this._isFocusTrapActive || !this.focusTrapEnabled) {
      return;
    }

    const panel = this.shadowRoot?.getElementById('panel');
    if (!panel) {
      return;
    }

    // Check if click is outside the panel
    const path = event.composedPath();
    if (!path.includes(panel) && !path.includes(this)) {
      this.#deactivateFocusTrap();
    }
  };

  /**
   * Handle Tab key for focus trapping.
   */
  #handleFocusTrapKeyDown = (event: KeyboardEvent) => {
    if (!this._isFocusTrapActive || !this.focusTrapEnabled) {
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const tabbableElements = this.#getTabbableElements();
    const firstElement = tabbableElements[0];
    const lastElement = tabbableElements[tabbableElements.length - 1];

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    // Get the deepest active element across shadow DOM boundaries
    let { activeElement } = document;
    while (activeElement?.shadowRoot?.activeElement) {
      ({ activeElement } = activeElement.shadowRoot);
    }

    // Check if active element is in our tabbable list
    const isActiveInList = tabbableElements.some(
      el => el === activeElement || el.contains(activeElement)
    );

    if (event.shiftKey) {
      // Shift+Tab: if on first element or not in list, wrap to last
      if (activeElement === firstElement || !isActiveInList) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  #handleTransitionEnd = (event: TransitionEvent) => {
    const panel = this.shadowRoot?.getElementById('panel');
    if (event.target !== panel) {
      return;
    }

    const isStatic = this._drawerContext?.isStatic ?? false;
    const isExpanded = this._drawerContext?.isExpanded ?? false;
    const hidden = isStatic ? false : !isExpanded;

    if (!hidden && event.propertyName === 'transform') {
      this.dispatchEvent(new Pfv6DrawerExpandEvent());
    }

    this._isExpandedInternal = !hidden;

    // Toggle focus trap on transition complete
    if (this.focusTrapEnabled && !isStatic && event.propertyName === 'transform') {
      if (isExpanded) {
        this.#activateFocusTrap();
      } else {
        this.#deactivateFocusTrap();
      }
    }
  };

  #handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    document.addEventListener('mousemove', this.#handleMouseMove);
    document.addEventListener('mouseup', this.#handleMouseUp);
    this._isResizing = true;

    // Disable transitions during resize to prevent layout shifts
    const panel = this.shadowRoot?.getElementById('panel');
    panel?.classList.add('resizing');
  };

  #handleMouseMove = (event: MouseEvent) => {
    if (!this._isResizing) {
      return;
    }

    const panel = this.shadowRoot?.getElementById('panel');
    if (!panel) {
      return;
    }

    const position = this._drawerContext?.position ?? 'end';
    const mousePos = position === 'bottom' ? event.clientY : event.clientX;
    const panelRect = panel.getBoundingClientRect();

    let newSize = 0;
    if (position === 'end' || position === 'right') {
      newSize = panelRect.right - mousePos;
    } else if (position === 'start' || position === 'left') {
      newSize = mousePos - panelRect.left;
    } else {
      newSize = panelRect.bottom - mousePos;
    }

    panel.style.setProperty('--pf-v6-c-drawer__panel--md--FlexBasis', `${newSize}px`);
    this._currentWidth = newSize;
  };

  #handleMouseUp = (_event: MouseEvent) => {
    if (!this._isResizing) {
      return;
    }

    this._isResizing = false;
    document.removeEventListener('mousemove', this.#handleMouseMove);
    document.removeEventListener('mouseup', this.#handleMouseUp);

    // Re-enable transitions after resize completes
    const panel = this.shadowRoot?.getElementById('panel');
    panel?.classList.remove('resizing');

    this.dispatchEvent(new Pfv6DrawerPanelResizeEvent(this._currentWidth, this.id));
  };

  #handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    if (
      key !== 'Escape'
      && key !== 'Enter'
      && key !== 'ArrowUp'
      && key !== 'ArrowDown'
      && key !== 'ArrowLeft'
      && key !== 'ArrowRight'
    ) {
      return;
    }

    event.preventDefault();

    if (key === 'Escape' || key === 'Enter') {
      this.dispatchEvent(new Pfv6DrawerPanelResizeEvent(this._currentWidth, this.id));
      return;
    }

    const panel = this.shadowRoot?.getElementById('panel');
    if (!panel) {
      return;
    }

    const position = this._drawerContext?.position ?? 'end';
    const panelRect = panel.getBoundingClientRect();
    let newSize = position === 'bottom' ? panelRect.height : panelRect.width;

    let delta = 0;
    if (key === 'ArrowRight') {
      delta = position === 'left' || position === 'start' ? this.increment : -this.increment;
    } else if (key === 'ArrowLeft') {
      delta = position === 'left' || position === 'start' ? -this.increment : this.increment;
    } else if (key === 'ArrowUp') {
      delta = this.increment;
    } else if (key === 'ArrowDown') {
      delta = -this.increment;
    }

    newSize = newSize + delta;
    panel.style.setProperty('--pf-v6-c-drawer__panel--md--FlexBasis', `${newSize}px`);
    this._currentWidth = newSize;
  };

  render() {
    const isStatic = this._drawerContext?.isStatic ?? false;
    const isExpanded = this._drawerContext?.isExpanded ?? false;
    const hidden = isStatic ? false : !isExpanded;

    const position = this._drawerContext?.position ?? 'end';
    const isPanelLeft = position === 'start' || position === 'left';
    const isPanelBottom = position === 'bottom';

    const classes: Record<string, boolean> = {
      'resizable': this.isResizable,
      'no-border': this.hasNoBorder,
      'no-background': this.colorVariant === 'no-background',
      'secondary': this.colorVariant === 'secondary',
      'panel-left': isPanelLeft,
      'panel-bottom': isPanelBottom,
    };

    // Add width modifier classes from responsive property
    if (this.width) {
      Object.entries(this.width).forEach(([breakpoint, value]) => {
        const key = `width-${value}-on-${breakpoint}`;
        classes[key] = true;
      });
    }

    // Build inline styles for size constraints
    const inlineStyles: Record<string, string> = {};
    if (this.defaultSize) {
      inlineStyles['--pf-v6-c-drawer__panel--md--FlexBasis'] = this.defaultSize;
    }
    if (this.minSize) {
      inlineStyles['--pf-v6-c-drawer__panel--md--FlexBasis--min'] = this.minSize;
    }
    if (this.maxSize) {
      inlineStyles['--pf-v6-c-drawer__panel--md--FlexBasis--max'] = this.maxSize;
    }

    const styleAttr = Object.entries(inlineStyles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

    return html`
      <div
        id="panel"
        class=${classMap(classes)}
        ?hidden=${hidden}
        style=${ifDefined(styleAttr || undefined)}
        @transitionend=${this.#handleTransitionEnd}
        @keydown=${this.#handleFocusTrapKeyDown}
        role=${ifDefined(this.focusTrapEnabled ? 'dialog' : undefined)}
        aria-modal=${ifDefined(this.focusTrapEnabled ? 'true' : undefined)}
        aria-label=${ifDefined(this.accessibleLabel)}
        tabindex="-1"
      >
        ${this._isExpandedInternal ? html`
          ${this.isResizable ? html`
            <div
              id="splitter"
              class=${position !== 'bottom' ? 'vertical' : ''}
              role="separator"
              tabindex="0"
              aria-orientation=${position === 'bottom' ? 'horizontal' : 'vertical'}
              aria-label=${this.resizeAccessibleLabel}
              aria-valuenow=${this._separatorValue}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-controls="panel"
              @mousedown=${this.#handleMouseDown}
              @keydown=${this.#handleKeyDown}
            >
              <div id="splitter-handle" aria-hidden="true"></div>
            </div>
            <div id="panel-main">
              <slot></slot>
            </div>
          ` : html`
            <slot></slot>
          `}
        ` : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-drawer-panel-content': Pfv6DrawerPanelContent;
  }
}
