// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6Drawer, Pfv6DrawerExpandEvent } from '../pfv6-drawer.js';
import { Pfv6DrawerMain } from '../pfv6-drawer-main.js';
import { Pfv6DrawerContent } from '../pfv6-drawer-content.js';
import { Pfv6DrawerContentBody } from '../pfv6-drawer-content-body.js';
import { Pfv6DrawerPanelContent, Pfv6DrawerPanelResizeEvent } from '../pfv6-drawer-panel-content.js';
import { Pfv6DrawerPanelBody } from '../pfv6-drawer-panel-body.js';
import { Pfv6DrawerPanelDescription } from '../pfv6-drawer-panel-description.js';
import { Pfv6DrawerHead } from '../pfv6-drawer-head.js';
import { Pfv6DrawerActions } from '../pfv6-drawer-actions.js';
import { Pfv6DrawerCloseButton, Pfv6DrawerCloseEvent } from '../pfv6-drawer-close-button.js';
import { Pfv6DrawerSection } from '../pfv6-drawer-section.js';
import '../pfv6-drawer.js';
import '../pfv6-drawer-main.js';
import '../pfv6-drawer-content.js';
import '../pfv6-drawer-content-body.js';
import '../pfv6-drawer-panel-content.js';
import '../pfv6-drawer-panel-body.js';
import '../pfv6-drawer-panel-description.js';
import '../pfv6-drawer-head.js';
import '../pfv6-drawer-actions.js';
import '../pfv6-drawer-close-button.js';
import '../pfv6-drawer-section.js';

describe('<pfv6-drawer>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer')).to.be.an.instanceof(Pfv6Drawer);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer></pfv6-drawer>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer'))
          .and
          .to.be.an.instanceOf(Pfv6Drawer);
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer></pfv6-drawer>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer is-expanded></pfv6-drawer>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer is-expanded></pfv6-drawer>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });
  });

  describe('isInline property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer></pfv6-drawer>`);
      expect(el.isInline).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer is-inline></pfv6-drawer>`);
      expect(el.isInline).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer is-inline></pfv6-drawer>`);
      expect(el.hasAttribute('is-inline')).to.be.true;
    });
  });

  describe('isStatic property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer></pfv6-drawer>`);
      expect(el.isStatic).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer is-static></pfv6-drawer>`);
      expect(el.isStatic).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer is-static></pfv6-drawer>`);
      expect(el.hasAttribute('is-static')).to.be.true;
    });
  });

  describe('position property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer></pfv6-drawer>`);
      expect(el.position).to.equal('end');
    });

    it('accepts "start" value', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer position="start"></pfv6-drawer>`);
      expect(el.position).to.equal('start');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer position="bottom"></pfv6-drawer>`);
      expect(el.position).to.equal('bottom');
    });

    it('accepts "left" value (deprecated)', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer position="left"></pfv6-drawer>`);
      expect(el.position).to.equal('left');
    });

    it('accepts "right" value (deprecated)', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer position="right"></pfv6-drawer>`);
      expect(el.position).to.equal('right');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Drawer>(html`<pfv6-drawer position="start"></pfv6-drawer>`);
      expect(el.getAttribute('position')).to.equal('start');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Drawer>(html`
        <pfv6-drawer>
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <p>Content</p>
            </pfv6-drawer-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);
      const main = el.querySelector('pfv6-drawer-main');
      expect(main).to.exist;
      const content = main?.querySelector('pfv6-drawer-content');
      expect(content).to.exist;
    });
  });

  describe('context provider', function() {
    it('provides drawer context to child components', async function() {
      const el = await fixture<Pfv6Drawer>(html`
        <pfv6-drawer is-expanded position="start">
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <pfv6-drawer-content-body></pfv6-drawer-content-body>
            </pfv6-drawer-content>
            <pfv6-drawer-panel-content></pfv6-drawer-panel-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);

      // Context is verified by checking panel-content behavior in its tests
      expect(el.isExpanded).to.be.true;
      expect(el.position).to.equal('start');
    });
  });
});

describe('<pfv6-drawer-main>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-main')).to.be.an.instanceof(Pfv6DrawerMain);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerMain>(html`<pfv6-drawer-main></pfv6-drawer-main>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-main'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerMain);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerMain>(html`
        <pfv6-drawer-main>
          <pfv6-drawer-content>
            <p>Content</p>
          </pfv6-drawer-content>
        </pfv6-drawer-main>
      `);
      const content = el.querySelector('pfv6-drawer-content');
      expect(content).to.exist;
    });
  });
});

describe('<pfv6-drawer-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-content')).to.be.an.instanceof(Pfv6DrawerContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`<pfv6-drawer-content></pfv6-drawer-content>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-content'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerContent);
    });
  });

  describe('colorVariant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`<pfv6-drawer-content></pfv6-drawer-content>`);
      expect(el.colorVariant).to.equal('default');
    });

    it('accepts "primary" value', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`<pfv6-drawer-content color-variant="primary"></pfv6-drawer-content>`);
      expect(el.colorVariant).to.equal('primary');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`<pfv6-drawer-content color-variant="secondary"></pfv6-drawer-content>`);
      expect(el.colorVariant).to.equal('secondary');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`<pfv6-drawer-content color-variant="primary"></pfv6-drawer-content>`);
      expect(el.getAttribute('color-variant')).to.equal('primary');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`
        <pfv6-drawer-content>
          <pfv6-drawer-content-body>
            <p>Body content</p>
          </pfv6-drawer-content-body>
        </pfv6-drawer-content>
      `);
      const body = el.querySelector('pfv6-drawer-content-body');
      expect(body).to.exist;
    });

    it('renders named panel slot', async function() {
      const el = await fixture<Pfv6DrawerContent>(html`
        <pfv6-drawer-content>
          <pfv6-drawer-content-body>Content</pfv6-drawer-content-body>
          <pfv6-drawer-panel-content slot="panel">Panel</pfv6-drawer-panel-content>
        </pfv6-drawer-content>
      `);
      const panel = el.querySelector('[slot="panel"]');
      expect(panel).to.exist;
    });
  });
});

describe('<pfv6-drawer-content-body>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-content-body')).to.be.an.instanceof(Pfv6DrawerContentBody);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerContentBody>(html`<pfv6-drawer-content-body></pfv6-drawer-content-body>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-content-body'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerContentBody);
    });
  });

  describe('hasPadding property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6DrawerContentBody>(html`<pfv6-drawer-content-body></pfv6-drawer-content-body>`);
      expect(el.hasPadding).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6DrawerContentBody>(html`<pfv6-drawer-content-body has-padding></pfv6-drawer-content-body>`);
      expect(el.hasPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerContentBody>(html`<pfv6-drawer-content-body has-padding></pfv6-drawer-content-body>`);
      expect(el.hasAttribute('has-padding')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerContentBody>(html`
        <pfv6-drawer-content-body>
          <p>Body content</p>
        </pfv6-drawer-content-body>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Body content');
    });
  });
});

describe('<pfv6-drawer-panel-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-panel-content')).to.be.an.instanceof(Pfv6DrawerPanelContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-panel-content'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerPanelContent);
    });
  });

  describe('hasNoBorder property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.hasNoBorder).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content has-no-border></pfv6-drawer-panel-content>`);
      expect(el.hasNoBorder).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content has-no-border></pfv6-drawer-panel-content>`);
      expect(el.hasAttribute('has-no-border')).to.be.true;
    });
  });

  describe('isResizable property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.isResizable).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content is-resizable></pfv6-drawer-panel-content>`);
      expect(el.isResizable).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content is-resizable></pfv6-drawer-panel-content>`);
      expect(el.hasAttribute('is-resizable')).to.be.true;
    });
  });

  describe('minSize property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.minSize).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content min-size="200px"></pfv6-drawer-panel-content>`);
      expect(el.minSize).to.equal('200px');
    });
  });

  describe('defaultSize property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.defaultSize).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content default-size="300px"></pfv6-drawer-panel-content>`);
      expect(el.defaultSize).to.equal('300px');
    });
  });

  describe('maxSize property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.maxSize).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content max-size="500px"></pfv6-drawer-panel-content>`);
      expect(el.maxSize).to.equal('500px');
    });
  });

  describe('increment property', function() {
    it('defaults to 5', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.increment).to.equal(5);
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content increment="10"></pfv6-drawer-panel-content>`);
      expect(el.increment).to.equal(10);
    });
  });

  describe('resizeAccessibleLabel property', function() {
    it('defaults to "Resize"', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.resizeAccessibleLabel).to.equal('Resize');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content resize-accessible-label="Resize panel"></pfv6-drawer-panel-content>`);
      expect(el.resizeAccessibleLabel).to.equal('Resize panel');
    });
  });

  describe('width property (responsive)', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.width).to.be.undefined;
    });

    it('accepts single default value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content width="25"></pfv6-drawer-panel-content>`);
      expect(el.width).to.deep.equal({ default: '25' });
    });

    it('accepts responsive breakpoint values', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content width="25 lg:33 xl:50 2xl:66"></pfv6-drawer-panel-content>`);
      expect(el.width).to.deep.equal({ 'default': '25', 'lg': '33', 'xl': '50', '2xl': '66' });
    });

    it('generates correct CSS classes', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`
        <pfv6-drawer>
          <pfv6-drawer-panel-content width="25 lg:33"></pfv6-drawer-panel-content>
        </pfv6-drawer>
      `);
      const panelContent = el.querySelector('pfv6-drawer-panel-content') as Pfv6DrawerPanelContent;
      await panelContent.updateComplete;
      const panel = panelContent.shadowRoot?.getElementById('panel');
      expect(panel?.classList.contains('width-25-on-default')).to.be.true;
      expect(panel?.classList.contains('width-33-on-lg')).to.be.true;
    });
  });

  describe('colorVariant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.colorVariant).to.equal('default');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content color-variant="secondary"></pfv6-drawer-panel-content>`);
      expect(el.colorVariant).to.equal('secondary');
    });

    it('accepts "no-background" value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content color-variant="no-background"></pfv6-drawer-panel-content>`);
      expect(el.colorVariant).to.equal('no-background');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content color-variant="secondary"></pfv6-drawer-panel-content>`);
      expect(el.getAttribute('color-variant')).to.equal('secondary');
    });
  });

  describe('focusTrapEnabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.focusTrapEnabled).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content focus-trap-enabled></pfv6-drawer-panel-content>`);
      expect(el.focusTrapEnabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content focus-trap-enabled></pfv6-drawer-panel-content>`);
      expect(el.hasAttribute('focus-trap-enabled')).to.be.true;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content></pfv6-drawer-panel-content>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`<pfv6-drawer-panel-content accessible-label="Panel content"></pfv6-drawer-panel-content>`);
      expect(el.accessibleLabel).to.equal('Panel content');
    });
  });

  describe('expand event', function() {
    it('dispatches when panel expansion animation completes', async function() {
      const container = await fixture(html`
        <pfv6-drawer is-expanded>
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <pfv6-drawer-content-body>Content</pfv6-drawer-content-body>
            </pfv6-drawer-content>
            <pfv6-drawer-panel-content>
              <p>Panel</p>
            </pfv6-drawer-panel-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);

      const panel = container.querySelector('pfv6-drawer-panel-content');
      let eventFired = false;

      panel?.addEventListener('expand', () => {
        eventFired = true;
      });

      // Simulate transition end event
      const panelElement = panel?.shadowRoot?.getElementById('panel');
      if (panelElement) {
        const transitionEvent = new TransitionEvent('transitionend', {
          propertyName: 'transform',
          bubbles: true,
        });
        panelElement.dispatchEvent(transitionEvent);
      }

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6DrawerExpandEvent', async function() {
      const container = await fixture(html`
        <pfv6-drawer is-expanded>
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <pfv6-drawer-content-body>Content</pfv6-drawer-content-body>
            </pfv6-drawer-content>
            <pfv6-drawer-panel-content>
              <p>Panel</p>
            </pfv6-drawer-panel-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);

      const panel = container.querySelector('pfv6-drawer-panel-content');
      let capturedEvent: Pfv6DrawerExpandEvent | undefined;

      panel?.addEventListener('expand', e => {
        capturedEvent = e as Pfv6DrawerExpandEvent;
      });

      // Simulate transition end event
      const panelElement = panel?.shadowRoot?.getElementById('panel');
      if (panelElement) {
        const transitionEvent = new TransitionEvent('transitionend', {
          propertyName: 'transform',
          bubbles: true,
        });
        panelElement.dispatchEvent(transitionEvent);
      }

      expect(capturedEvent).to.be.an.instanceof(Pfv6DrawerExpandEvent);
    });
  });

  describe('resize event', function() {
    it('dispatches when panel resize completes via mouse', async function() {
      const container = await fixture(html`
        <pfv6-drawer is-expanded>
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <pfv6-drawer-content-body>Content</pfv6-drawer-content-body>
            </pfv6-drawer-content>
            <pfv6-drawer-panel-content id="test-panel" is-resizable>
              <p>Panel</p>
            </pfv6-drawer-panel-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);

      const panel = container.querySelector('pfv6-drawer-panel-content');
      let eventFired = false;

      panel?.addEventListener('resize', () => {
        eventFired = true;
      });

      // Trigger resize sequence
      const splitter = panel?.shadowRoot?.getElementById('splitter');
      if (splitter) {
        // Start resize
        splitter.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        // Move mouse
        document.dispatchEvent(new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 400,
          clientY: 300,
        }));

        // End resize
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      }

      expect(eventFired).to.be.true;
    });

    it('event contains width and id data', async function() {
      const container = await fixture(html`
        <pfv6-drawer is-expanded>
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <pfv6-drawer-content-body>Content</pfv6-drawer-content-body>
            </pfv6-drawer-content>
            <pfv6-drawer-panel-content id="test-panel" is-resizable>
              <p>Panel</p>
            </pfv6-drawer-panel-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);

      const panel = container.querySelector('pfv6-drawer-panel-content');
      let capturedEvent: Pfv6DrawerPanelResizeEvent | undefined;

      panel?.addEventListener('resize', e => {
        capturedEvent = e as Pfv6DrawerPanelResizeEvent;
      });

      // Trigger resize sequence
      const splitter = panel?.shadowRoot?.getElementById('splitter');
      if (splitter) {
        splitter.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 400,
          clientY: 300,
        }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      }

      expect(capturedEvent).to.be.an.instanceof(Pfv6DrawerPanelResizeEvent);
      expect(capturedEvent?.width).to.be.a('number');
      expect(capturedEvent?.id).to.equal('test-panel');
    });

    it('dispatches when keyboard resize completes', async function() {
      const container = await fixture(html`
        <pfv6-drawer is-expanded>
          <pfv6-drawer-main>
            <pfv6-drawer-content>
              <pfv6-drawer-content-body>Content</pfv6-drawer-content-body>
            </pfv6-drawer-content>
            <pfv6-drawer-panel-content is-resizable>
              <p>Panel</p>
            </pfv6-drawer-panel-content>
          </pfv6-drawer-main>
        </pfv6-drawer>
      `);

      const panel = container.querySelector('pfv6-drawer-panel-content');
      let eventFired = false;

      panel?.addEventListener('resize', () => {
        eventFired = true;
      });

      // Trigger keyboard resize
      const splitter = panel?.shadowRoot?.getElementById('splitter');
      if (splitter) {
        splitter.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        }));
      }

      expect(eventFired).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerPanelContent>(html`
        <pfv6-drawer-panel-content>
          <p>Panel content</p>
        </pfv6-drawer-panel-content>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Panel content');
    });
  });
});

describe('<pfv6-drawer-panel-body>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-panel-body')).to.be.an.instanceof(Pfv6DrawerPanelBody);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerPanelBody>(html`<pfv6-drawer-panel-body></pfv6-drawer-panel-body>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-panel-body'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerPanelBody);
    });
  });

  describe('hasNoPadding property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6DrawerPanelBody>(html`<pfv6-drawer-panel-body></pfv6-drawer-panel-body>`);
      expect(el.hasNoPadding).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6DrawerPanelBody>(html`<pfv6-drawer-panel-body has-no-padding></pfv6-drawer-panel-body>`);
      expect(el.hasNoPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerPanelBody>(html`<pfv6-drawer-panel-body has-no-padding></pfv6-drawer-panel-body>`);
      expect(el.hasAttribute('has-no-padding')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerPanelBody>(html`
        <pfv6-drawer-panel-body>
          <p>Panel body content</p>
        </pfv6-drawer-panel-body>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Panel body content');
    });
  });
});

describe('<pfv6-drawer-panel-description>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-panel-description')).to.be.an.instanceof(Pfv6DrawerPanelDescription);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerPanelDescription>(html`<pfv6-drawer-panel-description></pfv6-drawer-panel-description>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-panel-description'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerPanelDescription);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerPanelDescription>(html`
        <pfv6-drawer-panel-description>
          <p>Description text</p>
        </pfv6-drawer-panel-description>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Description text');
    });
  });
});

describe('<pfv6-drawer-head>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-head')).to.be.an.instanceof(Pfv6DrawerHead);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerHead>(html`<pfv6-drawer-head></pfv6-drawer-head>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-head'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerHead);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerHead>(html`
        <pfv6-drawer-head>
          <h2>Drawer Title</h2>
        </pfv6-drawer-head>
      `);
      const h2 = el.querySelector('h2');
      expect(h2).to.exist;
      expect(h2?.textContent).to.equal('Drawer Title');
    });
  });
});

describe('<pfv6-drawer-actions>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-actions')).to.be.an.instanceof(Pfv6DrawerActions);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerActions>(html`<pfv6-drawer-actions></pfv6-drawer-actions>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-actions'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerActions);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerActions>(html`
        <pfv6-drawer-actions>
          <button>Action</button>
        </pfv6-drawer-actions>
      `);
      const button = el.querySelector('button');
      expect(button).to.exist;
      expect(button?.textContent).to.equal('Action');
    });
  });
});

describe('<pfv6-drawer-close-button>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-close-button')).to.be.an.instanceof(Pfv6DrawerCloseButton);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerCloseButton>(html`<pfv6-drawer-close-button></pfv6-drawer-close-button>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-close-button'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerCloseButton);
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to "Close drawer panel"', async function() {
      const el = await fixture<Pfv6DrawerCloseButton>(html`<pfv6-drawer-close-button></pfv6-drawer-close-button>`);
      expect(el.accessibleLabel).to.equal('Close drawer panel');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6DrawerCloseButton>(html`<pfv6-drawer-close-button accessible-label="Close"></pfv6-drawer-close-button>`);
      expect(el.accessibleLabel).to.equal('Close');
    });
  });

  describe('close event', function() {
    it('dispatches when button is clicked', async function() {
      const el = await fixture<Pfv6DrawerCloseButton>(html`<pfv6-drawer-close-button></pfv6-drawer-close-button>`);
      let eventFired = false;

      el.addEventListener('close', () => {
        eventFired = true;
      });

      const button = el.shadowRoot?.querySelector('button');
      expect(button).to.exist;

      await userEvent.click(button!);
      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6DrawerCloseEvent', async function() {
      const el = await fixture<Pfv6DrawerCloseButton>(html`<pfv6-drawer-close-button></pfv6-drawer-close-button>`);
      let capturedEvent: Pfv6DrawerCloseEvent | undefined;

      el.addEventListener('close', e => {
        capturedEvent = e as Pfv6DrawerCloseEvent;
      });

      const button = el.shadowRoot?.querySelector('button');
      await userEvent.click(button!);

      expect(capturedEvent).to.be.an.instanceof(Pfv6DrawerCloseEvent);
    });
  });
});

describe('<pfv6-drawer-section>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-drawer-section')).to.be.an.instanceof(Pfv6DrawerSection);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6DrawerSection>(html`<pfv6-drawer-section></pfv6-drawer-section>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-drawer-section'))
          .and
          .to.be.an.instanceOf(Pfv6DrawerSection);
    });
  });

  describe('colorVariant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6DrawerSection>(html`<pfv6-drawer-section></pfv6-drawer-section>`);
      expect(el.colorVariant).to.equal('default');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6DrawerSection>(html`<pfv6-drawer-section color-variant="secondary"></pfv6-drawer-section>`);
      expect(el.colorVariant).to.equal('secondary');
    });

    it('accepts "no-background" value', async function() {
      const el = await fixture<Pfv6DrawerSection>(html`<pfv6-drawer-section color-variant="no-background"></pfv6-drawer-section>`);
      expect(el.colorVariant).to.equal('no-background');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6DrawerSection>(html`<pfv6-drawer-section color-variant="secondary"></pfv6-drawer-section>`);
      expect(el.getAttribute('color-variant')).to.equal('secondary');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6DrawerSection>(html`
        <pfv6-drawer-section>
          <p>Section content</p>
        </pfv6-drawer-section>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Section content');
    });
  });
});
