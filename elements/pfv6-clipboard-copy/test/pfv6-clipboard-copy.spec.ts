// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6ClipboardCopy, Pfv6ClipboardCopyCopyEvent, Pfv6ClipboardCopyChangeEvent, Pfv6ClipboardCopyExpandEvent } from '../pfv6-clipboard-copy.js';
import { Pfv6ClipboardCopyButton } from '../pfv6-clipboard-copy-button.js';
import { Pfv6ClipboardCopyToggle } from '../pfv6-clipboard-copy-toggle.js';
import { Pfv6ClipboardCopyExpanded, Pfv6ClipboardCopyExpandedChangeEvent } from '../pfv6-clipboard-copy-expanded.js';
import { Pfv6ClipboardCopyAction } from '../pfv6-clipboard-copy-action.js';
import '../pfv6-clipboard-copy.js';
import '../pfv6-clipboard-copy-button.js';
import '../pfv6-clipboard-copy-toggle.js';
import '../pfv6-clipboard-copy-expanded.js';
import '../pfv6-clipboard-copy-action.js';

describe('<pfv6-clipboard-copy>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-clipboard-copy')).to.be.an.instanceof(Pfv6ClipboardCopy);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-clipboard-copy'))
          .and
          .to.be.an.instanceOf(Pfv6ClipboardCopy);
    });
  });

  describe('variant property', function() {
    it('defaults to "inline"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.variant).to.equal('inline');
    });

    it('accepts "expansion" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy variant="expansion"></pfv6-clipboard-copy>`);
      expect(el.variant).to.equal('expansion');
    });

    it('accepts "inline-compact" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy variant="inline-compact"></pfv6-clipboard-copy>`);
      expect(el.variant).to.equal('inline-compact');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy variant="expansion"></pfv6-clipboard-copy>`);
      expect(el.getAttribute('variant')).to.equal('expansion');
    });
  });

  describe('hoverTip property', function() {
    it('defaults to "Copy to clipboard"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.hoverTip).to.equal('Copy to clipboard');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy hover-tip="Custom hover"></pfv6-clipboard-copy>`);
      expect(el.hoverTip).to.equal('Custom hover');
    });
  });

  describe('clickTip property', function() {
    it('defaults to "Successfully copied to clipboard!"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.clickTip).to.equal('Successfully copied to clipboard!');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy click-tip="Copied!"></pfv6-clipboard-copy>`);
      expect(el.clickTip).to.equal('Copied!');
    });
  });

  describe('copyAriaLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.copyAriaLabel).to.be.undefined;
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy copy-aria-label="Copy code"></pfv6-clipboard-copy>`);
      expect(el.copyAriaLabel).to.equal('Copy code');
    });
  });

  describe('textAriaLabel property', function() {
    it('defaults to "Copyable input"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.textAriaLabel).to.equal('Copyable input');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy text-aria-label="Code snippet"></pfv6-clipboard-copy>`);
      expect(el.textAriaLabel).to.equal('Code snippet');
    });
  });

  describe('toggleAriaLabel property', function() {
    it('defaults to "Show content"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.toggleAriaLabel).to.equal('Show content');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy toggle-aria-label="Expand code"></pfv6-clipboard-copy>`);
      expect(el.toggleAriaLabel).to.equal('Expand code');
    });
  });

  describe('isReadOnly property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.isReadOnly).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-read-only></pfv6-clipboard-copy>`);
      expect(el.isReadOnly).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-read-only></pfv6-clipboard-copy>`);
      expect(el.hasAttribute('is-read-only')).to.be.true;
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-expanded></pfv6-clipboard-copy>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-expanded></pfv6-clipboard-copy>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });
  });

  describe('isCode property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.isCode).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-code></pfv6-clipboard-copy>`);
      expect(el.isCode).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-code></pfv6-clipboard-copy>`);
      expect(el.hasAttribute('is-code')).to.be.true;
    });
  });

  describe('isBlock property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.isBlock).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-block></pfv6-clipboard-copy>`);
      expect(el.isBlock).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy is-block></pfv6-clipboard-copy>`);
      expect(el.hasAttribute('is-block')).to.be.true;
    });
  });

  describe('position property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.position).to.equal('top');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy position="bottom"></pfv6-clipboard-copy>`);
      expect(el.position).to.equal('bottom');
    });

    it('accepts "left" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy position="left"></pfv6-clipboard-copy>`);
      expect(el.position).to.equal('left');
    });

    it('accepts "right" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy position="right"></pfv6-clipboard-copy>`);
      expect(el.position).to.equal('right');
    });
  });

  describe('maxWidth property', function() {
    it('defaults to "150px"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.maxWidth).to.equal('150px');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy max-width="200px"></pfv6-clipboard-copy>`);
      expect(el.maxWidth).to.equal('200px');
    });
  });

  describe('exitDelay property', function() {
    it('defaults to 1500', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.exitDelay).to.equal(1500);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy exit-delay="2000"></pfv6-clipboard-copy>`);
      expect(el.exitDelay).to.equal(2000);
    });
  });

  describe('entryDelay property', function() {
    it('defaults to 300', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.entryDelay).to.equal(300);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy entry-delay="500"></pfv6-clipboard-copy>`);
      expect(el.entryDelay).to.equal(500);
    });
  });

  describe('truncation property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.truncation).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy truncation></pfv6-clipboard-copy>`);
      expect(el.truncation).to.be.true;
    });
  });

  describe('truncationPosition property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy></pfv6-clipboard-copy>`);
      expect(el.truncationPosition).to.equal('end');
    });

    it('accepts "start" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy truncation-position="start"></pfv6-clipboard-copy>`);
      expect(el.truncationPosition).to.equal('start');
    });

    it('accepts "middle" value', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`<pfv6-clipboard-copy truncation-position="middle"></pfv6-clipboard-copy>`);
      expect(el.truncationPosition).to.equal('middle');
    });
  });

  describe('copy event', function() {
    it('dispatches on copy button click', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy>Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('copy', () => {
        eventFired = true;
      });

      // Find and click the copy button
      const button = el.shadowRoot!.querySelector('pfv6-clipboard-copy-button');
      expect(button).to.exist;
      await userEvent.click(button!);

      expect(eventFired).to.be.true;
    });

    it('event contains correct text data', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy>Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6ClipboardCopyCopyEvent | undefined;
      el.addEventListener('copy', e => {
        capturedEvent = e as Pfv6ClipboardCopyCopyEvent;
      });

      const button = el.shadowRoot!.querySelector('pfv6-clipboard-copy-button');
      await userEvent.click(button!);

      expect(capturedEvent).to.be.an.instanceof(Pfv6ClipboardCopyCopyEvent);
      expect(capturedEvent!.text).to.equal('Sample text');
    });

    it('event is instance of Event (not CustomEvent)', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy>Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('copy', e => {
        capturedEvent = e;
      });

      const button = el.shadowRoot!.querySelector('pfv6-clipboard-copy-button');
      await userEvent.click(button!);

      expect(capturedEvent).to.be.an.instanceof(Event);
      expect(capturedEvent).to.be.an.instanceof(Pfv6ClipboardCopyCopyEvent);
    });
  });

  describe('change event', function() {
    it('dispatches when text input changes', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy>Initial text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input input') as HTMLInputElement;
      expect(textInput).to.exist;

      await userEvent.clear(textInput);
      await userEvent.type(textInput, 'New text');

      expect(eventFired).to.be.true;
    });

    it('event contains updated text', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy>Initial text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6ClipboardCopyChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ClipboardCopyChangeEvent;
      });

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input input') as HTMLInputElement;
      await userEvent.clear(textInput);
      await userEvent.type(textInput, 'Updated');

      expect(capturedEvent).to.be.an.instanceof(Pfv6ClipboardCopyChangeEvent);
      expect(capturedEvent!.text).to.include('Updated');
    });
  });

  describe('expand event', function() {
    it('dispatches when toggle button is clicked', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('expand', () => {
        eventFired = true;
      });

      const toggle = el.shadowRoot!.querySelector('pfv6-clipboard-copy-toggle');
      expect(toggle).to.exist;
      await userEvent.click(toggle!);

      expect(eventFired).to.be.true;
    });

    it('event contains expanded state', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6ClipboardCopyExpandEvent | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e as Pfv6ClipboardCopyExpandEvent;
      });

      const toggle = el.shadowRoot!.querySelector('pfv6-clipboard-copy-toggle');
      await userEvent.click(toggle!);

      expect(capturedEvent).to.be.an.instanceof(Pfv6ClipboardCopyExpandEvent);
      expect(capturedEvent!.expanded).to.be.true;
    });

    it('event reflects collapsed state on second click', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6ClipboardCopyExpandEvent | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e as Pfv6ClipboardCopyExpandEvent;
      });

      const toggle = el.shadowRoot!.querySelector('pfv6-clipboard-copy-toggle');

      // First click - expand
      await userEvent.click(toggle!);
      expect(capturedEvent!.expanded).to.be.true;

      // Second click - collapse
      await userEvent.click(toggle!);
      expect(capturedEvent!.expanded).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy>This is copyable text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const slotted = el.textContent?.trim();
      expect(slotted).to.equal('This is copyable text');
    });

    it('renders additional-actions slot', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="inline-compact">
          Sample text
          <pfv6-clipboard-copy-action slot="additional-actions">
            <button>Extra Action</button>
          </pfv6-clipboard-copy-action>
        </pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const action = el.querySelector('[slot="additional-actions"]');
      expect(action).to.exist;
      expect(action?.querySelector('button')?.textContent).to.equal('Extra Action');
    });
  });

  describe('variant rendering', function() {
    it('renders inline variant with text input', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="inline">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input');
      expect(textInput).to.exist;
    });

    it('renders expansion variant with toggle button', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const toggle = el.shadowRoot!.querySelector('pfv6-clipboard-copy-toggle');
      expect(toggle).to.exist;
    });

    it('renders inline-compact variant with span', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="inline-compact">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const text = el.shadowRoot!.querySelector('.text');
      expect(text).to.exist;
      expect(text?.tagName.toLowerCase()).to.equal('span');
    });

    it('renders code element when isCode is true in inline-compact', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="inline-compact" is-code>Sample code</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const code = el.shadowRoot!.querySelector('code');
      expect(code).to.exist;
    });

    it('renders truncate component when truncation is enabled', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="inline-compact" truncation>Very long text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const truncate = el.shadowRoot!.querySelector('pfv6-truncate');
      expect(truncate).to.exist;
    });
  });

  describe('expanded content', function() {
    it('shows expanded content when isExpanded is true', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion" is-expanded>Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const expanded = el.shadowRoot!.querySelector('pfv6-clipboard-copy-expanded');
      expect(expanded).to.exist;
    });

    it('hides expanded content initially when isExpanded is false', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const expanded = el.shadowRoot!.querySelector('pfv6-clipboard-copy-expanded');
      expect(expanded).to.not.exist;
    });

    it('toggles expanded content on toggle click', async function() {
      const el = await fixture<Pfv6ClipboardCopy>(html`
        <pfv6-clipboard-copy variant="expansion">Sample text</pfv6-clipboard-copy>
      `);
      await el.updateComplete;

      const toggle = el.shadowRoot!.querySelector('pfv6-clipboard-copy-toggle');
      await userEvent.click(toggle!);
      await el.updateComplete;

      const expanded = el.shadowRoot!.querySelector('pfv6-clipboard-copy-expanded');
      expect(expanded).to.exist;
    });
  });
});

describe('<pfv6-clipboard-copy-button>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-clipboard-copy-button')).to.be.an.instanceof(Pfv6ClipboardCopyButton);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-clipboard-copy-button'))
          .and
          .to.be.an.instanceOf(Pfv6ClipboardCopyButton);
    });
  });

  describe('variant property', function() {
    it('defaults to "control"', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el.variant).to.equal('control');
    });

    it('accepts "plain" value', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button variant="plain"></pfv6-clipboard-copy-button>`);
      expect(el.variant).to.equal('plain');
    });
  });

  describe('exitDelay property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el.exitDelay).to.equal(0);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button exit-delay="1000"></pfv6-clipboard-copy-button>`);
      expect(el.exitDelay).to.equal(1000);
    });
  });

  describe('entryDelay property', function() {
    it('defaults to 300', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el.entryDelay).to.equal(300);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button entry-delay="500"></pfv6-clipboard-copy-button>`);
      expect(el.entryDelay).to.equal(500);
    });
  });

  describe('maxWidth property', function() {
    it('defaults to "100px"', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el.maxWidth).to.equal('100px');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button max-width="200px"></pfv6-clipboard-copy-button>`);
      expect(el.maxWidth).to.equal('200px');
    });
  });

  describe('position property', function() {
    it('defaults to "top"', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el.position).to.equal('top');
    });

    it('accepts "bottom" value', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button position="bottom"></pfv6-clipboard-copy-button>`);
      expect(el.position).to.equal('bottom');
    });
  });

  describe('hasNoPadding property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button></pfv6-clipboard-copy-button>`);
      expect(el.hasNoPadding).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button has-no-padding></pfv6-clipboard-copy-button>`);
      expect(el.hasNoPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`<pfv6-clipboard-copy-button has-no-padding></pfv6-clipboard-copy-button>`);
      expect(el.hasAttribute('has-no-padding')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ClipboardCopyButton>(html`
        <pfv6-clipboard-copy-button>Copy tooltip text</pfv6-clipboard-copy-button>
      `);
      await el.updateComplete;

      const slotted = el.textContent?.trim();
      expect(slotted).to.equal('Copy tooltip text');
    });
  });
});

describe('<pfv6-clipboard-copy-toggle>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-clipboard-copy-toggle')).to.be.an.instanceof(Pfv6ClipboardCopyToggle);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ClipboardCopyToggle>(html`<pfv6-clipboard-copy-toggle></pfv6-clipboard-copy-toggle>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-clipboard-copy-toggle'))
          .and
          .to.be.an.instanceOf(Pfv6ClipboardCopyToggle);
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopyToggle>(html`<pfv6-clipboard-copy-toggle></pfv6-clipboard-copy-toggle>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopyToggle>(html`<pfv6-clipboard-copy-toggle is-expanded></pfv6-clipboard-copy-toggle>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopyToggle>(html`<pfv6-clipboard-copy-toggle is-expanded></pfv6-clipboard-copy-toggle>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });
  });

  describe('rendering', function() {
    it('renders button with correct aria-expanded', async function() {
      const el = await fixture<Pfv6ClipboardCopyToggle>(html`<pfv6-clipboard-copy-toggle is-expanded></pfv6-clipboard-copy-toggle>`);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button).to.exist;
      expect(button!.getAttribute('aria-expanded')).to.equal('true');
    });

    it('renders with aria-expanded false when not expanded', async function() {
      const el = await fixture<Pfv6ClipboardCopyToggle>(html`<pfv6-clipboard-copy-toggle></pfv6-clipboard-copy-toggle>`);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('aria-expanded')).to.equal('false');
    });
  });
});

describe('<pfv6-clipboard-copy-expanded>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-clipboard-copy-expanded')).to.be.an.instanceof(Pfv6ClipboardCopyExpanded);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded></pfv6-clipboard-copy-expanded>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-clipboard-copy-expanded'))
          .and
          .to.be.an.instanceOf(Pfv6ClipboardCopyExpanded);
    });
  });

  describe('isReadOnly property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded></pfv6-clipboard-copy-expanded>`);
      expect(el.isReadOnly).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded is-read-only></pfv6-clipboard-copy-expanded>`);
      expect(el.isReadOnly).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded is-read-only></pfv6-clipboard-copy-expanded>`);
      expect(el.hasAttribute('is-read-only')).to.be.true;
    });
  });

  describe('isCode property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded></pfv6-clipboard-copy-expanded>`);
      expect(el.isCode).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded is-code></pfv6-clipboard-copy-expanded>`);
      expect(el.isCode).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`<pfv6-clipboard-copy-expanded is-code></pfv6-clipboard-copy-expanded>`);
      expect(el.hasAttribute('is-code')).to.be.true;
    });
  });

  describe('change event', function() {
    it('dispatches when content is edited', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`
        <pfv6-clipboard-copy-expanded>Initial content</pfv6-clipboard-copy-expanded>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const container = el.shadowRoot!.querySelector('#container') as HTMLDivElement;
      expect(container).to.exist;

      // Simulate input event
      container.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventFired).to.be.true;
    });

    it('event contains updated text', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`
        <pfv6-clipboard-copy-expanded>Initial content</pfv6-clipboard-copy-expanded>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6ClipboardCopyExpandedChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ClipboardCopyExpandedChangeEvent;
      });

      const container = el.shadowRoot!.querySelector('#container') as HTMLDivElement;
      container.innerText = 'Updated content';
      container.dispatchEvent(new Event('input', { bubbles: true }));

      expect(capturedEvent).to.be.an.instanceof(Pfv6ClipboardCopyExpandedChangeEvent);
      expect(capturedEvent!.text).to.equal('Updated content');
    });
  });

  describe('rendering', function() {
    it('renders contenteditable container', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`
        <pfv6-clipboard-copy-expanded>Content</pfv6-clipboard-copy-expanded>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container') as HTMLDivElement;
      expect(container).to.exist;
      expect(container.getAttribute('contenteditable')).to.equal('true');
    });

    it('renders non-editable when isReadOnly is true', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`
        <pfv6-clipboard-copy-expanded is-read-only>Content</pfv6-clipboard-copy-expanded>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container') as HTMLDivElement;
      expect(container.getAttribute('contenteditable')).to.equal('false');
    });

    it('renders pre element when isCode is true', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`
        <pfv6-clipboard-copy-expanded is-code>Code content</pfv6-clipboard-copy-expanded>
      `);
      await el.updateComplete;

      const pre = el.shadowRoot!.querySelector('pre');
      expect(pre).to.exist;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ClipboardCopyExpanded>(html`
        <pfv6-clipboard-copy-expanded>Expanded content</pfv6-clipboard-copy-expanded>
      `);
      await el.updateComplete;

      const slotted = el.textContent?.trim();
      expect(slotted).to.equal('Expanded content');
    });
  });
});

describe('<pfv6-clipboard-copy-action>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-clipboard-copy-action')).to.be.an.instanceof(Pfv6ClipboardCopyAction);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ClipboardCopyAction>(html`<pfv6-clipboard-copy-action></pfv6-clipboard-copy-action>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-clipboard-copy-action'))
          .and
          .to.be.an.instanceOf(Pfv6ClipboardCopyAction);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ClipboardCopyAction>(html`
        <pfv6-clipboard-copy-action>
          <button>Action button</button>
        </pfv6-clipboard-copy-action>
      `);
      await el.updateComplete;

      const button = el.querySelector('button');
      expect(button).to.exist;
      expect(button?.textContent).to.equal('Action button');
    });
  });

  describe('rendering', function() {
    it('renders container span', async function() {
      const el = await fixture<Pfv6ClipboardCopyAction>(html`
        <pfv6-clipboard-copy-action>Content</pfv6-clipboard-copy-action>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container?.tagName.toLowerCase()).to.equal('span');
    });
  });
});
