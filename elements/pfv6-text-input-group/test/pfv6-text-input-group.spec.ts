import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6TextInputGroup } from '../pfv6-text-input-group.js';
import { Pfv6TextInputGroupMain, Pfv6TextInputGroupMainChangeEvent } from '../pfv6-text-input-group-main.js';
import { Pfv6TextInputGroupUtilities } from '../pfv6-text-input-group-utilities.js';
import { Pfv6TextInputGroupIcon } from '../pfv6-text-input-group-icon.js';
import '../pfv6-text-input-group.js';

/**
 * Test helper element that implements the ComboboxOption interface.
 *
 * TODO: Remove this helper and replace with pfv6-select-option once
 * the Select component is converted. See README.md for details.
 */
class TestOption extends HTMLElement {
  value = '';
  selected = false;
  active = false;

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(name: string, _old: string, value: string) {
    if (name === 'value') {
      this.value = value;
    }
  }

  connectedCallback() {
    this.value = this.getAttribute('value') ?? '';
  }
}
customElements.define('test-option', TestOption);

/**
 * Helper to simulate typing into an input
 * @param input - The input element to fill
 * @param value - The value to set
 */
function fillInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
import '../pfv6-text-input-group-main.js';
import '../pfv6-text-input-group-utilities.js';
import '../pfv6-text-input-group-icon.js';

describe('<pfv6-text-input-group>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-text-input-group')).to.be.an.instanceof(Pfv6TextInputGroup);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-text-input-group'))
          .and
          .to.be.an.instanceOf(Pfv6TextInputGroup);
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      expect(el.isDisabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group is-disabled></pfv6-text-input-group>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group is-disabled></pfv6-text-input-group>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('applies disabled class when true', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group is-disabled></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
    });

    it('does not apply disabled class when false', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.false;
    });

    it('updates disabled class dynamically', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.false;

      el.isDisabled = true;
      await el.updateComplete;

      expect(container!.classList.contains('disabled')).to.be.true;
    });
  });

  describe('isPlain property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      expect(el.isPlain).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group is-plain></pfv6-text-input-group>`);
      expect(el.isPlain).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group is-plain></pfv6-text-input-group>`);
      expect(el.hasAttribute('is-plain')).to.be.true;
    });

    it('applies plain class when true', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group is-plain></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('does not apply plain class when false', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.false;
    });

    it('updates plain class dynamically', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.false;

      el.isPlain = true;
      await el.updateComplete;

      expect(container!.classList.contains('plain')).to.be.true;
    });
  });

  describe('validated property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      expect(el.validated).to.be.undefined;
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="success"></pfv6-text-input-group>`);
      expect(el.validated).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="warning"></pfv6-text-input-group>`);
      expect(el.validated).to.equal('warning');
    });

    it('accepts "error" value', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="error"></pfv6-text-input-group>`);
      expect(el.validated).to.equal('error');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="success"></pfv6-text-input-group>`);
      expect(el.getAttribute('validated')).to.equal('success');
    });

    it('applies success class when validated="success"', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="success"></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.true;
    });

    it('applies warning class when validated="warning"', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="warning"></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('warning')).to.be.true;
    });

    it('applies error class when validated="error"', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group validated="error"></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.true;
    });

    it('does not apply validation classes when undefined', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('success')).to.be.false;
      expect(container!.classList.contains('warning')).to.be.false;
      expect(container!.classList.contains('error')).to.be.false;
    });

    it('updates validation class dynamically', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('error')).to.be.false;

      el.validated = 'error';
      await el.updateComplete;

      expect(container!.classList.contains('error')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      const main = el.querySelector('pfv6-text-input-group-main');
      expect(main).to.exist;
    });

    it('renders multiple children in default slot', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
          <pfv6-text-input-group-utilities>
            <button>Search</button>
          </pfv6-text-input-group-utilities>
        </pfv6-text-input-group>
      `);
      const main = el.querySelector('pfv6-text-input-group-main');
      const utilities = el.querySelector('pfv6-text-input-group-utilities');

      expect(main).to.exist;
      expect(utilities).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element with id="container"', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('div#container');
      expect(container).to.exist;
    });

    it('container contains default slot', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`<pfv6-text-input-group></pfv6-text-input-group>`);
      const container = el.shadowRoot!.querySelector('div#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('context propagation', function() {
    it('provides isDisabled context to children', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group is-disabled>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const input = main.shadowRoot!.querySelector('input');
      expect(input!.disabled).to.be.true;
    });

    it('provides validated context to children', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group validated="warning">
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      // Warning status should show warning icon
      const statusIcon = main.shadowRoot!.querySelector('pfv6-text-input-group-icon[is-status]');
      expect(statusIcon).to.exist;
    });

    it('updates context when properties change', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const input = main.shadowRoot!.querySelector('input');
      expect(input!.disabled).to.be.false;

      el.isDisabled = true;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      expect(input!.disabled).to.be.true;
    });
  });

  describe('combined properties', function() {
    it('can combine isDisabled and isPlain', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group is-disabled is-plain></pfv6-text-input-group>
      `);
      expect(el.isDisabled).to.be.true;
      expect(el.isPlain).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('can combine isPlain and validated', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group is-plain validated="error"></pfv6-text-input-group>
      `);
      expect(el.isPlain).to.be.true;
      expect(el.validated).to.equal('error');

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.true;
      expect(container!.classList.contains('error')).to.be.true;
    });

    it('can combine all properties', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group is-disabled is-plain validated="success"></pfv6-text-input-group>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
      expect(container!.classList.contains('success')).to.be.true;
    });
  });

  describe('integration with sub-components', function() {
    it('works with pfv6-text-input-group-main', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      const main = el.querySelector('pfv6-text-input-group-main');
      expect(main).to.exist;
    });

    it('works with pfv6-text-input-group-utilities', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
          <pfv6-text-input-group-utilities>
            <button>Search</button>
          </pfv6-text-input-group-utilities>
        </pfv6-text-input-group>
      `);
      const utilities = el.querySelector('pfv6-text-input-group-utilities');
      expect(utilities).to.exist;
    });

    it('works with complete composition', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main value="test input"></pfv6-text-input-group-main>
          <pfv6-text-input-group-utilities>
            <button aria-label="Clear">×</button>
          </pfv6-text-input-group-utilities>
        </pfv6-text-input-group>
      `);
      const main = el.querySelector('pfv6-text-input-group-main');
      const utilities = el.querySelector('pfv6-text-input-group-utilities');
      const button = utilities!.querySelector('button');

      expect(main).to.exist;
      expect(utilities).to.exist;
      expect(button).to.exist;
      expect(button!.textContent).to.equal('×');
    });
  });
});

describe('<pfv6-text-input-group-main>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-text-input-group-main')).to.be.an.instanceof(Pfv6TextInputGroupMain);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-text-input-group-main'))
          .and
          .to.be.an.instanceOf(Pfv6TextInputGroupMain);
    });
  });

  describe('type property', function() {
    it('defaults to "text"', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('text');
    });

    it('accepts "email" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="email"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('email');
    });

    it('accepts "password" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="password"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('password');
    });

    it('accepts "search" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="search"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('search');
    });

    it('accepts "tel" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="tel"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('tel');
    });

    it('accepts "url" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="url"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('url');
    });

    it('accepts "number" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="number"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('number');
    });

    it('accepts "date" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="date"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('date');
    });

    it('accepts "datetime-local" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="datetime-local"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('datetime-local');
    });

    it('accepts "month" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="month"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('month');
    });

    it('accepts "time" value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="time"></pfv6-text-input-group-main>`);
      expect(el.type).to.equal('time');
    });

    it('applies type to input element', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main type="email"></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.type).to.equal('email');
    });
  });

  describe('hint property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.hint).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main hint="example@email.com"></pfv6-text-input-group-main>`);
      expect(el.hint).to.equal('example@email.com');
    });

    it('renders hint input when set', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main hint="example@email.com"></pfv6-text-input-group-main>`);
      const hintInput = el.shadowRoot!.querySelector('input#hint-input') as HTMLInputElement;
      expect(hintInput).to.exist;
      expect(hintInput.value).to.equal('example@email.com');
    });

    it('does not render hint input when undefined', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const hintInput = el.shadowRoot!.querySelector('input#hint-input');
      expect(hintInput).to.not.exist;
    });

    it('hint input is disabled and aria-hidden', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main hint="test hint"></pfv6-text-input-group-main>`);
      const hintInput = el.shadowRoot!.querySelector('input#hint-input') as HTMLInputElement;
      expect(hintInput.disabled).to.be.true;
      expect(hintInput.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to "Type to filter"', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.accessibleLabel).to.equal('Type to filter');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main accessible-label="Search users"></pfv6-text-input-group-main>`);
      expect(el.accessibleLabel).to.equal('Search users');
    });

    it('renders label element with accessibleLabel text', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main accessible-label="Search users"></pfv6-text-input-group-main>`);
      const label = el.shadowRoot!.querySelector('label#label') as HTMLLabelElement;
      expect(label).to.exist;
      expect(label.textContent).to.equal('Search users');
      expect(label.getAttribute('for')).to.equal('input');
    });
  });

  describe('value property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.value).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main value="test value"></pfv6-text-input-group-main>`);
      expect(el.value).to.equal('test value');
    });

    it('applies to input element', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main value="test value"></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.value).to.equal('test value');
    });

    it('updates when input changes', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;

      input.value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(el.value).to.equal('new value');
    });
  });

  describe('placeholder property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.placeholder).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main placeholder="Enter text"></pfv6-text-input-group-main>`);
      expect(el.placeholder).to.equal('Enter text');
    });

    it('applies to input element', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main placeholder="Enter text"></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.placeholder).to.equal('Enter text');
    });
  });

  describe('name property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.name).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main name="username"></pfv6-text-input-group-main>`);
      expect(el.name).to.equal('username');
    });

    it('applies to input element', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main name="username"></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.name).to.equal('username');
    });
  });

  describe('expanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      expect(el.expanded).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main expanded></pfv6-text-input-group-main>`);
      expect(el.expanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main expanded></pfv6-text-input-group-main>`);
      expect(el.hasAttribute('expanded')).to.be.true;
    });
  });

  describe('change event', function() {
    it('dispatches on input change', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      fillInput(input, 'test');

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6TextInputGroupMainChangeEvent', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let capturedEvent: Event | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      fillInput(input, 'test');

      expect(capturedEvent).to.be.an.instanceof(Pfv6TextInputGroupMainChangeEvent);
    });

    it('event contains new value as class field', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let capturedEvent: Pfv6TextInputGroupMainChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6TextInputGroupMainChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      fillInput(input, 'new value');

      expect(capturedEvent!.value).to.equal('new value');
    });

    it('event contains original event as class field', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let capturedEvent: Pfv6TextInputGroupMainChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6TextInputGroupMainChangeEvent;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      fillInput(input, 'test');

      expect(capturedEvent!.originalEvent).to.be.an.instanceof(Event);
    });

    it('event bubbles and is composed', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let capturedEvent: Event | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      fillInput(input, 'test');

      expect(capturedEvent!.bubbles).to.be.true;
      expect(capturedEvent!.composed).to.be.true;
    });

    it('updates value property on input', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;

      fillInput(input, 'updated value');
      await el.updateComplete;

      expect(el.value).to.equal('updated value');
    });
  });

  describe('icon slot', function() {
    it('renders icon slot content', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <svg slot="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </pfv6-text-input-group-main>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon).to.exist;
    });

    it('wraps icon in pfv6-text-input-group-icon when slotted', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <svg slot="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const iconWrapper = el.shadowRoot!.querySelector('pfv6-text-input-group-icon');
      expect(iconWrapper).to.exist;
    });

    it('applies icon class to container when icon is slotted', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <svg slot="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('icon')).to.be.true;
    });

    it('does not apply icon class when no icon slotted', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('icon')).to.be.false;
    });
  });

  describe('status icon rendering', function() {
    it('renders status icon for success validation', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group validated="success">
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const statusIcon = main.shadowRoot!.querySelector('pfv6-text-input-group-icon[is-status]');
      expect(statusIcon).to.exist;
    });

    it('renders status icon for warning validation', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group validated="warning">
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const statusIcon = main.shadowRoot!.querySelector('pfv6-text-input-group-icon[is-status]');
      expect(statusIcon).to.exist;
    });

    it('renders status icon for error validation', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group validated="error">
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const statusIcon = main.shadowRoot!.querySelector('pfv6-text-input-group-icon[is-status]');
      expect(statusIcon).to.exist;
    });

    it('does not render status icon when not validated', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const statusIcon = main.shadowRoot!.querySelector('pfv6-text-input-group-icon[is-status]');
      expect(statusIcon).to.not.exist;
    });
  });

  describe('disabled state from context', function() {
    it('input is disabled when parent is disabled', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group is-disabled>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      // Wait for context to propagate
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const input = main.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('input is not disabled when parent is not disabled', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group>
          <pfv6-text-input-group-main></pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      // Wait for context to propagate
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const input = main.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.disabled).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <span>Additional content</span>
        </pfv6-text-input-group-main>
      `);
      const span = el.querySelector('span');
      expect(span).to.exist;
      expect(span!.textContent).to.equal('Additional content');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element with id="container"', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const container = el.shadowRoot!.querySelector('div#container');
      expect(container).to.exist;
    });

    it('renders span element with id="text"', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const text = el.shadowRoot!.querySelector('span#text');
      expect(text).to.exist;
    });

    it('renders input element with id="input"', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const input = el.shadowRoot!.querySelector('input#input');
      expect(input).to.exist;
    });

    it('renders label element with id="label" linked to input', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const label = el.shadowRoot!.querySelector('label#label');
      expect(label).to.exist;
      expect(label!.getAttribute('for')).to.equal('input');
    });

    it('label contains default accessibleLabel text', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      const label = el.shadowRoot!.querySelector('label#label');
      expect(label!.textContent).to.equal('Type to filter');
    });
  });

  describe('options slot', function() {
    it('accepts option elements in options slot', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="option1">Option 1</test-option>
          <test-option slot="options" value="option2">Option 2</test-option>
        </pfv6-text-input-group-main>
      `);
      expect(el.options.length).to.equal(2);
    });

    it('options getter returns elements with value property', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="test">Test Option</test-option>
        </pfv6-text-input-group-main>
      `);
      expect(el.options[0].value).to.equal('test');
    });

    it('options have selected and active properties', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="test">Test Option</test-option>
        </pfv6-text-input-group-main>
      `);
      const [option] = el.options;
      expect(option.selected).to.be.false;
      expect(option.active).to.be.false;
    });
  });

  describe('combobox behavior', function() {
    it('dispatches open event when listbox opens', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);
      let openFired = false;
      el.addEventListener('open', () => {
        openFired = true;
      });

      el.expanded = true;
      await el.updateComplete;

      expect(openFired).to.be.true;
    });

    it('dispatches close event when listbox closes', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main expanded>
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener('close', () => {
        closeFired = true;
      });

      el.expanded = false;
      await el.updateComplete;

      expect(closeFired).to.be.true;
    });

    it('listbox container is hidden when not expanded', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const listboxContainer = el.shadowRoot!.querySelector('#listbox-container');
      expect(listboxContainer).to.exist;
      expect(listboxContainer!.hasAttribute('hidden')).to.be.true;
    });

    it('listbox container is visible when expanded', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main expanded>
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const listboxContainer = el.shadowRoot!.querySelector('#listbox-container');
      expect(listboxContainer).to.exist;
      expect(listboxContainer!.hasAttribute('hidden')).to.be.false;
    });

    it('renders listbox with role="listbox"', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const listbox = el.shadowRoot!.querySelector('#listbox');
      expect(listbox).to.exist;
      expect(listbox!.getAttribute('role')).to.equal('listbox');
    });

    it('listbox has accessible label', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main accessible-label="Search options">
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const listbox = el.shadowRoot!.querySelector('#listbox');
      expect(listbox!.getAttribute('aria-label')).to.equal('Search options');
    });

    it('options getter returns TestOption elements with value property', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="first">First</test-option>
          <test-option slot="options" value="second">Second</test-option>
          <test-option slot="options" value="third">Third</test-option>
        </pfv6-text-input-group-main>
      `);

      expect(el.options.length).to.equal(3);
      expect(el.options[0].value).to.equal('first');
      expect(el.options[1].value).to.equal('second');
      expect(el.options[2].value).to.equal('third');
    });

    it('does not render listbox when no options are slotted', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main></pfv6-text-input-group-main>
      `);
      await el.updateComplete;

      const listboxContainer = el.shadowRoot!.querySelector('#listbox-container');
      expect(listboxContainer).to.not.exist;
    });

    it('combobox is disabled when form-level disabled', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`
        <pfv6-text-input-group-main>
          <test-option slot="options" value="option1">Option 1</test-option>
        </pfv6-text-input-group-main>
      `);

      el.formDisabledCallback(true);
      await el.updateComplete;

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('combobox is disabled when context isDisabled is true', async function() {
      const el = await fixture<Pfv6TextInputGroup>(html`
        <pfv6-text-input-group is-disabled>
          <pfv6-text-input-group-main>
            <test-option slot="options" value="option1">Option 1</test-option>
          </pfv6-text-input-group-main>
        </pfv6-text-input-group>
      `);
      await el.updateComplete;
      const main = el.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;
      await new Promise(resolve => setTimeout(resolve, 0));
      await main.updateComplete;

      const input = main.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });
  });

  describe('focus event', function() {
    it('dispatches focus event when input receives focus', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let eventCount = 0;
      el.addEventListener('focus', () => {
        eventCount++;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      input.focus();

      // Our custom event should fire
      expect(eventCount).to.be.greaterThan(0);
    });
  });

  describe('blur event', function() {
    it('dispatches blur event when input loses focus', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      let eventCount = 0;
      el.addEventListener('blur', () => {
        eventCount++;
      });

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      input.focus();
      input.blur();

      // Our custom event should fire
      expect(eventCount).to.be.greaterThan(0);
    });
  });

  describe('form association (FACE)', function() {
    it('has static formAssociated = true', function() {
      expect(Pfv6TextInputGroupMain.formAssociated).to.be.true;
    });

    it('participates in form submission', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-text-input-group-main name="test-input" value="test-value"></pfv6-text-input-group-main>
        </form>
      `);
      const formData = new FormData(form);
      expect(formData.get('test-input')).to.equal('test-value');
    });

    it('resets value on form reset', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-text-input-group-main name="test-input" value="initial"></pfv6-text-input-group-main>
        </form>
      `);
      const el = form.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;

      el.value = 'changed';
      await el.updateComplete;
      expect(el.value).to.equal('changed');

      form.reset();
      await el.updateComplete;
      expect(el.value).to.equal('initial');
    });

    it('updates form value when value changes', async function() {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <pfv6-text-input-group-main name="test-input" value="initial"></pfv6-text-input-group-main>
        </form>
      `);
      const el = form.querySelector('pfv6-text-input-group-main') as Pfv6TextInputGroupMain;

      el.value = 'updated';
      await el.updateComplete;

      const formData = new FormData(form);
      expect(formData.get('test-input')).to.equal('updated');
    });

    it('delegates focus to internal input', async function() {
      const el = await fixture<Pfv6TextInputGroupMain>(html`<pfv6-text-input-group-main></pfv6-text-input-group-main>`);
      el.focus();

      const input = el.shadowRoot!.querySelector('input#input') as HTMLInputElement;
      expect(document.activeElement).to.equal(el);
      expect(el.shadowRoot!.activeElement).to.equal(input);
    });
  });
});

describe('<pfv6-text-input-group-utilities>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-text-input-group-utilities')).to.be.an.instanceof(Pfv6TextInputGroupUtilities);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TextInputGroupUtilities>(html`<pfv6-text-input-group-utilities></pfv6-text-input-group-utilities>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-text-input-group-utilities'))
          .and
          .to.be.an.instanceOf(Pfv6TextInputGroupUtilities);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6TextInputGroupUtilities>(html`
        <pfv6-text-input-group-utilities>
          <button>Search</button>
        </pfv6-text-input-group-utilities>
      `);
      const button = el.querySelector('button');
      expect(button).to.exist;
      expect(button!.textContent).to.equal('Search');
    });

    it('renders multiple utility elements', async function() {
      const el = await fixture<Pfv6TextInputGroupUtilities>(html`
        <pfv6-text-input-group-utilities>
          <button aria-label="Clear">×</button>
          <button>Search</button>
        </pfv6-text-input-group-utilities>
      `);
      const buttons = el.querySelectorAll('button');
      expect(buttons.length).to.equal(2);
      expect(buttons[0].textContent).to.equal('×');
      expect(buttons[1].textContent).to.equal('Search');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element with id="container"', async function() {
      const el = await fixture<Pfv6TextInputGroupUtilities>(html`<pfv6-text-input-group-utilities></pfv6-text-input-group-utilities>`);
      const container = el.shadowRoot!.querySelector('div#container');
      expect(container).to.exist;
    });

    it('container contains default slot', async function() {
      const el = await fixture<Pfv6TextInputGroupUtilities>(html`<pfv6-text-input-group-utilities></pfv6-text-input-group-utilities>`);
      const container = el.shadowRoot!.querySelector('div#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('<pfv6-text-input-group-icon>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-text-input-group-icon')).to.be.an.instanceof(Pfv6TextInputGroupIcon);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon></pfv6-text-input-group-icon>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-text-input-group-icon'))
          .and
          .to.be.an.instanceOf(Pfv6TextInputGroupIcon);
    });
  });

  describe('isStatus property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon></pfv6-text-input-group-icon>`);
      expect(el.isStatus).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon is-status></pfv6-text-input-group-icon>`);
      expect(el.isStatus).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon is-status></pfv6-text-input-group-icon>`);
      expect(el.hasAttribute('is-status')).to.be.true;
    });

    it('applies status class when true', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon is-status></pfv6-text-input-group-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('status')).to.be.true;
    });

    it('does not apply status class when false', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon></pfv6-text-input-group-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('status')).to.be.false;
    });

    it('updates status class dynamically', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon></pfv6-text-input-group-icon>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('status')).to.be.false;

      el.isStatus = true;
      await el.updateComplete;

      expect(container!.classList.contains('status')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`
        <pfv6-text-input-group-icon>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </pfv6-text-input-group-icon>
      `);
      const svg = el.querySelector('svg');
      expect(svg).to.exist;
    });

    it('renders icon content for status icons', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`
        <pfv6-text-input-group-icon is-status>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10"></path>
          </svg>
        </pfv6-text-input-group-icon>
      `);
      const svg = el.querySelector('svg');
      expect(svg).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders span element with id="container"', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon></pfv6-text-input-group-icon>`);
      const container = el.shadowRoot!.querySelector('span#container');
      expect(container).to.exist;
    });

    it('container contains default slot', async function() {
      const el = await fixture<Pfv6TextInputGroupIcon>(html`<pfv6-text-input-group-icon></pfv6-text-input-group-icon>`);
      const container = el.shadowRoot!.querySelector('span#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});
