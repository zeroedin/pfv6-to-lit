import { LitElement, html } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators/state.js';
import { consume } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import { getRandomId } from '@patternfly/pfe-core/functions/random.js';
// Note: ifDefined removed - role is now set via ElementInternals
import {
  accordionContext,
  accordionItemContext,
  type AccordionContext,
  type AccordionItemContext,
} from './context.js';
import styles from './pfv6-accordion-toggle.css';

/**
 * Accordion toggle component for expanding/collapsing accordion items.
 *
 * @summary Accordion Toggle
 * @slot - Default slot for toggle text content
 */
@customElement('pfv6-accordion-toggle')
export class Pfv6AccordionToggle extends LitElement {
  static styles = styles;

  #internals = this.attachInternals();

  @consume({ context: accordionContext, subscribe: true })
  @state()
  protected _accordionContext?: AccordionContext;

  @consume({ context: accordionItemContext, subscribe: true })
  @state()
  protected _itemContext?: AccordionItemContext;

  override connectedCallback(): void {
    super.connectedCallback();
    // Auto-generate ID if not set (needed for aria-labelledby on content)
    if (!this.id) {
      this.id = getRandomId('pfv6-accordion-toggle');
    }
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    // Set role="term" on host via ElementInternals when in definition list mode
    const asDefinitionList = this._accordionContext?.asDefinitionList ?? false;
    this.#internals.role = asDefinitionList ? 'term' : null;
  }

  #renderToggleIcon(): TemplateResult {
    return html`
      <span id="icon">
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true" role="img">
          <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
        </svg>
      </span>
    `;
  }

  #renderButton(): TemplateResult {
    const isExpanded = this._itemContext?.isExpanded ?? false;
    const togglePosition = this._accordionContext?.togglePosition ?? 'end';
    const isToggleStartPositioned = togglePosition === 'start';

    const classes = {
      expanded: isExpanded,
    };

    return html`
      <button
        id="toggle"
        class=${classMap(classes)}
        aria-expanded=${isExpanded}
        type="button"
      >
        ${isToggleStartPositioned ? this.#renderToggleIcon() : null}
        <span id="text"><slot></slot></span>
        ${!isToggleStartPositioned ? this.#renderToggleIcon() : null}
      </button>
    `;
  }

  render() {
    const headingLevel = this._accordionContext?.headingLevel ?? 'h3';

    // Role is set on host via ElementInternals in willUpdate
    // Always use heading elements - never <dt> (violates HTML spec with slotted content)
    switch (headingLevel) {
      case 'h1':
        return html`<h1 id="container">${this.#renderButton()}</h1>`;
      case 'h2':
        return html`<h2 id="container">${this.#renderButton()}</h2>`;
      case 'h3':
        return html`<h3 id="container">${this.#renderButton()}</h3>`;
      case 'h4':
        return html`<h4 id="container">${this.#renderButton()}</h4>`;
      case 'h5':
        return html`<h5 id="container">${this.#renderButton()}</h5>`;
      case 'h6':
        return html`<h6 id="container">${this.#renderButton()}</h6>`;
      default:
        return html`<h3 id="container">${this.#renderButton()}</h3>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-accordion-toggle': Pfv6AccordionToggle;
  }
}
