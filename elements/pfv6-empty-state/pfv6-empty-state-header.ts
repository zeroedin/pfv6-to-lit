import { LitElement, html, svg, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import styles from './pfv6-empty-state-header.css';

type StatusType = 'success' | 'danger' | 'warning' | 'info' | 'custom';

// Status icons matching PatternFly React statusIcons
const statusIcons: Record<StatusType, TemplateResult> = {
  success: svg`<svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg>`,
  danger: svg`<svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path></svg>`,
  warning: svg`<svg fill="currentColor" height="1em" width="1em" viewBox="0 0 576 512" aria-hidden="true" role="img"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>`,
  info: svg`<svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>`,
  custom: svg`<svg fill="currentColor" height="1em" width="1em" viewBox="0 0 448 512" aria-hidden="true" role="img"><path d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path></svg>`,
};

/**
 * EmptyStateHeader component for displaying title and icon within an empty state.
 *
 * @summary EmptyStateHeader
 * @alias EmptyStateHeader
 *
 * @slot icon - Optional custom icon to override the auto-generated status icon. When empty and status is set, displays the corresponding status icon (success, danger, warning, info, or custom)
 * @slot - Default slot for title text (will be wrapped in heading element)
 */
@customElement('pfv6-empty-state-header')
export class Pfv6EmptyStateHeader extends LitElement {
  static styles = styles;

  /**
  * Text of the title inside empty state header, will be wrapped in headingLevel.
  */
  @property({ type: String, attribute: 'title-text' })
  titleText?: string | undefined;

  /**
  * The heading level to use, default is h1.
  */
  @property({ type: String, attribute: 'heading-level' })
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';

  /**
  * Status of the empty state. When set, displays the corresponding status icon
  * unless a custom icon is provided via the icon slot.
  */
  @property({ type: String, reflect: true })
  status?: StatusType | undefined;

  @state()
  private _hasCustomIcon = false;

  @state()
  private _hasDefaultSlotContent = false;

  #handleIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasCustomIcon = assignedNodes.length > 0;
  }

  #handleDefaultSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this._hasDefaultSlotContent = assignedNodes.some(
      node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
    );
  }

  render() {
    const titleContent = this.titleText ?
      html`${this.titleText}`
      : html`<slot @slotchange=${this.#handleDefaultSlotChange}></slot>`;
    const statusIcon = this.status && statusIcons[this.status] ? statusIcons[this.status] : null;

    return html`
      <div id="container">
        ${this._hasCustomIcon ?
          html`<slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>`
          : statusIcon ?
            html`<div id="icon">${statusIcon}</div>`
            : html`<slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>`}
        ${this.titleText || this._hasDefaultSlotContent ? html`
          <div id="title">
            ${this.headingLevel === 'h1' ? html`<h1 id="title-text">${titleContent}</h1>` : null}
            ${this.headingLevel === 'h2' ? html`<h2 id="title-text">${titleContent}</h2>` : null}
            ${this.headingLevel === 'h3' ? html`<h3 id="title-text">${titleContent}</h3>` : null}
            ${this.headingLevel === 'h4' ? html`<h4 id="title-text">${titleContent}</h4>` : null}
            ${this.headingLevel === 'h5' ? html`<h5 id="title-text">${titleContent}</h5>` : null}
            ${this.headingLevel === 'h6' ? html`<h6 id="title-text">${titleContent}</h6>` : null}
          </div>
        ` : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-empty-state-header': Pfv6EmptyStateHeader;
  }
}
