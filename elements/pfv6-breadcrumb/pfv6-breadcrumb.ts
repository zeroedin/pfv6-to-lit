import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import './pfv6-breadcrumb-item.js';
import './pfv6-breadcrumb-heading.js';
import styles from './pfv6-breadcrumb.css';

/**
 * Breadcrumb component for navigation hierarchy.
 *
 * @alias Breadcrumb
 * @summary Navigation component displaying the current page's location within a hierarchy
 * @slot - Default slot for breadcrumb items (pfv6-breadcrumb-item or pfv6-breadcrumb-heading)
 * @cssprop --pf-v6-c-breadcrumb__item--FontSize - Font size for breadcrumb items
 * @cssprop --pf-v6-c-breadcrumb__item--LineHeight - Line height for breadcrumb items
 * @cssprop --pf-v6-c-breadcrumb__item--MarginInlineEnd - Margin between breadcrumb items
 */
@customElement('pfv6-breadcrumb')
export class Pfv6Breadcrumb extends LitElement {
  static styles = styles;

  /**
   * Accessible label for the breadcrumb navigation.
   * @default 'Breadcrumb'
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel = 'Breadcrumb';

  render() {
    return html`
      <nav aria-label=${this.accessibleLabel}>
        <div id="list" role="list">
          <slot></slot>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-breadcrumb': Pfv6Breadcrumb;
  }
}
