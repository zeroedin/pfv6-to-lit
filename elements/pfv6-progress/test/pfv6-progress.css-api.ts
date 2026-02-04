import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-progress
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
  {
    name: '--pf-v6-c-progress--GridGap',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__bar--Height',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__bar--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--gray--default, #e0e0e0)',
    resolvedValue: '#e0e0e0',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__bar--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__bar--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__bar--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '10px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__measure--m-static-width--MinWidth',
    defaultValue: '4.5ch',
    resolvedValue: '4.5ch',
    type: 'size',
    testValue: '50ch',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__status--Gap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__indicator--Height',
    defaultValue: 'var(--pf-v6-c-progress__bar--Height)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__indicator--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__indicator--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--extra-strong, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '10px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__indicator--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress__helper-text--MarginBlockStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--sm, 0.5rem) - var(--pf-v6-c-progress--GridGap))',
    resolvedValue: 'calc(0.5rem - 1rem)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-progress--m-success__indicator--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'success'
  },
  {
    name: '--pf-v6-c-progress--m-warning__indicator--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'warning'
  },
  {
    name: '--pf-v6-c-progress--m-danger__indicator--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'failure'
  },
  {
    name: '--pf-v6-c-progress--m-success__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'success'
  },
  {
    name: '--pf-v6-c-progress--m-warning__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'warning'
  },
  {
    name: '--pf-v6-c-progress--m-danger__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'failure'
  },
  {
    name: '--pf-v6-c-progress--m-inside__indicator--MinWidth',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'inside'
  },
  {
    name: '--pf-v6-c-progress--m-inside__measure--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-brand--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'inside'
  },
  {
    name: '--pf-v6-c-progress--m-success--m-inside__measure--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-success--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'inside-success'
  },
  {
    name: '--pf-v6-c-progress--m-warning--m-inside__measure--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-warning--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'inside'
  },
  {
    name: '--pf-v6-c-progress--m-danger--m-inside__measure--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-danger--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'inside'
  },
  {
    name: '--pf-v6-c-progress--m-inside__measure--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'inside'
  },
  {
    name: '--pf-v6-c-progress--m-outside__measure--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'outside'
  },
  {
    name: '--pf-v6-c-progress--m-sm__bar--Height',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'small'
  },
  {
    name: '--pf-v6-c-progress--m-sm__measure--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50px',
    demo: 'small'
  },
  {
    name: '--pf-v6-c-progress--m-lg__bar--Height',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'large'
  },
];

test.describe('CSS API Tests - React vs Lit with CSS Overrides', () => {
  cssApiTests.forEach(({ name, defaultValue, resolvedValue, type, testValue, demo }) => {
    test(`CSS API: ${name}`, async ({ page, browser }) => {
      // Add metadata to test report
      test.info().annotations.push({
        type: 'css-variable',
        description: [
          `Variable: ${name}`,
          `Default: ${defaultValue}`,
          `Resolves to: ${resolvedValue} (${type})`,
          `Test value: ${testValue}`,
          `Demo: ${demo}`
        ].join('\n')
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-progress/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-progress', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-progress/test/${demo}`);
        await applyCssOverride(page, 'pfv6-progress', name, testValue);
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
