import { expect, fixture, html } from '@open-wc/testing';
import '../pfv6-flex.js';
import type { Pfv6Flex } from '../pfv6-flex.js';

describe('pfv6-flex', () => {
  describe('default properties', () => {
    it('should render with default properties', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex>
          <div>Item 1</div>
          <div>Item 2</div>
        </pfv6-flex>
      `);
      
      expect(el).to.exist;
      expect(el.component).to.equal('div');
    });

    it('should render slotted content', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex>
          <div>Item 1</div>
          <div>Item 2</div>
        </pfv6-flex>
      `);
      
      const slot = el.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
      
      const assignedNodes = slot?.assignedNodes();
      expect(assignedNodes?.length).to.be.greaterThan(0);
    });
  });

  describe('component property', () => {
    it('should accept component type as string', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex component="ul"></pfv6-flex>
      `);
      
      expect(el.component).to.equal('ul');
    });
  });

  describe('compound string attributes - simple default values', () => {
    it('should parse simple direction attribute', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex direction="column"></pfv6-flex>
      `);
      
      expect(el.direction).to.deep.equal({ default: 'column' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-column')).to.be.true;
    });

    it('should parse simple gap attribute', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex gap="2xl"></pfv6-flex>
      `);
      
      expect(el.gap).to.deep.equal({ default: 'gap2xl' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-gap-2xl')).to.be.true;
    });

    it('should parse simple spacer attribute', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex spacer="md"></pfv6-flex>
      `);
      
      expect(el.spacer).to.deep.equal({ default: 'spacerMd' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-md')).to.be.true;
    });

    it('should parse flex enum attribute', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex flex="1"></pfv6-flex>
      `);
      
      expect(el.flex).to.deep.equal({ default: 'flex_1' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-flex-1')).to.be.true;
    });

    it('should parse justify-content with kebab-case conversion', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex justify-content="flex-start"></pfv6-flex>
      `);
      
      expect(el.justifyContent).to.deep.equal({ default: 'justifyContentFlexStart' });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-justify-content-flex-start')).to.be.true;
    });
  });

  describe('compound string attributes - responsive values', () => {
    it('should parse direction with multiple breakpoints', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex direction="column lg:row"></pfv6-flex>
      `);
      
      expect(el.direction).to.deep.equal({
        default: 'column',
        lg: 'row'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-column')).to.be.true;
      expect(container?.classList.contains('m-row-on-lg')).to.be.true;
    });

    it('should parse gap with responsive values', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex gap="md sm:lg xl:2xl"></pfv6-flex>
      `);
      
      expect(el.gap).to.deep.equal({
        default: 'gapMd',
        sm: 'gapLg',
        xl: 'gap2xl'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-gap-md')).to.be.true;
      expect(container?.classList.contains('m-gap-lg-on-sm')).to.be.true;
      expect(container?.classList.contains('m-gap-2xl-on-xl')).to.be.true;
    });

    it('should parse order with responsive values including negative', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex order="2 md:-1 lg:1"></pfv6-flex>
      `);
      
      expect(el.order).to.deep.equal({
        default: '2',
        md: '-1',
        lg: '1'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-order-2')).to.be.true;
      expect(container?.classList.contains('m-order--1-on-md')).to.be.true;
      expect(container?.classList.contains('m-order-1-on-lg')).to.be.true;
    });

    it('should parse spacer with only non-default breakpoint', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex spacer="lg:md"></pfv6-flex>
      `);
      
      expect(el.spacer).to.deep.equal({
        lg: 'spacerMd'
      });
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-md-on-lg')).to.be.true;
    });
  });

  describe('JavaScript property assignment', () => {
    it('should accept object assignment for direction', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex></pfv6-flex>
      `);
      
      el.direction = { default: 'column', lg: 'row' };
      await el.updateComplete;
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-column')).to.be.true;
      expect(container?.classList.contains('m-row-on-lg')).to.be.true;
    });

    it('should accept object assignment for gap', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex></pfv6-flex>
      `);
      
      el.gap = { default: 'gapMd', xl: 'gap2xl' };
      await el.updateComplete;
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-gap-md')).to.be.true;
      expect(container?.classList.contains('m-gap-2xl-on-xl')).to.be.true;
    });
  });

  describe('all responsive modifiers', () => {
    it('should handle spacer modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex spacer="none"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-spacer-none')).to.be.true;
    });

    it('should handle spaceItems modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex space-items="xl"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-space-items-xl')).to.be.true;
    });

    it('should handle row-gap modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex row-gap="lg"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-row-gap-lg')).to.be.true;
    });

    it('should handle column-gap modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex column-gap="md"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-column-gap-md')).to.be.true;
    });

    it('should handle grow modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex grow="grow"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-grow')).to.be.true;
    });

    it('should handle shrink modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex shrink="shrink"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-shrink')).to.be.true;
    });

    it('should handle align-items modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex align-items="center"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-align-items-center')).to.be.true;
    });

    it('should handle align-content modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex align-content="space-between"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-align-content-space-between')).to.be.true;
    });

    it('should handle align-self modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex align-self="baseline"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-align-self-baseline')).to.be.true;
    });

    it('should handle align modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex align="right"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-align-right')).to.be.true;
    });

    it('should handle display modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex display="inline-flex"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-inline-flex')).to.be.true;
    });

    it('should handle full-width modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex full-width="full-width"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-full-width')).to.be.true;
    });

    it('should handle flex-wrap modifier', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex flex-wrap="nowrap"></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      expect(container?.classList.contains('m-nowrap')).to.be.true;
    });
  });

  describe('multiple modifiers combined', () => {
    it('should handle multiple responsive modifiers', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex 
          direction="column lg:row"
          gap="md xl:2xl"
          justify-content="flex-start"
        ></pfv6-flex>
      `);
      
      const container = el.shadowRoot?.getElementById('container');
      
      // Direction
      expect(container?.classList.contains('m-column')).to.be.true;
      expect(container?.classList.contains('m-row-on-lg')).to.be.true;
      
      // Gap
      expect(container?.classList.contains('m-gap-md')).to.be.true;
      expect(container?.classList.contains('m-gap-2xl-on-xl')).to.be.true;
      
      // Justify Content
      expect(container?.classList.contains('m-justify-content-flex-start')).to.be.true;
    });
  });

  describe('accessibility', () => {
    it('should be accessible with default settings', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex>
          <div>Item 1</div>
          <div>Item 2</div>
        </pfv6-flex>
      `);
      
      await expect(el).to.be.accessible();
    });

    it('should be accessible with component="ul"', async () => {
      const el = await fixture<Pfv6Flex>(html`
        <pfv6-flex component="ul">
          <div>Item 1</div>
          <div>Item 2</div>
        </pfv6-flex>
      `);
      
      await expect(el).to.be.accessible();
    });
  });
});

