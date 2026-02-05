import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6SkipToContent } from '../pfv6-skip-to-content.js';
import '../pfv6-skip-to-content.js';

describe('<pfv6-skip-to-content>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-skip-to-content')).to.be.an.instanceof(Pfv6SkipToContent);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content></pfv6-skip-to-content>`);
      expect(el)
          .to.be.an.instanceOf(customElements.get('pfv6-skip-to-content'))
          .and
          .to.be.an.instanceOf(Pfv6SkipToContent);
    });
  });

  describe('href property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content></pfv6-skip-to-content>`);
      expect(el.href).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content href="#main-content"></pfv6-skip-to-content>`);
      expect(el.href).to.equal('#main-content');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content href="#main-content"></pfv6-skip-to-content>`);
      expect(el.getAttribute('href')).to.equal('#main-content');
    });

    it('passes href to inner pfv6-button', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button).to.exist;
      expect(button!.getAttribute('href')).to.equal('#main-content');
    });

    it('updates href dynamically', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.href).to.equal('#main');

      el.href = '#content';
      await el.updateComplete;

      expect(el.href).to.equal('#content');
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('href')).to.equal('#content');
    });

    it('does not pass href to button when undefined', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content>
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.hasAttribute('href')).to.be.false;
    });

    it('accepts anchor with id selector', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content href="#main-content"></pfv6-skip-to-content>`);
      expect(el.href).to.equal('#main-content');
    });

    it('accepts relative path', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content href="/content"></pfv6-skip-to-content>`);
      expect(el.href).to.equal('/content');
    });

    it('accepts full URL', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`<pfv6-skip-to-content href="https://example.com#content"></pfv6-skip-to-content>`);
      expect(el.href).to.equal('https://example.com#content');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.textContent?.trim()).to.equal('Skip to content');
    });

    it('default slot passes through to pfv6-button', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          <span>Skip to main content</span>
        </pfv6-skip-to-content>
      `);
      const slottedContent = el.querySelector('span');
      expect(slottedContent).to.exist;
      expect(slottedContent!.textContent).to.equal('Skip to main content');
    });

    it('renders complex slot content', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          <strong>Skip</strong> to <em>content</em>
        </pfv6-skip-to-content>
      `);
      const strong = el.querySelector('strong');
      const em = el.querySelector('em');
      expect(strong).to.exist;
      expect(em).to.exist;
      expect(strong!.textContent).to.equal('Skip');
      expect(em!.textContent).to.equal('content');
    });

    it('renders when empty (button will be empty)', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content"></pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button).to.exist;
      expect(el.textContent?.trim()).to.equal('');
    });
  });

  describe('Shadow DOM structure', function() {
    it('renders container div with id', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const container = el.shadowRoot!.querySelector('div#container');
      expect(container).to.exist;
      expect(container!.id).to.equal('container');
    });

    it('container wraps pfv6-button', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const container = el.shadowRoot!.querySelector('div#container');
      const button = container!.querySelector('pfv6-button');
      expect(button).to.exist;
    });

    it('pfv6-button has variant="primary"', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('variant')).to.equal('primary');
    });

    it('pfv6-button contains default slot', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      const slot = button!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('React API parity', function() {
    it('matches React required href prop', async function() {
      // In React, href is required. In Lit, it's optional but should work when provided.
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.href).to.equal('#main-content');

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('href')).to.equal('#main-content');
    });

    it('matches React children prop (default slot)', async function() {
      // React accepts children as React.ReactNode, Lit uses default slot
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.textContent?.trim()).to.equal('Skip to content');
    });

    it('renders with primary button variant like React', async function() {
      // React uses ButtonVariant.primary for the internal Button
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('variant')).to.equal('primary');
    });

    it('wraps button in container div like React', async function() {
      // React wraps Button in div with className={css(styles.skipToContent, className)}
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const container = el.shadowRoot!.querySelector('div#container');
      const button = container!.querySelector('pfv6-button');
      expect(container).to.exist;
      expect(button).to.exist;
    });
  });

  describe('typical usage patterns', function() {
    it('renders basic skip link', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.href).to.equal('#main-content');
      expect(el.textContent?.trim()).to.equal('Skip to content');

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button).to.exist;
      expect(button!.getAttribute('variant')).to.equal('primary');
      expect(button!.getAttribute('href')).to.equal('#main-content');
    });

    it('renders skip link to multiple targets', async function() {
      const el1 = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main">
          Skip to main
        </pfv6-skip-to-content>
      `);
      const el2 = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#nav">
          Skip to navigation
        </pfv6-skip-to-content>
      `);

      expect(el1.href).to.equal('#main');
      expect(el2.href).to.equal('#nav');
    });

    it('renders with custom text', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Jump to main content
        </pfv6-skip-to-content>
      `);
      expect(el.textContent?.trim()).to.equal('Jump to main content');
    });
  });

  describe('accessibility', function() {
    it('button is keyboard accessible via pfv6-button', async function() {
      // pfv6-button handles keyboard accessibility
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button).to.exist;
      // pfv6-button component handles focus delegation
    });

    it('creates functional skip link with href', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);
      const button = el.shadowRoot!.querySelector('pfv6-button');
      // pfv6-button with href renders as anchor tag internally
      expect(button!.getAttribute('href')).to.equal('#main-content');
    });

    it('provides clear text content for screen readers', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to main content
        </pfv6-skip-to-content>
      `);
      expect(el.textContent?.trim()).to.equal('Skip to main content');
    });
  });

  describe('dynamic updates', function() {
    it('updates when href changes', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main">
          Skip to content
        </pfv6-skip-to-content>
      `);

      el.href = '#content';
      await el.updateComplete;

      expect(el.href).to.equal('#content');
      expect(el.getAttribute('href')).to.equal('#content');

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('href')).to.equal('#content');
    });

    it('updates when slot content changes', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          <span id="text">Skip to content</span>
        </pfv6-skip-to-content>
      `);

      const span = el.querySelector('#text')!;
      expect(span.textContent).to.equal('Skip to content');

      span.textContent = 'Jump to content';
      await el.updateComplete;

      expect(el.textContent).to.include('Jump to content');
    });

    it('removes href when set to undefined', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          Skip to content
        </pfv6-skip-to-content>
      `);

      el.href = undefined;
      await el.updateComplete;

      expect(el.href).to.be.undefined;
      expect(el.hasAttribute('href')).to.be.false;

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.hasAttribute('href')).to.be.false;
    });
  });

  describe('edge cases', function() {
    it('handles empty href', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.href).to.equal('');

      const button = el.shadowRoot!.querySelector('pfv6-button');
      expect(button!.getAttribute('href')).to.equal('');
    });

    it('handles very long href', async function() {
      const longHref = `#${'a'.repeat(1000)}`;
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href=${longHref}>
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.href).to.equal(longHref);
    });

    it('handles special characters in href', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content?test=1&foo=bar">
          Skip to content
        </pfv6-skip-to-content>
      `);
      expect(el.href).to.equal('#main-content?test=1&foo=bar');
    });

    it('handles unicode characters in slot content', async function() {
      const el = await fixture<Pfv6SkipToContent>(html`
        <pfv6-skip-to-content href="#main-content">
          跳转到内容 • Перейти к содержанию • 🚀
        </pfv6-skip-to-content>
      `);
      expect(el.textContent).to.include('跳转到内容');
      expect(el.textContent).to.include('Перейти к содержанию');
      expect(el.textContent).to.include('🚀');
    });
  });
});
