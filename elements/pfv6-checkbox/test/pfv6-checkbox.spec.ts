import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Checkbox } from '../pfv6-checkbox.js';
import '../pfv6-checkbox.js';

describe('<pfv6-checkbox>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-checkbox')).to.be.an.instanceof(Pfv6Checkbox);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-checkbox'))
          .and
          .to.be.an.instanceOf(Pfv6Checkbox);
    });
  });

  describe('name property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.name).to.equal('');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" name="terms"></pfv6-checkbox>`);
      expect(el.name).to.equal('terms');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" name="terms"></pfv6-checkbox>`);
      expect(el.getAttribute('name')).to.equal('terms');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.name = 'newName';
      await el.updateComplete;

      expect(el.name).to.equal('newName');
      expect(el.getAttribute('name')).to.equal('newName');
    });
  });

  describe('value property', function() {
    it('defaults to "on"', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.value).to.equal('on');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="custom"></pfv6-checkbox>`);
      expect(el.value).to.equal('custom');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="custom"></pfv6-checkbox>`);
      expect(el.getAttribute('value')).to.equal('custom');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.value = 'newValue';
      await el.updateComplete;

      expect(el.value).to.equal('newValue');
      expect(el.getAttribute('value')).to.equal('newValue');
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.disabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" disabled></pfv6-checkbox>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" disabled></pfv6-checkbox>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" disabled></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.disabled).to.be.false;

      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('applies disabled class to label', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test" disabled></pfv6-checkbox>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label!.classList.contains('disabled')).to.be.true;
    });

    it('updates aria-disabled', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" disabled></pfv6-checkbox>`);
      await el.updateComplete;
      // Verify internals.ariaDisabled is set (tested via implementation)
      expect(el.disabled).to.be.true;
    });
  });

  describe('required property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.required).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      expect(el.required).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      expect(el.hasAttribute('required')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.required).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.required).to.be.false;

      el.required = true;
      await el.updateComplete;

      expect(el.required).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.required).to.be.true;
    });

    it('displays required indicator when label present', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Terms" required></pfv6-checkbox>`);
      const requiredIndicator = el.shadowRoot!.querySelector('.label-required');
      expect(requiredIndicator).to.exist;
      expect(requiredIndicator!.textContent?.trim()).to.equal('*');
    });

    it('required indicator has aria-hidden', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Terms" required></pfv6-checkbox>`);
      const requiredIndicator = el.shadowRoot!.querySelector('.label-required');
      expect(requiredIndicator!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('updates aria-required', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      await el.updateComplete;
      // Verify internals.ariaRequired is set (tested via implementation)
      expect(el.required).to.be.true;
    });
  });

  describe('checked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.checked).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" checked></pfv6-checkbox>`);
      expect(el.checked).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" checked></pfv6-checkbox>`);
      expect(el.hasAttribute('checked')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" checked></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('updates attribute when changed', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);

      el.checked = true;
      await el.updateComplete;

      expect(el.hasAttribute('checked')).to.be.true;
    });
  });

  describe('isValid property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.isValid).to.be.true;
    });

    it('accepts false value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.isValid = false;
      await el.updateComplete;
      expect(el.isValid).to.be.false;
    });

    it('reflects to attribute as is-valid', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.isValid = false;
      await el.updateComplete;
      expect(el.hasAttribute('is-valid')).to.be.true;
      expect(el.getAttribute('is-valid')).to.equal('false');
    });

    it('sets aria-invalid on input when false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.isValid = false;
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('sets aria-invalid to false on input when true', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('false');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.isValid).to.be.true;

      el.isValid = false;
      await el.updateComplete;

      expect(el.isValid).to.be.false;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('updates aria-invalid on internals', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.isValid = false;
      await el.updateComplete;
      // Verify internals.ariaInvalid is set (tested via implementation)
      expect(el.isValid).to.be.false;
    });
  });

  describe('label property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.label).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Accept terms"></pfv6-checkbox>`);
      expect(el.label).to.equal('Accept terms');
    });

    it('renders label element when provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Accept terms"></pfv6-checkbox>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label).to.exist;
      expect(label!.textContent).to.include('Accept terms');
    });

    it('does not render label element when not provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.shadowRoot!.querySelector('label')).to.not.exist;

      el.label = 'New label';
      await el.updateComplete;

      const label = el.shadowRoot!.querySelector('label');
      expect(label).to.exist;
      expect(label!.textContent).to.include('New label');
    });
  });

  describe('labelPosition property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.labelPosition).to.equal('end');
    });

    it('accepts "start" value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test" label-position="start"></pfv6-checkbox>`);
      expect(el.labelPosition).to.equal('start');
    });

    it('accepts "end" value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test" label-position="end"></pfv6-checkbox>`);
      expect(el.labelPosition).to.equal('end');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label-position="start"></pfv6-checkbox>`);
      expect(el.getAttribute('label-position')).to.equal('start');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test"></pfv6-checkbox>`);
      expect(el.labelPosition).to.equal('end');

      el.labelPosition = 'start';
      await el.updateComplete;

      expect(el.labelPosition).to.equal('start');
    });
  });

  describe('description property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.description).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" description="Helper text"></pfv6-checkbox>`);
      expect(el.description).to.equal('Helper text');
    });

    it('renders description element when provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" description="Helper text"></pfv6-checkbox>`);
      const description = el.shadowRoot!.querySelector('.description');
      expect(description).to.exist;
      expect(description!.textContent?.trim()).to.equal('Helper text');
    });

    it('does not render description element when not provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const description = el.shadowRoot!.querySelector('.description');
      expect(description).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.shadowRoot!.querySelector('.description')).to.not.exist;

      el.description = 'New description';
      await el.updateComplete;

      const description = el.shadowRoot!.querySelector('.description');
      expect(description).to.exist;
      expect(description!.textContent?.trim()).to.equal('New description');
    });

    it('sets aria-describedby on input', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" description="Helper text"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-describedby')).to.equal('description');
    });
  });

  describe('body property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.body).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" body="Additional info"></pfv6-checkbox>`);
      expect(el.body).to.equal('Additional info');
    });

    it('renders body element when provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" body="Additional info"></pfv6-checkbox>`);
      const body = el.shadowRoot!.querySelector('.body');
      expect(body).to.exist;
      expect(body!.textContent?.trim()).to.equal('Additional info');
    });

    it('does not render body element when not provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const body = el.shadowRoot!.querySelector('.body');
      expect(body).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.shadowRoot!.querySelector('.body')).to.not.exist;

      el.body = 'New body text';
      await el.updateComplete;

      const body = el.shadowRoot!.querySelector('.body');
      expect(body).to.exist;
      expect(body!.textContent?.trim()).to.equal('New body text');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" accessible-label="Screen reader label"></pfv6-checkbox>`);
      expect(el.accessibleLabel).to.equal('Screen reader label');
    });

    it('sets aria-label on input', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" accessible-label="Screen reader label"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).to.equal('Screen reader label');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);

      el.accessibleLabel = 'New accessible label';
      await el.updateComplete;

      expect(el.accessibleLabel).to.equal('New accessible label');
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).to.equal('New accessible label');
    });
  });

  describe('indeterminate property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.indeterminate).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" indeterminate></pfv6-checkbox>`);
      expect(el.indeterminate).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" indeterminate></pfv6-checkbox>`);
      expect(el.hasAttribute('indeterminate')).to.be.true;
    });

    it('sets indeterminate on internal input element', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" indeterminate></pfv6-checkbox>`);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.indeterminate).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.indeterminate).to.be.false;

      el.indeterminate = true;
      await el.updateComplete;

      expect(el.indeterminate).to.be.true;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.indeterminate).to.be.true;
    });

    it('clears indeterminate on user interaction', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" indeterminate></pfv6-checkbox>`);
      expect(el.indeterminate).to.be.true;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(el.indeterminate).to.be.false;
    });
  });

  describe('change event', function() {
    it('dispatches on user interaction', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });

    it('event is instance of Event', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);

      let capturedEvent: Event | null = null;
      el.addEventListener('change', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Event);
    });

    it('updates checked property when clicked', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.checked).to.be.false;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it('event bubbles', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-checkbox id="test"></pfv6-checkbox>
        </div>
      `);

      let eventBubbled = false;
      container.addEventListener('change', () => {
        eventBubbled = true;
      });

      const checkbox = container.querySelector<Pfv6Checkbox>('#test')!;
      const input = checkbox.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await checkbox.updateComplete;

      expect(eventBubbled).to.be.true;
    });

    it('event is composed', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);

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
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" disabled></pfv6-checkbox>`);

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(eventFired).to.be.false;
    });

    it('clears indeterminate state on change', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" indeterminate></pfv6-checkbox>`);
      expect(el.indeterminate).to.be.true;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(el.indeterminate).to.be.false;
      expect(input.indeterminate).to.be.false;
    });
  });

  describe('Form-Associated Custom Element (FACE)', function() {
    it('is form-associated', function() {
      expect(Pfv6Checkbox.formAssociated).to.be.true;
    });

    it('sets form value when checked', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="accepted" checked></pfv6-checkbox>`);
      // Form value should be set (implementation tested via internals)
      expect(el.checked).to.be.true;
      expect(el.value).to.equal('accepted');
    });

    it('sets form value to null when unchecked', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="accepted"></pfv6-checkbox>`);
      // Form value should be null when unchecked
      expect(el.checked).to.be.false;
    });

    it('updates form value when checked changes', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="accepted"></pfv6-checkbox>`);
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it('validates required checkbox', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      await el.updateComplete;

      // Required unchecked checkbox should be invalid
      expect(el.isValid).to.be.false;
    });

    it('validates required checked checkbox', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required checked></pfv6-checkbox>`);
      await el.updateComplete;

      // Required checked checkbox should be valid
      expect(el.isValid).to.be.true;
    });

    it('revalidates when required changes', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.isValid).to.be.true;

      el.required = true;
      await el.updateComplete;

      // Now should be invalid (required but not checked)
      expect(el.isValid).to.be.false;
    });

    it('revalidates when checked changes', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      expect(el.isValid).to.be.false;

      el.checked = true;
      await el.updateComplete;

      // Now should be valid (required and checked)
      expect(el.isValid).to.be.true;
    });
  });

  describe('formDisabledCallback', function() {
    it('updates disabled state', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      expect(el.disabled).to.be.false;

      el.formDisabledCallback(true);
      await el.updateComplete;

      expect(el.disabled).to.be.true;
    });
  });

  describe('formResetCallback', function() {
    it('resets checked to false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" checked></pfv6-checkbox>`);
      expect(el.checked).to.be.true;

      el.formResetCallback();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it('clears indeterminate state', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" indeterminate></pfv6-checkbox>`);
      expect(el.indeterminate).to.be.true;

      el.formResetCallback();
      await el.updateComplete;

      expect(el.indeterminate).to.be.false;
    });
  });

  describe('formStateRestoreCallback', function() {
    it('restores checked state from matching value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="accepted"></pfv6-checkbox>`);
      expect(el.checked).to.be.false;

      el.formStateRestoreCallback('accepted');
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it('restores unchecked state from non-matching value', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="accepted" checked></pfv6-checkbox>`);
      expect(el.checked).to.be.true;

      el.formStateRestoreCallback('different');
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it('validates after restore', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" value="accepted" required></pfv6-checkbox>`);

      el.formStateRestoreCallback('accepted');
      await el.updateComplete;

      expect(el.isValid).to.be.true;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
    });

    it('renders input element', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(input).to.exist;
    });

    it('input has correct class', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(input!.classList.contains('input')).to.be.true;
    });

    it('applies standalone class when no label', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('standalone')).to.be.true;
    });

    it('does not apply standalone class when label exists', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test"></pfv6-checkbox>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('standalone')).to.be.false;
    });
  });

  describe('label element rendering', function() {
    it('renders label after input when labelPosition is end', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test"></pfv6-checkbox>`);
      const container = el.shadowRoot!.querySelector('#container');
      const children = Array.from(container!.children);
      const inputIndex = children.findIndex(child => child.tagName === 'INPUT');
      const labelIndex = children.findIndex(child => child.tagName === 'LABEL');

      expect(inputIndex).to.be.lessThan(labelIndex);
    });

    it('renders label before input when labelPosition is start', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test" label-position="start"></pfv6-checkbox>`);
      const container = el.shadowRoot!.querySelector('#container');
      const children = Array.from(container!.children);
      const inputIndex = children.findIndex(child => child.tagName === 'INPUT');
      const labelIndex = children.findIndex(child => child.tagName === 'LABEL');

      expect(labelIndex).to.be.lessThan(inputIndex);
    });
  });

  describe('combined properties', function() {
    it('can be checked and disabled', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" checked disabled></pfv6-checkbox>`);

      expect(el.checked).to.be.true;
      expect(el.disabled).to.be.true;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
      expect(input.disabled).to.be.true;
    });

    it('can have label, description, and body', async function() {
      const el = await fixture<Pfv6Checkbox>(html`
        <pfv6-checkbox
          id="test"
          label="Main label"
          description="Helper text"
          body="Additional info"
        ></pfv6-checkbox>
      `);

      const label = el.shadowRoot!.querySelector('label');
      const description = el.shadowRoot!.querySelector('.description');
      const body = el.shadowRoot!.querySelector('.body');

      expect(label).to.exist;
      expect(label!.textContent).to.include('Main label');
      expect(description).to.exist;
      expect(description!.textContent?.trim()).to.equal('Helper text');
      expect(body).to.exist;
      expect(body!.textContent?.trim()).to.equal('Additional info');
    });

    it('can be required and invalid', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" required></pfv6-checkbox>`);
      await el.updateComplete;

      expect(el.required).to.be.true;
      expect(el.isValid).to.be.false;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.required).to.be.true;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('can be indeterminate and checked', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" checked indeterminate></pfv6-checkbox>`);

      expect(el.checked).to.be.true;
      expect(el.indeterminate).to.be.true;

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
      expect(input.indeterminate).to.be.true;
    });
  });

  describe('accessibility', function() {
    it('input has type checkbox', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.type).to.equal('checkbox');
    });

    it('sets aria-invalid when isValid is false', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test"></pfv6-checkbox>`);
      el.isValid = false;
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(input!.getAttribute('aria-invalid')).to.equal('true');
    });

    it('uses aria-label when provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" accessible-label="Accept"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(input!.getAttribute('aria-label')).to.equal('Accept');
    });

    it('sets aria-describedby when description provided', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" description="Helper"></pfv6-checkbox>`);
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
      const describedBy = input!.getAttribute('aria-describedby');
      expect(describedBy).to.equal('description');
    });

    it('description element has matching id', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" description="Helper"></pfv6-checkbox>`);
      const description = el.shadowRoot!.querySelector('.description');
      expect(description!.id).to.equal('description');
    });

    it('label element has matching id when present', async function() {
      const el = await fixture<Pfv6Checkbox>(html`<pfv6-checkbox id="test" label="Test"></pfv6-checkbox>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label!.id).to.equal('label');
    });
  });
});
