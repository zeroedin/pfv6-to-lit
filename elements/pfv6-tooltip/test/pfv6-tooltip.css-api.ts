import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-tooltip
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

// CSS variables discovered from component CSS with full resolution chain
const cssApiTests = [
  {
    name: '--pf-v6-c-tooltip--MaxWidth',
    defaultValue: '18.75rem',
    resolvedValue: '18.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--md, 0 4px 9px 0 rgb(41 41 41 / 15%))',
    resolvedValue: '0 4px 9px 0 rgba(41, 41, 41, 0.15)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--Color',
    defaultValue: 'var(--pf-t--global--text--color--inverse, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--inverse--default, #292929)',
    resolvedValue: '#292929',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__content--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--Width',
    defaultValue: '0.9375rem',
    resolvedValue: '0.9375rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--Height',
    defaultValue: '0.9375rem',
    resolvedValue: '0.9375rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--inverse--default, #292929)',
    resolvedValue: '#292929',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--md, 0 4px 9px 0 rgb(41 41 41 / 15%))',
    resolvedValue: '0 4px 9px 0 rgba(41, 41, 41, 0.15)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-top--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-top--TranslateY',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-top--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-right--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-right--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-right--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-bottom--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-bottom--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-bottom--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-left--TranslateX',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-left--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-tooltip__arrow--m-left--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
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
        await reactPage.goto(`/elements/pfv6-tooltip/react/demo/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-tooltip', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-tooltip/demo/${demo}`);
        await applyCssOverride(page, 'pfv6-tooltip', name, testValue);
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
