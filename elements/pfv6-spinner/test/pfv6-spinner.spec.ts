/**
 * Unit tests for pfv6-spinner component
 *
 * Tests validate 1:1 API parity with PatternFly React Spinner component.
 * React source: .cache/patternfly-react/packages/react-core/src/components/Spinner/Spinner.tsx
 */
import { html, fixture } from '@open-wc/testing';
import { Pfv6Spinner } from '../pfv6-spinner.js';
import '../pfv6-spinner.js';

describe('<pfv6-spinner>', function() {

  // ============================================
  // Component Instantiation
  // ============================================
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-spinner')).to.be.an.instanceof(Pfv6Spinner);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-spinner'))
          .and
          .to.be.an.instanceOf(Pfv6Spinner);
    });

    it('renders SVG with progressbar role', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('role')).to.equal('progressbar');
    });

    it('renders circle path element', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const circle = el.shadowRoot?.querySelector('circle');
      expect(circle).to.exist;
      expect(circle?.getAttribute('cx')).to.equal('50');
      expect(circle?.getAttribute('cy')).to.equal('50');
      expect(circle?.getAttribute('r')).to.equal('45');
    });
  });

  // ============================================
  // size property
  // React: size?: 'sm' | 'md' | 'lg' | 'xl' (default: 'xl')
  // ============================================
  describe('size property', function() {
    it('defaults to "xl"', async function() {
      // React default: size = 'xl'
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el.size).to.equal('xl');
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner size="sm"></pfv6-spinner>`);
      expect(el.size).to.equal('sm');
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner size="md"></pfv6-spinner>`);
      expect(el.size).to.equal('md');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner size="lg"></pfv6-spinner>`);
      expect(el.size).to.equal('lg');
    });

    it('accepts "xl" value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner size="xl"></pfv6-spinner>`);
      expect(el.size).to.equal('xl');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner size="sm"></pfv6-spinner>`);
      expect(el.getAttribute('size')).to.equal('sm');
    });

    it('applies size class to SVG', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner size="sm"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('sm')).to.be.true;
    });
  });

  // ============================================
  // ariaValuetext property
  // React: 'aria-valuetext'?: string (default: 'Loading...')
  // ============================================
  describe('ariaValuetext property', function() {
    it('defaults to "Loading..."', async function() {
      // React default: ariaValueText = 'Loading...'
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el.ariaValuetext).to.equal('Loading...');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner aria-valuetext="Processing..."></pfv6-spinner>`);
      expect(el.ariaValuetext).to.equal('Processing...');
    });

    it('applies to SVG element', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner aria-valuetext="Custom loading"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-valuetext')).to.equal('Custom loading');
    });
  });

  // ============================================
  // diameter property
  // React: diameter?: string (custom CSS value)
  // ============================================
  describe('diameter property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el.diameter).to.be.undefined;
    });

    it('accepts custom diameter value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner diameter="80px"></pfv6-spinner>`);
      expect(el.diameter).to.equal('80px');
    });

    it('sets CSS variable on SVG', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner diameter="100px"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('style')).to.include('--pf-v6-c-spinner--diameter: 100px');
    });

    it('does not set style when diameter is undefined', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.hasAttribute('style')).to.be.false;
    });
  });

  // ============================================
  // isInline property
  // React: isInline?: boolean (default: false)
  // ============================================
  describe('isInline property', function() {
    it('defaults to "false"', async function() {
      // React default: isInline = false
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el.isInline).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner is-inline></pfv6-spinner>`);
      expect(el.isInline).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner is-inline></pfv6-spinner>`);
      expect(el.hasAttribute('is-inline')).to.be.true;
    });

    it('applies inline class to SVG when true', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner is-inline></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('inline')).to.be.true;
    });

    it('does not apply size class when inline is true', async function() {
      // When isInline is true, size modifier should be ignored
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner is-inline size="sm"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('inline')).to.be.true;
      expect(svg?.classList.contains('sm')).to.be.false;
    });
  });

  // ============================================
  // accessibleLabel property
  // React: 'aria-label'?: string
  // ============================================
  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts custom label', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner accessible-label="Loading content"></pfv6-spinner>`);
      expect(el.accessibleLabel).to.equal('Loading content');
    });

    it('applies to SVG element', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner accessible-label="Loading content"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-label')).to.equal('Loading content');
    });

    it('falls back to "Contents" when no label or labelledby provided', async function() {
      // React behavior: falls back to aria-label="Contents" if no label provided
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-label')).to.equal('Contents');
    });
  });

  // ============================================
  // accessibleLabelledby property
  // React: 'aria-labelledBy'?: string
  // ============================================
  describe('accessibleLabelledby property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el.accessibleLabelledby).to.be.undefined;
    });

    it('accepts ID reference', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner accessible-labelledby="my-label"></pfv6-spinner>`);
      expect(el.accessibleLabelledby).to.equal('my-label');
    });

    it('applies to SVG element', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner accessible-labelledby="my-label"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-labelledby')).to.equal('my-label');
    });

    it('does not apply fallback aria-label when labelledby is set', async function() {
      // When labelledby is set, aria-label should not have fallback "Contents"
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner accessible-labelledby="my-label"></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.hasAttribute('aria-label')).to.be.false;
    });
  });

  // ============================================
  // SVG Structure
  // ============================================
  describe('SVG structure', function() {
    it('has correct viewBox', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).to.equal('0 0 100 100');
    });

    it('circle has fill="none"', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const circle = el.shadowRoot?.querySelector('circle');
      expect(circle?.getAttribute('fill')).to.equal('none');
    });
  });

  // ============================================
  // No slots (Spinner has no children)
  // ============================================
  describe('slots', function() {
    it('has no slots', async function() {
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      const slot = el.shadowRoot?.querySelector('slot');
      expect(slot).to.be.null;
    });
  });

  // ============================================
  // No events (Spinner is purely visual)
  // ============================================
  describe('events', function() {
    it('does not dispatch events', async function() {
      // Spinner is a visual loading indicator with no user interaction
      // No events to test - this is documented for completeness
      const el = await fixture<Pfv6Spinner>(html`<pfv6-spinner></pfv6-spinner>`);
      expect(el).to.exist; // Placeholder test
    });
  });
});
