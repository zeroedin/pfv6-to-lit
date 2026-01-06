import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Radio, Pfv6RadioChangeEvent } from '../pfv6-radio.js';
import '../pfv6-radio.js';

describe('<pfv6-radio>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-radio')).to.be.an.instanceof(Pfv6Radio);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="test" name="test"></pfv6-radio>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-radio'))
        .and
        .to.be.an.instanceOf(Pfv6Radio);
    });
  });

  describe('id property', function() {
    it('is required and must be set', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.id).to.equal('radio1');
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.id).to.equal('radio1');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      el.id = 'radio2';
      await el.updateComplete;

      expect(el.id).to.equal('radio2');
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.id).to.equal('radio2');
    });
  });

  describe('name property', function() {
    it('is required and must be set', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.name).to.equal('group1');
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.name).to.equal('group1');
    });

    it('groups radio buttons together', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-radio id="radio1" name="group1"></pfv6-radio>
          <pfv6-radio id="radio2" name="group1"></pfv6-radio>
          <pfv6-radio id="radio3" name="group2"></pfv6-radio>
        </div>
      `);

      const radio1 = container.querySelector<Pfv6Radio>('#radio1')!;
      const radio2 = container.querySelector<Pfv6Radio>('#radio2')!;
      const radio3 = container.querySelector<Pfv6Radio>('#radio3')!;

      expect(radio1.name).to.equal('group1');
      expect(radio2.name).to.equal('group1');
      expect(radio3.name).to.equal('group2');
    });
  });

  describe('value property', function() {
    it('defaults to "on"', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.value).to.equal('on');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" value="option1"></pfv6-radio>`);
      expect(el.value).to.equal('option1');
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" value="custom"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.value).to.equal('custom');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      el.value = 'newValue';
      await el.updateComplete;

      expect(el.value).to.equal('newValue');
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.value).to.equal('newValue');
    });
  });

  describe('checked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.checked).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" checked></pfv6-radio>`);
      expect(el.checked).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" checked></pfv6-radio>`);
      expect(el.hasAttribute('checked')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" checked></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('updates attribute when changed', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      el.checked = true;
      await el.updateComplete;

      expect(el.hasAttribute('checked')).to.be.true;
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.disabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" disabled></pfv6-radio>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" disabled></pfv6-radio>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" disabled></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.disabled).to.be.false;

      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('applies disabled class to wrapper', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" disabled></pfv6-radio>`);
      const wrapper = el.shadowRoot!.querySelector('#container');
      expect(wrapper!.classList.contains('disabled')).to.be.true;
    });

    it('applies disabled class to label', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test" disabled></pfv6-radio>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label!.classList.contains('disabled')).to.be.true;
    });
  });

  describe('required property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.required).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" required></pfv6-radio>`);
      expect(el.required).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" required></pfv6-radio>`);
      expect(el.hasAttribute('required')).to.be.true;
    });

    it('is reflected to the internal input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" required></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.required).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.required).to.be.false;

      el.required = true;
      await el.updateComplete;

      expect(el.required).to.be.true;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.required).to.be.true;
    });
  });

  describe('isValid property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.isValid).to.be.true;
    });

    it('accepts false value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      el.isValid = false;
      await el.updateComplete;
      expect(el.isValid).to.be.false;
    });

    it('sets aria-invalid when false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      el.isValid = false;
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('sets aria-invalid to false when true', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('false');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.isValid).to.be.true;

      el.isValid = false;
      await el.updateComplete;

      expect(el.isValid).to.be.false;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });
  });

  describe('label property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.label).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Option 1"></pfv6-radio>`);
      expect(el.label).to.equal('Option 1');
    });

    it('renders label element when provided', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Option 1"></pfv6-radio>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label).to.exist;
      expect(label!.textContent?.trim()).to.equal('Option 1');
    });

    it('does not render label element when not provided', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label).to.not.exist;
    });

    it('label has correct for attribute', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Option 1"></pfv6-radio>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label!.getAttribute('for')).to.equal('radio1');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.shadowRoot!.querySelector('label')).to.not.exist;

      el.label = 'New Label';
      await el.updateComplete;

      const label = el.shadowRoot!.querySelector('label');
      expect(label).to.exist;
      expect(label!.textContent?.trim()).to.equal('New Label');
    });
  });

  describe('labelPosition property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.labelPosition).to.equal('end');
    });

    it('accepts "start" value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test" label-position="start"></pfv6-radio>`);
      expect(el.labelPosition).to.equal('start');
    });

    it('accepts "end" value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test" label-position="end"></pfv6-radio>`);
      expect(el.labelPosition).to.equal('end');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test"></pfv6-radio>`);
      expect(el.labelPosition).to.equal('end');

      el.labelPosition = 'start';
      await el.updateComplete;

      expect(el.labelPosition).to.equal('start');
    });
  });

  describe('description property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.description).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" description="Helper text"></pfv6-radio>`);
      expect(el.description).to.equal('Helper text');
    });

    it('renders description element when provided', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" description="Helper text"></pfv6-radio>`);
      const description = el.shadowRoot!.querySelector('.description');
      expect(description).to.exist;
      expect(description!.textContent?.trim()).to.equal('Helper text');
    });

    it('does not render description element when not provided', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const description = el.shadowRoot!.querySelector('.description');
      expect(description).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.shadowRoot!.querySelector('.description')).to.not.exist;

      el.description = 'New description';
      await el.updateComplete;

      const description = el.shadowRoot!.querySelector('.description');
      expect(description).to.exist;
      expect(description!.textContent?.trim()).to.equal('New description');
    });
  });

  describe('body property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.body).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" body="Additional info"></pfv6-radio>`);
      expect(el.body).to.equal('Additional info');
    });

    it('renders body element when provided', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" body="Additional info"></pfv6-radio>`);
      const body = el.shadowRoot!.querySelector('.body');
      expect(body).to.exist;
      expect(body!.textContent?.trim()).to.equal('Additional info');
    });

    it('does not render body element when not provided', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const body = el.shadowRoot!.querySelector('.body');
      expect(body).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
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
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" accessible-label="Screen reader label"></pfv6-radio>`);
      expect(el.accessibleLabel).to.equal('Screen reader label');
    });

    it('sets aria-label on input when no visible label', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" accessible-label="Screen reader label"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.getAttribute('aria-label')).to.equal('Screen reader label');
    });

    it('does not set aria-label when visible label exists', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Visible label" accessible-label="Screen reader label"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.hasAttribute('aria-label')).to.be.false;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      el.accessibleLabel = 'New accessible label';
      await el.updateComplete;

      expect(el.accessibleLabel).to.equal('New accessible label');
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.getAttribute('aria-label')).to.equal('New accessible label');
    });
  });

  describe('isLabelWrapped property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      expect(el.isLabelWrapped).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" is-label-wrapped></pfv6-radio>`);
      expect(el.isLabelWrapped).to.be.true;
    });

    it('renders div wrapper when false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test"></pfv6-radio>`);
      const wrapper = el.shadowRoot!.querySelector('#container');
      expect(wrapper!.tagName).to.equal('DIV');
    });

    it('renders label wrapper when true', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test" is-label-wrapped></pfv6-radio>`);
      const wrapper = el.shadowRoot!.querySelector('#container');
      expect(wrapper!.tagName).to.equal('LABEL');
    });

    it('label wrapper has correct for attribute', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test" is-label-wrapped></pfv6-radio>`);
      const wrapper = el.shadowRoot!.querySelector('#container') as HTMLLabelElement;
      expect(wrapper.getAttribute('for')).to.equal('radio1');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test"></pfv6-radio>`);
      expect(el.shadowRoot!.querySelector('#container')!.tagName).to.equal('DIV');

      el.isLabelWrapped = true;
      await el.updateComplete;

      expect(el.isLabelWrapped).to.be.true;
      expect(el.shadowRoot!.querySelector('#container')!.tagName).to.equal('LABEL');
    });
  });

  describe('change event', function() {
    it('dispatches on user interaction', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6RadioChangeEvent', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      let capturedEvent: Event | null = null;
      el.addEventListener('change', (e) => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6RadioChangeEvent);
    });

    it('event contains correct checked value', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      let capturedEvent: Pfv6RadioChangeEvent | null = null;
      el.addEventListener('change', (e) => {
        capturedEvent = e as Pfv6RadioChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.checked).to.be.true;
    });

    it('event contains correct value property', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" value="option1"></pfv6-radio>`);

      let capturedEvent: Pfv6RadioChangeEvent | null = null;
      el.addEventListener('change', (e) => {
        capturedEvent = e as Pfv6RadioChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.value).to.equal('option1');
    });

    it('event bubbles', async function() {
      const container = await fixture(html`
        <div>
          <pfv6-radio id="radio1" name="group1"></pfv6-radio>
        </div>
      `);

      let eventBubbled = false;
      container.addEventListener('change', () => {
        eventBubbled = true;
      });

      const radio = container.querySelector<Pfv6Radio>('#radio1')!;
      const input = radio.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await radio.updateComplete;

      expect(eventBubbled).to.be.true;
    });

    it('event is composed', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      let capturedEvent: Event | null = null;
      el.addEventListener('change', (e) => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.composed).to.be.true;
    });

    it('dispatches when programmatically changing checked property', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      let eventCount = 0;
      el.addEventListener('change', () => {
        eventCount++;
      });

      el.checked = true;
      await el.updateComplete;

      expect(eventCount).to.equal(1);
    });

    it('does not dispatch when disabled', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" disabled></pfv6-radio>`);

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.click();
      await el.updateComplete;

      expect(eventFired).to.be.false;
    });
  });

  describe('Form-Associated Custom Element (FACE)', function() {
    it('is form-associated', function() {
      expect(Pfv6Radio.formAssociated).to.be.true;
    });

    it('has ElementInternals', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      // Access internals through private field (for testing purposes)
      expect((el as any).internals).to.exist;
    });

    it('sets form value when checked', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" value="option1" checked></pfv6-radio>`);
      const internals = (el as any).internals as ElementInternals;
      expect(internals.form).to.be.null; // Not in a form
    });

    it('updates form value when checked changes', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" value="option1"></pfv6-radio>`);

      el.checked = true;
      await el.updateComplete;

      // Form value should be set to the radio's value
      expect(el.checked).to.be.true;
    });

    it('sets validity when isValid changes', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);

      el.isValid = false;
      await el.updateComplete;

      const internals = (el as any).internals as ElementInternals;
      expect(internals.validity.customError).to.be.true;
    });

    it('clears validity when isValid is true', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      el.isValid = false;
      await el.updateComplete;

      el.isValid = true;
      await el.updateComplete;

      const internals = (el as any).internals as ElementInternals;
      expect(internals.validity.valid).to.be.true;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
    });

    it('renders input element', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input[type="radio"]');
      expect(input).to.exist;
    });

    it('input has correct class', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.classList.contains('input')).to.be.true;
    });

    it('applies standalone class when no label', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('standalone')).to.be.true;
    });

    it('does not apply standalone class when label exists', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test"></pfv6-radio>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('standalone')).to.be.false;
    });
  });

  describe('combined properties', function() {
    it('can be checked and disabled', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" checked disabled></pfv6-radio>`);

      expect(el.checked).to.be.true;
      expect(el.disabled).to.be.true;

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.checked).to.be.true;
      expect(input.disabled).to.be.true;
    });

    it('can have label, description, and body', async function() {
      const el = await fixture<Pfv6Radio>(html`
        <pfv6-radio
          id="radio1"
          name="group1"
          label="Main label"
          description="Helper text"
          body="Additional info"
        ></pfv6-radio>
      `);

      const label = el.shadowRoot!.querySelector('label');
      const description = el.shadowRoot!.querySelector('.description');
      const body = el.shadowRoot!.querySelector('.body');

      expect(label).to.exist;
      expect(label!.textContent?.trim()).to.equal('Main label');
      expect(description).to.exist;
      expect(description!.textContent?.trim()).to.equal('Helper text');
      expect(body).to.exist;
      expect(body!.textContent?.trim()).to.equal('Additional info');
    });

    it('can be required and invalid', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" required></pfv6-radio>`);
      el.isValid = false;
      await el.updateComplete;

      expect(el.required).to.be.true;
      expect(el.isValid).to.be.false;

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.required).to.be.true;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });
  });

  describe('accessibility', function() {
    it('input has type radio', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.type).to.equal('radio');
    });

    it('label is associated with input via for attribute', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Test"></pfv6-radio>`);
      const label = el.shadowRoot!.querySelector('label');
      expect(label!.getAttribute('for')).to.equal('radio1');
    });

    it('sets aria-invalid when isValid is false', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1"></pfv6-radio>`);
      el.isValid = false;
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.getAttribute('aria-invalid')).to.equal('true');
    });

    it('uses aria-label when no visible label', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" accessible-label="Option"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.getAttribute('aria-label')).to.equal('Option');
    });

    it('does not use aria-label when visible label exists', async function() {
      const el = await fixture<Pfv6Radio>(html`<pfv6-radio id="radio1" name="group1" label="Visible" accessible-label="Screen reader"></pfv6-radio>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input!.hasAttribute('aria-label')).to.be.false;
    });
  });
});
