import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-banner
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
  // Basic layout variables
  {
    name: '--pf-v6-c-banner--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--md--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--md--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-gray--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--gray--default, #e0e0e0)',
    resolvedValue: '#e0e0e0',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },

  // Link variables
  {
    name: '--pf-v6-c-banner--link--Color',
    defaultValue: 'var(--pf-v6-c-banner--Color)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--link--TextDecoration',
    defaultValue: 'underline',
    resolvedValue: 'underline',
    type: 'text-decoration',
    testValue: 'none',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--link--hover--Color',
    defaultValue: 'var(--pf-v6-c-banner--Color)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--link--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Sticky modifier variables
  {
    name: '--pf-v6-c-banner--m-sticky--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--md, 300)',
    resolvedValue: '300',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-sticky--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--md)',
    resolvedValue: '0px 4px 9px 0px rgba(41, 41, 41, 0.15)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic'
  },

  // Status modifier variables - danger
  {
    name: '--pf-v6-c-banner--m-danger--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },
  {
    name: '--pf-v6-c-banner--m-danger--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-danger--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },

  // Status modifier variables - success
  {
    name: '--pf-v6-c-banner--m-success--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },
  {
    name: '--pf-v6-c-banner--m-success--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-success--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },

  // Status modifier variables - warning
  {
    name: '--pf-v6-c-banner--m-warning--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },
  {
    name: '--pf-v6-c-banner--m-warning--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-warning--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },

  // Status modifier variables - info
  {
    name: '--pf-v6-c-banner--m-info--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--info--default, #5e40be)',
    resolvedValue: '#5e40be',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },
  {
    name: '--pf-v6-c-banner--m-info--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-info--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },

  // Status modifier variables - custom
  {
    name: '--pf-v6-c-banner--m-custom--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--custom--default, #147878)',
    resolvedValue: '#147878',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },
  {
    name: '--pf-v6-c-banner--m-custom--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--on-custom--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status'
  },

  // Nonstatus color modifier variables - red
  {
    name: '--pf-v6-c-banner--m-red--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--red--default, #fbc5c5)',
    resolvedValue: '#fbc5c5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-red--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-red--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - orangered
  {
    name: '--pf-v6-c-banner--m-orangered--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--orangered--default, #fbbea8)',
    resolvedValue: '#fbbea8',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-orangered--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-orangered--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - orange
  {
    name: '--pf-v6-c-banner--m-orange--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--orange--default, #ffe8cc)',
    resolvedValue: '#ffe8cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-orange--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-orange--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - yellow
  {
    name: '--pf-v6-c-banner--m-yellow--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--yellow--default, #fff4cc)',
    resolvedValue: '#fff4cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-yellow--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-yellow--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - green
  {
    name: '--pf-v6-c-banner--m-green--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--green--default, #d1f1bb)',
    resolvedValue: '#d1f1bb',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-green--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-green--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - teal
  {
    name: '--pf-v6-c-banner--m-teal--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--teal--default, #b9e5e5)',
    resolvedValue: '#b9e5e5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-teal--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-teal--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - blue
  {
    name: '--pf-v6-c-banner--m-blue--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--blue--default, #b9dafc)',
    resolvedValue: '#b9dafc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-blue--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-blue--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },

  // Nonstatus color modifier variables - purple
  {
    name: '--pf-v6-c-banner--m-purple--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--purple--default, #d0c5f4)',
    resolvedValue: '#d0c5f4',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-banner--m-purple--Color',
    defaultValue: 'var(--pf-t--global--text--color--nonstatus--on-purple--default, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
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
        await reactPage.goto(`/elements/pfv6-banner/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-banner', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-banner/test/${demo}`);
        await applyCssOverride(page, 'pfv6-banner', name, testValue);
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
