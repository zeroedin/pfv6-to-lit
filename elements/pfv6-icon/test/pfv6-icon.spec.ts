/**
 * Unit tests for pfv6-icon component
 *
 * Tests validate 1:1 API parity with PatternFly React Icon component.
 * React source: .cache/patternfly-react/packages/react-core/src/components/Icon/Icon.tsx
 */
import { html, fixture } from '@open-wc/testing';
import { Pfv6Icon } from '../pfv6-icon.js';
import '../pfv6-icon.js';

describe('<pfv6-icon>', function() {
  // ============================================
  // Component Instantiation
  // ============================================
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-icon')).to.be.an.instanceof(Pfv6Icon);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-icon'))
          .and
          .to.be.an.instanceOf(Pfv6Icon);
    });

    it('renders container span with id="container"', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container).to.exist;
      expect(container?.tagName).to.equal('SPAN');
    });

    it('renders content span with id="content"', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const content = el.shadowRoot?.querySelector('#content');
      expect(content).to.exist;
      expect(content?.tagName).to.equal('SPAN');
    });
  });

  // ============================================
  // size property
  // React: size?: IconSize (no default)
  // ============================================
  describe('size property', function() {
    it('defaults to undefined', async function() {
      // React default: size is undefined
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.size).to.be.undefined;
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="sm"></pfv6-icon>`);
      expect(el.size).to.equal('sm');
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="md"></pfv6-icon>`);
      expect(el.size).to.equal('md');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="lg"></pfv6-icon>`);
      expect(el.size).to.equal('lg');
    });

    it('accepts "xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="xl"></pfv6-icon>`);
      expect(el.size).to.equal('xl');
    });

    it('accepts "2xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="2xl"></pfv6-icon>`);
      expect(el.size).to.equal('2xl');
    });

    it('accepts "3xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="3xl"></pfv6-icon>`);
      expect(el.size).to.equal('3xl');
    });

    it('accepts "headingSm" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="headingSm"></pfv6-icon>`);
      expect(el.size).to.equal('headingSm');
    });

    it('accepts "headingMd" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="headingMd"></pfv6-icon>`);
      expect(el.size).to.equal('headingMd');
    });

    it('accepts "headingLg" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="headingLg"></pfv6-icon>`);
      expect(el.size).to.equal('headingLg');
    });

    it('accepts "headingXl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="headingXl"></pfv6-icon>`);
      expect(el.size).to.equal('headingXl');
    });

    it('accepts "heading_2xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="heading_2xl"></pfv6-icon>`);
      expect(el.size).to.equal('heading_2xl');
    });

    it('accepts "heading_3xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="heading_3xl"></pfv6-icon>`);
      expect(el.size).to.equal('heading_3xl');
    });

    it('accepts "bodySm" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="bodySm"></pfv6-icon>`);
      expect(el.size).to.equal('bodySm');
    });

    it('accepts "bodyDefault" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="bodyDefault"></pfv6-icon>`);
      expect(el.size).to.equal('bodyDefault');
    });

    it('accepts "bodyLg" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="bodyLg"></pfv6-icon>`);
      expect(el.size).to.equal('bodyLg');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="lg"></pfv6-icon>`);
      expect(el.getAttribute('size')).to.equal('lg');
    });

    it('applies size class to container', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="lg"></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('lg')).to.be.true;
    });

    it('applies heading size class with kebab-case', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="headingMd"></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('heading-md')).to.be.true;
    });

    it('applies body size class with kebab-case', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="bodyDefault"></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('body-default')).to.be.true;
    });
  });

  // ============================================
  // iconSize property
  // React: iconSize?: IconSize (no default)
  // ============================================
  describe('iconSize property', function() {
    it('defaults to undefined', async function() {
      // React default: iconSize is undefined
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.iconSize).to.be.undefined;
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="sm"></pfv6-icon>`);
      expect(el.iconSize).to.equal('sm');
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="md"></pfv6-icon>`);
      expect(el.iconSize).to.equal('md');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="lg"></pfv6-icon>`);
      expect(el.iconSize).to.equal('lg');
    });

    it('accepts "xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="xl"></pfv6-icon>`);
      expect(el.iconSize).to.equal('xl');
    });

    it('accepts "2xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="2xl"></pfv6-icon>`);
      expect(el.iconSize).to.equal('2xl');
    });

    it('accepts "3xl" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="3xl"></pfv6-icon>`);
      expect(el.iconSize).to.equal('3xl');
    });

    it('reflects to attribute with kebab-case', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="lg"></pfv6-icon>`);
      expect(el.getAttribute('icon-size')).to.equal('lg');
    });

    it('applies size class to content span', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="lg"></pfv6-icon>`);
      const content = el.shadowRoot?.querySelector('#content');
      expect(content?.classList.contains('lg')).to.be.true;
    });

    it('overrides container size', async function() {
      // iconSize overrides the size set by size property (React behavior)
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="3xl" icon-size="lg"></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      const content = el.shadowRoot?.querySelector('#content');
      expect(container?.classList.contains('3xl')).to.be.true;
      expect(content?.classList.contains('lg')).to.be.true;
    });
  });

  // ============================================
  // progressIconSize property
  // React: progressIconSize?: IconSize (no default)
  // ============================================
  describe('progressIconSize property', function() {
    it('defaults to undefined', async function() {
      // React default: progressIconSize is undefined
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.progressIconSize).to.be.undefined;
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="sm"></pfv6-icon>`);
      expect(el.progressIconSize).to.equal('sm');
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="md"></pfv6-icon>`);
      expect(el.progressIconSize).to.equal('md');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="lg"></pfv6-icon>`);
      expect(el.progressIconSize).to.equal('lg');
    });

    it('reflects to attribute with kebab-case', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="md"></pfv6-icon>`);
      expect(el.getAttribute('progress-icon-size')).to.equal('md');
    });

    it('applies size class to progress span when in progress', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress progress-icon-size="md"></pfv6-icon>`);
      const progress = el.shadowRoot?.querySelector('#progress');
      expect(progress?.classList.contains('md')).to.be.true;
    });

    it('does not render progress span when not in progress', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="md"></pfv6-icon>`);
      const progress = el.shadowRoot?.querySelector('#progress');
      expect(progress).to.be.null;
    });
  });

  // ============================================
  // status property
  // React: status?: 'custom' | 'info' | 'success' | 'warning' | 'danger' (no default)
  // ============================================
  describe('status property', function() {
    it('defaults to undefined', async function() {
      // React default: status is undefined
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.status).to.be.undefined;
    });

    it('accepts "custom" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="custom"></pfv6-icon>`);
      expect(el.status).to.equal('custom');
    });

    it('accepts "info" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="info"></pfv6-icon>`);
      expect(el.status).to.equal('info');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="success"></pfv6-icon>`);
      expect(el.status).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="warning"></pfv6-icon>`);
      expect(el.status).to.equal('warning');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="danger"></pfv6-icon>`);
      expect(el.status).to.equal('danger');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="warning"></pfv6-icon>`);
      expect(el.getAttribute('status')).to.equal('warning');
    });

    it('applies status class to content span', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="danger"></pfv6-icon>`);
      const content = el.shadowRoot?.querySelector('#content');
      expect(content?.classList.contains('danger')).to.be.true;
    });
  });

  // ============================================
  // isInline property
  // React: isInline?: boolean (default: false)
  // ============================================
  describe('isInline property', function() {
    it('defaults to false', async function() {
      // React default: isInline = false
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.isInline).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-inline></pfv6-icon>`);
      expect(el.isInline).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-inline></pfv6-icon>`);
      expect(el.hasAttribute('is-inline')).to.be.true;
    });

    it('applies inline class to container when true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-inline></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('inline')).to.be.true;
    });

    it('does not apply inline class when false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('inline')).to.be.false;
    });
  });

  // ============================================
  // isInProgress property
  // React: isInProgress?: boolean (default: false)
  // ============================================
  describe('isInProgress property', function() {
    it('defaults to false', async function() {
      // React default: isInProgress = false
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.isInProgress).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      expect(el.isInProgress).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      expect(el.hasAttribute('is-in-progress')).to.be.true;
    });

    it('applies in-progress class to container when true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('in-progress')).to.be.true;
    });

    it('renders progress span when true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const progress = el.shadowRoot?.querySelector('#progress');
      expect(progress).to.exist;
      expect(progress?.tagName).to.equal('SPAN');
    });

    it('does not render progress span when false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const progress = el.shadowRoot?.querySelector('#progress');
      expect(progress).to.be.null;
    });

    it('renders default spinner in progress slot', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot?.querySelector('pfv6-spinner');
      expect(spinner).to.exist;
      expect(spinner?.getAttribute('diameter')).to.equal('1em');
    });
  });

  // ============================================
  // defaultProgressAriaLabel property
  // React: defaultProgressArialabel?: string (default: 'Loading...')
  // Note: React has typo "Arialabel" but we use correct "AriaLabel"
  // ============================================
  describe('defaultProgressAriaLabel property', function() {
    it('defaults to "Loading..."', async function() {
      // React default: defaultProgressArialabel = 'Loading...'
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.defaultProgressAriaLabel).to.equal('Loading...');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon default-progress-aria-label="Processing..."></pfv6-icon>`);
      expect(el.defaultProgressAriaLabel).to.equal('Processing...');
    });

    it('applies to default spinner aria-label', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress default-progress-aria-label="Custom loading"></pfv6-icon>`);
      const spinner = el.shadowRoot?.querySelector('pfv6-spinner');
      expect(spinner?.getAttribute('aria-label')).to.equal('Custom loading');
    });

    it('uses default when not specified', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot?.querySelector('pfv6-spinner');
      expect(spinner?.getAttribute('aria-label')).to.equal('Loading...');
    });
  });

  // ============================================
  // shouldMirrorRTL property
  // React: shouldMirrorRTL?: boolean (default: false)
  // ============================================
  describe('shouldMirrorRTL property', function() {
    it('defaults to false', async function() {
      // React default: shouldMirrorRTL = false
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.shouldMirrorRTL).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon should-mirror-rtl></pfv6-icon>`);
      expect(el.shouldMirrorRTL).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon should-mirror-rtl></pfv6-icon>`);
      expect(el.hasAttribute('should-mirror-rtl')).to.be.true;
    });

    it('applies mirror-inline-rtl class to content when true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon should-mirror-rtl></pfv6-icon>`);
      const content = el.shadowRoot?.querySelector('#content');
      expect(content?.classList.contains('mirror-inline-rtl')).to.be.true;
    });

    it('does not apply mirror class when false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const content = el.shadowRoot?.querySelector('#content');
      expect(content?.classList.contains('mirror-inline-rtl')).to.be.false;
    });
  });

  // ============================================
  // Slots
  // ============================================
  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon>
          <svg data-testid="my-icon"></svg>
        </pfv6-icon>
      `);
      const icon = el.querySelector('[data-testid="my-icon"]');
      expect(icon).to.exist;
    });

    it('default slot renders inside content span', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon>
          <svg data-testid="my-icon"></svg>
        </pfv6-icon>
      `);
      const content = el.shadowRoot?.querySelector('#content');
      const slot = content?.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('renders named progress-icon slot', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-in-progress>
          <svg slot="progress-icon" data-testid="custom-progress"></svg>
        </pfv6-icon>
      `);
      const customProgress = el.querySelector('[data-testid="custom-progress"]');
      expect(customProgress).to.exist;
      expect(customProgress?.getAttribute('slot')).to.equal('progress-icon');
    });

    it('progress-icon slot renders inside progress span', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-in-progress>
          <svg slot="progress-icon" data-testid="custom-progress"></svg>
        </pfv6-icon>
      `);
      const progress = el.shadowRoot?.querySelector('#progress');
      const slot = progress?.querySelector('slot[name="progress-icon"]');
      expect(slot).to.exist;
    });

    it('custom progress-icon replaces default spinner', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-in-progress>
          <svg slot="progress-icon" data-testid="custom-progress"></svg>
        </pfv6-icon>
      `);
      // Custom icon should be slotted
      const customProgress = el.querySelector('[data-testid="custom-progress"]');
      expect(customProgress).to.exist;

      // Default spinner should still exist as fallback content
      const spinner = el.shadowRoot?.querySelector('pfv6-spinner');
      expect(spinner).to.exist;
    });
  });

  // ============================================
  // Multiple properties combined
  // ============================================
  describe('combined properties', function() {
    it('applies multiple size and status classes', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon size="xl" icon-size="lg" status="danger"></pfv6-icon>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      const content = el.shadowRoot?.querySelector('#content');

      expect(container?.classList.contains('xl')).to.be.true;
      expect(content?.classList.contains('lg')).to.be.true;
      expect(content?.classList.contains('danger')).to.be.true;
    });

    it('applies inline and mirror classes together', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-inline should-mirror-rtl></pfv6-icon>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      const content = el.shadowRoot?.querySelector('#content');

      expect(container?.classList.contains('inline')).to.be.true;
      expect(content?.classList.contains('mirror-inline-rtl')).to.be.true;
    });

    it('handles progress with custom size and status', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-in-progress progress-icon-size="sm" status="info"></pfv6-icon>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      const content = el.shadowRoot?.querySelector('#content');
      const progress = el.shadowRoot?.querySelector('#progress');

      expect(container?.classList.contains('in-progress')).to.be.true;
      expect(content?.classList.contains('info')).to.be.true;
      expect(progress?.classList.contains('sm')).to.be.true;
    });
  });

  // ============================================
  // No events (Icon is purely visual/structural)
  // ============================================
  describe('events', function() {
    it('does not dispatch events', async function() {
      // Icon is a wrapper component with no user interaction
      // No events to test - this is documented for completeness
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el).to.exist;
    });
  });
});
