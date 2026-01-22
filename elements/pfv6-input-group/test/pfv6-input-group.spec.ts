import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6InputGroup } from '../pfv6-input-group.js';
import { Pfv6InputGroupItem } from '../pfv6-input-group-item.js';
import { Pfv6InputGroupText } from '../pfv6-input-group-text.js';
import '../pfv6-input-group.js';
import '../pfv6-input-group-item.js';
import '../pfv6-input-group-text.js';

describe('<pfv6-input-group>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-input-group')).to.be.an.instanceof(Pfv6InputGroup);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6InputGroup>(html`<pfv6-input-group></pfv6-input-group>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-input-group'))
          .and
          .to.be.an.instanceOf(Pfv6InputGroup);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6InputGroup>(html`
        <pfv6-input-group>
          <input type="text" />
        </pfv6-input-group>
      `);
      const input = el.querySelector('input');
      expect(input).to.exist;
    });

    it('renders multiple children in default slot', async function() {
      const el = await fixture<Pfv6InputGroup>(html`
        <pfv6-input-group>
          <pfv6-input-group-text>$</pfv6-input-group-text>
          <input type="text" />
          <pfv6-input-group-text>.00</pfv6-input-group-text>
        </pfv6-input-group>
      `);
      const text1 = el.querySelector('pfv6-input-group-text:first-of-type');
      const input = el.querySelector('input');
      const text2 = el.querySelector('pfv6-input-group-text:last-of-type');

      expect(text1).to.exist;
      expect(input).to.exist;
      expect(text2).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element with id="container"', async function() {
      const el = await fixture<Pfv6InputGroup>(html`<pfv6-input-group></pfv6-input-group>`);
      const container = el.shadowRoot!.querySelector('div#container');
      expect(container).to.exist;
    });

    it('container contains default slot', async function() {
      const el = await fixture<Pfv6InputGroup>(html`<pfv6-input-group></pfv6-input-group>`);
      const container = el.shadowRoot!.querySelector('div#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('integration with sub-components', function() {
    it('works with pfv6-input-group-item', async function() {
      const el = await fixture<Pfv6InputGroup>(html`
        <pfv6-input-group>
          <pfv6-input-group-item>
            <input type="text" />
          </pfv6-input-group-item>
        </pfv6-input-group>
      `);
      const item = el.querySelector('pfv6-input-group-item');
      expect(item).to.exist;
    });

    it('works with pfv6-input-group-text', async function() {
      const el = await fixture<Pfv6InputGroup>(html`
        <pfv6-input-group>
          <pfv6-input-group-text>Username</pfv6-input-group-text>
          <input type="text" />
        </pfv6-input-group>
      `);
      const text = el.querySelector('pfv6-input-group-text');
      expect(text).to.exist;
      expect(text!.textContent).to.equal('Username');
    });
  });
});

describe('<pfv6-input-group-item>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-input-group-item')).to.be.an.instanceof(Pfv6InputGroupItem);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-input-group-item'))
          .and
          .to.be.an.instanceOf(Pfv6InputGroupItem);
    });
  });

  describe('isBox property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      expect(el.isBox).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-box></pfv6-input-group-item>`);
      expect(el.isBox).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-box></pfv6-input-group-item>`);
      expect(el.hasAttribute('is-box')).to.be.true;
    });

    it('applies box class when true', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-box></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('box')).to.be.true;
    });

    it('does not apply box class when false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('box')).to.be.false;
    });
  });

  describe('isPlain property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      expect(el.isPlain).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-plain></pfv6-input-group-item>`);
      expect(el.isPlain).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-plain></pfv6-input-group-item>`);
      expect(el.hasAttribute('is-plain')).to.be.true;
    });

    it('applies plain class when true', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-plain></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('does not apply plain class when false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.false;
    });
  });

  describe('isFill property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      expect(el.isFill).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-fill></pfv6-input-group-item>`);
      expect(el.isFill).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-fill></pfv6-input-group-item>`);
      expect(el.hasAttribute('is-fill')).to.be.true;
    });

    it('applies fill class when true', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-fill></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('fill')).to.be.true;
    });

    it('does not apply fill class when false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('fill')).to.be.false;
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      expect(el.isDisabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-disabled></pfv6-input-group-item>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-disabled></pfv6-input-group-item>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('applies disabled class when true', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item is-disabled></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.true;
    });

    it('does not apply disabled class when false', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`
        <pfv6-input-group-item>
          <input type="text" />
        </pfv6-input-group-item>
      `);
      const input = el.querySelector('input');
      expect(input).to.exist;
    });

    it('renders text content in default slot', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`
        <pfv6-input-group-item>
          <button>Search</button>
        </pfv6-input-group-item>
      `);
      const button = el.querySelector('button');
      expect(button).to.exist;
      expect(button!.textContent).to.equal('Search');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element with id="container"', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('div#container');
      expect(container).to.exist;
    });

    it('container contains default slot', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('div#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can combine isBox and isFill', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`
        <pfv6-input-group-item is-box is-fill></pfv6-input-group-item>
      `);
      expect(el.isBox).to.be.true;
      expect(el.isFill).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('box')).to.be.true;
      expect(container!.classList.contains('fill')).to.be.true;
    });

    it('can combine isPlain and isDisabled', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`
        <pfv6-input-group-item is-plain is-disabled></pfv6-input-group-item>
      `);
      expect(el.isPlain).to.be.true;
      expect(el.isDisabled).to.be.true;

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.true;
      expect(container!.classList.contains('disabled')).to.be.true;
    });

    it('can combine all properties', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`
        <pfv6-input-group-item is-box is-plain is-fill is-disabled></pfv6-input-group-item>
      `);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('box')).to.be.true;
      expect(container!.classList.contains('plain')).to.be.true;
      expect(container!.classList.contains('fill')).to.be.true;
      expect(container!.classList.contains('disabled')).to.be.true;
    });
  });

  describe('dynamic property updates', function() {
    it('updates isBox dynamically', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('box')).to.be.false;

      el.isBox = true;
      await el.updateComplete;

      expect(container!.classList.contains('box')).to.be.true;
    });

    it('updates isFill dynamically', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('fill')).to.be.false;

      el.isFill = true;
      await el.updateComplete;

      expect(container!.classList.contains('fill')).to.be.true;
    });

    it('updates isPlain dynamically', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('plain')).to.be.false;

      el.isPlain = true;
      await el.updateComplete;

      expect(container!.classList.contains('plain')).to.be.true;
    });

    it('updates isDisabled dynamically', async function() {
      const el = await fixture<Pfv6InputGroupItem>(html`<pfv6-input-group-item></pfv6-input-group-item>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('disabled')).to.be.false;

      el.isDisabled = true;
      await el.updateComplete;

      expect(container!.classList.contains('disabled')).to.be.true;
    });
  });
});

describe('<pfv6-input-group-text>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-input-group-text')).to.be.an.instanceof(Pfv6InputGroupText);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-input-group-text'))
          .and
          .to.be.an.instanceOf(Pfv6InputGroupText);
    });
  });

  describe('isPlain property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      expect(el.isPlain).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text is-plain></pfv6-input-group-text>`);
      expect(el.isPlain).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text is-plain></pfv6-input-group-text>`);
      expect(el.hasAttribute('is-plain')).to.be.true;
    });

    it('passes isPlain to nested pfv6-input-group-item', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text is-plain></pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item).to.exist;
      expect(item!.hasAttribute('is-plain')).to.be.true;
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      expect(el.isDisabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text is-disabled></pfv6-input-group-text>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text is-disabled></pfv6-input-group-text>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('passes isDisabled to nested pfv6-input-group-item', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text is-disabled></pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item).to.exist;
      expect(item!.hasAttribute('is-disabled')).to.be.true;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`
        <pfv6-input-group-text>Username</pfv6-input-group-text>
      `);
      expect(el.textContent?.trim()).to.equal('Username');
    });

    it('renders complex content in default slot', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`
        <pfv6-input-group-text>
          <strong>$</strong>
        </pfv6-input-group-text>
      `);
      const strong = el.querySelector('strong');
      expect(strong).to.exist;
      expect(strong!.textContent).to.equal('$');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders pfv6-input-group-item wrapper', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item).to.exist;
    });

    it('pfv6-input-group-item has is-box attribute', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item!.hasAttribute('is-box')).to.be.true;
    });

    it('renders span element with id="container"', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      const span = el.shadowRoot!.querySelector('span#container');
      expect(span).to.exist;
    });

    it('span contains default slot', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      const span = el.shadowRoot!.querySelector('span#container');
      const slot = span!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can combine isPlain and isDisabled', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`
        <pfv6-input-group-text is-plain is-disabled></pfv6-input-group-text>
      `);
      expect(el.isPlain).to.be.true;
      expect(el.isDisabled).to.be.true;

      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item!.hasAttribute('is-plain')).to.be.true;
      expect(item!.hasAttribute('is-disabled')).to.be.true;
    });
  });

  describe('dynamic property updates', function() {
    it('updates isPlain dynamically', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item!.hasAttribute('is-plain')).to.be.false;

      el.isPlain = true;
      await el.updateComplete;

      expect(item!.hasAttribute('is-plain')).to.be.true;
    });

    it('updates isDisabled dynamically', async function() {
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text></pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item!.hasAttribute('is-disabled')).to.be.false;

      el.isDisabled = true;
      await el.updateComplete;

      expect(item!.hasAttribute('is-disabled')).to.be.true;
    });
  });

  describe('React parity notes', function() {
    it('wraps content with pfv6-input-group-item (matches React behavior)', async function() {
      // React InputGroupText wraps content with InputGroupItem (isBox=true)
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text>$</pfv6-input-group-text>`);
      const item = el.shadowRoot!.querySelector('pfv6-input-group-item');
      expect(item).to.exist;
      expect(item!.hasAttribute('is-box')).to.be.true;
    });

    it('uses span as wrapper element (React default component)', async function() {
      // React default: component = 'span'
      // Web component: always uses span (users wrap with label if needed)
      const el = await fixture<Pfv6InputGroupText>(html`<pfv6-input-group-text>Label</pfv6-input-group-text>`);
      const span = el.shadowRoot!.querySelector('span#container');
      expect(span).to.exist;
      expect(span!.tagName).to.equal('SPAN');
    });

    it('supports semantic label wrapping (alternative to React component prop)', async function() {
      // React: <InputGroupText component="label">Username</InputGroupText>
      // Web component: wrap with label element
      const el = await fixture(html`
        <label>
          <pfv6-input-group-text>Username</pfv6-input-group-text>
        </label>
      `);
      const label = el as HTMLLabelElement;
      const text = label.querySelector('pfv6-input-group-text');
      expect(label.tagName).to.equal('LABEL');
      expect(text).to.exist;
    });
  });
});
