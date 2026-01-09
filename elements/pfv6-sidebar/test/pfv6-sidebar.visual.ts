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
      images.map(img => img.complete ? Promise.resolve()
        : new Promise(resolve => {
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

// Dynamically discover all demos from the filesystem
const litDemos = discoverDemos('sidebar');

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
        await reactPage.goto(`/elements/pfv6-sidebar/react/test/${demoName}`);
        await waitForFullLoad(reactPage);

        await page.goto(`/elements/pfv6-sidebar/test/${demoName}`);
        await waitForFullLoad(page);

        // Take FRESH screenshots (no baseline files)
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
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
          contentType: 'image/png',
        });

        await test.info().attach('Lit (actual)', {
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

test.describe('Responsive Panel Width Tests - Lit vs React', () => {
  // Test responsive-panel demo at multiple viewport sizes
  // This validates that panel width behavior matches React across breakpoints
  const viewports = [
    { name: 'mobile', width: 375, height: 667 }, // Mobile - should use default width
    { name: 'tablet', width: 768, height: 1024 }, // Tablet - lg breakpoint (width_50)
    { name: 'desktop', width: 992, height: 768 }, // Desktop - lg breakpoint (width_33)
    { name: 'wide', width: 1440, height: 900 }, // Wide - xl breakpoint (width_75)
  ];

  viewports.forEach(viewport => {
    test(`Parity: responsive-panel at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page, browser }) => {
      // Set viewport for Lit demo
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Open SECOND page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: viewport.width, height: viewport.height });

      try {
        // Load BOTH demos simultaneously
        await reactPage.goto('/elements/pfv6-sidebar/react/test/responsive-panel');
        await waitForFullLoad(reactPage);

        await page.goto('/elements/pfv6-sidebar/test/responsive-panel');
        await waitForFullLoad(page);

        // Take FRESH screenshots (no baseline files)
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
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
        await test.info().attach(`React ${viewport.name} (expected)`, {
          body: reactBuffer,
          contentType: 'image/png',
        });

        await test.info().attach(`Lit ${viewport.name} (actual)`, {
          body: litBuffer,
          contentType: 'image/png',
        });

        await test.info().attach(`Diff ${viewport.name} (red = different pixels)`, {
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

test.describe('Panel Positioning Tests - Lit vs React', () => {
  // Test panel positioning variants to ensure sticky and static behavior matches React
  const positioningDemos = [
    { name: 'sticky-panel', description: 'sticky panel with overflow scrolling' },
    { name: 'static-panel', description: 'static panel positioning' },
  ];

  positioningDemos.forEach(demo => {
    test(`Parity: ${demo.name} - ${demo.description}`, async ({ page, browser }) => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open SECOND page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load BOTH demos simultaneously
        await reactPage.goto(`/elements/pfv6-sidebar/react/test/${demo.name}`);
        await waitForFullLoad(reactPage);

        await page.goto(`/elements/pfv6-sidebar/test/${demo.name}`);
        await waitForFullLoad(page);

        // Take FRESH screenshots (no baseline files)
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
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
          contentType: 'image/png',
        });

        await test.info().attach('Lit (actual)', {
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

test.describe('Layout Orientation Tests - Lit vs React', () => {
  // Test stack vs split orientation to ensure layout behavior matches React
  test('Parity: stack orientation (panel stacked on top)', async ({ page, browser }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Open SECOND page for React demo
    const reactPage = await browser.newPage();
    await reactPage.setViewportSize({ width: 1280, height: 720 });

    try {
      // Load BOTH demos simultaneously
      await reactPage.goto('/elements/pfv6-sidebar/react/test/stack');
      await waitForFullLoad(reactPage);

      await page.goto('/elements/pfv6-sidebar/test/stack');
      await waitForFullLoad(page);

      // Take FRESH screenshots (no baseline files)
      const reactBuffer = await reactPage.screenshot({
        fullPage: true,
        animations: 'disabled',
      });

      const litBuffer = await page.screenshot({
        fullPage: true,
        animations: 'disabled',
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
        contentType: 'image/png',
      });

      await test.info().attach('Lit (actual)', {
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

test.describe('Visual Styling Tests - Lit vs React', () => {
  // Test border, padding, and gutter variants to ensure visual styling matches React
  const stylingDemos = [
    { name: 'border', description: 'border visual styling' },
    { name: 'padding-content', description: 'content padding' },
    { name: 'padding-panel', description: 'panel padding' },
    { name: 'panel-right-gutter', description: 'panel right positioning with gutter' },
  ];

  stylingDemos.forEach(demo => {
    test(`Parity: ${demo.name} - ${demo.description}`, async ({ page, browser }) => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open SECOND page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load BOTH demos simultaneously
        await reactPage.goto(`/elements/pfv6-sidebar/react/test/${demo.name}`);
        await waitForFullLoad(reactPage);

        await page.goto(`/elements/pfv6-sidebar/test/${demo.name}`);
        await waitForFullLoad(page);

        // Take FRESH screenshots (no baseline files)
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
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
          contentType: 'image/png',
        });

        await test.info().attach('Lit (actual)', {
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
