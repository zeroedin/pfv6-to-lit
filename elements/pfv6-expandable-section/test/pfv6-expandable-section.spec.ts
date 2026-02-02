import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6ExpandableSection, Pfv6ExpandableSectionToggleEvent } from '../pfv6-expandable-section.js';
import { Pfv6ExpandableSectionToggle, Pfv6ExpandableSectionToggleClickEvent } from '../pfv6-expandable-section-toggle.js';
import '../pfv6-expandable-section.js';
import '../pfv6-expandable-section-toggle.js';

describe('<pfv6-expandable-section>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-expandable-section')).to.be.an.instanceof(Pfv6ExpandableSection);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-expandable-section'))
          .and
          .to.be.an.instanceOf(Pfv6ExpandableSection);
    });
  });

  describe('variant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.variant).to.equal('default');
    });

    it('accepts "truncate" value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="truncate"></pfv6-expandable-section>`);
      expect(el.variant).to.equal('truncate');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="truncate"></pfv6-expandable-section>`);
      expect(el.getAttribute('variant')).to.equal('truncate');
    });

    it('applies truncate class when set to "truncate"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="truncate"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('truncate')).to.be.true;
    });

    it('does not apply truncate class when "default"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="default"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('truncate')).to.be.false;
    });
  });

  describe('isExpanded property', function() {
    it('defaults to undefined (uncontrolled mode)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.isExpanded).to.be.undefined;
    });

    it('can be set to true (controlled mode)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded></pfv6-expandable-section>`);
      expect(el.isExpanded).to.be.true;
    });

    it('can be set to false (controlled mode)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded="false"></pfv6-expandable-section>`);
      expect(el.isExpanded).to.be.false;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded></pfv6-expandable-section>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('applies expanded class to container when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expanded')).to.be.true;
    });

    it('does not apply expanded class when false', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded="false"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expanded')).to.be.false;
    });

    it('content is hidden when false (default variant)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded="false"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.true;
    });

    it('content is visible when true (default variant)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.false;
    });

    it('content is always visible for truncate variant', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="truncate" is-expanded="false"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.false;
    });
  });

  describe('isDetached property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.isDetached).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached></pfv6-expandable-section>`);
      expect(el.isDetached).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached></pfv6-expandable-section>`);
      expect(el.hasAttribute('is-detached')).to.be.true;
    });

    it('hides toggle button when detached', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached toggle-text="Show More"></pfv6-expandable-section>`);
      await el.updateComplete;
      const toggle = el.shadowRoot!.getElementById('toggle');
      expect(toggle).to.not.exist;
    });

    it('shows toggle button when not detached', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Show More"></pfv6-expandable-section>`);
      await el.updateComplete;
      const toggle = el.shadowRoot!.getElementById('toggle');
      expect(toggle).to.exist;
    });
  });

  describe('displaySize property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.displaySize).to.equal('default');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section display-size="lg"></pfv6-expandable-section>`);
      expect(el.displaySize).to.equal('lg');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section display-size="lg"></pfv6-expandable-section>`);
      expect(el.getAttribute('display-size')).to.equal('lg');
    });

    it('applies display-lg class when set to "lg"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section display-size="lg"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('display-lg')).to.be.true;
    });

    it('does not apply display-lg class when "default"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section display-size="default"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('display-lg')).to.be.false;
    });
  });

  describe('isWidthLimited property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.isWidthLimited).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-width-limited></pfv6-expandable-section>`);
      expect(el.isWidthLimited).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-width-limited></pfv6-expandable-section>`);
      expect(el.hasAttribute('is-width-limited')).to.be.true;
    });

    it('applies limit-width class when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-width-limited></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('limit-width')).to.be.true;
    });

    it('does not apply limit-width class when false', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('limit-width')).to.be.false;
    });
  });

  describe('isIndented property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.isIndented).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-indented></pfv6-expandable-section>`);
      expect(el.isIndented).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-indented></pfv6-expandable-section>`);
      expect(el.hasAttribute('is-indented')).to.be.true;
    });

    it('applies indented class when true', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-indented></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('indented')).to.be.true;
    });

    it('does not apply indented class when false', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('indented')).to.be.false;
    });
  });

  describe('toggleText property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.toggleText).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Show More"></pfv6-expandable-section>`);
      expect(el.toggleText).to.equal('Show More');
    });

    it('renders toggle text in button', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Show More"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Show More');
    });
  });

  describe('toggleTextExpanded property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.toggleTextExpanded).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text-expanded="Show Less"></pfv6-expandable-section>`);
      expect(el.toggleTextExpanded).to.equal('Show Less');
    });

    it('uses toggleTextExpanded when expanded', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section
          is-expanded
          toggle-text="Show More"
          toggle-text-expanded="Show Less">
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Show Less');
    });

    it('falls back to toggleText when collapsed', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section
          is-expanded="false"
          toggle-text="Show More"
          toggle-text-expanded="Show Less">
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Show More');
    });
  });

  describe('toggleTextCollapsed property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.toggleTextCollapsed).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text-collapsed="Show More"></pfv6-expandable-section>`);
      expect(el.toggleTextCollapsed).to.equal('Show More');
    });

    it('uses toggleTextCollapsed when collapsed', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section
          is-expanded="false"
          toggle-text="Show"
          toggle-text-collapsed="Expand Content">
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Expand Content');
    });

    it('falls back to toggleText when expanded', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section
          is-expanded
          toggle-text="Show"
          toggle-text-collapsed="Expand Content">
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Show');
    });
  });

  describe('contentId property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.contentId).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section content-id="custom-content-id"></pfv6-expandable-section>`);
      expect(el.contentId).to.equal('custom-content-id');
    });

    it('applies custom ID to content element', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section content-id="custom-content-id" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.getAttribute('id')).to.equal('custom-content-id');
    });

    it('generates unique ID when not provided', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      const contentId = content?.getAttribute('id');
      expect(contentId).to.match(/^expandable-section-content-[a-f0-9]{8}$/);
    });
  });

  describe('toggleId property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.toggleId).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-id="custom-toggle-id"></pfv6-expandable-section>`);
      expect(el.toggleId).to.equal('custom-toggle-id');
    });

    it('applies custom ID to toggle button', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-id="custom-toggle-id" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('id')).to.equal('custom-toggle-id');
    });

    it('generates unique ID when not provided', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      const toggleId = button?.getAttribute('id');
      expect(toggleId).to.match(/^expandable-section-toggle-[a-f0-9]{8}$/);
    });
  });

  describe('direction property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.direction).to.be.undefined;
    });

    it('accepts "up" value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section direction="up"></pfv6-expandable-section>`);
      expect(el.direction).to.equal('up');
    });

    it('accepts "down" value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section direction="down"></pfv6-expandable-section>`);
      expect(el.direction).to.equal('down');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section direction="up"></pfv6-expandable-section>`);
      expect(el.getAttribute('direction')).to.equal('up');
    });

    it('applies expand-top class when direction is "up" and detached', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached direction="up"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expand-top')).to.be.true;
    });

    it('applies expand-bottom class when direction is "down" and detached', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached direction="down"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expand-bottom')).to.be.true;
    });

    it('applies detached class when direction is provided and detached', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached direction="down"></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('detached')).to.be.true;
    });

    it('does not apply detached class when direction is undefined', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-detached></pfv6-expandable-section>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('detached')).to.be.false;
    });
  });

  describe('truncateMaxLines property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section></pfv6-expandable-section>`);
      expect(el.truncateMaxLines).to.be.undefined;
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section truncate-max-lines="5"></pfv6-expandable-section>`);
      expect(el.truncateMaxLines).to.equal(5);
    });

    it('sets CSS custom property when provided', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section variant="truncate" truncate-max-lines="5">
          <p>Content</p>
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      const lineClampValue = content?.style.getPropertyValue('--pf-v6-c-expandable-section-m-truncate__content--LineClamp');
      expect(lineClampValue).to.equal('5');
    });
  });

  describe('toggle event', function() {
    it('dispatches toggle event on button click (uncontrolled mode)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      let eventFired = false;
      let capturedEvent: Pfv6ExpandableSectionToggleEvent | undefined;

      el.addEventListener('toggle', (e) => {
        eventFired = true;
        capturedEvent = e as Pfv6ExpandableSectionToggleEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();
      await el.updateComplete;

      expect(eventFired).to.be.true;
      expect(capturedEvent).to.be.an.instanceof(Pfv6ExpandableSectionToggleEvent);
    });

    it('event contains correct expanded state (expanding)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ExpandableSectionToggleEvent | undefined;
      el.addEventListener('toggle', (e) => {
        capturedEvent = e as Pfv6ExpandableSectionToggleEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ExpandableSectionToggleEvent);
      expect(capturedEvent!.isExpanded).to.be.true;
    });

    it('event contains correct expanded state (collapsing)', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ExpandableSectionToggleEvent | undefined;
      el.addEventListener('toggle', (e) => {
        capturedEvent = e as Pfv6ExpandableSectionToggleEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ExpandableSectionToggleEvent);
      expect(capturedEvent!.isExpanded).to.be.false;
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      let eventFired = false;
      document.addEventListener('toggle', () => {
        eventFired = true;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(eventFired).to.be.true;
    });

    it('event is composed', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ExpandableSectionToggleEvent | undefined;
      el.addEventListener('toggle', (e) => {
        capturedEvent = e as Pfv6ExpandableSectionToggleEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(capturedEvent?.composed).to.be.true;
    });
  });

  describe('uncontrolled mode behavior', function() {
    it('starts collapsed when isExpanded is undefined', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.true;
    });

    it('toggles to expanded on first click', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('button');
      button?.click();
      await el.updateComplete;

      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.false;
    });

    it('toggles to collapsed on second click', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('button');
      button?.click();
      await el.updateComplete;
      button?.click();
      await el.updateComplete;

      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.true;
    });
  });

  describe('controlled mode behavior', function() {
    it('does not change internal state when isExpanded is controlled', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded="false" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('button');
      button?.click();
      await el.updateComplete;

      // Should still be collapsed because isExpanded prop controls state
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.true;
    });

    it('updates when isExpanded prop changes', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded="false" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;

      el.isExpanded = true;
      await el.updateComplete;

      const content = el.shadowRoot!.getElementById('content');
      expect(content?.hasAttribute('hidden')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section is-expanded>
          <p>Expandable content</p>
        </pfv6-expandable-section>
      `);
      const paragraph = el.querySelector('p');
      expect(paragraph).to.exist;
      expect(paragraph?.textContent).to.equal('Expandable content');
    });

    it('renders toggle-content slot when provided', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section>
          <span slot="toggle-content">Custom Toggle</span>
        </pfv6-expandable-section>
      `);
      const customToggle = el.querySelector('[slot="toggle-content"]');
      expect(customToggle).to.exist;
      expect(customToggle?.textContent).to.equal('Custom Toggle');
    });

    it('prefers toggle-content slot over toggle-text property', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section toggle-text="Default Text">
          <span slot="toggle-content">Custom Toggle</span>
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Custom Toggle');
      expect(button?.textContent).to.not.include('Default Text');
    });
  });

  describe('ARIA attributes', function() {
    it('button has aria-expanded="false" when collapsed', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded="false" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-expanded')).to.equal('false');
    });

    it('button has aria-expanded="true" when expanded', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section is-expanded toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-expanded')).to.equal('true');
    });

    it('button has aria-controls pointing to content ID', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section content-id="custom-content" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-controls')).to.equal('custom-content');
    });

    it('content has aria-labelledby pointing to toggle ID', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-id="custom-toggle" toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.getAttribute('aria-labelledby')).to.equal('custom-toggle');
    });

    it('content has role="region"', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      const content = el.shadowRoot!.getElementById('content');
      expect(content?.getAttribute('role')).to.equal('region');
    });
  });

  describe('focus behavior', function() {
    it('delegates focus to toggle button', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section toggle-text="Toggle"></pfv6-expandable-section>`);
      await el.updateComplete;
      el.focus();
      const button = el.shadowRoot!.querySelector('button');
      expect(el.shadowRoot!.activeElement).to.equal(button);
    });
  });

  describe('truncate variant specific behavior', function() {
    it('renders toggle button inline for truncate variant', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="truncate" toggle-text="Show More"></pfv6-expandable-section>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('inline')).to.be.true;
    });

    it('renders toggle button at end for truncate variant', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`
        <pfv6-expandable-section variant="truncate" toggle-text="Show More">
          <p>Content</p>
        </pfv6-expandable-section>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      const content = el.shadowRoot!.getElementById('content');
      const toggle = el.shadowRoot!.getElementById('toggle');

      const children = Array.from(container?.childNodes || []);
      const contentIndex = children.indexOf(content as ChildNode);
      const toggleIndex = children.indexOf(toggle as ChildNode);

      expect(toggleIndex).to.be.greaterThan(contentIndex);
    });

    it('hides toggle button for truncate variant when detached', async function() {
      const el = await fixture<Pfv6ExpandableSection>(html`<pfv6-expandable-section variant="truncate" is-detached toggle-text="Show More"></pfv6-expandable-section>`);
      await el.updateComplete;
      const toggle = el.shadowRoot!.getElementById('toggle');
      expect(toggle).to.not.exist;
    });
  });
});

describe('<pfv6-expandable-section-toggle>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-expandable-section-toggle')).to.be.an.instanceof(Pfv6ExpandableSectionToggle);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-expandable-section-toggle'))
          .and
          .to.be.an.instanceOf(Pfv6ExpandableSectionToggle);
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded></pfv6-expandable-section-toggle>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded></pfv6-expandable-section-toggle>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('applies expanded class to container when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expanded')).to.be.true;
    });

    it('does not apply expanded class when false', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expanded')).to.be.false;
    });

    it('sets aria-expanded on button when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets aria-expanded on button when false', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-expanded')).to.equal('false');
    });
  });

  describe('contentId property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el.contentId).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle content-id="content-123"></pfv6-expandable-section-toggle>`);
      expect(el.contentId).to.equal('content-123');
    });

    it('applies aria-controls to button', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle content-id="content-123"></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-controls')).to.equal('content-123');
    });
  });

  describe('toggleId property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el.toggleId).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle toggle-id="toggle-123"></pfv6-expandable-section-toggle>`);
      expect(el.toggleId).to.equal('toggle-123');
    });

    it('applies id to button', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle toggle-id="toggle-123"></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('id')).to.equal('toggle-123');
    });
  });

  describe('direction property', function() {
    it('defaults to "down"', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el.direction).to.equal('down');
    });

    it('accepts "up" value', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle direction="up"></pfv6-expandable-section-toggle>`);
      expect(el.direction).to.equal('up');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle direction="up"></pfv6-expandable-section-toggle>`);
      expect(el.getAttribute('direction')).to.equal('up');
    });

    it('applies expand-top class to icon when expanded and direction is "up"', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded direction="up"></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.toggle-icon');
      expect(icon?.classList.contains('expand-top')).to.be.true;
    });

    it('does not apply expand-top class when not expanded', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle direction="up"></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.toggle-icon');
      expect(icon?.classList.contains('expand-top')).to.be.false;
    });

    it('does not apply expand-top class when direction is "down"', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded direction="down"></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.toggle-icon');
      expect(icon?.classList.contains('expand-top')).to.be.false;
    });
  });

  describe('hasTruncatedContent property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el.hasTruncatedContent).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle has-truncated-content></pfv6-expandable-section-toggle>`);
      expect(el.hasTruncatedContent).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle has-truncated-content></pfv6-expandable-section-toggle>`);
      expect(el.hasAttribute('has-truncated-content')).to.be.true;
    });

    it('applies truncate class to container when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle has-truncated-content></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('truncate')).to.be.true;
    });

    it('applies inline class to button when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle has-truncated-content></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('inline')).to.be.true;
    });

    it('hides toggle icon when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle has-truncated-content></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.toggle-icon');
      expect(icon).to.not.exist;
    });

    it('shows toggle icon when false', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.toggle-icon');
      expect(icon).to.exist;
    });
  });

  describe('isDetached property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle></pfv6-expandable-section-toggle>`);
      expect(el.isDetached).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-detached></pfv6-expandable-section-toggle>`);
      expect(el.isDetached).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-detached></pfv6-expandable-section-toggle>`);
      expect(el.hasAttribute('is-detached')).to.be.true;
    });

    it('applies detached class to container when true', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-detached></pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('detached')).to.be.true;
    });
  });

  describe('toggle event', function() {
    it('dispatches toggle event on button click', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;

      let eventFired = false;
      let capturedEvent: Pfv6ExpandableSectionToggleClickEvent | undefined;

      el.addEventListener('toggle', (e) => {
        eventFired = true;
        capturedEvent = e as Pfv6ExpandableSectionToggleClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(eventFired).to.be.true;
      expect(capturedEvent).to.be.an.instanceof(Pfv6ExpandableSectionToggleClickEvent);
    });

    it('event contains correct expanded state (expanding)', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ExpandableSectionToggleClickEvent | undefined;
      el.addEventListener('toggle', (e) => {
        capturedEvent = e as Pfv6ExpandableSectionToggleClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ExpandableSectionToggleClickEvent);
      expect(capturedEvent!.isExpanded).to.be.true;
    });

    it('event contains correct expanded state (collapsing)', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle is-expanded>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ExpandableSectionToggleClickEvent | undefined;
      el.addEventListener('toggle', (e) => {
        capturedEvent = e as Pfv6ExpandableSectionToggleClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ExpandableSectionToggleClickEvent);
      expect(capturedEvent!.isExpanded).to.be.false;
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;

      let eventFired = false;
      document.addEventListener('toggle', () => {
        eventFired = true;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(eventFired).to.be.true;
    });

    it('event is composed', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ExpandableSectionToggleClickEvent | undefined;
      el.addEventListener('toggle', (e) => {
        capturedEvent = e as Pfv6ExpandableSectionToggleClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button?.click();

      expect(capturedEvent?.composed).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`
        <pfv6-expandable-section-toggle>
          <span>Custom Toggle Text</span>
        </pfv6-expandable-section-toggle>
      `);
      const span = el.querySelector('span');
      expect(span).to.exist;
      expect(span?.textContent).to.equal('Custom Toggle Text');
    });

    it('renders slot content inside button', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`
        <pfv6-expandable-section-toggle>Toggle Text</pfv6-expandable-section-toggle>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.textContent).to.include('Toggle Text');
    });
  });

  describe('rendering', function() {
    it('renders button element', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.tagName.toLowerCase()).to.equal('button');
    });

    it('button has type="button"', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('type')).to.equal('button');
    });

    it('renders toggle icon with SVG', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.toggle-icon');
      const svg = icon?.querySelector('svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('focus behavior', function() {
    it('delegates focus to toggle button', async function() {
      const el = await fixture<Pfv6ExpandableSectionToggle>(html`<pfv6-expandable-section-toggle>Toggle</pfv6-expandable-section-toggle>`);
      await el.updateComplete;
      el.focus();
      const button = el.shadowRoot!.querySelector('button');
      expect(el.shadowRoot!.activeElement).to.equal(button);
    });
  });
});
