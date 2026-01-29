import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-tree-view-search.css';

/**
 * Event fired when search input value changes.
 */
export class Pfv6TreeViewSearchEvent extends Event {
  constructor(
    public value: string
  ) {
    super('search', { bubbles: true, composed: true });
  }
}

/**
 * Search input component for tree view. Should be slotted into the tree view's toolbar slot.
 *
 * @summary Search input for filtering tree view
 * @fires {Pfv6TreeViewSearchEvent} search - Fired when search input changes
 */
@customElement('pfv6-tree-view-search')
export class Pfv6TreeViewSearch extends LitElement {
  static styles = styles;

  /** Accessible label for the search input */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel = 'Search';

  /** Name attribute for the search input */
  @property({ type: String })
  name?: string;

  /** Placeholder text for the search input */
  @property({ type: String })
  placeholder?: string;

  /** Value of the search input */
  @property({ type: String })
  value = '';

  #handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new Pfv6TreeViewSearchEvent(this.value));
  };

  render() {
    return html`
      <div id="container">
        <div id="form-control">
          <input
            type="search"
            name=${ifDefined(this.name)}
            aria-label=${this.accessibleLabel}
            placeholder=${ifDefined(this.placeholder)}
            .value=${this.value}
            @input=${this.#handleInput}
          />
          <div id="utilities">
            <div id="icon">
              <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true">
                <path d="M505.04 442.66l-99.71-99.69c-4.5-4.5-10.6-7-17-7h-16.3c27.6-35.3 44-79.69 44-127.99C416.03 93.09 322.92 0 208.02 0S0 93.09 0 207.98s93.11 207.98 208.02 207.98c48.3 0 92.71-16.4 128.01-44v16.3c0 6.4 2.5 12.5 7 17l99.71 99.69c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.59.1-33.99zm-297.02-90.7c-79.54 0-144-64.34-144-143.98 0-79.53 64.35-143.98 144-143.98 79.54 0 144 64.34 144 143.98 0 79.53-64.35 143.98-144 143.98zm.02-239.96c-40.78 0-73.84 33.05-73.84 73.83 0 32.96 32.47 59.65 73.84 59.65 40.84 0 73.43-26.85 73.43-59.65-.01-40.7-32.5-73.83-73.43-73.83z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-tree-view-search': Pfv6TreeViewSearch;
  }
}
