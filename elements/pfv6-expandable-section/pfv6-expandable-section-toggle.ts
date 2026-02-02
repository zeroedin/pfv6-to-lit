import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import styles from './pfv6-expandable-section-toggle.css';

/**
 * Event fired when toggle is clicked.
 */
export class Pfv6ExpandableSectionToggleClickEvent extends Event {
  constructor(
    public isExpanded: boolean
  ) {
    super('toggle', { bubbles: true, composed: true });
  }
}

/**
 * Detached toggle for expandable section component.
 *
 * @summary Standalone toggle control for detached expandable sections
 * @alias ExpandableSectionToggle
 *
 * @fires Pfv6ExpandableSectionToggleClickEvent - Fired when toggle is clicked
 * @slot - Default slot for toggle content
 */
@customElement('pfv6-expandable-section-toggle')
export class Pfv6ExpandableSectionToggle extends LitElement {
  static readonly styles = styles;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** Whether the associated section is expanded */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** ID of the associated content element */
  @property({ type: String, attribute: 'content-id' })
  contentId = '';

  /** ID for this toggle element */
  @property({ type: String, attribute: 'toggle-id' })
  toggleId = '';

  /** Direction for the toggle arrow */
  @property({ type: String, reflect: true })
  direction: 'up' | 'down' = 'down';

  /** Whether the content is truncated */
  @property({ type: Boolean, reflect: true, attribute: 'has-truncated-content' })
  hasTruncatedContent = false;

  /** Whether this is a detached toggle */
  @property({ type: Boolean, reflect: true, attribute: 'is-detached' })
  isDetached = false;

  private _handleClick = () => {
    this.dispatchEvent(new Pfv6ExpandableSectionToggleClickEvent(!this.isExpanded));
  };

  render() {
    const classes = {
      expanded: this.isExpanded,
      truncate: this.hasTruncatedContent,
      detached: this.isDetached,
    };

    const iconClasses = {
      'toggle-icon': true,
      'expand-top': this.isExpanded && this.direction === 'up',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <div id="toggle" class="toggle">
          <pfv6-button
            variant="link"
            ?is-inline=${this.hasTruncatedContent}
            class="toggle-button"
            aria-expanded=${this.isExpanded}
            aria-controls=${this.contentId}
            id=${this.toggleId}
            @click=${this._handleClick}
          >
            ${!this.hasTruncatedContent ? html`
              <span slot="icon" class=${classMap(iconClasses)}>
                <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true">
                  <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
                </svg>
              </span>
            ` : null}
            <slot></slot>
          </pfv6-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-expandable-section-toggle': Pfv6ExpandableSectionToggle;
  }
}
