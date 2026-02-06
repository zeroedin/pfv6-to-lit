import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import styles from './pfv6-clipboard-copy-toggle.css';

/**
 * The clipboard copy toggle button expands or collapses the expanded content area with an animated icon indicator showing the current state.
 *
 * Note: aria-controls should be set on this component's host element (not internally)
 * to properly reference sibling elements in the same shadow DOM.
 *
 * @alias ClipboardCopyToggle
 * @summary Button that expands or collapses the content area with animated icon
 * @cssprop --pf-v6-c-clipboard-copy__toggle-icon--Transition - Complete transition property for the toggle icon
 * @cssprop --pf-v6-c-clipboard-copy--m-expanded__toggle-icon--Rotate - Rotation angle of the toggle icon when expanded
 */
@customElement('pfv6-clipboard-copy-toggle')
export class Pfv6ClipboardCopyToggle extends LitElement {
  static styles = styles;

  /** Whether the content is expanded */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  render() {
    const iconClasses = {
      'toggle-icon': true,
      'expanded': this.isExpanded,
    };

    return html`
      <pfv6-button
        type="button"
        variant="control"
        aria-expanded=${this.isExpanded}
        aria-label=${this.getAttribute('aria-label') || 'Show content'}
      >
          <svg
            slot="icon"
            class=${classMap(iconClasses)}
            fill="currentColor"
            height="1em"
            width="1em"
            viewBox="0 0 256 512"
            aria-hidden="true"
          >
            <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
          </svg>
      </pfv6-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-clipboard-copy-toggle': Pfv6ClipboardCopyToggle;
  }
}
