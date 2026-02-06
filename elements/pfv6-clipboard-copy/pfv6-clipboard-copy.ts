import { LitElement, html, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@pfv6/elements/pfv6-button/pfv6-button.js';
import '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import '@pfv6/elements/pfv6-text-input/pfv6-text-input.js';
import '@pfv6/elements/pfv6-truncate/pfv6-truncate.js';
import './pfv6-clipboard-copy-button.js';
import './pfv6-clipboard-copy-toggle.js';
import './pfv6-clipboard-copy-expanded.js';
import './pfv6-clipboard-copy-action.js';
import styles from './pfv6-clipboard-copy.css';

/**
 * Event fired when text is copied to clipboard.
 */
export class Pfv6ClipboardCopyCopyEvent extends Event {
  constructor(
    public text: string
  ) {
    super('copy', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when text value changes.
 */
export class Pfv6ClipboardCopyChangeEvent extends Event {
  constructor(
    public text: string
  ) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Event fired when expansion state changes.
 */
export class Pfv6ClipboardCopyExpandEvent extends Event {
  constructor(
    public expanded: boolean
  ) {
    super('expand', { bubbles: true, composed: true });
  }
}

/**
 * A clipboard copy component enables users to copy text content to the clipboard with support for multiple display variants including inline, expansion, and inline-compact modes with optional truncation.
 *
 * @alias ClipboardCopy
 * @summary Allows users to copy text to clipboard with multiple display variants
 * @slot - Default slot for text content (string)
 * @slot additional-actions - Additional action buttons (should use pfv6-clipboard-copy-action wrapper)
 * @fires Pfv6ClipboardCopyCopyEvent - Fired when copy button is clicked
 * @fires Pfv6ClipboardCopyChangeEvent - Fired when text value changes
 * @fires Pfv6ClipboardCopyExpandEvent - Fired when expansion state changes
 * @cssprop --pf-v6-c-clipboard-copy__toggle-icon--TransitionDuration - Duration of the toggle icon transition
 * @cssprop --pf-v6-c-clipboard-copy__toggle-icon--TransitionTimingFunction - Timing function of the toggle icon transition
 * @cssprop --pf-v6-c-clipboard-copy__toggle-icon--Transition - Complete transition property for the toggle icon
 * @cssprop --pf-v6-c-clipboard-copy--m-expanded__toggle-icon--Rotate - Rotation angle of the toggle icon when expanded
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
 * @cssprop --pf-v6-c-clipboard-copy__group--Gap - Gap between items in the group
 * @cssprop --pf-v6-c-clipboard-copy--m-inline--PaddingInlineStart - Left padding of inline variant
 * @cssprop --pf-v6-c-clipboard-copy--m-inline--PaddingInlineEnd - Right padding of inline variant
 * @cssprop --pf-v6-c-clipboard-copy--m-inline--BackgroundColor - Background color of inline variant
 * @cssprop --pf-v6-c-clipboard-copy__actions--Gap - Gap between action buttons
 * @cssprop --pf-v6-c-clipboard-copy__actions--MarginInlineStart - Left margin of the actions container
 * @cssprop --pf-v6-c-clipboard-copy__actions-item--button--Color - Color of action buttons
 * @cssprop --pf-v6-c-clipboard-copy__actions-item--button--hover--Color - Hover color of action buttons
 * @cssprop --pf-v6-c-clipboard-copy__text--m-code--FontFamily - Font family for code text
 * @cssprop --pf-v6-c-clipboard-copy__text--m-code--FontSize - Font size for code text
 */
@customElement('pfv6-clipboard-copy')
export class Pfv6ClipboardCopy extends LitElement {
  static styles = styles;

  /** Variant of the clipboard copy component */
  @property({ type: String, reflect: true })
  variant: 'inline' | 'expansion' | 'inline-compact' = 'inline';

  /** Tooltip message to display when hovering the copy button */
  @property({ type: String, attribute: 'hover-tip' })
  hoverTip = 'Copy to clipboard';

  /** Tooltip message to display when clicking the copy button */
  @property({ type: String, attribute: 'click-tip' })
  clickTip = 'Successfully copied to clipboard!';

  /** Aria-label to use on the copy button */
  @property({ type: String, attribute: 'copy-aria-label' })
  copyAriaLabel?: string | undefined;

  /** Aria-label to use on the TextInput */
  @property({ type: String, attribute: 'text-aria-label' })
  textAriaLabel = 'Copyable input';

  /** Aria-label to use on the toggle button */
  @property({ type: String, attribute: 'toggle-aria-label' })
  toggleAriaLabel = 'Show content';

  /** Flag to show if the input is read only */
  @property({ type: Boolean, reflect: true, attribute: 'is-read-only' })
  isReadOnly = false;

  /** Flag to determine if clipboard copy is in the expanded state initially */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** Flag to determine if clipboard copy content includes code */
  @property({ type: Boolean, reflect: true, attribute: 'is-code' })
  isCode = false;

  /** Flag to determine if inline clipboard copy should be block styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-block' })
  isBlock = false;

  /** Copy button tooltip position */
  @property({ type: String })
  position:
    | 'auto' | 'top' | 'bottom' | 'left' | 'right'
    | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
    | 'left-start' | 'left-end' | 'right-start' | 'right-end' = 'top';

  /** Maximum width of the tooltip */
  @property({ type: String, attribute: 'max-width' })
  maxWidth = '150px';

  /** Delay in ms before the tooltip disappears */
  @property({ type: Number, attribute: 'exit-delay' })
  exitDelay = 1500;

  /** Delay in ms before the tooltip appears */
  @property({ type: Number, attribute: 'entry-delay' })
  entryDelay = 300;

  /** Enable truncation for inline-compact variant */
  @property({ type: Boolean })
  truncation = false;

  /** Position of truncation (start, middle, or end) */
  @property({ type: String, attribute: 'truncation-position' })
  truncationPosition: 'start' | 'middle' | 'end' = 'end';

  @state() private text = '';
  @state() private expanded = false;
  @state() private copied = false;
  @state() private textWhenExpanded = '';

  private textId = `text-${Math.random().toString(36).substr(2, 9)}`;
  private toggleId = `toggle-${Math.random().toString(36).substr(2, 9)}`;
  private contentId = `content-${Math.random().toString(36).substr(2, 9)}`;

  override connectedCallback() {
    super.connectedCallback();
    // Initialize state from properties
    this.expanded = this.isExpanded;
    this.#updateTextFromSlot();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('isExpanded')) {
      this.expanded = this.isExpanded;
    }
  }

  #updateTextFromSlot() {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      const nodes = slot.assignedNodes({ flatten: true });
      const textContent = nodes
          .map(node => node.textContent || '')
          .join(' ')
          .trim();
      this.text = textContent;
      this.textWhenExpanded = textContent;
    }
  }

  #handleSlotChange() {
    this.#updateTextFromSlot();
  }

  #handleCopy() {
    const copyableText = this.expanded ? this.textWhenExpanded : this.text;

    // Attempt to copy to clipboard
    try {
      navigator.clipboard.writeText(copyableText);
      this.copied = true;

      // Dispatch copy event
      this.dispatchEvent(new Pfv6ClipboardCopyCopyEvent(copyableText));
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }

  #handleTooltipHidden() {
    // Reset copied state when tooltip finishes hiding
    this.copied = false;
  }

  #handleTextChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.text = input.value;
    this.dispatchEvent(new Pfv6ClipboardCopyChangeEvent(this.text));
  }

  #handleExpandedTextChange(event: Event) {
    const target = event.target as HTMLElement;
    const newText = target.innerText || '';
    this.textWhenExpanded = newText;
    this.dispatchEvent(new Pfv6ClipboardCopyChangeEvent(newText));
  }

  #handleToggle() {
    this.expanded = !this.expanded;

    // Sync text states on toggle
    if (this.expanded) {
      this.textWhenExpanded = this.text;
    } else {
      this.text = this.textWhenExpanded;
    }

    this.dispatchEvent(new Pfv6ClipboardCopyExpandEvent(this.expanded));
  }

  render(): TemplateResult {
    const classes = {
      inline: this.variant === 'inline-compact',
      block: this.isBlock,
      expanded: this.expanded,
      truncate: this.truncation,
    };

    const copyableText = this.expanded ? this.textWhenExpanded : this.text;
    const isInputReadOnly = this.isReadOnly || this.expanded;
    const copyAriaLabel = this.copyAriaLabel ?? this.hoverTip;

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot @slotchange=${this.#handleSlotChange} style="display: none;"></slot>
        ${this.variant === 'inline-compact' ? html`
          ${this.truncation ? html`
            <pfv6-truncate
              class="text"
              id=${this.textId}
              position=${this.truncationPosition}
              content=${this.text}
            ></pfv6-truncate>
          ` : this.isCode ? html`
            <code class="text code" id=${this.textId}>${this.text}</code>
          ` : html`
            <span class="text" id=${this.textId}>${this.text}</span>
          `}
          <span class="actions">
            <span class="actions-item">
              <pfv6-clipboard-copy-button
                variant="plain"
                exit-delay=${this.exitDelay}
                entry-delay=${this.entryDelay}
                max-width=${this.maxWidth}
                position=${this.position}
                aria-label=${copyAriaLabel}
                has-no-padding
                tooltip-content=${this.copied ? this.clickTip : this.hoverTip}
                @click=${this.#handleCopy}
                @tooltip-hidden=${this.#handleTooltipHidden}
              ></pfv6-clipboard-copy-button>
            </span>
            <slot name="additional-actions"></slot>
          </span>
        ` : html`
          <div class="group">
            ${this.variant === 'expansion' ? html`
              <pfv6-clipboard-copy-toggle
                ?is-expanded=${this.expanded}
                id=${this.toggleId}
                aria-label=${this.toggleAriaLabel}
                @click=${this.#handleToggle}
              ></pfv6-clipboard-copy-toggle>
            ` : nothing}
            <pfv6-text-input
              read-only-variant=${ifDefined(isInputReadOnly ? 'default' : undefined)}
              dir=${ifDefined(this.isCode ? 'ltr' : undefined)}
            >
              <input
                type="text"
                aria-label=${this.textAriaLabel}
                .value=${copyableText}
                ?readonly=${isInputReadOnly}
                @input=${this.#handleTextChange}
              />
            </pfv6-text-input>
            <pfv6-clipboard-copy-button
              exit-delay=${this.exitDelay}
              entry-delay=${this.entryDelay}
              max-width=${this.maxWidth}
              position=${this.position}
              aria-label=${copyAriaLabel}
              tooltip-content=${this.copied ? this.clickTip : this.hoverTip}
              @click=${this.#handleCopy}
              @tooltip-hidden=${this.#handleTooltipHidden}
            ></pfv6-clipboard-copy-button>
          </div>
          ${this.expanded ? html`
            <pfv6-clipboard-copy-expanded
              ?is-read-only=${this.isReadOnly}
              ?is-code=${this.isCode}
              id=${this.contentId}
              @change=${this.#handleExpandedTextChange}
            >${this.text}</pfv6-clipboard-copy-expanded>
          ` : nothing}
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-clipboard-copy': Pfv6ClipboardCopy;
  }
}
