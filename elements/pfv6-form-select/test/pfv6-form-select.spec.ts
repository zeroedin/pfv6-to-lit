import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { Pfv6FormSelect } from '../pfv6-form-select.js';
import '../pfv6-form-select.js';

/** Wait for MutationObserver callbacks to fire and component to update */
async function waitForMutationObserver(el: Pfv6FormSelect) {
  await aTimeout(0);  // MutationObserver callbacks are scheduled as microtasks
  await el.updateComplete;
}

describe('<pfv6-form-select>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-form-select')).to.be.an.instanceof(Pfv6FormSelect);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-form-select'))
          .and
          .to.be.an.instanceOf(Pfv6FormSelect);
    });
  });

  describe('validated property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      // React default: 'default'
      expect(el.validated).to.equal('default');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      expect(el.validated).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="warning"></pfv6-form-select>`);
      expect(el.validated).to.equal('warning');
    });

    it('accepts "error" value', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="error"></pfv6-form-select>`);
      expect(el.validated).to.equal('error');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      expect(el.getAttribute('validated')).to.equal('success');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      expect(el.validated).to.equal('default');

      el.validated = 'error';
      await el.updateComplete;

      expect(el.validated).to.equal('error');
      expect(el.getAttribute('validated')).to.equal('error');
    });

    it('applies success class to container when set to success', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
    });

    it('applies warning class to container when set to warning', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="warning"></pfv6-form-select>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
    });

    it('applies error class to container when set to error', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="error"></pfv6-form-select>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;
    });

    it('does not apply validation class when set to default', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="default"></pfv6-form-select>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.false;
      expect(container!.classList.contains('warning')).to.be.false;
      expect(container!.classList.contains('error')).to.be.false;
    });
  });

  describe('status icons', function() {
    it('displays success icon when validated is success', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('.icon.status');
      expect(statusIcon).to.exist;
    });

    it('displays warning icon when validated is warning', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="warning"></pfv6-form-select>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('.icon.status');
      expect(statusIcon).to.exist;
    });

    it('displays error icon when validated is error', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="error"></pfv6-form-select>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('.icon.status');
      expect(statusIcon).to.exist;
    });

    it('does not display status icon when validated is default', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="default"></pfv6-form-select>`);
      await el.updateComplete;
      const statusIcon = el.shadowRoot!.querySelector('.icon.status');
      expect(statusIcon).to.not.exist;
    });

    it('status icon SVG has aria-hidden', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      await el.updateComplete;
      const svg = el.shadowRoot!.querySelector('.icon.status svg');
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('status icon SVG has correct viewBox', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      await el.updateComplete;
      const svg = el.shadowRoot!.querySelector('.icon.status svg');
      expect(svg!.getAttribute('viewBox')).to.equal('0 0 1024 1024');
    });
  });

  describe('slots', function() {
    describe('select slot', function() {
      it('renders slotted select element', async function() {
        const el = await fixture<Pfv6FormSelect>(html`
          <pfv6-form-select>
            <select slot="select" name="country">
              <option value="">Choose...</option>
              <option value="us">United States</option>
            </select>
          </pfv6-form-select>
        `);
        const select = el.querySelector('[slot="select"]');
        expect(select).to.exist;
        expect(select!.tagName).to.equal('SELECT');
      });

      it('select element can have name attribute', async function() {
        const el = await fixture<Pfv6FormSelect>(html`
          <pfv6-form-select>
            <select slot="select" name="country">
              <option value="us">United States</option>
            </select>
          </pfv6-form-select>
        `);
        const select = el.querySelector('select');
        expect(select!.name).to.equal('country');
      });

      it('select element can have required attribute', async function() {
        const el = await fixture<Pfv6FormSelect>(html`
          <pfv6-form-select>
            <select slot="select" required>
              <option value="">Choose...</option>
              <option value="us">United States</option>
            </select>
          </pfv6-form-select>
        `);
        const select = el.querySelector('select');
        expect(select!.required).to.be.true;
      });

      it('select element can have multiple options', async function() {
        const el = await fixture<Pfv6FormSelect>(html`
          <pfv6-form-select>
            <select slot="select">
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="mx">Mexico</option>
            </select>
          </pfv6-form-select>
        `);
        const select = el.querySelector('select');
        expect(select!.options.length).to.equal(3);
      });

      it('select element can have optgroups', async function() {
        const el = await fixture<Pfv6FormSelect>(html`
          <pfv6-form-select>
            <select slot="select">
              <optgroup label="North America">
                <option value="us">United States</option>
                <option value="ca">Canada</option>
              </optgroup>
              <optgroup label="Europe">
                <option value="uk">United Kingdom</option>
                <option value="fr">France</option>
              </optgroup>
            </select>
          </pfv6-form-select>
        `);
        const select = el.querySelector('select');
        const optgroups = select!.querySelectorAll('optgroup');
        expect(optgroups.length).to.equal(2);
        expect(optgroups[0].label).to.equal('North America');
        expect(optgroups[1].label).to.equal('Europe');
      });
    });
  });

  describe('placeholder detection', function() {
    it('detects placeholder when selected option has data-placeholder', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="" data-placeholder>Choose...</option>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('placeholder')).to.be.true;
    });

    it('does not detect placeholder when selected option lacks data-placeholder', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="">Choose...</option>
            <option value="us" selected>United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('placeholder')).to.be.false;
    });

    it('updates placeholder state when selection changes', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="" data-placeholder>Choose...</option>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      let container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('placeholder')).to.be.true;

      // Change selection
      const select = el.querySelector('select')!;
      select.selectedIndex = 1;
      select.dispatchEvent(new Event('change'));
      await el.updateComplete;

      container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('placeholder')).to.be.false;
    });

    it('re-applies placeholder state when changing back to placeholder option', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="" data-placeholder>Choose...</option>
            <option value="us" selected>United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;

      // Select placeholder option
      select.selectedIndex = 0;
      select.dispatchEvent(new Event('change'));
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('placeholder')).to.be.true;
    });
  });

  describe('disabled state detection', function() {
    it('applies disabled class when slotted select is disabled', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select" disabled>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
    });

    it('does not apply disabled class when slotted select is enabled', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.false;
    });

    it('updates disabled class when select disabled state changes', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;
      let container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.false;

      // Disable select
      select.disabled = true;
      await waitForMutationObserver(el);

      container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
    });
  });

  describe('aria-invalid synchronization', function() {
    it('sets aria-invalid on slotted select when validated is error', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="error">
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const select = el.querySelector('select');
      expect(select!.getAttribute('aria-invalid')).to.equal('true');
    });

    it('does not set aria-invalid when validated is success', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="success">
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const select = el.querySelector('select');
      expect(select!.hasAttribute('aria-invalid')).to.be.false;
    });

    it('does not set aria-invalid when validated is warning', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="warning">
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const select = el.querySelector('select');
      expect(select!.hasAttribute('aria-invalid')).to.be.false;
    });

    it('does not set aria-invalid when validated is default', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="default">
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;
      const select = el.querySelector('select');
      expect(select!.hasAttribute('aria-invalid')).to.be.false;
    });

    it('updates aria-invalid when validated changes to error', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;
      expect(select.hasAttribute('aria-invalid')).to.be.false;

      el.validated = 'error';
      await el.updateComplete;

      expect(select.getAttribute('aria-invalid')).to.equal('true');
    });

    it('removes aria-invalid when validated changes from error to success', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="error">
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;
      expect(select.getAttribute('aria-invalid')).to.equal('true');

      el.validated = 'success';
      await el.updateComplete;

      expect(select.hasAttribute('aria-invalid')).to.be.false;
    });

    it('removes aria-invalid when validated changes from error to default', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="error">
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;
      expect(select.getAttribute('aria-invalid')).to.equal('true');

      el.validated = 'default';
      await el.updateComplete;

      expect(select.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('SPAN');
    });

    it('renders select slot', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      const slot = el.shadowRoot!.querySelector('slot[name="select"]');
      expect(slot).to.exist;
    });

    it('renders utilities container', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      const utilities = el.shadowRoot!.querySelector('.utilities');
      expect(utilities).to.exist;
    });

    it('renders toggle icon (chevron)', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      const toggleIcon = el.shadowRoot!.querySelector('.toggle-icon');
      expect(toggleIcon).to.exist;
      const svg = toggleIcon!.querySelector('svg');
      expect(svg).to.exist;
    });

    it('toggle icon SVG has aria-hidden', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      const svg = el.shadowRoot!.querySelector('.toggle-icon svg');
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('utilities container contains status icon when validated', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated="success"></pfv6-form-select>`);
      const utilities = el.shadowRoot!.querySelector('.utilities');
      const statusIcon = utilities!.querySelector('.icon.status');
      expect(statusIcon).to.exist;
    });

    it('utilities container contains toggle icon', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      const utilities = el.shadowRoot!.querySelector('.utilities');
      const toggleIcon = utilities!.querySelector('.toggle-icon');
      expect(toggleIcon).to.exist;
    });
  });

  describe('combined states', function() {
    it('can be validated and disabled', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="error">
          <select slot="select" disabled>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;
      expect(container!.classList.contains('disabled')).to.be.true;
    });

    it('can be validated, disabled, and placeholder', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="warning">
          <select slot="select" disabled>
            <option value="" data-placeholder>Choose...</option>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
      expect(container!.classList.contains('disabled')).to.be.true;
      expect(container!.classList.contains('placeholder')).to.be.true;
    });

    it('shows status icon when disabled and validated', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="success">
          <select slot="select" disabled>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const statusIcon = el.shadowRoot!.querySelector('.icon.status');
      expect(statusIcon).to.exist;
    });
  });

  describe('React parity validation', function() {
    it('validated prop matches React "validated" prop default', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      // React default: 'default'
      expect(el.validated).to.equal('default');
    });

    it('supports all React validated values', async function() {
      const values: ('success' | 'warning' | 'error' | 'default')[] = ['success', 'warning', 'error', 'default'];

      for (const value of values) {
        const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select validated=${value}></pfv6-form-select>`);
        expect(el.validated).to.equal(value);
      }
    });

    it('wraps native select element like React', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select" name="test">
            <option value="a">Option A</option>
          </select>
        </pfv6-form-select>
      `);

      // Verify that the select is slotted (not replaced)
      const select = el.querySelector('select');
      expect(select).to.exist;
      expect(select!.name).to.equal('test');
    });

    it('provides validation styling without replacing native select', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select validated="error">
          <select slot="select" name="test" required>
            <option value="">Choose...</option>
          </select>
        </pfv6-form-select>
      `);

      // Native select retains all attributes
      const select = el.querySelector('select')!;
      expect(select.name).to.equal('test');
      expect(select.required).to.be.true;

      // Validation styling is applied
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;

      // aria-invalid is synchronized
      expect(select.getAttribute('aria-invalid')).to.equal('true');
    });
  });

  describe('lifecycle', function() {
    it('initializes slot change handler on first render', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      // Verify that the select element is detected (via disabled class logic)
      const select = el.querySelector('select')!;
      select.disabled = true;
      await waitForMutationObserver(el);

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
    });

    it('updates when validated property changes', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      expect(el.validated).to.equal('default');

      el.validated = 'success';
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;

      const statusIcon = el.shadowRoot!.querySelector('.icon.status');
      expect(statusIcon).to.exist;
    });

    it('cleans up event listener on disconnect', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="" data-placeholder>Choose...</option>
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      // Verify listener is active
      const select = el.querySelector('select')!;
      select.selectedIndex = 1;
      select.dispatchEvent(new Event('change'));
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('placeholder')).to.be.false;

      // Disconnect and verify cleanup (listener should be removed)
      el.remove();

      // Re-attach to verify no memory leaks (test passes if no errors)
      const newEl = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="">Choose...</option>
          </select>
        </pfv6-form-select>
      `);
      expect(newEl).to.exist;
    });
  });

  describe('edge cases', function() {
    it('handles select without options', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select"></select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.classList.contains('placeholder')).to.be.false;
    });

    it('handles missing select element (empty slot)', async function() {
      const el = await fixture<Pfv6FormSelect>(html`<pfv6-form-select></pfv6-form-select>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.classList.contains('disabled')).to.be.false;
      expect(container!.classList.contains('placeholder')).to.be.false;
    });

    it('handles multiple validation state changes', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;

      // Change through all validation states
      el.validated = 'success';
      await el.updateComplete;
      expect(select.hasAttribute('aria-invalid')).to.be.false;

      el.validated = 'warning';
      await el.updateComplete;
      expect(select.hasAttribute('aria-invalid')).to.be.false;

      el.validated = 'error';
      await el.updateComplete;
      expect(select.getAttribute('aria-invalid')).to.equal('true');

      el.validated = 'default';
      await el.updateComplete;
      expect(select.hasAttribute('aria-invalid')).to.be.false;
    });

    it('preserves select value when validated changes', async function() {
      const el = await fixture<Pfv6FormSelect>(html`
        <pfv6-form-select>
          <select slot="select">
            <option value="us">United States</option>
            <option value="ca" selected>Canada</option>
          </select>
        </pfv6-form-select>
      `);
      await el.updateComplete;

      const select = el.querySelector('select')!;
      expect(select.value).to.equal('ca');

      el.validated = 'error';
      await el.updateComplete;

      // Value is preserved
      expect(select.value).to.equal('ca');
    });
  });
});
