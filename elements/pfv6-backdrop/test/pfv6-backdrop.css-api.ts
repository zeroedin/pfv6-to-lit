import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-backdrop
 *
 * Validates that CSS custom properties work identically in both React and Lit implementations.
 * Tests all public CSS variables (--pf-v6-c-backdrop--*) by overriding them and comparing renders.
 */

// Helper to wait for full page load including main thread idle
async function waitForFullLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);

  // Wait for all images to load
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

/**
 * CSS Variables discovered from pfv6-backdrop.css:
 *
 * 1. --pf-v6-c-backdrop--Position
 *    Default: fixed
 *    Type: keyword (position value)
 *
 * 2. --pf-v6-c-backdrop--ZIndex
 *    Default: var(--pf-t--global--z-index--lg, 400)
 *    Resolved: 400
 *    Type: number (z-index)
 *
 * 3. --pf-v6-c-backdrop--BackgroundColor
 *    Default: var(--pf-t--global--background--color--backdrop--default, rgba(21, 21, 21, 0.2))
 *    Resolved: rgba(21, 21, 21, 0.2)
 *    Type: color
 */

test.describe('CSS API - Custom Property Overrides', () => {
  test('--pf-v6-c-backdrop--Position override', async ({ page, browser }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const reactPage = await browser.newPage();
    await reactPage.setViewportSize({ width: 1280, height: 720 });

    try {
      // Override --pf-v6-c-backdrop--Position to "absolute"
      const cssOverride = '--pf-v6-c-backdrop--Position: absolute;';

      await reactPage.goto('/elements/pfv6-backdrop/react/test/basic');
      await reactPage.addStyleTag({
        content: `.pf-v6-c-backdrop { ${cssOverride} }`,
      });
      await waitForFullLoad(reactPage);

      await page.goto('/elements/pfv6-backdrop/test/basic');
      await page.addStyleTag({
        content: `pfv6-backdrop { ${cssOverride} }`,
      });
      await waitForFullLoad(page);

      const reactBuffer = await reactPage.screenshot({ fullPage: true, animations: 'disabled' });
      const litBuffer = await page.screenshot({ fullPage: true, animations: 'disabled' });

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

      await test.info().attach('React (expected)', { body: reactBuffer, contentType: 'image/png' });
      await test.info().attach('Lit (actual)', { body: litBuffer, contentType: 'image/png' });
      await test.info().attach('Diff (red = different pixels)', { body: PNG.sync.write(diff), contentType: 'image/png' });

      expect(numDiffPixels).toBe(0);
    } finally {
      await reactPage.close();
    }
  });

  test('--pf-v6-c-backdrop--ZIndex override', async ({ page, browser }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const reactPage = await browser.newPage();
    await reactPage.setViewportSize({ width: 1280, height: 720 });

    try {
      // Override --pf-v6-c-backdrop--ZIndex to 9999
      const cssOverride = '--pf-v6-c-backdrop--ZIndex: 9999;';

      await reactPage.goto('/elements/pfv6-backdrop/react/test/basic');
      await reactPage.addStyleTag({
        content: `.pf-v6-c-backdrop { ${cssOverride} }`,
      });
      await waitForFullLoad(reactPage);

      await page.goto('/elements/pfv6-backdrop/test/basic');
      await page.addStyleTag({
        content: `pfv6-backdrop { ${cssOverride} }`,
      });
      await waitForFullLoad(page);

      const reactBuffer = await reactPage.screenshot({ fullPage: true, animations: 'disabled' });
      const litBuffer = await page.screenshot({ fullPage: true, animations: 'disabled' });

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

      await test.info().attach('React (expected)', { body: reactBuffer, contentType: 'image/png' });
      await test.info().attach('Lit (actual)', { body: litBuffer, contentType: 'image/png' });
      await test.info().attach('Diff (red = different pixels)', { body: PNG.sync.write(diff), contentType: 'image/png' });

      expect(numDiffPixels).toBe(0);
    } finally {
      await reactPage.close();
    }
  });

  test('--pf-v6-c-backdrop--BackgroundColor override', async ({ page, browser }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const reactPage = await browser.newPage();
    await reactPage.setViewportSize({ width: 1280, height: 720 });

    try {
      // Override --pf-v6-c-backdrop--BackgroundColor to bright red (highly visible)
      const cssOverride = '--pf-v6-c-backdrop--BackgroundColor: rgb(255, 0, 0);';

      await reactPage.goto('/elements/pfv6-backdrop/react/test/basic');
      await reactPage.addStyleTag({
        content: `.pf-v6-c-backdrop { ${cssOverride} }`,
      });
      await waitForFullLoad(reactPage);

      await page.goto('/elements/pfv6-backdrop/test/basic');
      await page.addStyleTag({
        content: `pfv6-backdrop { ${cssOverride} }`,
      });
      await waitForFullLoad(page);

      const reactBuffer = await reactPage.screenshot({ fullPage: true, animations: 'disabled' });
      const litBuffer = await page.screenshot({ fullPage: true, animations: 'disabled' });

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

      await test.info().attach('React (expected)', { body: reactBuffer, contentType: 'image/png' });
      await test.info().attach('Lit (actual)', { body: litBuffer, contentType: 'image/png' });
      await test.info().attach('Diff (red = different pixels)', { body: PNG.sync.write(diff), contentType: 'image/png' });

      expect(numDiffPixels).toBe(0);
    } finally {
      await reactPage.close();
    }
  });

  test('Multiple CSS variable overrides', async ({ page, browser }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const reactPage = await browser.newPage();
    await reactPage.setViewportSize({ width: 1280, height: 720 });

    try {
      // Override ALL CSS variables simultaneously
      const cssOverrides = `
        --pf-v6-c-backdrop--Position: absolute;
        --pf-v6-c-backdrop--ZIndex: 9999;
        --pf-v6-c-backdrop--BackgroundColor: rgba(0, 128, 255, 0.5);
      `;

      await reactPage.goto('/elements/pfv6-backdrop/react/test/basic');
      await reactPage.addStyleTag({
        content: `.pf-v6-c-backdrop { ${cssOverrides} }`,
      });
      await waitForFullLoad(reactPage);

      await page.goto('/elements/pfv6-backdrop/test/basic');
      await page.addStyleTag({
        content: `pfv6-backdrop { ${cssOverrides} }`,
      });
      await waitForFullLoad(page);

      const reactBuffer = await reactPage.screenshot({ fullPage: true, animations: 'disabled' });
      const litBuffer = await page.screenshot({ fullPage: true, animations: 'disabled' });

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

      await test.info().attach('React (expected)', { body: reactBuffer, contentType: 'image/png' });
      await test.info().attach('Lit (actual)', { body: litBuffer, contentType: 'image/png' });
      await test.info().attach('Diff (red = different pixels)', { body: PNG.sync.write(diff), contentType: 'image/png' });

      expect(numDiffPixels).toBe(0);
    } finally {
      await reactPage.close();
    }
  });
});
