import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6SidebarPanel } from '../pfv6-sidebar-panel.js';
import '../pfv6-sidebar-panel.js';

describe('<pfv6-sidebar-panel>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-sidebar-panel')).to.be.an.instanceof(Pfv6SidebarPanel);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-sidebar-panel'))
          .and
          .to.be.an.instanceOf(Pfv6SidebarPanel);
    });
  });

  describe('variant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.variant).to.equal('default');
    });

    it('accepts "sticky" value', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel variant="sticky"></pfv6-sidebar-panel>`);
      expect(el.variant).to.equal('sticky');
    });

    it('accepts "static" value', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel variant="static"></pfv6-sidebar-panel>`);
      expect(el.variant).to.equal('static');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel variant="sticky"></pfv6-sidebar-panel>`);
      expect(el.hasAttribute('variant')).to.be.true;
      expect(el.getAttribute('variant')).to.equal('sticky');
    });

    it('applies sticky class when variant is "sticky"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel variant="sticky"></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
    });

    it('applies static class when variant is "static"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel variant="static"></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('static')).to.be.true;
    });

    it('does not apply variant class when variant is "default"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.false;
      expect(container!.classList.contains('static')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel variant="sticky"></pfv6-sidebar-panel>`);
      expect(el.variant).to.equal('sticky');

      el.variant = 'static';
      await el.updateComplete;

      expect(el.variant).to.equal('static');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('static')).to.be.true;
      expect(container!.classList.contains('sticky')).to.be.false;
    });
  });

  describe('hasNoBackground property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.hasNoBackground).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel has-no-background></pfv6-sidebar-panel>`);
      expect(el.hasNoBackground).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel has-no-background></pfv6-sidebar-panel>`);
      expect(el.hasAttribute('has-no-background')).to.be.true;
    });

    it('applies no-background class when true', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel has-no-background></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
    });

    it('does not apply no-background class when false', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.hasNoBackground).to.be.false;

      el.hasNoBackground = true;
      await el.updateComplete;

      expect(el.hasNoBackground).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
    });
  });

  describe('hasPadding property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.hasPadding).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel has-padding></pfv6-sidebar-panel>`);
      expect(el.hasPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel has-padding></pfv6-sidebar-panel>`);
      expect(el.hasAttribute('has-padding')).to.be.true;
    });

    it('applies padding class when true', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel has-padding></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('padding')).to.be.true;
    });

    it('does not apply padding class when false', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('padding')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.hasPadding).to.be.false;

      el.hasPadding = true;
      await el.updateComplete;

      expect(el.hasPadding).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('padding')).to.be.true;
    });
  });

  describe('backgroundVariant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.backgroundVariant).to.equal('default');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel background-variant="secondary"></pfv6-sidebar-panel>`);
      expect(el.backgroundVariant).to.equal('secondary');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel background-variant="secondary"></pfv6-sidebar-panel>`);
      expect(el.hasAttribute('background-variant')).to.be.true;
      expect(el.getAttribute('background-variant')).to.equal('secondary');
    });

    it('applies secondary class when variant is "secondary"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel background-variant="secondary"></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('secondary')).to.be.true;
    });

    it('does not apply secondary class when variant is "default"', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('secondary')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.backgroundVariant).to.equal('default');

      el.backgroundVariant = 'secondary';
      await el.updateComplete;

      expect(el.backgroundVariant).to.equal('secondary');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('secondary')).to.be.true;
    });
  });

  describe('width property (responsive)', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      expect(el.width).to.be.undefined;
    });

    it('parses single width value', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25"></pfv6-sidebar-panel>
      `);
      expect(el.width).to.deep.equal({
        default: 'width_25',
      });
    });

    it('parses responsive width values', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25 md:width_50 lg:width_33"></pfv6-sidebar-panel>
      `);
      expect(el.width).to.deep.equal({
        default: 'width_25',
        md: 'width_50',
        lg: 'width_33',
      });
    });

    it('parses all width variants', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25 sm:width_33 md:width_50 lg:width_66 xl:width_75 2xl:width_100"></pfv6-sidebar-panel>
      `);
      expect(el.width).to.deep.equal({
        'default': 'width_25',
        'sm': 'width_33',
        'md': 'width_50',
        'lg': 'width_66',
        'xl': 'width_75',
        '2xl': 'width_100',
      });
    });

    it('applies width modifier class for default breakpoint', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25"></pfv6-sidebar-panel>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('width_25')).to.be.true;
    });

    it('applies width modifier classes for responsive breakpoints', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25 md:width_50"></pfv6-sidebar-panel>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('width_25')).to.be.true;
      expect(container!.classList.contains('width_50-on-md')).to.be.true;
    });

    it('applies multiple responsive width classes', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25 md:width_50 lg:width_33 xl:width_66"></pfv6-sidebar-panel>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('width_25')).to.be.true;
      expect(container!.classList.contains('width_50-on-md')).to.be.true;
      expect(container!.classList.contains('width_33-on-lg')).to.be.true;
      expect(container!.classList.contains('width_66-on-xl')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel width="width_25"></pfv6-sidebar-panel>
      `);
      expect(el.width).to.deep.equal({ default: 'width_25' });

      el.setAttribute('width', 'width_50 md:width_75');
      await el.updateComplete;

      expect(el.width).to.deep.equal({
        default: 'width_50',
        md: 'width_75',
      });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('width_50')).to.be.true;
      expect(container!.classList.contains('width_75-on-md')).to.be.true;
      expect(container!.classList.contains('width_25')).to.be.false;
    });

    it('does not apply width classes when width is undefined', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel></pfv6-sidebar-panel>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      const classes = Array.from(container!.classList);
      const widthClasses = classes.filter(c => c.startsWith('width_'));
      expect(widthClasses).to.have.lengthOf(0);
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel>
          <p>Panel content</p>
        </pfv6-sidebar-panel>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Panel content');
    });

    it('renders text content', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel>Plain panel text</pfv6-sidebar-panel>
      `);
      expect(el.textContent?.trim()).to.equal('Plain panel text');
    });

    it('renders multiple slotted elements', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`
        <pfv6-sidebar-panel>
          <h3>Panel Title</h3>
          <p>Panel content</p>
        </pfv6-sidebar-panel>
      `);
      const heading = el.querySelector('h3');
      const paragraph = el.querySelector('p');

      expect(heading).to.exist;
      expect(paragraph).to.exist;
      expect(heading?.textContent).to.equal('Panel Title');
      expect(paragraph?.textContent).to.equal('Panel content');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('container element contains default slot', async function() {
      const el = await fixture<Pfv6SidebarPanel>(html`<pfv6-sidebar-panel></pfv6-sidebar-panel>`);
      const container = el.shadowRoot!.querySelector('#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can combine variant and padding', async function() {
      const el = await fixture<Pfv6SidebarPanel>(
        html`<pfv6-sidebar-panel variant="sticky" has-padding></pfv6-sidebar-panel>`
      );
      expect(el.variant).to.equal('sticky');
      expect(el.hasPadding).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
      expect(container!.classList.contains('padding')).to.be.true;
    });

    it('can combine width and backgroundVariant', async function() {
      const el = await fixture<Pfv6SidebarPanel>(
        html`<pfv6-sidebar-panel width="width_25" background-variant="secondary"></pfv6-sidebar-panel>`
      );
      expect(el.width).to.deep.equal({ default: 'width_25' });
      expect(el.backgroundVariant).to.equal('secondary');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('width_25')).to.be.true;
      expect(container!.classList.contains('secondary')).to.be.true;
    });

    it('can combine all boolean properties', async function() {
      const el = await fixture<Pfv6SidebarPanel>(
        html`<pfv6-sidebar-panel has-no-background has-padding></pfv6-sidebar-panel>`
      );
      expect(el.hasNoBackground).to.be.true;
      expect(el.hasPadding).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
      expect(container!.classList.contains('padding')).to.be.true;
    });

    it('can combine all properties including width', async function() {
      const el = await fixture<Pfv6SidebarPanel>(
        html`<pfv6-sidebar-panel variant="sticky" has-no-background has-padding width="width_25 md:width_50" background-variant="secondary"></pfv6-sidebar-panel>`
      );
      expect(el.variant).to.equal('sticky');
      expect(el.hasNoBackground).to.be.true;
      expect(el.hasPadding).to.be.true;
      expect(el.width).to.deep.equal({ default: 'width_25', md: 'width_50' });
      expect(el.backgroundVariant).to.equal('secondary');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
      expect(container!.classList.contains('no-background')).to.be.true;
      expect(container!.classList.contains('padding')).to.be.true;
      expect(container!.classList.contains('width_25')).to.be.true;
      expect(container!.classList.contains('width_50-on-md')).to.be.true;
      expect(container!.classList.contains('secondary')).to.be.true;
    });
  });
});
