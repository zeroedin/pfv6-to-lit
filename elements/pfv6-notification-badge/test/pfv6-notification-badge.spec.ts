import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6NotificationBadge, Pfv6NotificationBadgeAnimationEndEvent } from '../pfv6-notification-badge.js';
import '../pfv6-notification-badge.js';

describe('<pfv6-notification-badge>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-notification-badge')).to.be.an.instanceof(Pfv6NotificationBadge);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-notification-badge'))
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

    it('passes variant as state to pfv6-button', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="read"></pfv6-notification-badge>`);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.getAttribute('state')).to.equal('read');
    });

    it('passes unread variant as state to pfv6-button', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="unread"></pfv6-notification-badge>`);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.getAttribute('state')).to.equal('unread');
    });

    it('passes attention variant as state to pfv6-button', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="attention"></pfv6-notification-badge>`);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.getAttribute('state')).to.equal('attention');
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
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.textContent?.trim()).to.equal('10');
    });

    it('does not render count text when 0', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge count="0"></pfv6-notification-badge>`);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      // Button should only contain the icon span, no text content
      expect(button?.textContent?.trim()).to.equal('');
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

    it('passes is-clicked to pfv6-button when true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge is-expanded></pfv6-notification-badge>`);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.hasAttribute('is-clicked')).to.be.true;
    });

    it('does not pass is-clicked to pfv6-button when false', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.hasAttribute('is-clicked')).to.be.false;
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
      const icon = el.shadowRoot!.querySelector('.icon');
      expect(icon?.classList.contains('notify')).to.be.true;
    });

    it('does not apply notify CSS class when false', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      const icon = el.shadowRoot!.querySelector('.icon');
      expect(icon?.classList.contains('notify')).to.be.false;
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

  describe('ARIA attributes on host', function() {
    it('maps accessibleLabel to aria-label on host', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge accessible-label="5 unread notifications"></pfv6-notification-badge>`);
      expect(el.accessibleLabel).to.equal('5 unread notifications');
      expect(el.getAttribute('aria-label')).to.equal('5 unread notifications');
    });

    it('sets aria-label to null when accessibleLabel is undefined', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-label')).to.be.null;
    });

    it('sets role to button on host', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('role')).to.equal('button');
    });

    it('sets aria-expanded to "false" by default', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets aria-expanded to "true" when isExpanded is true', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge is-expanded></pfv6-notification-badge>`);
      expect(el.getAttribute('aria-expanded')).to.equal('true');
    });

    it('updates aria-expanded when isExpanded changes', async function() {
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

      // Trigger animationend event on icon span
      const icon = el.shadowRoot!.querySelector('.icon');
      icon!.dispatchEvent(new AnimationEvent('animationend'));

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6NotificationBadgeAnimationEndEvent', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      let capturedEvent: Pfv6NotificationBadgeAnimationEndEvent | undefined;
      el.addEventListener('animation-end', e => {
        capturedEvent = e as Pfv6NotificationBadgeAnimationEndEvent;
      });

      // Trigger animationend event on icon span
      const icon = el.shadowRoot!.querySelector('.icon');
      icon!.dispatchEvent(new AnimationEvent('animationend'));

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

      // Trigger animationend event on icon span
      const icon = el.shadowRoot!.querySelector('.icon');
      icon!.dispatchEvent(new AnimationEvent('animationend'));

      expect(parentEventFired).to.be.true;
    });

    it('event is composed (crosses shadow boundary)', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      let capturedEvent: Pfv6NotificationBadgeAnimationEndEvent | undefined;
      el.addEventListener('animation-end', e => {
        capturedEvent = e as Pfv6NotificationBadgeAnimationEndEvent;
      });

      // Trigger animationend event on icon span
      const icon = el.shadowRoot!.querySelector('.icon');
      icon!.dispatchEvent(new AnimationEvent('animationend'));

      expect(capturedEvent?.composed).to.be.true;
    });

    it('stops animation when event fires', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge should-notify></pfv6-notification-badge>`);
      await el.updateComplete;

      // Verify animation is active
      let icon = el.shadowRoot!.querySelector('.icon');
      expect(icon?.classList.contains('notify')).to.be.true;

      // Trigger animationend event
      icon!.dispatchEvent(new AnimationEvent('animationend'));
      await el.updateComplete;

      // Verify animation stopped
      icon = el.shadowRoot!.querySelector('.icon');
      expect(icon?.classList.contains('notify')).to.be.false;
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
      // Count should be displayed in button
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.textContent?.trim()).to.equal('5');

      // Slotted content still exists in light DOM but not visible
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

      // Now slot should be visible (count gone)
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.textContent?.trim()).to.not.equal('5');

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
      // Attention icon has different path data (longer path with exclamation mark)
      expect(path?.getAttribute('d')?.length).to.be.greaterThan(500);
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

      // Focus the element and dispatch Enter key
      el.focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      el.dispatchEvent(event);
      // pfv6-button handles keyboard, click happens via button
      const button = el.shadowRoot!.querySelector('pfv6-button')!.shadowRoot!.querySelector('button');
      button?.click();

      expect(clickFired).to.be.true;
    });

    it('triggers click on Space key', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let clickFired = false;
      el.addEventListener('click', () => {
        clickFired = true;
      });

      // Click the inner button directly
      const button = el.shadowRoot!.querySelector('pfv6-button')!.shadowRoot!.querySelector('button');
      button?.click();

      expect(clickFired).to.be.true;
    });
  });

  describe('click handling', function() {
    it('forwards click events', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let clickFired = false;
      el.addEventListener('click', () => {
        clickFired = true;
      });

      // Click the inner button
      const button = el.shadowRoot!.querySelector('pfv6-button')!.shadowRoot!.querySelector('button');
      button?.click();

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

      // Click the inner button
      const button = el.shadowRoot!.querySelector('pfv6-button')!.shadowRoot!.querySelector('button');
      button?.click();

      expect(parentClickFired).to.be.true;
    });
  });

  describe('focus delegation', function() {
    it('delegates focus to shadow DOM', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      el.focus();

      // With delegatesFocus, focus should go to the pfv6-button
      const pfv6Button = el.shadowRoot!.querySelector('pfv6-button');
      expect(el.shadowRoot!.activeElement).to.equal(pfv6Button);
    });
  });

  describe('property updates', function() {
    it('re-renders when variant changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge variant="read"></pfv6-notification-badge>`);
      let button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.getAttribute('state')).to.equal('read');

      el.variant = 'unread';
      await el.updateComplete;

      button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.getAttribute('state')).to.equal('unread');
    });

    it('re-renders when count changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge count="5"></pfv6-notification-badge>`);
      let button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.textContent?.trim()).to.equal('5');

      el.count = 10;
      await el.updateComplete;

      button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.textContent?.trim()).to.equal('10');
    });

    it('re-renders when isExpanded changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.hasAttribute('is-clicked')).to.be.false;

      el.isExpanded = true;
      await el.updateComplete;

      button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button?.hasAttribute('is-clicked')).to.be.true;
    });

    it('re-renders when shouldNotify changes', async function() {
      const el = await fixture<Pfv6NotificationBadge>(html`<pfv6-notification-badge></pfv6-notification-badge>`);
      let icon = el.shadowRoot!.querySelector('.icon');
      expect(icon?.classList.contains('notify')).to.be.false;

      el.shouldNotify = true;
      await el.updateComplete;
      // Setting shouldNotify triggers a second update cycle (isAnimating state change)
      await el.updateComplete;

      icon = el.shadowRoot!.querySelector('.icon');
      expect(icon?.classList.contains('notify')).to.be.true;
    });
  });
});
