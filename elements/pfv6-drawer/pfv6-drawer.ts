import { LitElement, html } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';

import './pfv6-drawer-main.js';
import './pfv6-drawer-content.js';
import './pfv6-drawer-content-body.js';
import './pfv6-drawer-panel-content.js';
import './pfv6-drawer-panel-body.js';
import './pfv6-drawer-panel-description.js';
import './pfv6-drawer-head.js';
import './pfv6-drawer-actions.js';
import './pfv6-drawer-close-button.js';
import './pfv6-drawer-section.js';

import styles from './pfv6-drawer.css';

// Re-export context types from shared module to avoid circular imports
export { Pfv6DrawerExpandEvent, drawerContext } from './context.js';
export type { DrawerContext } from './context.js';

import { drawerContext, type DrawerContext } from './context.js';

/**
 * Drawer component for creating expandable side or bottom panels.
 *
 * @summary Drawer component
 * @alias Drawer
 *
 * @fires Pfv6DrawerExpandEvent - Fired when drawer panel expansion animation completes (after 250ms)
 *
 * @slot - Default slot for drawer content (DrawerMain, DrawerContent, DrawerPanelContent)
 *
 * @cssprop --pf-v6-c-drawer--Width - Drawer width
 * @cssprop --pf-v6-c-drawer--ZIndex - Drawer z-index
 */
@customElement('pfv6-drawer')
export class Pfv6Drawer extends LitElement {
  static styles = styles;

  /**
   * Indicates if the drawer is expanded.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-expanded' })
  isExpanded = false;

  /**
   * Indicates if the content element and panel element are displayed side by side.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-inline' })
  isInline = false;

  /**
   * Indicates if the drawer will always show both content and panel.
   */
  @property({ type: Boolean, reflect: true, attribute: 'is-static' })
  isStatic = false;

  /**
   * Position of the drawer panel.
   * NOTE: 'left' and 'right' are deprecated, use 'start' and 'end' instead.
   */
  @property({ type: String, reflect: true })
  position: 'start' | 'end' | 'bottom' | 'left' | 'right' = 'end';

  /**
   * Context value provided to child components.
   * Updated whenever relevant properties change.
   */
  @provide({ context: drawerContext })
  @state()
  protected _context: DrawerContext = {
    isExpanded: false,
    isStatic: false,
    isInline: false,
    position: 'end',
  };

  protected override willUpdate(changedProperties: PropertyValues): void {
    // Update context on first render or when relevant properties change
    if (
      !this.hasUpdated
      || changedProperties.has('isExpanded')
      || changedProperties.has('isStatic')
      || changedProperties.has('isInline')
      || changedProperties.has('position')
    ) {
      this._context = {
        isExpanded: this.isExpanded,
        isStatic: this.isStatic,
        isInline: this.isInline,
        position: this.position,
      };
    }
  }

  render() {
    const classes = {
      'expanded': this.isExpanded,
      'inline': this.isInline,
      'static': this.isStatic,
      'panel-left': this.position === 'left' || this.position === 'start',
      'panel-bottom': this.position === 'bottom',
    };

    return html`
      <div id="container" class=${classMap(classes)}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-drawer': Pfv6Drawer;
  }
}
