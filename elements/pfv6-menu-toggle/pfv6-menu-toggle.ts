import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import './pfv6-menu-toggle-action.js';
import './pfv6-menu-toggle-checkbox.js';
import styles from './pfv6-menu-toggle.css';

/**
 * Menu toggle component for opening and closing menus.
 *
 * @summary Menu toggle component for opening and closing menus
 * @alias MenuToggle
 *
 * @slot - Default slot for toggle content
 * @slot icon - Optional icon or image rendered before the children content
 * @slot badge - Optional badge rendered after the children content
 * @slot split-button-items - Elements to display before the toggle button (creates split button)
 * @slot status-icon - Overrides the default status icon
 *
 * @cssprop --pf-v6-c-menu-toggle--BackgroundColor - Background color
 * @cssprop --pf-v6-c-menu-toggle--Color - Text color
 * @cssprop --pf-v6-c-menu-toggle--FontSize - Font size
 * @cssprop --pf-v6-c-menu-toggle--PaddingBlockStart - Block start padding
 * @cssprop --pf-v6-c-menu-toggle--PaddingInlineEnd - Inline end padding
 * @cssprop --pf-v6-c-menu-toggle--PaddingBlockEnd - Block end padding
 * @cssprop --pf-v6-c-menu-toggle--PaddingInlineStart - Inline start padding
 * @cssprop --pf-v6-c-menu-toggle--BorderRadius - Border radius
 * @cssprop --pf-v6-c-menu-toggle--m-expanded--BackgroundColor - Background color when expanded
 * @cssprop --pf-v6-c-menu-toggle--m-primary--BackgroundColor - Background color for primary variant
 * @cssprop --pf-v6-c-menu-toggle--m-primary--Color - Text color for primary variant
 * @cssprop --pf-v6-c-menu-toggle--m-secondary--BackgroundColor - Background color for secondary variant
 * @cssprop --pf-v6-c-menu-toggle--m-secondary--Color - Text color for secondary variant
 * @cssprop --pf-v6-c-menu-toggle--m-plain--BackgroundColor - Background color for plain variant
 * @cssprop --pf-v6-c-menu-toggle--m-disabled--BackgroundColor - Background color when disabled
 * @cssprop --pf-v6-c-menu-toggle--m-disabled--Color - Text color when disabled
 * @cssprop --pf-v6-c-menu-toggle--m-small--FontSize - Font size for small variant
 * @cssprop --pf-v6-c-menu-toggle--m-full-width--Width - Width for full-width variant
 * @cssprop --pf-v6-c-menu-toggle--m-full-height--Height - Height for full-height variant
 */
@customElement('pfv6-menu-toggle')
export class Pfv6MenuToggle extends LitElement {
  static styles = styles;

  /** Variant styles of the menu toggle */
  @property({ type: String, reflect: true })
  variant: 'default' | 'plain' | 'primary' | 'plainText' | 'secondary' | 'typeahead' = 'default';

  /** Status styles of the menu toggle */
  @property({ type: String, reflect: true })
  status?: 'success' | 'warning' | 'danger';

  /** Adds styling which affects the size of the menu toggle */
  @property({ type: String, reflect: true })
  size: 'default' | 'sm' = 'default';

  /** Flag indicating the toggle has expanded styling */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /** Flag indicating the toggle is disabled */
  @property({ type: Boolean, reflect: true, attribute: 'is-disabled' })
  isDisabled = false;

  /** Flag indicating the toggle is full height */
  @property({ type: Boolean, reflect: true, attribute: 'is-full-height' })
  isFullHeight = false;

  /** Flag indicating the toggle takes up the full width of its parent */
  @property({ type: Boolean, reflect: true, attribute: 'is-full-width' })
  isFullWidth = false;

  /** Flag indicating the toggle contains placeholder text */
  @property({ type: Boolean, reflect: true, attribute: 'is-placeholder' })
  isPlaceholder = false;

  /** Flag indicating whether the toggle is a settings toggle */
  @property({ type: Boolean, reflect: true, attribute: 'is-settings' })
  isSettings = false;

  /** Accessible label for the toggle */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  #renderStatusIcon(): TemplateResult | null {
    const hasCustomIcon = this.querySelector('[slot="status-icon"]');
    if (hasCustomIcon) {
      return html`<slot name="status-icon"></slot>`;
    }

    // Default status icons based on status property
    if (this.status === 'success') {
      return html`
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img">
          <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
        </svg>
      `;
    } else if (this.status === 'warning') {
      return html`
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 576 512" aria-hidden="true" role="img">
          <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
        </svg>
      `;
    } else if (this.status === 'danger') {
      return html`
        <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img">
          <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
        </svg>
      `;
    }

    return null;
  }

  #renderToggleControls(): TemplateResult {
    return html`
      <span id="controls">
        ${this.status ? html`
          <span id="status-icon">
            ${this.#renderStatusIcon()}
          </span>
        ` : null}
        <span id="toggle-icon">
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 320 512" aria-hidden="true" role="img">
            <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
          </svg>
        </span>
      </span>
    `;
  }

  #renderIcon(): TemplateResult | null {
    const hasIcon = this.querySelector('[slot="icon"]');
    const hasSettings = this.isSettings;

    if (hasSettings) {
      return html`
        <span id="icon">
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" aria-hidden="true" role="img">
            <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
          </svg>
        </span>
      `;
    } else if (hasIcon) {
      return html`<span id="icon"><slot name="icon"></slot></span>`;
    }

    return null;
  }

  #renderContent(): TemplateResult {
    const isTypeahead = this.variant === 'typeahead';
    const isPlain = this.variant === 'plain';
    const hasBadge = this.querySelector('[slot="badge"]');

    return html`
      ${this.#renderIcon()}
      <slot></slot>
      ${hasBadge ? html`
        <span id="count">
          <slot name="badge"></slot>
        </span>
      ` : null}
      ${isTypeahead ? html`
        <button
          type="button"
          id="typeahead-button"
          aria-expanded=${this.isExpanded}
          aria-label=${this.accessibleLabel || 'Menu toggle'}
          tabindex="-1"
          ?disabled=${this.isDisabled}
          @click=${this.#handleClick}
        >
          ${this.#renderToggleControls()}
        </button>
      ` : !isPlain ? this.#renderToggleControls() : null}
    `;
  }

  #handleClick = (event: Event) => {
    if (this.isDisabled) {
      event.preventDefault();
      return;
    }
    // Allow native click event to bubble
  };

  override render() {
    const isPlain = this.variant === 'plain';
    const isPlainText = this.variant === 'plainText';
    const isTypeahead = this.variant === 'typeahead';
    const hasSplitButton = this.querySelector('[slot="split-button-items"]');

    const classes = {
      'expanded': this.isExpanded,
      'primary': this.variant === 'primary',
      'secondary': this.variant === 'secondary',
      'success': this.status === 'success',
      'warning': this.status === 'warning',
      'danger': this.status === 'danger',
      'plain': isPlain || isPlainText,
      'text': isPlainText,
      'full-height': this.isFullHeight,
      'full-width': this.isFullWidth,
      'disabled': this.isDisabled,
      'placeholder': this.isPlaceholder,
      'settings': this.isSettings,
      'small': this.size === 'sm',
      'typeahead': isTypeahead,
      'split-button': !!hasSplitButton,
    };

    // Typeahead variant renders as a div wrapper
    if (isTypeahead) {
      return html`
        <div id="container" class=${classMap(classes)}>
          ${this.#renderContent()}
        </div>
      `;
    }

    // Split button variant renders as a div with slotted items + toggle button
    if (hasSplitButton) {
      return html`
        <div id="container" class=${classMap(classes)}>
          <slot name="split-button-items"></slot>
          <button
            type="button"
            id="split-button"
            aria-expanded=${this.isExpanded}
            aria-label=${ifDefined(this.accessibleLabel)}
            ?disabled=${this.isDisabled}
            @click=${this.#handleClick}
          >
            <slot></slot>
            ${this.#renderToggleControls()}
          </button>
        </div>
      `;
    }

    // Default renders as a button
    return html`
      <button
        id="container"
        type="button"
        class=${classMap(classes)}
        aria-label=${ifDefined(this.accessibleLabel)}
        aria-expanded=${this.isExpanded}
        ?disabled=${this.isDisabled}
        @click=${this.#handleClick}
      >
        ${this.#renderContent()}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-menu-toggle': Pfv6MenuToggle;
  }
}
