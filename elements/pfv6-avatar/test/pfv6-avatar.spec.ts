import { expect, fixture, html } from '@open-wc/testing';
import { Pfv6Avatar } from '../pfv6-avatar.js';

describe('pfv6-avatar', () => {
  it('should be defined', () => {
    const el = document.createElement('pfv6-avatar');
    expect(el).to.be.instanceOf(Pfv6Avatar);
  });

  it('should render with default properties', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="test avatar"></pfv6-avatar>
    `);

    expect(el.src).to.equal('/test.svg');
    expect(el.alt).to.equal('test avatar');
    expect(el.isBordered).to.be.false;
    expect(el.size).to.be.undefined;
  });

  it('should render img element with correct src', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/avatar.png" alt="avatar"></pfv6-avatar>
    `);

    const img = el.shadowRoot?.querySelector('img');
    expect(img).to.exist;
    expect(img?.getAttribute('src')).to.equal('/avatar.png');
  });

  it('should render img element with correct alt text', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="User profile picture"></pfv6-avatar>
    `);

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.getAttribute('alt')).to.equal('User profile picture');
  });

  it('should apply bordered class when is-bordered is true', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" is-bordered></pfv6-avatar>
    `);

    expect(el.isBordered).to.be.true;
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('bordered')).to.be.true;
  });

  it('should not apply bordered class when is-bordered is false', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar"></pfv6-avatar>
    `);

    expect(el.isBordered).to.be.false;
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('bordered')).to.be.false;
  });

  it('should apply sm size class', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="sm"></pfv6-avatar>
    `);

    expect(el.size).to.equal('sm');
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('sm')).to.be.true;
  });

  it('should apply md size class', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="md"></pfv6-avatar>
    `);

    expect(el.size).to.equal('md');
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('md')).to.be.true;
  });

  it('should apply lg size class', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="lg"></pfv6-avatar>
    `);

    expect(el.size).to.equal('lg');
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('lg')).to.be.true;
  });

  it('should apply xl size class', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="xl"></pfv6-avatar>
    `);

    expect(el.size).to.equal('xl');
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('xl')).to.be.true;
  });

  it('should not apply size class when size is undefined', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar"></pfv6-avatar>
    `);

    expect(el.size).to.be.undefined;
    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('sm')).to.be.false;
    expect(img?.classList.contains('md')).to.be.false;
    expect(img?.classList.contains('lg')).to.be.false;
    expect(img?.classList.contains('xl')).to.be.false;
  });

  it('should update src when property changes', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/old.svg" alt="avatar"></pfv6-avatar>
    `);

    el.src = '/new.svg';
    await el.updateComplete;

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.getAttribute('src')).to.equal('/new.svg');
  });

  it('should update alt when property changes', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="old text"></pfv6-avatar>
    `);

    el.alt = 'new text';
    await el.updateComplete;

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.getAttribute('alt')).to.equal('new text');
  });

  it('should update bordered state when property changes', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar"></pfv6-avatar>
    `);

    el.isBordered = true;
    await el.updateComplete;

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('bordered')).to.be.true;
  });

  it('should update size when property changes', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="sm"></pfv6-avatar>
    `);

    el.size = 'xl';
    await el.updateComplete;

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('sm')).to.be.false;
    expect(img?.classList.contains('xl')).to.be.true;
  });

  it('should reflect is-bordered attribute', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" is-bordered></pfv6-avatar>
    `);

    expect(el.hasAttribute('is-bordered')).to.be.true;

    el.isBordered = false;
    await el.updateComplete;

    expect(el.hasAttribute('is-bordered')).to.be.false;
  });

  it('should reflect size attribute', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="lg"></pfv6-avatar>
    `);

    expect(el.getAttribute('size')).to.equal('lg');

    el.size = 'sm';
    await el.updateComplete;

    expect(el.getAttribute('size')).to.equal('sm');
  });

  it('should handle empty src', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="" alt="avatar"></pfv6-avatar>
    `);

    const img = el.shadowRoot?.querySelector('img');
    // src attribute should not be present when empty (due to ifDefined)
    expect(img?.hasAttribute('src')).to.be.false;
  });

  it('should handle combined size and bordered modifiers', async () => {
    const el = await fixture<Pfv6Avatar>(html`
      <pfv6-avatar src="/test.svg" alt="avatar" size="lg" is-bordered></pfv6-avatar>
    `);

    const img = el.shadowRoot?.querySelector('img');
    expect(img?.classList.contains('lg')).to.be.true;
    expect(img?.classList.contains('bordered')).to.be.true;
  });
});
