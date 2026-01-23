// With globals: true, describe/it/expect are available globally
import { html, fixture, expect } from '@open-wc/testing';
import { Pfv6TextArea } from '../pfv6-text-area.js';
import '../pfv6-text-area.js';

describe('<pfv6-text-area>', function() {
  describe('instantiation', function() {
    it('imperatively instantiates', function() {
      expect(document.createElement('pfv6-text-area')).to.be.an.instanceof(Pfv6TextArea);
    });

    it('should upgrade', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area></pfv6-text-area>`);
      expect(el)
        .to.be.an.instanceOf(customElements.get('pfv6-text-area'))
        .and.to.be.an.instanceOf(Pfv6TextArea);
    });
  });

  describe('validated property', function() {
    it('defaults to "default"', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area></pfv6-text-area>`);
      expect(el.validated).to.equal('default'); // Match React default
    });

    it('accepts "success" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area validated="success"></pfv6-text-area>`);
      expect(el.validated).to.equal('success');
    });

    it('accepts "warning" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area validated="warning"></pfv6-text-area>`);
      expect(el.validated).to.equal('warning');
    });

    it('accepts "error" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area validated="error"></pfv6-text-area>`);
      expect(el.validated).to.equal('error');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area validated="error"></pfv6-text-area>`);
      expect(el.getAttribute('validated')).to.equal('error');
    });

    it('sets aria-invalid="true" on slotted textarea when error', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="error">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).to.equal('true');
    });

    it('sets aria-invalid="false" on slotted textarea when success', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="success">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).to.equal('false');
    });

    it('sets aria-invalid="false" on slotted textarea when default', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="default">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).to.equal('false');
    });
  });

  describe('readOnlyVariant property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area></pfv6-text-area>`);
      expect(el.readOnlyVariant).to.be.undefined; // Match React default
    });

    it('accepts "default" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area read-only-variant="default"></pfv6-text-area>`);
      expect(el.readOnlyVariant).to.equal('default');
    });

    it('accepts "plain" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area read-only-variant="plain"></pfv6-text-area>`);
      expect(el.readOnlyVariant).to.equal('plain');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area read-only-variant="plain"></pfv6-text-area>`);
      expect(el.getAttribute('read-only-variant')).to.equal('plain');
    });
  });

  describe('autoResize property', function() {
    it('defaults to false', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area></pfv6-text-area>`);
      expect(el.autoResize).to.be.false; // Match React default
    });

    it('can be set to true', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area auto-resize></pfv6-text-area>`);
      expect(el.autoResize).to.be.true;
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area auto-resize></pfv6-text-area>`);
      expect(el.hasAttribute('auto-resize')).to.be.true;
    });
  });

  describe('resizeOrientation property', function() {
    it('defaults to "both"', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area></pfv6-text-area>`);
      expect(el.resizeOrientation).to.equal('both'); // Match React default
    });

    it('accepts "horizontal" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area resize-orientation="horizontal"></pfv6-text-area>`);
      expect(el.resizeOrientation).to.equal('horizontal');
    });

    it('accepts "vertical" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area resize-orientation="vertical"></pfv6-text-area>`);
      expect(el.resizeOrientation).to.equal('vertical');
    });

    it('accepts "none" value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area resize-orientation="none"></pfv6-text-area>`);
      expect(el.resizeOrientation).to.equal('none');
    });

    it('reflects to attribute', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area resize-orientation="vertical"></pfv6-text-area>`);
      expect(el.getAttribute('resize-orientation')).to.equal('vertical');
    });
  });

  describe('accessibleLabel property', function() {
    it('defaults to undefined', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area></pfv6-text-area>`);
      expect(el.accessibleLabel).to.be.undefined; // Match React default (aria-label: null)
    });

    it('accepts string value', async function() {
      const el = await fixture<Pfv6TextArea>(html`<pfv6-text-area accessible-label="Text area label"></pfv6-text-area>`);
      expect(el.accessibleLabel).to.equal('Text area label');
    });

    it('sets aria-label on slotted textarea', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area accessible-label="Text area label">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.getAttribute('aria-label')).to.equal('Text area label');
    });

    it('removes aria-label from slotted textarea when set to undefined', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area accessible-label="Text area label">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.getAttribute('aria-label')).to.equal('Text area label');

      el.accessibleLabel = undefined;
      await el.updateComplete;
      expect(textarea?.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('slots', function() {
    it('renders textarea slot content', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area>
          <textarea slot="textarea" id="test-textarea"></textarea>
        </pfv6-text-area>
      `);
      const textarea = el.querySelector('#test-textarea');
      expect(textarea).to.exist;
      expect(textarea?.tagName).to.equal('TEXTAREA');
    });

    it('gracefully handles non-textarea element in slot', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area>
          <input slot="textarea" type="text" />
        </pfv6-text-area>
      `);
      await el.updateComplete;

      // Component should not crash - it gracefully handles missing textarea
      expect(el).to.exist;
    });
  });

  describe('status icon rendering', function() {
    it('does not render icon when validated is "default"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="default">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const icon = el.shadowRoot?.querySelector('#icon');
      expect(icon).to.not.exist;
    });

    it('renders success icon when validated is "success"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="success">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const icon = el.shadowRoot?.querySelector('#icon.status');
      expect(icon).to.exist;
      const svg = icon?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders warning icon when validated is "warning"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="warning">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const icon = el.shadowRoot?.querySelector('#icon.status');
      expect(icon).to.exist;
      const svg = icon?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('renders error icon when validated is "error"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="error">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const icon = el.shadowRoot?.querySelector('#icon.status');
      expect(icon).to.exist;
      const svg = icon?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('CSS class mapping', function() {
    it('applies readonly class when readOnlyVariant is set', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area read-only-variant="default">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('readonly')).to.be.true;
    });

    it('applies plain class when readOnlyVariant is "plain"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area read-only-variant="plain">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('readonly')).to.be.true;
      expect(container?.classList.contains('plain')).to.be.true;
    });

    it('applies success class when validated is "success"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="success">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('success')).to.be.true;
    });

    it('applies warning class when validated is "warning"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="warning">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('warning')).to.be.true;
    });

    it('applies error class when validated is "error"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="error">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('error')).to.be.true;
    });

    it('applies resize-horizontal class when resizeOrientation is "horizontal"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area resize-orientation="horizontal">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('resize-horizontal')).to.be.true;
    });

    it('applies resize-vertical class when resizeOrientation is "vertical"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area resize-orientation="vertical">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('resize-vertical')).to.be.true;
    });

    it('applies resize-both class when resizeOrientation is "both"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area resize-orientation="both">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('resize-both')).to.be.true;
    });

    it('does not apply resize class when resizeOrientation is "none"', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area resize-orientation="none">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      const container = el.shadowRoot?.querySelector('#container');
      expect(container?.classList.contains('resize-none')).to.be.false;
      expect(container?.classList.contains('resize-horizontal')).to.be.false;
      expect(container?.classList.contains('resize-vertical')).to.be.false;
      expect(container?.classList.contains('resize-both')).to.be.false;
    });
  });

  describe('auto-resize functionality', function() {
    it('sets initial height when autoResize is true', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area auto-resize>
          <textarea slot="textarea">Line 1
Line 2
Line 3</textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('#container') as HTMLElement;
      expect(container).to.exist;
      expect(container.style.height).to.not.equal('');
      expect(container.style.height).to.not.equal('inherit');
    });

    it('does not set height when autoResize is false', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area>
          <textarea slot="textarea">Line 1
Line 2
Line 3</textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('#container') as HTMLElement;
      expect(container).to.exist;
      expect(container.style.height).to.equal('');
    });

    it('updates height on input when autoResize is true', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area auto-resize>
          <textarea slot="textarea">Initial text</textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('#container') as HTMLElement;
      const initialHeight = container.style.height;

      const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      const newHeight = container.style.height;
      expect(newHeight).to.not.equal(initialHeight);
      expect(newHeight).to.not.equal('');
    });
  });

  describe('lifecycle', function() {
    it('cleans up event listener on disconnect', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area auto-resize>
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;

      const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
      let removeEventListenerCalled = false;
      const originalRemove = textarea.removeEventListener.bind(textarea);
      textarea.removeEventListener = function(type: string, ...args: unknown[]) {
        if (type === 'input') {
          removeEventListenerCalled = true;
        }
        return originalRemove(type, ...args);
      };

      el.remove();

      expect(removeEventListenerCalled).to.be.true;
    });
  });

  describe('property updates', function() {
    it('updates aria-invalid when validated changes', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area validated="default">
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).to.equal('false');

      el.validated = 'error';
      await el.updateComplete;
      expect(textarea?.getAttribute('aria-invalid')).to.equal('true');

      el.validated = 'success';
      await el.updateComplete;
      expect(textarea?.getAttribute('aria-invalid')).to.equal('false');
    });

    it('updates aria-label when accessibleLabel changes', async function() {
      const el = await fixture<Pfv6TextArea>(html`
        <pfv6-text-area>
          <textarea slot="textarea"></textarea>
        </pfv6-text-area>
      `);
      await el.updateComplete;
      const textarea = el.querySelector('textarea');
      expect(textarea?.hasAttribute('aria-label')).to.be.false;

      el.accessibleLabel = 'First label';
      await el.updateComplete;
      expect(textarea?.getAttribute('aria-label')).to.equal('First label');

      el.accessibleLabel = 'Second label';
      await el.updateComplete;
      expect(textarea?.getAttribute('aria-label')).to.equal('Second label');
    });
  });
});
