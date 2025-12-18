// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { Pfv6Panel } from '../pfv6-panel.js';
import { Pfv6PanelHeader } from '../pfv6-panel-header.js';
import { Pfv6PanelMain } from '../pfv6-panel-main.js';
import { Pfv6PanelMainBody } from '../pfv6-panel-main-body.js';
import { Pfv6PanelFooter } from '../pfv6-panel-footer.js';
import '../pfv6-panel.js';

describe('<pfv6-panel>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-panel')).to.be.an.instanceof(Pfv6Panel);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel></pfv6-panel>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-panel'))
          .and
          .to.be.an.instanceOf(Pfv6Panel);
    });
  });

  describe('variant property', function() {
    it('defaults to undefined (no variant)', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel></pfv6-panel>`);
      expect(el.variant).to.be.undefined;
    });

    it('accepts "raised" value', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel variant="raised"></pfv6-panel>`);
      expect(el.variant).to.equal('raised');
    });

    it('accepts "bordered" value', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel variant="bordered"></pfv6-panel>`);
      expect(el.variant).to.equal('bordered');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel variant="secondary"></pfv6-panel>`);
      expect(el.variant).to.equal('secondary');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel variant="raised"></pfv6-panel>`);
      expect(el.getAttribute('variant')).to.equal('raised');
    });
  });

  describe('is-scrollable property', function() {
    it('defaults to "false"', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel></pfv6-panel>`);
      expect(el.isScrollable).to.equal('false');
    });

    it('accepts "true" value', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel is-scrollable="true"></pfv6-panel>`);
      expect(el.isScrollable).to.equal('true');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel is-scrollable="true"></pfv6-panel>`);
      expect(el.getAttribute('is-scrollable')).to.equal('true');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Panel>(html`
        <pfv6-panel>
          <p>Panel content</p>
        </pfv6-panel>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Panel content');
    });

    it('renders panel sub-components', async function() {
      const el = await fixture<Pfv6Panel>(html`
        <pfv6-panel>
          <pfv6-panel-header>Header</pfv6-panel-header>
          <pfv6-panel-main>
            <pfv6-panel-main-body>Main</pfv6-panel-main-body>
          </pfv6-panel-main>
          <pfv6-panel-footer>Footer</pfv6-panel-footer>
        </pfv6-panel>
      `);
      const header = el.querySelector('pfv6-panel-header');
      const main = el.querySelector('pfv6-panel-main');
      const body = el.querySelector('pfv6-panel-main-body');
      const footer = el.querySelector('pfv6-panel-footer');

      expect(header).to.exist;
      expect(main).to.exist;
      expect(body).to.exist;
      expect(footer).to.exist;
    });
  });

  describe('shadow DOM', function() {
    it('has a shadow root', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel></pfv6-panel>`);
      expect(el.shadowRoot).to.exist;
    });

    it('has container element', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel></pfv6-panel>`);
      const container = el.shadowRoot?.getElementById('container');
      expect(container).to.exist;
    });

    it('container has default slot', async function() {
      const el = await fixture<Pfv6Panel>(html`<pfv6-panel></pfv6-panel>`);
      const slot = el.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('<pfv6-panel-header>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-panel-header')).to.be.an.instanceof(Pfv6PanelHeader);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6PanelHeader>(html`<pfv6-panel-header></pfv6-panel-header>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-panel-header'))
          .and
          .to.be.an.instanceOf(Pfv6PanelHeader);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6PanelHeader>(html`
        <pfv6-panel-header>
          <p>Header content</p>
        </pfv6-panel-header>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Header content');
    });
  });

  describe('shadow DOM', function() {
    it('has a shadow root', async function() {
      const el = await fixture<Pfv6PanelHeader>(html`<pfv6-panel-header></pfv6-panel-header>`);
      expect(el.shadowRoot).to.exist;
    });

    it('has container element', async function() {
      const el = await fixture<Pfv6PanelHeader>(html`<pfv6-panel-header></pfv6-panel-header>`);
      const container = el.shadowRoot?.getElementById('container');
      expect(container).to.exist;
    });
  });
});

describe('<pfv6-panel-main>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-panel-main')).to.be.an.instanceof(Pfv6PanelMain);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main></pfv6-panel-main>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-panel-main'))
          .and
          .to.be.an.instanceOf(Pfv6PanelMain);
    });
  });

  describe('max-height property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main></pfv6-panel-main>`);
      expect(el.maxHeight).to.be.undefined;
    });

    it('accepts max-height value', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main max-height="200px"></pfv6-panel-main>`);
      expect(el.maxHeight).to.equal('200px');
    });

    it('updates CSS variable when set', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main max-height="200px"></pfv6-panel-main>`);
      const container = el.shadowRoot?.getElementById('container');
      const maxHeightValue = container?.style.getPropertyValue('--pf-v6-c-panel__main--MaxHeight');
      expect(maxHeightValue).to.equal('200px');
    });

    it('removes CSS variable when undefined', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main max-height="200px"></pfv6-panel-main>`);
      el.maxHeight = undefined;
      await el.updateComplete;
      const container = el.shadowRoot?.getElementById('container');
      const maxHeightValue = container?.style.getPropertyValue('--pf-v6-c-panel__main--MaxHeight');
      expect(maxHeightValue).to.equal('');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6PanelMain>(html`
        <pfv6-panel-main>
          <p>Main content</p>
        </pfv6-panel-main>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Main content');
    });
  });

  describe('shadow DOM', function() {
    it('has a shadow root', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main></pfv6-panel-main>`);
      expect(el.shadowRoot).to.exist;
    });

    it('has container element', async function() {
      const el = await fixture<Pfv6PanelMain>(html`<pfv6-panel-main></pfv6-panel-main>`);
      const container = el.shadowRoot?.getElementById('container');
      expect(container).to.exist;
    });
  });
});

describe('<pfv6-panel-main-body>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-panel-main-body')).to.be.an.instanceof(Pfv6PanelMainBody);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6PanelMainBody>(html`<pfv6-panel-main-body></pfv6-panel-main-body>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-panel-main-body'))
          .and
          .to.be.an.instanceOf(Pfv6PanelMainBody);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6PanelMainBody>(html`
        <pfv6-panel-main-body>
          <p>Body content</p>
        </pfv6-panel-main-body>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Body content');
    });
  });

  describe('shadow DOM', function() {
    it('has a shadow root', async function() {
      const el = await fixture<Pfv6PanelMainBody>(html`<pfv6-panel-main-body></pfv6-panel-main-body>`);
      expect(el.shadowRoot).to.exist;
    });

    it('has container element', async function() {
      const el = await fixture<Pfv6PanelMainBody>(html`<pfv6-panel-main-body></pfv6-panel-main-body>`);
      const container = el.shadowRoot?.getElementById('container');
      expect(container).to.exist;
    });
  });
});

describe('<pfv6-panel-footer>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-panel-footer')).to.be.an.instanceof(Pfv6PanelFooter);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6PanelFooter>(html`<pfv6-panel-footer></pfv6-panel-footer>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-panel-footer'))
          .and
          .to.be.an.instanceOf(Pfv6PanelFooter);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6PanelFooter>(html`
        <pfv6-panel-footer>
          <p>Footer content</p>
        </pfv6-panel-footer>
      `);
      const slotted = el.querySelector('p');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Footer content');
    });
  });

  describe('shadow DOM', function() {
    it('has a shadow root', async function() {
      const el = await fixture<Pfv6PanelFooter>(html`<pfv6-panel-footer></pfv6-panel-footer>`);
      expect(el.shadowRoot).to.exist;
    });

    it('has container element', async function() {
      const el = await fixture<Pfv6PanelFooter>(html`<pfv6-panel-footer></pfv6-panel-footer>`);
      const container = el.shadowRoot?.getElementById('container');
      expect(container).to.exist;
    });
  });
});


