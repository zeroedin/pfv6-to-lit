// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { Pfv6HelperText } from '../pfv6-helper-text.js';
import { Pfv6HelperTextItem } from '../pfv6-helper-text-item.js';
import '../pfv6-helper-text.js';
import '../pfv6-helper-text-item.js';

describe('<pfv6-helper-text>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-helper-text')).to.be.an.instanceof(Pfv6HelperText);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text></pfv6-helper-text>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-helper-text'))
          .and
          .to.be.an.instanceOf(Pfv6HelperText);
    });
  });

  describe('isLiveRegion property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text></pfv6-helper-text>`);
      expect(el.isLiveRegion).to.be.false;
    });

    it('can be set to true via attribute', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text is-live-region></pfv6-helper-text>`);
      expect(el.isLiveRegion).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text is-live-region></pfv6-helper-text>`);
      expect(el.hasAttribute('is-live-region')).to.be.true;
    });

    it('sets aria-live to "polite" when true', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text is-live-region></pfv6-helper-text>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('aria-live')).to.equal('polite');
    });

    it('sets aria-live to "off" when false', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text></pfv6-helper-text>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('aria-live')).to.equal('off');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text></pfv6-helper-text>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text accessible-label="Helper text list"></pfv6-helper-text>`);
      expect(el.accessibleLabel).to.equal('Helper text list');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text accessible-label="Helper text list"></pfv6-helper-text>`);
      expect(el.getAttribute('accessible-label')).to.equal('Helper text list');
    });

    it('sets aria-label on container', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text accessible-label="Helper text list"></pfv6-helper-text>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('aria-label')).to.equal('Helper text list');
    });

    it('sets empty aria-label when not provided', async function() {
      const el = await fixture<Pfv6HelperText>(html`<pfv6-helper-text></pfv6-helper-text>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('aria-label')).to.equal('');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6HelperText>(html`
        <pfv6-helper-text>
          <pfv6-helper-text-item>Helper text content</pfv6-helper-text-item>
        </pfv6-helper-text>
      `);
      const slotted = el.querySelector('pfv6-helper-text-item');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Helper text content');
    });

    it('renders multiple items', async function() {
      const el = await fixture<Pfv6HelperText>(html`
        <pfv6-helper-text>
          <ul>
            <li><pfv6-helper-text-item>First item</pfv6-helper-text-item></li>
            <li><pfv6-helper-text-item>Second item</pfv6-helper-text-item></li>
            <li><pfv6-helper-text-item>Third item</pfv6-helper-text-item></li>
          </ul>
        </pfv6-helper-text>
      `);
      const items = el.querySelectorAll('pfv6-helper-text-item');
      expect(items).to.have.lengthOf(3);
      expect(items[0]?.textContent).to.equal('First item');
      expect(items[1]?.textContent).to.equal('Second item');
      expect(items[2]?.textContent).to.equal('Third item');
    });
  });

  describe('React parity - combined properties', function() {
    it('renders live region with accessible label', async function() {
      const el = await fixture<Pfv6HelperText>(html`
        <pfv6-helper-text is-live-region accessible-label="Form validation messages">
          <ul>
            <li><pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item></li>
          </ul>
        </pfv6-helper-text>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.getAttribute('aria-live')).to.equal('polite');
      expect(container?.getAttribute('aria-label')).to.equal('Form validation messages');
      expect(el.isLiveRegion).to.be.true;
      expect(el.accessibleLabel).to.equal('Form validation messages');
    });
  });
});

describe('<pfv6-helper-text-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-helper-text-item')).to.be.an.instanceof(Pfv6HelperTextItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item></pfv6-helper-text-item>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-helper-text-item'))
          .and
          .to.be.an.instanceOf(Pfv6HelperTextItem);
    });
  });

  describe('variant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item></pfv6-helper-text-item>`);
      expect(el.variant).to.equal('default');
    });

    it('accepts "indeterminate" value', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="indeterminate"></pfv6-helper-text-item>`);
      expect(el.variant).to.equal('indeterminate');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="warning"></pfv6-helper-text-item>`);
      expect(el.variant).to.equal('warning');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="success"></pfv6-helper-text-item>`);
      expect(el.variant).to.equal('success');
    });

    it('accepts "error" value', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="error"></pfv6-helper-text-item>`);
      expect(el.variant).to.equal('error');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="error"></pfv6-helper-text-item>`);
      expect(el.getAttribute('variant')).to.equal('error');
    });

    it('applies warning class when variant is "warning"', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="warning"></pfv6-helper-text-item>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.true;
    });

    it('applies success class when variant is "success"', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="success"></pfv6-helper-text-item>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('success')).to.be.true;
    });

    it('applies error class when variant is "error"', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="error"></pfv6-helper-text-item>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('error')).to.be.true;
    });

    it('applies indeterminate class when variant is "indeterminate"', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item variant="indeterminate"></pfv6-helper-text-item>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('indeterminate')).to.be.true;
    });

    it('does not apply any variant classes for default variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item></pfv6-helper-text-item>`);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.false;
      expect(container?.classList.contains('success')).to.be.false;
      expect(container?.classList.contains('error')).to.be.false;
      expect(container?.classList.contains('indeterminate')).to.be.false;
    });
  });

  describe('screenReaderText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`<pfv6-helper-text-item></pfv6-helper-text-item>`);
      expect(el.screenReaderText).to.be.undefined;
    });

    it('accepts custom string value', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error" screen-reader-text="Custom error announcement">
          Error message
        </pfv6-helper-text-item>
      `);
      expect(el.screenReaderText).to.equal('Custom error announcement');
    });

    it('renders custom screen reader text for non-default variants', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error" screen-reader-text="Custom error">
          Error message
        </pfv6-helper-text-item>
      `);
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan).to.exist;
      expect(srSpan?.textContent?.trim()).to.equal(': Custom error;');
    });

    it('uses default "{variant} status" when screenReaderText not provided for non-default variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item>
      `);
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan).to.exist;
      expect(srSpan?.textContent?.trim()).to.equal(': error status;');
    });

    it('does not render screen reader text for default variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item>Default message</pfv6-helper-text-item>
      `);
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan).to.not.exist;
    });

    it('does not render screen reader text for default variant even with screenReaderText set', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item screen-reader-text="Custom text">Default message</pfv6-helper-text-item>
      `);
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan).to.not.exist;
    });
  });

  describe('default icons', function() {
    it('renders no icon for default variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item>Default text</pfv6-helper-text-item>
      `);
      const iconSlot = el.shadowRoot?.querySelector('.icon slot[name="icon"]');
      // Check that the slot's assigned content is empty (no default icon)
      expect(iconSlot?.textContent?.trim()).to.equal('');
    });

    it('renders minus icon for indeterminate variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="indeterminate">Indeterminate text</pfv6-helper-text-item>
      `);
      const svg = el.shadowRoot?.querySelector('.icon svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('viewBox')).to.equal('0 0 512 512');
      // Minus icon has a single horizontal line path
      const path = svg?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M400 288h-352');
    });

    it('renders exclamation triangle icon for warning variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="warning">Warning text</pfv6-helper-text-item>
      `);
      const svg = el.shadowRoot?.querySelector('.icon svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('viewBox')).to.equal('0 0 576 512');
      // Warning triangle has a specific path signature
      const path = svg?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M569.517 440.013');
    });

    it('renders check circle icon for success variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="success">Success text</pfv6-helper-text-item>
      `);
      const svg = el.shadowRoot?.querySelector('.icon svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('viewBox')).to.equal('0 0 512 512');
      // Check circle has a specific path signature
      const path = svg?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M256 8C119.033');
    });

    it('renders exclamation circle icon for error variant', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">Error text</pfv6-helper-text-item>
      `);
      const svg = el.shadowRoot?.querySelector('.icon svg');
      expect(svg).to.exist;
      expect(svg?.getAttribute('viewBox')).to.equal('0 0 512 512');
      // Error circle has a specific path signature
      const path = svg?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M256 8C119 8');
    });

    it('sets aria-hidden="true" on default icons', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">Error text</pfv6-helper-text-item>
      `);
      const svg = el.shadowRoot?.querySelector('.icon svg');
      expect(svg?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('sets role="img" on default icons', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">Error text</pfv6-helper-text-item>
      `);
      const svg = el.shadowRoot?.querySelector('.icon svg');
      expect(svg?.getAttribute('role')).to.equal('img');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item>Helper text content</pfv6-helper-text-item>
      `);
      expect(el.textContent).to.equal('Helper text content');
    });

    it('renders custom icon via icon slot', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">
          <svg slot="icon" id="custom-icon"><circle /></svg>
          Custom error with custom icon
        </pfv6-helper-text-item>
      `);
      const customIcon = el.querySelector('#custom-icon');
      expect(customIcon).to.exist;
      expect(customIcon?.getAttribute('slot')).to.equal('icon');
    });

    it('custom icon overrides default variant icon', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">
          <span slot="icon" id="custom">⚠️</span>
          Error text
        </pfv6-helper-text-item>
      `);
      const customIcon = el.querySelector('#custom');
      expect(customIcon).to.exist;
      // Default icon should not be rendered when custom icon is slotted
      // (the slot content takes priority)
      const iconSlot = el.shadowRoot?.querySelector('.icon slot[name="icon"]');
      expect(iconSlot).to.exist;
    });
  });

  describe('React parity - variant screen reader combinations', function() {
    it('renders warning with default screen reader text', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="warning">
          Warning message
        </pfv6-helper-text-item>
      `);
      expect(el.variant).to.equal('warning');
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan?.textContent?.trim()).to.equal(': warning status;');
    });

    it('renders success with custom screen reader text', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="success" screen-reader-text="Validation passed">
          All fields valid
        </pfv6-helper-text-item>
      `);
      expect(el.variant).to.equal('success');
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan?.textContent?.trim()).to.equal(': Validation passed;');
    });

    it('renders indeterminate with default screen reader text', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="indeterminate">
          Checking status
        </pfv6-helper-text-item>
      `);
      expect(el.variant).to.equal('indeterminate');
      const srSpan = el.shadowRoot?.querySelector('.screen-reader');
      expect(srSpan?.textContent?.trim()).to.equal(': indeterminate status;');
    });
  });

  describe('DOM structure', function() {
    it('renders container with icon and text spans', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container).to.exist;

      const iconSpan = container?.querySelector('.icon');
      expect(iconSpan).to.exist;

      const textSpan = container?.querySelector('.text');
      expect(textSpan).to.exist;
    });

    it('text span contains both content and screen reader text', async function() {
      const el = await fixture<Pfv6HelperTextItem>(html`
        <pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item>
      `);
      const textSpan = el.shadowRoot?.querySelector('.text');
      const slot = textSpan?.querySelector('slot:not([name])');
      const srSpan = textSpan?.querySelector('.screen-reader');

      expect(slot).to.exist;
      expect(srSpan).to.exist;
    });
  });
});
