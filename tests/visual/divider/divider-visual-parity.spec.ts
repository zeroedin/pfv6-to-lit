import { test, expect, Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { discoverDemos } from '../../helpers/discover-demos.js';

/**
 * Parity Visual Tests
 * 
 * THE CRITICAL TEST - Directly compares live Lit screenshots vs live React screenshots
 * to validate 1:1 visual parity.
 * 
 * Run: npm run e2e:parity -- tests/visual/divider/
 * 
 * How it works:
 * 1. Opens both React and Lit test demos in the same test run
 * 2. Takes screenshots of both (as PNG Buffers)
 * 3. Compares them pixel-by-pixel using pixelmatch library
 * 4. Generates a diff image highlighting differences in red
 * 5. Attaches all 3 images to Playwright report (React, Lit, Diff)
 * 
 * No baseline files needed - we compare fresh renders on every run!
 * 
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

// Dynamically discover all demos from the filesystem
const litDemos = discoverDemos('divider');

test.describe('Parity Tests - Lit vs React Side-by-Side', () => {
  litDemos.forEach(demoName => {
    // Special handling for responsive demos that need multiple viewport sizes
    const isResponsiveInsetDemo = demoName === 'vertical-flex-inset-various-breakpoints' || 
                                   demoName === 'inset-various-breakpoints';
    
    if (isResponsiveInsetDemo) {
      // Test at multiple viewport sizes for responsive demos
      const viewportWidths = [567, 768, 1054, 1200, 1450];
      
      viewportWidths.forEach(width => {
        test(`Parity: ${demoName} @ ${width}px (Lit vs React)`, async ({ page, browser }) => {
          await page.setViewportSize({ width, height: 720 });
          
          const reactPage = await browser.newPage();
          await reactPage.setViewportSize({ width, height: 720 });
          
          try {
            await reactPage.goto(`/elements/pfv6-divider/react/test/${demoName}`);
            await waitForFullLoad(reactPage);
            
            await page.goto(`/elements/pfv6-divider/test/${demoName}`);
            await waitForFullLoad(page);
            
            const reactBuffer = await reactPage.screenshot({
              fullPage: true,
              animations: 'disabled'
            });
            
            const litBuffer = await page.screenshot({
              fullPage: true,
              animations: 'disabled'
            });
            
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
              { threshold: 0 }
            );
            
            await test.info().attach(`React @ ${width}px (expected)`, {
              body: reactBuffer,
              contentType: 'image/png'
            });
            
            await test.info().attach(`Lit @ ${width}px (actual)`, {
              body: litBuffer,
              contentType: 'image/png'
            });
            
            await test.info().attach(`Diff @ ${width}px (red = different pixels)`, {
              body: PNG.sync.write(diff),
              contentType: 'image/png'
            });
            
            expect(numDiffPixels).toBe(0);
          } finally {
            await reactPage.close();
          }
        });
      });
    } else {
      // Standard test for non-responsive demos
      test(`Parity: ${demoName} (Lit vs React)`, async ({ page, browser }) => {
        await page.setViewportSize({ width: 1280, height: 720 });
        
        const reactPage = await browser.newPage();
        await reactPage.setViewportSize({ width: 1280, height: 720 });
        
        try {
          await reactPage.goto(`/elements/pfv6-divider/react/test/${demoName}`);
          await waitForFullLoad(reactPage);
          
          await page.goto(`/elements/pfv6-divider/test/${demoName}`);
          await waitForFullLoad(page);
          
          const reactBuffer = await reactPage.screenshot({
            fullPage: true,
            animations: 'disabled'
          });
          
          const litBuffer = await page.screenshot({
            fullPage: true,
            animations: 'disabled'
          });
          
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
            { threshold: 0 }
          );
          
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
          
          expect(numDiffPixels).toBe(0);
        } finally {
          await reactPage.close();
        }
      });
    }
  });
});

