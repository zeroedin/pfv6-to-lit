import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-jump-links-item.css';
import '@pfv6/elements/pfv6-button/pfv6-button.js';

/**
 * Event fired when a jump link item is clicked.
 */
export class Pfv6JumpLinksItemClickEvent extends Event {
  constructor(
    public href: string,
    public index: number
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

  /** Whether this item is active. Parent JumpLinks component sets this when passed a scrollableSelector. */
  @property({ type: Boolean, reflect: true, attribute: 'is-active' })
  isActive = false;

  /** Href for this link */
  @property({ type: String, reflect: true })
  href = '';

  /** Selector or node to spy on (stored but used by parent) */
  @property({ type: String, reflect: true })
  node?: string | undefined;

  constructor() {
    super();
    this.#internals.role = 'listitem';
  }

  private handleClick = (e: MouseEvent) => {
    e.preventDefault();

    // Get index from parent
    const parent = this.parentElement;
    if (parent) {
      const items = Array.from(parent.querySelectorAll('pfv6-jump-links-item'));
      const index = items.indexOf(this);

      // Dispatch event that parent can listen to
      this.dispatchEvent(new Pfv6JumpLinksItemClickEvent(this.href, index));

      // Let parent handle the actual scrolling via the event
      const jumpLinks = this.closest('pfv6-jump-links');
      if (jumpLinks && 'handleItemClick' in jumpLinks) {
        (jumpLinks as { handleItemClick: (i: number, h: string) => void })
            .handleItemClick(index, this.href);
      }
    }
  };

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

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
