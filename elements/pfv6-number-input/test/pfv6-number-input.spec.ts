import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6NumberInput, Pfv6NumberInputMinusEvent, Pfv6NumberInputPlusEvent, Pfv6NumberInputChangeEvent, Pfv6NumberInputBlurEvent } from '../pfv6-number-input.js';
import '../pfv6-number-input.js';

describe('<pfv6-number-input>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-number-input')).to.be.an.instanceof(Pfv6NumberInput);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-number-input'))
          .and
          .to.be.an.instanceOf(Pfv6NumberInput);
    });

    it('is a form-associated custom element', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(Pfv6NumberInput.formAssociated).to.be.true;
      expect(el.shadowRoot).to.exist;
    });
  });

  describe('value property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.value).to.equal(0);
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="42"></pfv6-number-input>`);
      expect(el.value).to.equal(42);
    });

    it('accepts empty string value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value=""></pfv6-number-input>`);
      expect(el.value).to.equal('');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.value).to.equal(0);

      el.value = 100;
      await el.updateComplete;

      expect(el.value).to.equal(100);
    });

    it('syncs to shadow DOM input element', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="25"></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.value).to.equal('25');
    });
  });

  describe('name property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.name).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input name="quantity"></pfv6-number-input>`);
      expect(el.name).to.equal('quantity');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input name="qty"></pfv6-number-input>`);
      expect(el.getAttribute('name')).to.equal('qty');
    });
  });

  describe('widthChars property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.widthChars).to.be.undefined;
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input width-chars="10"></pfv6-number-input>`);
      expect(el.widthChars).to.equal(10);
    });

    it('applies CSS custom property when set', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input width-chars="8"></pfv6-number-input>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-number-input--c-form-control--width-chars')).to.equal('8');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.widthChars).to.be.undefined;

      el.widthChars = 12;
      await el.updateComplete;

      expect(el.widthChars).to.equal(12);
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-number-input--c-form-control--width-chars')).to.equal('12');
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.disabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input disabled></pfv6-number-input>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input disabled></pfv6-number-input>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.disabled).to.be.false;

      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('disables both minus and plus buttons when true', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input disabled></pfv6-number-input>`);
      await el.updateComplete;

      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(buttons.length).to.equal(2);
      expect(buttons[0].hasAttribute('is-disabled')).to.be.true;
      expect(buttons[1].hasAttribute('is-disabled')).to.be.true;
    });

    it('disables internal input element', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input disabled></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });
  });

  describe('required property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.required).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input required></pfv6-number-input>`);
      expect(el.required).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input required></pfv6-number-input>`);
      expect(el.hasAttribute('required')).to.be.true;
    });

    it('applies required to internal input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input required></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.required).to.be.true;
    });
  });

  describe('readonly property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.readonly).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input readonly></pfv6-number-input>`);
      expect(el.readonly).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input readonly></pfv6-number-input>`);
      expect(el.hasAttribute('readonly')).to.be.true;
    });

    it('applies readonly to internal input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input readonly></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.readOnly).to.be.true;
    });
  });

  describe('step property', function() {
    it('defaults to 1', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.step).to.equal(1);
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input step="5"></pfv6-number-input>`);
      expect(el.step).to.equal(5);
    });

    it('applies step to internal input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input step="0.5"></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.step).to.equal('0.5');
    });
  });

  describe('validated property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.validated).to.equal('default');
    });

    it('accepts "error" value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input validated="error"></pfv6-number-input>`);
      expect(el.validated).to.equal('error');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input validated="warning"></pfv6-number-input>`);
      expect(el.validated).to.equal('warning');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input validated="success"></pfv6-number-input>`);
      expect(el.validated).to.equal('success');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input validated="error"></pfv6-number-input>`);
      expect(el.getAttribute('validated')).to.equal('error');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.validated).to.equal('default');

      el.validated = 'success';
      await el.updateComplete;

      expect(el.validated).to.equal('success');
      expect(el.getAttribute('validated')).to.equal('success');
    });

    it('passes validated state to pfv6-text-input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input validated="error"></pfv6-number-input>`);
      await el.updateComplete;

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input');
      expect(textInput).to.exist;
      expect(textInput!.getAttribute('validated')).to.equal('error');
    });

    it('sets aria-invalid on internal input when error', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input validated="error"></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });
  });

  describe('unit property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.unit).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input unit="%"></pfv6-number-input>`);
      expect(el.unit).to.equal('%');
    });

    it('renders unit when set', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input unit="kg"></pfv6-number-input>`);
      await el.updateComplete;

      const unitDiv = el.shadowRoot!.querySelector('#unit');
      expect(unitDiv).to.exist;
      expect(unitDiv!.textContent).to.equal('kg');
    });

    it('does not render unit when undefined', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      const unitDiv = el.shadowRoot!.querySelector('#unit');
      expect(unitDiv).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.unit).to.be.undefined;

      el.unit = 'lbs';
      await el.updateComplete;

      expect(el.unit).to.equal('lbs');
      const unitDiv = el.shadowRoot!.querySelector('#unit');
      expect(unitDiv!.textContent).to.equal('lbs');
    });
  });

  describe('unitPosition property', function() {
    it('defaults to "after"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.unitPosition).to.equal('after');
    });

    it('accepts "before" value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input unit-position="before"></pfv6-number-input>`);
      expect(el.unitPosition).to.equal('before');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input unit-position="before"></pfv6-number-input>`);
      expect(el.getAttribute('unit-position')).to.equal('before');
    });

    it('renders unit before input group when position is "before"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input unit="$" unit-position="before"></pfv6-number-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      const firstChild = container!.firstElementChild;
      expect(firstChild!.id).to.equal('unit');
    });

    it('renders unit after input group when position is "after"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input unit="%" unit-position="after"></pfv6-number-input>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      const lastChild = container!.lastElementChild;
      expect(lastChild!.id).to.equal('unit');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input unit="$"></pfv6-number-input>
      `);
      await el.updateComplete;
      expect(el.unitPosition).to.equal('after');

      el.unitPosition = 'before';
      await el.updateComplete;

      expect(el.unitPosition).to.equal('before');
      expect(el.getAttribute('unit-position')).to.equal('before');
    });
  });

  describe('min property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.min).to.be.undefined;
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input min="0"></pfv6-number-input>`);
      expect(el.min).to.equal(0);
    });

    it('disables minus button when value equals min', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="5" min="5"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [minusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(minusButton.hasAttribute('is-disabled')).to.be.true;
    });

    it('disables minus button when value is less than min', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="3" min="5"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [minusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(minusButton.hasAttribute('is-disabled')).to.be.true;
    });

    it('enables minus button when value is greater than min', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="10" min="5"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [minusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(minusButton.hasAttribute('is-disabled')).to.be.false;
    });

    it('applies min to internal input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input min="0"></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.min).to.equal('0');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.min).to.be.undefined;

      el.min = 10;
      await el.updateComplete;

      expect(el.min).to.equal(10);
    });
  });

  describe('max property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.max).to.be.undefined;
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input max="100"></pfv6-number-input>`);
      expect(el.max).to.equal(100);
    });

    it('disables plus button when value equals max', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="100" max="100"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [, plusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(plusButton.hasAttribute('is-disabled')).to.be.true;
    });

    it('disables plus button when value is greater than max', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="105" max="100"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [, plusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(plusButton.hasAttribute('is-disabled')).to.be.true;
    });

    it('enables plus button when value is less than max', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="50" max="100"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [, plusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(plusButton.hasAttribute('is-disabled')).to.be.false;
    });

    it('applies max to internal input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input max="100"></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.max).to.equal('100');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.max).to.be.undefined;

      el.max = 50;
      await el.updateComplete;

      expect(el.max).to.equal(50);
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to "Input"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.accessibleLabel).to.equal('Input');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input accessible-label="Quantity"></pfv6-number-input>
      `);
      expect(el.accessibleLabel).to.equal('Quantity');
    });

    it('applies to internal input aria-label', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input accessible-label="Amount"></pfv6-number-input>
      `);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).to.equal('Amount');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.accessibleLabel).to.equal('Input');

      el.accessibleLabel = 'Custom label';
      await el.updateComplete;

      expect(el.accessibleLabel).to.equal('Custom label');
    });
  });

  describe('minusBtnAccessibleLabel property', function() {
    it('defaults to "Minus"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.minusBtnAccessibleLabel).to.equal('Minus');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input minus-btn-accessible-label="Decrease"></pfv6-number-input>
      `);
      expect(el.minusBtnAccessibleLabel).to.equal('Decrease');
    });

    it('applies to minus button accessible-label', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input minus-btn-accessible-label="Decrement"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [minusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(minusButton.getAttribute('accessible-label')).to.equal('Decrement');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.minusBtnAccessibleLabel).to.equal('Minus');

      el.minusBtnAccessibleLabel = 'Subtract';
      await el.updateComplete;

      expect(el.minusBtnAccessibleLabel).to.equal('Subtract');
    });
  });

  describe('plusBtnAccessibleLabel property', function() {
    it('defaults to "Plus"', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.plusBtnAccessibleLabel).to.equal('Plus');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input plus-btn-accessible-label="Increase"></pfv6-number-input>
      `);
      expect(el.plusBtnAccessibleLabel).to.equal('Increase');
    });

    it('applies to plus button accessible-label', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input plus-btn-accessible-label="Increment"></pfv6-number-input>
      `);
      await el.updateComplete;

      const [, plusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(plusButton.getAttribute('accessible-label')).to.equal('Increment');
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      expect(el.plusBtnAccessibleLabel).to.equal('Plus');

      el.plusBtnAccessibleLabel = 'Add';
      await el.updateComplete;

      expect(el.plusBtnAccessibleLabel).to.equal('Add');
    });
  });

  describe('minus event', function() {
    it('dispatches when minus button is clicked', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('minus', () => {
        eventFired = true;
      });

      const [minusButtonEl] = el.shadowRoot!.querySelectorAll('pfv6-button');
      const minusButton = minusButtonEl.shadowRoot!.querySelector('button')!;
      minusButton.click();
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6NumberInputMinusEvent', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('minus', e => {
        capturedEvent = e;
      });

      const [minusButtonEl] = el.shadowRoot!.querySelectorAll('pfv6-button');
      const minusButton = minusButtonEl.shadowRoot!.querySelector('button')!;
      minusButton.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputMinusEvent);
    });

    it('event contains name when provided', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input name="quantity" value="10"></pfv6-number-input>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6NumberInputMinusEvent | undefined;
      el.addEventListener('minus', e => {
        capturedEvent = e as Pfv6NumberInputMinusEvent;
      });

      const [minusButtonEl] = el.shadowRoot!.querySelectorAll('pfv6-button');
      const minusButton = minusButtonEl.shadowRoot!.querySelector('button')!;
      minusButton.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputMinusEvent);
      expect(capturedEvent!.name).to.equal('quantity');
    });

    it('does not dispatch when minus button is disabled', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="5" min="5"></pfv6-number-input>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('minus', () => {
        eventFired = true;
      });

      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      const minusButton = buttons[0].shadowRoot!.querySelector('button')!;
      minusButton.click();
      await el.updateComplete;

      expect(eventFired).to.be.false;
    });

    it('dispatches when ArrowDown key is pressed on input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('minus', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });
  });

  describe('plus event', function() {
    it('dispatches when plus button is clicked', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('plus', () => {
        eventFired = true;
      });

      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      const plusButton = buttons[1].shadowRoot!.querySelector('button')!;
      plusButton.click();
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6NumberInputPlusEvent', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('plus', e => {
        capturedEvent = e;
      });

      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      const plusButton = buttons[1].shadowRoot!.querySelector('button')!;
      plusButton.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputPlusEvent);
    });

    it('event contains name when provided', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input name="quantity" value="10"></pfv6-number-input>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6NumberInputPlusEvent | undefined;
      el.addEventListener('plus', e => {
        capturedEvent = e as Pfv6NumberInputPlusEvent;
      });

      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      const plusButton = buttons[1].shadowRoot!.querySelector('button')!;
      plusButton.click();
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputPlusEvent);
      expect(capturedEvent!.name).to.equal('quantity');
    });

    it('does not dispatch when plus button is disabled', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="100" max="100"></pfv6-number-input>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('plus', () => {
        eventFired = true;
      });

      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      const plusButton = buttons[1].shadowRoot!.querySelector('button')!;
      plusButton.click();
      await el.updateComplete;

      expect(eventFired).to.be.false;
    });

    it('dispatches when ArrowUp key is pressed on input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('plus', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });
  });

  describe('change event', function() {
    it('dispatches when input value changes', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.value = '25';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6NumberInputChangeEvent', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.value = '42';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputChangeEvent);
    });

    it('event contains numeric value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Pfv6NumberInputChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6NumberInputChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.value = '55';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputChangeEvent);
      expect(capturedEvent!.value).to.equal(55);
    });

    it('event contains empty string when input is cleared', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Pfv6NumberInputChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6NumberInputChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputChangeEvent);
      expect(capturedEvent!.value).to.equal('');
    });
  });

  describe('input-blur event', function() {
    it('dispatches when input loses focus', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('input-blur', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.focus();
      input.blur();

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6NumberInputBlurEvent', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('input-blur', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.focus();
      input.blur();

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputBlurEvent);
    });

    it('event contains value', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input value="10"></pfv6-number-input>`);
      await el.updateComplete;

      let capturedEvent: Pfv6NumberInputBlurEvent | undefined;
      el.addEventListener('input-blur', e => {
        capturedEvent = e as Pfv6NumberInputBlurEvent;
      });

      const input = el.shadowRoot!.querySelector('input[type="number"]')! as HTMLInputElement;
      input.focus();
      input.blur();

      expect(capturedEvent).to.be.an.instanceof(Pfv6NumberInputBlurEvent);
      expect(capturedEvent!.value).to.equal(10);
    });
  });

  describe('FACE integration', function() {
    it('participates in form submission', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-number-input name="quantity" value="5"></pfv6-number-input>
        </form>
      `);
      await (form.querySelector('pfv6-number-input') as Pfv6NumberInput).updateComplete;

      const formData = new FormData(form);
      expect(formData.get('quantity')).to.equal('5');
    });

    it('does not submit when value is empty', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-number-input name="quantity" value=""></pfv6-number-input>
        </form>
      `);
      await (form.querySelector('pfv6-number-input') as Pfv6NumberInput).updateComplete;

      const formData = new FormData(form);
      expect(formData.get('quantity')).to.be.null;
    });

    it('updates form value when value changes', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-number-input name="quantity" value="5"></pfv6-number-input>
        </form>
      `);
      const el = form.querySelector('pfv6-number-input') as Pfv6NumberInput;
      await el.updateComplete;

      el.value = 10;
      await el.updateComplete;

      const formData = new FormData(form);
      expect(formData.get('quantity')).to.equal('10');
    });

    it('resets value on form reset', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-number-input name="quantity" value="5"></pfv6-number-input>
        </form>
      `);
      const el = form.querySelector('pfv6-number-input') as Pfv6NumberInput;
      await el.updateComplete;

      el.value = 99;
      await el.updateComplete;
      expect(el.value).to.equal(99);

      form.reset();
      await el.updateComplete;

      expect(el.value).to.equal(5);
    });

    it('responds to formDisabledCallback', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <fieldset>
            <pfv6-number-input name="quantity" value="5"></pfv6-number-input>
          </fieldset>
        </form>
      `);
      const fieldset = form.querySelector('fieldset')!;
      const el = form.querySelector('pfv6-number-input') as Pfv6NumberInput;
      await el.updateComplete;

      expect(el.disabled).to.be.false;

      fieldset.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container!.tagName).to.equal('DIV');
    });

    it('renders pfv6-input-group', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      const inputGroup = el.shadowRoot!.querySelector('pfv6-input-group');
      expect(inputGroup).to.exist;
    });

    it('renders three pfv6-input-group-item elements', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      const items = el.shadowRoot!.querySelectorAll('pfv6-input-group-item');
      expect(items.length).to.equal(3);
    });

    it('renders minus button with minus icon', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      const minusIcon = el.shadowRoot!.querySelector('#minus-icon');
      expect(minusIcon).to.exist;
      const svg = minusIcon!.querySelector('svg');
      expect(svg).to.exist;
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders plus button with plus icon', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      const plusIcon = el.shadowRoot!.querySelector('#plus-icon');
      expect(plusIcon).to.exist;
      const svg = plusIcon!.querySelector('svg');
      expect(svg).to.exist;
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders two pfv6-button elements with control variant', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button[variant="control"]');
      expect(buttons.length).to.equal(2);
    });

    it('renders internal number input', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]');
      expect(input).to.exist;
    });

    it('renders input within pfv6-text-input wrapper', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input');
      expect(textInput).to.exist;
    });
  });

  describe('accessibility', function() {
    it('minus icon has aria-hidden', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;
      const svg = el.shadowRoot!.querySelector('#minus-icon svg');
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('plus icon has aria-hidden', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;
      const svg = el.shadowRoot!.querySelector('#plus-icon svg');
      expect(svg!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('minus button has accessible label', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input minus-btn-accessible-label="Decrease value"></pfv6-number-input>
      `);
      await el.updateComplete;
      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(buttons[0].getAttribute('accessible-label')).to.equal('Decrease value');
    });

    it('plus button has accessible label', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input plus-btn-accessible-label="Increase value"></pfv6-number-input>
      `);
      await el.updateComplete;
      const buttons = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(buttons[1].getAttribute('accessible-label')).to.equal('Increase value');
    });

    it('internal input has aria-label', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input accessible-label="Quantity input"></pfv6-number-input>
      `);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]')!;
      expect(input.getAttribute('aria-label')).to.equal('Quantity input');
    });
  });

  describe('lifecycle', function() {
    it('updates when value property changes', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      el.value = 75;
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.value).to.equal('75');
    });

    it('updates when validated property changes', async function() {
      const el = await fixture<Pfv6NumberInput>(html`<pfv6-number-input></pfv6-number-input>`);
      await el.updateComplete;

      el.validated = 'success';
      await el.updateComplete;

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input');
      expect(textInput!.getAttribute('validated')).to.equal('success');
    });

    it('updates button states when min property changes', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="10"></pfv6-number-input>
      `);
      await el.updateComplete;

      el.min = 10;
      await el.updateComplete;

      const [minusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(minusButton.hasAttribute('is-disabled')).to.be.true;
    });

    it('updates button states when max property changes', async function() {
      const el = await fixture<Pfv6NumberInput>(html`
        <pfv6-number-input value="50"></pfv6-number-input>
      `);
      await el.updateComplete;

      el.max = 50;
      await el.updateComplete;

      const [, plusButton] = el.shadowRoot!.querySelectorAll('pfv6-button');
      expect(plusButton.hasAttribute('is-disabled')).to.be.true;
    });
  });
});
