import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import './pfv6-empty-state-header.js';
import './pfv6-empty-state-icon.js';
import './pfv6-empty-state-body.js';
import './pfv6-empty-state-actions.js';
import './pfv6-empty-state-footer.js';
import styles from './pfv6-empty-state.css';

/**
 * EmptyState component for displaying empty or placeholder states.
 *
 * @summary EmptyState
 * @alias EmptyState
 *
 * @slot - Default slot for empty state content (header, body, actions, footer)
 * @slot icon - Icon slot for header when using titleText property
 *
 * @cssprop [--pf-v6-c-empty-state--PaddingBlockStart] - Padding block start
 * @cssprop [--pf-v6-c-empty-state--PaddingInlineEnd] - Padding inline end
 * @cssprop [--pf-v6-c-empty-state--PaddingBlockEnd] - Padding block end
 * @cssprop [--pf-v6-c-empty-state--PaddingInlineStart] - Padding inline start
 * @cssprop [--pf-v6-c-empty-state--m-xs--PaddingBlockStart] - Padding block start for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xs--PaddingInlineEnd] - Padding inline end for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xs--PaddingBlockEnd] - Padding block end for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xs--PaddingInlineStart] - Padding inline start for xs variant
 * @cssprop [--pf-v6-c-empty-state__content--MaxWidth] - Maximum width of content
 * @cssprop [--pf-v6-c-empty-state--m-xs__content--MaxWidth] - Maximum width for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-sm__content--MaxWidth] - Maximum width for sm variant
 * @cssprop [--pf-v6-c-empty-state--m-lg__content--MaxWidth] - Maximum width for lg variant
 * @cssprop [--pf-v6-c-empty-state__icon--MarginBlockEnd] - Icon bottom margin
 * @cssprop [--pf-v6-c-empty-state__icon--FontSize] - Icon font size
 * @cssprop [--pf-v6-c-empty-state__icon--Color] - Icon color
 * @cssprop [--pf-v6-c-empty-state--m-xs__icon--MarginBlockEnd] - Icon bottom margin for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xl__icon--MarginBlockEnd] - Icon bottom margin for xl variant
 * @cssprop [--pf-v6-c-empty-state--m-xl__icon--FontSize] - Icon font size for xl variant
 * @cssprop [--pf-v6-c-empty-state--m-danger__icon--Color] - Icon color for danger status
 * @cssprop [--pf-v6-c-empty-state--m-warning__icon--Color] - Icon color for warning status
 * @cssprop [--pf-v6-c-empty-state--m-success__icon--Color] - Icon color for success status
 * @cssprop [--pf-v6-c-empty-state--m-info__icon--Color] - Icon color for info status
 * @cssprop [--pf-v6-c-empty-state--m-custom__icon--Color] - Icon color for custom status
 * @cssprop [--pf-v6-c-empty-state__title-text--FontFamily] - Title font family
 * @cssprop [--pf-v6-c-empty-state__title-text--FontSize] - Title font size
 * @cssprop [--pf-v6-c-empty-state__title-text--FontWeight] - Title font weight
 * @cssprop [--pf-v6-c-empty-state__title-text--LineHeight] - Title line height
 * @cssprop [--pf-v6-c-empty-state--m-xs__title-text--FontSize] - Title font size for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xl__title-text--FontSize] - Title font size for xl variant
 * @cssprop [--pf-v6-c-empty-state--m-xl__title-text--LineHeight] - Title line height for xl variant
 * @cssprop [--pf-v6-c-empty-state__body--MarginBlockStart] - Body top margin
 * @cssprop [--pf-v6-c-empty-state__body--Color] - Body text color
 * @cssprop [--pf-v6-c-empty-state--body--FontSize] - Body font size
 * @cssprop [--pf-v6-c-empty-state--m-xs__body--FontSize] - Body font size for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xs__body--MarginBlockStart] - Body top margin for xs variant
 * @cssprop [--pf-v6-c-empty-state--m-xl__body--FontSize] - Body font size for xl variant
 * @cssprop [--pf-v6-c-empty-state--m-xl__body--MarginBlockStart] - Body top margin for xl variant
 * @cssprop [--pf-v6-c-empty-state__footer--RowGap] - Footer row gap
 * @cssprop [--pf-v6-c-empty-state__footer--MarginBlockStart] - Footer top margin
 * @cssprop [--pf-v6-c-empty-state--m-xs__footer--MarginBlockStart] - Footer top margin for xs variant
 * @cssprop [--pf-v6-c-empty-state__actions--RowGap] - Actions row gap
 * @cssprop [--pf-v6-c-empty-state__actions--ColumnGap] - Actions column gap
 */
@customElement('pfv6-empty-state')
export class Pfv6EmptyState extends LitElement {
  static styles = styles;

  /**
  * Modifies empty state max-width and sizes of icon, title and body.
  */
  @property({ type: String, reflect: true })
  variant: 'xs' | 'sm' | 'lg' | 'xl' | 'full' = 'full';

  /**
  * Cause component to consume the available height of its container.
  */
  @property({ type: Boolean, reflect: true, attribute: 'is-full-height' })
  isFullHeight = false;

  /**
  * Status of the empty state, will set a default status icon and color.
  * Icon can be overwritten using the icon slot in pfv6-empty-state-header.
  */
  @property({ type: String, reflect: true })
  status?: 'danger' | 'warning' | 'success' | 'info' | 'custom';

  /**
  * Title text for the empty state header.
  * When provided, automatically renders a pfv6-empty-state-header.
  */
  @property({ type: String, attribute: 'title-text' })
  titleText?: string;

  /**
  * Heading level for the title when using titleText property.
  */
  @property({ type: String, attribute: 'heading-level' })
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';

  render() {
    const classes = {
      'xs': this.variant === 'xs',
      'sm': this.variant === 'sm',
      'lg': this.variant === 'lg',
      'xl': this.variant === 'xl',
      'full-height': this.isFullHeight,
      'danger': this.status === 'danger',
      'warning': this.status === 'warning',
      'success': this.status === 'success',
      'info': this.status === 'info',
      'custom': this.status === 'custom',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <div id="content">
          ${this.titleText ? html`
            <pfv6-empty-state-header
              title-text=${this.titleText}
              heading-level=${this.headingLevel}
              status=${this.status || ''}
            >
              <slot name="icon" slot="icon"></slot>
            </pfv6-empty-state-header>
          ` : ''}
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-empty-state': Pfv6EmptyState;
  }
}
