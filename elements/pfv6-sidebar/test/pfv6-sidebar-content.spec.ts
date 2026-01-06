import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6SidebarContent } from '../pfv6-sidebar-content.js';
import '../pfv6-sidebar-content.js';

describe('<pfv6-sidebar-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-sidebar-content')).to.be.an.instanceof(Pfv6SidebarContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-sidebar-content'))
        .and
        .to.be.an.instanceOf(Pfv6SidebarContent);
    });
  });

  describe('hasNoBackground property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      expect(el.hasNoBackground).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content has-no-background></pfv6-sidebar-content>`);
      expect(el.hasNoBackground).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content has-no-background></pfv6-sidebar-content>`);
      expect(el.hasAttribute('has-no-background')).to.be.true;
    });

    it('applies no-background class when true', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content has-no-background></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
    });

    it('does not apply no-background class when false', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
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
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      expect(el.hasPadding).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content has-padding></pfv6-sidebar-content>`);
      expect(el.hasPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content has-padding></pfv6-sidebar-content>`);
      expect(el.hasAttribute('has-padding')).to.be.true;
    });

    it('applies padding class when true', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content has-padding></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('padding')).to.be.true;
    });

    it('does not apply padding class when false', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('padding')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
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
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      expect(el.backgroundVariant).to.equal('default');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content background-variant="secondary"></pfv6-sidebar-content>`);
      expect(el.backgroundVariant).to.equal('secondary');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content background-variant="secondary"></pfv6-sidebar-content>`);
      expect(el.hasAttribute('background-variant')).to.be.true;
      expect(el.getAttribute('background-variant')).to.equal('secondary');
    });

    it('applies secondary class when variant is "secondary"', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content background-variant="secondary"></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('secondary')).to.be.true;
    });

    it('does not apply secondary class when variant is "default"', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('secondary')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      expect(el.backgroundVariant).to.equal('default');

      el.backgroundVariant = 'secondary';
      await el.updateComplete;

      expect(el.backgroundVariant).to.equal('secondary');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('secondary')).to.be.true;
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`
        <pfv6-sidebar-content>
          <p>Content goes here</p>
        </pfv6-sidebar-content>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Content goes here');
    });

    it('renders text content', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`
        <pfv6-sidebar-content>Plain text content</pfv6-sidebar-content>
      `);
      expect(el.textContent?.trim()).to.equal('Plain text content');
    });

    it('renders multiple slotted elements', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`
        <pfv6-sidebar-content>
          <h2>Title</h2>
          <p>Paragraph</p>
        </pfv6-sidebar-content>
      `);
      const heading = el.querySelector('h2');
      const paragraph = el.querySelector('p');

      expect(heading).to.exist;
      expect(paragraph).to.exist;
      expect(heading?.textContent).to.equal('Title');
      expect(paragraph?.textContent).to.equal('Paragraph');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('container element contains default slot', async function() {
      const el = await fixture<Pfv6SidebarContent>(html`<pfv6-sidebar-content></pfv6-sidebar-content>`);
      const container = el.shadowRoot!.querySelector('#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can combine hasNoBackground and hasPadding', async function() {
      const el = await fixture<Pfv6SidebarContent>(
        html`<pfv6-sidebar-content has-no-background has-padding></pfv6-sidebar-content>`
      );
      expect(el.hasNoBackground).to.be.true;
      expect(el.hasPadding).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
      expect(container!.classList.contains('padding')).to.be.true;
    });

    it('can combine hasPadding and backgroundVariant', async function() {
      const el = await fixture<Pfv6SidebarContent>(
        html`<pfv6-sidebar-content has-padding background-variant="secondary"></pfv6-sidebar-content>`
      );
      expect(el.hasPadding).to.be.true;
      expect(el.backgroundVariant).to.equal('secondary');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('padding')).to.be.true;
      expect(container!.classList.contains('secondary')).to.be.true;
    });

    it('can combine all properties', async function() {
      const el = await fixture<Pfv6SidebarContent>(
        html`<pfv6-sidebar-content has-no-background has-padding background-variant="secondary"></pfv6-sidebar-content>`
      );
      expect(el.hasNoBackground).to.be.true;
      expect(el.hasPadding).to.be.true;
      expect(el.backgroundVariant).to.equal('secondary');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('no-background')).to.be.true;
      expect(container!.classList.contains('padding')).to.be.true;
      expect(container!.classList.contains('secondary')).to.be.true;
    });
  });
});
