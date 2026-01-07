import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

// Auto-import sub-components
import './pfv6-sidebar-content.js';
import './pfv6-sidebar-panel.js';

import styles from './pfv6-sidebar.css';

/**
 * Sidebar component - A layout component for displaying content alongside a panel.
 *
 * @slot - Default slot for sidebar content (typically pfv6-sidebar-content and pfv6-sidebar-panel)
 */
@customElement('pfv6-sidebar')
export class Pfv6Sidebar extends LitElement {
  static readonly styles = styles;

  /**
   * Indicates the direction of the layout.
   * Default orientation is stack on small screens, and split on medium screens and above.
   *
   * @type {'stack' | 'split'}
   */
  @property({ type: String, reflect: true })
  orientation?: 'stack' | 'split';

  /**
   * Indicates that the panel is displayed to the right of the content when the orientation is split
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-panel-right' })
  isPanelRight = false;

  /**
   * Adds space between the panel and content
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-gutter' })
  hasGutter = false;

  /**
   * Removes the background color
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-no-background' })
  hasNoBackground = false;

  /**
   * Adds a border between the panel and content
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-border' })
  hasBorder = false;

  render() {
    // Classes for the outer container
    const containerClasses = {
      'gutter': this.hasGutter,
      'no-background': this.hasNoBackground,
      'panel-right': this.isPanelRight,
      'stack': this.orientation === 'stack',
      'split': this.orientation === 'split'
    };

    // Classes for the inner main element
    const mainClasses = {
      'border': this.hasBorder
    };

    return html`
      <div id="container" class=${classMap(containerClasses)}>
        <div id="main" class=${classMap(mainClasses)}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-sidebar': Pfv6Sidebar;
  }
}
