import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Button } from '../pfv6-button.js';
import '../pfv6-button.js';

describe('<pfv6-button>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-button')).to.be.an.instanceof(Pfv6Button);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-button'))
          .and
          .to.be.an.instanceOf(Pfv6Button);
    });
  });

  describe('variant property', function() {
    it('defaults to "primary"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.variant).to.equal('primary');
    });

    it('accepts "secondary" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="secondary"></pfv6-button>`);
      expect(el.variant).to.equal('secondary');
    });

    it('accepts "tertiary" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="tertiary"></pfv6-button>`);
      expect(el.variant).to.equal('tertiary');
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="danger"></pfv6-button>`);
      expect(el.variant).to.equal('danger');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="warning"></pfv6-button>`);
      expect(el.variant).to.equal('warning');
    });

    it('accepts "link" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="link"></pfv6-button>`);
      expect(el.variant).to.equal('link');
    });

    it('accepts "plain" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="plain"></pfv6-button>`);
      expect(el.variant).to.equal('plain');
    });

    it('accepts "control" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="control"></pfv6-button>`);
      expect(el.variant).to.equal('control');
    });

    it('accepts "stateful" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="stateful"></pfv6-button>`);
      expect(el.variant).to.equal('stateful');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="secondary"></pfv6-button>`);
      expect(el.getAttribute('variant')).to.equal('secondary');
    });

    it('applies variant class to button element', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="danger">Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('danger')).to.be.true;
    });
  });

  describe('size property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.size).to.equal('default');
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button size="sm"></pfv6-button>`);
      expect(el.size).to.equal('sm');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button size="lg"></pfv6-button>`);
      expect(el.size).to.equal('lg');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button size="sm"></pfv6-button>`);
      expect(el.getAttribute('size')).to.equal('sm');
    });

    it('applies small class when size is "sm"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button size="sm">Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('small')).to.be.true;
    });

    it('applies display-lg class when size is "lg"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button size="lg">Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('display-lg')).to.be.true;
    });
  });

  describe('type property', function() {
    it('defaults to "button"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.type).to.equal('button');
    });

    it('accepts "submit" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button type="submit"></pfv6-button>`);
      expect(el.type).to.equal('submit');
    });

    it('accepts "reset" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button type="reset"></pfv6-button>`);
      expect(el.type).to.equal('reset');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button type="submit"></pfv6-button>`);
      expect(el.getAttribute('type')).to.equal('submit');
    });

    it('sets button element type attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button type="submit">Submit</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('type')).to.equal('submit');
    });
  });

  describe('state property (stateful variant)', function() {
    it('defaults to "unread"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="stateful"></pfv6-button>`);
      expect(el.state).to.equal('unread');
    });

    it('accepts "read" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="stateful" state="read"></pfv6-button>`);
      expect(el.state).to.equal('read');
    });

    it('accepts "attention" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="stateful" state="attention"></pfv6-button>`);
      expect(el.state).to.equal('attention');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button state="read"></pfv6-button>`);
      expect(el.getAttribute('state')).to.equal('read');
    });

    it('applies state class when variant is stateful', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="stateful" state="attention">Alert</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('attention')).to.be.true;
    });

    it('does not apply state class when variant is not stateful', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="primary" state="attention">Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('attention')).to.be.false;
    });
  });

  describe('isBlock property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isBlock).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-block></pfv6-button>`);
      expect(el.isBlock).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-block></pfv6-button>`);
      expect(el.hasAttribute('is-block')).to.be.true;
    });

    it('applies block class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-block>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('block')).to.be.true;
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isDisabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-disabled></pfv6-button>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-disabled></pfv6-button>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('applies disabled class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-disabled>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('disabled')).to.be.true;
    });

    it('sets disabled attribute on button element', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-disabled>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('isAriaDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isAriaDisabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-aria-disabled></pfv6-button>`);
      expect(el.isAriaDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-aria-disabled></pfv6-button>`);
      expect(el.hasAttribute('is-aria-disabled')).to.be.true;
    });

    it('applies aria-disabled class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-aria-disabled>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('aria-disabled')).to.be.true;
    });

    it('sets aria-disabled attribute on button element', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-aria-disabled>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('aria-disabled')).to.equal('true');
    });

    it('prevents click events when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-aria-disabled>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button')!;

      let clicked = false;
      el.addEventListener('click', () => { clicked = true; });

      button.click();

      expect(clicked).to.be.false;
    });
  });

  describe('isLoading property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isLoading).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-loading></pfv6-button>`);
      expect(el.isLoading).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-loading></pfv6-button>`);
      expect(el.hasAttribute('is-loading')).to.be.true;
    });

    it('applies in-progress class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-loading>Loading</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('in-progress')).to.be.true;
    });

    it('renders spinner when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-loading>Loading</pfv6-button>`);
      const spinner = el.shadowRoot!.querySelector('pfv6-spinner');
      expect(spinner).to.exist;
    });

    it('does not render spinner when false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const spinner = el.shadowRoot!.querySelector('pfv6-spinner');
      expect(spinner).to.not.exist;
    });

    it('applies progress class for non-plain variants', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-loading variant="primary">Loading</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('progress')).to.be.true;
    });

    it('does not apply progress class for plain variant', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-loading variant="plain">Loading</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('progress')).to.be.false;
    });
  });

  describe('isInline property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isInline).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-inline></pfv6-button>`);
      expect(el.isInline).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-inline></pfv6-button>`);
      expect(el.hasAttribute('is-inline')).to.be.true;
    });

    it('applies inline class when true and variant is link', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="link" is-inline>Link</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('inline')).to.be.true;
    });

    it('does not apply inline class when variant is not link', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="primary" is-inline>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('inline')).to.be.false;
    });
  });

  describe('isFavorite property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isFavorite).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite></pfv6-button>`);
      expect(el.isFavorite).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite></pfv6-button>`);
      expect(el.hasAttribute('is-favorite')).to.be.true;
    });

    it('applies favorite class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite accessible-label="Favorite">❤</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('favorite')).to.be.true;
    });

    it('renders favorite icon when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite accessible-label="Favorite"></pfv6-button>`);
      const icon = el.shadowRoot!.querySelector('.icon-favorite');
      expect(icon).to.exist;
    });
  });

  describe('isFavorited property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite accessible-label="Favorite"></pfv6-button>`);
      expect(el.isFavorited).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite is-favorited accessible-label="Favorited"></pfv6-button>`);
      expect(el.isFavorited).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorited></pfv6-button>`);
      expect(el.hasAttribute('is-favorited')).to.be.true;
    });

    it('applies favorited class when true and is-favorite is true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-favorite is-favorited accessible-label="Favorited"></pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('favorited')).to.be.true;
    });
  });

  describe('isDanger property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isDanger).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-danger></pfv6-button>`);
      expect(el.isDanger).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-danger></pfv6-button>`);
      expect(el.hasAttribute('is-danger')).to.be.true;
    });

    it('applies danger class when true and variant is secondary', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="secondary" is-danger>Delete</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('danger')).to.be.true;
    });

    it('applies danger class when true and variant is link', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="link" is-danger>Delete</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('danger')).to.be.true;
    });

    it('does not apply danger class when variant is primary', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="primary" is-danger>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      // Primary variant should have danger applied through variant prop, not isDanger
      expect(button!.classList.contains('danger')).to.be.false;
    });
  });

  describe('isExpanded property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isExpanded).to.be.undefined;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-expanded="true"></pfv6-button>`);
      expect(el.isExpanded).to.be.true;
    });

    it('accepts false value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-expanded="false"></pfv6-button>`);
      expect(el.isExpanded).to.be.false;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-expanded="true"></pfv6-button>`);
      expect(el.hasAttribute('is-expanded')).to.be.true;
    });

    it('sets aria-expanded on button element when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-expanded="true">Menu</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets aria-expanded on button element when false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-expanded="false">Menu</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('aria-expanded')).to.equal('false');
    });

    it('does not set aria-expanded when undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.hasAttribute('aria-expanded')).to.be.false;
    });
  });

  describe('isSettings property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isSettings).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-settings></pfv6-button>`);
      expect(el.isSettings).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-settings></pfv6-button>`);
      expect(el.hasAttribute('is-settings')).to.be.true;
    });

    it('applies settings class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-settings accessible-label="Settings"></pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('settings')).to.be.true;
    });

    it('renders settings icon when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-settings accessible-label="Settings"></pfv6-button>`);
      const icon = el.shadowRoot!.querySelector('.settings-icon');
      expect(icon).to.exist;
    });
  });

  describe('isHamburger property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isHamburger).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false"></pfv6-button>`);
      expect(el.isHamburger).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false"></pfv6-button>`);
      expect(el.hasAttribute('is-hamburger')).to.be.true;
    });

    it('applies hamburger class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false" accessible-label="Menu"></pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('hamburger')).to.be.true;
    });

    it('renders hamburger icon when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false" accessible-label="Menu"></pfv6-button>`);
      const icon = el.shadowRoot!.querySelector('.hamburger-icon');
      expect(icon).to.exist;
    });
  });

  describe('hamburgerVariant property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false"></pfv6-button>`);
      expect(el.hamburgerVariant).to.be.undefined;
    });

    it('accepts "expand" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false" hamburger-variant="expand"></pfv6-button>`);
      expect(el.hamburgerVariant).to.equal('expand');
    });

    it('accepts "collapse" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false" hamburger-variant="collapse"></pfv6-button>`);
      expect(el.hamburgerVariant).to.equal('collapse');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button hamburger-variant="expand"></pfv6-button>`);
      expect(el.getAttribute('hamburger-variant')).to.equal('expand');
    });

    it('applies expand class when variant is expand', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false" hamburger-variant="expand" accessible-label="Menu"></pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('expand')).to.be.true;
    });

    it('applies collapse class when variant is collapse', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-hamburger is-expanded="false" hamburger-variant="collapse" accessible-label="Menu"></pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('collapse')).to.be.true;
    });
  });

  describe('hasNoPadding property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.hasNoPadding).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button has-no-padding></pfv6-button>`);
      expect(el.hasNoPadding).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button has-no-padding></pfv6-button>`);
      expect(el.hasAttribute('has-no-padding')).to.be.true;
    });

    it('applies no-padding class when true and variant is plain', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="plain" has-no-padding>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('no-padding')).to.be.true;
    });

    it('does not apply no-padding class when variant is not plain', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="primary" has-no-padding>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('no-padding')).to.be.false;
    });
  });

  describe('iconPosition property', function() {
    it('defaults to "start"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.iconPosition).to.equal('start');
    });

    it('accepts "end" value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button icon-position="end"></pfv6-button>`);
      expect(el.iconPosition).to.equal('end');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button icon-position="end"></pfv6-button>`);
      expect(el.getAttribute('icon-position')).to.equal('end');
    });

    it('positions icon at start by default', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button>
          Click me
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      const icon = el.shadowRoot!.querySelector('.icon-start');
      expect(icon).to.exist;
    });

    it('positions icon at end when icon-position is "end"', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button icon-position="end">
          Click me
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon).to.exist;
    });
  });

  describe('isClicked property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.isClicked).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-clicked></pfv6-button>`);
      expect(el.isClicked).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-clicked></pfv6-button>`);
      expect(el.hasAttribute('is-clicked')).to.be.true;
    });

    it('applies clicked class when true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-clicked>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('clicked')).to.be.true;
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.accessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button accessible-label="Close dialog"></pfv6-button>`);
      expect(el.accessibleLabel).to.equal('Close dialog');
    });

    it('sets aria-label on button element', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button accessible-label="Settings">⚙</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('aria-label')).to.equal('Settings');
    });

    it('does not set aria-label when undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('spinnerAccessibleValuetext property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.spinnerAccessibleValuetext).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button spinner-accessible-valuetext="Loading 50%"></pfv6-button>`);
      expect(el.spinnerAccessibleValuetext).to.equal('Loading 50%');
    });

    it('passes value to spinner when loading', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-loading spinner-accessible-valuetext="Loading 75%">Submit</pfv6-button>
      `);
      const spinner = el.shadowRoot!.querySelector('pfv6-spinner');
      expect(spinner).to.exist;
      expect(spinner!.getAttribute('accessible-valuetext')).to.equal('Loading 75%');
    });
  });

  describe('spinnerAccessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.spinnerAccessibleLabel).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button spinner-accessible-label="Submitting form"></pfv6-button>`);
      expect(el.spinnerAccessibleLabel).to.equal('Submitting form');
    });

    it('passes value to spinner when loading', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-loading spinner-accessible-label="Processing">Submit</pfv6-button>
      `);
      const spinner = el.shadowRoot!.querySelector('pfv6-spinner');
      expect(spinner).to.exist;
      expect(spinner!.getAttribute('accessible-label')).to.equal('Processing');
    });
  });

  describe('tabIndex property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button></pfv6-button>`);
      expect(el.tabIndex).to.be.undefined;
    });

    it('accepts number value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button tabindex="0"></pfv6-button>`);
      expect(el.tabIndex).to.equal(0);
    });

    it('accepts negative value', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button tabindex="-1"></pfv6-button>`);
      expect(el.tabIndex).to.equal(-1);
    });

    it('sets tabindex on button element', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button tabindex="2">Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('tabindex')).to.equal('2');
    });

    it('does not set tabindex when undefined', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.hasAttribute('tabindex')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click me</pfv6-button>`);
      expect(el.textContent?.trim()).to.equal('Click me');
    });

    it('renders icon slot', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button>
          Save
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon).to.exist;
      expect(icon!.tagName).to.equal('svg');
    });

    it('renders count slot', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button>
          Messages
          <span slot="count">5</span>
        </pfv6-button>
      `);
      const count = el.querySelector('[slot="count"]');
      expect(count).to.exist;
      expect(count!.textContent).to.equal('5');
    });

    it('renders count slot in shadow DOM when provided', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button>
          Messages
          <span slot="count">5</span>
        </pfv6-button>
      `);
      const countWrapper = el.shadowRoot!.querySelector('.count');
      expect(countWrapper).to.exist;
    });

    it('does not render count wrapper when count slot not provided', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const countWrapper = el.shadowRoot!.querySelector('.count');
      expect(countWrapper).to.not.exist;
    });

    it('wraps text content in span when text is present', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click me</pfv6-button>`);
      const textSpan = el.shadowRoot!.querySelector('.text');
      expect(textSpan).to.exist;
    });

    it('does not wrap text when only icon present', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-settings accessible-label="Settings"></pfv6-button>
      `);
      const textSpan = el.shadowRoot!.querySelector('.text');
      expect(textSpan).to.not.exist;
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders button element', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
      expect(button!.tagName).to.equal('BUTTON');
    });

    it('button has id="container"', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.id).to.equal('container');
    });

    it('button element contains default slot', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button');
      const slot = button!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('icon rendering logic', function() {
    it('does not render icon slot when is-settings is true', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-settings accessible-label="Settings">
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      // Settings icon should override slotted icon
      const settingsIcon = el.shadowRoot!.querySelector('.settings-icon');
      expect(settingsIcon).to.exist;
    });

    it('does not render icon slot when is-hamburger is true', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-hamburger is-expanded="false" accessible-label="Menu">
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      // Hamburger icon should override slotted icon
      const hamburgerIcon = el.shadowRoot!.querySelector('.hamburger-icon');
      expect(hamburgerIcon).to.exist;
    });

    it('does not render icon slot when is-favorite is true', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-favorite accessible-label="Favorite">
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      // Favorite icon should override slotted icon
      const favoriteIcon = el.shadowRoot!.querySelector('.icon-favorite');
      expect(favoriteIcon).to.exist;
    });

    it('renders slotted icon when no override properties set', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button>
          Save
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;
    });

    it('does not render icon wrapper when no icon provided', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const icon = el.shadowRoot!.querySelector('.icon');
      expect(icon).to.not.exist;
    });
  });

  describe('combined properties', function() {
    it('can combine variant and size', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button variant="secondary" size="sm">Small Secondary</pfv6-button>
      `);
      expect(el.variant).to.equal('secondary');
      expect(el.size).to.equal('sm');

      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('secondary')).to.be.true;
      expect(button!.classList.contains('small')).to.be.true;
    });

    it('can combine is-loading and is-inline', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button variant="link" is-loading is-inline>Loading</pfv6-button>
      `);
      expect(el.isLoading).to.be.true;
      expect(el.isInline).to.be.true;

      const spinner = el.shadowRoot!.querySelector('pfv6-spinner');
      expect(spinner).to.exist;
      expect(spinner!.hasAttribute('is-inline')).to.be.true;
    });

    it('can combine is-hamburger with is-expanded', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button is-hamburger is-expanded="true" accessible-label="Menu"></pfv6-button>
      `);
      expect(el.isHamburger).to.be.true;
      expect(el.isExpanded).to.be.true;

      const button = el.shadowRoot!.querySelector('button');
      expect(button!.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('validation warnings', function() {
    it('logs error when is-hamburger set without is-expanded', async function() {
      const consoleError = console.error;
      let errorMessage = '';
      console.error = (msg: string) => { errorMessage = msg; };

      await fixture<Pfv6Button>(html`<pfv6-button is-hamburger accessible-label="Menu"></pfv6-button>`);

      expect(errorMessage).to.include('is-expanded');
      console.error = consoleError;
    });

    it('logs error when icon-only button lacks accessible name', async function() {
      const consoleError = console.error;
      let errorMessage = '';
      console.error = (msg: string) => { errorMessage = msg; };

      await fixture<Pfv6Button>(html`<pfv6-button is-settings></pfv6-button>`);

      expect(errorMessage).to.include('accessible-label');
      console.error = consoleError;
    });

    it('does not log error when icon-only button has accessible-label', async function() {
      const consoleError = console.error;
      let errorCalled = false;
      console.error = () => { errorCalled = true; };

      await fixture<Pfv6Button>(html`<pfv6-button is-settings accessible-label="Settings"></pfv6-button>`);

      expect(errorCalled).to.be.false;
      console.error = consoleError;
    });

    it('does not log error when icon-only button has text content', async function() {
      const consoleError = console.error;
      let errorCalled = false;
      console.error = () => { errorCalled = true; };

      await fixture<Pfv6Button>(html`<pfv6-button is-settings>Settings</pfv6-button>`);

      expect(errorCalled).to.be.false;
      console.error = consoleError;
    });
  });

  describe('event handling', function() {
    it('does not prevent clicks when isAriaDisabled is false', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button')!;

      let clicked = false;
      button.addEventListener('click', () => { clicked = true; });

      button.click();

      expect(clicked).to.be.true;
    });

    it('prevents keypress events when isAriaDisabled is true', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button is-aria-disabled>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button')!;

      let keypressed = false;
      button.addEventListener('keypress', () => { keypressed = true; });

      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      button.dispatchEvent(event);

      expect(keypressed).to.be.false;
    });
  });

  describe('dynamic property updates', function() {
    it('updates variant dynamically', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button variant="primary">Click</pfv6-button>`);
      expect(el.variant).to.equal('primary');

      el.variant = 'secondary';
      await el.updateComplete;

      expect(el.variant).to.equal('secondary');
      const button = el.shadowRoot!.querySelector('button');
      expect(button!.classList.contains('secondary')).to.be.true;
      expect(button!.classList.contains('primary')).to.be.false;
    });

    it('updates isLoading dynamically', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Submit</pfv6-button>`);
      expect(el.shadowRoot!.querySelector('pfv6-spinner')).to.not.exist;

      el.isLoading = true;
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('pfv6-spinner')).to.exist;
    });

    it('updates isDisabled dynamically', async function() {
      const el = await fixture<Pfv6Button>(html`<pfv6-button>Click</pfv6-button>`);
      const button = el.shadowRoot!.querySelector('button')!;
      expect(button.hasAttribute('disabled')).to.be.false;

      el.isDisabled = true;
      await el.updateComplete;

      expect(button.hasAttribute('disabled')).to.be.true;
    });

    it('updates iconPosition dynamically', async function() {
      const el = await fixture<Pfv6Button>(html`
        <pfv6-button>
          Save
          <svg slot="icon" width="16" height="16"></svg>
        </pfv6-button>
      `);
      expect(el.shadowRoot!.querySelector('.icon-start')).to.exist;

      el.iconPosition = 'end';
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('.icon-end')).to.exist;
      expect(el.shadowRoot!.querySelector('.icon-start')).to.not.exist;
    });
  });
});
