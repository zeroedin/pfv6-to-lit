import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { discoverDemos } from '../../../tests/helpers/discover-demos.js';

/**
 * CRITICAL: Demos are discovered dynamically from the filesystem, not hardcoded.
 * This ensures tests automatically pick up new demos or renamed demos.
 */

// Helper to wait for full page load including main thread idle
async function waitForFullLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);

  // Wait for all images to load
  await page.evaluate(() => {
    const images = Array.from(document.images);
    return Promise.all(
      images.map(img => img.complete ? Promise.resolve() :
        new Promise(resolve => { img.onload = img.onerror = resolve; })
      )
    );
  });

  // Wait for main thread to be idle (with Safari fallback)
  await page.evaluate(() => {
    return new Promise<void>(resolve => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => resolve(), { timeout: 2000 });
      } else {
        // Fallback for Safari/WebKit
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 0);
        });
      }
    });
  });
}

// Dynamically discover all demos from the filesystem
const litDemos = discoverDemos('skeleton');

test.describe('Parity Tests - Lit vs React Side-by-Side', () => {
  litDemos.forEach(demoName => {
    test(`Parity: ${demoName} (Lit vs React)`, async ({ page, browser }) => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open SECOND page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load BOTH demos simultaneously
        await reactPage.goto(`/elements/pfv6-skeleton/react/test/${demoName}`);
        await waitForFullLoad(reactPage);

        await page.goto(`/elements/pfv6-skeleton/test/${demoName}`);
        await waitForFullLoad(page);

        // Take FRESH screenshots (no baseline files)
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled'
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled'
        });

        // Decode and compare pixel-by-pixel
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
          { threshold: 0 } // Pixel-perfect (zero tolerance)
        );

        // Attach all 3 images to report
        await test.info().attach('React (expected)', {
          body: reactBuffer,
          contentType: 'image/png'
        });

        await test.info().attach('Lit (actual)', {
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
