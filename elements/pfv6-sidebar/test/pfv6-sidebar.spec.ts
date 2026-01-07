import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Sidebar } from '../pfv6-sidebar.js';
import '../pfv6-sidebar.js';

describe('<pfv6-sidebar>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-sidebar')).to.be.an.instanceof(Pfv6Sidebar);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-sidebar'))
        .and
        .to.be.an.instanceOf(Pfv6Sidebar);
    });
  });

  describe('orientation property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.orientation).to.be.undefined;
    });

    it('accepts "stack" value', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar orientation="stack"></pfv6-sidebar>`);
      expect(el.orientation).to.equal('stack');
    });

    it('accepts "split" value', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar orientation="split"></pfv6-sidebar>`);
      expect(el.orientation).to.equal('split');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar orientation="stack"></pfv6-sidebar>`);
      expect(el.hasAttribute('orientation')).to.be.true;
      expect(el.getAttribute('orientation')).to.equal('stack');
    });

    it('applies stack class when orientation is "stack"', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar orientation="stack"></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('stack')).to.be.true;
    });

    it('applies split class when orientation is "split"', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar orientation="split"></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('split')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar orientation="stack"></pfv6-sidebar>`);
      expect(el.orientation).to.equal('stack');

      el.orientation = 'split';
      await el.updateComplete;

      expect(el.orientation).to.equal('split');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('split')).to.be.true;
      expect(container!.classList.contains('stack')).to.be.false;
    });
  });

  describe('isPanelRight property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.isPanelRight).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar is-panel-right></pfv6-sidebar>`);
      expect(el.isPanelRight).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar is-panel-right></pfv6-sidebar>`);
      expect(el.hasAttribute('is-panel-right')).to.be.true;
    });

    it('applies panel-right class when true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar is-panel-right></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('panel-right')).to.be.true;
    });

    it('does not apply panel-right class when false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('panel-right')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.isPanelRight).to.be.false;

      el.isPanelRight = true;
      await el.updateComplete;

      expect(el.isPanelRight).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('panel-right')).to.be.true;
    });
  });

  describe('hasGutter property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.hasGutter).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-gutter></pfv6-sidebar>`);
      expect(el.hasGutter).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-gutter></pfv6-sidebar>`);
      expect(el.hasAttribute('has-gutter')).to.be.true;
    });

    it('applies gutter class when true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-gutter></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('gutter')).to.be.true;
    });

    it('does not apply gutter class when false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('gutter')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.hasGutter).to.be.false;

      el.hasGutter = true;
      await el.updateComplete;

      expect(el.hasGutter).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('gutter')).to.be.true;
    });
  });

  describe('hasNoBackground property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.hasNoBackground).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-no-background></pfv6-sidebar>`);
      expect(el.hasNoBackground).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-no-background></pfv6-sidebar>`);
      expect(el.hasAttribute('has-no-background')).to.be.true;
    });

    it('applies no-background class when true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-no-background></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
    });

    it('does not apply no-background class when false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.hasNoBackground).to.be.false;

      el.hasNoBackground = true;
      await el.updateComplete;

      expect(el.hasNoBackground).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
    });
  });

  describe('hasBorder property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.hasBorder).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-border></pfv6-sidebar>`);
      expect(el.hasBorder).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-border></pfv6-sidebar>`);
      expect(el.hasAttribute('has-border')).to.be.true;
    });

    it('applies border class to main element when true', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-border></pfv6-sidebar>`);
      const main = el.shadowRoot!.querySelector('#main');
      expect(main!.classList.contains('border')).to.be.true;
    });

    it('does not apply border class to main element when false', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const main = el.shadowRoot!.querySelector('#main');
      expect(main!.classList.contains('border')).to.be.false;
    });

    it('border is on main element, not container', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar has-border></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      const main = el.shadowRoot!.querySelector('#main');

      expect(container!.classList.contains('border')).to.be.false;
      expect(main!.classList.contains('border')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      expect(el.hasBorder).to.be.false;

      el.hasBorder = true;
      await el.updateComplete;

      expect(el.hasBorder).to.be.true;
      const main = el.shadowRoot!.querySelector('#main');
      expect(main!.classList.contains('border')).to.be.true;
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Sidebar>(html`
        <pfv6-sidebar>
          <pfv6-sidebar-content>Content</pfv6-sidebar-content>
        </pfv6-sidebar>
      `);
      const slotted = el.querySelector('pfv6-sidebar-content');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Content');
    });

    it('renders multiple slotted elements', async function() {
      const el = await fixture<Pfv6Sidebar>(html`
        <pfv6-sidebar>
          <pfv6-sidebar-content>Content</pfv6-sidebar-content>
          <pfv6-sidebar-panel>Panel</pfv6-sidebar-panel>
        </pfv6-sidebar>
      `);
      const content = el.querySelector('pfv6-sidebar-content');
      const panel = el.querySelector('pfv6-sidebar-panel');

      expect(content).to.exist;
      expect(panel).to.exist;
      expect(content?.textContent).to.equal('Content');
      expect(panel?.textContent).to.equal('Panel');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('renders main element inside container', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      const main = container!.querySelector('#main');
      expect(main).to.exist;
      expect(main!.tagName).to.equal('DIV');
    });

    it('main element contains default slot', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const main = el.shadowRoot!.querySelector('#main');
      const slot = main!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('has two-level structure: container > main', async function() {
      const el = await fixture<Pfv6Sidebar>(html`<pfv6-sidebar></pfv6-sidebar>`);
      const container = el.shadowRoot!.querySelector('#container');
      const main = el.shadowRoot!.querySelector('#main');

      expect(container).to.exist;
      expect(main).to.exist;
      expect(main!.parentElement).to.equal(container);
    });
  });

  describe('combined properties', function() {
    it('can combine orientation and panel position', async function() {
      const el = await fixture<Pfv6Sidebar>(
        html`<pfv6-sidebar orientation="split" is-panel-right></pfv6-sidebar>`
      );
      expect(el.orientation).to.equal('split');
      expect(el.isPanelRight).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('split')).to.be.true;
      expect(container!.classList.contains('panel-right')).to.be.true;
    });

    it('can combine gutter and border', async function() {
      const el = await fixture<Pfv6Sidebar>(
        html`<pfv6-sidebar has-gutter has-border></pfv6-sidebar>`
      );
      expect(el.hasGutter).to.be.true;
      expect(el.hasBorder).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      const main = el.shadowRoot!.querySelector('#main');
      expect(container!.classList.contains('gutter')).to.be.true;
      expect(main!.classList.contains('border')).to.be.true;
    });

    it('can combine all boolean properties', async function() {
      const el = await fixture<Pfv6Sidebar>(
        html`<pfv6-sidebar is-panel-right has-gutter has-no-background has-border></pfv6-sidebar>`
      );
      expect(el.isPanelRight).to.be.true;
      expect(el.hasGutter).to.be.true;
      expect(el.hasNoBackground).to.be.true;
      expect(el.hasBorder).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      const main = el.shadowRoot!.querySelector('#main');
      expect(container!.classList.contains('panel-right')).to.be.true;
      expect(container!.classList.contains('gutter')).to.be.true;
      expect(container!.classList.contains('no-background')).to.be.true;
      expect(main!.classList.contains('border')).to.be.true;
    });

    it('can combine all properties including orientation', async function() {
      const el = await fixture<Pfv6Sidebar>(
        html`<pfv6-sidebar orientation="stack" is-panel-right has-gutter has-no-background has-border></pfv6-sidebar>`
      );
      expect(el.orientation).to.equal('stack');
      expect(el.isPanelRight).to.be.true;
      expect(el.hasGutter).to.be.true;
      expect(el.hasNoBackground).to.be.true;
      expect(el.hasBorder).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      const main = el.shadowRoot!.querySelector('#main');
      expect(container!.classList.contains('stack')).to.be.true;
      expect(container!.classList.contains('panel-right')).to.be.true;
      expect(container!.classList.contains('gutter')).to.be.true;
      expect(container!.classList.contains('no-background')).to.be.true;
      expect(main!.classList.contains('border')).to.be.true;
    });
  });
});
