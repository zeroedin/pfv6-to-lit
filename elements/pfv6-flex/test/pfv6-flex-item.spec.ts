import { expect, fixture, html } from '@open-wc/testing';
import '../pfv6-flex-item.js';
import type { Pfv6FlexItem } from '../pfv6-flex-item.js';

describe('pfv6-flex-item', () => {
  describe('default properties', () => {
    it('should render with default properties', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item>Flex item</pfv6-flex-item>
      `);
      
      expect(el).to.exist;
      expect(el.component).to.equal('div');
    });

    it('should render slotted content', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item>Flex item content</pfv6-flex-item>
      `);
      
      const slot = el.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
      
      const assignedNodes = slot?.assignedNodes();
      expect(assignedNodes?.length).to.be.greaterThan(0);
    });

    it('should use display: contents for layout transparency', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item>Flex item</pfv6-flex-item>
      `);
      
      const styles = window.getComputedStyle(el);
      expect(styles.display).to.equal('contents');
    });
  });

  describe('component property', () => {
    it('should accept component type as string', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item component="li"></pfv6-flex-item>
      `);
      
      expect(el.component).to.equal('li');
    });
  });

  describe('compound string attributes - simple default values', () => {
    it('should parse simple spacer attribute', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item spacer="md"></pfv6-flex-item>
      `);
      
      expect(el.spacer).to.deep.equal({ default: 'spacerMd' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-md')).to.be.true;
    });

    it('should parse flex enum attribute', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item flex="1"></pfv6-flex-item>
      `);
      
      expect(el.flex).to.deep.equal({ default: 'flex_1' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-flex-1')).to.be.true;
    });

    it('should parse align attribute', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item align="right"></pfv6-flex-item>
      `);
      
      expect(el.align).to.deep.equal({ default: 'alignRight' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-align-right')).to.be.true;
    });

    it('should parse align-self with kebab-case conversion', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item align-self="center"></pfv6-flex-item>
      `);
      
      expect(el.alignSelf).to.deep.equal({ default: 'alignSelfCenter' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-align-self-center')).to.be.true;
    });

    it('should parse order attribute', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item order="2"></pfv6-flex-item>
      `);
      
      expect(el.order).to.deep.equal({ default: '2' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-order-2')).to.be.true;
    });
  });

  describe('compound string attributes - responsive values', () => {
    it('should parse spacer with multiple breakpoints', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item spacer="md sm:lg xl:none"></pfv6-flex-item>
      `);
      
      expect(el.spacer).to.deep.equal({
        default: 'spacerMd',
        sm: 'spacerLg',
        xl: 'spacerNone'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-md')).to.be.true;
      expect(container?.classList.contains('m-spacer-lg-on-sm')).to.be.true;
      expect(container?.classList.contains('m-spacer-none-on-xl')).to.be.true;
    });

    it('should parse order with responsive values including negative', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item order="-1 md:1"></pfv6-flex-item>
      `);
      
      expect(el.order).to.deep.equal({
        default: '-1',
        md: '1'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-order--1')).to.be.true;
      expect(container?.classList.contains('m-order-1-on-md')).to.be.true;
    });

    it('should parse flex with responsive values', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item flex="1 lg:2"></pfv6-flex-item>
      `);
      
      expect(el.flex).to.deep.equal({
        default: 'flex_1',
        lg: 'flex_2'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-flex-1')).to.be.true;
      expect(container?.classList.contains('m-flex-2-on-lg')).to.be.true;
    });

    it('should parse spacer with only non-default breakpoint', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item spacer="xl:none"></pfv6-flex-item>
      `);
      
      expect(el.spacer).to.deep.equal({
        xl: 'spacerNone'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-none-on-xl')).to.be.true;
    });
  });

  describe('JavaScript property assignment', () => {
    it('should accept object assignment for spacer', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item></pfv6-flex-item>
      `);
      
      el.spacer = { default: 'spacerMd', lg: 'spacerXl' };
      await el.updateComplete;
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-md')).to.be.true;
      expect(container?.classList.contains('m-spacer-xl-on-lg')).to.be.true;
    });

    it('should accept object assignment for order', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item></pfv6-flex-item>
      `);
      
      el.order = { default: '2', md: '-1', lg: '1' };
      await el.updateComplete;
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-order-2')).to.be.true;
      expect(container?.classList.contains('m-order--1-on-md')).to.be.true;
      expect(container?.classList.contains('m-order-1-on-lg')).to.be.true;
    });
  });

  describe('all responsive modifiers', () => {
    it('should handle grow modifier', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item grow="grow"></pfv6-flex-item>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-grow')).to.be.true;
    });

    it('should handle shrink modifier', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item shrink="shrink"></pfv6-flex-item>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-shrink')).to.be.true;
    });

    it('should handle full-width modifier', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item full-width="full-width"></pfv6-flex-item>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-full-width')).to.be.true;
    });
  });

  describe('multiple modifiers combined', () => {
    it('should handle multiple responsive modifiers', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item 
          spacer="none lg:md"
          order="2 md:-1"
          flex="1"
        ></pfv6-flex-item>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      
      // Spacer
      expect(container?.classList.contains('m-spacer-none')).to.be.true;
      expect(container?.classList.contains('m-spacer-md-on-lg')).to.be.true;
      
      // Order
      expect(container?.classList.contains('m-order-2')).to.be.true;
      expect(container?.classList.contains('m-order--1-on-md')).to.be.true;
      
      // Flex
      expect(container?.classList.contains('m-flex-1')).to.be.true;
    });
  });

  describe('order breakpoint handling', () => {
    it('should not generate sm breakpoint classes for order', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item></pfv6-flex-item>
      `);
      
      // Order property doesn't support 'sm' breakpoint, only md, lg, xl, 2xl
      el.order = { default: '1', sm: '2' };
      await el.updateComplete;
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-order-1')).to.be.true;
      // sm breakpoint should be ignored for order
      expect(container?.classList.contains('m-order-2-on-sm')).to.be.false;
    });

    it('should support md, lg, xl, 2xl breakpoints for order', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item></pfv6-flex-item>
      `);
      
      el.order = { default: '1', md: '2', lg: '3', xl: '4', '2xl': '5' };
      await el.updateComplete;
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-order-1')).to.be.true;
      expect(container?.classList.contains('m-order-2-on-md')).to.be.true;
      expect(container?.classList.contains('m-order-3-on-lg')).to.be.true;
      expect(container?.classList.contains('m-order-4-on-xl')).to.be.true;
      expect(container?.classList.contains('m-order-5-on-2xl')).to.be.true;
    });
  });

  describe('accessibility', () => {
    it('should be accessible with default settings', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item>Flex item</pfv6-flex-item>
      `);
      
      await expect(el).to.be.accessible();
    });

    it('should be accessible with component="li"', async () => {
      const el = await fixture<Pfv6FlexItem>(html`
        <pfv6-flex-item component="li">List item</pfv6-flex-item>
      `);
      
      await expect(el).to.be.accessible();
    });
  });
});

