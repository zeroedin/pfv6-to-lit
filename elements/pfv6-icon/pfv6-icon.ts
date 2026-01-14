import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pfv6-icon.css';

export type IconSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'headingSm'
  | 'headingMd'
  | 'headingLg'
  | 'headingXl'
  | 'heading_2xl'
  | 'heading_3xl'
  | 'bodySm'
  | 'bodyDefault'
  | 'bodyLg';

/**
 * Icon component for displaying icons with consistent sizing and styling.
 *
 * @summary Icon wrapper for consistent sizing and status colors
 *
 * @slot - Default slot for icon content (typically SVG)
 * @slot progress-icon - Custom progress icon (defaults to spinner)
 *
 * @cssprop --pf-v6-c-icon--Width - Width of the icon container
 * @cssprop --pf-v6-c-icon--Height - Height of the icon container
 * @cssprop {color} --pf-v6-c-icon__content--Color - Color of the icon content
 * @cssprop {font-size} --pf-v6-c-icon__content--FontSize - Font size of the icon
 * @cssprop --pf-v6-c-icon__content--svg--VerticalAlign - Vertical alignment of SVG icons
 *
 * @alias Icon
 */
@customElement('pfv6-icon')
export class Pfv6Icon extends LitElement {
  static styles = styles;

  /**
   * Size of the icon component container and icon.
   * Affects both the container dimensions and the icon content size.
   */
  @property({ type: String, reflect: true })
  size?: IconSize;

  /**
   * Size of icon content.
   * Overrides the icon size set by the size property.
   */
  @property({ type: String, reflect: true, attribute: 'icon-size' })
  iconSize?: IconSize;

  /**
   * Size of progress icon.
   * Overrides the icon size set by the size property when in progress state.
   */
  @property({ type: String, reflect: true, attribute: 'progress-icon-size' })
  progressIconSize?: IconSize;

  /**
   * Status color of the icon.
   * Applies semantic colors for different states.
   */
  @property({ type: String, reflect: true })
  status?: 'custom' | 'info' | 'success' | 'warning' | 'danger';

  /**
   * Indicates the icon is inline and should inherit text font size and color.
   * Overridden by size and iconSize properties.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-inline' })
  isInline = false;

  /**
   * Indicates the icon is in progress.
   * When true, displays the progress icon slot instead of the default icon.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-in-progress' })
  isInProgress = false;

  /**
   * Aria-label for the default progress icon (spinner).
   * Only used when no custom progress icon is provided via slot.
   */
  @property({ type: String, attribute: 'default-progress-aria-label' })
  defaultProgressAriaLabel = 'Loading...';

  /**
   * Flag indicating whether the icon should be mirrored for right-to-left (RTL) languages.
   * This applies only to the main icon content, not the progress icon.
   */
  @property({ type: Boolean, reflect: true, attribute: 'should-mirror-rtl' })
  shouldMirrorRTL = false;

  render() {
    // Container classes
    const containerClasses = {
      'inline': this.isInline,
      'in-progress': this.isInProgress,
      'sm': this.size === 'sm',
      'md': this.size === 'md',
      'lg': this.size === 'lg',
      'xl': this.size === 'xl',
      '2xl': this.size === '2xl',
      '3xl': this.size === '3xl',
      'heading-sm': this.size === 'headingSm',
      'heading-md': this.size === 'headingMd',
      'heading-lg': this.size === 'headingLg',
      'heading-xl': this.size === 'headingXl',
      'heading-2xl': this.size === 'heading_2xl',
      'heading-3xl': this.size === 'heading_3xl',
      'body-sm': this.size === 'bodySm',
      'body-default': this.size === 'bodyDefault',
      'body-lg': this.size === 'bodyLg',
    };

    // Content classes
    const contentClasses = {
      'sm': this.iconSize === 'sm',
      'md': this.iconSize === 'md',
      'lg': this.iconSize === 'lg',
      'xl': this.iconSize === 'xl',
      '2xl': this.iconSize === '2xl',
      '3xl': this.iconSize === '3xl',
      'heading-sm': this.iconSize === 'headingSm',
      'heading-md': this.iconSize === 'headingMd',
      'heading-lg': this.iconSize === 'headingLg',
      'heading-xl': this.iconSize === 'headingXl',
      'heading-2xl': this.iconSize === 'heading_2xl',
      'heading-3xl': this.iconSize === 'heading_3xl',
      'body-sm': this.iconSize === 'bodySm',
      'body-default': this.iconSize === 'bodyDefault',
      'body-lg': this.iconSize === 'bodyLg',
      'danger': this.status === 'danger',
      'warning': this.status === 'warning',
      'success': this.status === 'success',
      'info': this.status === 'info',
      'custom': this.status === 'custom',
      'mirror-inline-rtl': this.shouldMirrorRTL,
    };

    // Progress classes
    const progressClasses = {
      'sm': this.progressIconSize === 'sm',
      'md': this.progressIconSize === 'md',
      'lg': this.progressIconSize === 'lg',
      'xl': this.progressIconSize === 'xl',
      '2xl': this.progressIconSize === '2xl',
      '3xl': this.progressIconSize === '3xl',
      'heading-sm': this.progressIconSize === 'headingSm',
      'heading-md': this.progressIconSize === 'headingMd',
      'heading-lg': this.progressIconSize === 'headingLg',
      'heading-xl': this.progressIconSize === 'headingXl',
      'heading-2xl': this.progressIconSize === 'heading_2xl',
      'heading-3xl': this.progressIconSize === 'heading_3xl',
      'body-sm': this.progressIconSize === 'bodySm',
      'body-default': this.progressIconSize === 'bodyDefault',
      'body-lg': this.progressIconSize === 'bodyLg',
    };

    return html`
      <span id="container" class=${classMap(containerClasses)}>
        <span id="content" class=${classMap(contentClasses)}>
          <slot></slot>
        </span>
        ${this.isInProgress ? html`
          <span id="progress" class=${classMap(progressClasses)}>
            <slot name="progress-icon">
              <pfv6-spinner
                diameter="1em"
                aria-label=${this.defaultProgressAriaLabel}>
              </pfv6-spinner>
            </slot>
          </span>
        ` : null}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-icon': Pfv6Icon;
  }
}
