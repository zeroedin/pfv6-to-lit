import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6BackgroundImage } from '../pfv6-background-image.js';
import '../pfv6-background-image.js';

describe('<pfv6-background-image>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-background-image')).to.be.an.instanceof(Pfv6BackgroundImage);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6BackgroundImage>(html`<pfv6-background-image></pfv6-background-image>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-background-image'))
          .and
          .to.be.an.instanceOf(Pfv6BackgroundImage);
    });
  });

  describe('src property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6BackgroundImage>(html`<pfv6-background-image></pfv6-background-image>`);
      expect(el.src).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/pf-background.svg"></pfv6-background-image>`
      );
      expect(el.src).to.equal('/assets/images/pf-background.svg');
    });

    it('applies src to CSS custom property', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/pf-background.svg"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container).to.exist;
      expect(container.style.getPropertyValue('--pf-v6-c-background-image--BackgroundImage')).to.include(
        '/assets/images/pf-background.svg'
      );
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/old.svg"></pfv6-background-image>`
      );
      expect(el.src).to.equal('/assets/images/old.svg');

      el.src = '/assets/images/new.svg';
      await el.updateComplete;

      expect(el.src).to.equal('/assets/images/new.svg');
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-background-image--BackgroundImage')).to.include(
        '/assets/images/new.svg'
      );
    });

    it('updates when attribute changes', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/old.svg"></pfv6-background-image>`
      );

      el.setAttribute('src', '/assets/images/new.svg');
      await el.updateComplete;

      expect(el.src).to.equal('/assets/images/new.svg');
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-background-image--BackgroundImage')).to.include(
        '/assets/images/new.svg'
      );
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/pf-background.svg"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('container has part attribute', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/pf-background.svg"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.getAttribute('part')).to.equal('container');
    });
  });

  describe('CSS custom properties', function() {
    it('sets --pf-v6-c-background-image--BackgroundImage inline', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/test.png"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-background-image--BackgroundImage')).to.equal('url(/test.png)');
    });

    it('handles URLs with special characters', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/assets/images/background-2024.svg"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-background-image--BackgroundImage')).to.equal(
        'url(/assets/images/background-2024.svg)'
      );
    });

    it('handles absolute URLs', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="https://example.com/image.png"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-background-image--BackgroundImage')).to.equal(
        'url(https://example.com/image.png)'
      );
    });
  });

  describe('container styling', function() {
    it('applies fixed positioning styles', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/test.png"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      const styles = window.getComputedStyle(container);

      expect(styles.position).to.equal('fixed');
      expect(styles.insetBlockStart).to.equal('0px');
      expect(styles.insetInlineStart).to.equal('0px');
      expect(styles.width).to.equal('100%');
      expect(styles.height).to.equal('100%');
    });

    it('applies z-index for layering', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/test.png"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      const styles = window.getComputedStyle(container);

      expect(styles.zIndex).to.equal('-1');
    });

    it('applies background-repeat no-repeat', async function() {
      const el = await fixture<Pfv6BackgroundImage>(
        html`<pfv6-background-image src="/test.png"></pfv6-background-image>`
      );
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      const styles = window.getComputedStyle(container);

      expect(styles.backgroundRepeat).to.equal('no-repeat');
    });
  });
});
