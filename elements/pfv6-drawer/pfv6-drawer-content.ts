import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { consume } from '@lit/context';
import { drawerContext, type DrawerContext } from './context.js';

import styles from './pfv6-drawer-content.css';

/**
 * Drawer content wrapper component that holds the main content area.
 *
 * @summary DrawerContent component
 * @alias DrawerContent
 *
 * @slot - Default slot for drawer content body
 * @slot panel - Named slot for drawer panel content
 *
 * @cssprop --pf-v6-c-drawer__content--BackgroundColor - Content background color
 */
@customElement('pfv6-drawer-content')
export class Pfv6DrawerContent extends LitElement {
  static styles = styles;

  /**
   * Consume drawer context with subscribe: true for reactivity.
   */
  @consume({ context: drawerContext, subscribe: true })
  @state()
  protected _drawerContext?: DrawerContext;

  /**
   * Color variant of the background of the drawer content.
   */
  @property({ type: String, reflect: true, attribute: 'color-variant' })
  colorVariant: 'default' | 'primary' | 'secondary' = 'default';

  render() {
    const position = this._drawerContext?.position ?? 'end';
    const isPanelLeft = position === 'start' || position === 'left';
    const isPanelBottom = position === 'bottom';

    const containerClasses = {
      primary: this.colorVariant === 'primary',
      secondary: this.colorVariant === 'secondary',
    };

    const mainClasses = {
      'panel-left': isPanelLeft,
      'panel-bottom': isPanelBottom,
    };

    return html`
      <div id="main" class=${classMap(mainClasses)}>
        <div id="container" class=${classMap(containerClasses)}>
          <slot></slot>
        </div>
        <slot name="panel"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-drawer-content': Pfv6DrawerContent;
  }
}
