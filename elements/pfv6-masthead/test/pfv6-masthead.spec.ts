import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Masthead } from '../pfv6-masthead.js';
import { Pfv6MastheadToggle } from '../pfv6-masthead-toggle.js';
import { Pfv6MastheadMain } from '../pfv6-masthead-main.js';
import { Pfv6MastheadBrand } from '../pfv6-masthead-brand.js';
import { Pfv6MastheadLogo } from '../pfv6-masthead-logo.js';
import { Pfv6MastheadContent } from '../pfv6-masthead-content.js';
import '../pfv6-masthead.js';
import '../pfv6-masthead-toggle.js';
import '../pfv6-masthead-main.js';
import '../pfv6-masthead-brand.js';
import '../pfv6-masthead-logo.js';
import '../pfv6-masthead-content.js';

describe('<pfv6-masthead>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-masthead')).to.be.an.instanceof(Pfv6Masthead);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead></pfv6-masthead>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-masthead'))
          .and
          .to.be.an.instanceOf(Pfv6Masthead);
    });
  });

  describe('display property', function() {
    it('defaults to { md: "inline" }', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead></pfv6-masthead>`);
      // Default display: { md: 'inline' } is applied in render
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-inline-on-md')).to.be.true;
    });

    it('accepts "inline" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead display="inline"></pfv6-masthead>`);
      expect(el.display).to.deep.equal({ default: 'inline' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-inline')).to.be.true;
    });

    it('accepts "stack" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead display="stack"></pfv6-masthead>`);
      expect(el.display).to.deep.equal({ default: 'stack' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-stack')).to.be.true;
    });

    it('accepts responsive values', async function() {
      const el = await fixture<Pfv6Masthead>(
        html`<pfv6-masthead display="inline md:stack lg:inline"></pfv6-masthead>`
      );
      expect(el.display).to.deep.equal({
        default: 'inline',
        md: 'stack',
        lg: 'inline',
      });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-inline')).to.be.true;
      expect(container!.classList.contains('display-stack-on-md')).to.be.true;
      expect(container!.classList.contains('display-inline-on-lg')).to.be.true;
    });

    it('supports all breakpoints (sm, md, lg, xl, 2xl)', async function() {
      const el = await fixture<Pfv6Masthead>(
        html`<pfv6-masthead display="inline sm:stack md:inline lg:stack xl:inline 2xl:stack"></pfv6-masthead>`
      );
      expect(el.display).to.deep.equal({
        'default': 'inline',
        'sm': 'stack',
        'md': 'inline',
        'lg': 'stack',
        'xl': 'inline',
        '2xl': 'stack',
      });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-inline')).to.be.true;
      expect(container!.classList.contains('display-stack-on-sm')).to.be.true;
      expect(container!.classList.contains('display-inline-on-md')).to.be.true;
      expect(container!.classList.contains('display-stack-on-lg')).to.be.true;
      expect(container!.classList.contains('display-inline-on-xl')).to.be.true;
      expect(container!.classList.contains('display-stack-on-2xl')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead display="inline"></pfv6-masthead>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-inline')).to.be.true;

      el.setAttribute('display', 'stack');
      await el.updateComplete;

      expect(el.display).to.deep.equal({ default: 'stack' });
      expect(container!.classList.contains('display-stack')).to.be.true;
      expect(container!.classList.contains('display-inline')).to.be.false;
    });
  });

  describe('inset property', function() {
    it('defaults to undefined (no inset)', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead></pfv6-masthead>`);
      expect(el.inset).to.be.undefined;
    });

    it('accepts "insetNone" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetNone"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'insetNone' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-none')).to.be.true;
    });

    it('accepts "insetXs" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetXs"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'insetXs' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-xs')).to.be.true;
    });

    it('accepts "insetSm" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetSm"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'insetSm' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-sm')).to.be.true;
    });

    it('accepts "insetMd" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetMd"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'insetMd' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-md')).to.be.true;
    });

    it('accepts "insetLg" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetLg"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'insetLg' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-lg')).to.be.true;
    });

    it('accepts "insetXl" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetXl"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'insetXl' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-xl')).to.be.true;
    });

    it('accepts "inset2xl" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="inset2xl"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'inset2xl' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-2xl')).to.be.true;
    });

    it('accepts "inset3xl" value', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="inset3xl"></pfv6-masthead>`);
      expect(el.inset).to.deep.equal({ default: 'inset3xl' });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-3xl')).to.be.true;
    });

    it('accepts responsive values', async function() {
      const el = await fixture<Pfv6Masthead>(
        html`<pfv6-masthead inset="insetSm md:insetMd lg:insetLg"></pfv6-masthead>`
      );
      expect(el.inset).to.deep.equal({
        default: 'insetSm',
        md: 'insetMd',
        lg: 'insetLg',
      });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-sm')).to.be.true;
      expect(container!.classList.contains('inset-md-on-md')).to.be.true;
      expect(container!.classList.contains('inset-lg-on-lg')).to.be.true;
    });

    it('supports all breakpoints (sm, md, lg, xl, 2xl)', async function() {
      const el = await fixture<Pfv6Masthead>(
        html`<pfv6-masthead inset="insetXs sm:insetSm md:insetMd lg:insetLg xl:insetXl 2xl:inset2xl"></pfv6-masthead>`
      );
      expect(el.inset).to.deep.equal({
        'default': 'insetXs',
        'sm': 'insetSm',
        'md': 'insetMd',
        'lg': 'insetLg',
        'xl': 'insetXl',
        '2xl': 'inset2xl',
      });
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-xs')).to.be.true;
      expect(container!.classList.contains('inset-sm-on-sm')).to.be.true;
      expect(container!.classList.contains('inset-md-on-md')).to.be.true;
      expect(container!.classList.contains('inset-lg-on-lg')).to.be.true;
      expect(container!.classList.contains('inset-xl-on-xl')).to.be.true;
      expect(container!.classList.contains('inset-2xl-on-2xl')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead inset="insetSm"></pfv6-masthead>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('inset-sm')).to.be.true;

      el.setAttribute('inset', 'insetLg');
      await el.updateComplete;

      expect(el.inset).to.deep.equal({ default: 'insetLg' });
      expect(container!.classList.contains('inset-lg')).to.be.true;
      expect(container!.classList.contains('inset-sm')).to.be.false;
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Masthead>(html`
        <pfv6-masthead>
          <div>Masthead content</div>
        </pfv6-masthead>
      `);
      const slotted = el.querySelector('div');
      expect(slotted).to.exist;
      expect(slotted?.textContent).to.equal('Masthead content');
    });

    it('renders multiple child elements', async function() {
      const el = await fixture<Pfv6Masthead>(html`
        <pfv6-masthead>
          <pfv6-masthead-toggle>Toggle</pfv6-masthead-toggle>
          <pfv6-masthead-main>Main</pfv6-masthead-main>
          <pfv6-masthead-content>Content</pfv6-masthead-content>
        </pfv6-masthead>
      `);
      const toggle = el.querySelector('pfv6-masthead-toggle');
      const main = el.querySelector('pfv6-masthead-main');
      const content = el.querySelector('pfv6-masthead-content');
      expect(toggle).to.exist;
      expect(main).to.exist;
      expect(content).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders header element', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead></pfv6-masthead>`);
      const header = el.shadowRoot!.querySelector('header');
      expect(header).to.exist;
    });

    it('header has id="container"', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead></pfv6-masthead>`);
      const header = el.shadowRoot!.querySelector('#container');
      expect(header).to.exist;
      expect(header!.tagName).to.equal('HEADER');
    });

    it('header contains default slot', async function() {
      const el = await fixture<Pfv6Masthead>(html`<pfv6-masthead></pfv6-masthead>`);
      const header = el.shadowRoot!.querySelector('header');
      const slot = header!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('combined properties', function() {
    it('can have both display and inset set', async function() {
      const el = await fixture<Pfv6Masthead>(
        html`<pfv6-masthead display="stack" inset="insetMd"></pfv6-masthead>`
      );
      expect(el.display).to.deep.equal({ default: 'stack' });
      expect(el.inset).to.deep.equal({ default: 'insetMd' });

      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-stack')).to.be.true;
      expect(container!.classList.contains('inset-md')).to.be.true;
    });

    it('responsive display and inset work together', async function() {
      const el = await fixture<Pfv6Masthead>(
        html`<pfv6-masthead display="inline md:stack" inset="insetSm md:insetLg"></pfv6-masthead>`
      );
      const container = el.shadowRoot!.querySelector('#container');
      expect(container!.classList.contains('display-inline')).to.be.true;
      expect(container!.classList.contains('display-stack-on-md')).to.be.true;
      expect(container!.classList.contains('inset-sm')).to.be.true;
      expect(container!.classList.contains('inset-lg-on-md')).to.be.true;
    });
  });
});

describe('<pfv6-masthead-toggle>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-masthead-toggle')).to.be.an.instanceof(Pfv6MastheadToggle);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MastheadToggle>(html`<pfv6-masthead-toggle></pfv6-masthead-toggle>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-masthead-toggle'))
          .and
          .to.be.an.instanceOf(Pfv6MastheadToggle);
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MastheadToggle>(html`
        <pfv6-masthead-toggle>
          <button>Toggle</button>
        </pfv6-masthead-toggle>
      `);
      const button = el.querySelector('button');
      expect(button).to.exist;
      expect(button?.textContent).to.equal('Toggle');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders span element', async function() {
      const el = await fixture<Pfv6MastheadToggle>(html`<pfv6-masthead-toggle></pfv6-masthead-toggle>`);
      const span = el.shadowRoot!.querySelector('span');
      expect(span).to.exist;
    });

    it('span has id="container"', async function() {
      const el = await fixture<Pfv6MastheadToggle>(html`<pfv6-masthead-toggle></pfv6-masthead-toggle>`);
      const span = el.shadowRoot!.querySelector('#container');
      expect(span).to.exist;
      expect(span!.tagName).to.equal('SPAN');
    });

    it('span contains default slot', async function() {
      const el = await fixture<Pfv6MastheadToggle>(html`<pfv6-masthead-toggle></pfv6-masthead-toggle>`);
      const span = el.shadowRoot!.querySelector('span');
      const slot = span!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('<pfv6-masthead-main>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-masthead-main')).to.be.an.instanceof(Pfv6MastheadMain);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MastheadMain>(html`<pfv6-masthead-main></pfv6-masthead-main>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-masthead-main'))
          .and
          .to.be.an.instanceOf(Pfv6MastheadMain);
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MastheadMain>(html`
        <pfv6-masthead-main>
          <div>Main content</div>
        </pfv6-masthead-main>
      `);
      const div = el.querySelector('div');
      expect(div).to.exist;
      expect(div?.textContent).to.equal('Main content');
    });

    it('renders toggle and brand children', async function() {
      const el = await fixture<Pfv6MastheadMain>(html`
        <pfv6-masthead-main>
          <pfv6-masthead-toggle>Toggle</pfv6-masthead-toggle>
          <pfv6-masthead-brand>Brand</pfv6-masthead-brand>
        </pfv6-masthead-main>
      `);
      const toggle = el.querySelector('pfv6-masthead-toggle');
      const brand = el.querySelector('pfv6-masthead-brand');
      expect(toggle).to.exist;
      expect(brand).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element', async function() {
      const el = await fixture<Pfv6MastheadMain>(html`<pfv6-masthead-main></pfv6-masthead-main>`);
      const div = el.shadowRoot!.querySelector('div');
      expect(div).to.exist;
    });

    it('div has id="container"', async function() {
      const el = await fixture<Pfv6MastheadMain>(html`<pfv6-masthead-main></pfv6-masthead-main>`);
      const div = el.shadowRoot!.querySelector('#container');
      expect(div).to.exist;
      expect(div!.tagName).to.equal('DIV');
    });

    it('div contains default slot', async function() {
      const el = await fixture<Pfv6MastheadMain>(html`<pfv6-masthead-main></pfv6-masthead-main>`);
      const div = el.shadowRoot!.querySelector('div');
      const slot = div!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('<pfv6-masthead-brand>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-masthead-brand')).to.be.an.instanceof(Pfv6MastheadBrand);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MastheadBrand>(html`<pfv6-masthead-brand></pfv6-masthead-brand>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-masthead-brand'))
          .and
          .to.be.an.instanceOf(Pfv6MastheadBrand);
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MastheadBrand>(html`
        <pfv6-masthead-brand>
          <a href="/">Brand</a>
        </pfv6-masthead-brand>
      `);
      const link = el.querySelector('a');
      expect(link).to.exist;
      expect(link?.textContent).to.equal('Brand');
    });

    it('renders logo child', async function() {
      const el = await fixture<Pfv6MastheadBrand>(html`
        <pfv6-masthead-brand>
          <pfv6-masthead-logo href="/">Logo</pfv6-masthead-logo>
        </pfv6-masthead-brand>
      `);
      const logo = el.querySelector('pfv6-masthead-logo');
      expect(logo).to.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element', async function() {
      const el = await fixture<Pfv6MastheadBrand>(html`<pfv6-masthead-brand></pfv6-masthead-brand>`);
      const div = el.shadowRoot!.querySelector('div');
      expect(div).to.exist;
    });

    it('div has id="container"', async function() {
      const el = await fixture<Pfv6MastheadBrand>(html`<pfv6-masthead-brand></pfv6-masthead-brand>`);
      const div = el.shadowRoot!.querySelector('#container');
      expect(div).to.exist;
      expect(div!.tagName).to.equal('DIV');
    });

    it('div contains default slot', async function() {
      const el = await fixture<Pfv6MastheadBrand>(html`<pfv6-masthead-brand></pfv6-masthead-brand>`);
      const div = el.shadowRoot!.querySelector('div');
      const slot = div!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('<pfv6-masthead-logo>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-masthead-logo')).to.be.an.instanceof(Pfv6MastheadLogo);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo></pfv6-masthead-logo>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-masthead-logo'))
          .and
          .to.be.an.instanceOf(Pfv6MastheadLogo);
    });
  });

  describe('href property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo></pfv6-masthead-logo>`);
      expect(el.href).to.be.undefined;
    });

    it('renders as span when href is undefined', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo>Logo</pfv6-masthead-logo>`);
      const span = el.shadowRoot!.querySelector('span#container');
      const link = el.shadowRoot!.querySelector('a#container');
      expect(span).to.exist;
      expect(link).to.not.exist;
    });

    it('accepts string href value', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo href="/"></pfv6-masthead-logo>`);
      expect(el.href).to.equal('/');
    });

    it('renders as link when href is provided', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo href="/">Logo</pfv6-masthead-logo>`);
      const link = el.shadowRoot!.querySelector('a#container');
      const span = el.shadowRoot!.querySelector('span#container');
      expect(link).to.exist;
      expect(span).to.not.exist;
      expect(link!.getAttribute('href')).to.equal('/');
    });

    it('link has tabindex="0" when href provided', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo href="/">Logo</pfv6-masthead-logo>`);
      const link = el.shadowRoot!.querySelector('a#container');
      expect(link!.getAttribute('tabindex')).to.equal('0');
    });

    it('can be changed dynamically from undefined to href', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo>Logo</pfv6-masthead-logo>`);
      expect(el.shadowRoot!.querySelector('span#container')).to.exist;
      expect(el.shadowRoot!.querySelector('a#container')).to.not.exist;

      el.href = '/home';
      await el.updateComplete;

      expect(el.href).to.equal('/home');
      expect(el.shadowRoot!.querySelector('a#container')).to.exist;
      expect(el.shadowRoot!.querySelector('span#container')).to.not.exist;
    });

    it('can be changed dynamically from href to undefined', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo href="/">Logo</pfv6-masthead-logo>`);
      expect(el.shadowRoot!.querySelector('a#container')).to.exist;
      expect(el.shadowRoot!.querySelector('span#container')).to.not.exist;

      el.removeAttribute('href');
      await el.updateComplete;

      expect(el.href).to.be.undefined;
      expect(el.shadowRoot!.querySelector('span#container')).to.exist;
      expect(el.shadowRoot!.querySelector('a#container')).to.not.exist;
    });

    it('updates href value dynamically', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo href="/">Logo</pfv6-masthead-logo>`);
      const link1 = el.shadowRoot!.querySelector('a#container');
      expect(link1!.getAttribute('href')).to.equal('/');

      el.href = '/about';
      await el.updateComplete;

      const link2 = el.shadowRoot!.querySelector('a#container');
      expect(link2!.getAttribute('href')).to.equal('/about');
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content as span', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`
        <pfv6-masthead-logo>
          <img src="logo.png" alt="Logo" />
        </pfv6-masthead-logo>
      `);
      const img = el.querySelector('img');
      expect(img).to.exist;
      expect(img?.getAttribute('alt')).to.equal('Logo');
    });

    it('renders default slot content as link', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`
        <pfv6-masthead-logo href="/">
          <img src="logo.png" alt="Logo" />
        </pfv6-masthead-logo>
      `);
      const img = el.querySelector('img');
      expect(img).to.exist;
      expect(img?.getAttribute('alt')).to.equal('Logo');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container element', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo></pfv6-masthead-logo>`);
      const container = el.shadowRoot!.querySelector('#container');
      expect(container).to.exist;
    });

    it('container contains default slot', async function() {
      const el = await fixture<Pfv6MastheadLogo>(html`<pfv6-masthead-logo></pfv6-masthead-logo>`);
      const container = el.shadowRoot!.querySelector('#container');
      const slot = container!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('<pfv6-masthead-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-masthead-content')).to.be.an.instanceof(Pfv6MastheadContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6MastheadContent>(html`<pfv6-masthead-content></pfv6-masthead-content>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-masthead-content'))
          .and
          .to.be.an.instanceOf(Pfv6MastheadContent);
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6MastheadContent>(html`
        <pfv6-masthead-content>
          <div>Content</div>
        </pfv6-masthead-content>
      `);
      const div = el.querySelector('div');
      expect(div).to.exist;
      expect(div?.textContent).to.equal('Content');
    });

    it('renders navigation children', async function() {
      const el = await fixture<Pfv6MastheadContent>(html`
        <pfv6-masthead-content>
          <nav>Navigation</nav>
        </pfv6-masthead-content>
      `);
      const nav = el.querySelector('nav');
      expect(nav).to.exist;
      expect(nav?.textContent).to.equal('Navigation');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders div element', async function() {
      const el = await fixture<Pfv6MastheadContent>(html`<pfv6-masthead-content></pfv6-masthead-content>`);
      const div = el.shadowRoot!.querySelector('div');
      expect(div).to.exist;
    });

    it('div has id="container"', async function() {
      const el = await fixture<Pfv6MastheadContent>(html`<pfv6-masthead-content></pfv6-masthead-content>`);
      const div = el.shadowRoot!.querySelector('#container');
      expect(div).to.exist;
      expect(div!.tagName).to.equal('DIV');
    });

    it('div contains default slot', async function() {
      const el = await fixture<Pfv6MastheadContent>(html`<pfv6-masthead-content></pfv6-masthead-content>`);
      const div = el.shadowRoot!.querySelector('div');
      const slot = div!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });
});

describe('Masthead composition', function() {
  it('renders complete masthead structure', async function() {
    const el = await fixture(html`
      <pfv6-masthead>
        <pfv6-masthead-main>
          <pfv6-masthead-toggle>
            <button>Toggle</button>
          </pfv6-masthead-toggle>
          <pfv6-masthead-brand>
            <pfv6-masthead-logo href="/">
              <img src="logo.png" alt="Logo" />
            </pfv6-masthead-logo>
          </pfv6-masthead-brand>
        </pfv6-masthead-main>
        <pfv6-masthead-content>
          <nav>Navigation</nav>
        </pfv6-masthead-content>
      </pfv6-masthead>
    `);

    const masthead = el.querySelector('pfv6-masthead');
    const main = el.querySelector('pfv6-masthead-main');
    const toggle = el.querySelector('pfv6-masthead-toggle');
    const brand = el.querySelector('pfv6-masthead-brand');
    const logo = el.querySelector('pfv6-masthead-logo');
    const content = el.querySelector('pfv6-masthead-content');

    expect(masthead).to.exist;
    expect(main).to.exist;
    expect(toggle).to.exist;
    expect(brand).to.exist;
    expect(logo).to.exist;
    expect(content).to.exist;

    const button = toggle!.querySelector('button');
    const img = logo!.querySelector('img');
    const nav = content!.querySelector('nav');

    expect(button).to.exist;
    expect(button?.textContent).to.equal('Toggle');
    expect(img).to.exist;
    expect(img?.getAttribute('alt')).to.equal('Logo');
    expect(nav).to.exist;
    expect(nav?.textContent).to.equal('Navigation');
  });

  it('all sub-components are properly nested', async function() {
    const el = await fixture(html`
      <pfv6-masthead>
        <pfv6-masthead-main>
          <pfv6-masthead-brand>
            <pfv6-masthead-logo href="/">Logo</pfv6-masthead-logo>
          </pfv6-masthead-brand>
        </pfv6-masthead-main>
      </pfv6-masthead>
    `);

    const masthead = el.querySelector('pfv6-masthead');
    const main = masthead!.querySelector('pfv6-masthead-main');
    const brand = main!.querySelector('pfv6-masthead-brand');
    const logo = brand!.querySelector('pfv6-masthead-logo');

    expect(masthead).to.exist;
    expect(main).to.exist;
    expect(brand).to.exist;
    expect(logo).to.exist;
  });
});
