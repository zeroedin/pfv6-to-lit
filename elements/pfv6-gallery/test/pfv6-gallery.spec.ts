import { expect, fixture, html } from '@open-wc/testing';
import '../pfv6-gallery.js';
import '../pfv6-gallery-item.js';
import type { Pfv6Gallery } from '../pfv6-gallery.js';
import type { Pfv6GalleryItem } from '../pfv6-gallery-item.js';

describe('pfv6-gallery', () => {
  it('should render with default properties', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery>
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
        <pfv6-gallery-item>Item 2</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    expect(el).to.exist;
    expect(el.hasGutter).to.be.false;
    expect(el.component).to.equal('div');
  });

  it('should apply has-gutter attribute', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery has-gutter>
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    expect(el.hasGutter).to.be.true;
    
    const container = el.shadowRoot!.querySelector('#container');
    expect(container).to.have.class('pf-m-gutter');
  });

  it('should set minWidths property', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery>
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    el.minWidths = {
      md: '100px',
      lg: '150px'
    };
    await el.updateComplete;
    
    expect(el.style.getPropertyValue('--pf-v6-l-gallery--GridTemplateColumns--min-on-md')).to.equal('100px');
    expect(el.style.getPropertyValue('--pf-v6-l-gallery--GridTemplateColumns--min-on-lg')).to.equal('150px');
  });

  it('should set maxWidths property', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery>
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    el.maxWidths = {
      md: '200px',
      xl: '400px'
    };
    await el.updateComplete;
    
    expect(el.style.getPropertyValue('--pf-v6-l-gallery--GridTemplateColumns--max-on-md')).to.equal('200px');
    expect(el.style.getPropertyValue('--pf-v6-l-gallery--GridTemplateColumns--max-on-xl')).to.equal('400px');
  });

  it('should render with custom component', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery component="section">
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    expect(el.component).to.equal('section');
    
    const container = el.shadowRoot!.querySelector('section#container');
    expect(container).to.exist;
  });

  it('should render slotted content', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery>
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
        <pfv6-gallery-item>Item 2</pfv6-gallery-item>
        <pfv6-gallery-item>Item 3</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    const items = el.querySelectorAll('pfv6-gallery-item');
    expect(items).to.have.lengthOf(3);
  });

  it('should be accessible', async () => {
    const el = await fixture<Pfv6Gallery>(html`
      <pfv6-gallery>
        <pfv6-gallery-item>Item 1</pfv6-gallery-item>
        <pfv6-gallery-item>Item 2</pfv6-gallery-item>
      </pfv6-gallery>
    `);
    
    await expect(el).to.be.accessible();
  });
});

describe('pfv6-gallery-item', () => {
  it('should render with default properties', async () => {
    const el = await fixture<Pfv6GalleryItem>(html`
      <pfv6-gallery-item>Gallery Item</pfv6-gallery-item>
    `);
    
    expect(el).to.exist;
    expect(el.component).to.equal('div');
  });

  it('should render with custom component', async () => {
    const el = await fixture<Pfv6GalleryItem>(html`
      <pfv6-gallery-item component="li">Gallery Item</pfv6-gallery-item>
    `);
    
    expect(el.component).to.equal('li');
    
    const container = el.shadowRoot!.querySelector('li');
    expect(container).to.exist;
  });

  it('should render slotted content', async () => {
    const el = await fixture<Pfv6GalleryItem>(html`
      <pfv6-gallery-item>
        <span>Test Content</span>
      </pfv6-gallery-item>
    `);
    
    const span = el.querySelector('span');
    expect(span).to.exist;
    expect(span!.textContent).to.equal('Test Content');
  });

  it('should be accessible', async () => {
    const el = await fixture<Pfv6GalleryItem>(html`
      <pfv6-gallery-item>Gallery Item</pfv6-gallery-item>
    `);
    
    await expect(el).to.be.accessible();
  });
});

