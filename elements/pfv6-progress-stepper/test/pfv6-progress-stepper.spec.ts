import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6ProgressStepper } from '../pfv6-progress-stepper.js';
import { Pfv6ProgressStep } from '../pfv6-progress-step.js';
import '../pfv6-progress-stepper.js';
import '../pfv6-progress-step.js';

describe('<pfv6-progress-stepper>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-progress-stepper')).to.be.an.instanceof(Pfv6ProgressStepper);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-progress-stepper'))
          .and
          .to.be.an.instanceOf(Pfv6ProgressStepper);
    });
  });

  describe('isCenterAligned property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      expect(el.isCenterAligned).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-center-aligned></pfv6-progress-stepper>`);
      expect(el.isCenterAligned).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-center-aligned></pfv6-progress-stepper>`);
      expect(el.hasAttribute('is-center-aligned')).to.be.true;
    });

    it('applies center class to container', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-center-aligned></pfv6-progress-stepper>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('center')).to.be.true;
    });
  });

  describe('isVertical property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      expect(el.isVertical).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-vertical></pfv6-progress-stepper>`);
      expect(el.isVertical).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-vertical></pfv6-progress-stepper>`);
      expect(el.hasAttribute('is-vertical')).to.be.true;
    });

    it('applies vertical class to container', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-vertical></pfv6-progress-stepper>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('vertical')).to.be.true;
    });
  });

  describe('isCompact property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      expect(el.isCompact).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-compact></pfv6-progress-stepper>`);
      expect(el.isCompact).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-compact></pfv6-progress-stepper>`);
      expect(el.hasAttribute('is-compact')).to.be.true;
    });

    it('applies compact class to container', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper is-compact></pfv6-progress-stepper>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('compact')).to.be.true;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper accessible-label="Progress steps"></pfv6-progress-stepper>`);
      expect(el.accessibleLabel).to.equal('Progress steps');
    });

    it('does not reflect to attribute', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      el.accessibleLabel = 'Test label';
      await el.updateComplete;
      expect(el.hasAttribute('accessible-label')).to.be.false;
    });
  });

  describe('ElementInternals', function() {
    it('sets role to list', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper></pfv6-progress-stepper>`);
      expect(el.getAttribute('role')).to.equal('list');
    });

    it('maps accessibleLabel to ariaLabel', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper accessible-label="Progress steps"></pfv6-progress-stepper>`);
      expect(el.accessibleLabel).to.equal('Progress steps');
      expect(el.getAttribute('aria-label')).to.equal('Progress steps');
    });

    it('removes ariaLabel when accessibleLabel is cleared', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`<pfv6-progress-stepper accessible-label="Test"></pfv6-progress-stepper>`);
      expect(el.getAttribute('aria-label')).to.equal('Test');

      el.accessibleLabel = undefined;
      await el.updateComplete;
      expect(el.getAttribute('aria-label')).to.be.null;
    });
  });

  describe('slots', function() {
    it('renders default slot for progress steps', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`
        <pfv6-progress-stepper>
          <pfv6-progress-step>Step 1</pfv6-progress-step>
          <pfv6-progress-step>Step 2</pfv6-progress-step>
        </pfv6-progress-stepper>
      `);
      const steps = el.querySelectorAll('pfv6-progress-step');
      expect(steps.length).to.equal(2);
    });

    it('renders slotted progress step content', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`
        <pfv6-progress-stepper>
          <pfv6-progress-step>First step</pfv6-progress-step>
        </pfv6-progress-stepper>
      `);
      const step = el.querySelector('pfv6-progress-step');
      expect(step?.textContent?.trim()).to.equal('First step');
    });
  });

  describe('multiple property combinations', function() {
    it('applies multiple classes when multiple properties are set', async function() {
      const el = await fixture<Pfv6ProgressStepper>(html`
        <pfv6-progress-stepper is-center-aligned is-vertical is-compact></pfv6-progress-stepper>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('center')).to.be.true;
      expect(container?.classList.contains('vertical')).to.be.true;
      expect(container?.classList.contains('compact')).to.be.true;
    });
  });
});

describe('<pfv6-progress-step>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-progress-step')).to.be.an.instanceof(Pfv6ProgressStep);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-progress-step'))
          .and
          .to.be.an.instanceOf(Pfv6ProgressStep);
    });
  });

  describe('variant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      expect(el.variant).to.equal('default');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="success"></pfv6-progress-step>`);
      expect(el.variant).to.equal('success');
    });

    it('accepts "info" value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="info"></pfv6-progress-step>`);
      expect(el.variant).to.equal('info');
    });

    it('accepts "pending" value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="pending"></pfv6-progress-step>`);
      expect(el.variant).to.equal('pending');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="warning"></pfv6-progress-step>`);
      expect(el.variant).to.equal('warning');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="danger"></pfv6-progress-step>`);
      expect(el.variant).to.equal('danger');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="success"></pfv6-progress-step>`);
      expect(el.getAttribute('variant')).to.equal('success');
    });

    it('applies success class for success variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="success"></pfv6-progress-step>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('success')).to.be.true;
    });

    it('applies info class for info variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="info"></pfv6-progress-step>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('info')).to.be.true;
    });

    it('applies pending class for pending variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="pending"></pfv6-progress-step>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('pending')).to.be.true;
    });

    it('applies warning class for warning variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="warning"></pfv6-progress-step>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.true;
    });

    it('applies danger class for danger variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="danger"></pfv6-progress-step>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('danger')).to.be.true;
    });

    it('renders success icon for success variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="success"></pfv6-progress-step>`);
      const icon = el.shadowRoot!.querySelector('#icon svg');
      expect(icon).to.exist;
      // Check for success icon's check circle path
      const path = icon?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M504 256c0 136.967');
    });

    it('renders info icon for info variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="info"></pfv6-progress-step>`);
      const icon = el.shadowRoot!.querySelector('#icon svg');
      expect(icon).to.exist;
      // Check for info icon's circle-info path
      const path = icon?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M256 8C119.043 8');
    });

    it('renders warning icon for warning variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="warning"></pfv6-progress-step>`);
      const icon = el.shadowRoot!.querySelector('#icon svg');
      expect(icon).to.exist;
      // Check for warning icon's triangle path
      const path = icon?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M569.517 440.013');
    });

    it('renders danger icon for danger variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="danger"></pfv6-progress-step>`);
      const icon = el.shadowRoot!.querySelector('#icon svg');
      expect(icon).to.exist;
      // Check for danger icon's circle-x path
      const path = icon?.querySelector('path');
      expect(path?.getAttribute('d')).to.include('M256 8C119.043 8');
    });

    it('renders no default icon for default variant', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step variant="default"></pfv6-progress-step>`);
      const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;
      // For default variant, the slot should be empty (no default icon)
      const slotContent = iconSlot?.childNodes;
      expect(slotContent?.length).to.equal(0);
    });
  });

  describe('isCurrent property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      expect(el.isCurrent).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step is-current></pfv6-progress-step>`);
      expect(el.isCurrent).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step is-current></pfv6-progress-step>`);
      expect(el.hasAttribute('is-current')).to.be.true;
    });

    it('applies current class to container', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step is-current></pfv6-progress-step>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('current')).to.be.true;
    });

    it('sets aria-current to "step" when true', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step is-current></pfv6-progress-step>`);
      expect(el.getAttribute('aria-current')).to.equal('step');
    });

    it('removes aria-current when false', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step is-current></pfv6-progress-step>`);
      expect(el.getAttribute('aria-current')).to.equal('step');

      el.isCurrent = false;
      await el.updateComplete;
      expect(el.getAttribute('aria-current')).to.be.null;
    });
  });

  describe('titleId property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      expect(el.titleId).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step title-id="step-title-1"></pfv6-progress-step>`);
      expect(el.titleId).to.equal('step-title-1');
    });

    it('does not reflect to attribute', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      el.titleId = 'test-id';
      await el.updateComplete;
      expect(el.hasAttribute('title-id')).to.be.false;
    });

    it('sets id on title element', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step title-id="step-title-1"></pfv6-progress-step>`);
      const titleElement = el.shadowRoot!.querySelector('#step-title-1');
      expect(titleElement).to.exist;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step accessible-label="Step 1 of 3"></pfv6-progress-step>`);
      expect(el.accessibleLabel).to.equal('Step 1 of 3');
    });

    it('does not reflect to attribute', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      el.accessibleLabel = 'Test label';
      await el.updateComplete;
      expect(el.hasAttribute('accessible-label')).to.be.false;
    });
  });

  describe('ElementInternals', function() {
    it('sets role to listitem', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step></pfv6-progress-step>`);
      expect(el.getAttribute('role')).to.equal('listitem');
    });

    it('maps accessibleLabel to ariaLabel', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step accessible-label="Step 1 of 3"></pfv6-progress-step>`);
      expect(el.accessibleLabel).to.equal('Step 1 of 3');
      expect(el.getAttribute('aria-label')).to.equal('Step 1 of 3');
    });

    it('removes ariaLabel when accessibleLabel is cleared', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`<pfv6-progress-step accessible-label="Test"></pfv6-progress-step>`);
      expect(el.getAttribute('aria-label')).to.equal('Test');

      el.accessibleLabel = undefined;
      await el.updateComplete;
      expect(el.getAttribute('aria-label')).to.be.null;
    });
  });

  describe('slots', function() {
    it('renders default slot for step title', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step>Step title</pfv6-progress-step>
      `);
      expect(el.textContent?.trim()).to.equal('Step title');
    });

    it('renders icon slot', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step>
          <span slot="icon">★</span>
        </pfv6-progress-step>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon?.textContent).to.equal('★');
    });

    it('custom icon overrides default variant icon', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step variant="success">
          <span slot="icon">★</span>
        </pfv6-progress-step>
      `);
      const customIcon = el.querySelector('[slot="icon"]');
      expect(customIcon?.textContent).to.equal('★');

      // Default icon should not render when custom icon is provided
      const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]');
      const assignedElements = (iconSlot as HTMLSlotElement).assignedElements();
      expect(assignedElements.length).to.equal(1);
      expect(assignedElements[0].textContent).to.equal('★');
    });

    it('renders description slot', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step>
          <span slot="description">Step description</span>
        </pfv6-progress-step>
      `);
      const description = el.querySelector('[slot="description"]');
      expect(description?.textContent).to.equal('Step description');
    });

    it('renders popover slot', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step>
          <span slot="popover">Popover content</span>
        </pfv6-progress-step>
      `);
      const popover = el.querySelector('[slot="popover"]');
      expect(popover?.textContent).to.equal('Popover content');
    });

    it('renders multiple slots independently', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step>
          Default title
          <span slot="icon">★</span>
          <span slot="description">Description text</span>
          <span slot="popover">Popover text</span>
        </pfv6-progress-step>
      `);

      expect(el.querySelector('[slot="icon"]')?.textContent).to.equal('★');
      expect(el.querySelector('[slot="description"]')?.textContent).to.equal('Description text');
      expect(el.querySelector('[slot="popover"]')?.textContent).to.equal('Popover text');
    });
  });

  describe('popover behavior', function() {
    it('renders title as div when no popover', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step title-id="step-1">Title</pfv6-progress-step>
      `);
      const titleElement = el.shadowRoot!.querySelector('#step-1');
      expect(titleElement?.tagName.toLowerCase()).to.equal('div');
    });

    it('renders title as button when popover slot has content', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step title-id="step-1">
          Title
          <span slot="popover">Info</span>
        </pfv6-progress-step>
      `);
      const titleElement = el.shadowRoot!.querySelector('#step-1');
      expect(titleElement?.tagName.toLowerCase()).to.equal('button');
    });

    it('applies help-text class when popover exists', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step title-id="step-1">
          Title
          <span slot="popover">Info</span>
        </pfv6-progress-step>
      `);
      const titleElement = el.shadowRoot!.querySelector('#step-1');
      expect(titleElement?.classList.contains('help-text')).to.be.true;
    });

    it('sets type="button" when popover exists', async function() {
      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step title-id="step-1">
          Title
          <span slot="popover">Info</span>
        </pfv6-progress-step>
      `);
      const titleElement = el.shadowRoot!.querySelector('#step-1') as HTMLButtonElement;
      expect(titleElement?.getAttribute('type')).to.equal('button');
    });

    it('wires popover triggerElement to the help-text button', async function() {
      // Dynamically import popover to avoid breaking test globals
      await import('../../pfv6-popover/pfv6-popover.js');

      const el = await fixture<Pfv6ProgressStep>(html`
        <pfv6-progress-step title-id="step-1">
          Title
          <pfv6-popover slot="popover" header-content="Help" body-content="More info"></pfv6-popover>
        </pfv6-progress-step>
      `);

      // Wait for custom element upgrade and trigger connection
      await customElements.whenDefined('pfv6-popover');
      await el.updateComplete;

      const popover = el.querySelector('pfv6-popover') as HTMLElement & { triggerElement: HTMLElement | null };
      const button = el.shadowRoot!.querySelector('button.help-text');

      expect(popover).to.exist;
      expect(button).to.exist;
      expect(popover.triggerElement).to.equal(button);
    });
  });

  describe('integration with parent stepper', function() {
    it('renders steps within stepper', async function() {
      const stepper = await fixture<Pfv6ProgressStepper>(html`
        <pfv6-progress-stepper>
          <pfv6-progress-step id="step-1" title-id="title-1" variant="success">First</pfv6-progress-step>
          <pfv6-progress-step id="step-2" title-id="title-2" is-current>Second</pfv6-progress-step>
          <pfv6-progress-step id="step-3" title-id="title-3">Third</pfv6-progress-step>
        </pfv6-progress-stepper>
      `);

      const steps = stepper.querySelectorAll('pfv6-progress-step');
      expect(steps.length).to.equal(3);
      expect(steps[0].variant).to.equal('success');
      expect(steps[1].isCurrent).to.be.true;
    });

    it('maintains correct ARIA structure', async function() {
      const stepper = await fixture<Pfv6ProgressStepper>(html`
        <pfv6-progress-stepper accessible-label="Progress steps">
          <pfv6-progress-step id="step-1" title-id="title-1">First</pfv6-progress-step>
          <pfv6-progress-step id="step-2" title-id="title-2">Second</pfv6-progress-step>
        </pfv6-progress-stepper>
      `);

      expect(stepper.getAttribute('role')).to.equal('list');
      expect(stepper.getAttribute('aria-label')).to.equal('Progress steps');

      const steps = stepper.querySelectorAll('pfv6-progress-step');
      steps.forEach(step => {
        expect(step.getAttribute('role')).to.equal('listitem');
      });
    });
  });
});
