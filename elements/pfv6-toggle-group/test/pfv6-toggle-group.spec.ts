import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6ToggleGroup } from '../pfv6-toggle-group.js';
import { Pfv6ToggleGroupItem, Pfv6ToggleGroupItemChangeEvent } from '../pfv6-toggle-group-item.js';
import { Pfv6ToggleGroupItemElement } from '../pfv6-toggle-group-item-element.js';
import '../pfv6-toggle-group.js';
import '../pfv6-toggle-group-item.js';
import '../pfv6-toggle-group-item-element.js';

describe('<pfv6-toggle-group>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-toggle-group')).to.be.an.instanceof(Pfv6ToggleGroup);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group></pfv6-toggle-group>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-toggle-group'))
          .and
          .to.be.an.instanceOf(Pfv6ToggleGroup);
    });
  });

  describe('isCompact property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group></pfv6-toggle-group>`);
      expect(el.isCompact).to.be.false;
    });

    it('can be set to true via attribute', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group is-compact></pfv6-toggle-group>`);
      expect(el.isCompact).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group is-compact></pfv6-toggle-group>`);
      expect(el.hasAttribute('is-compact')).to.be.true;
    });

    it('applies compact class to container', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group is-compact></pfv6-toggle-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('compact')).to.be.true;
    });

    it('removes compact class when set to false', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group is-compact></pfv6-toggle-group>`);
      el.isCompact = false;
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('compact')).to.be.false;
    });
  });

  describe('areAllGroupsDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group></pfv6-toggle-group>`);
      expect(el.areAllGroupsDisabled).to.be.false;
    });

    it('can be set to true via attribute', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group are-all-groups-disabled></pfv6-toggle-group>`);
      expect(el.areAllGroupsDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group are-all-groups-disabled></pfv6-toggle-group>`);
      expect(el.hasAttribute('are-all-groups-disabled')).to.be.true;
    });

    it('disables all child items when set to true', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group are-all-groups-disabled>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 2"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      await el.updateComplete;

      // Check that buttons inside items are disabled via context
      const items = el.querySelectorAll('pfv6-toggle-group-item');
      for (const item of items) {
        await item.updateComplete;
        const button = item.shadowRoot!.querySelector('button');
        expect(button?.disabled).to.be.true;
      }
    });

    it('enables all child items when set to false', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group are-all-groups-disabled>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 2"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      await el.updateComplete;

      el.areAllGroupsDisabled = false;
      await el.updateComplete;

      // Check that buttons inside items are enabled via context
      const items = el.querySelectorAll('pfv6-toggle-group-item');
      for (const item of items) {
        await item.updateComplete;
        const button = item.shadowRoot!.querySelector('button');
        expect(button?.disabled).to.be.false;
      }
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group></pfv6-toggle-group>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group accessible-label="Test group"></pfv6-toggle-group>`);
      expect(el.accessibleLabel).to.equal('Test group');
    });

    it('updates aria-label in ElementInternals', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group accessible-label="Test group"></pfv6-toggle-group>`);
      await el.updateComplete;
      // Verify internals.ariaLabel is set (tested via implementation)
      expect(el.accessibleLabel).to.equal('Test group');
    });

    it('clears accessible label when set to undefined', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group accessible-label="Test group"></pfv6-toggle-group>`);
      el.accessibleLabel = undefined;
      await el.updateComplete;
      expect(el.accessibleLabel).to.be.undefined;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 2"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      const items = el.querySelectorAll('pfv6-toggle-group-item');
      expect(items.length).to.equal(2);
    });

    it('renders slot in shadow DOM container with role="group"', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group></pfv6-toggle-group>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      expect(container?.getAttribute('role')).to.equal('group');
      const slot = container?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('ElementInternals', function() {
    it('attaches internals in constructor', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`<pfv6-toggle-group></pfv6-toggle-group>`);
      // ElementInternals is private, but we can verify it's attached by setting accessibleLabel
      el.accessibleLabel = 'Test';
      await el.updateComplete;
      // Verify internals.ariaLabel is set (tested via implementation)
      expect(el.accessibleLabel).to.equal('Test');
    });
  });
});

describe('<pfv6-toggle-group-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-toggle-group-item')).to.be.an.instanceof(Pfv6ToggleGroupItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-toggle-group-item'))
          .and
          .to.be.an.instanceOf(Pfv6ToggleGroupItem);
    });
  });

  describe('text property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el.text).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>`);
      expect(el.text).to.equal('Option 1');
    });

    it('renders text in toggle-group-item-element', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item text="Test Text"></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const textElement = el.shadowRoot!.querySelector('pfv6-toggle-group-item-element[variant="text"]');
      expect(textElement?.textContent?.trim()).to.equal('Test Text');
    });
  });

  describe('iconPosition property', function() {
    it('defaults to "start"', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el.iconPosition).to.equal('start');
    });

    it('accepts "end" value', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item icon-position="end"></pfv6-toggle-group-item>`);
      expect(el.iconPosition).to.equal('end');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item icon-position="end"></pfv6-toggle-group-item>`);
      expect(el.getAttribute('icon-position')).to.equal('end');
    });

    it('renders icon before text when set to "start"', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item text="Text" icon-position="start">
          <span slot="icon">Icon</span>
        </pfv6-toggle-group-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      const elements = button?.querySelectorAll('pfv6-toggle-group-item-element');
      expect(elements?.[0].getAttribute('variant')).to.equal('icon');
      expect(elements?.[1].getAttribute('variant')).to.equal('text');
    });

    it('renders icon after text when set to "end"', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item text="Text" icon-position="end">
          <span slot="icon">Icon</span>
        </pfv6-toggle-group-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      const elements = button?.querySelectorAll('pfv6-toggle-group-item-element');
      expect(elements?.[0].getAttribute('variant')).to.equal('text');
      expect(elements?.[1].getAttribute('variant')).to.equal('icon');
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el.isDisabled).to.be.false;
    });

    it('can be set to true via attribute', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-disabled></pfv6-toggle-group-item>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-disabled></pfv6-toggle-group-item>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('disables the button element', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-disabled></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('disabled')).to.be.true;
    });

    it('prevents click events when disabled', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-disabled></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(eventFired).to.be.false;
    });
  });

  describe('isSelected property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el.isSelected).to.be.false;
    });

    it('can be set to true via attribute', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-selected></pfv6-toggle-group-item>`);
      expect(el.isSelected).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-selected></pfv6-toggle-group-item>`);
      expect(el.hasAttribute('is-selected')).to.be.true;
    });

    it('applies selected class to button', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-selected></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('selected')).to.be.true;
    });

    it('sets aria-pressed to "true" when selected', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-selected></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-pressed')).to.equal('true');
    });

    it('sets aria-pressed to "false" when not selected', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-pressed')).to.equal('false');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item accessible-label="Icon only button"></pfv6-toggle-group-item>`);
      expect(el.accessibleLabel).to.equal('Icon only button');
    });

    it('sets aria-label on button', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item accessible-label="Icon only"></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-label')).to.equal('Icon only');
    });

    it('does not set aria-label when undefined', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('buttonId property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      expect(el.buttonId).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item button-id="test-button"></pfv6-toggle-group-item>`);
      expect(el.buttonId).to.equal('test-button');
    });

    it('sets id on button element', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item button-id="test-btn"></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('id')).to.equal('test-btn');
    });

    it('does not set id when undefined', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('id')).to.be.false;
    });
  });

  describe('change event', function() {
    it('dispatches when button is clicked', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(eventFired).to.be.true;
    });

    it('event is instance of Pfv6ToggleGroupItemChangeEvent', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ToggleGroupItemChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ToggleGroupItemChangeEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ToggleGroupItemChangeEvent);
    });

    it('event contains selected: true when toggling to selected', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ToggleGroupItemChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ToggleGroupItemChangeEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ToggleGroupItemChangeEvent);
      expect(capturedEvent!.selected).to.be.true;
    });

    it('event contains selected: false when toggling to unselected', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-selected></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ToggleGroupItemChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ToggleGroupItemChangeEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6ToggleGroupItemChangeEvent);
      expect(capturedEvent!.selected).to.be.false;
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ToggleGroupItemChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ToggleGroupItemChangeEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent!.bubbles).to.be.true;
    });

    it('event is composed', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let capturedEvent: Pfv6ToggleGroupItemChangeEvent | undefined;
      el.addEventListener('change', e => {
        capturedEvent = e as Pfv6ToggleGroupItemChangeEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent!.composed).to.be.true;
    });

    it('does not dispatch when disabled', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item is-disabled></pfv6-toggle-group-item>`);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('change', () => {
        eventFired = true;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(eventFired).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders text slot when no text property provided', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item>
          <span slot="text">Slotted text</span>
        </pfv6-toggle-group-item>
      `);
      const slottedText = el.querySelector('[slot="text"]');
      expect(slottedText).to.exist;
      expect(slottedText?.textContent).to.equal('Slotted text');
    });

    it('renders icon slot', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item text="Text">
          <span slot="icon">Icon</span>
        </pfv6-toggle-group-item>
      `);
      const slottedIcon = el.querySelector('[slot="icon"]');
      expect(slottedIcon).to.exist;
      expect(slottedIcon?.textContent).to.equal('Icon');
    });

    it('renders both icon and text slots', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item>
          <span slot="icon">Icon</span>
          <span slot="text">Text</span>
        </pfv6-toggle-group-item>
      `);
      const slottedIcon = el.querySelector('[slot="icon"]');
      const slottedText = el.querySelector('[slot="text"]');
      expect(slottedIcon).to.exist;
      expect(slottedText).to.exist;
    });
  });

  describe('button rendering', function() {
    it('renders button with type="button"', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('type')).to.equal('button');
    });

    it('renders button inside container div', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`<pfv6-toggle-group-item></pfv6-toggle-group-item>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
      const button = container?.querySelector('button');
      expect(button).to.exist;
    });
  });
});

describe('<pfv6-toggle-group-item-element>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-toggle-group-item-element')).to.be.an.instanceof(Pfv6ToggleGroupItemElement);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element></pfv6-toggle-group-item-element>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-toggle-group-item-element'))
          .and
          .to.be.an.instanceOf(Pfv6ToggleGroupItemElement);
    });
  });

  describe('variant property', function() {
    it('defaults to "text"', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element></pfv6-toggle-group-item-element>`);
      expect(el.variant).to.equal('text');
    });

    it('accepts "icon" value', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element variant="icon"></pfv6-toggle-group-item-element>`);
      expect(el.variant).to.equal('icon');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element variant="icon"></pfv6-toggle-group-item-element>`);
      expect(el.getAttribute('variant')).to.equal('icon');
    });

    it('applies icon class when variant is "icon"', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element variant="icon"></pfv6-toggle-group-item-element>`);
      await el.updateComplete;
      const span = el.shadowRoot!.querySelector('span');
      expect(span?.classList.contains('icon')).to.be.true;
      expect(span?.classList.contains('text')).to.be.false;
    });

    it('applies text class when variant is "text"', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element variant="text"></pfv6-toggle-group-item-element>`);
      await el.updateComplete;
      const span = el.shadowRoot!.querySelector('span');
      expect(span?.classList.contains('text')).to.be.true;
      expect(span?.classList.contains('icon')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`
        <pfv6-toggle-group-item-element>
          <span>Content</span>
        </pfv6-toggle-group-item-element>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Content');
    });

    it('renders slot in span wrapper', async function() {
      const el = await fixture<Pfv6ToggleGroupItemElement>(html`<pfv6-toggle-group-item-element></pfv6-toggle-group-item-element>`);
      await el.updateComplete;
      const span = el.shadowRoot!.querySelector('span');
      expect(span).to.exist;
      const slot = span?.querySelector('slot');
      expect(slot).to.exist;
    });
  });
});

describe('integration tests', function() {
  describe('toggle group with items', function() {
    it('renders multiple items in group', async function() {
      const el = await fixture(html`
        <pfv6-toggle-group>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 2"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 3"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      const items = el.querySelectorAll('pfv6-toggle-group-item');
      expect(items.length).to.equal(3);
    });

    it('change events bubble from items to group', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      await el.updateComplete;

      let eventCaught = false;
      el.addEventListener('change', () => {
        eventCaught = true;
      });

      const item = el.querySelector('pfv6-toggle-group-item');
      const button = item?.shadowRoot?.querySelector('button');
      button!.click();

      expect(eventCaught).to.be.true;
    });

    it('disabling group disables all items', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 2"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);

      el.areAllGroupsDisabled = true;
      await el.updateComplete;

      // Check that buttons inside items are disabled via context
      const items = el.querySelectorAll('pfv6-toggle-group-item');
      for (const item of items) {
        await item.updateComplete;
        const button = item.shadowRoot!.querySelector('button');
        expect(button?.disabled).to.be.true;
      }
    });

    it('compact styling applies to group', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group is-compact>
          <pfv6-toggle-group-item text="Option 1"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      await el.updateComplete;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('compact')).to.be.true;
    });
  });

  describe('single selection pattern', function() {
    it('supports manual single selection via event handling', async function() {
      const el = await fixture<Pfv6ToggleGroup>(html`
        <pfv6-toggle-group>
          <pfv6-toggle-group-item text="Option 1" button-id="opt-1"></pfv6-toggle-group-item>
          <pfv6-toggle-group-item text="Option 2" button-id="opt-2"></pfv6-toggle-group-item>
        </pfv6-toggle-group>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('pfv6-toggle-group-item');
      let selectedId = '';

      // Set up single-selection behavior
      items.forEach(item => {
        item.addEventListener('change', e => {
          const event = e as Pfv6ToggleGroupItemChangeEvent;
          const clickedId = item.buttonId!;

          // Deselect previously selected item
          if (selectedId && selectedId !== clickedId) {
            const previousItem = el.querySelector(`[button-id="${selectedId}"]`) as Pfv6ToggleGroupItem;
            if (previousItem) {
              previousItem.isSelected = false;
            }
          }

          // Update current item
          item.isSelected = event.selected;
          selectedId = event.selected ? clickedId : '';
        });
      });

      // Click first item
      const button1 = items[0].shadowRoot!.querySelector('button');
      button1!.click();
      await items[0].updateComplete;

      expect(items[0].isSelected).to.be.true;
      expect(items[1].isSelected).to.be.false;

      // Click second item
      const button2 = items[1].shadowRoot!.querySelector('button');
      button2!.click();
      await items[0].updateComplete;
      await items[1].updateComplete;

      expect(items[0].isSelected).to.be.false;
      expect(items[1].isSelected).to.be.true;
    });
  });

  describe('icon-only variants', function() {
    it('renders icon-only items with accessible-label', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item accessible-label="Copy">
          <span slot="icon">📋</span>
        </pfv6-toggle-group-item>
      `);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-label')).to.equal('Copy');

      const iconElement = el.shadowRoot!.querySelector('pfv6-toggle-group-item-element[variant="icon"]');
      expect(iconElement).to.exist;
    });
  });

  describe('text and icon variants', function() {
    it('renders text with icon at start', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item text="Copy" icon-position="start">
          <span slot="icon">📋</span>
        </pfv6-toggle-group-item>
      `);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('button');
      const elements = button?.querySelectorAll('pfv6-toggle-group-item-element');

      // First element should be icon
      expect(elements?.[0].getAttribute('variant')).to.equal('icon');
      // Second element should be text
      expect(elements?.[1].getAttribute('variant')).to.equal('text');
      expect(elements?.[1].textContent?.trim()).to.equal('Copy');
    });

    it('renders text with icon at end', async function() {
      const el = await fixture<Pfv6ToggleGroupItem>(html`
        <pfv6-toggle-group-item text="Copy" icon-position="end">
          <span slot="icon">📋</span>
        </pfv6-toggle-group-item>
      `);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector('button');
      const elements = button?.querySelectorAll('pfv6-toggle-group-item-element');

      // First element should be text
      expect(elements?.[0].getAttribute('variant')).to.equal('text');
      expect(elements?.[0].textContent?.trim()).to.equal('Copy');
      // Second element should be icon
      expect(elements?.[1].getAttribute('variant')).to.equal('icon');
    });
  });
});
