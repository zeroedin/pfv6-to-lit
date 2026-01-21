// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { Pfv6Breadcrumb } from '../pfv6-breadcrumb.js';
import { Pfv6BreadcrumbItem } from '../pfv6-breadcrumb-item.js';
import { Pfv6BreadcrumbHeading } from '../pfv6-breadcrumb-heading.js';
import '../pfv6-breadcrumb.js';

describe('<pfv6-breadcrumb>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-breadcrumb')).to.be.an.instanceof(Pfv6Breadcrumb);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Breadcrumb>(html`<pfv6-breadcrumb></pfv6-breadcrumb>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-breadcrumb'))
          .and
          .to.be.an.instanceOf(Pfv6Breadcrumb);
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to "Breadcrumb"', async function() {
      const el = await fixture<Pfv6Breadcrumb>(html`<pfv6-breadcrumb></pfv6-breadcrumb>`);
      expect(el.accessibleLabel).to.equal('Breadcrumb'); // Match React default
    });

    it('accepts custom value', async function() {
      const el = await fixture<Pfv6Breadcrumb>(
        html`<pfv6-breadcrumb accessible-label="Custom navigation"></pfv6-breadcrumb>`
      );
      expect(el.accessibleLabel).to.equal('Custom navigation');
    });

    it('applies aria-label to nav element', async function() {
      const el = await fixture<Pfv6Breadcrumb>(
        html`<pfv6-breadcrumb accessible-label="Site navigation"></pfv6-breadcrumb>`
      );
      const nav = el.shadowRoot!.querySelector('nav');
      expect(nav).to.exist;
      expect(nav!.getAttribute('aria-label')).to.equal('Site navigation');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Breadcrumb>(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-item>Test item</pfv6-breadcrumb-item>
        </pfv6-breadcrumb>
      `);
      const slotted = el.querySelector('pfv6-breadcrumb-item');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Test item');
    });

    it('renders multiple items', async function() {
      const el = await fixture<Pfv6Breadcrumb>(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-item>Item 1</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-item>Item 2</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-item>Item 3</pfv6-breadcrumb-item>
        </pfv6-breadcrumb>
      `);
      const items = el.querySelectorAll('pfv6-breadcrumb-item');
      expect(items.length).to.equal(3);
    });
  });

  describe('structure', function() {
    it('renders nav element with role="list" container', async function() {
      const el = await fixture<Pfv6Breadcrumb>(html`<pfv6-breadcrumb></pfv6-breadcrumb>`);
      const nav = el.shadowRoot!.querySelector('nav');
      const list = el.shadowRoot!.querySelector('[role="list"]');

      expect(nav).to.exist;
      expect(list).to.exist;
      expect(list!.id).to.equal('list');
    });
  });
});

describe('<pfv6-breadcrumb-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-breadcrumb-item')).to.be.an.instanceof(Pfv6BreadcrumbItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-breadcrumb-item'))
          .and
          .to.be.an.instanceOf(Pfv6BreadcrumbItem);
    });
  });

  describe('to property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el.to).to.be.undefined;
    });

    it('accepts href value', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item to="/test"></pfv6-breadcrumb-item>`
      );
      expect(el.to).to.equal('/test');
    });

    it('renders anchor with href when to is set', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item to="/test">Link</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link).to.exist;
      expect(link!.href).to.include('/test');
    });

    it('does not render anchor when to is not set', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item>Text</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link).to.not.exist;
    });
  });

  describe('isActive property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el.isActive).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item is-active></pfv6-breadcrumb-item>`
      );
      expect(el.isActive).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item is-active></pfv6-breadcrumb-item>`
      );
      expect(el.hasAttribute('is-active')).to.be.true;
    });

    it('adds aria-current="page" when active', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item to="/test" is-active>Active</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.getAttribute('aria-current')).to.equal('page');
    });

    it('does not add aria-current when inactive', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item to="/test">Inactive</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.hasAttribute('aria-current')).to.be.false;
    });

    it('applies current class when active', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item to="/test" is-active>Active</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.classList.contains('current')).to.be.true;
    });
  });

  describe('isDropdown property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el.isDropdown).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item is-dropdown></pfv6-breadcrumb-item>`
      );
      expect(el.isDropdown).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item is-dropdown></pfv6-breadcrumb-item>`
      );
      expect(el.hasAttribute('is-dropdown')).to.be.true;
    });

    it('renders span wrapper when isDropdown is true', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item is-dropdown>Dropdown</pfv6-breadcrumb-item>`
      );
      const dropdown = el.shadowRoot!.querySelector('#dropdown');
      expect(dropdown).to.exist;
      expect(dropdown!.tagName).to.equal('SPAN');
    });
  });

  describe('target property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el.target).to.be.undefined;
    });

    it('accepts target value', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item target="_blank"></pfv6-breadcrumb-item>`
      );
      expect(el.target).to.equal('_blank');
    });

    it('applies target to anchor when to is set', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item to="/test" target="_blank">Link</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.getAttribute('target')).to.equal('_blank');
    });
  });

  describe('component property', function() {
    it('defaults to "a"', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el.component).to.equal('a'); // Match React default
    });

    it('accepts "button" value', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item component="button"></pfv6-breadcrumb-item>`
      );
      expect(el.component).to.equal('button');
    });

    it('renders button when component is "button"', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item component="button">Button</pfv6-breadcrumb-item>`
      );
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
      expect(button!.type).to.equal('button');
    });

    it('renders anchor when component is "a" and to is set', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(
        html`<pfv6-breadcrumb-item component="a" to="/test">Link</pfv6-breadcrumb-item>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link).to.exist;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`
        <pfv6-breadcrumb-item>
          <span>Item content</span>
        </pfv6-breadcrumb-item>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Item content');
    });

    it('renders named icon slot', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`
        <pfv6-breadcrumb to="/test">
          <pfv6-breadcrumb-item>First</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-item>
            <svg slot="icon" id="custom-icon"></svg>
            Second
          </pfv6-breadcrumb-item>
        </pfv6-breadcrumb>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('pfv6-breadcrumb-item');
      const [, secondItem] = items;
      const icon = secondItem.querySelector('[slot="icon"]');

      expect(icon).to.exist;
      expect(icon!.id).to.equal('custom-icon');
    });

    it('shows default divider icon when not first item', async function() {
      const el = await fixture(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-item>First</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-item>Second</pfv6-breadcrumb-item>
        </pfv6-breadcrumb>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('pfv6-breadcrumb-item');
      const secondItem = items[1] as Pfv6BreadcrumbItem;
      await secondItem.updateComplete;

      const divider = secondItem.shadowRoot!.querySelector('#divider');
      expect(divider).to.exist;

      const svg = divider!.querySelector('svg');
      expect(svg).to.exist;
    });

    it('hides divider for first item', async function() {
      const el = await fixture(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-item>First</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-item>Second</pfv6-breadcrumb-item>
        </pfv6-breadcrumb>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('pfv6-breadcrumb-item');
      const firstItem = items[0] as Pfv6BreadcrumbItem;
      await firstItem.updateComplete;

      const divider = firstItem.shadowRoot!.querySelector('#divider');
      expect(divider).to.not.exist;
    });
  });

  describe('ElementInternals', function() {
    it('sets role to listitem', async function() {
      const el = await fixture<Pfv6BreadcrumbItem>(html`<pfv6-breadcrumb-item></pfv6-breadcrumb-item>`);
      expect(el.getAttribute('role')).to.equal('listitem');
    });
  });
});

describe('<pfv6-breadcrumb-heading>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-breadcrumb-heading')).to.be.an.instanceof(Pfv6BreadcrumbHeading);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`<pfv6-breadcrumb-heading></pfv6-breadcrumb-heading>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-breadcrumb-heading'))
          .and
          .to.be.an.instanceOf(Pfv6BreadcrumbHeading);
    });
  });

  describe('to property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`<pfv6-breadcrumb-heading></pfv6-breadcrumb-heading>`);
      expect(el.to).to.be.undefined;
    });

    it('accepts href value', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading to="/test"></pfv6-breadcrumb-heading>`
      );
      expect(el.to).to.equal('/test');
    });

    it('renders anchor with href when to is set', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading to="/test">Heading</pfv6-breadcrumb-heading>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link).to.exist;
      expect(link!.href).to.include('/test');
    });

    it('does not render anchor when to is not set', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading>Text</pfv6-breadcrumb-heading>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link).to.not.exist;
    });
  });

  describe('target property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`<pfv6-breadcrumb-heading></pfv6-breadcrumb-heading>`);
      expect(el.target).to.be.undefined;
    });

    it('accepts target value', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading target="_blank"></pfv6-breadcrumb-heading>`
      );
      expect(el.target).to.equal('_blank');
    });

    it('applies target to anchor when to is set', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading to="/test" target="_blank">Link</pfv6-breadcrumb-heading>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.getAttribute('target')).to.equal('_blank');
    });
  });

  describe('component property', function() {
    it('defaults to "a"', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`<pfv6-breadcrumb-heading></pfv6-breadcrumb-heading>`);
      expect(el.component).to.equal('a'); // Match React default
    });

    it('accepts "button" value', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading component="button"></pfv6-breadcrumb-heading>`
      );
      expect(el.component).to.equal('button');
    });

    it('renders button when component is "button"', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading component="button">Button</pfv6-breadcrumb-heading>`
      );
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
      expect(button!.type).to.equal('button');
    });

    it('renders anchor when component is "a" and to is set', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading component="a" to="/test">Link</pfv6-breadcrumb-heading>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link).to.exist;
    });
  });

  describe('structure', function() {
    it('wraps content in h1 element', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading>Heading text</pfv6-breadcrumb-heading>`
      );
      const heading = el.shadowRoot!.querySelector('h1');
      expect(heading).to.exist;
      expect(heading!.id).to.equal('heading');
    });

    it('always has aria-current="page" on link', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading to="/test">Current</pfv6-breadcrumb-heading>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.getAttribute('aria-current')).to.equal('page');
    });

    it('applies current class to link', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(
        html`<pfv6-breadcrumb-heading to="/test">Current</pfv6-breadcrumb-heading>`
      );
      const link = el.shadowRoot!.querySelector('a');
      expect(link!.classList.contains('current')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`
        <pfv6-breadcrumb-heading>
          <span>Heading content</span>
        </pfv6-breadcrumb-heading>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Heading content');
    });

    it('renders named icon slot', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-item>First</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-heading>
            <svg slot="icon" id="custom-icon"></svg>
            Current page
          </pfv6-breadcrumb-heading>
        </pfv6-breadcrumb>
      `);
      await el.updateComplete;

      const heading = el.querySelector('pfv6-breadcrumb-heading');
      const icon = heading!.querySelector('[slot="icon"]');

      expect(icon).to.exist;
      expect(icon!.id).to.equal('custom-icon');
    });

    it('shows default divider icon when not first item', async function() {
      const el = await fixture(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-item>First</pfv6-breadcrumb-item>
          <pfv6-breadcrumb-heading>Current</pfv6-breadcrumb-heading>
        </pfv6-breadcrumb>
      `);
      await el.updateComplete;

      const heading = el.querySelector('pfv6-breadcrumb-heading') as Pfv6BreadcrumbHeading;
      await heading.updateComplete;

      const divider = heading.shadowRoot!.querySelector('#divider');
      expect(divider).to.exist;

      const svg = divider!.querySelector('svg');
      expect(svg).to.exist;
    });

    it('hides divider when first item', async function() {
      const el = await fixture(html`
        <pfv6-breadcrumb>
          <pfv6-breadcrumb-heading>Only heading</pfv6-breadcrumb-heading>
        </pfv6-breadcrumb>
      `);
      await el.updateComplete;

      const heading = el.querySelector('pfv6-breadcrumb-heading') as Pfv6BreadcrumbHeading;
      await heading.updateComplete;

      const divider = heading.shadowRoot!.querySelector('#divider');
      expect(divider).to.not.exist;
    });
  });

  describe('ElementInternals', function() {
    it('sets role to listitem', async function() {
      const el = await fixture<Pfv6BreadcrumbHeading>(html`<pfv6-breadcrumb-heading></pfv6-breadcrumb-heading>`);
      expect(el.getAttribute('role')).to.equal('listitem');
    });
  });
});
