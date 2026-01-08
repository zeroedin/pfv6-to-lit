import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pfv6-icon.css';
import '@pfv6/elements/pfv6-spinner/pfv6-spinner.js';

/**
 * Icon size type matching PatternFly React.
 */
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
 * Icon component for wrapping and styling icon content.
 *
 * @summary Icon wrapper component with size, status, and progress state support
 *
 * @slot - Icon content (SVG or other icon element)
 * @slot progress-icon - Custom progress icon (default: 1em spinner SVG)
 *
 * @cssprop {<length>} --pf-v6-c-icon--Width - Icon container width
 * @cssprop {<length>} --pf-v6-c-icon--Height - Icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-sm--Width - Small icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-sm--Height - Small icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-md--Width - Medium icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-md--Height - Medium icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-lg--Width - Large icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-lg--Height - Large icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-xl--Width - Extra large icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-xl--Height - Extra large icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-2xl--Width - 2XL icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-2xl--Height - 2XL icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-3xl--Width - 3XL icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-3xl--Height - 3XL icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-body-sm--Width - Small body text icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-body-sm--Height - Small body text icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-body-default--Width - Default body text icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-body-default--Height - Default body text icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-body-lg--Width - Large body text icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-body-lg--Height - Large body text icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-sm--Width - Small heading icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-sm--Height - Small heading icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-md--Width - Medium heading icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-md--Height - Medium heading icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-lg--Width - Large heading icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-lg--Height - Large heading icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-xl--Width - XL heading icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-xl--Height - XL heading icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-2xl--Width - 2XL heading icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-2xl--Height - 2XL heading icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-3xl--Width - 3XL heading icon container width
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-3xl--Height - 3XL heading icon container height
 * @cssprop {<length>} --pf-v6-c-icon--m-inline--Width - Inline icon container width (1em)
 * @cssprop {<length>} --pf-v6-c-icon--m-inline--Height - Inline icon container height (1em)
 * @cssprop {<length>} --pf-v6-c-icon__content--svg--VerticalAlign - SVG vertical alignment
 * @cssprop {<color>} --pf-v6-c-icon__content--Color - Icon content color
 * @cssprop {<color>} --pf-v6-c-icon__content--m-danger--Color - Danger status color
 * @cssprop {<color>} --pf-v6-c-icon__content--m-warning--Color - Warning status color
 * @cssprop {<color>} --pf-v6-c-icon__content--m-success--Color - Success status color
 * @cssprop {<color>} --pf-v6-c-icon__content--m-info--Color - Info status color
 * @cssprop {<color>} --pf-v6-c-icon__content--m-custom--Color - Custom status color
 * @cssprop {<color>} --pf-v6-c-icon--m-inline__content--Color - Inline icon content color (initial)
 * @cssprop {<length>} --pf-v6-c-icon__content--FontSize - Icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-sm__content--FontSize - Small icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-md__content--FontSize - Medium icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-lg__content--FontSize - Large icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-xl__content--FontSize - XL icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-2xl__content--FontSize - 2XL icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-3xl__content--FontSize - 3XL icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-body-sm__content--FontSize - Small body text icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-body-default__content--FontSize - Default body text icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-body-lg__content--FontSize - Large body text icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-sm__content--FontSize - Small heading icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-md__content--FontSize - Medium heading icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-lg__content--FontSize - Large heading icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-xl__content--FontSize - XL heading icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-2xl__content--FontSize - 2XL heading icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-heading-3xl__content--FontSize - 3XL heading icon content font size
 * @cssprop {<length>} --pf-v6-c-icon--m-inline__content--FontSize - Inline icon content font size (1em)
 * @cssprop {<number>} --pf-v6-c-icon__content--Opacity - Icon content opacity
 * @cssprop {<number>} --pf-v6-c-icon__progress--Opacity - Progress icon opacity
 */
@customElement('pfv6-icon')
export class Pfv6Icon extends LitElement {
  static styles = styles;

  /**
  * Size of the icon component container and icon.
  * Controls both the container dimensions and the icon content size.
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
  * Overrides the icon size set by the size property.
  */
  @property({ type: String, reflect: true, attribute: 'progress-icon-size' })
  progressIconSize?: IconSize;

  /**
  * Status color of the icon.
  * Applies semantic color based on status type.
  */
  @property({ type: String, reflect: true })
  status?: 'custom' | 'info' | 'success' | 'warning' | 'danger';

  /**
  * Indicates the icon is inline and should inherit the text font size and color.
  * Overridden by size and iconSize properties.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-inline' })
  isInline = false;

  /**
  * Indicates the icon is in progress.
  * Setting this property to true will swap the icon with the progress icon.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-in-progress' })
  isInProgress = false;

  /**
  * Aria-label for the default progress icon.
  * Only used when no custom progress icon is provided via slot.
  */
  @property({ type: String, attribute: 'default-progress-aria-label' })
  defaultProgressArialabel = 'Loading...';

  /**
  * Flag indicating whether the icon should be mirrored for right to left (RTL) languages.
  * This will not mirror the icon passed to the progress-icon slot.
  */
  @property({ type: Boolean, reflect: true, attribute: 'should-mirror-rtl' })
  shouldMirrorRTL = false;

  /**
  * Convert React IconSize to CSS class.
  * Standalone sizes get 'size-' prefix: xl → size-xl, 2xl → size-2xl
  * Semantic sizes keep their prefix: headingSm → heading-sm, bodySm → body-sm
  * @param size - Icon size value to convert
  */
  private _getSizeClass(size?: IconSize): string | undefined {
    if (!size) return undefined;

    // Convert camelCase to kebab-case and handle underscore
    const kebabCase = size
      .replace(/_/g, '-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    // Only add 'size-' prefix for standalone sizes (sm, md, lg, xl, 2xl, 3xl)
    // Body and heading sizes already have semantic prefixes
    if (kebabCase.startsWith('body-') || kebabCase.startsWith('heading-')) {
      return kebabCase;
    }

    return `size-${kebabCase}`;
  }

  render() {
    const containerClasses: Record<string, boolean> = {
      inline: this.isInline,
      'in-progress': this.isInProgress
    };
    const sizeClass = this._getSizeClass(this.size);
    if (sizeClass) {
      containerClasses[sizeClass] = true;
    }

    const contentClasses: Record<string, boolean> = {
      'pf-v6-m-mirror-inline-rtl': this.shouldMirrorRTL
    };
    const iconSizeClass = this._getSizeClass(this.iconSize);
    if (iconSizeClass) {
      contentClasses[iconSizeClass] = true;
    }
    if (this.status) {
      contentClasses[this.status] = true;
    }

    const progressClasses: Record<string, boolean> = {};
    const progressSizeClass = this._getSizeClass(this.progressIconSize);
    if (progressSizeClass) {
      progressClasses[progressSizeClass] = true;
    }

    return html`
      <span id="container" class=${classMap(containerClasses)}>
        <span id="content" class=${classMap(contentClasses)}>
          <slot></slot>
        </span>
        ${this.isInProgress ? html`
          <span id="progress" class=${classMap(progressClasses)}>
            <slot name="progress-icon">
              ${this._renderDefaultProgressIcon()}
            </slot>
          </span>
        ` : null}
      </span>
    `;
  }

  /**
  * Render the default progress icon (1em spinner).
  * This is used when no custom progress icon is provided via slot.
  */
  private _renderDefaultProgressIcon() {
    return html`
      <pfv6-spinner
        diameter="1em"
        accessible-label=${this.defaultProgressArialabel}
      ></pfv6-spinner>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-icon': Pfv6Icon;
  }
}
