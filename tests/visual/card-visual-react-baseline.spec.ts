import { test, expect, Page } from '@playwright/test';

/**
 * React Baseline Visual Tests
 * 
 * Tests that React demos render consistently against their own baselines.
 * This validates the reference implementation stability.
 * 
 * Run: npm run rebuild:snapshots
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

const reactDemos = [
  'basic-cards',
  'secondary-cards',
  'with-body-section-fills',
  'with-multiple-body-sections',
  'with-only-body-section',
  'with-no-footer',
  'with-no-header',
  'with-dividers',
  'with-heading-element',
  'with-modifiers',
  'selectable',
  'single-selectable',
  'clickable-cards',
  'clickable-selectable',
  'expandable',
  'expandable-with-icon',
  'tile-cards',
  'tile-multi',
  'header-in-card-head',
  'with-image-and-actions',
  'header-wraps',
  'only-actions-in-card-head'
];

test.describe('React Baseline - Validate React Demo Stability', () => {
  reactDemos.forEach(demoName => {
    test(`React baseline: ${demoName}`, async ({ page }) => {
      // Set consistent viewport (must match parity test)
      await page.setViewportSize({ width: 1280, height: 720 });
      
      await page.goto(`/elements/pfv6-card/react/test/${demoName}`);
      await waitForFullLoad(page);
      
      // Take screenshot and compare against baseline
      await expect(page).toHaveScreenshot(`card-${demoName}-react.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });
});

