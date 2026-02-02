import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { query } from 'lit/decorators/query.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import './pfv6-expandable-section-toggle.js';
import styles from './pfv6-expandable-section.css';

/**
 * Event fired when expandable section is toggled.
 */
export class Pfv6ExpandableSectionToggleEvent extends Event {
  constructor(
    public isExpanded: boolean
  ) {
    super('toggle', { bubbles: true, composed: true });
  }
}

/**
 * Expandable section component for progressive disclosure of content.
 *
 * @summary ExpandableSection component for showing/hiding content
 * @alias ExpandableSection
 *
 * @fires Pfv6ExpandableSectionToggleEvent - Fired when section is toggled
 * @slot - Default slot for expandable content
 * @slot toggle-content - Optional slot for custom toggle content (alternative to toggle-text)
 *
 * @cssprop [--pf-v6-c-expandable-section--m-truncate__content--LineClamp=3] - Number of lines to show when truncated
 */
@customElement('pfv6-expandable-section')
export class Pfv6ExpandableSection extends LitElement {
  static readonly styles = styles;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** ElementInternals for host-level ARIA (used in detached mode) */
  #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  /** Variant of the expandable section */
  @property({ type: String, reflect: true })
  variant: 'default' | 'truncate' = 'default';

  /** Whether the section is expanded (controlled mode) */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded?: boolean | undefined;

  /** Whether the toggle is detached from the content */
  @property({ type: Boolean, reflect: true, attribute: 'is-detached' })
  isDetached = false;

  /** Display size variant */
  @property({ type: String, reflect: true, attribute: 'display-size' })
  displaySize: 'default' | 'lg' = 'default';

  /** Whether the width is limited */
  @property({ type: Boolean, reflect: true, attribute: 'is-width-limited' })
  isWidthLimited = false;

  /** Whether the content is indented */
  @property({ type: Boolean, reflect: true, attribute: 'is-indented' })
  isIndented = false;

  /** Text for the toggle button */
  @property({ type: String, attribute: 'toggle-text' })
  toggleText = '';

  /** Text for the toggle when expanded */
  @property({ type: String, attribute: 'toggle-text-expanded' })
  toggleTextExpanded = '';

  /** Text for the toggle when collapsed */
  @property({ type: String, attribute: 'toggle-text-collapsed' })
  toggleTextCollapsed = '';

  /** ID for the content element */
  @property({ type: String, attribute: 'content-id' })
  contentId = '';

  /** ID for the toggle element */
  @property({ type: String, attribute: 'toggle-id' })
  toggleId = '';

  /** Direction for animation when detached */
  @property({ type: String, reflect: true })
  direction?: 'up' | 'down' | undefined;

  /** Maximum lines to show when truncated */
  @property({ type: Number, attribute: 'truncate-max-lines' })
  truncateMaxLines?: number | undefined;

  /** Internal state for uncontrolled mode */
  @state()
  private _internalExpanded = false;

  /** Whether toggle should be visible (for truncate variant) */
  @state()
  private _hasToggle = true;

  /** Reference to content element */
  @query('#content')
  private _contentRef?: HTMLDivElement;

  /** Resize observer for truncate variant */
  #resizeObserver?: ResizeObserver | undefined;

  /** Previous width for resize detection */
  #previousWidth = 0;

  /** Debounce timer for resize */
  #resizeTimer?: number;

  override connectedCallback() {
    super.connectedCallback();

    if (this.variant === 'truncate') {
      this.#setupResizeObserver();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanupResizeObserver();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('variant')) {
      if (this.variant === 'truncate') {
        this.#setupResizeObserver();
        this.#updateLineClamp();
        this.#checkToggleVisibility();
      } else {
        this.#cleanupResizeObserver();
      }
    }

    if (
      this.variant === 'truncate'
      && (changedProperties.has('truncateMaxLines') || changedProperties.has('_internalExpanded'))
    ) {
      this.#updateLineClamp();
      this.#checkToggleVisibility();
    }

    // Update host-level ARIA for detached mode (cross-shadow-boundary accessibility)
    if (changedProperties.has('isDetached') || changedProperties.has('toggleId')) {
      this.#updateHostAria();
    }
  }

  /** Update host-level ARIA for detached mode */
  #updateHostAria() {
    if (this.isDetached && this.toggleId) {
      // In detached mode, set role and aria-labelledby on the host element
      // Use ariaLabelledByElements API with element reference for cross-shadow-boundary support
      this.#internals.role = 'region';
      const toggleElement = document.getElementById(this.toggleId);
      if (toggleElement) {
        this.#internals.ariaLabelledByElements = [toggleElement];
      }
    } else {
      // Clear host-level ARIA when not detached (internal content div handles it)
      this.#internals.role = null;
      this.#internals.ariaLabelledByElements = [];
    }
  }

  override firstUpdated() {
    // Set initial host-level ARIA for detached mode
    this.#updateHostAria();

    if (this.variant === 'truncate') {
      this.#updateLineClamp();
      this.#checkToggleVisibility();
    }
  }

  #setupResizeObserver() {
    if (!this.#resizeObserver && this._contentRef) {
      this.#resizeObserver = new ResizeObserver(() => {
        this.#handleResize();
      });
      this.#resizeObserver.observe(this._contentRef);
    }
  }

  #cleanupResizeObserver() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = undefined;
    }
    if (this.#resizeTimer) {
      clearTimeout(this.#resizeTimer);
    }
  }

  #handleResize() {
    if (this.#resizeTimer) {
      clearTimeout(this.#resizeTimer);
    }
    this.#resizeTimer = window.setTimeout(() => {
      this.#resize();
    }, 250);
  }

  #resize() {
    if (this._contentRef) {
      const { offsetWidth } = this._contentRef;
      if (this.#previousWidth !== offsetWidth) {
        this.#previousWidth = offsetWidth;
        this.#checkToggleVisibility();
      }
    }
  }

  #updateLineClamp() {
    if (this._contentRef) {
      if (this.truncateMaxLines && this.truncateMaxLines > 0) {
        this._contentRef.style.setProperty(
          '--pf-v6-c-expandable-section--m-truncate__content--LineClamp',
          this.truncateMaxLines.toString(),
        );
      } else {
        this._contentRef.style.removeProperty(
          '--pf-v6-c-expandable-section--m-truncate__content--LineClamp',
        );
      }
    }
  }

  #checkToggleVisibility() {
    if (this._contentRef) {
      const maxLines = this.truncateMaxLines || 3;
      const lineHeight = parseInt(getComputedStyle(this._contentRef).lineHeight);
      const totalLines = this._contentRef.scrollHeight / lineHeight;

      this._hasToggle = totalLines > maxLines;
    }
  }

  #calculateToggleText(): string {
    const expanded = this.isExpanded ?? this._internalExpanded;

    if (expanded && this.toggleTextExpanded) {
      return this.toggleTextExpanded;
    }
    if (!expanded && this.toggleTextCollapsed) {
      return this.toggleTextCollapsed;
    }
    return this.toggleText;
  }

  #handleToggle = (e: Event) => {
    e.stopPropagation();

    const expanded = this.isExpanded ?? this._internalExpanded;
    const newExpanded = !expanded;

    // Uncontrolled mode
    if (this.isExpanded === undefined) {
      this._internalExpanded = newExpanded;
    }

    this.dispatchEvent(new Pfv6ExpandableSectionToggleEvent(newExpanded));
  };

  render() {
    const expanded = this.isExpanded ?? this._internalExpanded;
    const computedToggleText = this.#calculateToggleText();
    const hasRenderedToggle = (this.variant === 'default' && !this.isDetached)
      || (this.variant === 'truncate' && this._hasToggle && !this.isDetached);

    const classes = {
      'expanded': expanded,
      'display-lg': this.displaySize === 'lg',
      'limit-width': this.isWidthLimited,
      'indented': this.isIndented,
      'truncate': this.variant === 'truncate',
      'expand-top': this.isDetached && this.direction === 'up',
      'expand-bottom': this.isDetached && this.direction === 'down',
      'detached': this.isDetached && !!this.direction,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        ${this.variant === 'default' && !this.isDetached ? html`
          <div id="toggle" class="toggle">
            <pfv6-button
              variant="link"
              class="toggle-button"
              .isExpanded=${expanded}
              aria-controls="content"
              id="toggle-button"
              @click=${this.#handleToggle}
            >
              <span slot="icon" class="toggle-icon">
                <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true">
                  <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
                </svg>
              </span>
              <slot name="toggle-content">${computedToggleText}</slot>
            </pfv6-button>
          </div>
        ` : null}

        <div
          id="content"
          class="content"
          ?hidden=${this.variant !== 'truncate' && !expanded}
          aria-labelledby=${ifDefined(hasRenderedToggle ? 'toggle-button' : undefined)}
          role=${ifDefined(this.isDetached ? undefined : 'region')}
        >
          <slot></slot>
        </div>

        ${this.variant === 'truncate' && this._hasToggle && !this.isDetached ? html`
          <div id="toggle" class="toggle">
            <pfv6-button
              variant="link"
              is-inline
              class="toggle-button"
              .isExpanded=${expanded}
              aria-controls="content"
              id="toggle-button"
              @click=${this.#handleToggle}
            >
              <slot name="toggle-content">${computedToggleText}</slot>
            </pfv6-button>
          </div>
        ` : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-expandable-section': Pfv6ExpandableSection;
  }
}
