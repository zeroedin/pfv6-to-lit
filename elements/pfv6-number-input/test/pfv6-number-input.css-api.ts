import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-number-input
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

// CSS variables discovered from component CSS
const cssApiTests = [
  {
    name: '--pf-v6-c-number-input__unit--c-input-group--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'unit',
  },
  {
    name: '--pf-v6-c-number-input__icon--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--xs, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50px',
    demo: 'default',
  },
  {
    name: '--pf-v6-c-number-input--c-form-control--width-base',
    defaultValue:
      'calc(var(--pf-t--global--spacer--md, 1rem) * 2 '
      + '+ var(--pf-t--global--border--width--box--default, 1px) * 2)',
    resolvedValue: 'calc(1rem * 2 + 1px * 2)',
    type: 'size',
    testValue: '50px',
    demo: 'default',
  },
  {
    name: '--pf-v6-c-number-input--c-form-control--width-icon',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'default',
  },
  {
    name: '--pf-v6-c-number-input--c-form-control--width-chars',
    defaultValue: '4',
    resolvedValue: '4',
    type: 'number',
    testValue: '999',
    demo: 'default',
  },
  {
    name: '--pf-v6-c-number-input--c-form-control--Width',
    defaultValue:
      'calc(calc(var(--pf-v6-c-number-input--c-form-control--width-base) '
      + '+ var(--pf-v6-c-number-input--c-form-control--width-chars) * 1ch) '
      + '+ var(--pf-v6-c-number-input--c-form-control--width-icon))',
    resolvedValue:
      'calc(calc(var(--pf-v6-c-number-input--c-form-control--width-base) '
      + '+ var(--pf-v6-c-number-input--c-form-control--width-chars) * 1ch) '
      + '+ var(--pf-v6-c-number-input--c-form-control--width-icon))',
    type: 'size',
    testValue: '500px',
    demo: 'default',
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
        await reactPage.goto(`/elements/pfv6-number-input/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-number-input', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-number-input/test/${demo}`);
        await applyCssOverride(page, 'pfv6-number-input', name, testValue);
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

        // Pixel-perfect comparison
        const numDiffPixels = pixelmatch(
          reactPng.data,
          litPng.data,
          diff.data,
          reactPng.width,
          reactPng.height,
          { threshold: 0 },
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
