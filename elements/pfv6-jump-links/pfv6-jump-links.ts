import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { provide } from '@lit/context';
import { jumpLinksContext, type JumpLinksContext } from './context.js';
import { Pfv6JumpLinksItemClickEvent } from './pfv6-jump-links-item.js';
import './pfv6-jump-links-list.js';
import styles from './pfv6-jump-links.css';

/**
 * Event fired when expandable toggle is clicked.
 */
export class Pfv6JumpLinksExpandEvent extends Event {
  constructor(
    public expanded: boolean
  ) {
    super('expand', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when scroll spy activates a different jump link.
 */
export class Pfv6JumpLinksActiveChangeEvent extends Event {
  constructor(
    public activeIndex: number
  ) {
    super('active-change', { bubbles: true, composed: true });
  }
}

/**
 * JumpLinks component for navigating to anchored content on a page.
 *
 * @summary Navigation component for anchor links with scroll spy
 * @alias JumpLinks
 *
 * ## Architecture: Shadow DOM with ElementInternals
 *
 * **ARIA Pattern**: Uses ElementInternals to expose `role="navigation"` and
 * `ariaLabel` at the host level. This avoids cross-root ARIA issues where
 * IDREF attributes (aria-labelledby) cannot cross shadow boundaries.
 *
 * @fires {Pfv6JumpLinksExpandEvent} expand - Fired when expandable toggle is clicked
 * @fires {Pfv6JumpLinksActiveChangeEvent} active-change - Fired when active index changes via scroll spy
 *
 * @slot - Default slot for jump links items and lists
 * @slot label - Label content (alternative to label property)
 *
 * @cssprop --pf-v6-c-jump-links__list--Display - List display value
 * @cssprop --pf-v6-c-jump-links__list--PaddingBlockStart - List padding block start
 * @cssprop --pf-v6-c-jump-links__list--PaddingInlineEnd - List padding inline end
 * @cssprop --pf-v6-c-jump-links__list--PaddingBlockEnd - List padding block end
 * @cssprop --pf-v6-c-jump-links__list--PaddingInlineStart - List padding inline start
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--PaddingBlockStart - Vertical layout list block padding
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--PaddingInlineEnd - Vertical layout list inline padding
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--PaddingBlockEnd - Vertical layout list block padding end
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--PaddingInlineStart - Vertical layout list inline padding
 * @cssprop --pf-v6-c-jump-links__list--FlexDirection - List flex direction
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--FlexDirection - Vertical layout flex direction
 * @cssprop --pf-v6-c-jump-links__list--before--BorderColor - List border color
 * @cssprop --pf-v6-c-jump-links__list--before--BorderBlockStartWidth - List border block start width
 * @cssprop --pf-v6-c-jump-links__list--before--BorderInlineEndWidth - List border inline end width
 * @cssprop --pf-v6-c-jump-links__list--before--BorderBlockEndWidth - List border block end width
 * @cssprop --pf-v6-c-jump-links__list--before--BorderInlineStartWidth - List border inline start width
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--before--BorderInlineStartWidth - Vertical list border inline start width
 * @cssprop --pf-v6-c-jump-links--m-vertical__list--before--BorderBlockStartWidth - Vertical list border block start width
 * @cssprop --pf-v6-c-jump-links__list__list--MarginBlockStart - Nested list margin block start
 * @cssprop --pf-v6-c-jump-links__link--PaddingBlockStart - Link padding block start
 * @cssprop --pf-v6-c-jump-links__link--PaddingInlineEnd - Link padding inline end
 * @cssprop --pf-v6-c-jump-links__link--PaddingBlockEnd - Link padding block end
 * @cssprop --pf-v6-c-jump-links__link--PaddingInlineStart - Link padding inline start
 * @cssprop --pf-v6-c-jump-links__list__list__link--PaddingBlockStart - Nested link padding block start
 * @cssprop --pf-v6-c-jump-links__list__list__link--PaddingInlineStart - Nested link padding inline start
 * @cssprop --pf-v6-c-jump-links__list__list__link--PaddingBlockEnd - Nested link padding block end
 * @cssprop --pf-v6-c-jump-links__link--OutlineOffset - Link outline offset
 * @cssprop --pf-v6-c-jump-links__link--before--BorderBlockStartWidth - Link underline border block start width
 * @cssprop --pf-v6-c-jump-links__link--before--BorderInlineEndWidth - Link underline border inline end width
 * @cssprop --pf-v6-c-jump-links__link--before--BorderBlockEndWidth - Link underline border block end width
 * @cssprop --pf-v6-c-jump-links__link--before--BorderInlineStartWidth - Link underline border inline start width
 * @cssprop --pf-v6-c-jump-links__link--before--BorderColor - Link underline border color
 * @cssprop --pf-v6-c-jump-links__item--m-current__link--before--BorderBlockStartWidth - Current item underline border block start width
 * @cssprop --pf-v6-c-jump-links__item--m-current__link--before--BorderInlineStartWidth - Current item underline border inline start width
 * @cssprop --pf-v6-c-jump-links__item--m-current__link--before--BorderColor - Current item underline border color
 * @cssprop --pf-v6-c-jump-links--m-vertical__item--m-current__link--before--BorderBlockStartWidth - Vertical current item border block start width
 * @cssprop --pf-v6-c-jump-links--m-vertical__item--m-current__link--before--BorderInlineStartWidth - Vertical current item border inline start width
 * @cssprop --pf-v6-c-jump-links__link-text--Color - Link text color
 * @cssprop --pf-v6-c-jump-links__link--hover__link-text--Color - Link hover text color
 * @cssprop --pf-v6-c-jump-links__item--m-current__link-text--Color - Current item link text color
 * @cssprop --pf-v6-c-jump-links__label--MarginBlockEnd - Label margin block end
 * @cssprop --pf-v6-c-jump-links__label--Display - Label display value
 * @cssprop --pf-v6-c-jump-links__toggle--MarginBlockEnd - Toggle margin block end
 * @cssprop --pf-v6-c-jump-links--m-expanded__toggle--MarginBlockEnd - Expanded toggle margin block end
 * @cssprop --pf-v6-c-jump-links__toggle--Display - Toggle display value
 * @cssprop --pf-v6-c-jump-links__toggle-icon--Color - Toggle icon color
 * @cssprop --pf-v6-c-jump-links__toggle-icon--TransitionDuration - Toggle icon transition duration
 * @cssprop --pf-v6-c-jump-links__toggle-icon--TransitionTimingFunction - Toggle icon transition timing function
 * @cssprop --pf-v6-c-jump-links__toggle-icon--Rotate - Toggle icon rotate
 * @cssprop --pf-v6-c-jump-links--m-expanded__toggle-icon--Rotate - Expanded toggle icon rotate
 */
@customElement('pfv6-jump-links')
export class Pfv6JumpLinks extends LitElement {
  static styles = styles;

  readonly #internals = this.attachInternals();

  /** Whether to center children. */
  @property({ type: Boolean, reflect: true, attribute: 'is-centered' })
  isCentered = false;

  /** Whether the layout of children is vertical or horizontal. */
  @property({ type: Boolean, reflect: true, attribute: 'is-vertical' })
  isVertical = false;

  /** Label to add to nav element. */
  @property({ type: String })
  label?: string | undefined;

  /** Flag to always show the label when using expandable */
  @property({ type: Boolean, reflect: true, attribute: 'always-show-label' })
  alwaysShowLabel = true;

  /** Adds an accessible label to the navigation. Defaults to the value of the label prop. */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Selector for the scrollable element to spy on. Not passing a scrollableSelector disables spying. */
  @property({ type: String, attribute: 'scrollable-selector' })
  scrollableSelector?: string | undefined;

  /** The index of the child Jump link to make active. */
  @property({ type: Number, reflect: true, attribute: 'active-index' })
  activeIndex = 0;

  /** Offset to add to scrollPosition, potentially for a masthead which content scrolls under. */
  @property({ type: Number, reflect: true })
  offset = 0;

  /** When to collapse/expand at different breakpoints. Format: "default:expandable md:nonExpandable" */
  @property({ type: String })
  expandable?: string | undefined;

  /** On mobile whether or not the JumpLinks starts out expanded */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** Accessible label for expandable toggle */
  @property({ type: String, attribute: 'toggle-accessible-label' })
  toggleAccessibleLabel = 'Toggle jump links';

  /** Whether the current entry in the navigation history should be replaced when a JumpLinksItem is clicked. */
  @property({ type: Boolean, reflect: true, attribute: 'should-replace-nav-history' })
  shouldReplaceNavHistory = false;

  @state() private scrollableElement: HTMLElement | null = null;
  @state() private scrollItems: HTMLElement[] = [];
  @state() private internalActiveIndex = 0;
  @state() private isLinkClicked = false;

  private scrollSpyBound = this.scrollSpy.bind(this);
  private resizeObserver: ResizeObserver | null = null;

  /**
   * Context value provided to child items.
   * Children consume this to determine their active state.
   */
  @provide({ context: jumpLinksContext })
  @state()
  private contextValue: JumpLinksContext = {
    activeIndex: 0,
  };

  /**
   * Update context when internal active index changes.
   */
  private updateContext() {
    this.contextValue = { activeIndex: this.internalActiveIndex };
  }

  constructor() {
    super();
    // Set navigation role on host via ElementInternals
    this.#internals.role = 'navigation';
  }

  /**
   * Handle bubbling jump-link-click events from child items.
   * Computes the global index and triggers navigation.
   */
  private handleJumpLinkClick = (e: Event) => {
    const event = e as Pfv6JumpLinksItemClickEvent;
    const itemElement = e.target as HTMLElement;

    // Compute global index from all items in this container
    const allItems = Array.from(this.querySelectorAll('pfv6-jump-links-item'));
    const index = allItems.indexOf(itemElement);

    if (index !== -1) {
      // Set the index on the event so consumers can access it
      event.index = index;
      this.handleItemClick(index, event.href);
    }
  };

  override connectedCallback() {
    super.connectedCallback();

    // Listen for bubbling click events from child items
    this.addEventListener('jump-link-click', this.handleJumpLinkClick);

    // Set up scroll spy if selector provided
    if (this.scrollableSelector) {
      this.setupScrollSpy();
    }

    // Set up resize observer for responsive behavior
    this.resizeObserver = new ResizeObserver(() => {
      this.requestUpdate();
    });
    this.resizeObserver.observe(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('jump-link-click', this.handleJumpLinkClick);
    if (this.scrollableElement) {
      this.scrollableElement.removeEventListener('scroll', this.scrollSpyBound);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('scrollableSelector')) {
      this.setupScrollSpy();
    }

    if (changedProperties.has('activeIndex')) {
      this.internalActiveIndex = this.activeIndex;
      this.updateContext();
    }

    // Update ariaLabel on host via ElementInternals when label props change
    if (changedProperties.has('accessibleLabel') || changedProperties.has('label')) {
      this.#internals.ariaLabel = this.accessibleLabel || this.label || null;
    }
  }

  override firstUpdated() {
    // Set initial ariaLabel
    this.#internals.ariaLabel = this.accessibleLabel || this.label || null;

    // Sync initial active state to children
    this.updateContext();

    // Refresh scroll items after initial render
    if (this.scrollableSelector) {
      queueMicrotask(() => {
        this.refreshScrollItems();
        this.scrollSpy();
      });
    }
  }

  private setupScrollSpy() {
    if (this.scrollableElement) {
      this.scrollableElement.removeEventListener('scroll', this.scrollSpyBound);
    }

    if (this.scrollableSelector) {
      this.scrollableElement = document.querySelector(this.scrollableSelector);
      if (this.scrollableElement) {
        this.scrollableElement.addEventListener('scroll', this.scrollSpyBound);
        this.refreshScrollItems();
      }
    }
  }

  private refreshScrollItems() {
    const items = this.querySelectorAll('pfv6-jump-links-item');
    const scrollItems: HTMLElement[] = [];

    items.forEach(item => {
      const href = item.getAttribute('href');
      if (href) {
        if (href.startsWith('#')) {
          const element = document.getElementById(href.substring(1));
          if (element) {
            scrollItems.push(element);
          }
        } else {
          const element = document.querySelector(href);
          if (element instanceof HTMLElement) {
            scrollItems.push(element);
          }
        }
      }
    });

    this.scrollItems = scrollItems;
  }

  private scrollSpy() {
    if (!this.scrollableElement || this.isLinkClicked) {
      if (this.isLinkClicked) {
        this.isLinkClicked = false;
      }
      return;
    }

    const scrollPosition = Math.ceil(this.scrollableElement.scrollTop + this.offset);

    window.requestAnimationFrame(() => {
      // Refresh items if needed
      const requiresRefresh = this.scrollItems.length === 0
        || this.scrollItems.every(e => !e.offsetTop);

      if (requiresRefresh) {
        this.refreshScrollItems();
      }

      const scrollElements = this.scrollItems
          .map((e, index) => ({
            y: e.offsetTop,
            index,
          }))
          .sort((e1, e2) => e2.y - e1.y);

      for (const { y, index } of scrollElements) {
        if (scrollPosition >= y) {
          if (this.internalActiveIndex !== index) {
            this.internalActiveIndex = index;
            this.updateContext();
            this.dispatchEvent(new Pfv6JumpLinksActiveChangeEvent(index));
          }
          return;
        }
      }
    });
  }

  handleItemClick(index: number, href: string) {
    this.isLinkClicked = true;

    if (!this.scrollItems[index]) {
      this.refreshScrollItems();
    }

    const scrollItem = this.scrollItems[index];

    // Fallback to native navigation if scroll spy isn't set up
    if (!scrollItem || !this.scrollableElement) {
      if (this.shouldReplaceNavHistory) {
        window.location.replace(href);
      } else {
        window.location.assign(href);
      }
      return;
    }

    // Check if responsive and collapse if needed
    const isResponsive = this.isResponsive();
    if (isResponsive) {
      this.isExpanded = false;
      this.dispatchEvent(new Pfv6JumpLinksExpandEvent(false));
    }

    this.scrollableElement.scrollTo(0, scrollItem.offsetTop - this.offset);
    scrollItem.focus();

    if (this.shouldReplaceNavHistory) {
      window.history.replaceState('', '', href);
    } else {
      window.history.pushState('', '', href);
    }

    this.internalActiveIndex = index;
    this.updateContext();
    this.dispatchEvent(new Pfv6JumpLinksActiveChangeEvent(index));
  }

  private isResponsive(): boolean {
    if (!this.expandable) {
      return false;
    }
    const toggleDisplay = getComputedStyle(this)
        .getPropertyValue('--pf-v6-c-jump-links__toggle--Display');
    return toggleDisplay.includes('block');
  }

  private handleToggle = () => {
    this.isExpanded = !this.isExpanded;
    this.dispatchEvent(new Pfv6JumpLinksExpandEvent(this.isExpanded));
  };

  private handleSlotChange = () => {
    if (this.scrollableSelector) {
      this.refreshScrollItems();
    }
  };

  private getExpandableClasses(): Record<string, boolean> {
    if (!this.expandable) {
      return {};
    }

    const classes: Record<string, boolean> = {};
    const tokens = this.expandable.trim().split(/\s+/);

    tokens.forEach((token, index) => {
      if (token.includes(':')) {
        const [breakpoint, value] = token.split(':');
        // 'default' breakpoint maps to base class (no -on-default suffix)
        if (breakpoint === 'default') {
          if (value === 'expandable') {
            classes['expandable'] = true;
          } else if (value === 'nonExpandable') {
            classes['non-expandable'] = true;
          }
        } else {
          if (value === 'expandable') {
            classes[`expandable-on-${breakpoint}`] = true;
          } else if (value === 'nonExpandable') {
            classes[`non-expandable-on-${breakpoint}`] = true;
          }
        }
      } else if (index === 0) {
        // First token without colon is default
        if (token === 'expandable') {
          classes['expandable'] = true;
        } else if (token === 'nonExpandable') {
          classes['non-expandable'] = true;
        }
      }
    });

    return classes;
  }

  render() {
    const classes = {
      center: this.isCentered,
      vertical: this.isVertical,
      expanded: this.isExpanded,
      ...this.getExpandableClasses(),
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <div id="main">
          <div id="header">
            ${this.expandable ? html`
              <div id="toggle">
                <button
                  id="toggle-button"
                  @click=${this.handleToggle}
                  aria-label=${ifDefined(this.label ? undefined : this.toggleAccessibleLabel)}
                  aria-expanded=${this.isExpanded ? 'true' : 'false'}
                >
                  <span id="toggle-icon">
                    <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true">
                      <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
                    </svg>
                  </span>
                  ${this.label ? html`<span id="toggle-text">${this.label}</span>` : null}
                  <slot name="label"></slot>
                </button>
              </div>
            ` : null}
            ${this.label && this.alwaysShowLabel && !this.expandable ? html`
              <div id="label">
                ${this.label}
                <slot name="label"></slot>
              </div>
            ` : null}
          </div>
          <div id="list" role="list">
            <slot @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-jump-links': Pfv6JumpLinks;
  }
}
