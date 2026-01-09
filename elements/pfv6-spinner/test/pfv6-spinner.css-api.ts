/**
 * CSS API Tests for pfv6-spinner
 *
 * Validates that CSS custom properties can be overridden identically
 * in both React and Lit implementations.
 *
 * CSS variables discovered from:
 * - elements/pfv6-spinner/pfv6-spinner.css
 * - .cache/patternfly/src/patternfly/components/Spinner/spinner.scss
 *
 * Token resolution from:
 * - .cache/patternfly/src/patternfly/base/tokens/tokens-default.scss
 * - .cache/patternfly/src/patternfly/base/tokens/tokens-palette.scss
 */
import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

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

/**
 * CSS variables discovered from spinner CSS
 *
 * Resolution chain:
 * --pf-v6-c-spinner--diameter → var(--pf-t--global--icon--size--2xl) → var(--pf-t--global--icon--size--400) → 3.5rem
 * --pf-v6-c-spinner--Color → var(--pf-t--global--icon--color--brand--default) → var(--pf-t--global--color--brand--default) → var(--pf-t--global--color--brand--200) → var(--pf-t--color--blue--50) → #0066cc
 * --pf-v6-c-spinner--AnimationDuration → 1.4s
 * --pf-v6-c-spinner--StrokeWidth → 10
 * --pf-v6-c-spinner--m-sm--diameter → var(--pf-t--global--icon--size--md) → var(--pf-t--global--icon--size--200) → 0.875rem
 * --pf-v6-c-spinner--m-md--diameter → var(--pf-t--global--icon--size--lg) → var(--pf-t--global--icon--size--250) → 1rem
 * --pf-v6-c-spinner--m-lg--diameter → var(--pf-t--global--icon--size--xl) → var(--pf-t--global--icon--size--300) → 1.5rem
 * --pf-v6-c-spinner--m-xl--diameter → var(--pf-t--global--icon--size--2xl) → var(--pf-t--global--icon--size--400) → 3.5rem
 * --pf-v6-c-spinner--m-inline--diameter → 1em
 */
const cssApiTests = [
  {
    name: '--pf-v6-c-spinner--diameter',
    defaultValue: 'var(--pf-t--global--icon--size--2xl, 3.5rem)',
    resolvedValue: '3.5rem',
    type: 'size',
    testValue: '100px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-spinner--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-spinner--AnimationDuration',
    defaultValue: '1.4s',
    resolvedValue: '1.4s',
    type: 'time',
    testValue: '5s',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-spinner--StrokeWidth',
    defaultValue: '10',
    resolvedValue: '10',
    type: 'number',
    testValue: '25',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-spinner--m-sm--diameter',
    defaultValue: 'var(--pf-t--global--icon--size--md, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'size-variations',
  },
  {
    name: '--pf-v6-c-spinner--m-md--diameter',
    defaultValue: 'var(--pf-t--global--icon--size--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '60px',
    demo: 'size-variations',
  },
  {
    name: '--pf-v6-c-spinner--m-lg--diameter',
    defaultValue: 'var(--pf-t--global--icon--size--xl, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '70px',
    demo: 'size-variations',
  },
  {
    name: '--pf-v6-c-spinner--m-xl--diameter',
    defaultValue: 'var(--pf-t--global--icon--size--2xl, 3.5rem)',
    resolvedValue: '3.5rem',
    type: 'size',
    testValue: '120px',
    demo: 'size-variations',
  },
  {
    name: '--pf-v6-c-spinner--m-inline--diameter',
    defaultValue: '1em',
    resolvedValue: '1em',
    type: 'size',
    testValue: '2em',
    demo: 'inline',
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
        await reactPage.goto(`/elements/pfv6-spinner/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-spinner', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-spinner/test/${demo}`);
        await applyCssOverride(page, 'pfv6-spinner', name, testValue);
        await waitForFullLoad(page);

        // Take screenshots (animations disabled to ensure consistent state)
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
