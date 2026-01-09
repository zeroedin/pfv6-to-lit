import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6TextInput } from '../pfv6-text-input.js';
import '../pfv6-text-input.js';

describe('<pfv6-text-input>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-text-input')).to.be.an.instanceof(Pfv6TextInput);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-text-input'))
          .and
          .to.be.an.instanceOf(Pfv6TextInput);
    });
  });

  describe('validated property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.validated).to.equal('default');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      expect(el.validated).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="warning"></pfv6-text-input>`);
      expect(el.validated).to.equal('warning');
    });

    it('accepts "error" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="error"></pfv6-text-input>`);
      expect(el.validated).to.equal('error');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="error"></pfv6-text-input>`);
      expect(el.getAttribute('validated')).to.equal('error');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.validated).to.equal('default');

      el.validated = 'error';
      await el.updateComplete;

      expect(el.validated).to.equal('error');
      expect(el.getAttribute('validated')).to.equal('error');
    });
  });

  describe('readonlyVariant property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.readonlyVariant).to.be.undefined;
    });

    it('accepts "default" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input readonly-variant="default"></pfv6-text-input>`);
      expect(el.readonlyVariant).to.equal('default');
    });

    it('accepts "plain" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input readonly-variant="plain"></pfv6-text-input>`);
      expect(el.readonlyVariant).to.equal('plain');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input readonly-variant="plain"></pfv6-text-input>`);
      expect(el.getAttribute('readonly-variant')).to.equal('plain');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.readonlyVariant).to.be.undefined;

      el.readonlyVariant = 'plain';
      await el.updateComplete;

      expect(el.readonlyVariant).to.equal('plain');
      expect(el.getAttribute('readonly-variant')).to.equal('plain');
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.isExpanded).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input is-expanded></pfv6-text-input>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input is-expanded></pfv6-text-input>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.isExpanded).to.be.false;

      el.isExpanded = true;
      await el.updateComplete;

      expect(el.isExpanded).to.be.true;
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });
  });

  describe('isStartTruncated property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.isStartTruncated).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input is-start-truncated></pfv6-text-input>`);
      expect(el.isStartTruncated).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input is-start-truncated></pfv6-text-input>`);
      expect(el.hasAttribute('is-start-truncated')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.isStartTruncated).to.be.false;

      el.isStartTruncated = true;
      await el.updateComplete;

      expect(el.isStartTruncated).to.be.true;
      expect(el.hasAttribute('is-start-truncated')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot for input element', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text" value="test input">
        </pfv6-text-input>
      `);
      const slottedInput = el.querySelector('input');
      expect(slottedInput).to.exist;
      expect(slottedInput?.value).to.equal('test input');
    });

    it('renders custom-icon slot', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
          <svg slot="custom-icon" aria-hidden="true">
            <path d="test"></path>
          </svg>
        </pfv6-text-input>
      `);
      const customIcon = el.querySelector('[slot="custom-icon"]');
      expect(customIcon).to.exist;
      expect(customIcon?.tagName).to.equal('SVG');
    });

    it('renders both input and custom-icon slots independently', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text" value="test">
          <svg slot="custom-icon" aria-hidden="true"></svg>
        </pfv6-text-input>
      `);
      const input = el.querySelector('input');
      const icon = el.querySelector('[slot="custom-icon"]');
      expect(input).to.exist;
      expect(icon).to.exist;
    });
  });

  describe('validated state synchronization', function() {
    it('sets aria-invalid on slotted input when validated is error', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).to.equal('true');
    });

    it('removes aria-invalid from slotted input when validated is not error', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.hasAttribute('aria-invalid')).to.be.false;
    });

    it('updates aria-invalid when validated changes to error', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.hasAttribute('aria-invalid')).to.be.false;

      el.validated = 'error';
      await el.updateComplete;

      expect(input?.getAttribute('aria-invalid')).to.equal('true');
    });

    it('removes aria-invalid when validated changes from error to success', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).to.equal('true');

      el.validated = 'success';
      await el.updateComplete;

      expect(input?.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('readonly state synchronization', function() {
    it('sets readonly on slotted input when readonlyVariant is set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input readonly-variant="default">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).to.be.true;
    });

    it('sets readonly on slotted input when readonlyVariant is plain', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input readonly-variant="plain">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).to.be.true;
    });

    it('does not set readonly when readonlyVariant is undefined', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).to.be.false;
    });

    it('updates readonly when readonlyVariant changes', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).to.be.false;

      el.readonlyVariant = 'default';
      await el.updateComplete;

      expect(input.readOnly).to.be.true;
    });

    it('removes readonly when readonlyVariant is cleared', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input readonly-variant="default">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).to.be.true;

      el.readonlyVariant = undefined;
      await el.updateComplete;

      expect(input.readOnly).to.be.false;
    });
  });

  describe('validation status icons', function() {
    it('renders success icon when validated is success', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const statusIcon = el.shadowRoot!.querySelector('.status');
      expect(statusIcon).to.exist;
      const svg = statusIcon?.querySelector('svg');
      expect(svg).to.exist;
    });

    it('renders error icon when validated is error', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const statusIcon = el.shadowRoot!.querySelector('.status');
      expect(statusIcon).to.exist;
      const svg = statusIcon?.querySelector('svg');
      expect(svg).to.exist;
    });

    it('renders warning icon when validated is warning', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="warning">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const statusIcon = el.shadowRoot!.querySelector('.status');
      expect(statusIcon).to.exist;
      const svg = statusIcon?.querySelector('svg');
      expect(svg).to.exist;
    });

    it('does not render status icon when validated is default', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const statusIcon = el.shadowRoot!.querySelector('.status');
      expect(statusIcon).to.not.exist;
    });

    it('status icons have aria-hidden', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const svg = el.shadowRoot!.querySelector('.status svg');
      expect(svg?.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('custom icon rendering', function() {
    it('renders custom icon when provided', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
          <svg slot="custom-icon" aria-hidden="true"></svg>
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const iconSlot = el.shadowRoot!.querySelector('slot[name="custom-icon"]');
      expect(iconSlot).to.exist;
    });

    it('renders both custom icon and status icon', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error">
          <input type="text">
          <svg slot="custom-icon" aria-hidden="true"></svg>
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const customIconSlot = el.shadowRoot!.querySelector('slot[name="custom-icon"]');
      const statusIcon = el.shadowRoot!.querySelector('.status');
      expect(customIconSlot).to.exist;
      expect(statusIcon).to.exist;
    });
  });

  describe('container classes', function() {
    it('applies readonly class when readonlyVariant is set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input readonly-variant="default">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('readonly')).to.be.true;
    });

    it('applies plain class when readonlyVariant is plain', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input readonly-variant="plain">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('plain')).to.be.true;
    });

    it('applies expanded class when isExpanded is true', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input is-expanded>
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('expanded')).to.be.true;
    });

    it('applies success class when validated is success', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('success')).to.be.true;
    });

    it('applies error class when validated is error', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('error')).to.be.true;
    });

    it('applies warning class when validated is warning', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="warning">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.true;
    });

    it('applies icon class when status icon is present', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('icon')).to.be.true;
    });

    it('applies icon class when custom icon is present', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
          <svg slot="custom-icon" aria-hidden="true"></svg>
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('icon')).to.be.true;
    });
  });

  describe('combined properties', function() {
    it('can have error validation and readonly variant', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error" readonly-variant="default">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
      expect(input.readOnly).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('error')).to.be.true;
      expect(container?.classList.contains('readonly')).to.be.true;
    });

    it('can have warning validation with custom icon', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="warning">
          <input type="text">
          <svg slot="custom-icon" aria-hidden="true"></svg>
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.true;
      expect(container?.classList.contains('icon')).to.be.true;

      const customIconSlot = el.shadowRoot!.querySelector('slot[name="custom-icon"]');
      const statusIcon = el.shadowRoot!.querySelector('.status');
      expect(customIconSlot).to.exist;
      expect(statusIcon).to.exist;
    });

    it('can be expanded with plain readonly variant', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input is-expanded readonly-variant="plain">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('expanded')).to.be.true;
      expect(container?.classList.contains('plain')).to.be.true;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container?.tagName).to.equal('SPAN');
    });

    it('renders default slot for input', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('renders utilities span when icon present', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const utilities = el.shadowRoot!.querySelector('.utilities');
      expect(utilities).to.exist;
      expect(utilities?.tagName).to.equal('SPAN');
    });

    it('does not render utilities span when no icon', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const utilities = el.shadowRoot!.querySelector('.utilities');
      expect(utilities).to.not.exist;
    });
  });

  describe('accessibility', function() {
    it('aria-invalid is set on slotted input for error state', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error">
          <input type="text" aria-label="test input">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).to.equal('true');
    });

    it('aria-invalid is not set for success state', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success">
          <input type="text" aria-label="test input">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.hasAttribute('aria-invalid')).to.be.false;
    });

    it('aria-invalid is not set for warning state', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="warning">
          <input type="text" aria-label="test input">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input?.hasAttribute('aria-invalid')).to.be.false;
    });

    it('slotted input can have aria-label', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input type="text" aria-label="Enter username">
        </pfv6-text-input>
      `);

      const input = el.querySelector('input');
      expect(input?.getAttribute('aria-label')).to.equal('Enter username');
    });
  });
});
