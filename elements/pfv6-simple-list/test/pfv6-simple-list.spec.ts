import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6SimpleList, Pfv6SimpleListSelectEvent } from '../pfv6-simple-list.js';
import { Pfv6SimpleListItem, Pfv6SimpleListItemClickEvent } from '../pfv6-simple-list-item.js';
import { Pfv6SimpleListGroup } from '../pfv6-simple-list-group.js';
import '../pfv6-simple-list.js';
import '../pfv6-simple-list-item.js';
import '../pfv6-simple-list-group.js';

describe('<pfv6-simple-list>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-simple-list')).to.be.an.instanceof(Pfv6SimpleList);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6SimpleList>(html`<pfv6-simple-list></pfv6-simple-list>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-simple-list'))
          .and
          .to.be.an.instanceOf(Pfv6SimpleList);
    });
  });

  describe('isControlled property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6SimpleList>(html`<pfv6-simple-list></pfv6-simple-list>`);
      expect(el.isControlled).to.be.true; // Match React default
    });

    it('can be set to false via property', async function() {
      const el = await fixture<Pfv6SimpleList>(html`<pfv6-simple-list></pfv6-simple-list>`);
      el.isControlled = false;
      expect(el.isControlled).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SimpleList>(html`<pfv6-simple-list is-controlled></pfv6-simple-list>`);
      expect(el.hasAttribute('is-controlled')).to.be.true;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6SimpleList>(html`<pfv6-simple-list></pfv6-simple-list>`);
      expect(el.accessibleLabel).to.be.undefined; // Match React default (aria-label optional)
    });

    it('accepts a string value', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list accessible-label="Navigation menu"></pfv6-simple-list>
      `);
      expect(el.accessibleLabel).to.equal('Navigation menu');
    });

    it('applies to internal list element', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list accessible-label="Navigation menu">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);
      await el.updateComplete;
      const list = el.shadowRoot!.querySelector('ul.list');
      expect(list).to.exist;
      expect(list!.getAttribute('aria-label')).to.equal('Navigation menu');
    });
  });

  describe('select event', function() {
    it('dispatches on item click', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item item-id="item-1">Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);

      let capturedEvent: Pfv6SimpleListSelectEvent | null = null;
      el.addEventListener('select', (e) => {
        capturedEvent = e as Pfv6SimpleListSelectEvent;
      });

      const item = el.querySelector('pfv6-simple-list-item');
      const button = item!.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6SimpleListSelectEvent);
    });

    it('event contains itemId', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item item-id="item-1">Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);

      let capturedEvent: Pfv6SimpleListSelectEvent | null = null;
      el.addEventListener('select', (e) => {
        capturedEvent = e as Pfv6SimpleListSelectEvent;
      });

      const item = el.querySelector('pfv6-simple-list-item');
      const button = item!.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent!.itemId).to.equal('item-1'); // Data as class field
    });

    it('event contains itemProps', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item item-id="item-1" component="button" type="button">Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);

      let capturedEvent: Pfv6SimpleListSelectEvent | null = null;
      el.addEventListener('select', (e) => {
        capturedEvent = e as Pfv6SimpleListSelectEvent;
      });

      const item = el.querySelector('pfv6-simple-list-item');
      const button = item!.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent!.itemProps).to.exist;
      expect(capturedEvent!.itemProps!.itemId).to.equal('item-1');
      expect(capturedEvent!.itemProps!.component).to.equal('button');
      expect(capturedEvent!.itemProps!.type).to.equal('button');
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item item-id="item-1">Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);

      let capturedEvent: Pfv6SimpleListSelectEvent | null = null;
      el.addEventListener('select', (e) => {
        capturedEvent = e as Pfv6SimpleListSelectEvent;
      });

      const item = el.querySelector('pfv6-simple-list-item');
      const button = item!.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.bubbles).to.be.true;
    });
  });

  describe('controlled mode', function() {
    it('manages current item state when isControlled is true', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list is-controlled>
          <pfv6-simple-list-item item-id="item-1">Item 1</pfv6-simple-list-item>
          <pfv6-simple-list-item item-id="item-2">Item 2</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);

      const items = el.querySelectorAll('pfv6-simple-list-item');

      // Click first item
      const button1 = items[0].shadowRoot!.querySelector('button');
      button1!.click();
      await el.updateComplete;

      // First item should be current
      expect(button1!.classList.contains('current')).to.be.true;

      // Click second item
      const button2 = items[1].shadowRoot!.querySelector('button');
      button2!.click();
      await el.updateComplete;

      // Second item should be current, first should not
      expect(button2!.classList.contains('current')).to.be.true;
      expect(button1!.classList.contains('current')).to.be.false;
    });

    it('does not manage state when isControlled is false', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item item-id="item-1" is-active>Item 1</pfv6-simple-list-item>
          <pfv6-simple-list-item item-id="item-2">Item 2</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);
      el.isControlled = false;
      await el.updateComplete;

      const items = el.querySelectorAll('pfv6-simple-list-item');

      // First item should be current due to is-active
      const button1 = items[0].shadowRoot!.querySelector('button');
      expect(button1!.classList.contains('current')).to.be.true;

      // Click second item
      const button2 = items[1].shadowRoot!.querySelector('button');
      button2!.click();
      await el.updateComplete;

      // First item should still be current (uncontrolled mode)
      expect(button1!.classList.contains('current')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);
      const slotted = el.querySelector('pfv6-simple-list-item');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Item 1');
    });

    it('wraps ungrouped items in ul element', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);
      await el.updateComplete;
      const list = el.shadowRoot!.querySelector('ul.list');
      expect(list).to.exist;
    });

    it('does not wrap grouped items in ul element', async function() {
      const el = await fixture<Pfv6SimpleList>(html`
        <pfv6-simple-list>
          <pfv6-simple-list-group title="Group 1">
            <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
          </pfv6-simple-list-group>
        </pfv6-simple-list>
      `);
      await el.updateComplete;
      const list = el.shadowRoot!.querySelector('ul.list');
      expect(list).to.not.exist;
    });
  });

  describe('sub-components', function() {
    it('renders pfv6-simple-list-item', async function() {
      const el = await fixture(html`
        <pfv6-simple-list>
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list>
      `);
      const item = el.querySelector('pfv6-simple-list-item');
      expect(item).to.exist;
      expect(item?.textContent).to.equal('Item 1');
    });

    it('renders pfv6-simple-list-group', async function() {
      const el = await fixture(html`
        <pfv6-simple-list>
          <pfv6-simple-list-group title="Group 1">
            <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
          </pfv6-simple-list-group>
        </pfv6-simple-list>
      `);
      const group = el.querySelector('pfv6-simple-list-group');
      expect(group).to.exist;
    });
  });
});

describe('<pfv6-simple-list-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-simple-list-item')).to.be.an.instanceof(Pfv6SimpleListItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`<pfv6-simple-list-item></pfv6-simple-list-item>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-simple-list-item'))
          .and
          .to.be.an.instanceOf(Pfv6SimpleListItem);
    });
  });

  describe('itemId property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`<pfv6-simple-list-item></pfv6-simple-list-item>`);
      expect(el.itemId).to.be.undefined; // Match React default (optional)
    });

    it('accepts a string value', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item item-id="item-1">Item 1</pfv6-simple-list-item>
      `);
      expect(el.itemId).to.equal('item-1');
    });

    it('accepts a number value', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item item-id="123">Item 1</pfv6-simple-list-item>
      `);
      expect(el.itemId).to.equal('123');
    });
  });

  describe('component property', function() {
    it('defaults to "button"', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`<pfv6-simple-list-item></pfv6-simple-list-item>`);
      expect(el.component).to.equal('button'); // Match React default
    });

    it('accepts "a" value', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item component="a">Item 1</pfv6-simple-list-item>
      `);
      expect(el.component).to.equal('a');
    });

    it('renders button element when component="button"', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item component="button">Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
    });

    it('renders anchor element when href is provided', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item href="/page">Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor).to.exist;
    });

    it('renders button element when component="a" but no href (href determines element type)', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item component="a">Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      // Without href, renders as button regardless of component property
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
    });
  });

  describe('isActive property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`<pfv6-simple-list-item></pfv6-simple-list-item>`);
      expect(el.isActive).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item is-active>Item 1</pfv6-simple-list-item>
      `);
      expect(el.isActive).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item is-active>Item 1</pfv6-simple-list-item>
      `);
      expect(el.hasAttribute('is-active')).to.be.true;
    });

    it('applies current class when active', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item is-active>Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('current')).to.be.true;
    });
  });

  describe('type property', function() {
    it('defaults to "button"', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`<pfv6-simple-list-item></pfv6-simple-list-item>`);
      expect(el.type).to.equal('button'); // Match React default (implied from componentProps type)
    });

    it('accepts "submit" value', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item type="submit">Item 1</pfv6-simple-list-item>
      `);
      expect(el.type).to.equal('submit');
    });

    it('accepts "reset" value', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item type="reset">Item 1</pfv6-simple-list-item>
      `);
      expect(el.type).to.equal('reset');
    });

    it('applies to button element', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item type="submit">Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.type).to.equal('submit');
    });
  });

  describe('href property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`<pfv6-simple-list-item></pfv6-simple-list-item>`);
      expect(el.href).to.equal(''); // Match React default (optional)
    });

    it('accepts a URL value', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item href="/path/to/page">Item 1</pfv6-simple-list-item>
      `);
      expect(el.href).to.equal('/path/to/page');
    });

    it('applies to anchor element', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item component="a" href="/path/to/page">Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor!.getAttribute('href')).to.equal('/path/to/page');
    });

    it('renders button when href is empty (href determines element type)', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      // Without href, renders as button
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor).to.not.exist;
    });
  });

  describe('click event', function() {
    it('dispatches on click', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
      `);

      let capturedEvent: Pfv6SimpleListItemClickEvent | null = null;
      el.addEventListener('click', (e) => {
        capturedEvent = e as Pfv6SimpleListItemClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6SimpleListItemClickEvent);
    });

    it('event contains itemId', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item item-id="item-1">Item 1</pfv6-simple-list-item>
      `);

      let capturedEvent: Pfv6SimpleListItemClickEvent | null = null;
      el.addEventListener('click', (e) => {
        capturedEvent = e as Pfv6SimpleListItemClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent!.itemId).to.equal('item-1'); // Data as class field
    });

    it('event bubbles', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
      `);

      let capturedEvent: Pfv6SimpleListItemClickEvent | null = null;
      el.addEventListener('click', (e) => {
        capturedEvent = e as Pfv6SimpleListItemClickEvent;
      });

      const button = el.shadowRoot!.querySelector('button');
      button!.click();

      expect(capturedEvent).to.exist;
      expect(capturedEvent!.bubbles).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item>
          <span>Item content</span>
        </pfv6-simple-list-item>
      `);
      const slotted = el.querySelector('span');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Item content');
    });
  });

  describe('link variant styling', function() {
    it('applies link class when href is provided', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item href="/page">Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const anchor = el.shadowRoot!.querySelector('a');
      expect(anchor!.classList.contains('link')).to.be.true;
    });

    it('does not apply link class when no href (renders as button)', async function() {
      const el = await fixture<Pfv6SimpleListItem>(html`
        <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('link')).to.be.false;
    });
  });
});

describe('<pfv6-simple-list-group>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-simple-list-group')).to.be.an.instanceof(Pfv6SimpleListGroup);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`<pfv6-simple-list-group></pfv6-simple-list-group>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-simple-list-group'))
          .and
          .to.be.an.instanceOf(Pfv6SimpleListGroup);
    });
  });

  describe('title property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`<pfv6-simple-list-group></pfv6-simple-list-group>`);
      expect(el.title).to.equal(''); // Match React default
    });

    it('accepts a string value', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title="Group Title">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      expect(el.title).to.equal('Group Title');
    });

    it('renders title as h2 element', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title="Group Title">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const titleEl = el.shadowRoot!.querySelector('h2.title');
      expect(titleEl).to.exist;
      expect(titleEl!.textContent!.trim()).to.equal('Group Title');
    });
  });

  describe('titleId property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`<pfv6-simple-list-group></pfv6-simple-list-group>`);
      expect(el.titleId).to.equal(''); // Match React default (optional id)
    });

    it('accepts a string value', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title-id="custom-id" title="Group Title">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      expect(el.titleId).to.equal('custom-id');
    });

    it('applies to title element', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title-id="custom-id" title="Group Title">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const titleEl = el.shadowRoot!.querySelector('h2.title');
      expect(titleEl!.id).to.equal('custom-id');
    });

    it('generates id from element id when titleId not provided', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group id="group-1" title="Group Title">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const titleEl = el.shadowRoot!.querySelector('h2.title');
      expect(titleEl!.id).to.equal('group-1-title');
    });

    it('uses for aria-labelledby on list', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title-id="custom-id" title="Group Title">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const list = el.shadowRoot!.querySelector('ul.list');
      expect(list!.getAttribute('aria-labelledby')).to.equal('custom-id');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title="Group">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      const slotted = el.querySelector('pfv6-simple-list-item');
      expect(slotted).to.exist;
    });

    it('renders title slot when no title property', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group>
          <span slot="title">Custom Title</span>
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      const titleSlot = el.querySelector('[slot="title"]');
      expect(titleSlot).to.exist;
      expect(titleSlot?.textContent).to.equal('Custom Title');
    });

    it('prefers title property over title slot', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title="Property Title">
          <span slot="title">Slot Title</span>
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const titleEl = el.shadowRoot!.querySelector('h2.title');
      expect(titleEl).to.exist;
      expect(titleEl!.textContent!.trim()).to.equal('Property Title');
    });
  });

  describe('list structure', function() {
    it('wraps items in ul element', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title="Group">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const list = el.shadowRoot!.querySelector('ul.list');
      expect(list).to.exist;
    });

    it('wraps in section element', async function() {
      const el = await fixture<Pfv6SimpleListGroup>(html`
        <pfv6-simple-list-group title="Group">
          <pfv6-simple-list-item>Item 1</pfv6-simple-list-item>
        </pfv6-simple-list-group>
      `);
      await el.updateComplete;
      const section = el.shadowRoot!.querySelector('section#container');
      expect(section).to.exist;
    });
  });
});
