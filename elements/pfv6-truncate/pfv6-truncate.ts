import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref, createRef } from 'lit/directives/ref.js';
import type { Ref } from 'lit/directives/ref.js';
import '@pfv6/elements/pfv6-tooltip/pfv6-tooltip.js';
import styles from './pfv6-truncate.css';

const minWidthCharacters = 12;

/**
 * Truncate is a utility component that automatically truncates long text based on container width or character count, displaying the full content in a tooltip on interaction.
 *
 * @alias Truncate
 * @summary Text truncation with automatic tooltip display
 * @cssprop --pf-v6-c-truncate--MinWidth - Minimum width of the truncate container
 * @cssprop --pf-v6-c-truncate__start--MinWidth - Minimum width of the start position truncate section
 */
@customElement('pfv6-truncate')
export class Pfv6Truncate extends LitElement {
  static styles = styles;

  /** Text to truncate */
  @property({ type: String })
  content = '';

  /** An HREF to turn the truncate wrapper into an anchor element */
  @property({ type: String })
  href?: string | undefined;

  /** The number of characters displayed in the second half of a middle truncation */
  @property({ type: Number, attribute: 'trailing-num-chars' })
  trailingNumChars = 7;

  /** The maximum number of characters to display before truncating */
  @property({ type: Number, attribute: 'max-chars-displayed' })
  maxCharsDisplayed?: number | undefined;

  /** The content to use to signify omission of characters */
  @property({ type: String, attribute: 'omission-content' })
  omissionContent = '\u2026';

  /** Where the text will be truncated */
  @property({ type: String, reflect: true })
  position: 'start' | 'middle' | 'end' = 'end';

  /** Tooltip position */
  @property({ type: String, reflect: true, attribute: 'tooltip-position' })
  tooltipPosition:
    | 'auto'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end' = 'top';

  @state()
  private isTruncated = true;

  @state()
  private shouldRenderByMaxChars = false;

  private textRef: Ref<HTMLElement> = createRef();
  private resizeObserver?: ResizeObserver | undefined;

  override connectedCallback() {
    super.connectedCallback();
    this.shouldRenderByMaxChars = (this.maxCharsDisplayed ?? 0) > 0;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanupResizeObserver();
  }

  override async firstUpdated() {
    // Wait for layout to complete before measuring
    await this.updateComplete;
    requestAnimationFrame(() => {
      this.#setupResizeObserver();
    });
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('maxCharsDisplayed')) {
      this.shouldRenderByMaxChars = (this.maxCharsDisplayed ?? 0) > 0;
    }

    if (
      changedProperties.has('maxCharsDisplayed')
      || changedProperties.has('content')
    ) {
      if (this.shouldRenderByMaxChars) {
        this.isTruncated = this.content.length > (this.maxCharsDisplayed ?? 0);
      }
    }

    if (
      changedProperties.has('content')
      || changedProperties.has('position')
      || changedProperties.has('trailingNumChars')
      || changedProperties.has('shouldRenderByMaxChars')
    ) {
      this.#setupResizeObserver();
    }
  }

  #cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  #setupResizeObserver() {
    this.#cleanupResizeObserver();

    if (this.shouldRenderByMaxChars) {
      return;
    }

    const textElement = this.textRef.value;
    // React observes the parent of the truncate wrapper, not the wrapper itself.
    // With Shadow DOM, we observe the light DOM parent of the custom element.
    const { parentElement } = this;

    if (!textElement || !parentElement) {
      return;
    }

    const textWidth = this.#calculateTextWidth(textElement);

    this.resizeObserver = new ResizeObserver(() => {
      if (!parentElement) {
        return;
      }
      const parentWidth = this.#getActualWidth(parentElement);
      this.isTruncated = textWidth >= parentWidth;
    });

    this.resizeObserver.observe(parentElement);

    // Initial check
    const parentWidth = this.#getActualWidth(parentElement);
    this.isTruncated = textWidth >= parentWidth;
  }

  #getActualWidth(element: Element): number {
    const computedStyle = getComputedStyle(element);
    return (
      parseFloat(computedStyle.width)
      - parseFloat(computedStyle.paddingLeft)
      - parseFloat(computedStyle.paddingRight)
      - parseFloat(computedStyle.borderRightWidth)
      - parseFloat(computedStyle.borderLeftWidth)
    );
  }

  #calculateTextWidth(element: Element): number {
    if (this.position === 'middle') {
      const firstTextWidth = element.scrollWidth;
      const firstTextLength = this.content.length;
      return (firstTextWidth / firstTextLength) * this.trailingNumChars + firstTextWidth;
    }
    return element.scrollWidth;
  }

  #sliceTrailingContent(str: string, slice: number): [string, string] {
    return [str.slice(0, str.length - slice), str.slice(-slice)];
  }

  #renderResizeObserverContent() {
    const lrmEntity = html`&lrm;`;
    const isStartPosition = this.position === 'start';
    const isEndPosition = this.position === 'end';

    if (isEndPosition || isStartPosition) {
      // React inverts these: 'end' position uses __start class, 'start' position uses __end class
      const classes = {
        start: isEndPosition,
        end: isStartPosition,
      };

      return html`<span ${ref(this.textRef)} class=${classMap(classes)}>${isStartPosition ? lrmEntity : null}${this.content}${isStartPosition ? lrmEntity : null}</span>`;
    }

    // Middle truncation
    const shouldSliceContent = this.content.length - this.trailingNumChars > minWidthCharacters;
    const [firstPart, secondPart] = shouldSliceContent ?
      this.#sliceTrailingContent(this.content, this.trailingNumChars)
      : [this.content, ''];

    return html`<span ${ref(this.textRef)} class="start">${shouldSliceContent ? firstPart : this.content}</span>${shouldSliceContent ? html`<span class="end">${secondPart}</span>` : null}`;
  }

  #renderMaxDisplayContent() {
    if (!this.isTruncated) {
      return html`<span class="text">${this.content}</span>`;
    }

    const maxChars = this.maxCharsDisplayed ?? 0;
    const omissionElement = html`
      <span class="omission" aria-hidden="true">${this.omissionContent}</span>
    `;

    if (this.position === 'start') {
      const visibleContent = this.content.slice(maxChars * -1);
      const hiddenContent = this.content.slice(0, maxChars * -1);

      return html`
        <span class="pf-v6-screen-reader">${hiddenContent}</span>
        ${omissionElement}
        <span class="text">${visibleContent}</span>
      `;
    }

    if (this.position === 'end') {
      const visibleContent = this.content.slice(0, maxChars);
      const hiddenContent = this.content.slice(maxChars);

      return html`
        <span class="text">${visibleContent}</span>
        ${omissionElement}
        <span class="pf-v6-screen-reader">${hiddenContent}</span>
      `;
    }

    // Middle truncation
    const trueMiddleStart = Math.floor(maxChars / 2);
    const trueMiddleEnd = Math.ceil(maxChars / 2) * -1;
    const firstVisible = this.content.slice(0, trueMiddleStart);
    const hidden = this.content.slice(trueMiddleStart, trueMiddleEnd);
    const secondVisible = this.content.slice(trueMiddleEnd);

    return html`
      <span class="text">${firstVisible}</span>
      ${omissionElement}
      <span class="pf-v6-screen-reader">${hidden}</span>
      <span class="text">${secondVisible}</span>
    `;
  }

  render() {
    const classes = {
      fixed: this.shouldRenderByMaxChars,
    };

    const containerClasses = {
      container: true,
    };

    const renderContent = this.shouldRenderByMaxChars ?
      this.#renderMaxDisplayContent()
      : this.#renderResizeObserverContent();

    const truncateBody = this.href ?
      html`
          <a
            href=${ifDefined(this.href)}
            class=${classMap(classes)}
          >
            ${renderContent}
          </a>
        `
      : html`
          <span
            class=${classMap(classes)}
            tabindex=${ifDefined(this.isTruncated ? '0' : undefined)}
          >
            ${renderContent}
          </span>
        `;

    return html`
      <span id="wrapper" class=${classMap(containerClasses)}>
        ${this.isTruncated ? html`
          <pfv6-tooltip
            ?hidden=${!this.isTruncated}
            position=${this.tooltipPosition}
            .content=${this.content}
          >
            ${truncateBody}
          </pfv6-tooltip>
        ` : truncateBody}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-truncate': Pfv6Truncate;
  }
}
