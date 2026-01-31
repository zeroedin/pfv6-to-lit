import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';
import { textInputGroupContext, type TextInputGroupContext } from './context.js';
import './pfv6-text-input-group-main.js';
import './pfv6-text-input-group-utilities.js';
import styles from './pfv6-text-input-group.css';

// Re-export context for consumers
export { textInputGroupContext, type TextInputGroupContext } from './context.js';

/**
 * Text input group component for grouping text inputs with utilities.
 *
 * @slot - Default slot for text input group content (main and utilities)
 * @cssprop --pf-v6-c-text-input-group--BackgroundColor - Background color
 * @cssprop --pf-v6-c-text-input-group--BorderColor - Border color
 * @cssprop --pf-v6-c-text-input-group--BorderWidth - Border width
 * @cssprop --pf-v6-c-text-input-group--m-success--BorderColor - Success state border color
 * @cssprop --pf-v6-c-text-input-group--m-warning--BorderColor - Warning state border color
 * @cssprop --pf-v6-c-text-input-group--m-error--BorderColor - Error state border color
 * @cssprop --pf-v6-c-text-input-group__text--BorderRadius--base - Border radius
 */
@customElement('pfv6-text-input-group')
export class Pfv6TextInputGroup extends LitElement {
  static styles = styles;

  /** Adds disabled styling and a disabled context value which text input group main hooks into for the input itself */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  /** Flag to indicate the toggle has no border or background */
  @property({ type: Boolean, reflect: true, attribute: 'is-plain' })
  isPlain = false;

  /** Status variant of the text input group */
  @property({ type: String, reflect: true })
  validated?: 'success' | 'warning' | 'error' | undefined;

  /** Context value provided to children */
  @provide({ context: textInputGroupContext })
  @state()
  protected _context: TextInputGroupContext = {
    isDisabled: false,
    validated: undefined,
  };

  @state()
  private _hasUtilities = false;

  willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('isDisabled') || changed.has('validated')) {
      this._context = {
        isDisabled: this.isDisabled,
        validated: this.validated,
      };
    }
  }

  #handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this._hasUtilities = slot.assignedElements()
        .some(el => el.localName === 'pfv6-text-input-group-utilities');
  }

  render() {
    const classes = {
      'disabled': this.isDisabled,
      'plain': this.isPlain,
      'success': this.validated === 'success',
      'warning': this.validated === 'warning',
      'error': this.validated === 'error',
      'has-utilities': this._hasUtilities,
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot @slotchange=${this.#handleSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-text-input-group': Pfv6TextInputGroup;
  }
}
