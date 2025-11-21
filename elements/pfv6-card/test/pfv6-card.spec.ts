import { expect, fixture, html } from '@open-wc/testing';
import '../pfv6-card.js';
import '../pfv6-card-title.js';
import '../pfv6-card-body.js';
import '../pfv6-card-footer.js';
import '../pfv6-card-expandable-content.js';
import type { Pfv6Card } from '../pfv6-card.js';
import type { Pfv6CardTitle } from '../pfv6-card-title.js';
import type { Pfv6CardBody } from '../pfv6-card-body.js';
import type { Pfv6CardFooter } from '../pfv6-card-footer.js';

describe('pfv6-card', () => {
  describe('Basic rendering', () => {
    it('should render with default properties', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-body>Card content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el).to.exist;
      expect(el.compact).to.be.false;
      expect(el.large).to.be.false;
      expect(el.fullHeight).to.be.false;
      expect(el.plain).to.be.false;
    });

    it('should render with pfv6-card-title sub-component', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-title>Card Title</pfv6-card-title>
          <pfv6-card-body>Body content</pfv6-card-body>
        </pfv6-card>
      `);
      
      const title = el.querySelector('pfv6-card-title');
      expect(title).to.exist;
      expect(title!.textContent!.trim()).to.equal('Card Title');
    });

    it('should render with pfv6-card-body sub-component', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-body>Body content</pfv6-card-body>
        </pfv6-card>
      `);
      
      const body = el.querySelector('pfv6-card-body');
      expect(body).to.exist;
      expect(body!.textContent!.trim()).to.equal('Body content');
    });

    it('should render with pfv6-card-footer sub-component', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-body>Body</pfv6-card-body>
          <pfv6-card-footer>Footer content</pfv6-card-footer>
        </pfv6-card>
      `);
      
      const footer = el.querySelector('pfv6-card-footer');
      expect(footer).to.exist;
      expect(footer!.textContent!.trim()).to.equal('Footer content');
    });

    it('should render with actions slot in header', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <button slot="actions">Action</button>
          <pfv6-card-title>Title</pfv6-card-title>
          <pfv6-card-body>Body</pfv6-card-body>
        </pfv6-card>
      `);
      
      const actions = el.shadowRoot!.querySelector('#actions');
      expect(actions).to.exist;
    });

    it('should render multiple body sections', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-body>First body</pfv6-card-body>
          <pfv6-card-body>Second body</pfv6-card-body>
        </pfv6-card>
      `);
      
      const bodies = el.querySelectorAll('pfv6-card-body');
      expect(bodies.length).to.equal(2);
    });
  });

  describe('Sub-component: pfv6-card-title', () => {
    it('should render with default heading level (div)', async () => {
      const el = await fixture<Pfv6CardTitle>(html`
        <pfv6-card-title>Title</pfv6-card-title>
      `);
      
      expect(el.component).to.equal('div');
      const title = el.shadowRoot!.querySelector('#title');
      expect(title!.tagName.toLowerCase()).to.equal('div');
    });

    it('should render with h1 heading level', async () => {
      const el = await fixture<Pfv6CardTitle>(html`
        <pfv6-card-title component="h1">Title</pfv6-card-title>
      `);
      
      expect(el.component).to.equal('h1');
      const title = el.shadowRoot!.querySelector('#title');
      expect(title!.tagName.toLowerCase()).to.equal('h1');
    });

    it('should render with h4 heading level', async () => {
      const el = await fixture<Pfv6CardTitle>(html`
        <pfv6-card-title component="h4">Title</pfv6-card-title>
      `);
      
      expect(el.component).to.equal('h4');
      const title = el.shadowRoot!.querySelector('#title');
      expect(title!.tagName.toLowerCase()).to.equal('h4');
    });
  });

  describe('Sub-component: pfv6-card-body', () => {
    it('should render with default properties (filled=true by default)', async () => {
      const el = await fixture<Pfv6CardBody>(html`
        <pfv6-card-body>Body content</pfv6-card-body>
      `);
      
      // Note: PatternFly CardBody defaults to isFilled=true
      expect(el.filled).to.be.true;
    });

    it('should render with filled property explicitly set to false', async () => {
      const el = await fixture<Pfv6CardBody>(html`
        <pfv6-card-body .filled=${false}>Body content</pfv6-card-body>
      `);
      
      expect(el.filled).to.be.false;
    });

    it('should render with filled property explicitly set to true', async () => {
      const el = await fixture<Pfv6CardBody>(html`
        <pfv6-card-body filled>Body content</pfv6-card-body>
      `);
      
      expect(el.filled).to.be.true;
      expect(el.hasAttribute('filled')).to.be.true;
    });
  });

  describe('Sub-component: pfv6-card-footer', () => {
    it('should render footer content', async () => {
      const el = await fixture<Pfv6CardFooter>(html`
        <pfv6-card-footer>Footer content</pfv6-card-footer>
      `);
      
      expect(el).to.exist;
      expect(el.textContent!.trim()).to.equal('Footer content');
    });
  });

  describe('Modifiers', () => {
    it('should render as compact card', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card compact>
          <pfv6-card-body>Compact card</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.compact).to.be.true;
      expect(el.hasAttribute('compact')).to.be.true;
    });

    it('should render as large card', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card large>
          <pfv6-card-body>Large card</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.large).to.be.true;
      expect(el.hasAttribute('large')).to.be.true;
    });

    it('should render as full-height card', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card full-height>
          <pfv6-card-body>Full height card</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.fullHeight).to.be.true;
      expect(el.hasAttribute('full-height')).to.be.true;
    });

    it('should render as plain card', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card plain>
          <pfv6-card-body>Plain card</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.plain).to.be.true;
      expect(el.hasAttribute('plain')).to.be.true;
    });

    it('should support multiple modifiers', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card compact plain>
          <pfv6-card-body>Compact plain card</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.compact).to.be.true;
      expect(el.plain).to.be.true;
    });
  });

  describe('Interactive properties', () => {
    it('should have clickable property', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card clickable>
          <pfv6-card-body>Content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.clickable).to.be.true;
      expect(el.hasAttribute('clickable')).to.be.true;
    });

    it('should have selectable property', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card selectable>
          <pfv6-card-body>Content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.selectable).to.be.true;
      expect(el.hasAttribute('selectable')).to.be.true;
    });

    it('should have selected property', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card selectable selected>
          <pfv6-card-body>Content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.selected).to.be.true;
      expect(el.hasAttribute('selected')).to.be.true;
    });

    it('should have expandable property', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card expandable>
          <pfv6-card-body>Content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.expandable).to.be.true;
      expect(el.hasAttribute('expandable')).to.be.true;
    });

    it('should have expanded property', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card expandable expanded>
          <pfv6-card-expandable-content>
            <pfv6-card-body>Content</pfv6-card-body>
          </pfv6-card-expandable-content>
        </pfv6-card>
      `);
      
      expect(el.expanded).to.be.true;
      expect(el.hasAttribute('expanded')).to.be.true;
    });

    it('should have disabled property', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card disabled>
          <pfv6-card-body>Content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-title>Accessible Card</pfv6-card-title>
          <pfv6-card-body>This is card content</pfv6-card-body>
        </pfv6-card>
      `);
      
      await expect(el).to.be.accessible();
    });

    it('should be accessible with all sub-components', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <button slot="actions" aria-label="Card action">Action</button>
          <pfv6-card-title component="h2">Card Title</pfv6-card-title>
          <pfv6-card-body>Card body content</pfv6-card-body>
          <pfv6-card-footer>Footer content</pfv6-card-footer>
        </pfv6-card>
      `);
      
      await expect(el).to.be.accessible();
    });

    it('should be accessible when expandable', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card expandable>
          <pfv6-card-title>Expandable Card</pfv6-card-title>
          <pfv6-card-expandable-content>
            <pfv6-card-body>Hidden content</pfv6-card-body>
          </pfv6-card-expandable-content>
        </pfv6-card>
      `);
      
      await expect(el).to.be.accessible();
    });
  });

  describe('Complex scenarios', () => {
    it('should render card with all sub-components', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <button slot="actions">Action 1</button>
          <button slot="actions">Action 2</button>
          <pfv6-card-title component="h3">Card Title</pfv6-card-title>
          <pfv6-card-body>First body section</pfv6-card-body>
          <pfv6-card-body>Second body section</pfv6-card-body>
          <pfv6-card-footer>Footer text</pfv6-card-footer>
        </pfv6-card>
      `);
      
      expect(el).to.exist;
      expect(el.querySelector('pfv6-card-title')).to.exist;
      expect(el.querySelectorAll('pfv6-card-body').length).to.equal(2);
      expect(el.querySelector('pfv6-card-footer')).to.exist;
    });

    it('should render compact card with title', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card compact>
          <pfv6-card-title>Compact Title</pfv6-card-title>
          <pfv6-card-body>Content</pfv6-card-body>
        </pfv6-card>
      `);
      
      expect(el.compact).to.be.true;
      expect(el.querySelector('pfv6-card-title')).to.exist;
    });

    it('should render expandable card with expandable content', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card expandable>
          <pfv6-card-title>Expandable Card</pfv6-card-title>
          <pfv6-card-expandable-content>
            <pfv6-card-body>Expandable body</pfv6-card-body>
            <pfv6-card-footer>Expandable footer</pfv6-card-footer>
          </pfv6-card-expandable-content>
        </pfv6-card>
      `);
      
      expect(el.expandable).to.be.true;
      expect(el.querySelector('pfv6-card-expandable-content')).to.exist;
      
      const expandableContent = el.querySelector('pfv6-card-expandable-content');
      expect(expandableContent!.querySelector('pfv6-card-body')).to.exist;
      expect(expandableContent!.querySelector('pfv6-card-footer')).to.exist;
    });

    it('should render body sections with different filled states', async () => {
      const el = await fixture<Pfv6Card>(html`
        <pfv6-card>
          <pfv6-card-body>Filled body 1 (default=true)</pfv6-card-body>
          <pfv6-card-body .filled=${false}>Non-filled body</pfv6-card-body>
          <pfv6-card-body filled>Filled body 2 (explicit)</pfv6-card-body>
        </pfv6-card>
      `);
      
      const bodies = el.querySelectorAll('pfv6-card-body');
      expect(bodies.length).to.equal(3);
      // First body: default filled=true
      expect((bodies[0] as Pfv6CardBody).filled).to.be.true;
      // Second body: explicitly set to false
      expect((bodies[1] as Pfv6CardBody).filled).to.be.false;
      // Third body: explicitly set to true
      expect((bodies[2] as Pfv6CardBody).filled).to.be.true;
    });
  });
});
