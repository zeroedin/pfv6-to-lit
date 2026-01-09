import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Icon } from '../pfv6-icon.js';
import '../pfv6-icon.js';

describe('<pfv6-icon>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-icon')).to.be.an.instanceof(Pfv6Icon);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-icon'))
          .and
          .to.be.an.instanceOf(Pfv6Icon);
    });
  });

  describe('size property', function() {
    it('defaults to undefined', async function() {
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
      expect(el.hasAttribute('size')).to.be.true;
      expect(el.getAttribute('size')).to.equal('lg');
    });

    it('applies correct class for "md" size', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="md"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('md')).to.be.true;
    });

    it('applies correct class for "headingSm" size (converts to kebab-case)', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="headingSm"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('heading-sm')).to.be.true;
    });

    it('applies correct class for "heading_2xl" size (converts underscore to dash)', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="heading_2xl"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('heading-2xl')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="sm"></pfv6-icon>`);
      expect(el.size).to.equal('sm');

      el.size = 'lg';
      await el.updateComplete;

      expect(el.size).to.equal('lg');
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('lg')).to.be.true;
      expect(container!.classList.contains('sm')).to.be.false;
    });
  });

  describe('iconSize property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.iconSize).to.be.undefined;
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="sm"></pfv6-icon>`);
      expect(el.iconSize).to.equal('sm');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="lg"></pfv6-icon>`);
      expect(el.iconSize).to.equal('lg');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="lg"></pfv6-icon>`);
      expect(el.hasAttribute('icon-size')).to.be.true;
      expect(el.getAttribute('icon-size')).to.equal('lg');
    });

    it('applies class to content element', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon icon-size="xl"></pfv6-icon>`);
      const content = el.shadowRoot!.querySelector('#content');
      expect(content!.classList.contains('xl')).to.be.true;
    });

    it('overrides size property for icon content', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="sm" icon-size="xl"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      const content = el.shadowRoot!.querySelector('#content');

      // Container should use size property
      expect(container!.classList.contains('sm')).to.be.true;
      // Content should use iconSize property
      expect(content!.classList.contains('xl')).to.be.true;
    });
  });

  describe('progressIconSize property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.progressIconSize).to.be.undefined;
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="md"></pfv6-icon>`);
      expect(el.progressIconSize).to.equal('md');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon progress-icon-size="md"></pfv6-icon>`);
      expect(el.hasAttribute('progress-icon-size')).to.be.true;
      expect(el.getAttribute('progress-icon-size')).to.equal('md');
    });

    it('applies class to progress element when in progress', async function() {
      const el = await fixture<Pfv6Icon>(
        html`<pfv6-icon is-in-progress progress-icon-size="lg"></pfv6-icon>`
      );
      const progress = el.shadowRoot!.querySelector('#progress');
      expect(progress!.classList.contains('lg')).to.be.true;
    });
  });

  describe('status property', function() {
    it('defaults to undefined', async function() {
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
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="success"></pfv6-icon>`);
      expect(el.hasAttribute('status')).to.be.true;
      expect(el.getAttribute('status')).to.equal('success');
    });

    it('applies status class to content element', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="danger"></pfv6-icon>`);
      const content = el.shadowRoot!.querySelector('#content');
      expect(content!.classList.contains('danger')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon status="success"></pfv6-icon>`);
      expect(el.status).to.equal('success');

      el.status = 'danger';
      await el.updateComplete;

      expect(el.status).to.equal('danger');
      const content = el.shadowRoot!.querySelector('#content');
      expect(content!.classList.contains('danger')).to.be.true;
      expect(content!.classList.contains('success')).to.be.false;
    });
  });

  describe('isInline property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.isInline).to.be.false; // Match React default
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
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inline')).to.be.true;
    });

    it('does not apply inline class when false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inline')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.isInline).to.be.false;

      el.isInline = true;
      await el.updateComplete;

      expect(el.isInline).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inline')).to.be.true;
    });
  });

  describe('isInProgress property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.isInProgress).to.be.false; // Match React default
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
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('in-progress')).to.be.true;
    });

    it('renders progress element when true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const progress = el.shadowRoot!.querySelector('#progress');
      expect(progress).to.exist;
    });

    it('does not render progress element when false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const progress = el.shadowRoot!.querySelector('#progress');
      expect(progress).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.isInProgress).to.be.false;
      expect(el.shadowRoot!.querySelector('#progress')).to.not.exist;

      el.isInProgress = true;
      await el.updateComplete;

      expect(el.isInProgress).to.be.true;
      const progress = el.shadowRoot!.querySelector('#progress');
      expect(progress).to.exist;
    });
  });

  describe('defaultProgressAriaLabel property', function() {
    it('defaults to "Loading..."', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.defaultProgressAriaLabel).to.equal('Loading...'); // Match React default
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Icon>(
        html`<pfv6-icon default-progress-aria-label="Please wait"></pfv6-icon>`
      );
      expect(el.defaultProgressAriaLabel).to.equal('Please wait');
    });

    it('applies to default progress icon aria-label', async function() {
      const el = await fixture<Pfv6Icon>(
        html`<pfv6-icon is-in-progress default-progress-aria-label="Custom loading"></pfv6-icon>`
      );
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner).to.exist;
      expect(spinner!.getAttribute('aria-label')).to.equal('Custom loading');
    });

    it('applies default value when not specified', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner!.getAttribute('aria-label')).to.equal('Loading...');
    });
  });

  describe('shouldMirrorRTL property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      expect(el.shouldMirrorRTL).to.be.false; // Match React default
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon should-mirror-rtl></pfv6-icon>`);
      expect(el.shouldMirrorRTL).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon should-mirror-rtl></pfv6-icon>`);
      expect(el.hasAttribute('should-mirror-rtl')).to.be.true;
    });

    it('applies RTL mirror class to content when true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon should-mirror-rtl></pfv6-icon>`);
      const content = el.shadowRoot!.querySelector('#content');
      expect(content!.classList.contains('pf-v6-m-mirror-inline-rtl')).to.be.true;
    });

    it('does not apply RTL mirror class when false', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const content = el.shadowRoot!.querySelector('#content');
      expect(content!.classList.contains('pf-v6-m-mirror-inline-rtl')).to.be.false;
    });
  });

  describe('slot rendering', function() {
    it('renders default slot for icon content', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon>
          <svg><path d="M0 0"></path></svg>
        </pfv6-icon>
      `);
      const slot = el.shadowRoot!.querySelector('#content slot:not([name])');
      expect(slot).to.exist;
    });

    it('displays slotted SVG icon', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon>
          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true" role="img">
            <path d="M168 345.941"></path>
          </svg>
        </pfv6-icon>
      `);
      const svg = el.querySelector('svg');
      expect(svg).to.exist;
      expect(svg!.getAttribute('viewBox')).to.equal('0 0 256 512');
    });

    it('renders named progress-icon slot', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-in-progress>
          <svg slot="progress-icon" class="custom-progress"></svg>
        </pfv6-icon>
      `);
      const customProgress = el.querySelector('.custom-progress');
      expect(customProgress).to.exist;
      expect(customProgress!.getAttribute('slot')).to.equal('progress-icon');
    });

    it('uses default progress icon when no progress-icon slot provided', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner).to.exist;
      expect(spinner!.tagName).to.equal('svg');
    });

    it('uses custom progress icon when progress-icon slot provided', async function() {
      const el = await fixture<Pfv6Icon>(html`
        <pfv6-icon is-in-progress>
          <svg slot="progress-icon" class="my-custom-spinner"></svg>
        </pfv6-icon>
      `);
      const customSpinner = el.querySelector('.my-custom-spinner');
      expect(customSpinner).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can have both size and status', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="lg" status="success"></pfv6-icon>`);
      expect(el.size).to.equal('lg');
      expect(el.status).to.equal('success');

      const container = el.shadowRoot!.querySelector('#container');
      const content = el.shadowRoot!.querySelector('#content');
      expect(container!.classList.contains('lg')).to.be.true;
      expect(content!.classList.contains('success')).to.be.true;
    });

    it('can be inline and in progress', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-inline is-in-progress></pfv6-icon>`);
      expect(el.isInline).to.be.true;
      expect(el.isInProgress).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inline')).to.be.true;
      expect(container!.classList.contains('in-progress')).to.be.true;
    });

    it('iconSize overrides size for content', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="sm" icon-size="xl" status="danger"></pfv6-icon>`);

      const container = el.shadowRoot!.querySelector('#container');
      const content = el.shadowRoot!.querySelector('#content');

      // Container gets size
      expect(container!.classList.contains('sm')).to.be.true;
      // Content gets iconSize and status
      expect(content!.classList.contains('xl')).to.be.true;
      expect(content!.classList.contains('danger')).to.be.true;
    });

    it('progressIconSize applies to progress element', async function() {
      const el = await fixture<Pfv6Icon>(
        html`<pfv6-icon size="sm" is-in-progress progress-icon-size="lg"></pfv6-icon>`
      );

      const container = el.shadowRoot!.querySelector('#container');
      const progress = el.shadowRoot!.querySelector('#progress');

      expect(container!.classList.contains('sm')).to.be.true;
      expect(progress!.classList.contains('lg')).to.be.true;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('SPAN');
    });

    it('renders content element inside container', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      const content = container!.querySelector('#content');
      expect(content).to.exist;
      expect(content!.tagName).to.equal('SPAN');
    });

    it('content element contains default slot', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon></pfv6-icon>`);
      const content = el.shadowRoot!.querySelector('#content');
      const slot = content!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('renders progress element only when isInProgress is true', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const progress = el.shadowRoot!.querySelector('#progress');
      expect(progress).to.exist;
      expect(progress!.tagName).to.equal('SPAN');
    });

    it('progress element contains progress-icon slot', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const progress = el.shadowRoot!.querySelector('#progress');
      const slot = progress!.querySelector('slot[name="progress-icon"]');
      expect(slot).to.exist;
    });
  });

  describe('default progress icon', function() {
    it('renders spinner SVG', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner).to.exist;
      expect(spinner!.tagName).to.equal('svg');
    });

    it('spinner has correct attributes', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner') as SVGElement;

      expect(spinner.getAttribute('role')).to.equal('progressbar');
      expect(spinner.getAttribute('aria-valuetext')).to.equal('Loading...');
      expect(spinner.getAttribute('viewBox')).to.equal('0 0 100 100');
    });

    it('spinner contains circle element', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const circle = el.shadowRoot!.querySelector('.spinner-path');
      expect(circle).to.exist;
      expect(circle!.tagName).to.equal('circle');
    });

    it('spinner uses custom aria-label when provided', async function() {
      const el = await fixture<Pfv6Icon>(
        html`<pfv6-icon is-in-progress default-progress-aria-label="Processing"></pfv6-icon>`
      );
      const spinner = el.shadowRoot!.querySelector('.spinner') as SVGElement;
      expect(spinner.getAttribute('aria-label')).to.equal('Processing');
    });
  });

  describe('accessibility', function() {
    it('progress icon has role progressbar', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner!.getAttribute('role')).to.equal('progressbar');
    });

    it('progress icon has aria-valuetext', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner!.getAttribute('aria-valuetext')).to.equal('Loading...');
    });

    it('progress icon has aria-label', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon is-in-progress></pfv6-icon>`);
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner!.getAttribute('aria-label')).to.equal('Loading...');
    });

    it('custom progress aria-label is applied', async function() {
      const el = await fixture<Pfv6Icon>(
        html`<pfv6-icon is-in-progress default-progress-aria-label="Fetching data"></pfv6-icon>`
      );
      const spinner = el.shadowRoot!.querySelector('.spinner');
      expect(spinner!.getAttribute('aria-label')).to.equal('Fetching data');
    });
  });

  describe('size class conversion', function() {
    it('converts camelCase to kebab-case', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="bodySm"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('body-sm')).to.be.true;
    });

    it('converts underscore to dash', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="heading_2xl"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('heading-2xl')).to.be.true;
    });

    it('handles simple sizes without conversion', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="sm"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('sm')).to.be.true;
    });

    it('converts bodyDefault to body-default', async function() {
      const el = await fixture<Pfv6Icon>(html`<pfv6-icon size="bodyDefault"></pfv6-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('body-default')).to.be.true;
    });
  });
});
