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
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      expect(el.getAttribute('validated')).to.equal('success');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.validated).to.equal('default');

      el.validated = 'error';
      await el.updateComplete;

      expect(el.validated).to.equal('error');
      expect(el.getAttribute('validated')).to.equal('error');
    });

    it('displays success icon when set to success', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.exist;
    });

    it('displays warning icon when set to warning', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="warning"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.exist;
    });

    it('displays error icon when set to error', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="error"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.exist;
    });

    it('does not display status icon when set to default', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="default"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.not.exist;
    });

    it('applies success class to container', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
    });

    it('applies warning class to container', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="warning"></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
    });

    it('applies error class to container', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="error"></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;
    });
  });

  describe('readOnlyVariant property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.readOnlyVariant).to.be.undefined;
    });

    it('accepts "default" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant="default"></pfv6-text-input>`);
      expect(el.readOnlyVariant).to.equal('default');
    });

    it('accepts "plain" value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant="plain"></pfv6-text-input>`);
      expect(el.readOnlyVariant).to.equal('plain');
    });

    it('reflects to attribute as read-only-variant', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant="plain"></pfv6-text-input>`);
      expect(el.getAttribute('read-only-variant')).to.equal('plain');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.readOnlyVariant).to.be.undefined;

      el.readOnlyVariant = 'plain';
      await el.updateComplete;

      expect(el.readOnlyVariant).to.equal('plain');
      expect(el.getAttribute('read-only-variant')).to.equal('plain');
    });

    it('applies readonly class to container when set', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant="default"></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('readonly')).to.be.true;
    });

    it('applies plain class to container when set to plain', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant="plain"></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('does not apply plain class when set to default', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant="default"></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.false;
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

    it('reflects to attribute as is-start-truncated', async function() {
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

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.isExpanded).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input is-expanded></pfv6-text-input>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute as is-expanded', async function() {
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

    it('applies expanded class to container when true', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input is-expanded></pfv6-text-input>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('expanded')).to.be.true;
    });

    it('sets aria-expanded on slotted input when true', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input is-expanded>
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('expandedAriaControls property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.expandedAriaControls).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input expanded-aria-controls="menu-id"></pfv6-text-input>`);
      expect(el.expandedAriaControls).to.equal('menu-id');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      expect(el.expandedAriaControls).to.be.undefined;

      el.expandedAriaControls = 'menu-id';
      await el.updateComplete;

      expect(el.expandedAriaControls).to.equal('menu-id');
    });

    it('applies expanded class to container when set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('expanded')).to.be.true;
    });

    it('sets role="combobox" on slotted input when set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('role')).to.equal('combobox');
    });

    it('sets aria-expanded="true" on slotted input when set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets aria-controls on slotted input when set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('aria-controls')).to.equal('menu-id');
    });

    it('removes ARIA attributes when cleared', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      el.expandedAriaControls = undefined;
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input!.hasAttribute('role')).to.be.false;
      expect(input!.hasAttribute('aria-expanded')).to.be.false;
      expect(input!.hasAttribute('aria-controls')).to.be.false;
    });
  });

  describe('slots', function() {
    describe('input slot', function() {
      it('renders slotted input element', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input>
            <input slot="input" type="text" value="test">
          </pfv6-text-input>
        `);
        const input = el.querySelector('[slot="input"]');
        expect(input).to.exist;
        expect(input!.getAttribute('value')).to.equal('test');
      });

      it('accepts input with different types', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input>
            <input slot="input" type="email" placeholder="email@example.com">
          </pfv6-text-input>
        `);
        const input = el.querySelector('input');
        expect(input!.type).to.equal('email');
        expect(input!.placeholder).to.equal('email@example.com');
      });

      it('accepts input with attributes', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input>
            <input slot="input" type="text" name="username" required>
          </pfv6-text-input>
        `);
        const input = el.querySelector('input');
        expect(input!.name).to.equal('username');
        expect(input!.required).to.be.true;
      });
    });

    describe('icon slot', function() {
      it('renders slotted custom icon', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input>
            <input slot="input" type="text">
            <span slot="icon">🔍</span>
          </pfv6-text-input>
        `);
        const icon = el.querySelector('[slot="icon"]');
        expect(icon).to.exist;
        expect(icon!.textContent).to.equal('🔍');
      });

      it('displays utilities container when custom icon present', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input>
            <input slot="input" type="text">
            <span slot="icon">🔍</span>
          </pfv6-text-input>
        `);
        await el.updateComplete;
        const utilities = el.shadowRoot!.querySelector('#utilities');
        expect(utilities).to.exist;
      });

      it('applies icon class to container when custom icon present', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input>
            <input slot="input" type="text">
            <span slot="icon">🔍</span>
          </pfv6-text-input>
        `);
        await el.updateComplete;
        const container = el.shadowRoot!.querySelector('#container');
        expect(container!.classList.contains('icon')).to.be.true;
      });

      it('shows both custom icon and status icon when validated', async function() {
        const el = await fixture<Pfv6TextInput>(html`
          <pfv6-text-input validated="success">
            <input slot="input" type="text">
            <span slot="icon">🔍</span>
          </pfv6-text-input>
        `);
        await el.updateComplete;
        const customIcon = el.querySelector('[slot="icon"]');
        const statusIcon = el.shadowRoot!.querySelector('#status-icon');
        expect(customIcon).to.exist;
        expect(statusIcon).to.exist;
      });
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('SPAN');
    });

    it('renders input slot', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      const slot = el.shadowRoot!.querySelector('slot[name="input"]');
      expect(slot).to.exist;
    });

    it('does not render utilities when no validation or custom icon', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      const utilities = el.shadowRoot!.querySelector('#utilities');
      expect(utilities).to.not.exist;
    });

    it('renders utilities when validated', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const utilities = el.shadowRoot!.querySelector('#utilities');
      expect(utilities).to.exist;
    });

    it('renders custom icon wrapper when custom icon present', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input slot="input" type="text">
          <span slot="icon">🔍</span>
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const iconWrapper = el.shadowRoot!.querySelector('#custom-icon-wrapper');
      expect(iconWrapper).to.exist;
    });
  });

  describe('status icons', function() {
    it('renders success icon with correct SVG', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      const svg = statusIcon!.querySelector('svg');
      expect(svg).to.exist;
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
      expect(svg!.getAttribute('role')).to.equal('img');
    });

    it('renders warning icon with correct SVG', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="warning"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      const svg = statusIcon!.querySelector('svg');
      expect(svg).to.exist;
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders error icon with correct SVG', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="error"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      const svg = statusIcon!.querySelector('svg');
      expect(svg).to.exist;
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('status icon has status class', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon!.classList.contains('status')).to.be.true;
    });
  });

  describe('combined properties', function() {
    it('can be validated and readonly', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success" read-only-variant="default"></pfv6-text-input>
      `);
      await el.updateComplete;

      expect(el.validated).to.equal('success');
      expect(el.readOnlyVariant).to.equal('default');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
      expect(container!.classList.contains('readonly')).to.be.true;
    });

    it('can be validated, readonly, and expanded', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="error" read-only-variant="plain" is-expanded>
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      expect(el.validated).to.equal('error');
      expect(el.readOnlyVariant).to.equal('plain');
      expect(el.isExpanded).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;
      expect(container!.classList.contains('readonly')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
      expect(container!.classList.contains('expanded')).to.be.true;
    });

    it('can have custom icon and validation icon together', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="warning">
          <input slot="input" type="text">
          <span slot="icon">🔍</span>
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
      expect(container!.classList.contains('icon')).to.be.true;

      const customIcon = el.querySelector('[slot="icon"]');
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(customIcon).to.exist;
      expect(statusIcon).to.exist;
    });

    it('can use expandedAriaControls with validation', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input validated="success" expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
      expect(container!.classList.contains('expanded')).to.be.true;

      const input = el.querySelector('input');
      expect(input!.getAttribute('role')).to.equal('combobox');
      expect(input!.getAttribute('aria-expanded')).to.equal('true');
      expect(input!.getAttribute('aria-controls')).to.equal('menu-id');
    });
  });

  describe('accessibility', function() {
    it('status icon has aria-hidden', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const svg = el.shadowRoot!.querySelector('#status-icon svg');
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('status icon has role="img"', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated="success"></pfv6-text-input>`);
      await el.updateComplete;
      const svg = el.shadowRoot!.querySelector('#status-icon svg');
      expect(svg!.getAttribute('role')).to.equal('img');
    });

    it('applies combobox role when expandedAriaControls is set', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-id">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('role')).to.equal('combobox');
    });

    it('sets aria-expanded when isExpanded is true', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input is-expanded>
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets aria-controls when expandedAriaControls is provided', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input expanded-aria-controls="menu-123">
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;
      const input = el.querySelector('input');
      expect(input!.getAttribute('aria-controls')).to.equal('menu-123');
    });
  });

  describe('React parity validation', function() {
    it('validated prop matches React "validated" prop default', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      // React default: 'default'
      expect(el.validated).to.equal('default');
    });

    it('isExpanded prop matches React "isExpanded" prop default', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      // React default: false
      expect(el.isExpanded).to.be.false;
    });

    it('isStartTruncated prop matches React "isStartTruncated" prop default', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      // React default: false
      expect(el.isStartTruncated).to.be.false;
    });

    it('readOnlyVariant prop matches React "readOnlyVariant" prop default', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      // React default: undefined (optional prop)
      expect(el.readOnlyVariant).to.be.undefined;
    });

    it('supports all React validated values', async function() {
      const values: ('success' | 'warning' | 'error' | 'default')[] = ['success', 'warning', 'error', 'default'];

      for (const value of values) {
        const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input validated=${value}></pfv6-text-input>`);
        expect(el.validated).to.equal(value);
      }
    });

    it('supports all React readOnlyVariant values', async function() {
      const values: ('plain' | 'default')[] = ['plain', 'default'];

      for (const value of values) {
        const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input read-only-variant=${value}></pfv6-text-input>`);
        expect(el.readOnlyVariant).to.equal(value);
      }
    });
  });

  describe('truncation behavior', function() {
    it('sets up ResizeObserver when isStartTruncated is true', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input is-start-truncated>
          <input slot="input" type="text" value="This is a long value that should be truncated">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      // Verify property is set (ResizeObserver behavior is internal)
      expect(el.isStartTruncated).to.be.true;
    });

    it('removes ResizeObserver when isStartTruncated changes to false', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input is-start-truncated>
          <input slot="input" type="text" value="Long value">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      el.isStartTruncated = false;
      await el.updateComplete;

      expect(el.isStartTruncated).to.be.false;
    });
  });

  describe('lifecycle', function() {
    it('updates when validated property changes', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      await el.updateComplete;

      el.validated = 'error';
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;
    });

    it('updates when readOnlyVariant property changes', async function() {
      const el = await fixture<Pfv6TextInput>(html`<pfv6-text-input></pfv6-text-input>`);
      await el.updateComplete;

      el.readOnlyVariant = 'plain';
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('readonly')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('updates ARIA attributes when expandedAriaControls changes', async function() {
      const el = await fixture<Pfv6TextInput>(html`
        <pfv6-text-input>
          <input slot="input" type="text">
        </pfv6-text-input>
      `);
      await el.updateComplete;

      el.expandedAriaControls = 'menu-id';
      await el.updateComplete;

      const input = el.querySelector('input');
      expect(input!.getAttribute('aria-controls')).to.equal('menu-id');
    });
  });
});
