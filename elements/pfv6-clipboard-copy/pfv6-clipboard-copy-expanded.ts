import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-clipboard-copy-expanded.css';

/**
 * Event fired when expanded content text changes.
 */
export class Pfv6ClipboardCopyExpandedChangeEvent extends Event {
  constructor(
    public text: string
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * The expanded content area provides an editable region for displaying and modifying longer text or code content with support for read-only mode and syntax-aware formatting.
 *
 * @alias ClipboardCopyExpanded
 * @summary Editable content area for expanded clipboard copy content
 * @slot - Default slot for expanded content
 * @fires Pfv6ClipboardCopyExpandedChangeEvent - Fired when content changes
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--MarginBlockStart - Top margin of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--PaddingBlockStart - Top padding of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--PaddingBlockEnd - Bottom padding of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--PaddingInlineStart - Left padding of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--PaddingInlineEnd - Right padding of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BackgroundColor - Background color of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BorderBlockStartWidth - Top border width of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BorderBlockEndWidth - Bottom border width of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BorderInlineStartWidth - Left border width of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BorderInlineEndWidth - Right border width of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BorderColor - Border color of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BorderRadius - Border radius of the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--OutlineOffset - Outline offset for the expandable content
 * @cssprop --pf-v6-c-clipboard-copy__expandable-content--BoxShadow - Box shadow of the expandable content
 */
@customElement('pfv6-clipboard-copy-expanded')
export class Pfv6ClipboardCopyExpanded extends LitElement {
  static styles = styles;

  /** Flag to show if the content is read only */
  @property({ type: Boolean, reflect: true, attribute: 'is-read-only' })
  isReadOnly = false;

  /** Flag to determine if content is code */
  @property({ type: Boolean, reflect: true, attribute: 'is-code' })
  isCode = false;

  #handleInput(event: Event) {
    const target = event.target as HTMLDivElement;
    const text = target.innerText || '';
    this.dispatchEvent(new Pfv6ClipboardCopyExpandedChangeEvent(text));
  }

  render() {
    const content = html`<slot></slot>`;

    return html`
      <div
        id="container"
        contenteditable=${!this.isReadOnly}
        @input=${this.#handleInput}
      >
        ${this.isCode ? html`<pre dir="ltr">${content}</pre>` : content}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-clipboard-copy-expanded': Pfv6ClipboardCopyExpanded;
  }
}
