import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Skeleton } from '../pfv6-skeleton.js';
import '../pfv6-skeleton.js';

describe('<pfv6-skeleton>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-skeleton')).to.be.an.instanceof(Pfv6Skeleton);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-skeleton'))
        .and
        .to.be.an.instanceOf(Pfv6Skeleton);
    });
  });

  describe('width property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.width).to.be.undefined;
    });

    it('accepts percentage values', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton width="50%"></pfv6-skeleton>`);
      expect(el.width).to.equal('50%');
    });

    it('accepts pixel values', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton width="200px"></pfv6-skeleton>`);
      expect(el.width).to.equal('200px');
    });

    it('sets CSS variable when specified', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton width="75%"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-c-skeleton--Width')).to.equal('75%');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.width).to.be.undefined;

      el.width = '33%';
      await el.updateComplete;

      expect(el.width).to.equal('33%');
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-c-skeleton--Width')).to.equal('33%');
    });
  });

  describe('height property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.height).to.be.undefined;
    });

    it('accepts percentage values', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton height="100%"></pfv6-skeleton>`);
      expect(el.height).to.equal('100%');
    });

    it('accepts pixel values', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton height="150px"></pfv6-skeleton>`);
      expect(el.height).to.equal('150px');
    });

    it('sets CSS variable when specified', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton height="66%"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-c-skeleton--Height')).to.equal('66%');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.height).to.be.undefined;

      el.height = '50%';
      await el.updateComplete;

      expect(el.height).to.equal('50%');
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-c-skeleton--Height')).to.equal('50%');
    });
  });

  describe('fontSize property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.fontSize).to.be.undefined;
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="sm"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('sm');
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="md"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('md');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="lg"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('lg');
    });

    it('accepts "xl" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="xl"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('xl');
    });

    it('accepts "2xl" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="2xl"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('2xl');
    });

    it('accepts "3xl" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="3xl"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('3xl');
    });

    it('accepts "4xl" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="4xl"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('4xl');
    });

    it('applies text class for sm', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="sm"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('text-sm')).to.be.true;
    });

    it('applies text class for 4xl', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="4xl"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('text-4xl')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton font-size="sm"></pfv6-skeleton>`);
      expect(el.fontSize).to.equal('sm');

      el.fontSize = 'xl';
      await el.updateComplete;

      expect(el.fontSize).to.equal('xl');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('text-xl')).to.be.true;
      expect(container!.classList.contains('text-sm')).to.be.false;
    });
  });

  describe('shape property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.shape).to.be.undefined;
    });

    it('accepts "circle" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton shape="circle"></pfv6-skeleton>`);
      expect(el.shape).to.equal('circle');
    });

    it('accepts "square" value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton shape="square"></pfv6-skeleton>`);
      expect(el.shape).to.equal('square');
    });

    it('applies circle class when shape is circle', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton shape="circle"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('circle')).to.be.true;
    });

    it('applies square class when shape is square', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton shape="square"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('square')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton shape="circle"></pfv6-skeleton>`);
      expect(el.shape).to.equal('circle');

      el.shape = 'square';
      await el.updateComplete;

      expect(el.shape).to.equal('square');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('square')).to.be.true;
      expect(container!.classList.contains('circle')).to.be.false;
    });
  });

  describe('screenreaderText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      expect(el.screenreaderText).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton screenreader-text="Loading content"></pfv6-skeleton>`);
      expect(el.screenreaderText).to.equal('Loading content');
    });

    it('renders screen reader text in hidden span', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton screenreader-text="Loading data"></pfv6-skeleton>`);
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Loading data');
    });

    it('does not render span when screenreaderText is undefined', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.textContent!.trim()).to.equal('');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton screenreader-text="Initial text"></pfv6-skeleton>`);
      expect(el.screenreaderText).to.equal('Initial text');

      el.screenreaderText = 'Updated text';
      await el.updateComplete;

      expect(el.screenreaderText).to.equal('Updated text');
      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText!.textContent).to.equal('Updated text');
    });
  });

  describe('combined properties', function() {
    it('applies multiple modifiers simultaneously', async function() {
      const el = await fixture<Pfv6Skeleton>(html`
        <pfv6-skeleton
          width="50%"
          height="75%"
          shape="circle"
          font-size="lg"
          screenreader-text="Loading">
        </pfv6-skeleton>
      `);

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;

      expect(container.classList.contains('circle')).to.be.true;
      expect(container.classList.contains('text-lg')).to.be.true;
      expect(container.style.getPropertyValue('--pf-c-skeleton--Width')).to.equal('50%');
      expect(container.style.getPropertyValue('--pf-c-skeleton--Height')).to.equal('75%');

      const srText = el.shadowRoot!.querySelector('.screen-reader');
      expect(srText!.textContent).to.equal('Loading');
    });
  });

  describe('shadow DOM structure', function() {
    it('has container with id="container"', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName.toLowerCase()).to.equal('div');
    });

    it('has screen reader span inside container', async function() {
      const el = await fixture<Pfv6Skeleton>(html`<pfv6-skeleton screenreader-text="Test"></pfv6-skeleton>`);
      const container = el.shadowRoot!.querySelector('#container');
      const srText = container!.querySelector('.screen-reader');
      expect(srText).to.exist;
      expect(srText!.tagName.toLowerCase()).to.equal('span');
    });
  });
});
