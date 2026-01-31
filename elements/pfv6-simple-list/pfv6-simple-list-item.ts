import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { consume } from '@lit/context';
import { simpleListContext, type SimpleListContext } from './context.js';
import styles from './pfv6-simple-list-item.css';

/**
 * Event fired when a SimpleListItem is clicked.
 */
export class Pfv6SimpleListItemClickEvent extends Event {
  constructor(
    public itemId?: string | number
  ) {
    super('click', { bubbles: true, composed: true });
  }
}

/**
 * SimpleListItem component representing an interactive list item.
 *
 * @summary An interactive list item that can be a button or link
 * @alias SimpleListItem
 * @slot - Default slot for item content
 * @fires Pfv6SimpleListItemClickEvent - Fired when the item is clicked
 */
@customElement('pfv6-simple-list-item')
export class Pfv6SimpleListItem extends LitElement {
  static styles = styles;

  /**
  * Form-associated custom element.
  * Required for submit/reset buttons inside Shadow DOM to participate in forms.
  */
  static formAssociated = true;

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
  * ElementInternals provides:
  * - listitem role on :host (Shadow DOM breaks ul > li relationship)
  * - Form association for submit/reset button types
  */
  #internals: ElementInternals;

  /**
  * Context value from parent SimpleList.
  * Uses @consume decorator to subscribe to context changes.
  */
  @consume({ context: simpleListContext, subscribe: true })
  @state()
  private listContext: SimpleListContext | undefined;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = 'listitem';
  }

  /**
  * Unique identifier for the item.
  */
  @property({ type: String, attribute: 'item-id' })
  itemId?: string | number | undefined;

  /**
  * Component type of the SimpleList item.
  */
  @property({ type: String })
  component: 'button' | 'a' = 'button';

  /**
  * Indicates if the link is current/highlighted (uncontrolled mode).
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-active' })
  isActive = false;

  /**
  * Type of button SimpleList item (only applies when component="button").
  */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  /**
  * Default hyperlink location (only applies when component="a").
  */
  @property({ type: String })
  href = '';

  #handleClick = () => {
    // Notify parent list via context (pass element reference like React does)
    if (this.listContext?.updateCurrentItem) {
      const itemProps = {
        itemId: this.itemId,
        component: this.component,
        type: this.type,
        href: this.href,
        isActive: this.isActive,
      };
      this.listContext.updateCurrentItem(this, this.itemId, itemProps);
    }

    // Fire custom event
    this.dispatchEvent(new Pfv6SimpleListItemClickEvent(this.itemId));

    // Handle form submission/reset for buttons inside Shadow DOM
    // Only applies to buttons (no href), not links
    const { form } = this.#internals;
    if (form && !this.href) {
      if (this.type === 'submit') {
        form.requestSubmit();
      } else if (this.type === 'reset') {
        form.reset();
      }
    }
  };

  #isCurrentItem() {
    if (!this.listContext) {
      return this.isActive;
    }

    const { isControlled, currentItemElement } = this.listContext;

    // Match React's logic: if controlled AND currentElement exists, compare refs
    // Otherwise fall back to isActive (for initial state or uncontrolled mode)
    if (isControlled && currentItemElement) {
      return currentItemElement === this;
    }

    return this.isActive;
  }

  render() {
    // If href is set, render as link; otherwise render as button
    const isLink = !!this.href;
    const isButton = !isLink;
    const isCurrent = this.#isCurrentItem();

    const classes = {
      'item-link': true,
      'current': isCurrent,
      'link': isLink,
    };

    return html`
      <div id="container" class="item">
        ${isButton ? html`
          <button
            class=${classMap(classes)}
            type=${this.type}
            tabindex="-1"
            @click=${this.#handleClick}
          >
            <slot></slot>
          </button>
        ` : html`
          <a
            class=${classMap(classes)}
            href=${ifDefined(this.href || undefined)}
            tabindex="-1"
            @click=${this.#handleClick}
          >
            <slot></slot>
          </a>
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-simple-list-item': Pfv6SimpleListItem;
  }
}
