import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-panel
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
    content: `${selector} { ${cssVar}: ${value}; }`,
  });
}

// CSS variables discovered from component CSS files
const cssApiTests = [
  // Core panel variables
  {
    name: '--pf-v6-c-panel--Width',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'size',
    testValue: '500px',
    demo: 'index',
  },
  {
    name: '--pf-v6-c-panel--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'index',
  },
  {
    name: '--pf-v6-c-panel--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '20px',
    demo: 'index',
  },
  {
    name: '--pf-v6-c-panel--BoxShadow',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'index',
  },

  // Border variables
  {
    name: '--pf-v6-c-panel--before--BorderWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'bordered',
  },
  {
    name: '--pf-v6-c-panel--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgba(255, 255, 255, 0))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'bordered',
  },

  // Bordered variant
  {
    name: '--pf-v6-c-panel--m-bordered--before--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'bordered',
  },
  {
    name: '--pf-v6-c-panel--m-bordered--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'bordered',
  },

  // Secondary variant
  {
    name: '--pf-v6-c-panel--m-secondary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f2f2f2)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },

  // Raised variant
  {
    name: '--pf-v6-c-panel--m-raised--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--floating--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'raised',
  },

  // Header padding
  {
    name: '--pf-v6-c-panel__header--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'header',
  },
  {
    name: '--pf-v6-c-panel__header--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '3rem',
    demo: 'header',
  },

  // Main section
  {
    name: '--pf-v6-c-panel__main--MaxHeight',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'size',
    testValue: '200px',
    demo: 'scrollable',
  },
  {
    name: '--pf-v6-c-panel--m-scrollable__main--MaxHeight',
    defaultValue: '18.75rem',
    resolvedValue: '18.75rem',
    type: 'size',
    testValue: '100px',
    demo: 'scrollable',
  },

  // Main body padding
  {
    name: '--pf-v6-c-panel__main-body--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'index',
  },
  {
    name: '--pf-v6-c-panel__main-body--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '3rem',
    demo: 'index',
  },

  // Footer padding
  {
    name: '--pf-v6-c-panel__footer--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'footer',
  },
  {
    name: '--pf-v6-c-panel__footer--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '3rem',
    demo: 'footer',
  },
  {
    name: '--pf-v6-c-panel__footer--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'scrollable-with-header-and-footer',
  },
  {
    name: '--pf-v6-c-panel__footer--BorderWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'scrollable-with-header-and-footer',
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
          `Demo: ${demo}`,
        ].join('\n'),
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-panel/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-panel', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-panel/test/${demo}`);
        await applyCssOverride(page, 'pfv6-panel', name, testValue);
        await waitForFullLoad(page);

        // Take screenshots
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
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
          { threshold: 0 } // Pixel-perfect
        );

        // Attach images to report
        await test.info().attach('React with CSS override (expected)', {
          body: reactBuffer,
          contentType: 'image/png',
        });

        await test.info().attach('Lit with CSS override (actual)', {
          body: litBuffer,
          contentType: 'image/png',
        });

        await test.info().attach('Diff (red = different pixels)', {
          body: PNG.sync.write(diff),
          contentType: 'image/png',
        });

        // Assert pixel-perfect match
        expect(numDiffPixels).toBe(0);
      } finally {
        await reactPage.close();
      }
    });
  });
});
