// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6Progress } from '../pfv6-progress.js';
import { Pfv6ProgressBar } from '../pfv6-progress-bar.js';
import { Pfv6ProgressHelperText } from '../pfv6-progress-helper-text.js';
import '../pfv6-progress.js';
import '../pfv6-progress-bar.js';
import '../pfv6-progress-helper-text.js';

describe('<pfv6-progress>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-progress')).to.be.an.instanceof(Pfv6Progress);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-progress'))
        .and.to.be.an.instanceOf(Pfv6Progress);
    });
  });

  describe('size property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.size).to.be.undefined;
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="sm"></pfv6-progress>`);
      expect(el.size).to.equal('sm');
    });

    it('accepts "md" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="md"></pfv6-progress>`);
      expect(el.size).to.equal('md');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="lg"></pfv6-progress>`);
      expect(el.size).to.equal('lg');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="lg"></pfv6-progress>`);
      expect(el.getAttribute('size')).to.equal('lg');
    });
  });

  describe('measureLocation property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.measureLocation).to.equal('top'); // Match React default
    });

    it('accepts "outside" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="outside"></pfv6-progress>`);
      expect(el.measureLocation).to.equal('outside');
    });

    it('accepts "inside" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="inside"></pfv6-progress>`);
      expect(el.measureLocation).to.equal('inside');
    });

    it('accepts "none" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="none"></pfv6-progress>`);
      expect(el.measureLocation).to.equal('none');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="inside"></pfv6-progress>`);
      expect(el.getAttribute('measure-location')).to.equal('inside');
    });
  });

  describe('variant property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.variant).to.be.undefined;
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="danger"></pfv6-progress>`);
      expect(el.variant).to.equal('danger');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="success"></pfv6-progress>`);
      expect(el.variant).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="warning"></pfv6-progress>`);
      expect(el.variant).to.equal('warning');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="success"></pfv6-progress>`);
      expect(el.getAttribute('variant')).to.equal('success');
    });
  });

  describe('title property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.title).to.equal(''); // Match React default
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Progress Title"></pfv6-progress>`);
      expect(el.title).to.equal('Progress Title');
    });

    it('renders title in shadow DOM', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test Title"></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title');
      expect(titleEl).to.exist;
      expect(titleEl?.textContent?.trim()).to.equal('Test Title');
    });

    it('does not render title element when title is empty', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title');
      expect(titleEl).to.not.exist;
    });
  });

  describe('label property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.label).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress label="Custom label"></pfv6-progress>`);
      expect(el.label).to.equal('Custom label');
    });

    it('displays label instead of percentage when provided', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" label="50 MB"></pfv6-progress>`);
      const measure = el.shadowRoot!.querySelector('.measure');
      expect(measure?.textContent).to.equal('50 MB');
    });

    it('displays percentage when label is not provided', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50"></pfv6-progress>`);
      const measure = el.shadowRoot!.querySelector('.measure');
      expect(measure?.textContent).to.equal('50%');
    });
  });

  describe('value property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.value).to.equal(0); // Match React default
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="75"></pfv6-progress>`);
      expect(el.value).to.equal(75);
    });

    it('scales value correctly with default min/max', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50"></pfv6-progress>`);
      await el.updateComplete;
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(50);
    });

    it('scales value correctly with custom min/max', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" min="0" max="200"></pfv6-progress>`);
      await el.updateComplete;
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(25); // 50/200 * 100 = 25
    });

    it('clamps value to 0 when below min', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="-10"></pfv6-progress>`);
      await el.updateComplete;
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(0);
    });

    it('clamps value to 100 when above max', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="150"></pfv6-progress>`);
      await el.updateComplete;
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(100);
    });
  });

  describe('min property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.min).to.equal(0); // Match React default
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress min="10"></pfv6-progress>`);
      expect(el.min).to.equal(10);
    });

    it('passes min to progress bar aria-valuemin', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress min="10"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.getAttribute('aria-valuemin')).to.equal('10');
    });
  });

  describe('max property', function() {
    it('defaults to 100', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.max).to.equal(100); // Match React default
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress max="200"></pfv6-progress>`);
      expect(el.max).to.equal(200);
    });

    it('passes max to progress bar aria-valuemax', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress max="200"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.getAttribute('aria-valuemax')).to.equal('200');
    });
  });

  describe('valueText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.valueText).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value-text="50 percent"></pfv6-progress>`);
      expect(el.valueText).to.equal('50 percent');
    });

    it('passes valueText to progress bar aria-valuetext', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value-text="50 percent"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.getAttribute('aria-valuetext')).to.equal('50 percent');
    });
  });

  describe('isTitleTruncated property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.isTitleTruncated).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress is-title-truncated></pfv6-progress>`);
      expect(el.isTitleTruncated).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress is-title-truncated></pfv6-progress>`);
      expect(el.hasAttribute('is-title-truncated')).to.be.true;
    });

    it('adds truncate class to title when true', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test" is-title-truncated></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title.truncate');
      expect(titleEl).to.exist;
    });

    it('wraps title in pfv6-tooltip when true', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test" is-title-truncated></pfv6-progress>`);
      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip).to.exist;
    });
  });

  describe('tooltipPosition property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.tooltipPosition).to.equal('top'); // Match React default
    });

    it('accepts "auto" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress tooltip-position="auto"></pfv6-progress>`);
      expect(el.tooltipPosition).to.equal('auto');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress tooltip-position="bottom"></pfv6-progress>`);
      expect(el.tooltipPosition).to.equal('bottom');
    });

    it('accepts "left" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress tooltip-position="left"></pfv6-progress>`);
      expect(el.tooltipPosition).to.equal('left');
    });

    it('accepts "right" value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress tooltip-position="right"></pfv6-progress>`);
      expect(el.tooltipPosition).to.equal('right');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress accessible-label="Loading progress"></pfv6-progress>`);
      expect(el.accessibleLabel).to.equal('Loading progress');
    });

    it('passes to progress bar aria-label', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress accessible-label="Loading progress"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.getAttribute('aria-label')).to.equal('Loading progress');
    });
  });

  describe('accessibleLabelledby property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.accessibleLabelledby).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress accessible-labelledby="title-id"></pfv6-progress>`);
      expect(el.accessibleLabelledby).to.equal('title-id');
    });

    it('passes to progress bar aria-labelledby when provided', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress accessible-labelledby="title-id"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.getAttribute('aria-labelledby')).to.equal('title-id');
    });

    it('uses generated ID for aria-labelledby when title is present and accessibleLabelledby is not provided', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test Title"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      const labelledby = progressBar?.getAttribute('aria-labelledby');
      expect(labelledby).to.match(/^pfv6-progress-.*-description$/);
    });
  });

  describe('accessibleDescribedby property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.accessibleDescribedby).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress accessible-describedby="help-id"></pfv6-progress>`);
      expect(el.accessibleDescribedby).to.equal('help-id');
    });

    it('passes to progress bar aria-describedby', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress accessible-describedby="help-id"></pfv6-progress>`);
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.getAttribute('aria-describedby')).to.equal('help-id');
    });
  });

  describe('helperText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      expect(el.helperText).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress helper-text="Loading data..."></pfv6-progress>`);
      expect(el.helperText).to.equal('Loading data...');
    });

    it('renders helper text when provided', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress helper-text="Loading data..."></pfv6-progress>`);
      const helperTextEl = el.shadowRoot!.querySelector('pfv6-progress-helper-text');
      expect(helperTextEl).to.exist;
      expect(helperTextEl?.textContent).to.equal('Loading data...');
    });

    it('does not render helper text when not provided', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      const helperTextEl = el.shadowRoot!.querySelector('pfv6-progress-helper-text');
      expect(helperTextEl).to.not.exist;
    });
  });

  describe('value scaling', function() {
    it('scales value to percentage based on min/max range', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="150" min="0" max="300"></pfv6-progress>`);
      await el.updateComplete;
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(50); // 150/300 * 100 = 50%
    });

    it('handles non-zero min value correctly', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="75" min="25" max="125"></pfv6-progress>`);
      await el.updateComplete;
      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(50); // (75-25)/(125-25) * 100 = 50%
    });

    it('updates scaled value when value changes', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="25"></pfv6-progress>`);
      await el.updateComplete;
      let progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(25);

      el.value = 75;
      await el.updateComplete;
      progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(75);
    });

    it('updates scaled value when min changes', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" min="0" max="100"></pfv6-progress>`);
      await el.updateComplete;
      let progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(50);

      el.min = 25;
      await el.updateComplete;
      progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(33); // (50-25)/(100-25) * 100 = 33.33 -> 33
    });

    it('updates scaled value when max changes', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" min="0" max="100"></pfv6-progress>`);
      await el.updateComplete;
      let progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(50);

      el.max = 200;
      await el.updateComplete;
      progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.value).to.equal(25); // 50/200 * 100 = 25%
    });
  });

  describe('variant icons', function() {
    it('renders success icon when variant is success', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="success"></pfv6-progress>`);
      const icon = el.shadowRoot!.querySelector('.status-icon svg');
      expect(icon).to.exist;
      expect(icon?.getAttribute('viewBox')).to.equal('0 0 512 512');
    });

    it('renders danger icon when variant is danger', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="danger"></pfv6-progress>`);
      const icon = el.shadowRoot!.querySelector('.status-icon svg');
      expect(icon).to.exist;
      expect(icon?.getAttribute('viewBox')).to.equal('0 0 512 512');
    });

    it('renders warning icon when variant is warning', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="warning"></pfv6-progress>`);
      const icon = el.shadowRoot!.querySelector('.status-icon svg');
      expect(icon).to.exist;
      expect(icon?.getAttribute('viewBox')).to.equal('0 0 576 512');
    });

    it('does not render icon when variant is undefined', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      const icon = el.shadowRoot!.querySelector('.status-icon');
      expect(icon).to.not.exist;
    });
  });

  describe('measure location rendering', function() {
    it('renders measure in top position by default', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50"></pfv6-progress>`);
      const measure = el.shadowRoot!.querySelector('.status .measure');
      expect(measure).to.exist;
      expect(measure?.textContent).to.equal('50%');
    });

    it('renders measure in outside position', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" measure-location="outside"></pfv6-progress>`);
      const measure = el.shadowRoot!.querySelector('.status .measure');
      expect(measure).to.exist;
      expect(measure?.textContent).to.equal('50%');
    });

    it('renders measure inside progress bar when location is inside', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" measure-location="inside"></pfv6-progress>`);
      const statusMeasure = el.shadowRoot!.querySelector('.status .measure');
      expect(statusMeasure).to.not.exist;

      const progressBar = el.shadowRoot!.querySelector('pfv6-progress-bar');
      expect(progressBar?.textContent).to.equal('50%');
    });

    it('does not render measure when location is none', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50" measure-location="none"></pfv6-progress>`);
      const measure = el.shadowRoot!.querySelector('.measure');
      expect(measure).to.not.exist;
    });

    it('renders status section when measureLocation is not none', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress value="50"></pfv6-progress>`);
      const status = el.shadowRoot!.querySelector('.status');
      expect(status).to.exist;
    });

    it('renders status section when variant icon is present even if measureLocation is none', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="success" measure-location="none"></pfv6-progress>`);
      const status = el.shadowRoot!.querySelector('.status');
      expect(status).to.exist;
    });
  });

  describe('title truncation', function() {
    it('makes title focusable when truncation is enabled', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test" is-title-truncated></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title');
      expect(titleEl?.getAttribute('tabindex')).to.equal('0');
    });

    it('does not make title focusable when truncation is disabled', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test"></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title');
      expect(titleEl?.hasAttribute('tabindex')).to.be.false;
    });

    it('sets aria-hidden on non-truncated title', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test"></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title');
      expect(titleEl?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('does not set aria-hidden on truncated title', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test" is-title-truncated></pfv6-progress>`);
      const titleEl = el.shadowRoot!.querySelector('.title');
      expect(titleEl?.hasAttribute('aria-hidden')).to.be.false;
    });
  });

  describe('CSS classes', function() {
    it('applies danger class when variant is danger', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="danger"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('danger')).to.be.true;
    });

    it('applies success class when variant is success', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="success"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('success')).to.be.true;
    });

    it('applies warning class when variant is warning', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress variant="warning"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.true;
    });

    it('applies inside class when measureLocation is inside', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="inside"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('inside')).to.be.true;
    });

    it('applies outside class when measureLocation is outside', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="outside"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('outside')).to.be.true;
    });

    it('applies sm class when size is sm and measureLocation is not inside', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="sm"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('sm')).to.be.true;
    });

    it('does not apply sm class when size is sm but measureLocation is inside', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="sm" measure-location="inside"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('sm')).to.be.false;
    });

    it('applies lg class when size is lg and measureLocation is not inside', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress size="lg"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('lg')).to.be.true;
    });

    it('applies lg class when measureLocation is inside regardless of size', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress measure-location="inside"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('lg')).to.be.true;
    });

    it('applies singleline class when title is empty', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('singleline')).to.be.true;
    });

    it('does not apply singleline class when title is present', async function() {
      const el = await fixture<Pfv6Progress>(html`<pfv6-progress title="Test"></pfv6-progress>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('singleline')).to.be.false;
    });
  });
});

describe('<pfv6-progress-bar>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-progress-bar')).to.be.an.instanceof(Pfv6ProgressBar);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`<pfv6-progress-bar></pfv6-progress-bar>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-progress-bar'))
        .and.to.be.an.instanceOf(Pfv6ProgressBar);
    });
  });

  describe('value property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`<pfv6-progress-bar></pfv6-progress-bar>`);
      expect(el.value).to.equal(0);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`<pfv6-progress-bar value="75"></pfv6-progress-bar>`);
      expect(el.value).to.equal(75);
    });

    it('applies value as width percentage to indicator', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`<pfv6-progress-bar value="60"></pfv6-progress-bar>`);
      const indicator = el.shadowRoot!.querySelector('#indicator') as HTMLElement;
      expect(indicator?.style.width).to.equal('60%');
    });

    it('updates indicator width when value changes', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`<pfv6-progress-bar value="30"></pfv6-progress-bar>`);
      let indicator = el.shadowRoot!.querySelector('#indicator') as HTMLElement;
      expect(indicator?.style.width).to.equal('30%');

      el.value = 80;
      await el.updateComplete;
      indicator = el.shadowRoot!.querySelector('#indicator') as HTMLElement;
      expect(indicator?.style.width).to.equal('80%');
    });
  });

  describe('ElementInternals', function() {
    it('sets role to progressbar', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`<pfv6-progress-bar></pfv6-progress-bar>`);
      expect(el.getAttribute('role')).to.equal('progressbar');
    });
  });

  describe('default slot', function() {
    it('renders slotted content', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`
        <pfv6-progress-bar>
          <span>50%</span>
        </pfv6-progress-bar>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('50%');
    });

    it('renders slot inside measure span', async function() {
      const el = await fixture<Pfv6ProgressBar>(html`
        <pfv6-progress-bar>Test content</pfv6-progress-bar>
      `);
      const measure = el.shadowRoot!.querySelector('#measure slot');
      expect(measure).to.exist;
    });
  });
});

describe('<pfv6-progress-helper-text>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-progress-helper-text')).to.be.an.instanceof(Pfv6ProgressHelperText);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ProgressHelperText>(html`<pfv6-progress-helper-text></pfv6-progress-helper-text>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-progress-helper-text'))
        .and.to.be.an.instanceOf(Pfv6ProgressHelperText);
    });
  });

  describe('default slot', function() {
    it('renders slotted content', async function() {
      const el = await fixture<Pfv6ProgressHelperText>(html`
        <pfv6-progress-helper-text>
          <span>Helper text content</span>
        </pfv6-progress-helper-text>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Helper text content');
    });

    it('renders text content directly', async function() {
      const el = await fixture<Pfv6ProgressHelperText>(html`
        <pfv6-progress-helper-text>Loading data...</pfv6-progress-helper-text>
      `);
      expect(el.textContent).to.equal('Loading data...');
    });
  });
});
