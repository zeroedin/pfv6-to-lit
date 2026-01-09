import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-helper-text
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
        : new Promise(resolve => {
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

// CSS variables discovered from component CSS
const cssApiTests = [
  // From pfv6-helper-text.css
  {
    name: '--pf-v6-c-helper-text--Gap',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // From pfv6-helper-text-item.css - Default colors
  {
    name: '--pf-v6-c-helper-text__item-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item-text--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--default, 400)',
    resolvedValue: '400',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },

  // Indeterminate variant
  {
    name: '--pf-v6-c-helper-text__item-icon--m-indeterminate--Color',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item-text--m-indeterminate--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Warning variant
  {
    name: '--pf-v6-c-helper-text__item-icon--m-warning--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item-text--m-warning--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },

  // Success variant
  {
    name: '--pf-v6-c-helper-text__item-icon--m-success--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item-text--m-success--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },

  // Error variant
  {
    name: '--pf-v6-c-helper-text__item-icon--m-error--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item-text--m-error--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item--m-error--TransitionDuration--Opacity',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--default, 200ms)',
    resolvedValue: '200ms',
    type: 'duration',
    testValue: '1000ms',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text__item--m-error--TransitionTimingFunction--Opacity',
    defaultValue: 'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'basic',
  },

  // Dynamic modifier colors
  {
    name: '--pf-v6-c-helper-text--m-dynamic__item-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--m-dynamic--m-indeterminate__item-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--m-dynamic--m-indeterminate__item-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--m-dynamic--m-warning__item-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--m-dynamic--m-warning__item-text--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--m-dynamic--m-success__item-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-helper-text--m-dynamic--m-error__item-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Spacing
  {
    name: '--pf-v6-c-helper-text__item-icon--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
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
        ].join('\n'),
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-helper-text/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-helper-text', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-helper-text/test/${demo}`);
        await applyCssOverride(page, 'pfv6-helper-text', name, testValue);
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
