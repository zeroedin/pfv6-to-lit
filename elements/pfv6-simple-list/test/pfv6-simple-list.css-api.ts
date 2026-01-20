import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-simple-list
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

// CSS variables discovered from component CSS with resolution chains
const cssApiTests = [
  // SimpleList item link - padding
  {
    name: '--pf-v6-c-simple-list__item-link--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },

  // SimpleList item link - colors
  {
    name: '--pf-v6-c-simple-list__item-link--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--action--plain--default, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0.0000)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--m-current--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--m-current--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--action--plain--clicked, rgb(199 199 199 / 25%))',
    resolvedValue: 'rgba(199, 199, 199, 0.2500)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--action--plain--hover, rgb(199 199 199 / 25%))',
    resolvedValue: 'rgba(199, 199, 199, 0.2500)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--m-link--Color',
    defaultValue: 'var(--pf-t--global--text--color--link--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'links'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--m-link--m-current--Color',
    defaultValue: 'var(--pf-t--global--text--color--link--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'links'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--m-link--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--link--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'links'
  },

  // SimpleList item link - typography
  {
    name: '--pf-v6-c-simple-list__item-link--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },

  // SimpleList item link - borders
  {
    name: '--pf-v6-c-simple-list__item-link--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--tiny, 4px)',
    resolvedValue: '4px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--default, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0.0000)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--hover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--hover, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-simple-list__item-link--m-current--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--clicked, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },

  // SimpleList title - padding
  {
    name: '--pf-v6-c-simple-list__title--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'grouped'
  },
  {
    name: '--pf-v6-c-simple-list__title--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'grouped'
  },
  {
    name: '--pf-v6-c-simple-list__title--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'grouped'
  },
  {
    name: '--pf-v6-c-simple-list__title--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'grouped'
  },

  // SimpleList title - typography
  {
    name: '--pf-v6-c-simple-list__title--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'grouped'
  },
  {
    name: '--pf-v6-c-simple-list__title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'grouped'
  },
  {
    name: '--pf-v6-c-simple-list__title--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'grouped'
  },

  // SimpleList section - spacing
  {
    name: '--pf-v6-c-simple-list__section--section--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'grouped'
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
        await reactPage.goto(`/elements/pfv6-simple-list/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-simple-list', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-simple-list/test/${demo}`);
        await applyCssOverride(page, 'pfv6-simple-list', name, testValue);
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
