import { LitElement, html, type PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';
import { alertGroupContext, type AlertGroupContext } from './context.js';
import type { Pfv6Alert } from './pfv6-alert.js';
import styles from './pfv6-alert-group.css';

/**
 * Container for grouping multiple alerts, with optional toast positioning and animations.
 *
 * @alias AlertGroup
 * @summary Container for grouping multiple alerts with animations.
 * @slot - Alert elements to display in the group
 * @slot overflow - Custom overflow button content
 * @fires overflow-click - Fired when overflow button is clicked
 */
@customElement('pfv6-alert-group')
export class Pfv6AlertGroup extends LitElement {
  static styles = styles;

  /** Whether to enable entry/exit animations for alerts */
  @property({ type: Boolean, attribute: 'has-animations' })
  hasAnimations = false;

  /** Toast notifications are positioned at the top right corner of the viewport */
  @property({ type: Boolean, attribute: 'is-toast', reflect: true })
  isToast = false;

  /** Turns the container into a live region for assistive technology announcements */
  @property({ type: Boolean, attribute: 'is-live-region' })
  isLiveRegion = false;

  /** Custom text to show for the overflow message */
  @property({ type: String, attribute: 'overflow-message' })
  overflowMessage?: string;

  /** Accessible label for the alert group */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;

  @provide({ context: alertGroupContext })
  private alertGroupContextValue: AlertGroupContext = {
    hasAnimations: false,
    onTransitionEnd: () => { /* no-op default */ },
  };

  /** Track which alerts have been processed for animation */
  #processedAlerts = new WeakSet<Element>();

  override connectedCallback() {
    super.connectedCallback();
    this.#updateContext();
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has('hasAnimations')) {
      this.#updateContext();
    }
  }

  #updateContext() {
    this.alertGroupContextValue = {
      hasAnimations: this.hasAnimations,
      onTransitionEnd: (element: HTMLElement, callback: () => void) => {
        this.#attachTransitionEndListener(element, callback);
      },
    };
  }

  #attachTransitionEndListener(element: HTMLElement, callback: () => void) {
    if (!this.hasAnimations) {
      // No animations - call immediately
      callback();
      return;
    }

    const prefersReducedMotion = !window.matchMedia('(prefers-reduced-motion: no-preference)')?.matches;

    const handler = (event: TransitionEvent) => {
      // For reduced motion: any transition end triggers callback
      // For full motion: wait for grid-template-rows (the final property to complete)
      if (prefersReducedMotion || event.propertyName === 'grid-template-rows') {
        element.removeEventListener('transitionend', handler);
        callback();
      }
    };

    element.addEventListener('transitionend', handler);
  }

  #handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const elements = slot.assignedElements({ flatten: true });

    elements.forEach(element => {
      // Skip if already processed
      if (this.#processedAlerts.has(element)) {
        return;
      }

      // Mark as processed
      this.#processedAlerts.add(element);

      // Set listitem role on the alert for accessibility
      element.setAttribute('role', 'listitem');

      // Set incoming animation state if animations enabled
      if (this.hasAnimations) {
        (element as Pfv6Alert).animation = 'incoming';

        // Trigger entry animation after next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            (element as Pfv6Alert).animation = undefined;
          });
        });
      }
    });
  };

  #handleOverflowClick = () => {
    this.dispatchEvent(new Event('overflow-click', { bubbles: true, composed: true }));
  };

  render() {
    const classes = {
      toast: this.isToast,
    };

    return html`
      <div
        id="container"
        role="list"
        class=${classMap(classes)}
        aria-live=${this.isLiveRegion ? 'polite' : 'off'}
        aria-atomic=${this.isLiveRegion ? 'false' : 'true'}
        aria-label=${this.accessibleLabel ?? ''}
      >
        <slot @slotchange=${this.#handleSlotChange}></slot>
        ${this.overflowMessage ? html`
          <div role="listitem" id="overflow-item">
            <button
              id="overflow-button"
              @click=${this.#handleOverflowClick}
            >
              <slot name="overflow">${this.overflowMessage}</slot>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pfv6-alert-group': Pfv6AlertGroup;
  }
}
