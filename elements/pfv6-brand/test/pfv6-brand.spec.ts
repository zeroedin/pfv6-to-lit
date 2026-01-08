import { expect, fixture, html } from '@open-wc/testing';
import { Pfv6Brand } from '../pfv6-brand.js';

describe('pfv6-brand', () => {
  it('should be defined', () => {
    const el = document.createElement('pfv6-brand');
    expect(el).to.be.instanceOf(Pfv6Brand);
  });

  it('should render with default properties', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="Company Logo"></pfv6-brand>
    `);

    expect(el.src).to.equal('/logo.svg');
    expect(el.alt).to.equal('Company Logo');
    expect(el.widths).to.be.undefined;
    expect(el.heights).to.be.undefined;
  });

  it('should render img element with correct src', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="logo"></pfv6-brand>
    `);

    const img = el.shadowRoot?.querySelector('img');
    expect(img).to.exist;
    expect(img?.getAttribute('src')).to.equal('/logo.svg');
  });

  it('should render img element with correct alt text', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="Company Brand"></pfv6-brand>
    `);

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.getAttribute('alt')).to.equal('Company Brand');
  });

  it('should parse responsive widths property', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand
        src="/logo.svg"
        alt="logo"
        widths="200px md:400px xl:600px">
      </pfv6-brand>
    `);

    expect(el.widths).to.deep.equal({
      default: '200px',
      md: '400px',
      xl: '600px',
    });
  });

  it('should parse responsive heights property', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand
        src="/logo.svg"
        alt="logo"
        heights="40px md:60px lg:80px">
      </pfv6-brand>
    `);

    expect(el.heights).to.deep.equal({
      default: '40px',
      md: '60px',
      lg: '80px',
    });
  });

  it('should render as img when no slot content', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="logo"></pfv6-brand>
    `);

    const img = el.shadowRoot?.querySelector('#container');
    expect(img?.tagName).to.equal('IMG');

    const picture = el.shadowRoot?.querySelector('picture');
    expect(picture).to.not.exist;
  });

  it('should render as picture when slot has content', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="logo">
        <source srcset="/logo-mobile.svg" media="(max-width: 768px)" />
      </pfv6-brand>
    `);

    await el.updateComplete;

    const picture = el.shadowRoot?.querySelector('picture');
    expect(picture).to.exist;
    expect(picture?.id).to.equal('container');
  });

  it('should apply picture class when rendering as picture', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="logo">
        <source srcset="/logo-mobile.svg" media="(max-width: 768px)" />
      </pfv6-brand>
    `);

    await el.updateComplete;

    const picture = el.shadowRoot?.querySelector('picture');
    expect(picture?.classList.contains('picture')).to.be.true;
  });

  it('should render fallback img inside picture element', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="logo">
        <source srcset="/logo-mobile.svg" media="(max-width: 768px)" />
      </pfv6-brand>
    `);

    await el.updateComplete;

    const picture = el.shadowRoot?.querySelector('picture');
    const img = picture?.querySelector('img');
    expect(img).to.exist;
    expect(img?.getAttribute('src')).to.equal('/logo.svg');
    expect(img?.getAttribute('alt')).to.equal('logo');
  });

  it('should apply responsive width CSS variables', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand
        src="/logo.svg"
        alt="logo"
        widths="200px md:400px">
      </pfv6-brand>
    `);

    const container = el.shadowRoot?.querySelector('#container') as HTMLElement;
    const style = container?.getAttribute('style');

    expect(style).to.include('--pf-v6-c-brand--Width: 200px');
    expect(style).to.include('--pf-v6-c-brand--Width-on-md: 400px');
  });

  it('should apply responsive height CSS variables', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand
        src="/logo.svg"
        alt="logo"
        heights="40px md:60px">
      </pfv6-brand>
    `);

    const container = el.shadowRoot?.querySelector('#container') as HTMLElement;
    const style = container?.getAttribute('style');

    expect(style).to.include('--pf-v6-c-brand--Height: 40px');
    expect(style).to.include('--pf-v6-c-brand--Height-on-md: 60px');
  });

  it('should update when src changes', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo1.svg" alt="logo"></pfv6-brand>
    `);

    el.src = '/logo2.svg';
    await el.updateComplete;

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.getAttribute('src')).to.equal('/logo2.svg');
  });

  it('should update when alt changes', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="Logo 1"></pfv6-brand>
    `);

    el.alt = 'Logo 2';
    await el.updateComplete;

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.getAttribute('alt')).to.equal('Logo 2');
  });

  it('should re-render when slot content changes', async () => {
    const el = await fixture<Pfv6Brand>(html`
      <pfv6-brand src="/logo.svg" alt="logo"></pfv6-brand>
    `);

    // Initially should be img
    let container = el.shadowRoot?.querySelector('#container');
    expect(container?.tagName).to.equal('IMG');

    // Add source element
    const source = document.createElement('source');
    source.setAttribute('srcset', '/logo-mobile.svg');
    el.appendChild(source);

    await el.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should now be picture
    container = el.shadowRoot?.querySelector('#container');
    expect(container?.tagName).to.equal('PICTURE');
  });
});
