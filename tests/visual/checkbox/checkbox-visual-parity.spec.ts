import { test, expect, Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * Parity Visual Tests
 * 
 * THE CRITICAL TEST - Directly compares live Lit screenshots vs live React screenshots
 * to validate 1:1 visual parity.
 * 
 * Run: npm run e2e:parity
 * 
 * How it works:
 * 1. Opens both React and Lit test demos in the same test run
 * 2. Takes screenshots of both (as PNG Buffers)
 * 3. Compares them pixel-by-pixel using pixelmatch library
 * 4. Generates a diff image highlighting differences in red
 * 5. Attaches all 3 images to Playwright report (React, Lit, Diff)
 * 
 * No baseline files needed - we compare fresh renders on every run!
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
  
  // CRITICAL: Wait for main thread to be idle using requestIdleCallback (with fallback for Safari)
  await page.evaluate(() => {
    return new Promise<void>(resolve => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => resolve(), { timeout: 2000 });
      } else {
        // Fallback for Safari/WebKit which doesn't support requestIdleCallback
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 0);
        });
      }
    });
  });
}

const litDemos = [
  'controlled',
  'disabled',
  'label-wraps',
  'required',
  'reversed',
  'standalone-input',
  'uncontrolled',
  'with-body',
  'with-description',
  'with-description-body'
];

test.describe('Parity Tests - Lit vs React Side-by-Side', () => {
  litDemos.forEach(demoName => {
    test(`Parity: ${demoName} (Lit vs React)`, async ({ page, browser }) => {
      // Set consistent viewport for both pages
      await page.setViewportSize({ width: 1280, height: 720 });
      
      // Open a new page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });
      
      try {
        // Load React demo
        await reactPage.goto(`/elements/pfv6-checkbox/react/test/${demoName}`);
        await waitForFullLoad(reactPage);
        
        // Load Lit demo
        await page.goto(`/elements/pfv6-checkbox/test/${demoName}`);
        await waitForFullLoad(page);
        
        // Take React screenshot
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled'
        });
        
        // Take Lit screenshot
        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled'
        });
        
        // Decode PNG buffers
        const reactPng = PNG.sync.read(reactBuffer);
        const litPng = PNG.sync.read(litBuffer);
        
        // Ensure dimensions match
        expect(reactPng.width).toBe(litPng.width);
        expect(reactPng.height).toBe(litPng.height);
        
        // Create diff image
        const diff = new PNG({ width: reactPng.width, height: reactPng.height });
        
        // Compare pixel-by-pixel (threshold: 0 = pixel-perfect matching)
        const numDiffPixels = pixelmatch(
          reactPng.data,
          litPng.data,
          diff.data,
          reactPng.width,
          reactPng.height,
          { threshold: 0 } // Pixel-perfect (zero tolerance for differences)
        );
        
        // Attach all 3 images to Playwright report
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
        
        // CRITICAL: Assert pixel-perfect match
        // If this fails, check the diff image to see exactly what's different
        expect(numDiffPixels).toBe(0);
      } finally {
        await reactPage.close();
      }
    });
  });
});

