// With globals: true, describe/it/expect are available globally
import { html, fixture } from '@open-wc/testing-helpers';
import { Pfv6EmptyState } from '../pfv6-empty-state.js';
import { Pfv6EmptyStateHeader } from '../pfv6-empty-state-header.js';
import { Pfv6EmptyStateIcon } from '../pfv6-empty-state-icon.js';
import { Pfv6EmptyStateBody } from '../pfv6-empty-state-body.js';
import { Pfv6EmptyStateActions } from '../pfv6-empty-state-actions.js';
import { Pfv6EmptyStateFooter } from '../pfv6-empty-state-footer.js';
import '../pfv6-empty-state.js';
import '../pfv6-empty-state-header.js';
import '../pfv6-empty-state-icon.js';
import '../pfv6-empty-state-body.js';
import '../pfv6-empty-state-actions.js';
import '../pfv6-empty-state-footer.js';

describe('<pfv6-empty-state>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-empty-state')).to.be.an.instanceof(Pfv6EmptyState);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-empty-state'))
          .and
          .to.be.an.instanceOf(Pfv6EmptyState);
    });
  });

  describe('variant property', function() {
    it('defaults to "full"', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      expect(el.variant).to.equal('full'); // Match React default
    });

    it('accepts "xs" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state variant="xs"></pfv6-empty-state>`);
      expect(el.variant).to.equal('xs');
    });

    it('accepts "sm" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state variant="sm"></pfv6-empty-state>`);
      expect(el.variant).to.equal('sm');
    });

    it('accepts "lg" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state variant="lg"></pfv6-empty-state>`);
      expect(el.variant).to.equal('lg');
    });

    it('accepts "xl" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state variant="xl"></pfv6-empty-state>`);
      expect(el.variant).to.equal('xl');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state variant="sm"></pfv6-empty-state>`);
      expect(el.getAttribute('variant')).to.equal('sm');
    });

    it('applies correct class to container', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state variant="xs"></pfv6-empty-state>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('xs')).to.be.true;
    });
  });

  describe('isFullHeight property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      expect(el.isFullHeight).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state is-full-height></pfv6-empty-state>`);
      expect(el.isFullHeight).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state is-full-height></pfv6-empty-state>`);
      expect(el.hasAttribute('is-full-height')).to.be.true;
    });

    it('applies correct class to container when true', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state is-full-height></pfv6-empty-state>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('full-height')).to.be.true;
    });
  });

  describe('status property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      expect(el.status).to.be.undefined; // Match React default
    });

    it('accepts "danger" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="danger"></pfv6-empty-state>`);
      expect(el.status).to.equal('danger');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="warning"></pfv6-empty-state>`);
      expect(el.status).to.equal('warning');
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="success"></pfv6-empty-state>`);
      expect(el.status).to.equal('success');
    });

    it('accepts "info" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="info"></pfv6-empty-state>`);
      expect(el.status).to.equal('info');
    });

    it('accepts "custom" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="custom"></pfv6-empty-state>`);
      expect(el.status).to.equal('custom');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="danger"></pfv6-empty-state>`);
      expect(el.getAttribute('status')).to.equal('danger');
    });

    it('applies correct class to container for danger', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="danger"></pfv6-empty-state>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('danger')).to.be.true;
    });

    it('applies correct class to container for warning', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state status="warning"></pfv6-empty-state>`);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('warning')).to.be.true;
    });
  });

  describe('titleText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      expect(el.titleText).to.be.undefined; // Match React default
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state title-text="No results found"></pfv6-empty-state>`);
      expect(el.titleText).to.equal('No results found');
    });

    it('automatically renders header when set', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state title-text="No results found"></pfv6-empty-state>`);
      const header = el.shadowRoot!.querySelector('pfv6-empty-state-header');
      expect(header).to.exist;
    });

    it('passes titleText to header component', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state title-text="No results found"></pfv6-empty-state>`);
      const header = el.shadowRoot!.querySelector('pfv6-empty-state-header');
      expect(header?.getAttribute('title-text')).to.equal('No results found');
    });

    it('does not render header when titleText is not set', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      const header = el.shadowRoot!.querySelector('pfv6-empty-state-header');
      expect(header).to.not.exist;
    });
  });

  describe('headingLevel property', function() {
    it('defaults to "h1"', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state></pfv6-empty-state>`);
      expect(el.headingLevel).to.equal('h1'); // Match React default
    });

    it('accepts "h2" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state heading-level="h2"></pfv6-empty-state>`);
      expect(el.headingLevel).to.equal('h2');
    });

    it('accepts "h3" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state heading-level="h3"></pfv6-empty-state>`);
      expect(el.headingLevel).to.equal('h3');
    });

    it('accepts "h4" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state heading-level="h4"></pfv6-empty-state>`);
      expect(el.headingLevel).to.equal('h4');
    });

    it('accepts "h5" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state heading-level="h5"></pfv6-empty-state>`);
      expect(el.headingLevel).to.equal('h5');
    });

    it('accepts "h6" value', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state heading-level="h6"></pfv6-empty-state>`);
      expect(el.headingLevel).to.equal('h6');
    });

    it('passes headingLevel to header component', async function() {
      const el = await fixture<Pfv6EmptyState>(html`<pfv6-empty-state title-text="Title" heading-level="h3"></pfv6-empty-state>`);
      const header = el.shadowRoot!.querySelector('pfv6-empty-state-header');
      expect(header?.getAttribute('heading-level')).to.equal('h3');
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6EmptyState>(html`
        <pfv6-empty-state>
          <pfv6-empty-state-body>Body content</pfv6-empty-state-body>
        </pfv6-empty-state>
      `);
      const body = el.querySelector('pfv6-empty-state-body');
      expect(body).to.exist;
      expect(body?.textContent).to.equal('Body content');
    });

    it('renders icon slot when using titleText', async function() {
      const el = await fixture<Pfv6EmptyState>(html`
        <pfv6-empty-state title-text="Title">
          <pfv6-empty-state-icon slot="icon">
            <svg></svg>
          </pfv6-empty-state-icon>
        </pfv6-empty-state>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon).to.exist;
    });

    it('passes icon slot to header component', async function() {
      const el = await fixture<Pfv6EmptyState>(html`
        <pfv6-empty-state title-text="Title">
          <pfv6-empty-state-icon slot="icon">Icon</pfv6-empty-state-icon>
        </pfv6-empty-state>
      `);
      const header = el.shadowRoot!.querySelector('pfv6-empty-state-header');
      const iconSlot = header?.shadowRoot?.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;
    });
  });

  describe('combined properties', function() {
    it('applies multiple classes correctly', async function() {
      const el = await fixture<Pfv6EmptyState>(html`
        <pfv6-empty-state variant="sm" is-full-height status="warning"></pfv6-empty-state>
      `);
      const container = el.shadowRoot!.getElementById('container');
      expect(container?.classList.contains('sm')).to.be.true;
      expect(container?.classList.contains('full-height')).to.be.true;
      expect(container?.classList.contains('warning')).to.be.true;
    });

    it('renders complete empty state with all sub-components', async function() {
      const el = await fixture<Pfv6EmptyState>(html`
        <pfv6-empty-state variant="lg" title-text="No results">
          <pfv6-empty-state-icon slot="icon">Icon</pfv6-empty-state-icon>
          <pfv6-empty-state-body>Body content</pfv6-empty-state-body>
          <pfv6-empty-state-actions>Actions</pfv6-empty-state-actions>
          <pfv6-empty-state-footer>Footer</pfv6-empty-state-footer>
        </pfv6-empty-state>
      `);

      expect(el.querySelector('pfv6-empty-state-icon')).to.exist;
      expect(el.querySelector('pfv6-empty-state-body')).to.exist;
      expect(el.querySelector('pfv6-empty-state-actions')).to.exist;
      expect(el.querySelector('pfv6-empty-state-footer')).to.exist;
    });
  });
});

describe('<pfv6-empty-state-header>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-empty-state-header')).to.be.an.instanceof(Pfv6EmptyStateHeader);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header></pfv6-empty-state-header>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-empty-state-header'))
          .and
          .to.be.an.instanceOf(Pfv6EmptyStateHeader);
    });
  });

  describe('titleText property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header></pfv6-empty-state-header>`);
      expect(el.titleText).to.be.undefined;
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title"></pfv6-empty-state-header>`);
      expect(el.titleText).to.equal('Title');
    });

    it('renders title text in heading element', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Test Title"></pfv6-empty-state-header>`);
      const h1 = el.shadowRoot!.querySelector('h1');
      expect(h1).to.exist;
      expect(h1?.textContent).to.equal('Test Title');
    });
  });

  describe('headingLevel property', function() {
    it('defaults to "h1"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header></pfv6-empty-state-header>`);
      expect(el.headingLevel).to.equal('h1');
    });

    it('renders h1 element when headingLevel is "h1"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title" heading-level="h1"></pfv6-empty-state-header>`);
      const h1 = el.shadowRoot!.querySelector('h1#title-text');
      expect(h1).to.exist;
    });

    it('renders h2 element when headingLevel is "h2"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title" heading-level="h2"></pfv6-empty-state-header>`);
      const h2 = el.shadowRoot!.querySelector('h2#title-text');
      expect(h2).to.exist;
    });

    it('renders h3 element when headingLevel is "h3"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title" heading-level="h3"></pfv6-empty-state-header>`);
      const h3 = el.shadowRoot!.querySelector('h3#title-text');
      expect(h3).to.exist;
    });

    it('renders h4 element when headingLevel is "h4"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title" heading-level="h4"></pfv6-empty-state-header>`);
      const h4 = el.shadowRoot!.querySelector('h4#title-text');
      expect(h4).to.exist;
    });

    it('renders h5 element when headingLevel is "h5"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title" heading-level="h5"></pfv6-empty-state-header>`);
      const h5 = el.shadowRoot!.querySelector('h5#title-text');
      expect(h5).to.exist;
    });

    it('renders h6 element when headingLevel is "h6"', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`<pfv6-empty-state-header title-text="Title" heading-level="h6"></pfv6-empty-state-header>`);
      const h6 = el.shadowRoot!.querySelector('h6#title-text');
      expect(h6).to.exist;
    });
  });

  describe('slots', function() {
    it('renders icon slot', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`
        <pfv6-empty-state-header>
          <pfv6-empty-state-icon slot="icon">Icon</pfv6-empty-state-icon>
        </pfv6-empty-state-header>
      `);
      const icon = el.querySelector('[slot="icon"]');
      expect(icon).to.exist;
    });

    it('renders default slot when titleText not provided', async function() {
      const el = await fixture<Pfv6EmptyStateHeader>(html`
        <pfv6-empty-state-header>
          <span>Custom title content</span>
        </pfv6-empty-state-header>
      `);
      const span = el.querySelector('span');
      expect(span).to.exist;
      expect(span?.textContent).to.equal('Custom title content');
    });
  });
});

describe('<pfv6-empty-state-icon>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-empty-state-icon')).to.be.an.instanceof(Pfv6EmptyStateIcon);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6EmptyStateIcon>(html`<pfv6-empty-state-icon></pfv6-empty-state-icon>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-empty-state-icon'))
          .and
          .to.be.an.instanceOf(Pfv6EmptyStateIcon);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6EmptyStateIcon>(html`
        <pfv6-empty-state-icon>
          <svg>Icon</svg>
        </pfv6-empty-state-icon>
      `);
      const svg = el.querySelector('svg');
      expect(svg).to.exist;
    });
  });
});

describe('<pfv6-empty-state-body>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-empty-state-body')).to.be.an.instanceof(Pfv6EmptyStateBody);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6EmptyStateBody>(html`<pfv6-empty-state-body></pfv6-empty-state-body>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-empty-state-body'))
          .and
          .to.be.an.instanceOf(Pfv6EmptyStateBody);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6EmptyStateBody>(html`
        <pfv6-empty-state-body>
          <p>Body content</p>
        </pfv6-empty-state-body>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Body content');
    });
  });
});

describe('<pfv6-empty-state-actions>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-empty-state-actions')).to.be.an.instanceof(Pfv6EmptyStateActions);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6EmptyStateActions>(html`<pfv6-empty-state-actions></pfv6-empty-state-actions>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-empty-state-actions'))
          .and
          .to.be.an.instanceOf(Pfv6EmptyStateActions);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6EmptyStateActions>(html`
        <pfv6-empty-state-actions>
          <button>Action</button>
        </pfv6-empty-state-actions>
      `);
      const button = el.querySelector('button');
      expect(button).to.exist;
      expect(button?.textContent).to.equal('Action');
    });

    it('renders multiple action buttons', async function() {
      const el = await fixture<Pfv6EmptyStateActions>(html`
        <pfv6-empty-state-actions>
          <button>Primary</button>
          <button>Secondary</button>
        </pfv6-empty-state-actions>
      `);
      const buttons = el.querySelectorAll('button');
      expect(buttons.length).to.equal(2);
    });
  });
});

describe('<pfv6-empty-state-footer>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-empty-state-footer')).to.be.an.instanceof(Pfv6EmptyStateFooter);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6EmptyStateFooter>(html`<pfv6-empty-state-footer></pfv6-empty-state-footer>`);
      expect(el).to.be.an.instanceOf(customElements.get('pfv6-empty-state-footer'))
          .and
          .to.be.an.instanceOf(Pfv6EmptyStateFooter);
    });
  });

  describe('slots', function() {
    it('renders default slot content', async function() {
      const el = await fixture<Pfv6EmptyStateFooter>(html`
        <pfv6-empty-state-footer>
          <p>Footer content</p>
        </pfv6-empty-state-footer>
      `);
      const p = el.querySelector('p');
      expect(p).to.exist;
      expect(p?.textContent).to.equal('Footer content');
    });
  });
});
