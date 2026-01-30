import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-alert
 *
 * Validates that CSS custom properties can be overridden identically
 * in both React and Lit implementations.
 *
 * These tests apply CSS variable overrides and compare the visual
 * output pixel-by-pixel to ensure complete CSS API parity.
 */

// Helper to wait for full page load
async function waitForFullLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(() => {
    const images = Array.from(document.images);
    return Promise.all(
      images.map(img => img.complete ? Promise.resolve()
        : new Promise<void>(resolve => {
          const handler = () => {
            img.removeEventListener('load', handler);
            img.removeEventListener('error', handler);
            resolve();
          };
          img.addEventListener('load', handler);
          img.addEventListener('error', handler);
        })
      )
    );
  });

  await page.evaluate(() => {
    return new Promise<void>(resolve => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => resolve(), { timeout: 2000 });
      } else {
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 0);
        });
      }
    });
  });
}

// Helper to apply CSS override
async function applyCssOverride(
  page: Page,
  selector: string,
  cssVar: string,
  value: string
): Promise<void> {
  await page.addStyleTag({
    content: `${selector} { ${cssVar}: ${value}; }`
  });
}

// CSS variables discovered from component CSS
const cssApiTests = [
  // Base alert variables
  {
    name: '--pf-v6-c-alert--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--lg, 0 10px 20px 0 rgb(41 41 41 / 15%))',
    resolvedValue: '0 10px 20px 0 rgb(41 41 41 / 15%)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--floating--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--GridTemplateColumns',
    defaultValue: 'max-content 1fr max-content',
    resolvedValue: 'max-content 1fr max-content',
    type: 'unknown',
    testValue: '1fr 1fr 1fr',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--status--default, 2px)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '10px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Toggle variables
  {
    name: '--pf-v6-c-alert__toggle--MarginBlockStart',
    defaultValue: 'calc(-1 * var(--pf-t--global--spacer--control--vertical--default, 0.5rem))',
    resolvedValue: 'calc(-1 * 0.5rem)',
    type: 'size',
    testValue: '-50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__toggle--MarginBlockEnd',
    defaultValue: 'calc(-1 * var(--pf-t--global--spacer--control--vertical--default, 0.5rem))',
    resolvedValue: 'calc(-1 * 0.5rem)',
    type: 'size',
    testValue: '-50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__toggle--MarginInlineStart',
    defaultValue: 'calc(-1 * var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem))',
    resolvedValue: 'calc(-1 * 0.5rem)',
    type: 'size',
    testValue: '-50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__toggle--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Toggle icon variables
  {
    name: '--pf-v6-c-alert__toggle-icon--Rotate',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'unknown',
    testValue: '45deg',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__toggle-icon--TransitionTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'unknown',
    testValue: 'linear',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__toggle-icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--long, 200ms)',
    resolvedValue: '200ms',
    type: 'unknown',
    testValue: '1s',
    demo: 'group-static'
  },

  // Icon variables
  {
    name: '--pf-v6-c-alert__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__icon--MarginBlockStart',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__icon--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--md, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Title variables
  {
    name: '--pf-v6-c-alert__title--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__title--max-lines',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'group-static'
  },

  // Action variables
  {
    name: '--pf-v6-c-alert__action--MarginBlockStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--vertical--default, 0.5rem) * -1)',
    resolvedValue: 'calc(0.5rem * -1)',
    type: 'size',
    testValue: '-50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__action--MarginBlockEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--vertical--default, 0.5rem) * -1)',
    resolvedValue: 'calc(0.5rem * -1)',
    type: 'size',
    testValue: '-50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__action--TranslateY',
    defaultValue: '0.125rem',
    resolvedValue: '0.125rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__action--MarginInlineEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--sm, 0.5rem) * -1)',
    resolvedValue: 'calc(0.5rem * -1)',
    type: 'size',
    testValue: '-50px',
    demo: 'group-static'
  },

  // Description variables
  {
    name: '--pf-v6-c-alert__description--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Action group variables
  {
    name: '--pf-v6-c-alert__action-group--PaddingBlockStart-base',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__action-group--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-alert__action-group--PaddingBlockStart-base)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__description--action-group--PaddingBlockStart-base',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__description--action-group--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-alert__description--action-group--PaddingBlockStart-base)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert__action-group__c-button--not-last-child--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--gap--action-to-action--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Custom variant variables
  {
    name: '--pf-v6-c-alert--m-custom--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--custom--default, #1fa1a1)',
    resolvedValue: '#1fa1a1',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'custom'
  },
  {
    name: '--pf-v6-c-alert--m-custom__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--custom--default, #1fa1a1)',
    resolvedValue: '#1fa1a1',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'custom'
  },
  {
    name: '--pf-v6-c-alert--m-custom__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'custom'
  },

  // Success variant variables
  {
    name: '--pf-v6-c-alert--m-success--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--success--default, #3d9e3d)',
    resolvedValue: '#3d9e3d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-success__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d9e3d)',
    resolvedValue: '#3d9e3d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-success__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },

  // Danger variant variables
  {
    name: '--pf-v6-c-alert--m-danger--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--danger--default, #ba6233)',
    resolvedValue: '#ba6233',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'danger'
  },
  {
    name: '--pf-v6-c-alert--m-danger__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #ba6233)',
    resolvedValue: '#ba6233',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'danger'
  },
  {
    name: '--pf-v6-c-alert--m-danger__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'danger'
  },

  // Warning variant variables
  {
    name: '--pf-v6-c-alert--m-warning--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--warning--default, #f0ab00)',
    resolvedValue: '#f0ab00',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'warning'
  },
  {
    name: '--pf-v6-c-alert--m-warning__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #f0ab00)',
    resolvedValue: '#f0ab00',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'warning'
  },
  {
    name: '--pf-v6-c-alert--m-warning__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static',
    variant: 'warning'
  },

  // Info variant variables
  {
    name: '--pf-v6-c-alert--m-info--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--info--default, #a18fff)',
    resolvedValue: '#a18fff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-info__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--info--default, #a18fff)',
    resolvedValue: '#a18fff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-info__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },

  // Inline modifier variables
  {
    name: '--pf-v6-c-alert--m-inline--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-inline--BoxShadow',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'group-static'
  },

  // Inline plain modifier variables
  {
    name: '--pf-v6-c-alert--m-inline--m-plain--BorderWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-inline--m-plain--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-inline--m-plain--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-inline--m-plain--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-inline--m-plain--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-inline--m-plain--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Expandable modifier variables
  {
    name: '--pf-v6-c-alert--m-expandable--GridTemplateColumns',
    defaultValue: 'auto max-content 1fr max-content',
    resolvedValue: 'auto max-content 1fr max-content',
    type: 'unknown',
    testValue: '1fr 1fr 1fr 1fr',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-expandable__description--action-group--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-alert__action-group--PaddingBlockStart-base)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },

  // Expanded modifier variables
  {
    name: '--pf-v6-c-alert--m-expanded__toggle-icon--Rotate',
    defaultValue: '90deg',
    resolvedValue: '90deg',
    type: 'unknown',
    testValue: '180deg',
    demo: 'group-static'
  },
  {
    name: '--pf-v6-c-alert--m-expanded__description--action-group--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-alert__description--action-group--PaddingBlockStart-base)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'group-static'
  },
];

test.describe('CSS API Tests - React vs Lit with CSS Overrides', () => {
  cssApiTests.forEach(({ name, defaultValue, resolvedValue, type, testValue, demo, variant }) => {
    test(`CSS API: ${name}`, async ({ page, browser }) => {
      // Add metadata to test report
      test.info().annotations.push({
        type: 'css-variable',
        description: [
          `Variable: ${name}`,
          `Default: ${defaultValue}`,
          `Resolves to: ${resolvedValue} (${type})`,
          `Test value: ${testValue}`,
          variant ? `Variant: ${variant}` : ''
        ].filter(Boolean).join('\n')
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo
        await reactPage.goto(`/elements/pfv6-alert/react/test/${demo}`);
        await reactPage.waitForSelector('.pf-v6-c-alert');

        // If variant is specified, change all alerts to that variant
        if (variant) {
          await reactPage.evaluate((v) => {
            document.querySelectorAll('.pf-v6-c-alert').forEach(alert => {
              // Remove existing variant classes
              alert.classList.remove(
                'pf-m-custom', 'pf-m-success', 'pf-m-danger', 'pf-m-warning', 'pf-m-info'
              );
              // Add the specified variant class
              alert.classList.add(`pf-m-${v}`);
            });
          }, variant);
        }

        await applyCssOverride(reactPage, '.pf-v6-c-alert', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo
        await page.goto(`/elements/pfv6-alert/test/${demo}`);
        await page.waitForSelector('pfv6-alert');

        // If variant is specified, change all alerts to that variant
        if (variant) {
          await page.evaluate((v) => {
            document.querySelectorAll('pfv6-alert').forEach((alert: Element) => {
              (alert as HTMLElement).setAttribute('variant', v);
            });
          }, variant);
        }

        await applyCssOverride(page, 'pfv6-alert', name, testValue);
        await waitForFullLoad(page);

        // Take screenshots
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled'
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled'
        });

        // Decode and compare
        const reactPng = PNG.sync.read(reactBuffer);
        const litPng = PNG.sync.read(litBuffer);

        expect(reactPng.width).toBe(litPng.width);
        expect(reactPng.height).toBe(litPng.height);

        const diff = new PNG({ width: reactPng.width, height: reactPng.height });

        const numDiffPixels = pixelmatch(
          reactPng.data,
          litPng.data,
          diff.data,
          reactPng.width,
          reactPng.height,
          { threshold: 0 }  // Pixel-perfect
        );

        // Attach images to report
        await test.info().attach('React with CSS override (expected)', {
          body: reactBuffer,
          contentType: 'image/png'
        });

        await test.info().attach('Lit with CSS override (actual)', {
          body: litBuffer,
          contentType: 'image/png'
        });

        await test.info().attach('Diff (red = different pixels)', {
          body: PNG.sync.write(diff),
          contentType: 'image/png'
        });

        // Assert pixel-perfect match
        expect(numDiffPixels).toBe(0);
      } finally {
        await reactPage.close();
      }
    });
  });
});
