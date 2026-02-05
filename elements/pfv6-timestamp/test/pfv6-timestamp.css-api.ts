import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-timestamp
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
    name: '--pf-v6-c-timestamp--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic-formats'
  },
  {
    name: '--pf-v6-c-timestamp--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic-formats'
  },
  {
    name: '--pf-v6-c-timestamp--OutlineOffset',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.1875rem)',
    resolvedValue: '0.1875rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic-formats'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--TextDecorationLine',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--line--default, underline)',
    resolvedValue: 'underline',
    type: 'text-decoration-line',
    testValue: 'none',
    demo: 'default-tooltip'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--TextDecorationStyle',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--style--default, dashed)',
    resolvedValue: 'dashed',
    type: 'text-decoration-style',
    testValue: 'solid',
    demo: 'default-tooltip'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--TextUnderlineOffset',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'default-tooltip'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-tooltip'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-tooltip'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--hover--TextDecorationLine',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--line--hover, underline)',
    resolvedValue: 'underline',
    type: 'text-decoration-line',
    testValue: 'none',
    demo: 'default-tooltip'
  },
  {
    name: '--pf-v6-c-timestamp--m-help-text--hover--TextDecorationStyle',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--style--hover, dashed)',
    resolvedValue: 'dashed',
    type: 'text-decoration-style',
    testValue: 'solid',
    demo: 'default-tooltip'
  }
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
          `Test value: ${testValue}`
        ].join('\n')
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-timestamp/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-timestamp', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-timestamp/test/${demo}`);
        await applyCssOverride(page, 'pfv6-timestamp', name, testValue);
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
