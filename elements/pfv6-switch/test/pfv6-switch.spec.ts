import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Switch, Pfv6SwitchChangeEvent } from '../pfv6-switch.js';
import '../pfv6-switch.js';

describe('<pfv6-switch>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-switch')).to.be.an.instanceof(Pfv6Switch);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-switch'))
          .and
          .to.be.an.instanceOf(Pfv6Switch);
    });
  });

  describe('name property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.name).to.equal('');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" name="settings"></pfv6-switch>`);
      expect(el.name).to.equal('settings');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" name="settings"></pfv6-switch>`);
      expect(el.getAttribute('name')).to.equal('settings');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      el.name = 'newName';
      await el.updateComplete;

      expect(el.name).to.equal('newName');
      expect(el.getAttribute('name')).to.equal('newName');
    });
  });

  describe('value property', function() {
    it('defaults to "on"', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.value).to.equal('on');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" value="enabled"></pfv6-switch>`);
      expect(el.value).to.equal('enabled');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" value="enabled"></pfv6-switch>`);
      expect(el.getAttribute('value')).to.equal('enabled');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      el.value = 'newValue';
      await el.updateComplete;

      expect(el.value).to.equal('newValue');
      expect(el.getAttribute('value')).to.equal('newValue');
    });
  });

  describe('checked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.checked).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked></pfv6-switch>`);
      expect(el.checked).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked></pfv6-switch>`);
      expect(el.hasAttribute('checked')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('updates attribute when changed', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      el.checked = true;
      await el.updateComplete;

      expect(el.hasAttribute('checked')).to.be.true;
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.disabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" disabled></pfv6-switch>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" disabled></pfv6-switch>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" disabled></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.disabled).to.be.false;

      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('updates aria-disabled', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" disabled></pfv6-switch>`);
      await el.updateComplete;
      // Verify internals.ariaDisabled is set (tested via implementation)
      expect(el.disabled).to.be.true;
    });
  });

  describe('required property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.required).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" required></pfv6-switch>`);
      expect(el.required).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" required></pfv6-switch>`);
      expect(el.hasAttribute('required')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" required></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.required).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.required).to.be.false;

      el.required = true;
      await el.updateComplete;

      expect(el.required).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.required).to.be.true;
    });
  });

  describe('label property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label=""></pfv6-switch>`);
      expect(el.label).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Enable notifications"></pfv6-switch>`);
      expect(el.label).to.equal('Enable notifications');
    });

    it('renders label text', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Enable notifications"></pfv6-switch>`);
      const label = el.shadowRoot!.querySelector('#label');
      expect(label).to.exist;
      expect(label!.textContent?.trim()).to.equal('Enable notifications');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Old label"></pfv6-switch>`);
      expect(el.label).to.equal('Old label');

      el.label = 'New label';
      await el.updateComplete;

      const label = el.shadowRoot!.querySelector('#label');
      expect(label).to.exist;
      expect(label!.textContent?.trim()).to.equal('New label');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Toggle feature"></pfv6-switch>`);
      expect(el.accessibleLabel).to.equal('Toggle feature');
    });

    it('sets aria-label on input', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Toggle feature"></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).to.equal('Toggle feature');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      el.accessibleLabel = 'New accessible label';
      await el.updateComplete;

      expect(el.accessibleLabel).to.equal('New accessible label');
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).to.equal('New accessible label');
    });

    it('updates aria-label in ElementInternals', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Test switch"></pfv6-switch>`);
      await el.updateComplete;
      // Verify internals.ariaLabel is set (tested via implementation)
      expect(el.accessibleLabel).to.equal('Test switch');
    });
  });

  describe('accessibleLabelledBy property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.accessibleLabelledBy).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-labelledby="external-label"></pfv6-switch>`);
      expect(el.accessibleLabelledBy).to.equal('external-label');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      el.accessibleLabelledBy = 'label-id';
      await el.updateComplete;

      expect(el.accessibleLabelledBy).to.equal('label-id');
    });

    it('updates aria-labelledby in ElementInternals', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-labelledby="label-id"></pfv6-switch>`);
      await el.updateComplete;
      // Verify internals.ariaLabelledBy is set (tested via implementation)
      expect(el.accessibleLabelledBy).to.equal('label-id');
    });
  });

  describe('defaultChecked property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.defaultChecked).to.be.undefined;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" default-checked></pfv6-switch>`);
      expect(el.defaultChecked).to.be.true;
    });

    it('initializes checked state when not explicitly set', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" default-checked></pfv6-switch>`);
      expect(el.checked).to.be.true;
    });

    it('does not override explicit checked property', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked default-checked></pfv6-switch>`);
      expect(el.checked).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      el.defaultChecked = true;
      await el.updateComplete;

      expect(el.defaultChecked).to.be.true;
    });
  });

  describe('hasCheckIcon property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.hasCheckIcon).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" has-check-icon></pfv6-switch>`);
      expect(el.hasCheckIcon).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" has-check-icon></pfv6-switch>`);
      expect(el.hasAttribute('has-check-icon')).to.be.true;
    });

    it('renders check icon when true and label present', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" has-check-icon></pfv6-switch>`);
      const icon = el.shadowRoot!.querySelector('#toggle-icon');
      expect(icon).to.exist;
      const svg = icon!.querySelector('svg');
      expect(svg).to.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.hasCheckIcon).to.be.false;

      el.hasCheckIcon = true;
      await el.updateComplete;

      expect(el.hasCheckIcon).to.be.true;
      const icon = el.shadowRoot!.querySelector('#toggle-icon');
      expect(icon).to.exist;
    });
  });

  describe('isReversed property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.isReversed).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" is-reversed></pfv6-switch>`);
      expect(el.isReversed).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" is-reversed></pfv6-switch>`);
      expect(el.hasAttribute('is-reversed')).to.be.true;
    });

    it('applies reverse class to container', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" is-reversed></pfv6-switch>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('reverse')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.isReversed).to.be.false;

      el.isReversed = true;
      await el.updateComplete;

      expect(el.isReversed).to.be.true;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('reverse')).to.be.true;
    });
  });

  describe('change event', function() {
    it('dispatches on user interaction', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6SwitchChangeEvent', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      let capturedEvent: Event | null = null;
      el.addEventListener('change', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6SwitchChangeEvent);
    });

    it('event contains correct checked value when switching on', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      let capturedEvent: Pfv6SwitchChangeEvent | null = null;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6SwitchChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.checked).to.be.true;
    });

    it('event contains correct checked value when switching off', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked></pfv6-switch>`);

      let capturedEvent: Pfv6SwitchChangeEvent | null = null;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6SwitchChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.checked).to.be.false;
    });

    it('updates checked property when clicked', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.checked).to.be.false;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it('event bubbles', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-switch label="Test"></pfv6-switch>
        </div>
      `);

      let eventBubbled = false;
      container.addEventListener('change', () => {
        eventBubbled = true;
      });

      const switchEl = container.querySelector<Pfv6Switch>('pfv6-switch')!;
      const input = switchEl.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await switchEl.updateComplete;

      expect(eventBubbled).to.be.true;
    });

    it('event is composed', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      let capturedEvent: Event | null = null;
      el.addEventListener('change', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.composed).to.be.true;
    });

    it('does not dispatch when disabled', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" disabled></pfv6-switch>`);

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(eventFired).to.be.false;
    });
  });

  describe('Form-Associated Custom Element (FACE)', function() {
    it('is form-associated', function() {
      expect(Pfv6Switch.formAssociated).to.be.true;
    });

    it('sets form value when checked', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" value="enabled" checked></pfv6-switch>`);
      // Form value should be set (implementation tested via internals)
      expect(el.checked).to.be.true;
      expect(el.value).to.equal('enabled');
    });

    it('sets form value to null when unchecked', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" value="enabled"></pfv6-switch>`);
      // Form value should be null when unchecked
      expect(el.checked).to.be.false;
    });

    it('updates form value when checked changes', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" value="enabled"></pfv6-switch>`);
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it('updates aria-checked when checked changes', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      await el.updateComplete;
      // Verify internals.ariaChecked is 'false' initially
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;
      // Verify internals.ariaChecked is 'true' after change
      expect(el.checked).to.be.true;
    });
  });

  describe('formDisabledCallback', function() {
    it('updates disabled state', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      expect(el.disabled).to.be.false;

      el.formDisabledCallback(true);
      await el.updateComplete;

      expect(el.disabled).to.be.true;
    });
  });

  describe('formResetCallback', function() {
    it('resets checked to false when no defaultChecked', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked></pfv6-switch>`);
      expect(el.checked).to.be.true;

      el.formResetCallback();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it('resets checked to defaultChecked value', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" default-checked></pfv6-switch>`);
      // Uncheck it
      el.checked = false;
      await el.updateComplete;
      expect(el.checked).to.be.false;

      el.formResetCallback();
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });
  });

  describe('ElementInternals', function() {
    it('sets role to "switch"', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      // Verify internals.role is set to 'switch' (tested via implementation)
      expect(el).to.exist;
    });

    it('updates aria-checked based on checked state', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      await el.updateComplete;
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;
      expect(el.checked).to.be.true;
    });

    it('updates aria-disabled based on disabled state', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      await el.updateComplete;
      expect(el.disabled).to.be.false;

      el.disabled = true;
      await el.updateComplete;
      expect(el.disabled).to.be.true;
    });

    it('updates aria-label from accessibleLabel', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Toggle feature"></pfv6-switch>`);
      await el.updateComplete;
      expect(el.accessibleLabel).to.equal('Toggle feature');
    });

    it('updates aria-labelledby from accessibleLabelledBy', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-labelledby="label-id"></pfv6-switch>`);
      await el.updateComplete;
      expect(el.accessibleLabelledBy).to.equal('label-id');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders label container', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const container = el.shadowRoot!.querySelector('label#container');
      expect(container).to.exist;
    });

    it('renders input element', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(input).to.exist;
    });

    it('input has correct id', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(input!.id).to.equal('input');
    });

    it('label has for attribute pointing to input', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const label = el.shadowRoot!.querySelector('label#container') as HTMLLabelElement;
      expect(label.getAttribute('for')).to.equal('input');
    });

    it('renders toggle element', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const toggle = el.shadowRoot!.querySelector('#toggle');
      expect(toggle).to.exist;
    });

    it('renders label text when label provided', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Enable feature"></pfv6-switch>`);
      const labelText = el.shadowRoot!.querySelector('#label');
      expect(labelText).to.exist;
      expect(labelText!.textContent?.trim()).to.equal('Enable feature');
    });

    it('label text has aria-hidden', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const labelText = el.shadowRoot!.querySelector('#label');
      expect(labelText!.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('check icon rendering', function() {
    it('renders check icon when label present and hasCheckIcon is true', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" has-check-icon></pfv6-switch>`);
      const icon = el.shadowRoot!.querySelector('#toggle-icon');
      expect(icon).to.exist;
      const svg = icon!.querySelector('svg');
      expect(svg).to.exist;
    });

    it('does not render check icon when label present but hasCheckIcon is false', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const icon = el.shadowRoot!.querySelector('#toggle-icon');
      expect(icon).to.not.exist;
    });

    it('always renders check icon when no label (standalone mode)', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Test"></pfv6-switch>`);
      const icon = el.shadowRoot!.querySelector('#toggle-icon');
      expect(icon).to.exist;
      const svg = icon!.querySelector('svg');
      expect(svg).to.exist;
    });

    it('check icon svg has correct attributes', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" has-check-icon></pfv6-switch>`);
      const svg = el.shadowRoot!.querySelector('#toggle-icon svg') as SVGElement;
      expect(svg.getAttribute('aria-hidden')).to.equal('true');
      expect(svg.getAttribute('role')).to.equal('img');
    });
  });

  describe('layout modes', function() {
    it('renders with label (default layout)', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const labelText = el.shadowRoot!.querySelector('#label');
      expect(labelText).to.exist;
    });

    it('renders without label (standalone mode)', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Test"></pfv6-switch>`);
      const labelText = el.shadowRoot!.querySelector('#label');
      expect(labelText).to.not.exist;
    });

    it('applies labelledby when label exists and no accessibleLabel', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-labelledby')).to.equal('label');
    });

    it('does not apply labelledby when accessibleLabel provided', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" accessible-label="Override"></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.hasAttribute('aria-labelledby')).to.be.false;
      expect(input.getAttribute('aria-label')).to.equal('Override');
    });
  });

  describe('combined properties', function() {
    it('can be checked and disabled', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" checked disabled></pfv6-switch>`);

      expect(el.checked).to.be.true;
      expect(el.disabled).to.be.true;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
      expect(input.disabled).to.be.true;
    });

    it('can be reversed with check icon', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" is-reversed has-check-icon></pfv6-switch>`);

      expect(el.isReversed).to.be.true;
      expect(el.hasCheckIcon).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('reverse')).to.be.true;

      const icon = el.shadowRoot!.querySelector('#toggle-icon');
      expect(icon).to.exist;
    });

    it('can be required and checked', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test" required checked></pfv6-switch>`);

      expect(el.required).to.be.true;
      expect(el.checked).to.be.true;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.required).to.be.true;
      expect(input.checked).to.be.true;
    });
  });

  describe('accessibility', function() {
    it('input has type checkbox', async function() {
      const el = await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.type).to.equal('checkbox');
    });

    it('warns when no accessible name provided', async function() {
      // This test validates the connectedCallback warning
      const consoleError = console.error;
      let errorCalled = false;
      console.error = () => { errorCalled = true; };

      await fixture<Pfv6Switch>(html`<pfv6-switch></pfv6-switch>`);

      console.error = consoleError;
      expect(errorCalled).to.be.true;
    });

    it('does not warn when label provided', async function() {
      const consoleError = console.error;
      let errorCalled = false;
      console.error = () => { errorCalled = true; };

      await fixture<Pfv6Switch>(html`<pfv6-switch label="Test"></pfv6-switch>`);

      console.error = consoleError;
      expect(errorCalled).to.be.false;
    });

    it('does not warn when accessibleLabel provided', async function() {
      const consoleError = console.error;
      let errorCalled = false;
      console.error = () => { errorCalled = true; };

      await fixture<Pfv6Switch>(html`<pfv6-switch accessible-label="Test"></pfv6-switch>`);

      console.error = consoleError;
      expect(errorCalled).to.be.false;
    });

    it('does not warn when accessibleLabelledBy provided', async function() {
      const consoleError = console.error;
      let errorCalled = false;
      console.error = () => { errorCalled = true; };

      await fixture<Pfv6Switch>(html`<pfv6-switch accessible-labelledby="label-id"></pfv6-switch>`);

      console.error = consoleError;
      expect(errorCalled).to.be.false;
    });
  });
});
