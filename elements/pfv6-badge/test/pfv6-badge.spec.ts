import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6Badge } from '../pfv6-badge.js';
import '../pfv6-badge.js';

describe('<pfv6-badge>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-badge')).to.be.an.instanceof(Pfv6Badge);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge></pfv6-badge>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-badge'))
        .and
        .to.be.an.instanceOf(Pfv6Badge);
    });
  });

  describe('isRead property', function() {
    it('defaults to false (unread)', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge></pfv6-badge>`);
      expect(el.isRead).to.be.false;
    });

    it('accepts true value for read state', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge is-read></pfv6-badge>`);
      expect(el.isRead).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge is-read></pfv6-badge>`);
      expect(el.hasAttribute('is-read')).to.be.true;
    });

    it('applies read class when true', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge is-read>7</pfv6-badge>`);
      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('read')).to.be.true;
    });

    it('applies unread class when false', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('unread')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      expect(el.isRead).to.be.false;

      el.isRead = true;
      await el.updateComplete;

      expect(el.isRead).to.be.true;
      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('read')).to.be.true;
    });
  });

  describe('isDisabled property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge></pfv6-badge>`);
      expect(el.isDisabled).to.be.false;
    });

    it('accepts true value', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge is-disabled></pfv6-badge>`);
      expect(el.isDisabled).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge is-disabled></pfv6-badge>`);
      expect(el.hasAttribute('is-disabled')).to.be.true;
    });

    it('applies disabled class when true', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge is-disabled>7</pfv6-badge>`);
      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('disabled')).to.be.true;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      expect(el.isDisabled).to.be.false;

      el.isDisabled = true;
      await el.updateComplete;

      expect(el.isDisabled).to.be.true;
      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('disabled')).to.be.true;
    });
  });

  describe('screenReaderText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge></pfv6-badge>`);
      expect(el.screenReaderText).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6Badge>(
        html`<pfv6-badge screen-reader-text="Unread Messages">7</pfv6-badge>`
      );
      expect(el.screenReaderText).to.equal('Unread Messages');
    });

    it('renders screen reader text when provided', async function() {
      const el = await fixture<Pfv6Badge>(
        html`<pfv6-badge screen-reader-text="Unread Messages">7</pfv6-badge>`
      );
      const srText = el.shadowRoot!.querySelector('#screen-reader-text');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Unread Messages');
    });

    it('does not render screen reader text when not provided', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      const srText = el.shadowRoot!.querySelector('#screen-reader-text');
      expect(srText).to.not.exist;
    });

    it('can be changed dynamically', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      expect(el.shadowRoot!.querySelector('#screen-reader-text')).to.not.exist;

      el.screenReaderText = 'New Messages';
      await el.updateComplete;

      const srText = el.shadowRoot!.querySelector('#screen-reader-text');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('New Messages');
    });
  });

  describe('slot rendering', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>42</pfv6-badge>`);
      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('displays badge content in slot', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>999+</pfv6-badge>`);
      expect(el.textContent?.trim()).to.equal('999+');
    });

    it('renders numeric content', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      expect(el.textContent?.trim()).to.equal('7');
    });

    it('renders text content', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>New</pfv6-badge>`);
      expect(el.textContent?.trim()).to.equal('New');
    });
  });

  describe('combined properties', function() {
    it('can be both read and disabled', async function() {
      const el = await fixture<Pfv6Badge>(
        html`<pfv6-badge is-read is-disabled>7</pfv6-badge>`
      );
      expect(el.isRead).to.be.true;
      expect(el.isDisabled).to.be.true;

      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('read')).to.be.true;
      expect(badge!.classList.contains('disabled')).to.be.true;
    });

    it('can be unread and disabled', async function() {
      const el = await fixture<Pfv6Badge>(
        html`<pfv6-badge is-disabled>24</pfv6-badge>`
      );
      expect(el.isRead).to.be.false;
      expect(el.isDisabled).to.be.true;

      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge!.classList.contains('unread')).to.be.true;
      expect(badge!.classList.contains('disabled')).to.be.true;
    });

    it('screen reader text works with read state', async function() {
      const el = await fixture<Pfv6Badge>(
        html`<pfv6-badge is-read screen-reader-text="Read Messages">5</pfv6-badge>`
      );
      expect(el.isRead).to.be.true;

      const srText = el.shadowRoot!.querySelector('#screen-reader-text');
      expect(srText).to.exist;
      expect(srText!.textContent).to.equal('Read Messages');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders main badge element', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      const badge = el.shadowRoot!.querySelector('#badge');
      expect(badge).to.exist;
      expect(badge!.tagName).to.equal('SPAN');
    });

    it('badge element contains default slot', async function() {
      const el = await fixture<Pfv6Badge>(html`<pfv6-badge>7</pfv6-badge>`);
      const badge = el.shadowRoot!.querySelector('#badge');
      const slot = badge!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('accessibility', function() {
    it('screen reader text is visually hidden', async function() {
      const el = await fixture<Pfv6Badge>(
        html`<pfv6-badge screen-reader-text="Unread">7</pfv6-badge>`
      );
      const srText = el.shadowRoot!.querySelector('#screen-reader-text') as HTMLElement;

      expect(srText).to.exist;

      // Check visual hiding styles
      const styles = window.getComputedStyle(srText);
      expect(styles.position).to.equal('absolute');
      expect(styles.width).to.equal('1px');
      expect(styles.height).to.equal('1px');
    });
  });
});
