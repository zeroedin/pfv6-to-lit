import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Truncate } from '../pfv6-truncate.js';
import '../pfv6-truncate.js';

describe('<pfv6-truncate>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-truncate')).to.be.an.instanceof(Pfv6Truncate);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-truncate'))
          .and
          .to.be.an.instanceOf(Pfv6Truncate);
    });
  });

  describe('content property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.content).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="test content"></pfv6-truncate>`
      );
      expect(el.content).to.equal('test content');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="initial"></pfv6-truncate>`
      );
      expect(el.content).to.equal('initial');

      el.content = 'updated';
      await el.updateComplete;

      expect(el.content).to.equal('updated');
    });

    it('renders content in tooltip when truncated', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="test content"></pfv6-truncate>`
      );
      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip!.content).to.equal('test content');
    });
  });

  describe('href property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.href).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate href="https://example.com"></pfv6-truncate>`
      );
      expect(el.href).to.equal('https://example.com');
    });

    it('renders anchor element when href is provided', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate href="#test" content="Link text"></pfv6-truncate>`
      );
      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor).to.exist;
      expect(anchor!.href).to.contain('#test');
    });

    it('renders span element when href is not provided', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="Plain text"></pfv6-truncate>`
      );
      const wrapper = el.shadowRoot!.querySelector('#wrapper');
      // Should have a span child, not an anchor
      const anchor = wrapper!.querySelector('a');
      expect(anchor).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="test"></pfv6-truncate>`
      );
      expect(el.href).to.be.undefined;

      el.href = 'https://example.com';
      await el.updateComplete;

      expect(el.href).to.equal('https://example.com');
      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor).to.exist;
    });
  });

  describe('trailingNumChars property', function() {
    it('defaults to 7', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.trailingNumChars).to.equal(7);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate trailing-num-chars="10"></pfv6-truncate>`
      );
      expect(el.trailingNumChars).to.equal(10);
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate trailing-num-chars="7"></pfv6-truncate>`
      );
      expect(el.trailingNumChars).to.equal(7);

      el.trailingNumChars = 15;
      await el.updateComplete;

      expect(el.trailingNumChars).to.equal(15);
    });
  });

  describe('maxCharsDisplayed property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.maxCharsDisplayed).to.be.undefined;
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate max-chars-displayed="15"></pfv6-truncate>`
      );
      expect(el.maxCharsDisplayed).to.equal(15);
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate></pfv6-truncate>`
      );
      expect(el.maxCharsDisplayed).to.be.undefined;

      el.maxCharsDisplayed = 20;
      await el.updateComplete;

      expect(el.maxCharsDisplayed).to.equal(20);
    });

    it('enables character-based truncation when set', async function() {
      const longContent = 'This is a very long string that exceeds the max characters';
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="15"
          content=${longContent}
        ></pfv6-truncate>`
      );

      // Should have the fixed class when using max chars
      const container = el.shadowRoot!.querySelector('.fixed');
      expect(container).to.exist;
    });
  });

  describe('omissionContent property', function() {
    it('defaults to ellipsis character (\\u2026)', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.omissionContent).to.equal('\u2026');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate omission-content="..."></pfv6-truncate>`
      );
      expect(el.omissionContent).to.equal('...');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate></pfv6-truncate>`
      );
      expect(el.omissionContent).to.equal('\u2026');

      el.omissionContent = '---';
      await el.updateComplete;

      expect(el.omissionContent).to.equal('---');
    });

    it('renders custom omission content when truncated', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          omission-content="..."
          content="This is a long text"
        ></pfv6-truncate>`
      );

      const omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.exist;
      expect(omission!.textContent).to.equal('...');
    });
  });

  describe('position property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.position).to.equal('end');
    });

    it('accepts "start" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate position="start"></pfv6-truncate>`
      );
      expect(el.position).to.equal('start');
    });

    it('accepts "middle" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate position="middle"></pfv6-truncate>`
      );
      expect(el.position).to.equal('middle');
    });

    it('accepts "end" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate position="end"></pfv6-truncate>`
      );
      expect(el.position).to.equal('end');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate position="middle"></pfv6-truncate>`
      );
      expect(el.getAttribute('position')).to.equal('middle');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate position="end"></pfv6-truncate>`
      );
      expect(el.position).to.equal('end');

      el.position = 'start';
      await el.updateComplete;

      expect(el.position).to.equal('start');
      expect(el.getAttribute('position')).to.equal('start');
    });
  });

  describe('tooltipPosition property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6Truncate>(html`<pfv6-truncate></pfv6-truncate>`);
      expect(el.tooltipPosition).to.equal('top');
    });

    it('accepts "auto" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="auto"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('auto');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="bottom"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('bottom');
    });

    it('accepts "left" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="left"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('left');
    });

    it('accepts "right" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="right"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('right');
    });

    it('accepts "top-start" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="top-start"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('top-start');
    });

    it('accepts "top-end" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="top-end"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('top-end');
    });

    it('accepts "bottom-start" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="bottom-start"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('bottom-start');
    });

    it('accepts "bottom-end" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="bottom-end"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('bottom-end');
    });

    it('accepts "left-start" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="left-start"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('left-start');
    });

    it('accepts "left-end" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="left-end"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('left-end');
    });

    it('accepts "right-start" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="right-start"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('right-start');
    });

    it('accepts "right-end" value', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="right-end"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('right-end');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="bottom"></pfv6-truncate>`
      );
      expect(el.getAttribute('tooltip-position')).to.equal('bottom');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate tooltip-position="top"></pfv6-truncate>`
      );
      expect(el.tooltipPosition).to.equal('top');

      el.tooltipPosition = 'bottom';
      await el.updateComplete;

      expect(el.tooltipPosition).to.equal('bottom');
      expect(el.getAttribute('tooltip-position')).to.equal('bottom');
    });

    it('passes position to tooltip component', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          tooltip-position="left"
          content="test"
        ></pfv6-truncate>`
      );

      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip!.getAttribute('position')).to.equal('left');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders wrapper element', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="test"></pfv6-truncate>`
      );
      const wrapper = el.shadowRoot!.querySelector('#wrapper');
      expect(wrapper).to.exist;
      expect(wrapper!.tagName).to.equal('SPAN');
    });

    it('wrapper has container class', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate content="test"></pfv6-truncate>`
      );
      const wrapper = el.shadowRoot!.querySelector('#wrapper');
      expect(wrapper!.classList.contains('container')).to.be.true;
    });
  });

  describe('tooltip rendering', function() {
    it('renders tooltip when content is truncated', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          content="This is a very long text that should be truncated"
        ></pfv6-truncate>`
      );

      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip).to.exist;
    });

    it('tooltip contains full content', async function() {
      const fullContent = 'This is a very long text that should be truncated';
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          content=${fullContent}
        ></pfv6-truncate>`
      );

      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip!.content).to.equal(fullContent);
    });

    it('tooltip has hidden attribute when content is not truncated', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="100"
          content="Short"
        ></pfv6-truncate>`
      );

      // When content is short, should not render tooltip
      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip).to.not.exist;
    });
  });

  describe('truncation behavior - max chars mode', function() {
    it('truncates at end position', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="15"
          position="end"
          content="This is a very long text that should be truncated"
        ></pfv6-truncate>`
      );

      const textElement = el.shadowRoot!.querySelector('.text');
      expect(textElement).to.exist;
      // First 15 characters
      expect(textElement!.textContent).to.equal('This is a very ');
    });

    it('truncates at start position', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="15"
          position="start"
          content="This is a very long text that should be truncated"
        ></pfv6-truncate>`
      );

      const textElement = el.shadowRoot!.querySelector('.text');
      expect(textElement).to.exist;
      // Last 15 characters
      expect(textElement!.textContent).to.equal('ld be truncated');
    });

    it('truncates at middle position', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="20"
          position="middle"
          content="This is a very long text that should be truncated"
        ></pfv6-truncate>`
      );

      const textElements = el.shadowRoot!.querySelectorAll('.text');
      expect(textElements.length).to.be.greaterThan(0);
    });

    it('shows omission content when truncated', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="15"
          content="This is a very long text"
        ></pfv6-truncate>`
      );

      const omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.exist;
      expect(omission!.textContent).to.equal('\u2026');
    });

    it('hides truncated content in screen reader text', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="15"
          position="end"
          content="This is a very long text that should be truncated"
        ></pfv6-truncate>`
      );

      const srText = el.shadowRoot!.querySelector('.pf-v6-screen-reader');
      expect(srText).to.exist;
      // Should contain the hidden part
      expect(srText!.textContent).to.include('long text');
    });
  });

  describe('combined properties', function() {
    it('works with href and max-chars-displayed', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          href="#test"
          max-chars-displayed="15"
          content="This is a very long link text"
        ></pfv6-truncate>`
      );

      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor).to.exist;
      expect(anchor!.href).to.include('#test');

      const omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.exist;
    });

    it('works with all position variants and href', async function() {
      const positions: ('start' | 'middle' | 'end')[] = ['start', 'middle', 'end'];

      for (const position of positions) {
        const el = await fixture<Pfv6Truncate>(
          html`<pfv6-truncate
            position=${position}
            href="#test"
            content="Link text"
          ></pfv6-truncate>`
        );

        const anchor = el.shadowRoot!.querySelector('a');
        expect(anchor).to.exist;
        expect(el.position).to.equal(position);
      }
    });

    it('works with custom omission and tooltip position', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          omission-content="..."
          tooltip-position="bottom"
          content="This is a long text"
        ></pfv6-truncate>`
      );

      const omission = el.shadowRoot!.querySelector('.omission');
      expect(omission!.textContent).to.equal('...');

      const tooltip = el.shadowRoot!.querySelector('pfv6-tooltip');
      expect(tooltip!.getAttribute('position')).to.equal('bottom');
    });
  });

  describe('accessibility', function() {
    it('adds tabindex when truncated and not a link', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          content="This is a long text"
        ></pfv6-truncate>`
      );

      const truncateBody = el.shadowRoot!.querySelector('span:not(#wrapper)');
      expect(truncateBody!.getAttribute('tabindex')).to.equal('0');
    });

    it('does not add tabindex when not truncated', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="100"
          content="Short"
        ></pfv6-truncate>`
      );

      const truncateBody = el.shadowRoot!.querySelector('span:not(#wrapper):not(.text)');
      expect(truncateBody!.hasAttribute('tabindex')).to.be.false;
    });

    it('omission content is aria-hidden', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          content="This is a long text"
        ></pfv6-truncate>`
      );

      const omission = el.shadowRoot!.querySelector('.omission');
      expect(omission!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('screen reader text has proper class', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          position="end"
          content="This is a long text"
        ></pfv6-truncate>`
      );

      const srText = el.shadowRoot!.querySelector('.pf-v6-screen-reader');
      expect(srText).to.exist;
    });
  });

  describe('dynamic updates', function() {
    it('updates truncation when content changes', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="10"
          content="Short"
        ></pfv6-truncate>`
      );

      // Initially not truncated
      let omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.not.exist;

      el.content = 'This is a very long text that will be truncated';
      await el.updateComplete;

      // Now truncated
      omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.exist;
    });

    it('updates truncation when maxCharsDisplayed changes', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="50"
          content="This is a long text"
        ></pfv6-truncate>`
      );

      // Initially not truncated (50 > 19 chars)
      let omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.not.exist;

      el.maxCharsDisplayed = 10;
      await el.updateComplete;

      // Now truncated
      omission = el.shadowRoot!.querySelector('.omission');
      expect(omission).to.exist;
    });

    it('updates position dynamically', async function() {
      const el = await fixture<Pfv6Truncate>(
        html`<pfv6-truncate
          max-chars-displayed="15"
          position="end"
          content="This is a very long text"
        ></pfv6-truncate>`
      );

      expect(el.position).to.equal('end');
      expect(el.getAttribute('position')).to.equal('end');

      el.position = 'start';
      await el.updateComplete;

      expect(el.position).to.equal('start');
      expect(el.getAttribute('position')).to.equal('start');
    });
  });
});
