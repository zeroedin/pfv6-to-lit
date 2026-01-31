/* eslint-disable lit-a11y/list -- slot children are validated as li elements */
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { provide } from '@lit/context';
import { simpleListContext, type SimpleListContext } from './context.js';
import './pfv6-simple-list-group.js';
import './pfv6-simple-list-item.js';
import styles from './pfv6-simple-list.css';

/**
 * Event fired when a SimpleList item is selected.
 */
export class Pfv6SimpleListSelectEvent extends Event {
  constructor(
    public itemId?: string | number,
    public itemProps?: Record<string, unknown>,
  ) {
    super('select', { bubbles: true, composed: true });
  }
}

/**
 * SimpleList component for creating accessible lists with selectable items.
 *
 * @summary A list component for creating simple navigation or option lists
 * @alias SimpleList
 * @slot - Default slot for SimpleListItem or SimpleListGroup children
 * @fires Pfv6SimpleListSelectEvent - Fired when an item is selected
 * @cssprop --pf-v6-c-simple-list__item-link--PaddingBlockStart - Padding block start for item links
 * @cssprop --pf-v6-c-simple-list__item-link--PaddingInlineEnd - Padding inline end for item links
 * @cssprop --pf-v6-c-simple-list__item-link--PaddingBlockEnd - Padding block end for item links
 * @cssprop --pf-v6-c-simple-list__item-link--PaddingInlineStart - Padding inline start for item links
 * @cssprop --pf-v6-c-simple-list__item-link--BackgroundColor - Background color for item links
 * @cssprop --pf-v6-c-simple-list__item-link--Color - Text color for item links
 * @cssprop --pf-v6-c-simple-list__item-link--FontSize - Font size for item links
 * @cssprop --pf-v6-c-simple-list__item-link--m-current--Color - Text color for current item
 * @cssprop --pf-v6-c-simple-list__item-link--m-current--BackgroundColor - Background color for current item
 * @cssprop --pf-v6-c-simple-list__item-link--hover--Color - Text color for hovered items
 * @cssprop --pf-v6-c-simple-list__item-link--hover--BackgroundColor - Background color for hovered items
 * @cssprop --pf-v6-c-simple-list__item-link--BorderRadius - Border radius for item links
 * @cssprop --pf-v6-c-simple-list__item-link--BorderWidth - Border width for item links
 * @cssprop --pf-v6-c-simple-list__item-link--BorderColor - Border color for item links
 * @cssprop --pf-v6-c-simple-list__item-link--hover--BorderWidth - Border width for hovered item links
 * @cssprop --pf-v6-c-simple-list__item-link--m-current--BorderWidth - Border width for current item
 * @cssprop --pf-v6-c-simple-list__item-link--m-link--Color - Text color for link variant
 * @cssprop --pf-v6-c-simple-list__item-link--m-link--m-current--Color - Text color for link variant current state
 * @cssprop --pf-v6-c-simple-list__item-link--m-link--hover--Color - Text color for link variant hover state
 * @cssprop --pf-v6-c-simple-list__title--PaddingBlockStart - Padding block start for group titles
 * @cssprop --pf-v6-c-simple-list__title--PaddingInlineEnd - Padding inline end for group titles
 * @cssprop --pf-v6-c-simple-list__title--PaddingBlockEnd - Padding block end for group titles
 * @cssprop --pf-v6-c-simple-list__title--PaddingInlineStart - Padding inline start for group titles
 * @cssprop --pf-v6-c-simple-list__title--FontSize - Font size for group titles
 * @cssprop --pf-v6-c-simple-list__title--Color - Text color for group titles
 * @cssprop --pf-v6-c-simple-list__title--FontWeight - Font weight for group titles
 * @cssprop --pf-v6-c-simple-list__section--section--MarginBlockStart - Margin between group sections
 */
@customElement('pfv6-simple-list')
export class Pfv6SimpleList extends LitElement {
  static styles = styles;

  /**
   * Whether the component is controlled by its internal state.
   * When true, the component manages which item is current. When false, use the is-active property on items.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-controlled' })
  isControlled = true;

  /**
   * Aria-label for the internal list element.
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /** Current item element for controlled mode (like React's currentRef) */
  @state()
  private currentItemElement: HTMLElement | undefined;

  /**
   * Handle current item update from child items.
   */
  #handleUpdateCurrentItem = (
    itemElement: HTMLElement,
    itemId?: string | number,
    itemProps?: Record<string, unknown>,
  ) => {
    // Update state
    this.currentItemElement = itemElement;

    // Update context value (create new object for reactivity)
    this.contextValue = {
      currentItemElement: this.currentItemElement,
      isControlled: this.isControlled,
      updateCurrentItem: this.#handleUpdateCurrentItem,
    };

    // Fire select event
    this.dispatchEvent(new Pfv6SimpleListSelectEvent(itemId, itemProps));
  };

  /**
   * Context value provided to child items.
   * Using @provide decorator with @state for reactivity.
   */
  @provide({ context: simpleListContext })
  @state()
  private contextValue: SimpleListContext = {
    currentItemElement: undefined,
    isControlled: true,
    updateCurrentItem: this.#handleUpdateCurrentItem,
  };

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Update context when isControlled changes
    if (changedProperties.has('isControlled')) {
      this.contextValue = {
        currentItemElement: this.currentItemElement,
        isControlled: this.isControlled,
        updateCurrentItem: this.#handleUpdateCurrentItem,
      };
    }
  }

  #handleSlotChange = () => {
    // Update container to show/hide default list wrapper based on grouped state
    this.requestUpdate();
  };

  #isGrouped() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) {
      return false;
    }
    const nodes = slot.assignedElements();
    const [firstNode] = nodes;
    return (
      nodes.length > 0
      && firstNode?.tagName.toLowerCase() === 'pfv6-simple-list-group'
    );
  }

  render() {
    const isGrouped = this.#isGrouped();

    return html`
      <div id="container">
        ${isGrouped ?
          html` <slot @slotchange=${this.#handleSlotChange}></slot> `
          : html`
              <ul class="list" aria-label=${ifDefined(this.accessibleLabel)}>
                <slot @slotchange=${this.#handleSlotChange}></slot>
              </ul>
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-simple-list': Pfv6SimpleList;
  }
}
