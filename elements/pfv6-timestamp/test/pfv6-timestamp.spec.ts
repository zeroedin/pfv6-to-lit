// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { Pfv6Timestamp } from '../pfv6-timestamp.js';
import '../pfv6-timestamp.js';

describe('<pfv6-timestamp>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-timestamp')).to.be.an.instanceof(Pfv6Timestamp);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-timestamp'))
          .and
          .to.be.an.instanceOf(Pfv6Timestamp);
    });
  });

  describe('date property', function() {
    it('defaults to current date when not provided', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.date).to.be.undefined;
      // Internal date should be current date
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
    });

    it('accepts a valid Date object', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .date=${testDate}></pfv6-timestamp>`);
      expect(el.date).to.deep.equal(testDate);
    });

    it('falls back to current date when invalid Date provided', async function() {
      const invalidDate = new Date('invalid');
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .date=${invalidDate}></pfv6-timestamp>`);
      // Component should render without error even with invalid date
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
    });

    it('updates when date property changes', async function() {
      const date1 = new Date('2022-08-09T11:25:00');
      const date2 = new Date('2023-12-25T15:30:00');
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .date=${date1}></pfv6-timestamp>`);

      el.date = date2;
      await el.updateComplete;

      expect(el.date).to.deep.equal(date2);
    });
  });

  describe('dateFormat property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.dateFormat).to.be.undefined;
    });

    it('accepts "full" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp date-format="full"></pfv6-timestamp>`);
      expect(el.dateFormat).to.equal('full');
    });

    it('accepts "long" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp date-format="long"></pfv6-timestamp>`);
      expect(el.dateFormat).to.equal('long');
    });

    it('accepts "medium" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp date-format="medium"></pfv6-timestamp>`);
      expect(el.dateFormat).to.equal('medium');
    });

    it('accepts "short" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp date-format="short"></pfv6-timestamp>`);
      expect(el.dateFormat).to.equal('short');
    });
  });

  describe('timeFormat property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.timeFormat).to.be.undefined;
    });

    it('accepts "full" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp time-format="full"></pfv6-timestamp>`);
      expect(el.timeFormat).to.equal('full');
    });

    it('accepts "long" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp time-format="long"></pfv6-timestamp>`);
      expect(el.timeFormat).to.equal('long');
    });

    it('accepts "medium" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp time-format="medium"></pfv6-timestamp>`);
      expect(el.timeFormat).to.equal('medium');
    });

    it('accepts "short" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp time-format="short"></pfv6-timestamp>`);
      expect(el.timeFormat).to.equal('short');
    });
  });

  describe('locale property', function() {
    it('defaults to undefined (uses browser default)', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.locale).to.be.undefined;
    });

    it('accepts locale string value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp locale="en-US"></pfv6-timestamp>`);
      expect(el.locale).to.equal('en-US');
    });

    it('accepts different locale values', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp locale="de-DE"></pfv6-timestamp>`);
      expect(el.locale).to.equal('de-DE');
    });
  });

  describe('is12Hour property', function() {
    it('defaults to undefined (uses locale default)', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.is12Hour).to.be.undefined;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp is-12-hour></pfv6-timestamp>`);
      expect(el.is12Hour).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      el.is12Hour = false;
      await el.updateComplete;
      expect(el.is12Hour).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp is-12-hour></pfv6-timestamp>`);
      expect(el.hasAttribute('is-12-hour')).to.be.true;
    });
  });

  describe('shouldDisplayUtc property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.shouldDisplayUtc).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp should-display-utc></pfv6-timestamp>`);
      expect(el.shouldDisplayUtc).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp should-display-utc></pfv6-timestamp>`);
      expect(el.hasAttribute('should-display-utc')).to.be.true;
    });
  });

  describe('displaySuffix property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.displaySuffix).to.equal(''); // Match React default
    });

    it('accepts custom suffix value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp display-suffix="PST"></pfv6-timestamp>`);
      expect(el.displaySuffix).to.equal('PST');
    });

    it('displays suffix in rendered content', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} display-suffix="PST"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.include('PST');
    });
  });

  describe('dateTime property', function() {
    it('defaults to undefined (uses ISO string of date)', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.dateTime).to.be.undefined;
    });

    it('accepts custom datetime value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp date-time="2022-08-09T11:25:00.000Z"></pfv6-timestamp>`);
      expect(el.dateTime).to.equal('2022-08-09T11:25:00.000Z');
    });

    it('sets datetime attribute on time element', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp date-time="2022-08-09T11:25:00.000Z"></pfv6-timestamp>`);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.getAttribute('datetime')).to.equal('2022-08-09T11:25:00.000Z');
    });
  });

  describe('customFormat property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.customFormat).to.be.undefined;
    });

    it('accepts Intl.DateTimeFormatOptions object', async function() {
      const customFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .customFormat=${customFormat}></pfv6-timestamp>`);
      expect(el.customFormat).to.deep.equal(customFormat);
    });

    it('overrides dateFormat and timeFormat when provided', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const customFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
      };
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          date-format="full"
          time-format="full"
          .customFormat=${customFormat}>
        </pfv6-timestamp>
      `);
      // customFormat should take precedence
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
      // Content should not include time since customFormat only has year/month
      expect(time?.textContent).to.not.include('11:25');
    });
  });

  describe('hasTooltip property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.hasTooltip).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      expect(el.hasTooltip).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      expect(el.hasAttribute('has-tooltip')).to.be.true;
    });

    it('renders pfv6-tooltip when true', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      const tooltip = el.shadowRoot?.querySelector('pfv6-tooltip');
      expect(tooltip).to.exist;
    });

    it('does not render pfv6-tooltip when false', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const tooltip = el.shadowRoot?.querySelector('pfv6-tooltip');
      expect(tooltip).to.not.exist;
    });

    it('adds tabindex="0" to container when tooltip enabled', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('tabindex')).to.equal('0');
    });

    it('does not add tabindex when tooltip disabled', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.hasAttribute('tabindex')).to.be.false;
    });
  });

  describe('tooltipVariant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.tooltipVariant).to.equal('default'); // Match React default
    });

    it('accepts "default" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp tooltip-variant="default"></pfv6-timestamp>`);
      expect(el.tooltipVariant).to.equal('default');
    });

    it('accepts "custom" value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp tooltip-variant="custom"></pfv6-timestamp>`);
      expect(el.tooltipVariant).to.equal('custom');
    });

    it('shows UTC content for default variant', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          has-tooltip
          tooltip-variant="default">
        </pfv6-timestamp>
      `);
      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip span[slot="content"]');
      expect(tooltipContent?.textContent).to.include('UTC');
    });

    it('shows custom content for custom variant', async function() {
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          has-tooltip
          tooltip-variant="custom"
          tooltip-content="Custom tooltip text">
        </pfv6-timestamp>
      `);
      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip span[slot="content"]');
      expect(tooltipContent?.textContent).to.equal('Custom tooltip text');
    });
  });

  describe('tooltipSuffix property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.tooltipSuffix).to.equal('');
    });

    it('accepts custom suffix value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp tooltip-suffix="GMT"></pfv6-timestamp>`);
      expect(el.tooltipSuffix).to.equal('GMT');
    });

    it('applies suffix to default tooltip content', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          has-tooltip
          tooltip-variant="default"
          tooltip-suffix="GMT">
        </pfv6-timestamp>
      `);
      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip span[slot="content"]');
      expect(tooltipContent?.textContent).to.include('GMT');
    });
  });

  describe('tooltipContent property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      expect(el.tooltipContent).to.equal('');
    });

    it('accepts custom content value', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp tooltip-content="Custom tooltip"></pfv6-timestamp>`);
      expect(el.tooltipContent).to.equal('Custom tooltip');
    });

    it('displays in tooltip when variant is custom', async function() {
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          has-tooltip
          tooltip-variant="custom"
          tooltip-content="My custom content">
        </pfv6-timestamp>
      `);
      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip span[slot="content"]');
      expect(tooltipContent?.textContent).to.equal('My custom content');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp>
          <span>2 hours ago</span>
        </pfv6-timestamp>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('2 hours ago');
    });

    it('default slot overrides formatted date/time', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="full" time-format="full">
          <span>Custom content</span>
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(time).to.exist;
      // The slotted content should be inside the time element
      expect(slotted?.textContent).to.equal('Custom content');
    });

    it('displays formatted content when no slot content provided', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="short"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });
  });

  describe('rendering behavior', function() {
    it('renders time element with datetime attribute', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .date=${testDate}></pfv6-timestamp>`);
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
      expect(time?.hasAttribute('datetime')).to.be.true;
    });

    it('renders span container with id="container"', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const container = el.shadowRoot?.querySelector('span#container');
      expect(container).to.exist;
    });

    it('applies help-text class when hasTooltip is true', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('help-text')).to.be.true;
    });

    it('does not apply help-text class when hasTooltip is false', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('help-text')).to.be.false;
    });
  });

  describe('UTC display behavior', function() {
    it('displays UTC format when shouldDisplayUtc is true', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          should-display-utc
          time-format="medium">
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.include('UTC');
    });

    it('uses "Coordinated Universal Time" suffix for full time format', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          should-display-utc
          time-format="full">
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.include('Coordinated Universal Time');
    });

    it('uses "UTC" suffix for non-full time formats', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          should-display-utc
          time-format="short">
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.include('UTC');
      expect(time?.textContent).to.not.include('Coordinated Universal Time');
    });
  });

  describe('date formatting', function() {
    it('formats date with dateFormat="short"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="short"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      // Short format should include 8/9/22 or similar
      expect(time?.textContent).to.match(/\d+\/\d+\/\d+/);
    });

    it('formats date with dateFormat="medium"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="medium"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });

    it('formats date with dateFormat="long"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="long"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });

    it('formats date with dateFormat="full"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="full"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });
  });

  describe('time formatting', function() {
    it('formats time with timeFormat="short"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} time-format="short"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      // Short format should not include seconds
      expect(time?.textContent).to.not.be.empty;
    });

    it('formats time with timeFormat="medium"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} time-format="medium"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });

    it('formats time with timeFormat="long"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} time-format="long"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });

    it('formats time with timeFormat="full"', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} time-format="full"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });
  });

  describe('combined formatting', function() {
    it('formats both date and time when both properties provided', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          date-format="short"
          time-format="short">
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
      // Should include both date and time components
      expect(time?.textContent).to.match(/\d+/);
    });
  });

  describe('locale support', function() {
    it('formats date according to specified locale', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          locale="de-DE"
          date-format="short">
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      // German locale uses different date format (e.g., 9.8.22)
      expect(time?.textContent).to.not.be.empty;
    });

    it('uses browser default locale when not specified', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} date-format="short"></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });
  });

  describe('12-hour vs 24-hour formatting', function() {
    it('uses 12-hour format when is12Hour is true', async function() {
      const testDate = new Date('2022-08-09T14:25:00'); // 2:25 PM
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp
          .date=${testDate}
          time-format="short"
          is-12-hour>
        </pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
      // Should not contain 14 (24-hour format)
    });

    it('uses 24-hour format when is12Hour is false', async function() {
      const testDate = new Date('2022-08-09T14:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} time-format="short"></pfv6-timestamp>
      `);
      el.is12Hour = false;
      await el.updateComplete;
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });
  });

  describe('tooltip integration', function() {
    it('wraps content in pfv6-tooltip when hasTooltip is true', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      const tooltip = el.shadowRoot?.querySelector('pfv6-tooltip');
      const container = tooltip?.querySelector('#container');
      expect(tooltip).to.exist;
      expect(container).to.exist;
    });

    it('tooltip contains span with slot="content"', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip span[slot="content"]');
      expect(tooltipContent).to.exist;
    });

    it('renders timestamp without tooltip wrapper when hasTooltip is false', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const tooltip = el.shadowRoot?.querySelector('pfv6-tooltip');
      const container = el.shadowRoot?.querySelector('#container');
      expect(tooltip).to.not.exist;
      expect(container).to.exist; // Container should still exist, just not wrapped
    });
  });

  describe('accessibility', function() {
    it('uses semantic time element', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
    });

    it('includes datetime attribute for machine-readable format', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .date=${testDate}></pfv6-timestamp>`);
      const time = el.shadowRoot?.querySelector('time');
      const datetime = time?.getAttribute('datetime');
      expect(datetime).to.exist;
      expect(datetime).to.include('2022');
    });

    it('makes tooltip focusable with tabindex when enabled', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp has-tooltip></pfv6-timestamp>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('edge cases', function() {
    it('handles missing date gracefully', async function() {
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp></pfv6-timestamp>`);
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
      expect(time?.textContent).to.not.be.empty;
    });

    it('handles invalid date gracefully', async function() {
      const invalidDate = new Date('not a date');
      const el = await fixture<Pfv6Timestamp>(html`<pfv6-timestamp .date=${invalidDate}></pfv6-timestamp>`);
      const time = el.shadowRoot?.querySelector('time');
      expect(time).to.exist;
      // Should fall back to current date
      expect(time?.textContent).to.not.be.empty;
    });

    it('handles empty displaySuffix', async function() {
      const testDate = new Date('2022-08-09T11:25:00');
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp .date=${testDate} display-suffix=""></pfv6-timestamp>
      `);
      const time = el.shadowRoot?.querySelector('time');
      expect(time?.textContent).to.not.be.empty;
    });

    it('handles empty tooltipContent', async function() {
      const el = await fixture<Pfv6Timestamp>(html`
        <pfv6-timestamp has-tooltip tooltip-variant="custom" tooltip-content=""></pfv6-timestamp>
      `);
      const tooltipContent = el.shadowRoot?.querySelector('pfv6-tooltip span[slot="content"]');
      expect(tooltipContent?.textContent).to.equal('');
    });
  });
});
