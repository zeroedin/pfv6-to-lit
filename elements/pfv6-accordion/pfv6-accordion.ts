import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { provide } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { accordionContext, type AccordionContext } from './context.js';
import './pfv6-accordion-item.js';
import './pfv6-accordion-toggle.js';
import './pfv6-accordion-content.js';
import './pfv6-accordion-expandable-content-body.js';
import styles from './pfv6-accordion.css';

// Re-export context for backwards compatibility
export { accordionContext, type AccordionContext } from './context.js';

/**
 * Accordion component for grouping and organizing expandable content sections.
 *
 * When aria-label is set on the host element, the accordion behaves as a region landmark.
 *
 * @summary Accordion
 * @slot - Default slot for accordion items
 * @cssprop --pf-v6-c-accordion--BackgroundColor - Background color of accordion
 * @cssprop --pf-v6-c-accordion--RowGap - Row gap between accordion items
 */
@customElement('pfv6-accordion')
export class Pfv6Accordion extends LitElement {
  static styles = styles;

  #internals = this.attachInternals();

  /**
   * Heading level to use for accordion toggles.
   */
  @property({ type: String, attribute: 'heading-level' })
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h3';

  /**
   * Flag to indicate whether to use definition list semantics.
   * When present, applies ARIA roles for definition list structure.
   */
  @property({ type: Boolean, attribute: 'as-definition-list' })
  asDefinitionList = false;

  /**
   * Flag to indicate the accordion has a border.
   */
  @property({ type: Boolean, attribute: 'is-bordered' })
  isBordered = false;

  /**
   * Display size variant.
   */
  @property({ type: String, attribute: 'display-size' })
  displaySize: 'default' | 'lg' = 'default';

  /**
   * Sets the toggle icon position for all accordion toggles.
   */
  @property({ type: String, attribute: 'toggle-position' })
  togglePosition: 'start' | 'end' = 'end';

  /**
   * Accessible label for the accordion.
   * When set, the accordion becomes a region landmark.
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /**
   * Context value provided to child components.
   * Updated whenever relevant properties change.
   */
  @provide({ context: accordionContext })
  @state()
  protected _context: AccordionContext = {
    headingLevel: 'h3',
    asDefinitionList: false,
    togglePosition: 'end',
  };

  protected override willUpdate(changedProperties: PropertyValues): void {
    // Always update context on first render or when relevant properties change
    if (
      !this.hasUpdated
      || changedProperties.has('headingLevel')
      || changedProperties.has('asDefinitionList')
      || changedProperties.has('togglePosition')
    ) {
      this._context = {
        headingLevel: this.headingLevel,
        asDefinitionList: this.asDefinitionList,
        togglePosition: this.togglePosition,
      };
    }

    // Set region role and label on host via ElementInternals when accessibleLabel is present
    if (!this.hasUpdated || changedProperties.has('accessibleLabel')) {
      if (this.accessibleLabel) {
        this.#internals.role = 'region';
        this.#internals.ariaLabel = this.accessibleLabel;
      } else {
        this.#internals.role = null;
        this.#internals.ariaLabel = null;
      }
    }
  }

  render() {
    const classes = {
      'bordered': this.isBordered,
      'toggle-start': this.togglePosition === 'start',
      'display-lg': this.displaySize === 'lg',
    };

    // Container role is 'list' when using definition list semantics
    // Child toggle/content components use role="term" and role="definition"
    return html`
      <div
        id="container"
        class=${classMap(classes)}
        role=${ifDefined(this.asDefinitionList ? 'list' : undefined)}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-accordion': Pfv6Accordion;
  }
}
