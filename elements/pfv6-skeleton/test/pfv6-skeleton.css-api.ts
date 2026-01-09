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
 * CSS Variables for pfv6-skeleton
 *
 * Discovered from: elements/pfv6-skeleton/pfv6-skeleton.css
 * Type detection based on resolved default values
 */
const cssVariables = [
  // Component base variables
  {
    name: '--pf-c-skeleton--BackgroundColor',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    description: 'Background color of the skeleton',
  },
  {
    name: '--pf-c-skeleton--Width',
    type: 'size',
    testValue: '300px',
    description: 'Width of the skeleton',
  },
  {
    name: '--pf-c-skeleton--Height',
    type: 'size',
    testValue: '100px',
    description: 'Height of the skeleton',
  },
  {
    name: '--pf-c-skeleton--BorderRadius',
    type: 'size',
    testValue: '20px',
    description: 'Border radius of the skeleton',
  },

  // Before pseudo-element variables
  {
    name: '--pf-c-skeleton--before--PaddingBlockEnd',
    type: 'size',
    testValue: '50%',
    description: 'Padding block end for the ::before pseudo-element',
  },
  {
    name: '--pf-c-skeleton--before--Height',
    type: 'size',
    testValue: '50px',
    description: 'Height of the ::before pseudo-element',
  },

  // After pseudo-element (animation) variables
  {
    name: '--pf-c-skeleton--after--LinearGradientAngle',
    type: 'angle',
    testValue: '45deg',
    description: 'Angle of the gradient animation',
  },
  {
    name: '--pf-c-skeleton--after--LinearGradientColorStop1',
    type: 'color',
    testValue: 'rgb(200, 200, 200)',
    description: 'First color stop of the gradient',
  },
  {
    name: '--pf-c-skeleton--after--LinearGradientColorStop2',
    type: 'color',
    testValue: 'rgb(150, 150, 150)',
    description: 'Second color stop of the gradient',
  },
  {
    name: '--pf-c-skeleton--after--LinearGradientColorStop3',
    type: 'color',
    testValue: 'rgb(200, 200, 200)',
    description: 'Third color stop of the gradient',
  },
  {
    name: '--pf-c-skeleton--after--AnimationDuration',
    type: 'time',
    testValue: '1s',
    description: 'Duration of the animation',
  },
  {
    name: '--pf-c-skeleton--after--AnimationDelay',
    type: 'time',
    testValue: '0s',
    description: 'Delay of the animation',
  },

  // Circle modifier variables
  {
    name: '--pf-c-skeleton--m-circle--BorderRadius',
    type: 'size',
    testValue: '50%',
    description: 'Border radius for circle shape',
  },
  {
    name: '--pf-c-skeleton--m-circle--before--PaddingBlockEnd',
    type: 'size',
    testValue: '80%',
    description: 'Padding for circle shape',
  },

  // Text modifier variables
  {
    name: '--pf-c-skeleton--m-text-4xl--Height',
    type: 'size',
    testValue: '60px',
    description: 'Height for 4xl text size',
  },
  {
    name: '--pf-c-skeleton--m-text-3xl--Height',
    type: 'size',
    testValue: '50px',
    description: 'Height for 3xl text size',
  },
  {
    name: '--pf-c-skeleton--m-text-2xl--Height',
    type: 'size',
    testValue: '40px',
    description: 'Height for 2xl text size',
  },
  {
    name: '--pf-c-skeleton--m-text-xl--Height',
    type: 'size',
    testValue: '35px',
    description: 'Height for xl text size',
  },
  {
    name: '--pf-c-skeleton--m-text-lg--Height',
    type: 'size',
    testValue: '30px',
    description: 'Height for lg text size',
  },
  {
    name: '--pf-c-skeleton--m-text-md--Height',
    type: 'size',
    testValue: '25px',
    description: 'Height for md text size',
  },
  {
    name: '--pf-c-skeleton--m-text-sm--Height',
    type: 'size',
    testValue: '20px',
    description: 'Height for sm text size',
  },
];

test.describe('CSS API Tests - Custom Property Overrides', () => {
  cssVariables.forEach(({ name, testValue, description }) => {
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
            pfv6-skeleton, .pf-v6-c-skeleton {
              ${name}: ${testValue} !important;
            }
          </style>
        `;

        // Load React demo with CSS override
        await reactPage.goto('/elements/pfv6-skeleton/react/test/default');
        await waitForFullLoad(reactPage);
        await reactPage.evaluate(style => {
          document.head.insertAdjacentHTML('beforeend', style);
        }, styleOverride);

        // Load Lit demo with CSS override
        await page.goto('/elements/pfv6-skeleton/test/default');
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
