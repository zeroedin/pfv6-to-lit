// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6Popover, Pfv6PopoverHideEvent, Pfv6PopoverHiddenEvent, Pfv6PopoverShowEvent, Pfv6PopoverShownEvent, Pfv6PopoverMountEvent, Pfv6PopoverShouldCloseEvent, Pfv6PopoverShouldOpenEvent } from '../pfv6-popover.js';
import { Pfv6PopoverHeader } from '../pfv6-popover-header.js';
import { Pfv6PopoverBody } from '../pfv6-popover-body.js';
import { Pfv6PopoverFooter } from '../pfv6-popover-footer.js';
import '../pfv6-popover.js';
import '../pfv6-popover-header.js';
import '../pfv6-popover-body.js';
import '../pfv6-popover-footer.js';

describe('<pfv6-popover>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-popover')).to.be.an.instanceof(Pfv6Popover);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-popover'))
          .and
          .to.be.an.instanceOf(Pfv6Popover);
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover accessible-label="Test popover"></pfv6-popover>`);
      expect(el.accessibleLabel).to.equal('Test popover');
    });
  });

  describe('headerContent property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.headerContent).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-content="Popover Header"></pfv6-popover>`);
      expect(el.headerContent).to.equal('Popover Header');
    });
  });

  describe('bodyContent property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.bodyContent).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover body-content="Popover content here"></pfv6-popover>`);
      expect(el.bodyContent).to.equal('Popover content here');
    });
  });

  describe('footerContent property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.footerContent).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover footer-content="Footer text"></pfv6-popover>`);
      expect(el.footerContent).to.equal('Footer text');
    });
  });

  describe('position property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.position).to.equal('top');
    });

    it('accepts "auto" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover position="auto"></pfv6-popover>`);
      expect(el.position).to.equal('auto');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover position="bottom"></pfv6-popover>`);
      expect(el.position).to.equal('bottom');
    });

    it('accepts "left" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover position="left"></pfv6-popover>`);
      expect(el.position).to.equal('left');
    });

    it('accepts "right" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover position="right"></pfv6-popover>`);
      expect(el.position).to.equal('right');
    });
  });

  describe('distance property', function() {
    it('defaults to 25', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.distance).to.equal(25);
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover distance="50"></pfv6-popover>`);
      expect(el.distance).to.equal(50);
    });
  });

  describe('enableFlip property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.enableFlip).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover enable-flip="false"></pfv6-popover>`);
      expect(el.enableFlip).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover enable-flip></pfv6-popover>`);
      expect(el.hasAttribute('enable-flip')).to.be.true;
    });
  });

  describe('alertSeverityVariant property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.alertSeverityVariant).to.be.undefined;
    });

    it('accepts "custom" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover alert-severity-variant="custom"></pfv6-popover>`);
      expect(el.alertSeverityVariant).to.equal('custom');
    });

    it('accepts "info" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover alert-severity-variant="info"></pfv6-popover>`);
      expect(el.alertSeverityVariant).to.equal('info');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover alert-severity-variant="warning"></pfv6-popover>`);
      expect(el.alertSeverityVariant).to.equal('warning');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover alert-severity-variant="success"></pfv6-popover>`);
      expect(el.alertSeverityVariant).to.equal('success');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover alert-severity-variant="danger"></pfv6-popover>`);
      expect(el.alertSeverityVariant).to.equal('danger');
    });
  });

  describe('alertSeverityScreenReaderText property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.alertSeverityScreenReaderText).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover alert-severity-screen-reader-text="Warning alert"></pfv6-popover>`);
      expect(el.alertSeverityScreenReaderText).to.equal('Warning alert');
    });
  });

  describe('headerIcon property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.headerIcon).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-icon="icon-class"></pfv6-popover>`);
      expect(el.headerIcon).to.equal('icon-class');
    });
  });

  describe('headerComponent property', function() {
    it('defaults to "h6"', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.headerComponent).to.equal('h6');
    });

    it('accepts "h1" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-component="h1"></pfv6-popover>`);
      expect(el.headerComponent).to.equal('h1');
    });

    it('accepts "h2" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-component="h2"></pfv6-popover>`);
      expect(el.headerComponent).to.equal('h2');
    });

    it('accepts "h3" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-component="h3"></pfv6-popover>`);
      expect(el.headerComponent).to.equal('h3');
    });

    it('accepts "h4" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-component="h4"></pfv6-popover>`);
      expect(el.headerComponent).to.equal('h4');
    });

    it('accepts "h5" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover header-component="h5"></pfv6-popover>`);
      expect(el.headerComponent).to.equal('h5');
    });
  });

  describe('triggerAction property', function() {
    it('defaults to "click"', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.triggerAction).to.equal('click');
    });

    it('accepts "hover" value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover trigger-action="hover"></pfv6-popover>`);
      expect(el.triggerAction).to.equal('hover');
    });
  });

  describe('isVisible property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.isVisible).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover is-visible></pfv6-popover>`);
      expect(el.isVisible).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover is-visible></pfv6-popover>`);
      expect(el.hasAttribute('is-visible')).to.be.true;
    });
  });

  describe('maxWidth property', function() {
    it('defaults to undefined (CSS handles visual default)', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.maxWidth).to.be.undefined;
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover max-width="25rem"></pfv6-popover>`);
      expect(el.maxWidth).to.equal('25rem');
    });
  });

  describe('minWidth property', function() {
    it('defaults to undefined (CSS handles visual default)', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.minWidth).to.be.undefined;
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover min-width="10rem"></pfv6-popover>`);
      expect(el.minWidth).to.equal('10rem');
    });
  });

  describe('zIndex property', function() {
    it('defaults to 9999', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.zIndex).to.equal(9999);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover z-index="5000"></pfv6-popover>`);
      expect(el.zIndex).to.equal(5000);
    });
  });

  describe('animationDuration property', function() {
    it('defaults to 300', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.animationDuration).to.equal(300);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover animation-duration="500"></pfv6-popover>`);
      expect(el.animationDuration).to.equal(500);
    });
  });

  describe('triggerId property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.triggerId).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover trigger-id="my-trigger"></pfv6-popover>`);
      expect(el.triggerId).to.equal('my-trigger');
    });
  });

  describe('showClose property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.showClose).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover show-close="false"></pfv6-popover>`);
      expect(el.showClose).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover show-close></pfv6-popover>`);
      expect(el.hasAttribute('show-close')).to.be.true;
    });
  });

  describe('closeBtnAccessibleLabel property', function() {
    it('defaults to "Close"', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.closeBtnAccessibleLabel).to.equal('Close');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover close-btn-accessible-label="Dismiss"></pfv6-popover>`);
      expect(el.closeBtnAccessibleLabel).to.equal('Dismiss');
    });
  });

  describe('hideOnOutsideClick property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.hideOnOutsideClick).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover hide-on-outside-click="false"></pfv6-popover>`);
      expect(el.hideOnOutsideClick).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover hide-on-outside-click></pfv6-popover>`);
      expect(el.hasAttribute('hide-on-outside-click')).to.be.true;
    });
  });

  describe('hasAutoWidth property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.hasAutoWidth).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover has-auto-width></pfv6-popover>`);
      expect(el.hasAutoWidth).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover has-auto-width></pfv6-popover>`);
      expect(el.hasAttribute('has-auto-width')).to.be.true;
    });
  });

  describe('hasNoPadding property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover></pfv6-popover>`);
      expect(el.hasNoPadding).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover has-no-padding></pfv6-popover>`);
      expect(el.hasNoPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Popover>(html`<pfv6-popover has-no-padding></pfv6-popover>`);
      expect(el.hasAttribute('has-no-padding')).to.be.true;
    });
  });

  describe('mount event', function() {
    it('dispatches on connection to DOM', async function() {
      let eventFired = false;
      const container = document.createElement('div');
      document.body.appendChild(container);

      const el = document.createElement('pfv6-popover');
      el.addEventListener('mount', () => {
        eventFired = true;
      });
      container.appendChild(el);

      // Wait for connectedCallback to execute
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(eventFired).to.be.true;
      document.body.removeChild(container);
    });

    it('event is instance of Pfv6PopoverMountEvent', async function() {
      let capturedEvent: Event | undefined;
      const container = document.createElement('div');
      document.body.appendChild(container);

      const el = document.createElement('pfv6-popover');
      el.addEventListener('mount', e => {
        capturedEvent = e;
      });
      container.appendChild(el);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverMountEvent);
      document.body.removeChild(container);
    });
  });

  describe('show event', function() {
    it('dispatches when popover begins to show', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let eventFired = false;
      el.addEventListener('show', () => {
        eventFired = true;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6PopoverShowEvent', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let capturedEvent: Event | undefined;
      el.addEventListener('show', e => {
        capturedEvent = e;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverShowEvent);
    });
  });

  describe('shown event', function() {
    it('dispatches after show animation completes', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" animation-duration="50">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let eventFired = false;
      el.addEventListener('shown', () => {
        eventFired = true;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      // Wait for animation duration
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6PopoverShownEvent', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" animation-duration="50">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let capturedEvent: Event | undefined;
      el.addEventListener('shown', e => {
        capturedEvent = e;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverShownEvent);
    });
  });

  describe('hide event', function() {
    it('dispatches when popover begins to hide', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let eventFired = false;
      el.addEventListener('hide', () => {
        eventFired = true;
      });

      const trigger = el.querySelector('button')!;
      // Show first
      await userEvent.click(trigger);
      await el.updateComplete;

      // Then hide
      await userEvent.click(trigger);

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6PopoverHideEvent', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let capturedEvent: Event | undefined;
      el.addEventListener('hide', e => {
        capturedEvent = e;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);
      await el.updateComplete;
      await userEvent.click(trigger);

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverHideEvent);
    });
  });

  describe('hidden event', function() {
    it('dispatches after hide animation completes', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" animation-duration="50">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let eventFired = false;
      el.addEventListener('hidden', () => {
        eventFired = true;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);
      await el.updateComplete;
      await userEvent.click(trigger);

      // Wait for animation duration
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6PopoverHiddenEvent', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" animation-duration="50">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let capturedEvent: Event | undefined;
      el.addEventListener('hidden', e => {
        capturedEvent = e;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);
      await el.updateComplete;
      await userEvent.click(trigger);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverHiddenEvent);
    });
  });

  describe('should-open event (manual mode)', function() {
    it('dispatches when trigger is clicked in manual mode', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="false">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let eventFired = false;
      el.addEventListener('should-open', () => {
        eventFired = true;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6PopoverShouldOpenEvent', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="false">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let capturedEvent: Event | undefined;
      el.addEventListener('should-open', e => {
        capturedEvent = e;
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverShouldOpenEvent);
    });

    it('event is cancelable', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="false">
          <button>Click me</button>
        </pfv6-popover>
      `);

      let capturedEvent: Pfv6PopoverShouldOpenEvent | undefined;
      el.addEventListener('should-open', e => {
        capturedEvent = e as Pfv6PopoverShouldOpenEvent;
        e.preventDefault();
      });

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.cancelable).to.be.true;
      expect(capturedEvent!.defaultPrevented).to.be.true;
    });
  });

  describe('should-close event (manual mode)', function() {
    it('dispatches when close button is clicked in manual mode', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="true">
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('should-close', () => {
        eventFired = true;
      });

      const closeBtn = el.shadowRoot!.querySelector('pfv6-button')!;
      await userEvent.click(closeBtn);

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6PopoverShouldCloseEvent', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="true">
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('should-close', e => {
        capturedEvent = e;
      });

      const closeBtn = el.shadowRoot!.querySelector('pfv6-button')!;
      await userEvent.click(closeBtn);

      expect(capturedEvent).to.be.an.instanceof(Pfv6PopoverShouldCloseEvent);
    });

    it('event is cancelable', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="true">
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      let capturedEvent: Pfv6PopoverShouldCloseEvent | undefined;
      el.addEventListener('should-close', e => {
        capturedEvent = e as Pfv6PopoverShouldCloseEvent;
        e.preventDefault();
      });

      const closeBtn = el.shadowRoot!.querySelector('pfv6-button')!;
      await userEvent.click(closeBtn);

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.cancelable).to.be.true;
      expect(capturedEvent!.defaultPrevented).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default trigger slot content', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover>
          <button>Click trigger</button>
        </pfv6-popover>
      `);

      const slotted = el.querySelector('button');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Click trigger');
    });

    it('renders header slot content', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover is-visible="true">
          <button>Click me</button>
          <div slot="header">Custom Header</div>
          <div slot="body">Body content</div>
        </pfv6-popover>
      `);

      await el.updateComplete;

      const headerSlot = el.querySelector('[slot="header"]');
      expect(headerSlot).to.exist;
      expect(headerSlot?.textContent).to.equal('Custom Header');
    });

    it('renders body slot content', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover is-visible="true">
          <button>Click me</button>
          <div slot="body">Custom Body Content</div>
        </pfv6-popover>
      `);

      await el.updateComplete;

      const bodySlot = el.querySelector('[slot="body"]');
      expect(bodySlot).to.exist;
      expect(bodySlot?.textContent).to.equal('Custom Body Content');
    });

    it('renders footer slot content', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover is-visible="true" footer-content="Footer text">
          <button>Click me</button>
          <div slot="footer">Custom Footer</div>
        </pfv6-popover>
      `);

      await el.updateComplete;

      const footerSlot = el.querySelector('[slot="footer"]');
      expect(footerSlot).to.exist;
      expect(footerSlot?.textContent).to.equal('Custom Footer');
    });
  });

  describe('ElementInternals', function() {
    it('sets role to "dialog" when visible', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="true">
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      expect(el.getAttribute('role')).to.equal('dialog');
    });

    it('sets ariaModal to "true" when visible', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" is-visible="true">
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      expect(el.getAttribute('aria-modal')).to.equal('true');
    });

    it('sets ariaLabel from accessibleLabel when visible', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover
          accessible-label="Test popover"
          body-content="Content"
          is-visible="true"
        >
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      expect(el.getAttribute('aria-label')).to.equal('Test popover');
    });

    it('clears ARIA when not visible', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover
          accessible-label="Test popover"
          header-content="Test"
          body-content="Content"
        >
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      expect(el.getAttribute('role')).to.be.null;
      expect(el.getAttribute('aria-modal')).to.be.null;
      expect(el.getAttribute('aria-label')).to.be.null;
    });
  });

  describe('sub-components', function() {
    describe('pfv6-popover-header', function() {
      it('imperatively instantiates', function() {
        expect(document.createElement('pfv6-popover-header')).to.be.an.instanceof(Pfv6PopoverHeader);
      });

      it('should upgrade', async function() {
        const el = await fixture<Pfv6PopoverHeader>(html`<pfv6-popover-header></pfv6-popover-header>`);
        expect(el).to.be.an.instanceOf(customElements.get('pfv6-popover-header'))
            .and
            .to.be.an.instanceOf(Pfv6PopoverHeader);
      });

      it('renders within popover', async function() {
        const el = await fixture<Pfv6Popover>(html`
          <pfv6-popover header-content="Test Header" is-visible="true">
            <button>Click me</button>
          </pfv6-popover>
        `);

        await el.updateComplete;

        const header = el.shadowRoot!.querySelector('pfv6-popover-header');
        expect(header).to.exist;
      });

      it('accepts headerComponent property', async function() {
        const el = await fixture<Pfv6PopoverHeader>(html`
          <pfv6-popover-header header-component="h2">Test</pfv6-popover-header>
        `);

        expect(el.headerComponent).to.equal('h2');
      });

      it('accepts alertSeverityVariant property', async function() {
        const el = await fixture<Pfv6PopoverHeader>(html`
          <pfv6-popover-header alert-severity-variant="warning">Test</pfv6-popover-header>
        `);

        expect(el.alertSeverityVariant).to.equal('warning');
      });

      it('accepts alertSeverityScreenReaderText property', async function() {
        const el = await fixture<Pfv6PopoverHeader>(html`
          <pfv6-popover-header alert-severity-screen-reader-text="Warning alert">Test</pfv6-popover-header>
        `);

        expect(el.alertSeverityScreenReaderText).to.equal('Warning alert');
      });
    });

    describe('pfv6-popover-body', function() {
      it('imperatively instantiates', function() {
        expect(document.createElement('pfv6-popover-body')).to.be.an.instanceof(Pfv6PopoverBody);
      });

      it('should upgrade', async function() {
        const el = await fixture<Pfv6PopoverBody>(html`<pfv6-popover-body></pfv6-popover-body>`);
        expect(el).to.be.an.instanceOf(customElements.get('pfv6-popover-body'))
            .and
            .to.be.an.instanceOf(Pfv6PopoverBody);
      });

      it('renders within popover', async function() {
        const el = await fixture<Pfv6Popover>(html`
          <pfv6-popover body-content="Test Body" is-visible="true">
            <button>Click me</button>
          </pfv6-popover>
        `);

        await el.updateComplete;

        const body = el.shadowRoot!.querySelector('pfv6-popover-body');
        expect(body).to.exist;
      });

      it('renders slotted content', async function() {
        const el = await fixture<Pfv6PopoverBody>(html`
          <pfv6-popover-body>Body content here</pfv6-popover-body>
        `);

        const text = el.textContent?.trim();
        expect(text).to.equal('Body content here');
      });
    });

    describe('pfv6-popover-footer', function() {
      it('imperatively instantiates', function() {
        expect(document.createElement('pfv6-popover-footer')).to.be.an.instanceof(Pfv6PopoverFooter);
      });

      it('should upgrade', async function() {
        const el = await fixture<Pfv6PopoverFooter>(html`<pfv6-popover-footer></pfv6-popover-footer>`);
        expect(el).to.be.an.instanceOf(customElements.get('pfv6-popover-footer'))
            .and
            .to.be.an.instanceOf(Pfv6PopoverFooter);
      });

      it('renders within popover when footer content provided', async function() {
        const el = await fixture<Pfv6Popover>(html`
          <pfv6-popover footer-content="Footer text" is-visible="true">
            <button>Click me</button>
          </pfv6-popover>
        `);

        await el.updateComplete;

        const footer = el.shadowRoot!.querySelector('pfv6-popover-footer');
        expect(footer).to.exist;
      });

      it('renders slotted content', async function() {
        const el = await fixture<Pfv6PopoverFooter>(html`
          <pfv6-popover-footer>Footer content here</pfv6-popover-footer>
        `);

        const text = el.textContent?.trim();
        expect(text).to.equal('Footer content here');
      });
    });
  });

  describe('interaction patterns', function() {
    it('shows popover on trigger click', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);
      await el.updateComplete;

      const popover = el.shadowRoot!.querySelector('#popover');
      expect(popover).to.exist;
    });

    it('hides popover on second trigger click', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);
      await el.updateComplete;

      await userEvent.click(trigger);
      await el.updateComplete;

      const popover = el.shadowRoot!.querySelector('#popover');
      expect(popover).to.not.exist;
    });

    it('hides popover on close button click', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content">
          <button>Click me</button>
        </pfv6-popover>
      `);

      const trigger = el.querySelector('button')!;
      await userEvent.click(trigger);
      await el.updateComplete;

      const closeBtn = el.shadowRoot!.querySelector('pfv6-button')!;
      await userEvent.click(closeBtn);
      await el.updateComplete;

      const popover = el.shadowRoot!.querySelector('#popover');
      expect(popover).to.not.exist;
    });

    it('hides close button when showClose is false', async function() {
      const el = await fixture<Pfv6Popover>(html`
        <pfv6-popover header-content="Test" body-content="Content" show-close="false" is-visible="true">
          <button>Click me</button>
        </pfv6-popover>
      `);

      await el.updateComplete;

      const closeBtn = el.shadowRoot!.querySelector('#close');
      expect(closeBtn).to.not.exist;
    });

    it('uses external trigger via triggerId', async function() {
      const container = await fixture(html`
        <div>
          <button id="external-trigger">External Trigger</button>
          <pfv6-popover trigger-id="external-trigger" header-content="Test" body-content="Content"></pfv6-popover>
        </div>
      `);

      const trigger = container.querySelector('#external-trigger') as HTMLButtonElement;
      const popover = container.querySelector('pfv6-popover') as Pfv6Popover;

      await userEvent.click(trigger);
      await popover.updateComplete;

      const popoverEl = popover.shadowRoot!.querySelector('#popover');
      expect(popoverEl).to.exist;
    });
  });
});
