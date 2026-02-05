import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { responsivePropertyConverter } from '../../lib/converters.js';
import './pfv6-masthead-toggle.js';
import './pfv6-masthead-main.js';
import './pfv6-masthead-brand.js';
import './pfv6-masthead-logo.js';
import './pfv6-masthead-content.js';
import styles from './pfv6-masthead.css';

/**
 * Masthead component for the page header.
 *
 * @summary Page header container for branding, navigation, and utilities
 * @alias Masthead
 *
 * @slot - Default slot for masthead content (toggle, main, content)
 *
 * @cssprop --pf-v6-c-masthead--BackgroundColor - Background color of the masthead
 * @cssprop --pf-v6-c-masthead--BorderColor - Border color
 * @cssprop --pf-v6-c-masthead--BorderWidth - Border width
 * @cssprop --pf-v6-c-masthead--PaddingBlock - Block (vertical) padding
 * @cssprop --pf-v6-c-masthead--PaddingInline - Inline (horizontal) padding
 * @cssprop --pf-v6-c-masthead--RowGap - Row gap between content
 * @cssprop --pf-v6-c-masthead--ColumnGap - Column gap between content
 */
@customElement('pfv6-masthead')
export class Pfv6Masthead extends LitElement {
  static styles = styles;

  /**
   * Display type at various breakpoints.
   * Format: "inline" or "inline md:stack lg:inline"
   * Default: "inline" at md breakpoint
   *
   * @example
   * display="inline md:stack lg:inline"
   */
  @property({ converter: responsivePropertyConverter })
  display?: Record<string, 'inline' | 'stack'>;

  /**
   * Insets at various breakpoints.
   * Format: "insetMd" or "insetSm md:insetMd lg:insetLg"
   *
   * @example
   * inset="insetSm md:insetMd lg:insetLg"
   */
  @property({ converter: responsivePropertyConverter })
  inset?: Record<string,
    | 'insetNone' | 'insetXs' | 'insetSm' | 'insetMd'
    | 'insetLg' | 'insetXl' | 'inset2xl' | 'inset3xl'>;

  /** @internal */
  @state() private hasToggle = false;

  /**
   * Handle slotchange to detect toggle presence.
   * When toggle exists, content grid column changes for proper layout.
   */
  #onSlotChange(): void {
    this.hasToggle = !!this.querySelector('pfv6-masthead-toggle');
  }

  render() {
    // Apply default display: { md: 'inline' } if no display prop provided
    const displayConfig = this.display || { md: 'inline' };
    const insetConfig = this.inset;

    const classes = {
      // Toggle detection for grid layout
      'has-toggle': this.hasToggle,

      // Display modifiers
      'display-inline': displayConfig.default === 'inline',
      'display-stack': displayConfig.default === 'stack',
      'display-inline-on-sm': displayConfig.sm === 'inline',
      'display-stack-on-sm': displayConfig.sm === 'stack',
      'display-inline-on-md': displayConfig.md === 'inline',
      'display-stack-on-md': displayConfig.md === 'stack',
      'display-inline-on-lg': displayConfig.lg === 'inline',
      'display-stack-on-lg': displayConfig.lg === 'stack',
      'display-inline-on-xl': displayConfig.xl === 'inline',
      'display-stack-on-xl': displayConfig.xl === 'stack',
      'display-inline-on-2xl': displayConfig['2xl'] === 'inline',
      'display-stack-on-2xl': displayConfig['2xl'] === 'stack',

      // Inset modifiers
      'inset-none': insetConfig?.default === 'insetNone',
      'inset-xs': insetConfig?.default === 'insetXs',
      'inset-sm': insetConfig?.default === 'insetSm',
      'inset-md': insetConfig?.default === 'insetMd',
      'inset-lg': insetConfig?.default === 'insetLg',
      'inset-xl': insetConfig?.default === 'insetXl',
      'inset-2xl': insetConfig?.default === 'inset2xl',
      'inset-3xl': insetConfig?.default === 'inset3xl',
      'inset-none-on-sm': insetConfig?.sm === 'insetNone',
      'inset-xs-on-sm': insetConfig?.sm === 'insetXs',
      'inset-sm-on-sm': insetConfig?.sm === 'insetSm',
      'inset-md-on-sm': insetConfig?.sm === 'insetMd',
      'inset-lg-on-sm': insetConfig?.sm === 'insetLg',
      'inset-xl-on-sm': insetConfig?.sm === 'insetXl',
      'inset-2xl-on-sm': insetConfig?.sm === 'inset2xl',
      'inset-3xl-on-sm': insetConfig?.sm === 'inset3xl',
      'inset-none-on-md': insetConfig?.md === 'insetNone',
      'inset-xs-on-md': insetConfig?.md === 'insetXs',
      'inset-sm-on-md': insetConfig?.md === 'insetSm',
      'inset-md-on-md': insetConfig?.md === 'insetMd',
      'inset-lg-on-md': insetConfig?.md === 'insetLg',
      'inset-xl-on-md': insetConfig?.md === 'insetXl',
      'inset-2xl-on-md': insetConfig?.md === 'inset2xl',
      'inset-3xl-on-md': insetConfig?.md === 'inset3xl',
      'inset-none-on-lg': insetConfig?.lg === 'insetNone',
      'inset-xs-on-lg': insetConfig?.lg === 'insetXs',
      'inset-sm-on-lg': insetConfig?.lg === 'insetSm',
      'inset-md-on-lg': insetConfig?.lg === 'insetMd',
      'inset-lg-on-lg': insetConfig?.lg === 'insetLg',
      'inset-xl-on-lg': insetConfig?.lg === 'insetXl',
      'inset-2xl-on-lg': insetConfig?.lg === 'inset2xl',
      'inset-3xl-on-lg': insetConfig?.lg === 'inset3xl',
      'inset-none-on-xl': insetConfig?.xl === 'insetNone',
      'inset-xs-on-xl': insetConfig?.xl === 'insetXs',
      'inset-sm-on-xl': insetConfig?.xl === 'insetSm',
      'inset-md-on-xl': insetConfig?.xl === 'insetMd',
      'inset-lg-on-xl': insetConfig?.xl === 'insetLg',
      'inset-xl-on-xl': insetConfig?.xl === 'insetXl',
      'inset-2xl-on-xl': insetConfig?.xl === 'inset2xl',
      'inset-3xl-on-xl': insetConfig?.xl === 'inset3xl',
      'inset-none-on-2xl': insetConfig?.['2xl'] === 'insetNone',
      'inset-xs-on-2xl': insetConfig?.['2xl'] === 'insetXs',
      'inset-sm-on-2xl': insetConfig?.['2xl'] === 'insetSm',
      'inset-md-on-2xl': insetConfig?.['2xl'] === 'insetMd',
      'inset-lg-on-2xl': insetConfig?.['2xl'] === 'insetLg',
      'inset-xl-on-2xl': insetConfig?.['2xl'] === 'insetXl',
      'inset-2xl-on-2xl': insetConfig?.['2xl'] === 'inset2xl',
      'inset-3xl-on-2xl': insetConfig?.['2xl'] === 'inset3xl',
    };

    return html`
      <header id="container" class=${classMap(classes)}>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-masthead': Pfv6Masthead;
  }
}
