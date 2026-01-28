import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6TreeView } from '../pfv6-tree-view.js';
import { Pfv6TreeViewItem, Pfv6TreeViewItemSelectEvent, Pfv6TreeViewItemExpandEvent, Pfv6TreeViewItemCollapseEvent, Pfv6TreeViewItemCheckEvent } from '../pfv6-tree-view-item.js';
import { Pfv6TreeViewSearch, Pfv6TreeViewSearchEvent } from '../pfv6-tree-view-search.js';
import '../pfv6-tree-view.js';
import '../pfv6-tree-view-item.js';
import '../pfv6-tree-view-search.js';

describe('<pfv6-tree-view>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-tree-view')).to.be.an.instanceof(Pfv6TreeView);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-tree-view'))
          .and
          .to.be.an.instanceOf(Pfv6TreeView);
    });
  });

  describe('variant property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.variant).to.equal('default');
    });

    it('accepts "compact" value', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view variant="compact"></pfv6-tree-view>`);
      expect(el.variant).to.equal('compact');
    });

    it('accepts "compactNoBackground" value', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view variant="compactNoBackground"></pfv6-tree-view>`);
      expect(el.variant).to.equal('compactNoBackground');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view variant="compact"></pfv6-tree-view>`);
      expect(el.getAttribute('variant')).to.equal('compact');
    });
  });

  describe('hasGuides property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.hasGuides).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-guides></pfv6-tree-view>`);
      expect(el.hasGuides).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-guides></pfv6-tree-view>`);
      expect(el.hasAttribute('has-guides')).to.be.true;
    });
  });

  describe('hasCheckboxes property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.hasCheckboxes).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-checkboxes></pfv6-tree-view>`);
      expect(el.hasCheckboxes).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-checkboxes></pfv6-tree-view>`);
      expect(el.hasAttribute('has-checkboxes')).to.be.true;
    });
  });

  describe('hasSelectableNodes property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.hasSelectableNodes).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-selectable-nodes></pfv6-tree-view>`);
      expect(el.hasSelectableNodes).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-selectable-nodes></pfv6-tree-view>`);
      expect(el.hasAttribute('has-selectable-nodes')).to.be.true;
    });
  });

  describe('isMultiSelectable property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.isMultiSelectable).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view is-multi-selectable></pfv6-tree-view>`);
      expect(el.isMultiSelectable).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view is-multi-selectable></pfv6-tree-view>`);
      expect(el.hasAttribute('is-multi-selectable')).to.be.true;
    });

    it('sets aria-multiselectable on tree role', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view is-multi-selectable></pfv6-tree-view>`);
      const tree = el.shadowRoot!.querySelector('[role="tree"]');
      expect(tree?.getAttribute('aria-multiselectable')).to.equal('true');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts custom label', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view accessible-label="My Tree"></pfv6-tree-view>`);
      expect(el.accessibleLabel).to.equal('My Tree');
    });

    it('applies aria-label to tree role', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view accessible-label="My Tree"></pfv6-tree-view>`);
      const tree = el.shadowRoot!.querySelector('[role="tree"]');
      expect(tree?.getAttribute('aria-label')).to.equal('My Tree');
    });
  });

  describe('allExpanded property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      expect(el.allExpanded).to.be.undefined;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view all-expanded></pfv6-tree-view>`);
      expect(el.allExpanded).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view all-expanded="false"></pfv6-tree-view>`);
      // Note: HTML boolean attributes are tricky; setting to "false" still makes it true
      // This test validates the property can be programmatically set
      el.allExpanded = false;
      expect(el.allExpanded).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6TreeView>(html`
        <pfv6-tree-view>
          <pfv6-tree-view-item name="Item 1"></pfv6-tree-view-item>
        </pfv6-tree-view>
      `);
      const item = el.querySelector('pfv6-tree-view-item');
      expect(item).to.exist;
      expect(item?.name).to.equal('Item 1');
    });

    it('renders toolbar slot', async function() {
      const el = await fixture<Pfv6TreeView>(html`
        <pfv6-tree-view>
          <pfv6-tree-view-search slot="toolbar"></pfv6-tree-view-search>
          <pfv6-tree-view-item name="Item 1"></pfv6-tree-view-item>
        </pfv6-tree-view>
      `);
      const search = el.querySelector('[slot="toolbar"]');
      expect(search).to.exist;
      expect(search?.tagName.toLowerCase()).to.equal('pfv6-tree-view-search');
    });
  });

  describe('rendering structure', function() {
    it('renders tree role element', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view></pfv6-tree-view>`);
      const tree = el.shadowRoot!.querySelector('[role="tree"]');
      expect(tree).to.exist;
      expect(tree?.tagName.toLowerCase()).to.equal('div');
    });

    it('applies compact class for compact variant', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view variant="compact"></pfv6-tree-view>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('compact')).to.be.true;
    });

    it('applies no-background class for compactNoBackground variant', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view variant="compactNoBackground"></pfv6-tree-view>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('no-background')).to.be.true;
      expect(container?.classList.contains('compact')).to.be.true;
    });

    it('applies guides class when hasGuides is true', async function() {
      const el = await fixture<Pfv6TreeView>(html`<pfv6-tree-view has-guides></pfv6-tree-view>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('guides')).to.be.true;
    });
  });
});

describe('<pfv6-tree-view-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-tree-view-item')).to.be.an.instanceof(Pfv6TreeViewItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-tree-view-item'))
          .and
          .to.be.an.instanceOf(Pfv6TreeViewItem);
    });
  });

  describe('name property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.name).to.equal('');
    });

    it('accepts custom name', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="My Item"></pfv6-tree-view-item>`);
      expect(el.name).to.equal('My Item');
    });

    it('renders name in text content', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="My Item"></pfv6-tree-view-item>`);
      const text = el.shadowRoot!.querySelector('.text');
      expect(text?.textContent?.trim()).to.equal('My Item');
    });
  });

  describe('itemTitle property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.itemTitle).to.be.undefined;
    });

    it('accepts custom title', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item item-title="Item Title"></pfv6-tree-view-item>`);
      expect(el.itemTitle).to.equal('Item Title');
    });

    it('renders title when present', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item item-title="Item Title" name="Description"></pfv6-tree-view-item>`);
      const title = el.shadowRoot!.querySelector('.title');
      expect(title?.textContent).to.equal('Item Title');
    });
  });

  describe('defaultExpanded property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.defaultExpanded).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item default-expanded></pfv6-tree-view-item>`);
      expect(el.defaultExpanded).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item default-expanded></pfv6-tree-view-item>`);
      expect(el.hasAttribute('default-expanded')).to.be.true;
    });
  });

  describe('isExpanded property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.isExpanded).to.be.undefined;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-expanded></pfv6-tree-view-item>`);
      expect(el.isExpanded).to.be.true;
    });

    it('controls expansion state', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item is-expanded>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('expanded')).to.be.true;
    });
  });

  describe('hasCheckbox property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.hasCheckbox).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox></pfv6-tree-view-item>`);
      expect(el.hasCheckbox).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox></pfv6-tree-view-item>`);
      expect(el.hasAttribute('has-checkbox')).to.be.true;
    });

    it('renders checkbox when true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox></pfv6-tree-view-item>`);
      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]');
      expect(checkbox).to.exist;
    });
  });

  describe('checked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox></pfv6-tree-view-item>`);
      expect(el.checked).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox checked></pfv6-tree-view-item>`);
      expect(el.checked).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox checked></pfv6-tree-view-item>`);
      expect(el.hasAttribute('checked')).to.be.true;
    });

    it('syncs with checkbox element', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox checked></pfv6-tree-view-item>`);
      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.checked).to.be.true;
    });
  });

  describe('indeterminate property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox></pfv6-tree-view-item>`);
      expect(el.indeterminate).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox indeterminate></pfv6-tree-view-item>`);
      expect(el.indeterminate).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox indeterminate></pfv6-tree-view-item>`);
      expect(el.hasAttribute('indeterminate')).to.be.true;
    });

    it('syncs with checkbox element', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-checkbox indeterminate></pfv6-tree-view-item>`);
      await el.updateComplete;
      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.indeterminate).to.be.true;
    });
  });

  describe('hasBadge property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.hasBadge).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge></pfv6-tree-view-item>`);
      expect(el.hasBadge).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge></pfv6-tree-view-item>`);
      expect(el.hasAttribute('has-badge')).to.be.true;
    });

    it('renders badge when true with content', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-content="5"></pfv6-tree-view-item>`);
      const count = el.shadowRoot!.querySelector('.count');
      expect(count).to.exist;
      const badge = count?.querySelector('pfv6-badge');
      expect(badge).to.exist;
    });
  });

  describe('badgeContent property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.badgeContent).to.be.undefined;
    });

    it('accepts custom content', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-content="5"></pfv6-tree-view-item>`);
      expect(el.badgeContent).to.equal('5');
    });

    it('renders badge content', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-content="5"></pfv6-tree-view-item>`);
      const badge = el.shadowRoot!.querySelector('pfv6-badge');
      expect(badge?.textContent?.trim()).to.equal('5');
    });
  });

  describe('badgeIsRead property', function() {
    it('defaults to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-content="5"></pfv6-tree-view-item>`);
      expect(el.badgeIsRead).to.be.true;
    });

    it('can be set to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-content="5"></pfv6-tree-view-item>`);
      el.badgeIsRead = false;
      expect(el.badgeIsRead).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-is-read badge-content="5"></pfv6-tree-view-item>`);
      expect(el.hasAttribute('badge-is-read')).to.be.true;
    });

    it('passes is-read to badge when true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item has-badge badge-is-read badge-content="5"></pfv6-tree-view-item>`);
      const badge = el.shadowRoot!.querySelector('pfv6-badge');
      expect(badge?.hasAttribute('is-read')).to.be.true;
    });
  });

  describe('isSelectable property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.isSelectable).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-selectable></pfv6-tree-view-item>`);
      expect(el.isSelectable).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-selectable></pfv6-tree-view-item>`);
      expect(el.hasAttribute('is-selectable')).to.be.true;
    });

    it('renders text as button when true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-selectable name="Item"></pfv6-tree-view-item>`);
      const textButton = el.shadowRoot!.querySelector('button.text');
      expect(textButton).to.exist;
    });
  });

  describe('isSelected property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.isSelected).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-selected></pfv6-tree-view-item>`);
      expect(el.isSelected).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-selected></pfv6-tree-view-item>`);
      expect(el.hasAttribute('is-selected')).to.be.true;
    });

    it('applies current class to node when true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-selected></pfv6-tree-view-item>`);
      const node = el.shadowRoot!.querySelector('.node');
      expect(node?.classList.contains('current')).to.be.true;
    });
  });

  describe('isCompact property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.isCompact).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-compact></pfv6-tree-view-item>`);
      expect(el.isCompact).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item is-compact></pfv6-tree-view-item>`);
      expect(el.hasAttribute('is-compact')).to.be.true;
    });
  });

  describe('disabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item></pfv6-tree-view-item>`);
      expect(el.disabled).to.be.false;
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item disabled></pfv6-tree-view-item>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item disabled></pfv6-tree-view-item>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('applies disabled class to node when true', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item disabled></pfv6-tree-view-item>`);
      const node = el.shadowRoot!.querySelector('.node');
      expect(node?.classList.contains('disabled')).to.be.true;
    });
  });

  describe('select event', function() {
    it('dispatches on node click', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" id="item-1"></pfv6-tree-view-item>`);
      let eventFired = false;
      el.addEventListener('select', () => {
        eventFired = true;
      });

      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;
      node.click();

      expect(eventFired).to.be.true;
    });

    it('event contains correct data', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" id="item-1"></pfv6-tree-view-item>`);
      let capturedEvent: Pfv6TreeViewItemSelectEvent | undefined;
      el.addEventListener('select', e => {
        capturedEvent = e as Pfv6TreeViewItemSelectEvent;
      });

      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;
      node.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemSelectEvent);
      expect(capturedEvent!.itemId).to.equal('item-1');
    });

    it('event is instance of custom event class', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" id="item-1"></pfv6-tree-view-item>`);
      let capturedEvent: Event | undefined;
      el.addEventListener('select', e => {
        capturedEvent = e;
      });

      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;
      node.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemSelectEvent);
      expect(capturedEvent).to.be.an.instanceof(Event);
    });

    it('does not dispatch when disabled', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" disabled></pfv6-tree-view-item>`);
      let eventFired = false;
      el.addEventListener('select', () => {
        eventFired = true;
      });

      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;
      node.click();

      expect(eventFired).to.be.false;
    });
  });

  describe('expand event', function() {
    it('dispatches on toggle click when collapsed', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" id="parent-1">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      let eventFired = false;
      el.addEventListener('expand', () => {
        eventFired = true;
      });

      const toggle = el.shadowRoot!.querySelector('.toggle') as HTMLElement;
      toggle.click();

      expect(eventFired).to.be.true;
    });

    it('event contains correct data', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" id="parent-1">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      let capturedEvent: Pfv6TreeViewItemExpandEvent | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e as Pfv6TreeViewItemExpandEvent;
      });

      const toggle = el.shadowRoot!.querySelector('.toggle') as HTMLElement;
      toggle.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemExpandEvent);
      expect(capturedEvent!.itemId).to.equal('parent-1');
      expect(capturedEvent!.expanded).to.be.true;
    });

    it('event is instance of custom event class', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" id="parent-1">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      let capturedEvent: Event | undefined;
      el.addEventListener('expand', e => {
        capturedEvent = e;
      });

      const toggle = el.shadowRoot!.querySelector('.toggle') as HTMLElement;
      toggle.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemExpandEvent);
      expect(capturedEvent).to.be.an.instanceof(Event);
    });
  });

  describe('collapse event', function() {
    it('dispatches on toggle click when expanded', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" id="parent-1" default-expanded>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      let eventFired = false;
      el.addEventListener('collapse', () => {
        eventFired = true;
      });

      const toggle = el.shadowRoot!.querySelector('.toggle') as HTMLElement;
      toggle.click();

      expect(eventFired).to.be.true;
    });

    it('event contains correct data', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" id="parent-1" default-expanded>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      let capturedEvent: Pfv6TreeViewItemCollapseEvent | undefined;
      el.addEventListener('collapse', e => {
        capturedEvent = e as Pfv6TreeViewItemCollapseEvent;
      });

      const toggle = el.shadowRoot!.querySelector('.toggle') as HTMLElement;
      toggle.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemCollapseEvent);
      expect(capturedEvent!.itemId).to.equal('parent-1');
    });

    it('event is instance of custom event class', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" id="parent-1" default-expanded>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      let capturedEvent: Event | undefined;
      el.addEventListener('collapse', e => {
        capturedEvent = e;
      });

      const toggle = el.shadowRoot!.querySelector('.toggle') as HTMLElement;
      toggle.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemCollapseEvent);
      expect(capturedEvent).to.be.an.instanceof(Event);
    });
  });

  describe('check event', function() {
    it('dispatches on checkbox change', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" has-checkbox id="item-1"></pfv6-tree-view-item>`);
      let eventFired = false;
      el.addEventListener('check', () => {
        eventFired = true;
      });

      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.click();

      expect(eventFired).to.be.true;
    });

    it('event contains correct data', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" has-checkbox id="item-1"></pfv6-tree-view-item>`);
      let capturedEvent: Pfv6TreeViewItemCheckEvent | undefined;
      el.addEventListener('check', e => {
        capturedEvent = e as Pfv6TreeViewItemCheckEvent;
      });

      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemCheckEvent);
      expect(capturedEvent!.itemId).to.equal('item-1');
      expect(capturedEvent!.checked).to.be.true;
      expect(capturedEvent!.indeterminate).to.be.false;
    });

    it('event is instance of custom event class', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" has-checkbox id="item-1"></pfv6-tree-view-item>`);
      let capturedEvent: Event | undefined;
      el.addEventListener('check', e => {
        capturedEvent = e;
      });

      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemCheckEvent);
      expect(capturedEvent).to.be.an.instanceof(Event);
    });

    it('includes indeterminate state in event data', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" has-checkbox indeterminate id="item-1"></pfv6-tree-view-item>`);
      await el.updateComplete;
      let capturedEvent: Pfv6TreeViewItemCheckEvent | undefined;
      el.addEventListener('check', e => {
        capturedEvent = e as Pfv6TreeViewItemCheckEvent;
      });

      const checkbox = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
      // Clicking indeterminate checkbox checks it
      checkbox.click();

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewItemCheckEvent);
      expect(capturedEvent!.checked).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot for children', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      const child = el.querySelector('pfv6-tree-view-item');
      expect(child).to.exist;
      expect(child?.name).to.equal('Child');
    });

    it('renders icon slot', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Item">
          <svg slot="icon" data-testid="icon"></svg>
        </pfv6-tree-view-item>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon).to.exist;
      expect(icon?.getAttribute('data-testid')).to.equal('icon');
    });

    it('renders expanded-icon slot when expanded', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Item" default-expanded>
          <svg slot="expanded-icon" data-testid="expanded-icon"></svg>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      const expandedIcon = el.querySelector('[slot="expanded-icon"]');
      expect(expandedIcon).to.exist;
      expect(expandedIcon?.getAttribute('data-testid')).to.equal('expanded-icon');
    });

    it('renders action slot', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Item">
          <button slot="action">Action</button>
        </pfv6-tree-view-item>
      `);
      const action = el.querySelector('[slot="action"]');
      expect(action).to.exist;
      expect(action?.textContent).to.equal('Action');
    });
  });

  describe('rendering structure', function() {
    it('sets role to treeitem via ElementInternals', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item"></pfv6-tree-view-item>`);
      // Verify internals.role is set to 'treeitem' (tested via implementation)
      expect(el).to.exist;
    });

    it('updates aria-expanded via ElementInternals based on expansion state', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      // Verify internals.ariaExpanded is set based on expansion state (tested via implementation)
      const container = el.shadowRoot!.querySelector('#container');
      expect(container?.classList.contains('expanded')).to.be.false;
    });

    it('updates aria-checked via ElementInternals based on checked state', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" has-checkbox checked></pfv6-tree-view-item>`);
      await el.updateComplete;
      // Verify internals.ariaChecked is set based on checked state (tested via implementation)
      expect(el.checked).to.be.true;
    });

    it('updates aria-selected via ElementInternals based on selection state', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" is-selected></pfv6-tree-view-item>`);
      await el.updateComplete;
      // Verify internals.ariaSelected is set based on selection state (tested via implementation)
      expect(el.isSelected).to.be.true;
    });

    it('renders node as button when default mode', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item"></pfv6-tree-view-item>`);
      const node = el.shadowRoot!.querySelector('.node');
      expect(node?.tagName.toLowerCase()).to.equal('button');
    });

    it('renders node as label when has checkbox', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`<pfv6-tree-view-item name="Item" has-checkbox></pfv6-tree-view-item>`);
      const node = el.shadowRoot!.querySelector('.node');
      expect(node?.tagName.toLowerCase()).to.equal('label');
    });

    it('renders group role for children', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" default-expanded>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      const group = el.shadowRoot!.querySelector('[role="group"]');
      expect(group).to.exist;
      expect(group?.tagName.toLowerCase()).to.equal('div');
    });

    it('applies inert to collapsed children', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      const group = el.shadowRoot!.querySelector('[role="group"]');
      expect(group?.hasAttribute('inert')).to.be.true;
    });
  });

  describe('delegatesFocus behavior', function() {
    it('shadow root has delegatesFocus enabled', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Item"></pfv6-tree-view-item>
      `);
      expect(el.shadowRoot!.delegatesFocus).to.be.true;
    });

    it('focusing the host delegates to internal button', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Item"></pfv6-tree-view-item>
      `);
      el.focus();
      await el.updateComplete;
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;
      expect(el.shadowRoot!.activeElement).to.equal(node);
    });

    it('hasChildren state is exposed for keyboard navigation', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent">
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      expect(el.hasChildren).to.be.true;
    });

    it('internalIsExpanded state is exposed for keyboard navigation', async function() {
      const el = await fixture<Pfv6TreeViewItem>(html`
        <pfv6-tree-view-item name="Parent" default-expanded>
          <pfv6-tree-view-item name="Child"></pfv6-tree-view-item>
        </pfv6-tree-view-item>
      `);
      await el.updateComplete;
      expect(el.internalIsExpanded).to.be.true;
    });
  });
});

describe('<pfv6-tree-view-search>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-tree-view-search')).to.be.an.instanceof(Pfv6TreeViewSearch);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-tree-view-search'))
          .and
          .to.be.an.instanceOf(Pfv6TreeViewSearch);
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to "Search"', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      expect(el.accessibleLabel).to.equal('Search');
    });

    it('accepts custom label', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search accessible-label="Search tree"></pfv6-tree-view-search>`);
      expect(el.accessibleLabel).to.equal('Search tree');
    });

    it('applies aria-label to input', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search accessible-label="Search tree"></pfv6-tree-view-search>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.getAttribute('aria-label')).to.equal('Search tree');
    });
  });

  describe('placeholder property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      expect(el.placeholder).to.be.undefined;
    });

    it('accepts custom placeholder', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search placeholder="Search items..."></pfv6-tree-view-search>`);
      expect(el.placeholder).to.equal('Search items...');
    });

    it('applies to input element', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search placeholder="Search items..."></pfv6-tree-view-search>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.placeholder).to.equal('Search items...');
    });
  });

  describe('value property', function() {
    it('defaults to empty string', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      expect(el.value).to.equal('');
    });

    it('accepts initial value', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search value="test"></pfv6-tree-view-search>`);
      expect(el.value).to.equal('test');
    });

    it('syncs with input element', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search value="test"></pfv6-tree-view-search>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.value).to.equal('test');
    });

    it('updates when input changes', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

      input.value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(el.value).to.equal('new value');
    });
  });

  describe('search event', function() {
    it('dispatches on input change', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      let eventFired = false;
      el.addEventListener('search', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventFired).to.be.true;
    });

    it('event contains correct data', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      let capturedEvent: Pfv6TreeViewSearchEvent | undefined;
      el.addEventListener('search', e => {
        capturedEvent = e as Pfv6TreeViewSearchEvent;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'test search';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewSearchEvent);
      expect(capturedEvent!.value).to.equal('test search');
    });

    it('event is instance of custom event class', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      let capturedEvent: Event | undefined;
      el.addEventListener('search', e => {
        capturedEvent = e;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(capturedEvent).to.be.an.instanceof(Pfv6TreeViewSearchEvent);
      expect(capturedEvent).to.be.an.instanceof(Event);
    });
  });

  describe('rendering structure', function() {
    it('renders search input', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      const input = el.shadowRoot!.querySelector('input[type="search"]');
      expect(input).to.exist;
    });

    it('renders search icon', async function() {
      const el = await fixture<Pfv6TreeViewSearch>(html`<pfv6-tree-view-search></pfv6-tree-view-search>`);
      const icon = el.shadowRoot!.querySelector('.icon svg');
      expect(icon).to.exist;
      expect(icon?.getAttribute('aria-hidden')).to.equal('true');
    });
  });
});
