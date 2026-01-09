import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Banner } from '../pfv6-banner.js';
import '../pfv6-banner.js';

describe('<pfv6-banner>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-banner')).to.be.an.instanceof(Pfv6Banner);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner></pfv6-banner>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-banner'))
          .and
          .to.be.an.instanceOf(Pfv6Banner);
    });
  });

  describe('isSticky property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner></pfv6-banner>`);
      expect(el.isSticky).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner is-sticky></pfv6-banner>`);
      expect(el.isSticky).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner is-sticky></pfv6-banner>`);
      expect(el.hasAttribute('is-sticky')).to.be.true;
    });

    it('applies sticky class when true', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner is-sticky>Sticky banner</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
    });

    it('does not apply sticky class when false', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Default banner</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Banner</pfv6-banner>`);
      expect(el.isSticky).to.be.false;

      el.isSticky = true;
      await el.updateComplete;

      expect(el.isSticky).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
    });
  });

  describe('screenReaderText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner></pfv6-banner>`);
      expect(el.screenReaderText).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner screen-reader-text="Success banner">Success</pfv6-banner>`
      );
      expect(el.screenReaderText).to.equal('Success banner');
    });

    it('renders screen reader text when provided', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner screen-reader-text="Warning banner">Warning</pfv6-banner>`
      );
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Warning banner');
    });

    it('does not render screen reader text when not provided', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Default</pfv6-banner>`);
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Banner</pfv6-banner>`);
      expect(el.shadowRoot!.querySelector('.screen-reader')).to.not.exist;

      el.screenReaderText = 'Info banner';
      await el.updateComplete;

      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Info banner');
    });
  });

  describe('color property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner></pfv6-banner>`);
      expect(el.color).to.be.undefined;
    });

    it('accepts "red" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="red">Red banner</pfv6-banner>`);
      expect(el.color).to.equal('red');
    });

    it('accepts "orangered" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="orangered">Orangered banner</pfv6-banner>`);
      expect(el.color).to.equal('orangered');
    });

    it('accepts "orange" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="orange">Orange banner</pfv6-banner>`);
      expect(el.color).to.equal('orange');
    });

    it('accepts "yellow" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="yellow">Yellow banner</pfv6-banner>`);
      expect(el.color).to.equal('yellow');
    });

    it('accepts "green" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="green">Green banner</pfv6-banner>`);
      expect(el.color).to.equal('green');
    });

    it('accepts "teal" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="teal">Teal banner</pfv6-banner>`);
      expect(el.color).to.equal('teal');
    });

    it('accepts "blue" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="blue">Blue banner</pfv6-banner>`);
      expect(el.color).to.equal('blue');
    });

    it('accepts "purple" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="purple">Purple banner</pfv6-banner>`);
      expect(el.color).to.equal('purple');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="red">Red</pfv6-banner>`);
      expect(el.getAttribute('color')).to.equal('red');
    });

    it('applies red class when color is "red"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="red">Red</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('red')).to.be.true;
    });

    it('applies orangered class when color is "orangered"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="orangered">Orangered</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('orangered')).to.be.true;
    });

    it('applies orange class when color is "orange"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="orange">Orange</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('orange')).to.be.true;
    });

    it('applies yellow class when color is "yellow"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="yellow">Yellow</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('yellow')).to.be.true;
    });

    it('applies green class when color is "green"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="green">Green</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('green')).to.be.true;
    });

    it('applies teal class when color is "teal"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="teal">Teal</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('teal')).to.be.true;
    });

    it('applies blue class when color is "blue"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="blue">Blue</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('blue')).to.be.true;
    });

    it('applies purple class when color is "purple"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="purple">Purple</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('purple')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner color="red">Banner</pfv6-banner>`);
      expect(el.color).to.equal('red');

      el.color = 'blue';
      await el.updateComplete;

      expect(el.color).to.equal('blue');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('blue')).to.be.true;
      expect(container!.classList.contains('red')).to.be.false;
    });
  });

  describe('status property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner></pfv6-banner>`);
      expect(el.status).to.be.undefined;
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="success">Success</pfv6-banner>`);
      expect(el.status).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="warning">Warning</pfv6-banner>`);
      expect(el.status).to.equal('warning');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="danger">Danger</pfv6-banner>`);
      expect(el.status).to.equal('danger');
    });

    it('accepts "info" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="info">Info</pfv6-banner>`);
      expect(el.status).to.equal('info');
    });

    it('accepts "custom" value', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="custom">Custom</pfv6-banner>`);
      expect(el.status).to.equal('custom');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="success">Success</pfv6-banner>`);
      expect(el.getAttribute('status')).to.equal('success');
    });

    it('applies success class when status is "success"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="success">Success</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
    });

    it('applies warning class when status is "warning"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="warning">Warning</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
    });

    it('applies danger class when status is "danger"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="danger">Danger</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('danger')).to.be.true;
    });

    it('applies info class when status is "info"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="info">Info</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('info')).to.be.true;
    });

    it('applies custom class when status is "custom"', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="custom">Custom</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('custom')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner status="success">Banner</pfv6-banner>`);
      expect(el.status).to.equal('success');

      el.status = 'danger';
      await el.updateComplete;

      expect(el.status).to.equal('danger');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('danger')).to.be.true;
      expect(container!.classList.contains('success')).to.be.false;
    });
  });

  describe('status precedence over color', function() {
    it('status overrides color when both are set', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner color="red" status="success">Banner</pfv6-banner>`
      );
      const container = el.shadowRoot!.querySelector('#container');

      // Status class should be applied
      expect(container!.classList.contains('success')).to.be.true;

      // Color class should NOT be applied (status takes precedence)
      expect(container!.classList.contains('red')).to.be.false;
    });

    it('color applies when status is undefined', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner color="blue">Banner</pfv6-banner>`
      );
      const container = el.shadowRoot!.querySelector('#container');

      expect(container!.classList.contains('blue')).to.be.true;
    });

    it('removing status allows color to apply', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner color="purple" status="warning">Banner</pfv6-banner>`
      );
      const container = el.shadowRoot!.querySelector('#container');

      // Initially status applies
      expect(container!.classList.contains('warning')).to.be.true;
      expect(container!.classList.contains('purple')).to.be.false;

      // Remove status
      el.status = undefined;
      await el.updateComplete;

      // Now color should apply
      expect(container!.classList.contains('warning')).to.be.false;
      expect(container!.classList.contains('purple')).to.be.true;
    });

    it('changing from status to color works correctly', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner status="danger">Banner</pfv6-banner>`
      );

      el.status = undefined;
      el.color = 'teal';
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('danger')).to.be.false;
      expect(container!.classList.contains('teal')).to.be.true;
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Default banner</pfv6-banner>`);
      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('displays banner content in slot', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner>This is a banner message</pfv6-banner>`
      );
      expect(el.textContent?.trim()).to.equal('This is a banner message');
    });

    it('renders simple text content', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Success banner</pfv6-banner>`);
      expect(el.textContent?.trim()).to.equal('Success banner');
    });

    it('renders complex HTML content', async function() {
      const el = await fixture<Pfv6Banner>(html`
        <pfv6-banner>
          <strong>Important:</strong> Please read this message
        </pfv6-banner>
      `);
      const strong = el.querySelector('strong');
      expect(strong).to.exist;
      expect(strong!.textContent).to.equal('Important:');
    });

    it('renders content with icons and text', async function() {
      const el = await fixture<Pfv6Banner>(html`
        <pfv6-banner status="success">
          <div class="pf-v6-l-flex">
            <div>Icon</div>
            <div>Success message</div>
          </div>
        </pfv6-banner>
      `);
      const flex = el.querySelector('.pf-v6-l-flex');
      expect(flex).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can be sticky with status', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner is-sticky status="warning">Sticky warning</pfv6-banner>`
      );
      expect(el.isSticky).to.be.true;
      expect(el.status).to.equal('warning');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
      expect(container!.classList.contains('warning')).to.be.true;
    });

    it('can be sticky with color', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner is-sticky color="blue">Sticky blue</pfv6-banner>`
      );
      expect(el.isSticky).to.be.true;
      expect(el.color).to.equal('blue');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
      expect(container!.classList.contains('blue')).to.be.true;
    });

    it('screen reader text works with status', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner status="danger" screen-reader-text="Danger banner">Danger</pfv6-banner>`
      );
      expect(el.status).to.equal('danger');
      expect(el.screenReaderText).to.equal('Danger banner');

      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Danger banner');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('danger')).to.be.true;
    });

    it('screen reader text works with color', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner color="green" screen-reader-text="Green banner">Green</pfv6-banner>`
      );
      expect(el.color).to.equal('green');
      expect(el.screenReaderText).to.equal('Green banner');

      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Green banner');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('green')).to.be.true;
    });

    it('all properties can be combined', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner is-sticky status="info" screen-reader-text="Info banner">Info</pfv6-banner>`
      );
      expect(el.isSticky).to.be.true;
      expect(el.status).to.equal('info');
      expect(el.screenReaderText).to.equal('Info banner');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sticky')).to.be.true;
      expect(container!.classList.contains('info')).to.be.true;

      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders main container element', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Banner</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('container element contains default slot', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Banner</pfv6-banner>`);
      const container = el.shadowRoot!.querySelector('#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('screen reader text is rendered before slot when provided', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner screen-reader-text="Test">Banner</pfv6-banner>`
      );
      const container = el.shadowRoot!.querySelector('#container');
      const children = Array.from(container!.childNodes).filter(
        node => node.nodeType === Node.ELEMENT_NODE
      );

      // First child should be screen reader text span
      expect((children[0] as HTMLElement).classList.contains('screen-reader')).to.be.true;

      // Second child should be slot
      expect((children[1] as HTMLElement).tagName).to.equal('SLOT');
    });
  });

  describe('accessibility', function() {
    it('screen reader text is visually hidden', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner screen-reader-text="Warning">Warning</pfv6-banner>`
      );
      const srText = el.shadowRoot!.querySelector('.screen-reader') as HTMLElement;

      expect(srText).to.exist;

      // Check visual hiding styles
      const styles = window.getComputedStyle(srText);
      expect(styles.position).to.equal('absolute');
      expect(styles.width).to.equal('1px');
      expect(styles.height).to.equal('1px');
    });

    it('screen reader text provides context for status banners', async function() {
      const el = await fixture<Pfv6Banner>(
        html`<pfv6-banner status="success" screen-reader-text="Success status">
          Operation completed
        </pfv6-banner>`
      );

      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Success status');
    });

    it('banner without screen reader text is still accessible', async function() {
      const el = await fixture<Pfv6Banner>(html`<pfv6-banner>Plain banner</pfv6-banner>`);

      // No screen reader text should be present
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.not.exist;

      // Content should still be accessible via slot
      expect(el.textContent?.trim()).to.equal('Plain banner');
    });
  });
});
