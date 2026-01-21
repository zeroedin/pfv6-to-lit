import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { provide } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import { accordionItemContext, type AccordionItemContext } from './context.js';
import styles from './pfv6-accordion-item.css';

// Re-export context for backwards compatibility
export { accordionItemContext, type AccordionItemContext } from './context.js';

/**
 * Accordion item component for individual expandable sections.
 *
 * @summary Accordion Item
 * @slot - Default slot for accordion toggle and content
 */
@customElement('pfv6-accordion-item')
export class Pfv6AccordionItem extends LitElement {
  static styles = styles;

  /**
   * Flag to indicate whether the accordion item is expanded.
   */
  @property({ type: Boolean, attribute: 'is-expanded' })
  isExpanded = false;

  /**
   * Context value provided to child components.
   * Updated whenever isExpanded changes.
   */
  @provide({ context: accordionItemContext })
  @state()
  protected _context: AccordionItemContext = {
    isExpanded: false,
  };

  protected override willUpdate(changedProperties: PropertyValues): void {
    // Always update context on first render or when isExpanded changes
    if (!this.hasUpdated || changedProperties.has('isExpanded')) {
      this._context = {
        isExpanded: this.isExpanded,
      };
    }
  }

  render() {
    const classes = {
      expanded: this.isExpanded,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-accordion-item': Pfv6AccordionItem;
  }
}
