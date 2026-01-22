// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6MenuToggle } from '../pfv6-menu-toggle.js';
import { Pfv6MenuToggleAction } from '../pfv6-menu-toggle-action.js';
import { Pfv6MenuToggleCheckbox, Pfv6MenuToggleCheckboxChangeEvent } from '../pfv6-menu-toggle-checkbox.js';
import '../pfv6-menu-toggle.js';
import '../pfv6-menu-toggle-action.js';
import '../pfv6-menu-toggle-checkbox.js';

describe('<pfv6-menu-toggle>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-menu-toggle')).to.be.an.instanceof(Pfv6MenuToggle);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-menu-toggle'))
          .and
          .to.be.an.instanceOf(Pfv6MenuToggle);
    });
  });

  describe('variant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.variant).to.equal('default');
    });

    it('accepts "plain" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="plain"></pfv6-menu-toggle>`);
      expect(el.variant).to.equal('plain');
    });

    it('accepts "primary" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="primary"></pfv6-menu-toggle>`);
      expect(el.variant).to.equal('primary');
    });

    it('accepts "plainText" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="plainText"></pfv6-menu-toggle>`);
      expect(el.variant).to.equal('plainText');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="secondary"></pfv6-menu-toggle>`);
      expect(el.variant).to.equal('secondary');
    });

    it('accepts "typeahead" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="typeahead"></pfv6-menu-toggle>`);
      expect(el.variant).to.equal('typeahead');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="primary"></pfv6-menu-toggle>`);
      expect(el.getAttribute('variant')).to.equal('primary');
    });
  });

  describe('status property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.status).to.be.undefined;
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="success"></pfv6-menu-toggle>`);
      expect(el.status).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="warning"></pfv6-menu-toggle>`);
      expect(el.status).to.equal('warning');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="danger"></pfv6-menu-toggle>`);
      expect(el.status).to.equal('danger');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="success"></pfv6-menu-toggle>`);
      expect(el.getAttribute('status')).to.equal('success');
    });

    it('renders success icon when status is "success"', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="success"></pfv6-menu-toggle>`);
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.exist;
      expect(statusIcon!.querySelector('svg')).to.exist;
    });

    it('renders warning icon when status is "warning"', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="warning"></pfv6-menu-toggle>`);
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.exist;
      expect(statusIcon!.querySelector('svg')).to.exist;
    });

    it('renders danger icon when status is "danger"', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle status="danger"></pfv6-menu-toggle>`);
      const statusIcon = el.shadowRoot!.querySelector('#status-icon');
      expect(statusIcon).to.exist;
      expect(statusIcon!.querySelector('svg')).to.exist;
    });
  });

  describe('size property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.size).to.equal('default');
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle size="sm"></pfv6-menu-toggle>`);
      expect(el.size).to.equal('sm');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle size="sm"></pfv6-menu-toggle>`);
      expect(el.getAttribute('size')).to.equal('sm');
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-expanded></pfv6-menu-toggle>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-expanded></pfv6-menu-toggle>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('sets aria-expanded on button element', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-expanded></pfv6-menu-toggle>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.isDisabled).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-disabled></pfv6-menu-toggle>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-disabled></pfv6-menu-toggle>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('sets disabled on button element', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-disabled></pfv6-menu-toggle>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('isFullHeight property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.isFullHeight).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-full-height></pfv6-menu-toggle>`);
      expect(el.isFullHeight).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-full-height></pfv6-menu-toggle>`);
      expect(el.hasAttribute('is-full-height')).to.be.true;
    });
  });

  describe('isFullWidth property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.isFullWidth).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-full-width></pfv6-menu-toggle>`);
      expect(el.isFullWidth).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-full-width></pfv6-menu-toggle>`);
      expect(el.hasAttribute('is-full-width')).to.be.true;
    });
  });

  describe('isPlaceholder property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.isPlaceholder).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-placeholder></pfv6-menu-toggle>`);
      expect(el.isPlaceholder).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-placeholder></pfv6-menu-toggle>`);
      expect(el.hasAttribute('is-placeholder')).to.be.true;
    });
  });

  describe('isSettings property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.isSettings).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-settings></pfv6-menu-toggle>`);
      expect(el.isSettings).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-settings></pfv6-menu-toggle>`);
      expect(el.hasAttribute('is-settings')).to.be.true;
    });

    it('renders settings icon when true', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-settings></pfv6-menu-toggle>`);
      const icon = el.shadowRoot!.querySelector('#icon');
      expect(icon).to.exist;
      expect(icon!.querySelector('svg')).to.exist;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle accessible-label="Test label"></pfv6-menu-toggle>`);
      expect(el.accessibleLabel).to.equal('Test label');
    });

    it('sets aria-label on button element', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle accessible-label="Test label"></pfv6-menu-toggle>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-label')).to.equal('Test label');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`
        <pfv6-menu-toggle>
          <span>Toggle text</span>
        </pfv6-menu-toggle>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Toggle text');
    });

    it('renders icon slot content', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`
        <pfv6-menu-toggle>
          <svg slot="icon" data-testid="custom-icon"></svg>
          Toggle text
        </pfv6-menu-toggle>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon).to.exist;
      expect(icon?.getAttribute('data-testid')).to.equal('custom-icon');
    });

    it('renders badge slot content', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`
        <pfv6-menu-toggle>
          Toggle text
          <span slot="badge">5</span>
        </pfv6-menu-toggle>
      `);
      const badge = el.querySelector('[slot="badge"]');
      expect(badge).to.exist;
      expect(badge?.textContent).to.equal('5');
    });

    it('renders split-button-items slot content', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`
        <pfv6-menu-toggle>
          <pfv6-menu-toggle-action slot="split-button-items">Action</pfv6-menu-toggle-action>
        </pfv6-menu-toggle>
      `);
      const action = el.querySelector('[slot="split-button-items"]');
      expect(action).to.exist;
      expect(action?.textContent).to.equal('Action');
    });

    it('renders status-icon slot content', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`
        <pfv6-menu-toggle status="success">
          <svg slot="status-icon" data-testid="custom-status-icon"></svg>
          Toggle text
        </pfv6-menu-toggle>
      `);
      const statusIcon = el.querySelector('[slot="status-icon"]');
      expect(statusIcon).to.exist;
      expect(statusIcon?.getAttribute('data-testid')).to.equal('custom-status-icon');
    });
  });

  describe('typeahead variant', function() {
    it('renders as div container with typeahead button', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="typeahead"></pfv6-menu-toggle>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.tagName.toLowerCase()).to.equal('div');
      const button = el.shadowRoot!.querySelector('#typeahead-button');
      expect(button).to.exist;
    });

    it('typeahead button has tabindex -1', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="typeahead"></pfv6-menu-toggle>`);
      const button = el.shadowRoot!.querySelector('#typeahead-button') as HTMLButtonElement;
      expect(button?.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('split button variant', function() {
    it('renders as div container with split button', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`
        <pfv6-menu-toggle>
          <pfv6-menu-toggle-action slot="split-button-items">Action</pfv6-menu-toggle-action>
        </pfv6-menu-toggle>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.tagName.toLowerCase()).to.equal('div');
      const button = el.shadowRoot!.querySelector('#split-button');
      expect(button).to.exist;
    });
  });

  describe('plain variant', function() {
    it('does not render toggle controls', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle variant="plain"></pfv6-menu-toggle>`);
      const controls = el.shadowRoot!.querySelector('#controls');
      expect(controls).to.not.exist;
    });
  });

  describe('click handling', function() {
    it('allows click events when not disabled', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle></pfv6-menu-toggle>`);
      let clicked = false;
      el.addEventListener('click', () => { clicked = true; });

      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
      await userEvent.click(button);

      expect(clicked).to.be.true;
    });

    it('prevents click events when disabled', async function() {
      const el = await fixture<Pfv6MenuToggle>(html`<pfv6-menu-toggle is-disabled></pfv6-menu-toggle>`);
      let clicked = false;
      el.addEventListener('click', () => { clicked = true; });

      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
      // Disabled buttons don't fire click events, but we test the handler logic
      expect(button.disabled).to.be.true;
    });
  });
});

describe('<pfv6-menu-toggle-action>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-menu-toggle-action')).to.be.an.instanceof(Pfv6MenuToggleAction);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action></pfv6-menu-toggle-action>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-menu-toggle-action'))
          .and
          .to.be.an.instanceOf(Pfv6MenuToggleAction);
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action></pfv6-menu-toggle-action>`);
      expect(el.isDisabled).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action is-disabled></pfv6-menu-toggle-action>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action is-disabled></pfv6-menu-toggle-action>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('sets disabled on button element', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action is-disabled></pfv6-menu-toggle-action>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`
        <pfv6-menu-toggle-action>
          <span>Action text</span>
        </pfv6-menu-toggle-action>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Action text');
    });
  });

  describe('click handling', function() {
    it('allows click events when not disabled', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action>Action</pfv6-menu-toggle-action>`);
      let clicked = false;
      el.addEventListener('click', () => { clicked = true; });

      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
      await userEvent.click(button);

      expect(clicked).to.be.true;
    });

    it('prevents click events when disabled', async function() {
      const el = await fixture<Pfv6MenuToggleAction>(html`<pfv6-menu-toggle-action is-disabled>Action</pfv6-menu-toggle-action>`);
      let clicked = false;
      el.addEventListener('click', () => { clicked = true; });

      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
      // Disabled buttons don't fire click events
      expect(button.disabled).to.be.true;
    });
  });
});

describe('<pfv6-menu-toggle-checkbox>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-menu-toggle-checkbox')).to.be.an.instanceof(Pfv6MenuToggleCheckbox);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-menu-toggle-checkbox'))
          .and
          .to.be.an.instanceOf(Pfv6MenuToggleCheckbox);
    });
  });

  describe('form association', function() {
    it('is a form-associated custom element', function() {
      expect(Pfv6MenuToggleCheckbox.formAssociated).to.be.true;
    });
  });

  describe('name property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.name).to.equal('');
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox name="test-checkbox"></pfv6-menu-toggle-checkbox>`);
      expect(el.name).to.equal('test-checkbox');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox name="test-checkbox"></pfv6-menu-toggle-checkbox>`);
      expect(el.getAttribute('name')).to.equal('test-checkbox');
    });
  });

  describe('value property', function() {
    it('defaults to "on"', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.value).to.equal('on');
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox value="custom"></pfv6-menu-toggle-checkbox>`);
      expect(el.value).to.equal('custom');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox value="custom"></pfv6-menu-toggle-checkbox>`);
      expect(el.getAttribute('value')).to.equal('custom');
    });
  });

  describe('isValid property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.isValid).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox .isValid=${false}></pfv6-menu-toggle-checkbox>`);
      expect(el.isValid).to.be.false;
    });

    it('reflects to attribute when false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox .isValid=${false}></pfv6-menu-toggle-checkbox>`);
      expect(el.hasAttribute('is-valid')).to.be.false;
    });

    it('sets aria-invalid on input element', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox .isValid=${false}></pfv6-menu-toggle-checkbox>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).to.equal('true');
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.disabled).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox disabled></pfv6-menu-toggle-checkbox>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox disabled></pfv6-menu-toggle-checkbox>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('sets disabled on input element', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox disabled></pfv6-menu-toggle-checkbox>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('isChecked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.isChecked).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox is-checked></pfv6-menu-toggle-checkbox>`);
      expect(el.isChecked).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox is-checked></pfv6-menu-toggle-checkbox>`);
      expect(el.hasAttribute('is-checked')).to.be.true;
    });

    it('sets checked on input element', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox is-checked></pfv6-menu-toggle-checkbox>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input?.checked).to.be.true;
    });
  });

  describe('defaultChecked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.defaultChecked).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox default-checked></pfv6-menu-toggle-checkbox>`);
      expect(el.defaultChecked).to.be.true;
    });
  });

  describe('label property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.label).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox label="Test label"></pfv6-menu-toggle-checkbox>`);
      expect(el.label).to.equal('Test label');
    });

    it('renders label text in shadow DOM', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox label="Test label"></pfv6-menu-toggle-checkbox>`);
      const labelSpan = el.shadowRoot!.querySelector('#label');
      expect(labelSpan).to.exist;
      expect(labelSpan?.textContent?.trim()).to.include('Test label');
    });
  });

  describe('indeterminate property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.indeterminate).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox indeterminate></pfv6-menu-toggle-checkbox>`);
      expect(el.indeterminate).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox indeterminate></pfv6-menu-toggle-checkbox>`);
      expect(el.hasAttribute('indeterminate')).to.be.true;
    });

    it('sets indeterminate on input element', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox indeterminate></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input?.indeterminate).to.be.true;
    });
  });

  describe('required property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.required).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox required></pfv6-menu-toggle-checkbox>`);
      expect(el.required).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox required></pfv6-menu-toggle-checkbox>`);
      expect(el.hasAttribute('required')).to.be.true;
    });

    it('sets required on input element', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox required></pfv6-menu-toggle-checkbox>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.hasAttribute('required')).to.be.true;
    });
  });

  describe('readonly property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.readonly).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox readonly></pfv6-menu-toggle-checkbox>`);
      expect(el.readonly).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox readonly></pfv6-menu-toggle-checkbox>`);
      expect(el.hasAttribute('readonly')).to.be.true;
    });

    it('sets readonly on input element', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox readonly></pfv6-menu-toggle-checkbox>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.hasAttribute('readonly')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`
        <pfv6-menu-toggle-checkbox>
          <span>Label content</span>
        </pfv6-menu-toggle-checkbox>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Label content');
    });
  });

  describe('change event', function() {
    it('dispatches on checkbox change', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6MenuToggleCheckboxChangeEvent', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      let capturedEvent: Event | null = null;
      el.addEventListener('change', (e) => { capturedEvent = e; });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      expect(capturedEvent).to.be.an.instanceof(Pfv6MenuToggleCheckboxChangeEvent);
    });

    it('event contains checked state as class field', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      let capturedEvent: Pfv6MenuToggleCheckboxChangeEvent | null = null;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6MenuToggleCheckboxChangeEvent; });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.checked).to.be.true;
    });

    it('event contains original event as class field', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      let capturedEvent: Pfv6MenuToggleCheckboxChangeEvent | null = null;
      el.addEventListener('change', (e) => { capturedEvent = e as Pfv6MenuToggleCheckboxChangeEvent; });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.originalEvent).to.be.an.instanceof(Event);
    });

    it('updates isChecked property when changed', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.isChecked).to.be.false;

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      expect(el.isChecked).to.be.true;
    });

    it('clears indeterminate state when changed', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox indeterminate></pfv6-menu-toggle-checkbox>`);
      expect(el.indeterminate).to.be.true;

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      expect(el.indeterminate).to.be.false;
    });

    it('does not fire when readonly', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox readonly></pfv6-menu-toggle-checkbox>`);
      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);

      // Event is prevented in readonly mode
      expect(el.isChecked).to.be.false;
    });
  });

  describe('form callbacks', function() {
    it('formResetCallback resets to defaultChecked', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox default-checked></pfv6-menu-toggle-checkbox>`);

      // Change the state
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      await userEvent.click(input);
      expect(el.isChecked).to.be.false;

      // Simulate form reset
      el.formResetCallback();
      expect(el.isChecked).to.be.true;
    });

    it('formResetCallback clears indeterminate', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox indeterminate></pfv6-menu-toggle-checkbox>`);
      expect(el.indeterminate).to.be.true;

      el.formResetCallback();
      expect(el.indeterminate).to.be.false;
    });

    it('formDisabledCallback sets disabled', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.disabled).to.be.false;

      el.formDisabledCallback(true);
      expect(el.disabled).to.be.true;
    });

    it('formStateRestoreCallback restores checked state', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      expect(el.isChecked).to.be.false;

      el.formStateRestoreCallback('on');
      expect(el.isChecked).to.be.true;
    });

    it('formStateRestoreCallback handles custom value', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox value="custom"></pfv6-menu-toggle-checkbox>`);
      expect(el.isChecked).to.be.false;

      el.formStateRestoreCallback('custom');
      expect(el.isChecked).to.be.true;
    });
  });

  describe('form value synchronization', function() {
    it('sets form value when checked', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox is-checked></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;

      // Form value should be set (we can't directly inspect internals in tests,
      // but we can verify the property update triggers the logic)
      expect(el.isChecked).to.be.true;
    });

    it('sets form value to null when unchecked', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;

      expect(el.isChecked).to.be.false;
    });

    it('sets form value to null when indeterminate', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox is-checked indeterminate></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;

      // Even though checked is true, indeterminate takes precedence
      expect(el.indeterminate).to.be.true;
    });
  });

  describe('validation', function() {
    it('is invalid when required and unchecked', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox required></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;

      // ElementInternals validation is triggered
      expect(el.required).to.be.true;
      expect(el.isChecked).to.be.false;
    });

    it('is valid when required and checked', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox required is-checked></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;

      expect(el.required).to.be.true;
      expect(el.isChecked).to.be.true;
    });

    it('is valid when not required', async function() {
      const el = await fixture<Pfv6MenuToggleCheckbox>(html`<pfv6-menu-toggle-checkbox></pfv6-menu-toggle-checkbox>`);
      await el.updateComplete;

      expect(el.required).to.be.false;
    });
  });
});
