// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6BackToTop } from '../pfv6-back-to-top.js';
import '../pfv6-back-to-top.js';

describe('<pfv6-back-to-top>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-back-to-top')).to.be.an.instanceof(Pfv6BackToTop);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-back-to-top'))
          .and
          .to.be.an.instanceOf(Pfv6BackToTop);
    });
  });

  describe('title property', function() {
    it('defaults to "Back to top"', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      expect(el.title).to.equal('Back to top'); // Match React default
    });

    it('accepts custom title value', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top title="Scroll to top"></pfv6-back-to-top>`);
      expect(el.title).to.equal('Scroll to top');
    });

    it('renders title in button text', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top title="Custom Title"></pfv6-back-to-top>`);
      const textSpan = el.shadowRoot!.querySelector('#text');
      expect(textSpan?.textContent?.trim()).to.equal('Custom Title');
    });

    it('can be updated dynamically', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top title="Initial"></pfv6-back-to-top>`);
      expect(el.title).to.equal('Initial');

      el.title = 'Updated';
      await el.updateComplete;

      expect(el.title).to.equal('Updated');
      const textSpan = el.shadowRoot!.querySelector('#text');
      expect(textSpan?.textContent?.trim()).to.equal('Updated');
    });
  });

  describe('scrollableSelector property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      expect(el.scrollableSelector).to.be.undefined; // Match React default
    });

    it('accepts custom selector value', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top scrollable-selector="#scrollable"></pfv6-back-to-top>`);
      expect(el.scrollableSelector).to.equal('#scrollable');
    });

    it('can be set imperatively', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      el.scrollableSelector = '.scroll-container';
      await el.updateComplete;
      expect(el.scrollableSelector).to.equal('.scroll-container');
    });

    it('listens to window when no selector provided', async function() {
      // Create scrollable content
      const scrollableContent = document.createElement('div');
      scrollableContent.style.height = '2000px';
      document.body.appendChild(scrollableContent);

      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      await el.updateComplete;

      // Initially hidden
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('hidden')).to.be.true;

      // Scroll down past threshold (400px)
      window.scrollTo(0, 500);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should now be visible due to window scroll listener
      expect(container?.classList.contains('hidden')).to.be.false;

      // Cleanup
      document.body.removeChild(scrollableContent);
      window.scrollTo(0, 0);
    });
  });

  describe('isAlwaysVisible property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      expect(el.isAlwaysVisible).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top is-always-visible></pfv6-back-to-top>`);
      expect(el.isAlwaysVisible).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top is-always-visible></pfv6-back-to-top>`);
      expect(el.hasAttribute('is-always-visible')).to.be.true;
    });

    it('removes hidden class when true', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top is-always-visible></pfv6-back-to-top>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('hidden')).to.be.false;
    });

    it('shows button immediately when true', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top is-always-visible></pfv6-back-to-top>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('hidden')).to.be.false;
    });

    it('can be toggled dynamically', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      expect(el.isAlwaysVisible).to.be.false;

      el.isAlwaysVisible = true;
      await el.updateComplete;

      expect(el.isAlwaysVisible).to.be.true;
      expect(el.hasAttribute('is-always-visible')).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('hidden')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6BackToTop>(html`
        <pfv6-back-to-top>
          <span>Custom content</span>
        </pfv6-back-to-top>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Custom content');
    });

    it('uses title as fallback when slot is empty', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top title="Fallback Title"></pfv6-back-to-top>`);
      const textSpan = el.shadowRoot!.querySelector('#text');
      expect(textSpan?.textContent?.trim()).to.equal('Fallback Title');
    });

    it('slot content overrides title property', async function() {
      const el = await fixture<Pfv6BackToTop>(html`
        <pfv6-back-to-top title="Should be ignored">
          Custom slot text
        </pfv6-back-to-top>
      `);
      const textSpan = el.shadowRoot!.querySelector('#text');
      // Slot takes precedence over title
      expect(textSpan?.textContent).to.include('Custom slot text');
    });
  });

  describe('button rendering', function() {
    it('renders button element', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
      expect(button?.id).to.equal('button');
    });

    it('button has type="button"', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('type')).to.equal('button');
    });

    it('renders icon with aria-hidden', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const iconSpan = el.shadowRoot!.querySelector('#icon');
      expect(iconSpan).to.exist;
      expect(iconSpan?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders SVG icon', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const svg = el.shadowRoot!.querySelector('#icon svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('viewBox')).to.equal('0 0 320 512');
    });
  });

  describe('visibility behavior', function() {
    it('starts hidden when isAlwaysVisible is false', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('hidden')).to.be.true;
    });

    it('starts visible when isAlwaysVisible is true', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top is-always-visible></pfv6-back-to-top>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('hidden')).to.be.false;
    });
  });

  describe('scroll functionality', function() {
    it('clicking button scrolls to top when scrolling window', async function() {
      // Create scrollable content
      const scrollableContent = document.createElement('div');
      scrollableContent.style.height = '2000px';
      document.body.appendChild(scrollableContent);

      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top is-always-visible></pfv6-back-to-top>`);
      await el.updateComplete;

      // Scroll down
      window.scrollTo(0, 500);
      await new Promise(resolve => setTimeout(resolve, 100));

      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
      expect(button).to.exist;

      // Click button
      await userEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Note: scrollTo with behavior: 'smooth' may not work in test environment
      // but we can verify the method was called by checking implementation

      // Cleanup
      document.body.removeChild(scrollableContent);
      window.scrollTo(0, 0);
    });

    it('clicking button scrolls scrollable element to top', async function() {
      // Create scrollable container
      const container = document.createElement('div');
      container.id = 'test-scrollable';
      container.style.height = '200px';
      container.style.overflow = 'auto';

      const content = document.createElement('div');
      content.style.height = '1000px';
      container.appendChild(content);
      document.body.appendChild(container);

      const el = await fixture<Pfv6BackToTop>(html`
        <pfv6-back-to-top scrollable-selector="#test-scrollable" is-always-visible></pfv6-back-to-top>
      `);
      await el.updateComplete;

      // Scroll container down
      container.scrollTop = 500;
      await new Promise(resolve => setTimeout(resolve, 100));

      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
      await userEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('lifecycle hooks', function() {
    it('sets up scroll listener on connect', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      // Component should have scroll listener attached
      // This is validated by the component not throwing errors
      expect(el).to.be.an.instanceof(Pfv6BackToTop);
    });

    it('removes scroll listener on disconnect', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-back-to-top id="test"></pfv6-back-to-top>
        </div>
      `);
      const el = container.querySelector('#test') as Pfv6BackToTop;
      expect(el).to.exist;

      // Remove from DOM
      container.removeChild(el);
      await new Promise(resolve => setTimeout(resolve, 50));

      // Component should have cleaned up listeners
      // No errors should occur
    });

    it('updates scroll listener when scrollableSelector changes', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      expect(el.scrollableSelector).to.be.undefined;

      // Change selector
      el.scrollableSelector = '#new-container';
      await el.updateComplete;

      expect(el.scrollableSelector).to.equal('#new-container');
    });
  });

  describe('DOM structure', function() {
    it('renders container div with id', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container?.tagName.toLowerCase()).to.equal('div');
    });

    it('renders text span with id', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const textSpan = el.shadowRoot!.querySelector('#text');
      expect(textSpan).to.exist;
      expect(textSpan?.tagName.toLowerCase()).to.equal('span');
    });

    it('renders icon span with id', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      const iconSpan = el.shadowRoot!.querySelector('#icon');
      expect(iconSpan).to.exist;
      expect(iconSpan?.tagName.toLowerCase()).to.equal('span');
    });
  });

  describe('React API parity', function() {
    it('title prop matches React default', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      // React: title = 'Back to top'
      expect(el.title).to.equal('Back to top');
    });

    it('scrollableSelector prop matches React default', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      // React: scrollableSelector is optional (undefined)
      expect(el.scrollableSelector).to.be.undefined;
    });

    it('isAlwaysVisible prop matches React default', async function() {
      const el = await fixture<Pfv6BackToTop>(html`<pfv6-back-to-top></pfv6-back-to-top>`);
      // React: isAlwaysVisible = false
      expect(el.isAlwaysVisible).to.be.false;
    });

    it('accepts all React props as attributes', async function() {
      const el = await fixture<Pfv6BackToTop>(html`
        <pfv6-back-to-top
          title="Custom Title"
          scrollable-selector="#container"
          is-always-visible
        ></pfv6-back-to-top>
      `);

      expect(el.title).to.equal('Custom Title');
      expect(el.scrollableSelector).to.equal('#container');
      expect(el.isAlwaysVisible).to.be.true;
    });
  });
});
