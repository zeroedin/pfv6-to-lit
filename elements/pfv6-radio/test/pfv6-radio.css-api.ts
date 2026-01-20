import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-radio
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

// CSS variables discovered from component CSS with resolved values
const cssApiTests = [
  {
    name: '--pf-v6-c-radio--GridGap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem) var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem 0.5rem',
    type: 'size',
    testValue: '2rem 2rem',
    demo: 'with-description',
  },
  {
    name: '--pf-v6-c-radio--AccentColor',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'uncontrolled',
  },
  {
    name: '--pf-v6-c-radio--m-standalone--MinHeight',
    defaultValue:
      'calc(var(--pf-v6-c-radio__label--FontSize, 0.875rem) * '
      + 'var(--pf-v6-c-radio__label--LineHeight, 1.5))',
    resolvedValue: 'calc(0.875rem * 1.5)',
    type: 'size',
    testValue: '50px',
    demo: 'standalone-input',
  },
  {
    name: '--pf-v6-c-radio__label--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled',
  },
  {
    name: '--pf-v6-c-radio__label--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'uncontrolled',
  },
  {
    name: '--pf-v6-c-radio__label--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--default, 400)',
    resolvedValue: '400',
    type: 'font-weight',
    testValue: '900',
    demo: 'uncontrolled',
  },
  {
    name: '--pf-v6-c-radio__label--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '2rem',
    demo: 'uncontrolled',
  },
  {
    name: '--pf-v6-c-radio__label--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '2.5',
    demo: 'uncontrolled',
  },
  {
    name: '--pf-v6-c-radio__description--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '1.5rem',
    demo: 'with-description',
  },
  {
    name: '--pf-v6-c-radio__description--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-description',
  },
  {
    name: '--pf-v6-c-radio__input--first-child--MarginInlineStart',
    defaultValue: '0.0625rem',
    resolvedValue: '0.0625rem',
    type: 'size',
    testValue: '20px',
    demo: 'uncontrolled',
  },
  {
    name: '--pf-v6-c-radio__input--last-child--MarginInlineEnd',
    defaultValue: '0.0625rem',
    resolvedValue: '0.0625rem',
    type: 'size',
    testValue: '20px',
    demo: 'reversed',
  },
  {
    name: '--pf-v6-c-radio__body--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'with-body',
  },
  {
    name: '--pf-v6-c-radio__input--TranslateY',
    defaultValue:
      'calc((var(--pf-v6-c-radio__label--LineHeight, 1.5) * '
      + 'var(--pf-v6-c-radio__label--FontSize, 0.875rem) / 2 ) - 50%)',
    resolvedValue: 'calc((1.5 * 0.875rem / 2 ) - 50%)',
    type: 'size',
    testValue: '10px',
    demo: 'uncontrolled',
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
        await reactPage.goto(`/elements/pfv6-radio/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-radio', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-radio/demo/${demo}`);
        await applyCssOverride(page, 'pfv6-radio', name, testValue);
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
