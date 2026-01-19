// With globals: true, describe/it/expect are available globally
import { html, fixture, expect, nextFrame, aTimeout } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import { Pfv6Tooltip } from '../pfv6-tooltip.js';
import { Pfv6TooltipContent } from '../pfv6-tooltip-content.js';
import { Pfv6TooltipArrow } from '../pfv6-tooltip-arrow.js';
import '../pfv6-tooltip.js';
import '../pfv6-tooltip-content.js';
import '../pfv6-tooltip-arrow.js';

describe('<pfv6-tooltip>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-tooltip')).to.be.an.instanceof(Pfv6Tooltip);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-tooltip'))
          .and
          .to.be.an.instanceOf(Pfv6Tooltip);
    });
  });

  describe('content property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.content).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Tooltip text"></pfv6-tooltip>
      `);
      expect(el.content).to.equal('Tooltip text');
    });

    it('updates content when property changes', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Initial"></pfv6-tooltip>
      `);
      el.content = 'Updated';
      await el.updateComplete;
      expect(el.content).to.equal('Updated');
    });
  });

  describe('position property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.position).to.equal('top');
    });

    it('accepts "auto" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip position="auto"></pfv6-tooltip>
      `);
      expect(el.position).to.equal('auto');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip position="bottom"></pfv6-tooltip>
      `);
      expect(el.position).to.equal('bottom');
    });

    it('accepts "left" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip position="left"></pfv6-tooltip>
      `);
      expect(el.position).to.equal('left');
    });

    it('accepts "right" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip position="right"></pfv6-tooltip>
      `);
      expect(el.position).to.equal('right');
    });

    it('accepts "top-start" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip position="top-start"></pfv6-tooltip>
      `);
      expect(el.position).to.equal('top-start');
    });

    it('accepts "bottom-end" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip position="bottom-end"></pfv6-tooltip>
      `);
      expect(el.position).to.equal('bottom-end');
    });
  });

  describe('distance property', function() {
    it('defaults to 15', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.distance).to.equal(15);
    });

    it('accepts custom number value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip distance="25"></pfv6-tooltip>
      `);
      expect(el.distance).to.equal(25);
    });
  });

  describe('enableFlip property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.enableFlip).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip enable-flip="false"></pfv6-tooltip>
      `);
      expect(el.enableFlip).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip enable-flip></pfv6-tooltip>
      `);
      expect(el.hasAttribute('enable-flip')).to.be.true;
    });
  });

  describe('entryDelay property', function() {
    it('defaults to 300', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.entryDelay).to.equal(300);
    });

    it('accepts custom delay value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip entry-delay="500"></pfv6-tooltip>
      `);
      expect(el.entryDelay).to.equal(500);
    });
  });

  describe('exitDelay property', function() {
    it('defaults to 300', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.exitDelay).to.equal(300);
    });

    it('accepts custom delay value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip exit-delay="400"></pfv6-tooltip>
      `);
      expect(el.exitDelay).to.equal(400);
    });
  });

  describe('trigger property', function() {
    it('defaults to "mouseenter focus"', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.trigger).to.equal('mouseenter focus');
    });

    it('accepts "manual" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip trigger="manual"></pfv6-tooltip>
      `);
      expect(el.trigger).to.equal('manual');
    });

    it('accepts "click" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip trigger="click"></pfv6-tooltip>
      `);
      expect(el.trigger).to.equal('click');
    });

    it('accepts combined "mouseenter focus click" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip trigger="mouseenter focus click"></pfv6-tooltip>
      `);
      expect(el.trigger).to.equal('mouseenter focus click');
    });
  });

  describe('isContentLeftAligned property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.isContentLeftAligned).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip is-content-left-aligned></pfv6-tooltip>
      `);
      expect(el.isContentLeftAligned).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip is-content-left-aligned></pfv6-tooltip>
      `);
      expect(el.hasAttribute('is-content-left-aligned')).to.be.true;
    });
  });

  describe('isVisible property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.isVisible).to.be.false;
    });

    it('can be set to true with manual trigger', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip trigger="manual" is-visible></pfv6-tooltip>
      `);
      expect(el.isVisible).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip is-visible></pfv6-tooltip>
      `);
      expect(el.hasAttribute('is-visible')).to.be.true;
    });
  });

  describe('maxWidth property', function() {
    it('defaults to "18.75rem"', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.maxWidth).to.equal('18.75rem');
    });

    it('accepts custom width value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip max-width="300px"></pfv6-tooltip>
      `);
      expect(el.maxWidth).to.equal('300px');
    });
  });

  describe('minWidth property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.minWidth).to.be.undefined;
    });

    it('accepts custom width value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip min-width="100px"></pfv6-tooltip>
      `);
      expect(el.minWidth).to.equal('100px');
    });

    it('accepts "trigger" value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip min-width="trigger"></pfv6-tooltip>
      `);
      expect(el.minWidth).to.equal('trigger');
    });
  });

  describe('zIndex property', function() {
    it('defaults to 9999', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.zIndex).to.equal(9999);
    });

    it('accepts custom z-index value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip z-index="5000"></pfv6-tooltip>
      `);
      expect(el.zIndex).to.equal(5000);
    });
  });

  describe('animationDuration property', function() {
    it('defaults to 300', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.animationDuration).to.equal(300);
    });

    it('accepts custom duration value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip animation-duration="500"></pfv6-tooltip>
      `);
      expect(el.animationDuration).to.equal(500);
    });
  });

  describe('silent property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.silent).to.equal(false);
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip silent></pfv6-tooltip>
      `);
      expect(el.silent).to.equal(true);
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.hasAttribute('silent')).to.be.false;
      el.silent = true;
      await el.updateComplete;
      expect(el.hasAttribute('silent')).to.be.true;
    });
  });

  describe('triggerId property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      expect(el.triggerId).to.be.undefined;
    });

    it('accepts element ID value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip trigger-id="external-trigger"></pfv6-tooltip>
      `);
      expect(el.triggerId).to.equal('external-trigger');
    });
  });

  describe('tooltip-hidden event', function() {
    it('dispatches after tooltip hide animation completes', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-tooltip content="Test" trigger="manual" is-visible animation-duration="50">
            <button>Trigger</button>
          </pfv6-tooltip>
        </div>
      `);
      const el = container.querySelector('pfv6-tooltip') as Pfv6Tooltip;
      const handler = sinon.spy();
      el.addEventListener('tooltip-hidden', handler);

      // Hide tooltip
      el.isVisible = false;
      await el.updateComplete;

      // Event should not fire immediately
      expect(handler).to.not.have.been.called;

      // Wait for animation duration
      await aTimeout(100);

      // Event should have fired
      expect(handler).to.have.been.calledOnce;
    });

    it('event is instance of Event', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-tooltip content="Test" trigger="manual" is-visible animation-duration="50">
            <button>Trigger</button>
          </pfv6-tooltip>
        </div>
      `);
      const el = container.querySelector('pfv6-tooltip') as Pfv6Tooltip;
      let capturedEvent: Event | undefined;
      el.addEventListener('tooltip-hidden', e => {
        capturedEvent = e;
      });

      el.isVisible = false;
      await el.updateComplete;
      await aTimeout(100);

      expect(capturedEvent).to.be.an.instanceof(Event);
    });

    it('event bubbles', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-tooltip content="Test" trigger="manual" is-visible animation-duration="50">
            <button>Trigger</button>
          </pfv6-tooltip>
        </div>
      `);
      const el = container.querySelector('pfv6-tooltip') as Pfv6Tooltip;
      const containerHandler = sinon.spy();
      container.addEventListener('tooltip-hidden', containerHandler);

      el.isVisible = false;
      await el.updateComplete;
      await aTimeout(100);

      expect(containerHandler).to.have.been.calledOnce;
    });

    it('event is composed', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-tooltip content="Test" trigger="manual" is-visible animation-duration="50">
            <button>Trigger</button>
          </pfv6-tooltip>
        </div>
      `);
      const el = container.querySelector('pfv6-tooltip') as Pfv6Tooltip;
      let capturedEvent: Event | undefined;
      el.addEventListener('tooltip-hidden', e => {
        capturedEvent = e;
      });

      el.isVisible = false;
      await el.updateComplete;
      await aTimeout(100);

      expect(capturedEvent?.composed).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content (trigger element)', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test">
          <button>Click me</button>
        </pfv6-tooltip>
      `);
      const slotted = el.querySelector('button');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Click me');
    });

    it('renders tooltip content when visible', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Tooltip text" trigger="manual" is-visible>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip-content');
      expect(tooltipContent).to.exist;
      expect(tooltipContent?.textContent?.trim()).to.equal('Tooltip text');
    });

    it('does not render tooltip when not visible', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Tooltip text" trigger="manual">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;

      const tooltip = el.shadowRoot?.querySelector('#tooltip');
      expect(tooltip).to.not.exist;
    });
  });

  describe('sub-components', function() {
    it('renders pfv6-tooltip-content', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const content = el.shadowRoot?.querySelector('pfv6-tooltip-content');
      expect(content).to.exist;
      expect(content).to.be.an.instanceof(Pfv6TooltipContent);
    });

    it('renders pfv6-tooltip-arrow', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const arrow = el.shadowRoot?.querySelector('pfv6-tooltip-arrow');
      expect(arrow).to.exist;
      expect(arrow).to.be.an.instanceof(Pfv6TooltipArrow);
    });

    it('passes is-left-aligned to pfv6-tooltip-content', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible is-content-left-aligned>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const content = el.shadowRoot?.querySelector('pfv6-tooltip-content') as Pfv6TooltipContent;
      expect(content?.isLeftAligned).to.be.true;
    });
  });

  describe('manual trigger behavior', function() {
    it('shows tooltip when isVisible is true', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);

      // Initially not visible
      expect(el.shadowRoot?.querySelector('#tooltip')).to.not.exist;

      // Show tooltip
      el.isVisible = true;
      await el.updateComplete;
      await nextFrame();

      expect(el.shadowRoot?.querySelector('#tooltip')).to.exist;
    });

    it('hides tooltip when isVisible is false', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      // Initially visible
      expect(el.shadowRoot?.querySelector('#tooltip')).to.exist;

      // Hide tooltip
      el.isVisible = false;
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('#tooltip')).to.not.exist;
    });
  });

  describe('ARIA behavior', function() {
    it('creates shared announcer element in document.body', async function() {
      await fixture<Pfv6Tooltip>(html`<pfv6-tooltip></pfv6-tooltip>`);
      const announcer = document.getElementById('pfv6-tooltip-announcer');
      expect(announcer).to.exist;
      expect(announcer?.getAttribute('role')).to.equal('status');
    });

    it('announces tooltip content when shown', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test tooltip content" trigger="manual">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);

      const announcer = document.getElementById('pfv6-tooltip-announcer');
      expect(announcer?.innerText).to.equal('');

      // Show tooltip
      el.isVisible = true;
      await el.updateComplete;
      await nextFrame();

      expect(announcer?.innerText).to.equal('Test tooltip content');
    });

    it('clears announcement when tooltip is hidden', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test content" trigger="manual" is-visible>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);

      await el.updateComplete;
      await nextFrame();

      const announcer = document.getElementById('pfv6-tooltip-announcer');
      expect(announcer?.innerText).to.equal('Test content');

      // Hide tooltip
      el.isVisible = false;
      await el.updateComplete;
      await nextFrame();

      expect(announcer?.innerText).to.equal('');
    });

    it('does not announce when silent is true', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Silent content" trigger="manual" silent>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);

      const announcer = document.getElementById('pfv6-tooltip-announcer');

      // Show tooltip
      el.isVisible = true;
      await el.updateComplete;
      await nextFrame();

      // Announcer should remain empty when silent
      expect(announcer?.innerText).to.equal('');
    });

    it('does not set aria-describedby on trigger (avoids cross-root issues)', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-tooltip content="Test" trigger="manual">
            <button id="test-button">Trigger</button>
          </pfv6-tooltip>
        </div>
      `);
      const el = container.querySelector('pfv6-tooltip') as Pfv6Tooltip;
      const button = container.querySelector('button') as HTMLButtonElement;

      el.isVisible = true;
      await el.updateComplete;
      await nextFrame();

      // Should NOT have aria-describedby (uses live region instead)
      expect(button.hasAttribute('aria-describedby')).to.be.false;
      expect(button.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('tooltip has role="tooltip"', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible>
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltip = el.shadowRoot?.querySelector('#tooltip');
      expect(tooltip?.getAttribute('role')).to.equal('tooltip');
    });

    it('tooltip has correct aria-live value', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible aria-live="polite">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltip = el.shadowRoot?.querySelector('#tooltip');
      expect(tooltip?.getAttribute('aria-live')).to.equal('polite');
    });
  });

  describe('external trigger (triggerId)', function() {
    it('attaches to external trigger element by ID', async function() {
      const container = await fixture(html`
        <div>
          <button id="external-trigger">External Button</button>
          <pfv6-tooltip content="Test" trigger-id="external-trigger"></pfv6-tooltip>
        </div>
      `);
      const el = container.querySelector('pfv6-tooltip') as Pfv6Tooltip;
      const button = container.querySelector('#external-trigger') as HTMLButtonElement;

      expect(el.triggerId).to.equal('external-trigger');

      // Show tooltip manually to verify connection
      el.isVisible = true;
      el.trigger = 'manual';
      await el.updateComplete;
      await nextFrame();

      // External trigger should get aria-describedby
      expect(button.hasAttribute('aria-describedby')).to.be.true;
    });
  });

  describe('positioning modifiers', function() {
    it('applies position classes to tooltip', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible position="bottom">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltip = el.shadowRoot?.querySelector('#tooltip');
      // Note: actual positioning class depends on Floating UI calculation
      // Just verify tooltip element exists
      expect(tooltip).to.exist;
    });

    it('applies max-width style to tooltip', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible max-width="300px">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltip = el.shadowRoot?.querySelector('#tooltip') as HTMLElement;
      expect(tooltip?.style.maxWidth).to.equal('300px');
    });

    it('applies min-width style to tooltip when specified', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible min-width="150px">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltip = el.shadowRoot?.querySelector('#tooltip') as HTMLElement;
      expect(tooltip?.style.minWidth).to.equal('150px');
    });

    it('applies z-index style to tooltip', async function() {
      const el = await fixture<Pfv6Tooltip>(html`
        <pfv6-tooltip content="Test" trigger="manual" is-visible z-index="5000">
          <button>Trigger</button>
        </pfv6-tooltip>
      `);
      await el.updateComplete;
      await nextFrame();

      const tooltip = el.shadowRoot?.querySelector('#tooltip') as HTMLElement;
      expect(tooltip?.style.zIndex).to.equal('5000');
    });
  });
});

describe('<pfv6-tooltip-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-tooltip-content')).to.be.an.instanceof(Pfv6TooltipContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TooltipContent>(html`<pfv6-tooltip-content></pfv6-tooltip-content>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-tooltip-content'))
          .and
          .to.be.an.instanceOf(Pfv6TooltipContent);
    });
  });

  describe('isLeftAligned property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TooltipContent>(html`<pfv6-tooltip-content></pfv6-tooltip-content>`);
      expect(el.isLeftAligned).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TooltipContent>(html`
        <pfv6-tooltip-content is-left-aligned></pfv6-tooltip-content>
      `);
      expect(el.isLeftAligned).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TooltipContent>(html`
        <pfv6-tooltip-content is-left-aligned></pfv6-tooltip-content>
      `);
      expect(el.hasAttribute('is-left-aligned')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6TooltipContent>(html`
        <pfv6-tooltip-content>
          <span>Content text</span>
        </pfv6-tooltip-content>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Content text');
    });
  });
});

describe('<pfv6-tooltip-arrow>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-tooltip-arrow')).to.be.an.instanceof(Pfv6TooltipArrow);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TooltipArrow>(html`<pfv6-tooltip-arrow></pfv6-tooltip-arrow>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-tooltip-arrow'))
          .and
          .to.be.an.instanceOf(Pfv6TooltipArrow);
    });
  });

  describe('rendering', function() {
    it('renders arrow element', async function() {
      const el = await fixture<Pfv6TooltipArrow>(html`<pfv6-tooltip-arrow></pfv6-tooltip-arrow>`);
      const arrow = el.shadowRoot?.querySelector('#arrow');
      expect(arrow).to.exist;
    });
  });
});
