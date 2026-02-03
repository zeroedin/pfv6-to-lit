// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6NotificationBadge, Pfv6NotificationBadgeAnimationEndEvent } from '../pfv6-notification-badge.js';
import '../pfv6-notification-badge.js';

describe('<pfv6-notification-badge>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-notification-badge')).to.be.an.instanceof(Pfv6NotificationBadge);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-notification-badge'))
          .and
          .to.be.an.instanceOf(Pfv6NotificationBadge);
    });
  });

  describe('variant property', function() {
    it('defaults to "read"', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.variant).to.equal('read');
    });

    it('accepts "unread" value', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="unread"></pfv6-notification-badge>`);
      expect(el.variant).to.equal('unread');
    });

    it('accepts "attention" value', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="attention"></pfv6-notification-badge>`);
      expect(el.variant).to.equal('attention');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="unread"></pfv6-notification-badge>`);
      expect(el.getAttribute('variant')).to.equal('unread');
    });

    it('applies correct CSS class for read variant', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="read"></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('read')).to.be.true;
    });

    it('applies correct CSS class for unread variant', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="unread"></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('unread')).to.be.true;
    });

    it('applies correct CSS class for attention variant', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="attention"></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('attention')).to.be.true;
    });
  });

  describe('count property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.count).to.equal(0);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge count="5"></pfv6-notification-badge>`);
      expect(el.count).to.equal(5);
    });

    it('renders count when greater than 0', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge count="10"></pfv6-notification-badge>`);
      const content = el.shadowRoot!.querySelector('.content');
      expect(content).to.exist;
      expect(content?.textContent).to.equal('10');
    });

    it('does not render count content when 0', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge count="0"></pfv6-notification-badge>`);
      const content = el.shadowRoot!.querySelector('.content');
      expect(content).to.not.exist;
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge is-expanded></pfv6-notification-badge>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge is-expanded></pfv6-notification-badge>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('applies clicked CSS class when true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge is-expanded></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('clicked')).to.be.true;
    });

    it('does not apply clicked CSS class when false', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('clicked')).to.be.false;
    });
  });

  describe('shouldNotify property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.shouldNotify).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      expect(el.shouldNotify).to.be.true;
    });

    it('triggers animation when set to true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('notify')).to.be.true;
    });

    it('does not apply notify CSS class when false', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('notify')).to.be.false;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge accessible-label="Notifications"></pfv6-notification-badge>`);
      expect(el.accessibleLabel).to.equal('Notifications');
    });
  });

  describe('ElementInternals', function() {
    it('maps accessibleLabel to ariaLabel', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge accessible-label="5 unread notifications"></pfv6-notification-badge>`);
      expect(el.accessibleLabel).to.equal('5 unread notifications');
      // Access internals through element's ariaLabel attribute
      expect(el.getAttribute('aria-label')).to.equal('5 unread notifications');
    });

    it('sets ariaLabel to null when accessibleLabel is undefined', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-label')).to.be.null;
    });

    it('sets role to button', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('role')).to.equal('button');
    });

    it('sets ariaExpanded to "false" by default', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets ariaExpanded to "true" when isExpanded is true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge is-expanded></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-expanded')).to.equal('true');
    });

    it('updates ariaExpanded when isExpanded changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-expanded')).to.equal('false');

      el.isExpanded = true;
      await el.updateComplete;
      expect(el.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('animation-end event', function() {
    it('dispatches when animation ends', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      let eventFired = false;
      el.addEventListener('animation-end', () => {
        eventFired = true;
      });

      // Trigger animationend event on container
      const container = el.shadowRoot!.querySelector('#container');
      container!.dispatchEvent(new AnimationEvent('animationend'));

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6NotificationBadgeAnimationEndEvent', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      let capturedEvent: Pfv6NotificationBadgeAnimationEndEvent | undefined;
      el.addEventListener('animation-end', e => {
        capturedEvent = e as Pfv6NotificationBadgeAnimationEndEvent;
      });

      // Trigger animationend event on container
      const container = el.shadowRoot!.querySelector('#container');
      container!.dispatchEvent(new AnimationEvent('animationend'));

      expect(capturedEvent).to.be.an.instanceof(Pfv6NotificationBadgeAnimationEndEvent);
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      let parentEventFired = false;

      const parent = document.createElement('div');
      parent.appendChild(el);
      parent.addEventListener('animation-end', () => {
        parentEventFired = true;
      });

      // Trigger animationend event on container
      const container = el.shadowRoot!.querySelector('#container');
      container!.dispatchEvent(new AnimationEvent('animationend'));

      expect(parentEventFired).to.be.true;
    });

    it('event is composed (crosses shadow boundary)', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      let capturedEvent: Pfv6NotificationBadgeAnimationEndEvent | undefined;
      el.addEventListener('animation-end', e => {
        capturedEvent = e as Pfv6NotificationBadgeAnimationEndEvent;
      });

      // Trigger animationend event on container
      const container = el.shadowRoot!.querySelector('#container');
      container!.dispatchEvent(new AnimationEvent('animationend'));

      expect(capturedEvent?.composed).to.be.true;
    });

    it('stops animation when event fires', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      await el.updateComplete;

      // Verify animation is active
      let container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('notify')).to.be.true;

      // Trigger animationend event
      container!.dispatchEvent(new AnimationEvent('animationend'));
      await el.updateComplete;

      // Verify animation stopped
      container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('notify')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content when count is 0', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`
        <pfv6-notification-badge>
          <span>Custom content</span>
        </pfv6-notification-badge>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Custom content');
    });

    it('prioritizes count over slotted content', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`
        <pfv6-notification-badge count="5">
          <span>Custom content</span>
        </pfv6-notification-badge>
      `);
      // Count should be displayed
      const content = el.shadowRoot!.querySelector('.content');
      expect(content).to.exist;
      expect(content?.textContent).to.equal('5');

      // Slotted content still exists in light DOM but not rendered
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
    });

    it('renders slot when count changes to 0', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`
        <pfv6-notification-badge count="5">
          <span>Custom content</span>
        </pfv6-notification-badge>
      `);

      // Change count to 0
      el.count = 0;
      await el.updateComplete;

      // Now slot should be visible
      const content = el.shadowRoot!.querySelector('.content');
      expect(content).to.not.exist;

      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
    });
  });

  describe('icon rendering', function() {
    it('renders bell icon by default', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const icon = el.shadowRoot!.querySelector('.icon svg');
      expect(icon).to.exist;
    });

    it('renders bell icon for read variant', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="read"></pfv6-notification-badge>`);
      const icon = el.shadowRoot!.querySelector('.icon svg');
      expect(icon).to.exist;
      expect(icon?.querySelector('path')).to.exist;
    });

    it('renders bell icon for unread variant', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="unread"></pfv6-notification-badge>`);
      const icon = el.shadowRoot!.querySelector('.icon svg');
      expect(icon).to.exist;
      expect(icon?.querySelector('path')).to.exist;
    });

    it('renders attention bell icon for attention variant', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="attention"></pfv6-notification-badge>`);
      const icon = el.shadowRoot!.querySelector('.icon svg');
      expect(icon).to.exist;
      const path = icon?.querySelector('path');
      expect(path).to.exist;
      // Attention icon has different path data
      expect(path?.getAttribute('d')).to.not.be.empty;
    });

    it('sets aria-hidden on icon SVG', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const icon = el.shadowRoot!.querySelector('.icon svg');
      expect(icon?.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('keyboard interaction', function() {
    it('triggers click on Enter key', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let clickFired = false;
      el.addEventListener('click', () => {
        clickFired = true;
      });

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      await userEvent.keyboard('{Enter}');

      expect(clickFired).to.be.true;
    });

    it('triggers click on Space key', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let clickFired = false;
      el.addEventListener('click', () => {
        clickFired = true;
      });

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      await userEvent.keyboard(' ');

      expect(clickFired).to.be.true;
    });

    it('container is focusable with tabindex="0"', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('click handling', function() {
    it('forwards click events', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let clickFired = false;
      el.addEventListener('click', () => {
        clickFired = true;
      });

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      await userEvent.click(container);

      expect(clickFired).to.be.true;
    });

    it('click event bubbles', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let parentClickFired = false;

      const parent = document.createElement('div');
      parent.appendChild(el);
      parent.addEventListener('click', () => {
        parentClickFired = true;
      });

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      await userEvent.click(container);

      expect(parentClickFired).to.be.true;
    });
  });

  describe('focus delegation', function() {
    it('delegates focus to shadow DOM', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      el.focus();

      const container = el.shadowRoot!.querySelector('#container');
      expect(el.shadowRoot!.activeElement).to.equal(container);
    });
  });

  describe('property updates', function() {
    it('re-renders when variant changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="read"></pfv6-notification-badge>`);
      let container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('read')).to.be.true;

      el.variant = 'unread';
      await el.updateComplete;

      container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('unread')).to.be.true;
      expect(container?.classList.contains('read')).to.be.false;
    });

    it('re-renders when count changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge count="5"></pfv6-notification-badge>`);
      let content = el.shadowRoot!.querySelector('.content');
      expect(content?.textContent).to.equal('5');

      el.count = 10;
      await el.updateComplete;

      content = el.shadowRoot!.querySelector('.content');
      expect(content?.textContent).to.equal('10');
    });

    it('re-renders when isExpanded changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('clicked')).to.be.false;

      el.isExpanded = true;
      await el.updateComplete;

      container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('clicked')).to.be.true;
    });

    it('re-renders when shouldNotify changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('notify')).to.be.false;

      el.shouldNotify = true;
      await el.updateComplete;

      container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('notify')).to.be.true;
    });
  });
});
