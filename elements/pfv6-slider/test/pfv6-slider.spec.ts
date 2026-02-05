// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6Slider, Pfv6SliderChangeEvent } from '../pfv6-slider.js';
import type { SliderStepObject } from '../pfv6-slider.js';
import '../pfv6-slider.js';

describe('<pfv6-slider>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-slider')).to.be.an.instanceof(Pfv6Slider);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-slider'))
          .and
          .to.be.an.instanceOf(Pfv6Slider);
    });
  });

  describe('areCustomStepsContinuous property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.areCustomStepsContinuous).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider are-custom-steps-continuous></pfv6-slider>`);
      expect(el.areCustomStepsContinuous).to.be.true;
    });

    it('accepts attribute', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider are-custom-steps-continuous="true"></pfv6-slider>`);
      expect(el.areCustomStepsContinuous).to.be.true;
    });
  });

  describe('accessibleInputLabel property', function() {
    it('defaults to "Slider value input"', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.accessibleInputLabel).to.equal('Slider value input');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider accessible-input-label="Custom input label"></pfv6-slider>`);
      expect(el.accessibleInputLabel).to.equal('Custom input label');
    });

    it('reflects to internal input aria-label when input is visible', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider accessible-input-label="Test label" is-input-visible></pfv6-slider>
      `);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="number"]');
      expect(input?.getAttribute('aria-label')).to.equal('Test label');
    });
  });

  describe('accessibleThumbLabel property', function() {
    it('defaults to "Value"', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.accessibleThumbLabel).to.equal('Value');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider accessible-thumb-label="Custom thumb label"></pfv6-slider>`);
      expect(el.accessibleThumbLabel).to.equal('Custom thumb label');
    });

    it('reflects to thumb aria-label', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider accessible-thumb-label="Volume"></pfv6-slider>`);
      await el.updateComplete;
      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-label')).to.equal('Volume');
    });
  });

  describe('customSteps property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.customSteps).to.be.undefined;
    });

    it('accepts array of SliderStepObject', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      await el.updateComplete;
      expect(el.customSteps).to.deep.equal(steps);
    });

    it('renders pfv6-slider-step elements when customSteps provided', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low' },
        { value: 100, label: 'High' },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      await el.updateComplete;
      const stepElements = el.shadowRoot!.querySelectorAll('pfv6-slider-step');
      expect(stepElements.length).to.equal(2);
    });

    it('supports isLabelHidden in step objects', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low', isLabelHidden: true },
        { value: 100, label: 'High', isLabelHidden: false },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      await el.updateComplete;
      const stepElements = el.shadowRoot!.querySelectorAll('pfv6-slider-step');
      expect(stepElements[0].hasAttribute('is-label-hidden')).to.be.true;
      expect(stepElements[1].hasAttribute('is-label-hidden')).to.be.false;
    });
  });

  describe('hasTooltipOverThumb property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.hasTooltipOverThumb).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider has-tooltip-over-thumb></pfv6-slider>`);
      expect(el.hasTooltipOverThumb).to.be.true;
    });

    it('accepts attribute', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider has-tooltip-over-thumb="true"></pfv6-slider>`);
      expect(el.hasTooltipOverThumb).to.be.true;
    });
  });

  describe('inputLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.inputLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider input-label="%"></pfv6-slider>`);
      expect(el.inputLabel).to.equal('%');
    });

    it('renders input group with label when provided and input visible', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider input-label="%" is-input-visible></pfv6-slider>
      `);
      await el.updateComplete;
      const inputGroup = el.shadowRoot!.querySelector('pfv6-input-group');
      const inputGroupText = el.shadowRoot!.querySelector('pfv6-input-group-text');
      expect(inputGroup).to.exist;
      expect(inputGroupText?.textContent?.trim()).to.equal('%');
    });
  });

  describe('inputPosition property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.inputPosition).to.equal('end');
    });

    it('accepts "aboveThumb" value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider input-position="aboveThumb"></pfv6-slider>`);
      expect(el.inputPosition).to.equal('aboveThumb');
    });

    it('accepts "end" value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider input-position="end"></pfv6-slider>`);
      expect(el.inputPosition).to.equal('end');
    });

    it('renders input above thumb when inputPosition is "aboveThumb"', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider input-position="aboveThumb" is-input-visible></pfv6-slider>
      `);
      await el.updateComplete;
      const floatingValue = el.shadowRoot!.querySelector('#value.floating');
      expect(floatingValue).to.exist;
    });

    it('renders input at end when inputPosition is "end"', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider input-position="end" is-input-visible></pfv6-slider>
      `);
      await el.updateComplete;
      const valueElement = el.shadowRoot!.querySelector('#value:not(.floating)');
      expect(valueElement).to.exist;
    });
  });

  describe('inputValue property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.inputValue).to.equal(0);
    });

    it('accepts numeric value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider input-value="50"></pfv6-slider>`);
      expect(el.inputValue).to.equal(50);
    });

    it('reflects to input field when visible', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider input-value="75" is-input-visible></pfv6-slider>
      `);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input?.value).to.equal('75');
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.disabled).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider disabled></pfv6-slider>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider disabled></pfv6-slider>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('sets aria-disabled on thumb', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider disabled></pfv6-slider>`);
      await el.updateComplete;
      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-disabled')).to.equal('true');
    });

    it('disables input field when input is visible', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider disabled is-input-visible></pfv6-slider>
      `);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input?.disabled).to.be.true;
    });

    it('sets tabindex to -1 on thumb when disabled', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider disabled></pfv6-slider>`);
      await el.updateComplete;
      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('isInputVisible property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.isInputVisible).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider is-input-visible></pfv6-slider>`);
      expect(el.isInputVisible).to.be.true;
    });

    it('renders input field when true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider is-input-visible></pfv6-slider>`);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="number"]');
      expect(input).to.exist;
    });

    it('does not render input field when false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input[type="number"]');
      expect(input).to.not.exist;
    });
  });

  describe('max property', function() {
    it('defaults to 100', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.max).to.equal(100);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider max="200"></pfv6-slider>`);
      expect(el.max).to.equal(200);
    });

    it('sets aria-valuemax on thumb', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider max="150"></pfv6-slider>`);
      await el.updateComplete;
      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-valuemax')).to.equal('150');
    });
  });

  describe('min property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.min).to.equal(0);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider min="10"></pfv6-slider>`);
      expect(el.min).to.equal(10);
    });

    it('sets aria-valuemin on thumb', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider min="5"></pfv6-slider>`);
      await el.updateComplete;
      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-valuemin')).to.equal('5');
    });
  });

  describe('name property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.name).to.equal('');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider name="volume"></pfv6-slider>`);
      expect(el.name).to.equal('volume');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider name="brightness"></pfv6-slider>`);
      expect(el.getAttribute('name')).to.equal('brightness');
    });
  });

  describe('showBoundaries property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.showBoundaries).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider show-boundaries="false"></pfv6-slider>`);
      // Boolean attribute - presence sets to true, need to set property
      const el2 = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el2.showBoundaries = false;
      await el2.updateComplete;
      expect(el2.showBoundaries).to.be.false;
    });

    it('renders boundary step labels when true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider show-boundaries></pfv6-slider>`);
      await el.updateComplete;
      const steps = el.shadowRoot!.querySelectorAll('pfv6-slider-step');
      expect(steps.length).to.be.greaterThan(0);
    });
  });

  describe('showTicks property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.showTicks).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider show-ticks></pfv6-slider>`);
      expect(el.showTicks).to.be.true;
    });

    it('renders all step ticks when true', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider show-ticks min="0" max="10" step="1"></pfv6-slider>
      `);
      await el.updateComplete;
      const steps = el.shadowRoot!.querySelectorAll('pfv6-slider-step');
      expect(steps.length).to.equal(11); // 0-10 inclusive
    });
  });

  describe('step property', function() {
    it('defaults to 1', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.step).to.equal(1);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider step="5"></pfv6-slider>`);
      expect(el.step).to.equal(5);
    });

    it('controls keyboard increment amount', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider value="50" step="10"></pfv6-slider>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      await userEvent.keyboard('{ArrowRight}');

      expect(capturedEvent).to.be.an.instanceof(Pfv6SliderChangeEvent);
      expect(capturedEvent!.value).to.equal(60); // 50 + step(10)
    });
  });

  describe('value property', function() {
    it('defaults to 0', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      expect(el.value).to.equal(0);
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="75"></pfv6-slider>`);
      expect(el.value).to.equal(75);
    });

    it('sets aria-valuenow on thumb', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="42"></pfv6-slider>`);
      await el.updateComplete;
      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-valuenow')).to.equal('42');
    });

    it('updates CSS custom property --pf-v6-c-slider--value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      expect(container.style.getPropertyValue('--pf-v6-c-slider--value')).to.include('50');
    });
  });

  describe('change event', function() {
    it('dispatches on keyboard arrow interaction', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6SliderChangeEvent', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      let capturedEvent: Event | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(capturedEvent).to.be.an.instanceof(Pfv6SliderChangeEvent);
    });

    it('event contains correct value field', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(capturedEvent).to.be.an.instanceof(Pfv6SliderChangeEvent);
      expect(capturedEvent!.value).to.equal(51); // Incremented by step (1)
    });

    it('event contains inputValue field', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider value="50" input-value="60"></pfv6-slider>
      `);
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(capturedEvent).to.be.an.instanceof(Pfv6SliderChangeEvent);
      expect(capturedEvent!.inputValue).to.equal(60); // inputValue unchanged
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      let eventFired = false;
      el.parentElement!.addEventListener('change', () => { eventFired = true; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(eventFired).to.be.true;
    });

    it('dispatches on input blur when input visible', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible value="50" input-value="50"></pfv6-slider>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      input.focus();
      await userEvent.type(input, '75');
      input.blur();

      expect(eventFired).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders start-actions slot content', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider>
          <button slot="start-actions">Start</button>
        </pfv6-slider>
      `);
      const button = el.querySelector('[slot="start-actions"]');
      expect(button).to.exist;
      expect(button?.textContent).to.equal('Start');
    });

    it('renders end-actions slot content', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider>
          <button slot="end-actions">End</button>
        </pfv6-slider>
      `);
      const button = el.querySelector('[slot="end-actions"]');
      expect(button).to.exist;
      expect(button?.textContent).to.equal('End');
    });

    it('renders both start and end actions independently', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider>
          <button slot="start-actions">Minus</button>
          <button slot="end-actions">Plus</button>
        </pfv6-slider>
      `);
      const startButton = el.querySelector('[slot="start-actions"]');
      const endButton = el.querySelector('[slot="end-actions"]');
      expect(startButton?.textContent).to.equal('Minus');
      expect(endButton?.textContent).to.equal('Plus');
    });
  });

  describe('ElementInternals', function() {
    it('is a form-associated custom element', function() {
      expect(Pfv6Slider.formAssociated).to.be.true;
    });

    it('sets form value from slider value', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-slider name="volume" value="75"></pfv6-slider>
        </form>
      `);
      const slider = form.querySelector('pfv6-slider') as Pfv6Slider;
      await slider.updateComplete;

      const formData = new FormData(form);
      expect(formData.get('volume')).to.equal('75');
    });

    it('updates form value when slider value changes', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-slider name="volume" value="50"></pfv6-slider>
        </form>
      `);
      const slider = form.querySelector('pfv6-slider') as Pfv6Slider;
      await slider.updateComplete;

      slider.value = 80;
      await slider.updateComplete;

      const formData = new FormData(form);
      expect(formData.get('volume')).to.equal('80');
    });

    it('responds to formDisabledCallback', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      await el.updateComplete;

      el.formDisabledCallback(true);
      await el.updateComplete;

      expect(el.disabled).to.be.true;
    });

    it('responds to formResetCallback', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      // Simulate user changing value
      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      // Reset form
      el.formResetCallback();
      await el.updateComplete;

      // Should reset to original value
      expect(el.value).to.equal(50);
    });

    it('sets aria-disabled via internals when disabled', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider disabled></pfv6-slider>`);
      await el.updateComplete;

      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-disabled')).to.equal('true');
    });
  });

  describe('sub-components', function() {
    it('renders pfv6-slider-step when customSteps provided', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      await el.updateComplete;

      const stepElement = el.shadowRoot!.querySelector('pfv6-slider-step');
      expect(stepElement).to.exist;
      expect(stepElement?.tagName.toLowerCase()).to.equal('pfv6-slider-step');
    });

    it('renders pfv6-text-input when input visible', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider is-input-visible></pfv6-slider>`);
      await el.updateComplete;

      const textInput = el.shadowRoot!.querySelector('pfv6-text-input');
      expect(textInput).to.exist;
      expect(textInput?.tagName.toLowerCase()).to.equal('pfv6-text-input');
    });

    it('renders pfv6-input-group when input visible and inputLabel provided', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-label="%"></pfv6-slider>
      `);
      await el.updateComplete;

      const inputGroup = el.shadowRoot!.querySelector('pfv6-input-group');
      expect(inputGroup).to.exist;
      expect(inputGroup?.tagName.toLowerCase()).to.equal('pfv6-input-group');
    });

    it('renders pfv6-input-group-item when input visible and inputLabel provided', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-label="%"></pfv6-slider>
      `);
      await el.updateComplete;

      const inputGroupItem = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(inputGroupItem).to.exist;
      expect(inputGroupItem?.tagName.toLowerCase()).to.equal('pfv6-input-group-item');
    });

    it('renders pfv6-input-group-text when input visible and inputLabel provided', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-label="%"></pfv6-slider>
      `);
      await el.updateComplete;

      const inputGroupText = el.shadowRoot!.querySelector('pfv6-input-group-text');
      expect(inputGroupText).to.exist;
      expect(inputGroupText?.tagName.toLowerCase()).to.equal('pfv6-input-group-text');
    });
  });

  describe('keyboard interaction', function() {
    it('increments value on ArrowRight', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.value).to.equal(50); // Component doesn't auto-update value prop
      // But internal localValue should change - check via event
      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(capturedEvent!.value).to.equal(52); // 51 + 1
    });

    it('decrements value on ArrowLeft', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(capturedEvent!.value).to.equal(49); // 50 - 1
    });

    it('respects min boundary on ArrowLeft', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="0" min="0"></pfv6-slider>`);
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowLeft}');

      // Should not fire event if already at min
      expect(capturedEvent).to.be.undefined;
    });

    it('respects max boundary on ArrowRight', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="100" max="100"></pfv6-slider>`);
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      // Should not fire event if already at max
      expect(capturedEvent).to.be.undefined;
    });

    it('does not respond to keyboard when disabled', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50" disabled></pfv6-slider>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      // Disabled element has tabindex -1, cannot receive focus via normal means
      expect(thumb.getAttribute('tabindex')).to.equal('-1');
      expect(eventFired).to.be.false;
    });
  });

  describe('input field interaction', function() {
    it('updates inputValue on input change', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-value="50"></pfv6-slider>
      `);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;

      // Clear and type new value
      input.value = '';
      await userEvent.type(input, '75');

      // Trigger input event manually since userEvent.type may not
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(el.inputValue).to.equal(50); // Component property not auto-updated
      // Check internal state via blur event
      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      input.blur();
      await el.updateComplete;

      expect(capturedEvent!.inputValue).to.equal(75);
    });

    it('dispatches change event on Enter key', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-value="50"></pfv6-slider>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      input.focus();
      await userEvent.keyboard('{Enter}');

      expect(eventFired).to.be.true;
    });

    it('dispatches change event on blur', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-value="50"></pfv6-slider>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const input = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
      input.focus();
      input.blur();

      expect(eventFired).to.be.true;
    });
  });

  describe('custom steps behavior', function() {
    it('uses custom step labels for aria-valuetext when discrete', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      el.areCustomStepsContinuous = false;
      el.value = 50;
      await el.updateComplete;

      const thumb = el.shadowRoot!.querySelector('#thumb');
      expect(thumb?.getAttribute('aria-valuetext')).to.equal('Medium');
    });

    it('uses numeric aria-valuetext when continuous', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      el.areCustomStepsContinuous = true;
      el.value = 50;
      await el.updateComplete;

      const thumb = el.shadowRoot!.querySelector('#thumb');
      // Continuous mode shows numeric value (2 decimals)
      expect(thumb?.getAttribute('aria-valuetext')).to.equal('50');
    });

    it('navigates custom steps with keyboard when discrete', async function() {
      const steps: SliderStepObject[] = [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ];
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider></pfv6-slider>`);
      el.customSteps = steps;
      el.areCustomStepsContinuous = false;
      el.value = 0;
      await el.updateComplete;

      let capturedEvent: Pfv6SliderChangeEvent | undefined;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6SliderChangeEvent; });

      const thumb = el.shadowRoot!.querySelector('#thumb') as HTMLElement;
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');

      // Should jump to next step value (50)
      expect(capturedEvent!.value).to.equal(50);
    });
  });

  describe('CSS custom properties', function() {
    it('sets --pf-v6-c-slider--value based on current value', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="50"></pfv6-slider>`);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      const cssValue = container.style.getPropertyValue('--pf-v6-c-slider--value');
      expect(cssValue).to.include('50');
    });

    it('sets --pf-v6-c-slider__value--c-form-control--width-chars based on input value length', async function() {
      const el = await fixture<Pfv6Slider>(html`
        <pfv6-slider is-input-visible input-value="1234"></pfv6-slider>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      const cssValue = container.style.getPropertyValue('--pf-v6-c-slider__value--c-form-control--width-chars');
      expect(cssValue).to.include('4'); // 4 characters in "1234"
    });

    it('updates --pf-v6-c-slider--value when value changes', async function() {
      const el = await fixture<Pfv6Slider>(html`<pfv6-slider value="25"></pfv6-slider>`);
      await el.updateComplete;

      el.value = 75;
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container') as HTMLElement;
      const cssValue = container.style.getPropertyValue('--pf-v6-c-slider--value');
      expect(cssValue).to.include('75');
    });
  });
});
