import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { consume } from '@lit/context';
import { jumpLinksContext, type JumpLinksContext } from './context.js';
import styles from './pfv6-jump-links-item.css';
import '@pfv6/elements/pfv6-button/pfv6-button.js';

/**
 * Event fired when a jump link item is clicked.
 * The index is computed by the parent JumpLinks component.
 */
export class Pfv6JumpLinksItemClickEvent extends Event {
  /** Index of the clicked item (set by parent JumpLinks) */
  index = -1;

  constructor(
    public href: string
  ) {
    super('jump-link-click', { bubbles: true, composed: true });
  }
}

/**
 * Individual item in a jump links navigation.
 *
 * @summary Jump link item component
 * @alias JumpLinksItem
 *
 * ## Architecture: Shadow DOM with ElementInternals
 *
 * **ARIA Pattern**: Uses ElementInternals to expose `role="listitem"` and
 * `ariaCurrent` at the host level.
 *
 * **Internal Structure**: Uses `pfv6-button` with `variant="link"` and `href`
 * to match React's pattern of using Button component inside JumpLinksItem.
 *
 * @fires {Pfv6JumpLinksItemClickEvent} jump-link-click - Fired when the link is clicked
 *
 * @slot - Default slot for link text content
 * @slot sublist - Slot for nested pfv6-jump-links-list
 *
 * @cssprop --pf-v6-c-jump-links__list--before--BorderColor - Border color for list indicator (set by parent)
 */
@customElement('pfv6-jump-links-item')
export class Pfv6JumpLinksItem extends LitElement {
  static styles = styles;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  readonly #internals = this.attachInternals();

  /** Whether this item is active. Can be set directly or derived from parent context. */
  @property({ type: Boolean, reflect: true, attribute: 'is-active' })
  isActive = false;

  /** Href for this link */
  @property({ type: String, reflect: true })
  href = '';

  /** Selector or node to spy on (stored but used by parent) */
  @property({ type: String, reflect: true })
  node?: string | undefined;

  /**
   * Context value from parent JumpLinks.
   * Uses @consume decorator to subscribe to context changes.
   */
  @consume({ context: jumpLinksContext, subscribe: true })
  @state()
  private jumpLinksContext: JumpLinksContext | undefined;

  constructor() {
    super();
    this.#internals.role = 'listitem';
  }

  /**
   * Compute this item's index within the parent jump-links.
   */
  private getIndex(): number {
    const parent = this.closest('pfv6-jump-links');
    if (!parent) {
      return -1;
    }
    const items = Array.from(parent.querySelectorAll('pfv6-jump-links-item'));
    return items.indexOf(this);
  }

  /**
   * Derive active state from context when context changes.
   */
  private updateActiveFromContext() {
    if (this.jumpLinksContext) {
      const index = this.getIndex();
      if (index !== -1) {
        this.isActive = index === this.jumpLinksContext.activeIndex;
      }
    }
  }

  private handleClick = (e: MouseEvent) => {
    e.preventDefault();

    // Dispatch bubbling event - parent will compute index and handle navigation
    this.dispatchEvent(new Pfv6JumpLinksItemClickEvent(this.href));
  };

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Update active state when context changes
    if (changedProperties.has('jumpLinksContext')) {
      this.updateActiveFromContext();
    }

    if (changedProperties.has('isActive')) {
      // Update aria-current on host via ElementInternals
      this.#internals.ariaCurrent = this.isActive ? 'location' : null;
    }
  }

  render() {
    const classes = {
      current: this.isActive,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <span id="link">
          <pfv6-button
            id="link-button"
            variant="link"
            href=${this.href}
            @click=${this.handleClick}
          >
            <span id="link-text">
              <slot></slot>
            </span>
          </pfv6-button>
        </span>
        <slot name="sublist"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-jump-links-item': Pfv6JumpLinksItem;
  }
}
