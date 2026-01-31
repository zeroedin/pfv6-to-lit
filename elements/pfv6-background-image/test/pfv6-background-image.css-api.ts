import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests
 *
 * Validates that CSS custom properties can be overridden identically
 * in both React and LitElement implementations.
 *
 * Each test:
 * 1. Overrides a specific CSS variable with a distinctive test value
 * 2. Renders both React and Lit versions with the override
 * 3. Compares pixel-by-pixel to ensure identical rendering
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

/**
 * CSS Variables for pfv6-background-image
 *
 * Discovered from: elements/pfv6-background-image/pfv6-background-image.css
 * Type detection based on resolved default values
 */
const cssVariables = [
  {
    name: '--pf-v6-c-background-image--BackgroundColor',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    description: 'Background color behind the image',
  },
  {
    name: '--pf-v6-c-background-image--BackgroundSize--min-width',
    type: 'size',
    testValue: '100px',
    description: 'Minimum width for background image size',
  },
  {
    name: '--pf-v6-c-background-image--BackgroundSize--width',
    type: 'size',
    testValue: '80%',
    description: 'Width for background image size',
  },
  {
    name: '--pf-v6-c-background-image--BackgroundSize--max-width',
    type: 'size',
    testValue: '800px',
    description: 'Maximum width for background image size',
  },
  {
    name: '--pf-v6-c-background-image--BackgroundPosition',
    type: 'position',
    testValue: 'top left',
    description: 'Background image position',
  },
];

test.describe('CSS API Tests - Custom Property Overrides', () => {
  cssVariables.forEach(({ name, testValue }) => {
    test(`CSS Variable: ${name}`, async ({ page, browser }) => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open SECOND page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Create inline style with CSS variable override
        const styleOverride = `
          <style>
            pfv6-background-image, .pf-v6-c-background-image {
              ${name}: ${testValue} !important;
            }
          </style>
        `;

        // Load React demo with CSS override
        await reactPage.goto('/elements/pfv6-background-image/react/test/basic');
        await waitForFullLoad(reactPage);
        await reactPage.evaluate(style => {
          document.head.insertAdjacentHTML('beforeend', style);
        }, styleOverride);

        // Load Lit demo with CSS override
        await page.goto('/elements/pfv6-background-image/test/basic');
        await waitForFullLoad(page);
        await page.evaluate(style => {
          document.head.insertAdjacentHTML('beforeend', style);
        }, styleOverride);

        // Take screenshots
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        // Compare pixel-by-pixel
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
        await test.info().attach('React (expected)', {
          body: reactBuffer,
          contentType: 'image/png',
        });

        await test.info().attach('Lit (actual)', {
          body: litBuffer,
          contentType: 'image/png',
        });

        if (numDiffPixels > 0) {
          await test.info().attach('Diff (red = different pixels)', {
            body: PNG.sync.write(diff),
            contentType: 'image/png',
          });
        }

        // Assert pixel-perfect match
        expect(numDiffPixels).toBe(0);
      } finally {
        await reactPage.close();
      }
    });
  });
});
