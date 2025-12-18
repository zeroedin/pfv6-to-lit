// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { Pfv6Backdrop } from '../pfv6-backdrop.js';
import '../pfv6-backdrop.js';

describe('<pfv6-backdrop>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-backdrop')).to.be.an.instanceof(Pfv6Backdrop);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Backdrop>(html`<pfv6-backdrop></pfv6-backdrop>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-backdrop'))
          .and
          .to.be.an.instanceOf(Pfv6Backdrop);
    });
  });

  describe('slots', function() {
    it('renders default slot', async function() {
      const el = await fixture<Pfv6Backdrop>(html`
        <pfv6-backdrop>
          <div class="test-content">Test content</div>
        </pfv6-backdrop>
      `);

      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.exist;

      const slotted = slot!.assignedElements();
      expect(slotted).to.have.lengthOf(1);
      expect(slotted[0]).to.have.class('test-content');
    });

    it('renders without content', async function() {
      const el = await fixture<Pfv6Backdrop>(html`<pfv6-backdrop></pfv6-backdrop>`);

      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.exist;

      const slotted = slot!.assignedElements();
      expect(slotted).to.have.lengthOf(0);
    });
  });

  describe('shadow DOM structure', function() {
    it('renders backdrop container with id', async function() {
      const el = await fixture<Pfv6Backdrop>(html`<pfv6-backdrop></pfv6-backdrop>`);

      const backdrop = el.shadowRoot!.querySelector('#backdrop');
      expect(backdrop).to.exist;
    });

    it('contains slot inside backdrop container', async function() {
      const el = await fixture<Pfv6Backdrop>(html`<pfv6-backdrop></pfv6-backdrop>`);

      const backdrop = el.shadowRoot!.querySelector('#backdrop');
      const slot = backdrop!.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('CSS API', function() {
    it('applies default styles to backdrop element', async function() {
      const el = await fixture<Pfv6Backdrop>(html`<pfv6-backdrop></pfv6-backdrop>`);

      const backdrop = el.shadowRoot!.querySelector('#backdrop') as HTMLElement;
      const styles = getComputedStyle(backdrop);

      expect(styles.position).to.equal('fixed');
      expect(styles.width).to.equal('100%');
      expect(styles.height).to.equal('100%');
    });

    it('supports CSS custom property overrides', async function() {
      const el = await fixture<Pfv6Backdrop>(html`
        <pfv6-backdrop style="--pf-v6-c-backdrop--BackgroundColor: rgba(255, 0, 0, 0.5);"></pfv6-backdrop>
      `);

      const backdrop = el.shadowRoot!.querySelector('#backdrop') as HTMLElement;
      const styles = getComputedStyle(backdrop);

      expect(styles.backgroundColor).to.equal('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('React parity', function() {
    it('has no properties (matches React Backdrop)', async function() {
      const el = await fixture<Pfv6Backdrop>(html`<pfv6-backdrop></pfv6-backdrop>`);

      // Backdrop has no public properties beyond inherited HTML attributes
      // This test documents that the component intentionally has no custom properties
      expect(el).to.be.an.instanceof(Pfv6Backdrop);
    });

    it('accepts children via default slot (matches React children prop)', async function() {
      const el = await fixture<Pfv6Backdrop>(html`
        <pfv6-backdrop>
          <p>Child content</p>
        </pfv6-backdrop>
      `);

      const slot = el.shadowRoot!.querySelector('slot');
      const slotted = slot!.assignedElements();
      expect(slotted).to.have.lengthOf(1);
      expect(slotted[0].tagName).to.equal('P');
    });
  });
});
