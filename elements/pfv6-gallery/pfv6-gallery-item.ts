import { LitElement, type PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

/**
 * Gallery Item is a wrapper component for items within a Gallery layout.
 * 
 * This component uses Light DOM (no Shadow DOM) to participate naturally
 * in the parent gallery's grid layout, matching React PatternFly behavior.
 * 
 * **Note**: Styles are defined in `pfv6-gallery-lightdom.css` (same file as parent gallery).
 */
@customElement('pfv6-gallery-item')
export class Pfv6GalleryItem extends LitElement {
  static readonly formAssociated = true;

  /**
   * Sets the semantic role of the gallery item (e.g., 'listitem' when used in a list gallery)
   */
  @property({ reflect: true })
  component: 'div' | 'li' = 'div';

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  /**
   * Disable Shadow DOM - children exist in Light DOM
   * This allows the gallery item to participate directly in parent's grid layout
   */
  createRenderRoot() {
    return this;
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
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-gallery-item': Pfv6GalleryItem;
  }
}

