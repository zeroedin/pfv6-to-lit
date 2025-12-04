import { expect, fixture, html } from '@open-wc/testing';
import '../pfv6-divider.js';
import type { Pfv6Divider } from '../pfv6-divider.js';

describe('pfv6-divider', () => {
  it('should render with default properties', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider></pfv6-divider>
    `);
    expect(el).to.exist;
    expect(el.component).to.equal('hr');
  });

  it('should accept component type as li', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider component="li"></pfv6-divider>
    `);
    expect(el.component).to.equal('li');
  });

  it('should accept component type as div', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider component="div"></pfv6-divider>
    `);
    expect(el.component).to.equal('div');
  });

  it('should set ARIA role to separator for hr component', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider></pfv6-divider>
    `);
    expect(el.getAttribute('role')).to.equal('separator');
  });

  it('should set ARIA role to listitem for li component', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider component="li"></pfv6-divider>
    `);
    expect(el.getAttribute('role')).to.equal('listitem');
  });

  it('should not set ARIA role for div component by default', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider component="div"></pfv6-divider>
    `);
    expect(el.hasAttribute('role')).to.be.false;
  });

  it('should accept explicit role prop', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider component="div" role="separator"></pfv6-divider>
    `);
    expect(el.getAttribute('role')).to.equal('separator');
  });

  it('should apply inset property', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider .inset=${{ default: 'insetMd' }}></pfv6-divider>
    `);
    expect(el.inset).to.deep.equal({ default: 'insetMd' });
  });

  it('should apply orientation property', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider .orientation=${{ default: 'vertical' }}></pfv6-divider>
    `);
    expect(el.orientation).to.deep.equal({ default: 'vertical' });
  });

  it('should apply responsive inset properties', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider
        .inset=${{
          default: 'insetMd',
          md: 'insetNone',
          lg: 'inset3xl',
          xl: 'insetLg'
        }}
      ></pfv6-divider>
    `);
    expect(el.inset).to.deep.equal({
      default: 'insetMd',
      md: 'insetNone',
      lg: 'inset3xl',
      xl: 'insetLg'
    });
  });

  it('should apply responsive orientation properties', async () => {
    const el = await fixture<Pfv6Divider>(html`
      <pfv6-divider
        .orientation=${{
          default: 'vertical',
          sm: 'horizontal',
          md: 'vertical'
        }}
      ></pfv6-divider>
    `);
    expect(el.orientation).to.deep.equal({
      default: 'vertical',
      sm: 'horizontal',
      md: 'vertical'
    });
  });
});

