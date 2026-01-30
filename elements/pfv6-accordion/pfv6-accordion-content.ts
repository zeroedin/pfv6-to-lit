import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { consume } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  accordionContext,
  accordionItemContext,
  type AccordionContext,
  type AccordionItemContext,
} from './context.js';
import styles from './pfv6-accordion-content.css';

/**
 * Accordion content component for expandable content areas.
 *
 * @summary Accordion Content
 * @slot - Default slot for content (wrapped in AccordionExpandableContentBody unless isCustomContent is true)
 */
@customElement('pfv6-accordion-content')
export class Pfv6AccordionContent extends LitElement {
  static styles = styles;

  #internals = this.attachInternals();

  @consume({ context: accordionContext, subscribe: true })
  @state()
  protected _accordionContext?: AccordionContext;

  @consume({ context: accordionItemContext, subscribe: true })
  @state()
  protected _itemContext?: AccordionItemContext;

  @state()
  private hasScrollbar = false;

  /**
   * Cached reference to sibling toggle element for aria-labelledby.
   */
  #siblingToggle: Element | null = null;

  /**
   * Flag to indicate accordion content is fixed (has max-height).
   */
  @property({ type: Boolean, attribute: 'is-fixed' })
  isFixed = false;

  /**
   * Accessible label for the accordion content.
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string | undefined;

  /**
   * ID of the controlling accordion toggle to label the content.
   */
  @property({ type: String, attribute: 'accessible-labelled-by' })
  accessibleLabelledBy?: string | undefined;

  /**
   * Flag indicating content is custom. Expanded content body wrapper will be removed from children.
   * This allows multiple bodies to be rendered as content.
   */
  @property({ type: Boolean, attribute: 'is-custom-content' })
  isCustomContent = false;

  override connectedCallback(): void {
    super.connectedCallback();
    // Find sibling toggle element (they share the same parent accordion-item)
    this.#siblingToggle = this.parentElement?.querySelector('pfv6-accordion-toggle') ?? null;
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    const asDefinitionList = this._accordionContext?.asDefinitionList ?? false;

    // Set role="definition" on host via ElementInternals when in definition list mode
    // For scrollable content not in definition list mode, use role="region" on the container instead
    this.#internals.role = asDefinitionList ? 'definition' : null;

    // Link content to sibling toggle via ElementInternals when in definition list mode
    // This provides proper accessibility for term/definition relationships
    if (asDefinitionList && this.#siblingToggle) {
      this.#internals.ariaLabelledByElements = [this.#siblingToggle];
    } else {
      this.#internals.ariaLabelledByElements = null;
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Check for scrollbar when isFixed or isExpanded changes
    // React dependency array: [containerRef, isFixed, isExpanded]
    if (changedProperties.has('isFixed') || changedProperties.has('_itemContext')) {
      this.#checkScrollbar();
    }
  }

  #checkScrollbar() {
    const container = this.shadowRoot?.getElementById('container');
    const isExpanded = this._itemContext?.isExpanded ?? false;

    if (container && this.isFixed && isExpanded) {
      const { offsetHeight, scrollHeight } = container;
      this.hasScrollbar = offsetHeight < scrollHeight;
    } else if (!this.isFixed) {
      this.hasScrollbar = false;
    }
  }

  render() {
    const asDefinitionList = this._accordionContext?.asDefinitionList ?? false;
    const isExpanded = this._itemContext?.isExpanded ?? false;

    const classes = {
      fixed: this.isFixed,
    };

    // Role is set on host via ElementInternals in willUpdate for definition list mode
    // Use role="region" on container for scrollable content when not a definition list
    const containerRole = !asDefinitionList && this.hasScrollbar ? 'region' : undefined;

    // ARIA labels are only set on container when NOT in definition list mode
    // In definition list mode, ariaLabelledByElements is set on :host via ElementInternals
    const containerAriaLabel = !asDefinitionList ? this.accessibleLabel : undefined;
    const containerAriaLabelledBy = !asDefinitionList ? this.accessibleLabelledBy : undefined;

    const content = this.isCustomContent ? html`
      <slot></slot>
    ` : html`
      <pfv6-accordion-expandable-content-body>
        <slot></slot>
      </pfv6-accordion-expandable-content-body>
    `;

    // Always use <div> - never <dd> (violates HTML spec with slotted content)
    return html`
      <div
        id="container"
        class=${classMap(classes)}
        ?hidden=${!isExpanded}
        aria-label=${ifDefined(containerAriaLabel)}
        aria-labelledby=${ifDefined(containerAriaLabelledBy)}
        tabindex=${ifDefined(this.hasScrollbar ? 0 : undefined)}
        role=${ifDefined(containerRole)}
      >
        ${content}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-accordion-content': Pfv6AccordionContent;
  }
}
