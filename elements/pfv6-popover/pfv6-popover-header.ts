import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import styles from './pfv6-popover-header.css';

/**
 * Popover header sub-component.
 *
 * @summary Header section of popover with optional icon and alert styling
 * @slot - Header content
 * @slot icon - Icon to display in header
 */
@customElement('pfv6-popover-header')
export class Pfv6PopoverHeader extends LitElement {
  static styles = styles;

  /** Heading level for the title */
  @property({ type: String, attribute: 'header-component' })
  headerComponent: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h6';

  /** Severity variant for alert styling */
  @property({ type: String, attribute: 'alert-severity-variant' })
  alertSeverityVariant?: 'custom' | 'info' | 'warning' | 'success' | 'danger' | undefined;

  /** Screen reader text for alert severity */
  @property({ type: String, attribute: 'alert-severity-screen-reader-text' })
  alertSeverityScreenReaderText = '';

  render(): TemplateResult {
    const screenReaderText =
      this.alertSeverityVariant && this.alertSeverityScreenReaderText ?
        html`<span class="screen-reader">${this.alertSeverityScreenReaderText}</span>`
        : nothing;

    const headingContent = html`${screenReaderText}<slot></slot>`;

    return html`
      <header id="header">
        <div id="title">
          <slot name="icon"></slot>
          ${this.headerComponent === 'h1' ? html`
            <h1 id="title-text">${headingContent}</h1>
          ` : this.headerComponent === 'h2' ? html`
            <h2 id="title-text">${headingContent}</h2>
          ` : this.headerComponent === 'h3' ? html`
            <h3 id="title-text">${headingContent}</h3>
          ` : this.headerComponent === 'h4' ? html`
            <h4 id="title-text">${headingContent}</h4>
          ` : this.headerComponent === 'h5' ? html`
            <h5 id="title-text">${headingContent}</h5>
          ` : html`
            <h6 id="title-text">${headingContent}</h6>
          `}
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-popover-header': Pfv6PopoverHeader;
  }
}
