import { LitElement, html, type PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import styles from './pfv6-gallery-item.css';

/**
 * Gallery Item is a wrapper component for items within a Gallery layout.
 * 
 * @slot - Default slot for item content
 */
@customElement('pfv6-gallery-item')
export class Pfv6GalleryItem extends LitElement {
  static readonly styles = styles;
  static readonly formAssociated = true;

  /**
   * Sets the semantic role of the gallery item (e.g., 'listitem' when used in a list gallery)
   */
  @property({ type: String })
  component: 'div' | 'li' = 'div';

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has('component')) {
      // Map component type to ARIA role
      if (this.component === 'li') {
        this.internals.role = 'listitem';
      } else {
        this.internals.role = null;
      }
    }
  }

  render() {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-gallery-item': Pfv6GalleryItem;
  }
}

