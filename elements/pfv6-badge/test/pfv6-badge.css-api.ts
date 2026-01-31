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
 * CSS Variables for pfv6-badge
 *
 * Discovered from: elements/pfv6-badge/pfv6-badge.css
 * Type detection based on resolved default values
 */
const cssVariables = [
  // Component base variables
  {
    name: '--pf-v6-c-badge--BorderColor',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    description: 'Border color of the badge',
  },
  {
    name: '--pf-v6-c-badge--BorderWidth',
    type: 'size',
    testValue: '5px',
    description: 'Border width of the badge',
  },
  {
    name: '--pf-v6-c-badge--BorderRadius',
    type: 'size',
    testValue: '10px',
    description: 'Border radius of the badge',
  },
  {
    name: '--pf-v6-c-badge--FontSize',
    type: 'size',
    testValue: '24px',
    description: 'Font size of the badge text',
  },
  {
    name: '--pf-v6-c-badge--FontWeight',
    type: 'font-weight',
    testValue: '900',
    description: 'Font weight of the badge text',
  },
  {
    name: '--pf-v6-c-badge--PaddingInlineEnd',
    type: 'size',
    testValue: '30px',
    description: 'Right padding of the badge',
  },
  {
    name: '--pf-v6-c-badge--PaddingInlineStart',
    type: 'size',
    testValue: '30px',
    description: 'Left padding of the badge',
  },
  {
    name: '--pf-v6-c-badge--Color',
    type: 'color',
    testValue: 'rgb(0, 255, 0)',
    description: 'Text color of the badge',
  },
  {
    name: '--pf-v6-c-badge--MinWidth',
    type: 'size',
    testValue: '100px',
    description: 'Minimum width of the badge',
  },
  {
    name: '--pf-v6-c-badge--BackgroundColor',
    type: 'color',
    testValue: 'rgb(0, 0, 255)',
    description: 'Background color of the badge',
  },

  // Read modifier variables
  {
    name: '--pf-v6-c-badge--m-read--BackgroundColor',
    type: 'color',
    testValue: 'rgb(255, 165, 0)',
    description: 'Background color when badge is read',
  },
  {
    name: '--pf-v6-c-badge--m-read--Color',
    type: 'color',
    testValue: 'rgb(128, 0, 128)',
    description: 'Text color when badge is read',
  },
  {
    name: '--pf-v6-c-badge--m-read--BorderColor',
    type: 'color',
    testValue: 'rgb(0, 255, 255)',
    description: 'Border color when badge is read',
  },

  // Unread modifier variables
  {
    name: '--pf-v6-c-badge--m-unread--BackgroundColor',
    type: 'color',
    testValue: 'rgb(255, 255, 0)',
    description: 'Background color when badge is unread',
  },
  {
    name: '--pf-v6-c-badge--m-unread--Color',
    type: 'color',
    testValue: 'rgb(255, 0, 255)',
    description: 'Text color when badge is unread',
  },

  // Disabled modifier variables
  {
    name: '--pf-v6-c-badge--m-disabled--Color',
    type: 'color',
    testValue: 'rgb(100, 100, 100)',
    description: 'Text color when badge is disabled',
  },
  {
    name: '--pf-v6-c-badge--m-disabled--BorderColor',
    type: 'color',
    testValue: 'rgb(200, 200, 0)',
    description: 'Border color when badge is disabled',
  },
  {
    name: '--pf-v6-c-badge--m-disabled--BackgroundColor',
    type: 'color',
    testValue: 'rgb(150, 150, 150)',
    description: 'Background color when badge is disabled',
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
            pfv6-badge, .pf-v6-c-badge {
              ${name}: ${testValue} !important;
            }
          </style>
        `;

        // Load React demo with CSS override
        await reactPage.goto('/elements/pfv6-badge/react/test/unread');
        await waitForFullLoad(reactPage);
        await reactPage.evaluate(style => {
          document.head.insertAdjacentHTML('beforeend', style);
        }, styleOverride);

        // Load Lit demo with CSS override
        await page.goto('/elements/pfv6-badge/test/unread');
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
