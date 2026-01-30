import { html, fixture, expect } from '@open-wc/testing';
import { userEvent } from 'vitest/browser';
import { Pfv6Alert, Pfv6AlertExpandEvent, Pfv6AlertCloseEvent, Pfv6AlertTimeoutEvent } from '../pfv6-alert.js';
import { Pfv6AlertActionCloseButton } from '../pfv6-alert-action-close-button.js';
import { Pfv6AlertActionLink } from '../pfv6-alert-action-link.js';
import { Pfv6AlertIcon } from '../pfv6-alert-icon.js';
import '../pfv6-alert.js';
import '../pfv6-alert-action-close-button.js';
import '../pfv6-alert-action-link.js';
import '../pfv6-alert-icon.js';

describe('<pfv6-alert>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-alert')).to.be.an.instanceof(Pfv6Alert);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-alert'))
          .and
          .to.be.an.instanceOf(Pfv6Alert);
    });
  });

  describe('variant property', function() {
    it('defaults to "custom"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.variant).to.equal('custom');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="success"></pfv6-alert>`);
      expect(el.variant).to.equal('success');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="danger"></pfv6-alert>`);
      expect(el.variant).to.equal('danger');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="warning"></pfv6-alert>`);
      expect(el.variant).to.equal('warning');
    });

    it('accepts "info" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="info"></pfv6-alert>`);
      expect(el.variant).to.equal('info');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="success"></pfv6-alert>`);
      expect(el.getAttribute('variant')).to.equal('success');
    });

    it('applies variant modifier class', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="danger"></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('danger')).to.be.true;
    });
  });

  describe('title property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.title).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Success alert"></pfv6-alert>`);
      expect(el.title).to.equal('Success alert');
    });

    it('renders title in shadow DOM', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Test Title"></pfv6-alert>`);
      const titleElement = el.shadowRoot!.querySelector('#title');
      expect(titleElement).to.exist;
      expect(titleElement!.textContent).to.include('Test Title');
    });
  });

  describe('isInline property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.isInline).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-inline></pfv6-alert>`);
      expect(el.isInline).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-inline></pfv6-alert>`);
      expect(el.hasAttribute('is-inline')).to.be.true;
    });

    it('applies inline modifier class when true', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-inline></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inline')).to.be.true;
    });

    it('does not apply inline modifier class when false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inline')).to.be.false;
    });
  });

  describe('isPlain property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.isPlain).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-plain></pfv6-alert>`);
      expect(el.isPlain).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-plain></pfv6-alert>`);
      expect(el.hasAttribute('is-plain')).to.be.true;
    });

    it('applies plain modifier class when true', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-plain></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.true;
    });
  });

  describe('isLiveRegion property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.isLiveRegion).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-live-region></pfv6-alert>`);
      expect(el.isLiveRegion).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-live-region></pfv6-alert>`);
      expect(el.hasAttribute('is-live-region')).to.be.true;
    });

    it('applies aria-live="polite" when true', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-live-region></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.getAttribute('aria-live')).to.equal('polite');
    });

    it('applies aria-atomic="false" when true', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-live-region></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.getAttribute('aria-atomic')).to.equal('false');
    });

    it('does not apply aria-live when false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.hasAttribute('aria-live')).to.be.false;
    });
  });

  describe('isExpandable property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.isExpandable).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-expandable></pfv6-alert>`);
      expect(el.isExpandable).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-expandable></pfv6-alert>`);
      expect(el.hasAttribute('is-expandable')).to.be.true;
    });

    it('applies expandable modifier class when true', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-expandable></pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('expandable')).to.be.true;
    });

    it('renders toggle button when true', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert is-expandable title="Expandable"></pfv6-alert>`);
      const toggle = el.shadowRoot!.querySelector('#toggle');
      expect(toggle).to.exist;
    });

    it('does not render toggle button when false', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      const toggle = el.shadowRoot!.querySelector('#toggle');
      expect(toggle).to.not.exist;
    });

    it('hides description when collapsed', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable>Description content</pfv6-alert>
      `);
      const description = el.shadowRoot!.querySelector('#description');
      expect(description).to.not.exist;
    });
  });

  describe('variantLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.variantLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant-label="Custom label"></pfv6-alert>`);
      expect(el.variantLabel).to.equal('Custom label');
    });

    it('uses default variant label when undefined', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="success" title="Test"></pfv6-alert>`);
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText!.textContent).to.equal('Success alert:');
    });

    it('uses custom variant label when provided', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="success" variant-label="Successful operation:" title="Test"></pfv6-alert>
      `);
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText!.textContent).to.equal('Successful operation:');
    });
  });

  describe('toggleAccessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.toggleAccessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert toggle-accessible-label="Toggle details"></pfv6-alert>
      `);
      expect(el.toggleAccessibleLabel).to.equal('Toggle details');
    });

    it('uses custom aria-label on toggle button when provided', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable toggle-accessible-label="Show more details" title="Alert"></pfv6-alert>
      `);
      const toggleButton = el.shadowRoot!.querySelector('#toggle-button');
      expect(toggleButton!.getAttribute('aria-label')).to.equal('Show more details');
    });
  });

  describe('truncateTitle property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.truncateTitle).to.equal(0);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert truncate-title="2"></pfv6-alert>`);
      expect(el.truncateTitle).to.equal(2);
    });

    it('applies truncate modifier class when greater than 0', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert truncate-title="2" title="Long title"></pfv6-alert>`);
      const titleElement = el.shadowRoot!.querySelector('#title');
      expect(titleElement!.classList.contains('truncate')).to.be.true;
    });

    it('does not apply truncate modifier class when 0', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Title"></pfv6-alert>`);
      const titleElement = el.shadowRoot!.querySelector('#title');
      expect(titleElement!.classList.contains('truncate')).to.be.false;
    });
  });

  describe('timeout property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.timeout).to.equal(0);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert timeout="5000"></pfv6-alert>`);
      expect(el.timeout).to.equal(5000);
    });

    it('uses 8000ms when timeout is exactly 8000', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert timeout="8000"></pfv6-alert>`);
      expect(el.timeout).to.equal(8000);
    });
  });

  describe('timeoutAnimation property', function() {
    it('defaults to 3000', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.timeoutAnimation).to.equal(3000);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert timeout-animation="2000"></pfv6-alert>`);
      expect(el.timeoutAnimation).to.equal(2000);
    });
  });

  describe('tooltipPosition property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert></pfv6-alert>`);
      expect(el.tooltipPosition).to.be.undefined;
    });

    it('accepts "auto" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert tooltip-position="auto"></pfv6-alert>`);
      expect(el.tooltipPosition).to.equal('auto');
    });

    it('accepts "top" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert tooltip-position="top"></pfv6-alert>`);
      expect(el.tooltipPosition).to.equal('top');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert tooltip-position="bottom"></pfv6-alert>`);
      expect(el.tooltipPosition).to.equal('bottom');
    });

    it('accepts "left" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert tooltip-position="left"></pfv6-alert>`);
      expect(el.tooltipPosition).to.equal('left');
    });

    it('accepts "right" value', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert tooltip-position="right"></pfv6-alert>`);
      expect(el.tooltipPosition).to.equal('right');
    });
  });

  describe('component property', function() {
    it('defaults to "h4"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Test"></pfv6-alert>`);
      expect(el.component).to.equal('h4');
      const h4 = el.shadowRoot!.querySelector('h4');
      expect(h4).to.exist;
    });

    it('renders h1 when component="h1"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert component="h1" title="Test"></pfv6-alert>`);
      expect(el.component).to.equal('h1');
      const h1 = el.shadowRoot!.querySelector('h1');
      expect(h1).to.exist;
    });

    it('renders h2 when component="h2"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert component="h2" title="Test"></pfv6-alert>`);
      expect(el.component).to.equal('h2');
      const h2 = el.shadowRoot!.querySelector('h2');
      expect(h2).to.exist;
    });

    it('renders h3 when component="h3"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert component="h3" title="Test"></pfv6-alert>`);
      expect(el.component).to.equal('h3');
      const h3 = el.shadowRoot!.querySelector('h3');
      expect(h3).to.exist;
    });

    it('renders h5 when component="h5"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert component="h5" title="Test"></pfv6-alert>`);
      expect(el.component).to.equal('h5');
      const h5 = el.shadowRoot!.querySelector('h5');
      expect(h5).to.exist;
    });

    it('renders h6 when component="h6"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert component="h6" title="Test"></pfv6-alert>`);
      expect(el.component).to.equal('h6');
      const h6 = el.shadowRoot!.querySelector('h6');
      expect(h6).to.exist;
    });
  });

  describe('expand event', function() {
    it('dispatches expand event when toggle button clicked', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Expandable Alert">Description</pfv6-alert>
      `);
      let eventFired = false;
      el.addEventListener('expand', () => {
        eventFired = true;
      });

      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;
      await userEvent.click(toggleButton);

      expect(eventFired).to.be.true;
    });

    it('event contains expanded=true when expanding', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Alert">Description</pfv6-alert>
      `);
      let capturedEvent: Pfv6AlertExpandEvent | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e as Pfv6AlertExpandEvent;
      });

      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;
      await userEvent.click(toggleButton);

      expect(capturedEvent).to.be.an.instanceof(Pfv6AlertExpandEvent);
      expect(capturedEvent!.expanded).to.be.true;
    });

    it('event contains expanded=false when collapsing', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Alert">Description</pfv6-alert>
      `);

      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;
      await userEvent.click(toggleButton); // Expand first

      let capturedEvent: Pfv6AlertExpandEvent | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e as Pfv6AlertExpandEvent;
      });

      await userEvent.click(toggleButton); // Collapse

      expect(capturedEvent).to.be.an.instanceof(Pfv6AlertExpandEvent);
      expect(capturedEvent!.expanded).to.be.false;
    });

    it('event contains id when alert has id', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert id="test-alert" is-expandable title="Alert">Description</pfv6-alert>
      `);
      let capturedEvent: Pfv6AlertExpandEvent | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e as Pfv6AlertExpandEvent;
      });

      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;
      await userEvent.click(toggleButton);

      expect(capturedEvent!.id).to.equal('test-alert');
    });

    it('applies expanded modifier class when expanded', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Alert">Description</pfv6-alert>
      `);

      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;
      await userEvent.click(toggleButton);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('expanded')).to.be.true;
    });

    it('shows description when expanded', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Alert">Description content</pfv6-alert>
      `);

      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;
      await userEvent.click(toggleButton);
      await el.updateComplete;

      const description = el.shadowRoot!.querySelector('#description');
      expect(description).to.exist;
    });
  });

  describe('close event', function() {
    it('dispatches close event when close button clicked', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <pfv6-alert-action-close-button slot="action-close"></pfv6-alert-action-close-button>
        </pfv6-alert>
      `);
      let eventFired = false;
      el.addEventListener('close', () => {
        eventFired = true;
      });

      const closeButton = el.querySelector('pfv6-alert-action-close-button')!
          .shadowRoot!.querySelector('button') as HTMLButtonElement;
      await userEvent.click(closeButton);

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6AlertCloseEvent', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <pfv6-alert-action-close-button slot="action-close"></pfv6-alert-action-close-button>
        </pfv6-alert>
      `);
      let capturedEvent: Pfv6AlertCloseEvent | undefined;
      el.addEventListener('close', e => {
        capturedEvent = e as Pfv6AlertCloseEvent;
      });

      const closeButton = el.querySelector('pfv6-alert-action-close-button')!
          .shadowRoot!.querySelector('button') as HTMLButtonElement;
      await userEvent.click(closeButton);

      expect(capturedEvent).to.be.an.instanceof(Pfv6AlertCloseEvent);
    });

    it('event contains id when alert has id', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert id="dismissable-alert" title="Alert">
          <pfv6-alert-action-close-button slot="action-close"></pfv6-alert-action-close-button>
        </pfv6-alert>
      `);
      let capturedEvent: Pfv6AlertCloseEvent | undefined;
      el.addEventListener('close', e => {
        capturedEvent = e as Pfv6AlertCloseEvent;
      });

      const closeButton = el.querySelector('pfv6-alert-action-close-button')!
          .shadowRoot!.querySelector('button') as HTMLButtonElement;
      await userEvent.click(closeButton);

      expect(capturedEvent!.id).to.equal('dismissable-alert');
    });
  });

  describe('timeout event', function() {
    it('dispatches timeout event after timeout completes', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert timeout="100" timeout-animation="50" title="Alert">Timed alert</pfv6-alert>
      `);
      let eventFired = false;
      el.addEventListener('timeout', () => {
        eventFired = true;
      });

      // Wait for timeout + animation to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6AlertTimeoutEvent', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert timeout="100" timeout-animation="50" title="Alert">Timed alert</pfv6-alert>
      `);
      let capturedEvent: Pfv6AlertTimeoutEvent | undefined;
      el.addEventListener('timeout', e => {
        capturedEvent = e as Pfv6AlertTimeoutEvent;
      });

      // Wait for timeout + animation to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(capturedEvent).to.be.an.instanceof(Pfv6AlertTimeoutEvent);
    });

    it('event contains id when alert has id', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert id="timed-alert" timeout="100" timeout-animation="50" title="Alert">Timed alert</pfv6-alert>
      `);
      let capturedEvent: Pfv6AlertTimeoutEvent | undefined;
      el.addEventListener('timeout', e => {
        capturedEvent = e as Pfv6AlertTimeoutEvent;
      });

      // Wait for timeout + animation to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(capturedEvent!.id).to.equal('timed-alert');
    });
  });

  describe('slots', function() {
    it('renders default slot for description', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <p>Alert description content</p>
        </pfv6-alert>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted!.textContent).to.equal('Alert description content');
    });

    it('renders action-close slot', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <pfv6-alert-action-close-button slot="action-close"></pfv6-alert-action-close-button>
        </pfv6-alert>
      `);
      const closeButton = el.querySelector('[slot="action-close"]');
      expect(closeButton).to.exist;
      expect(closeButton!.tagName.toLowerCase()).to.equal('pfv6-alert-action-close-button');
    });

    it('renders action-links slot', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <pfv6-alert-action-link slot="action-links">View details</pfv6-alert-action-link>
        </pfv6-alert>
      `);
      const actionLink = el.querySelector('[slot="action-links"]');
      expect(actionLink).to.exist;
      expect(actionLink!.tagName.toLowerCase()).to.equal('pfv6-alert-action-link');
    });

    it('renders custom-icon slot', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <svg slot="custom-icon" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40"/>
          </svg>
        </pfv6-alert>
      `);
      const customIcon = el.querySelector('[slot="custom-icon"]');
      expect(customIcon).to.exist;
      expect(customIcon!.tagName.toLowerCase()).to.equal('svg');
    });

    it('renders multiple action links', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert title="Alert">
          <pfv6-alert-action-link slot="action-links">View details</pfv6-alert-action-link>
          <pfv6-alert-action-link slot="action-links">Ignore</pfv6-alert-action-link>
        </pfv6-alert>
      `);
      const actionLinks = el.querySelectorAll('[slot="action-links"]');
      expect(actionLinks.length).to.equal(2);
    });
  });

  describe('sub-components', function() {
    describe('<pfv6-alert-action-close-button>', function() {
      it('instantiates', function() {
        expect(document.createElement('pfv6-alert-action-close-button'))
            .to.be.an.instanceof(Pfv6AlertActionCloseButton);
      });

      it('should upgrade', async function() {
        const el = await fixture<Pfv6AlertActionCloseButton>(
          html`<pfv6-alert-action-close-button></pfv6-alert-action-close-button>`
        );
        expect(el)
            .to.be.an.instanceOf(customElements.get('pfv6-alert-action-close-button'))
            .and
            .to.be.an.instanceOf(Pfv6AlertActionCloseButton);
      });

      it('accessibleLabel property defaults to undefined', async function() {
        const el = await fixture<Pfv6AlertActionCloseButton>(
          html`<pfv6-alert-action-close-button></pfv6-alert-action-close-button>`
        );
        expect(el.accessibleLabel).to.be.undefined;
      });

      it('accessibleLabel property accepts string value', async function() {
        const el = await fixture<Pfv6AlertActionCloseButton>(
          html`<pfv6-alert-action-close-button accessible-label="Close alert"></pfv6-alert-action-close-button>`
        );
        expect(el.accessibleLabel).to.equal('Close alert');
      });

      it('variantLabel property defaults to undefined', async function() {
        const el = await fixture<Pfv6AlertActionCloseButton>(
          html`<pfv6-alert-action-close-button></pfv6-alert-action-close-button>`
        );
        expect(el.variantLabel).to.be.undefined;
      });

      it('variantLabel property accepts string value', async function() {
        const el = await fixture<Pfv6AlertActionCloseButton>(
          html`<pfv6-alert-action-close-button variant-label="Success:"></pfv6-alert-action-close-button>`
        );
        expect(el.variantLabel).to.equal('Success:');
      });

      it('dispatches click event when button clicked', async function() {
        const el = await fixture<Pfv6AlertActionCloseButton>(
          html`<pfv6-alert-action-close-button></pfv6-alert-action-close-button>`
        );
        let eventFired = false;
        el.addEventListener('click', () => {
          eventFired = true;
        });

        const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
        await userEvent.click(button);

        expect(eventFired).to.be.true;
      });
    });

    describe('<pfv6-alert-action-link>', function() {
      it('instantiates', function() {
        expect(document.createElement('pfv6-alert-action-link'))
            .to.be.an.instanceof(Pfv6AlertActionLink);
      });

      it('should upgrade', async function() {
        const el = await fixture<Pfv6AlertActionLink>(
          html`<pfv6-alert-action-link></pfv6-alert-action-link>`
        );
        expect(el)
            .to.be.an.instanceOf(customElements.get('pfv6-alert-action-link'))
            .and
            .to.be.an.instanceOf(Pfv6AlertActionLink);
      });

      it('renders default slot content', async function() {
        const el = await fixture<Pfv6AlertActionLink>(
          html`<pfv6-alert-action-link>View details</pfv6-alert-action-link>`
        );
        expect(el.textContent?.trim()).to.equal('View details');
      });

      it('renders button element', async function() {
        const el = await fixture<Pfv6AlertActionLink>(
          html`<pfv6-alert-action-link>Link text</pfv6-alert-action-link>`
        );
        const button = el.shadowRoot!.querySelector('#button');
        expect(button).to.exist;
        expect(button!.tagName.toLowerCase()).to.equal('button');
      });
    });

    describe('<pfv6-alert-icon>', function() {
      it('instantiates', function() {
        expect(document.createElement('pfv6-alert-icon'))
            .to.be.an.instanceof(Pfv6AlertIcon);
      });

      it('should upgrade', async function() {
        const el = await fixture<Pfv6AlertIcon>(
          html`<pfv6-alert-icon></pfv6-alert-icon>`
        );
        expect(el)
            .to.be.an.instanceOf(customElements.get('pfv6-alert-icon'))
            .and
            .to.be.an.instanceOf(Pfv6AlertIcon);
      });

      it('variant property defaults to "custom"', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon></pfv6-alert-icon>`);
        expect(el.variant).to.equal('custom');
      });

      it('variant property accepts "success"', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="success"></pfv6-alert-icon>`);
        expect(el.variant).to.equal('success');
      });

      it('variant property accepts "danger"', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="danger"></pfv6-alert-icon>`);
        expect(el.variant).to.equal('danger');
      });

      it('variant property accepts "warning"', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="warning"></pfv6-alert-icon>`);
        expect(el.variant).to.equal('warning');
      });

      it('variant property accepts "info"', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="info"></pfv6-alert-icon>`);
        expect(el.variant).to.equal('info');
      });

      it('variant property reflects to attribute', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="success"></pfv6-alert-icon>`);
        expect(el.getAttribute('variant')).to.equal('success');
      });

      it('renders default success icon', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="success"></pfv6-alert-icon>`);
        const icon = el.shadowRoot!.querySelector('svg');
        expect(icon).to.exist;
      });

      it('renders default danger icon', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="danger"></pfv6-alert-icon>`);
        const icon = el.shadowRoot!.querySelector('svg');
        expect(icon).to.exist;
      });

      it('renders default warning icon', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="warning"></pfv6-alert-icon>`);
        const icon = el.shadowRoot!.querySelector('svg');
        expect(icon).to.exist;
      });

      it('renders default info icon', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="info"></pfv6-alert-icon>`);
        const icon = el.shadowRoot!.querySelector('svg');
        expect(icon).to.exist;
      });

      it('renders default custom icon', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`<pfv6-alert-icon variant="custom"></pfv6-alert-icon>`);
        const icon = el.shadowRoot!.querySelector('svg');
        expect(icon).to.exist;
      });

      it('renders custom icon from slot', async function() {
        const el = await fixture<Pfv6AlertIcon>(html`
          <pfv6-alert-icon>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40"/>
            </svg>
          </pfv6-alert-icon>
        `);
        const customIcon = el.querySelector('svg');
        expect(customIcon).to.exist;
        expect(customIcon!.querySelector('circle')).to.exist;
      });
    });
  });

  describe('combined properties', function() {
    it('can combine variant and inline', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="success" is-inline title="Success">Inline success</pfv6-alert>
      `);
      expect(el.variant).to.equal('success');
      expect(el.isInline).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
      expect(container!.classList.contains('inline')).to.be.true;
    });

    it('can combine variant and plain', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="warning" is-plain title="Warning">Plain warning</pfv6-alert>
      `);
      expect(el.variant).to.equal('warning');
      expect(el.isPlain).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('can combine expandable with variant', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="info" is-expandable title="Info">Expandable info</pfv6-alert>
      `);
      expect(el.variant).to.equal('info');
      expect(el.isExpandable).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('info')).to.be.true;
      expect(container!.classList.contains('expandable')).to.be.true;
    });

    it('can combine inline, plain, and variant', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="danger" is-inline is-plain title="Danger">Combined alert</pfv6-alert>
      `);
      expect(el.variant).to.equal('danger');
      expect(el.isInline).to.be.true;
      expect(el.isPlain).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('danger')).to.be.true;
      expect(container!.classList.contains('inline')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
    });
  });

  describe('accessibility', function() {
    it('renders variant label in screen reader text', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="success" title="Operation successful">Success message</pfv6-alert>
      `);
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Success alert:');
    });

    it('toggle button has proper aria-expanded', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Expandable">Content</pfv6-alert>
      `);
      const toggleButton = el.shadowRoot!.querySelector('#toggle-button');
      expect(toggleButton!.getAttribute('aria-expanded')).to.equal('false');
    });

    it('toggle button aria-expanded updates when expanded', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable title="Expandable">Content</pfv6-alert>
      `);
      const toggleButton = el.shadowRoot!.querySelector('#toggle-button') as HTMLButtonElement;

      await userEvent.click(toggleButton);
      await el.updateComplete;

      expect(toggleButton.getAttribute('aria-expanded')).to.equal('true');
    });

    it('toggle button has descriptive aria-label', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert is-expandable variant="warning" title="Warning Alert">Content</pfv6-alert>
      `);
      const toggleButton = el.shadowRoot!.querySelector('#toggle-button');
      const ariaLabel = toggleButton!.getAttribute('aria-label');
      expect(ariaLabel).to.include('Warning alert:');
      expect(ariaLabel).to.include('Warning Alert');
    });

    it('icon has aria-hidden="true"', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="success" title="Success">Content</pfv6-alert>`);
      const alertIcon = el.shadowRoot!.querySelector('pfv6-alert-icon');
      const icon = alertIcon!.shadowRoot!.querySelector('svg');
      expect(icon!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('close button has descriptive aria-label', async function() {
      const el = await fixture<Pfv6Alert>(html`
        <pfv6-alert variant="info" title="Info Alert">
          <pfv6-alert-action-close-button slot="action-close"></pfv6-alert-action-close-button>
        </pfv6-alert>
      `);
      const closeButton = el.querySelector('pfv6-alert-action-close-button')!
          .shadowRoot!.querySelector('button');
      const ariaLabel = closeButton!.getAttribute('aria-label');
      expect(ariaLabel).to.include('Close');
      expect(ariaLabel).to.include('Info Alert');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders main container element', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Alert">Content</pfv6-alert>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('renders icon component', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert variant="success" title="Alert">Content</pfv6-alert>`);
      const icon = el.shadowRoot!.querySelector('pfv6-alert-icon');
      expect(icon).to.exist;
      expect(icon!.getAttribute('variant')).to.equal('success');
    });

    it('renders title element', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Test Title">Content</pfv6-alert>`);
      const titleElement = el.shadowRoot!.querySelector('#title');
      expect(titleElement).to.exist;
    });

    it('renders description container', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Alert">Description</pfv6-alert>`);
      const description = el.shadowRoot!.querySelector('#description');
      expect(description).to.exist;
    });

    it('renders action group container', async function() {
      const el = await fixture<Pfv6Alert>(html`<pfv6-alert title="Alert">Content</pfv6-alert>`);
      const actionGroup = el.shadowRoot!.querySelector('#action-group');
      expect(actionGroup).to.exist;
    });
  });
});
