import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Accordion } from '../pfv6-accordion.js';
import { Pfv6AccordionItem } from '../pfv6-accordion-item.js';
import { Pfv6AccordionToggle } from '../pfv6-accordion-toggle.js';
import { Pfv6AccordionContent } from '../pfv6-accordion-content.js';
import '../pfv6-accordion.js';
import '../pfv6-accordion-item.js';
import '../pfv6-accordion-toggle.js';
import '../pfv6-accordion-content.js';

describe('<pfv6-accordion>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-accordion')).to.be.an.instanceof(Pfv6Accordion);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-accordion'))
          .and
          .to.be.an.instanceOf(Pfv6Accordion);
    });
  });

  describe('headingLevel property', function() {
    it('defaults to "h3"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el.headingLevel).to.equal('h3');
    });

    it('accepts "h1" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion heading-level="h1"></pfv6-accordion>`);
      expect(el.headingLevel).to.equal('h1');
    });

    it('accepts "h2" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion heading-level="h2"></pfv6-accordion>`);
      expect(el.headingLevel).to.equal('h2');
    });

    it('accepts "h4" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion heading-level="h4"></pfv6-accordion>`);
      expect(el.headingLevel).to.equal('h4');
    });

    it('accepts "h5" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion heading-level="h5"></pfv6-accordion>`);
      expect(el.headingLevel).to.equal('h5');
    });

    it('accepts "h6" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion heading-level="h6"></pfv6-accordion>`);
      expect(el.headingLevel).to.equal('h6');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion heading-level="h2"></pfv6-accordion>`);
      expect(el.getAttribute('heading-level')).to.equal('h2');
    });
  });

  describe('asDefinitionList property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el.asDefinitionList).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion as-definition-list></pfv6-accordion>`);
      expect(el.asDefinitionList).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion as-definition-list></pfv6-accordion>`);
      expect(el.hasAttribute('as-definition-list')).to.be.true;
    });

    it('always renders <div> element (ARIA roles provide semantics)', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion as-definition-list></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('div');
    });

    it('renders <div> element when false', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('div');
    });
  });

  describe('isBordered property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el.isBordered).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion is-bordered></pfv6-accordion>`);
      expect(el.isBordered).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion is-bordered></pfv6-accordion>`);
      expect(el.hasAttribute('is-bordered')).to.be.true;
    });

    it('applies bordered class to container when true', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion is-bordered></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('bordered')).to.be.true;
    });

    it('does not apply bordered class when false', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('bordered')).to.be.false;
    });
  });

  describe('displaySize property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el.displaySize).to.equal('default');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion display-size="lg"></pfv6-accordion>`);
      expect(el.displaySize).to.equal('lg');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion display-size="lg"></pfv6-accordion>`);
      expect(el.getAttribute('display-size')).to.equal('lg');
    });

    it('applies display-lg class when set to "lg"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion display-size="lg"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('display-lg')).to.be.true;
    });

    it('does not apply display-lg class when "default"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion display-size="default"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('display-lg')).to.be.false;
    });
  });

  describe('togglePosition property', function() {
    it('defaults to "end"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el.togglePosition).to.equal('end');
    });

    it('accepts "start" value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion toggle-position="start"></pfv6-accordion>`);
      expect(el.togglePosition).to.equal('start');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion toggle-position="start"></pfv6-accordion>`);
      expect(el.getAttribute('toggle-position')).to.equal('start');
    });

    it('applies toggle-start class when set to "start"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion toggle-position="start"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('toggle-start')).to.be.true;
    });

    it('does not apply toggle-start class when "end"', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion toggle-position="end"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('toggle-start')).to.be.false;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion></pfv6-accordion>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion accessible-label="Accordion sections"></pfv6-accordion>`);
      expect(el.accessibleLabel).to.equal('Accordion sections');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion accessible-label="Accordion sections"></pfv6-accordion>`);
      expect(el.getAttribute('accessible-label')).to.equal('Accordion sections');
    });

    it('applies aria-label to container', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion accessible-label="Accordion sections"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.getAttribute('aria-label')).to.equal('Accordion sections');
    });

    it('adds role="region" when label is provided and asDefinitionList is false', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion accessible-label="Accordion sections" as-definition-list="false"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.getAttribute('role')).to.equal('region');
    });

    it('does not add role when label is undefined', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion as-definition-list="false"></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.hasAttribute('role')).to.be.false;
    });

    it('does not add role when asDefinitionList is true', async function() {
      const el = await fixture<Pfv6Accordion>(html`<pfv6-accordion accessible-label="Accordion sections" as-definition-list></pfv6-accordion>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.hasAttribute('role')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Accordion>(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Item One</pfv6-accordion-toggle>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      const item = el.querySelector('pfv6-accordion-item');
      expect(item).to.exist;
    });

    it('renders multiple accordion items', async function() {
      const el = await fixture<Pfv6Accordion>(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Item One</pfv6-accordion-toggle>
            <pfv6-accordion-content>Content One</pfv6-accordion-content>
          </pfv6-accordion-item>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Item Two</pfv6-accordion-toggle>
            <pfv6-accordion-content>Content Two</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      const items = el.querySelectorAll('pfv6-accordion-item');
      expect(items.length).to.equal(2);
    });
  });

  describe('context provision', function() {
    it('provides headingLevel to child components', async function() {
      const el = await fixture<Pfv6Accordion>(html`
        <pfv6-accordion heading-level="h2">
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Item</pfv6-accordion-toggle>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;

      // Access the private contextValue getter through testing
      const context = (el as any).contextValue;
      expect(context.headingLevel).to.equal('h2');
    });

    it('provides asDefinitionList to child components', async function() {
      const el = await fixture<Pfv6Accordion>(html`
        <pfv6-accordion as-definition-list="false">
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Item</pfv6-accordion-toggle>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;

      const context = (el as any).contextValue;
      expect(context.asDefinitionList).to.be.false;
    });

    it('provides togglePosition to child components', async function() {
      const el = await fixture<Pfv6Accordion>(html`
        <pfv6-accordion toggle-position="start">
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Item</pfv6-accordion-toggle>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;

      const context = (el as any).contextValue;
      expect(context.togglePosition).to.equal('start');
    });
  });
});

describe('<pfv6-accordion-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-accordion-item')).to.be.an.instanceof(Pfv6AccordionItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item></pfv6-accordion-item>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-accordion-item'))
          .and
          .to.be.an.instanceOf(Pfv6AccordionItem);
    });
  });

  describe('isExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item></pfv6-accordion-item>`);
      expect(el.isExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item is-expanded></pfv6-accordion-item>`);
      expect(el.isExpanded).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item is-expanded></pfv6-accordion-item>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('applies expanded class to container when true', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item is-expanded></pfv6-accordion-item>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expanded')).to.be.true;
    });

    it('does not apply expanded class when false', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item></pfv6-accordion-item>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('expanded')).to.be.false;
    });

    it('can be toggled programmatically', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`<pfv6-accordion-item></pfv6-accordion-item>`);
      expect(el.isExpanded).to.be.false;

      el.isExpanded = true;
      await el.updateComplete;
      expect(el.isExpanded).to.be.true;

      el.isExpanded = false;
      await el.updateComplete;
      expect(el.isExpanded).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot for toggle and content', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`
        <pfv6-accordion-item>
          <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          <pfv6-accordion-content>Content</pfv6-accordion-content>
        </pfv6-accordion-item>
      `);
      const toggle = el.querySelector('pfv6-accordion-toggle');
      const content = el.querySelector('pfv6-accordion-content');
      expect(toggle).to.exist;
      expect(content).to.exist;
    });
  });

  describe('context provision', function() {
    it('provides isExpanded state to child components', async function() {
      const el = await fixture<Pfv6AccordionItem>(html`
        <pfv6-accordion-item is-expanded>
          <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          <pfv6-accordion-content>Content</pfv6-accordion-content>
        </pfv6-accordion-item>
      `);
      await el.updateComplete;

      const context = (el as any).contextValue;
      expect(context.isExpanded).to.be.true;
    });
  });
});

describe('<pfv6-accordion-toggle>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-accordion-toggle')).to.be.an.instanceof(Pfv6AccordionToggle);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6AccordionToggle>(html`<pfv6-accordion-toggle></pfv6-accordion-toggle>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-accordion-toggle'))
          .and
          .to.be.an.instanceOf(Pfv6AccordionToggle);
    });
  });

  describe('rendering', function() {
    it('renders button element', async function() {
      const el = await fixture<Pfv6AccordionToggle>(html`<pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.getElementById('toggle');
      expect(button?.tagName.toLowerCase()).to.equal('button');
    });

    it('renders default slot content inside button', async function() {
      const el = await fixture<Pfv6AccordionToggle>(html`<pfv6-accordion-toggle>Item One</pfv6-accordion-toggle>`);
      await el.updateComplete;
      const textSpan = el.shadowRoot!.getElementById('text');
      expect(textSpan).to.exist;
    });

    it('renders toggle icon', async function() {
      const el = await fixture<Pfv6AccordionToggle>(html`<pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.getElementById('icon');
      expect(icon).to.exist;
      const svg = icon?.querySelector('svg');
      expect(svg).to.exist;
    });

    it('button has type="button"', async function() {
      const el = await fixture<Pfv6AccordionToggle>(html`<pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>`);
      await el.updateComplete;
      const button = el.shadowRoot!.getElementById('toggle');
      expect(button?.getAttribute('type')).to.equal('button');
    });
  });

  describe('context consumption - accordion', function() {
    it('renders heading with role="term" when asDefinitionList is true', async function() {
      const el = await fixture(html`
        <pfv6-accordion as-definition-list>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const container = toggle?.shadowRoot?.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('h3');
      expect(container?.getAttribute('role')).to.equal('term');
    });

    it('renders as heading without role when asDefinitionList is false', async function() {
      const el = await fixture(html`
        <pfv6-accordion heading-level="h2">
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const container = toggle?.shadowRoot?.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('h2');
      expect(container?.getAttribute('role')).to.be.null;
    });

    it('uses correct heading level from context', async function() {
      const el = await fixture(html`
        <pfv6-accordion heading-level="h4">
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const container = toggle?.shadowRoot?.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('h4');
    });

    it('positions icon at end by default', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const button = toggle?.shadowRoot?.getElementById('toggle');
      const icon = toggle?.shadowRoot?.getElementById('icon');
      const text = toggle?.shadowRoot?.getElementById('text');

      // Icon should be after text (last child)
      const children = Array.from(button?.childNodes || []);
      const iconIndex = children.indexOf(icon?.parentNode as ChildNode);
      const textIndex = children.indexOf(text?.parentNode as ChildNode);
      expect(iconIndex).to.be.greaterThan(textIndex);
    });

    it('positions icon at start when togglePosition is "start"', async function() {
      const el = await fixture(html`
        <pfv6-accordion toggle-position="start">
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const button = toggle?.shadowRoot?.getElementById('toggle');
      const icon = toggle?.shadowRoot?.getElementById('icon');
      const text = toggle?.shadowRoot?.getElementById('text');

      // Icon should be before text (first child)
      const children = Array.from(button?.childNodes || []);
      const iconIndex = children.indexOf(icon?.parentNode as ChildNode);
      const textIndex = children.indexOf(text?.parentNode as ChildNode);
      expect(iconIndex).to.be.lessThan(textIndex);
    });
  });

  describe('context consumption - item', function() {
    it('sets aria-expanded to false when item is not expanded', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const button = toggle?.shadowRoot?.getElementById('toggle');
      expect(button?.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets aria-expanded to true when item is expanded', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item is-expanded>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const button = toggle?.shadowRoot?.getElementById('toggle');
      expect(button?.getAttribute('aria-expanded')).to.equal('true');
    });

    it('applies expanded class when item is expanded', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item is-expanded>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const button = toggle?.shadowRoot?.getElementById('toggle');
      expect(button?.classList.contains('expanded')).to.be.true;
    });

    it('does not apply expanded class when item is not expanded', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-toggle>Toggle</pfv6-accordion-toggle>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const toggle = el.querySelector('pfv6-accordion-toggle');
      await toggle?.updateComplete;
      const button = toggle?.shadowRoot?.getElementById('toggle');
      expect(button?.classList.contains('expanded')).to.be.false;
    });
  });
});

describe('<pfv6-accordion-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-accordion-content')).to.be.an.instanceof(Pfv6AccordionContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content></pfv6-accordion-content>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-accordion-content'))
          .and
          .to.be.an.instanceOf(Pfv6AccordionContent);
    });
  });

  describe('isFixed property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content></pfv6-accordion-content>`);
      expect(el.isFixed).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content is-fixed></pfv6-accordion-content>`);
      expect(el.isFixed).to.be.true;
    });

    it('reflects to attribute when true', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content is-fixed></pfv6-accordion-content>`);
      expect(el.hasAttribute('is-fixed')).to.be.true;
    });

    it('applies fixed class to container when true', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content is-fixed></pfv6-accordion-content>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('fixed')).to.be.true;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content></pfv6-accordion-content>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content accessible-label="Content area"></pfv6-accordion-content>`);
      expect(el.accessibleLabel).to.equal('Content area');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content accessible-label="Content area"></pfv6-accordion-content>`);
      expect(el.getAttribute('accessible-label')).to.equal('Content area');
    });

    it('applies aria-label to container', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content accessible-label="Content area"></pfv6-accordion-content>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.getAttribute('aria-label')).to.equal('Content area');
    });
  });

  describe('accessibleLabelledBy property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content></pfv6-accordion-content>`);
      expect(el.accessibleLabelledBy).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content accessible-labelled-by="toggle-id"></pfv6-accordion-content>`);
      expect(el.accessibleLabelledBy).to.equal('toggle-id');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content accessible-labelled-by="toggle-id"></pfv6-accordion-content>`);
      expect(el.getAttribute('accessible-labelled-by')).to.equal('toggle-id');
    });

    it('applies aria-labelledby to container', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content accessible-labelled-by="toggle-id"></pfv6-accordion-content>`);
      await el.updateComplete;
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.getAttribute('aria-labelledby')).to.equal('toggle-id');
    });
  });

  describe('isCustomContent property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content></pfv6-accordion-content>`);
      expect(el.isCustomContent).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`<pfv6-accordion-content is-custom-content></pfv6-accordion-content>`);
      expect(el.isCustomContent).to.be.true;
    });

    it('wraps content in pfv6-accordion-expandable-content-body when false', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`
        <pfv6-accordion-content>
          <p>Content</p>
        </pfv6-accordion-content>
      `);
      await el.updateComplete;
      const wrapper = el.shadowRoot!.querySelector('pfv6-accordion-expandable-content-body');
      expect(wrapper).to.exist;
    });

    it('does not wrap content when true', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`
        <pfv6-accordion-content is-custom-content>
          <p>Content</p>
        </pfv6-accordion-content>
      `);
      await el.updateComplete;
      const wrapper = el.shadowRoot!.querySelector('pfv6-accordion-expandable-content-body');
      expect(wrapper).to.not.exist;
    });
  });

  describe('context consumption - accordion', function() {
    it('renders as <div> with role="definition" when asDefinitionList is true', async function() {
      const el = await fixture(html`
        <pfv6-accordion as-definition-list>
          <pfv6-accordion-item>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const content = el.querySelector('pfv6-accordion-content');
      await content?.updateComplete;
      const container = content?.shadowRoot?.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('div');
      expect(container?.getAttribute('role')).to.equal('definition');
    });

    it('renders as <div> without role when asDefinitionList is false', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const content = el.querySelector('pfv6-accordion-content');
      await content?.updateComplete;
      const container = content?.shadowRoot?.getElementById('container');
      expect(container?.tagName.toLowerCase()).to.equal('div');
      expect(container?.getAttribute('role')).to.be.null;
    });
  });

  describe('context consumption - item', function() {
    it('is hidden when item is not expanded', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const content = el.querySelector('pfv6-accordion-content');
      await content?.updateComplete;
      const container = content?.shadowRoot?.getElementById('container');
      expect(container?.hasAttribute('hidden')).to.be.true;
    });

    it('is visible when item is expanded', async function() {
      const el = await fixture(html`
        <pfv6-accordion>
          <pfv6-accordion-item is-expanded>
            <pfv6-accordion-content>Content</pfv6-accordion-content>
          </pfv6-accordion-item>
        </pfv6-accordion>
      `);
      await el.updateComplete;
      const content = el.querySelector('pfv6-accordion-content');
      await content?.updateComplete;
      const container = content?.shadowRoot?.getElementById('container');
      expect(container?.hasAttribute('hidden')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6AccordionContent>(html`
        <pfv6-accordion-content>
          <p>Test content</p>
        </pfv6-accordion-content>
      `);
      const paragraph = el.querySelector('p');
      expect(paragraph).to.exist;
      expect(paragraph?.textContent).to.equal('Test content');
    });
  });
});
