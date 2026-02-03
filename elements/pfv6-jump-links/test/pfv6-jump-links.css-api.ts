import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-jump-links
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
    content: `${selector} { ${cssVar}: ${value}; }`,
  });
}

// CSS variables discovered from component CSS with resolved values
const cssApiTests = [
  // List Variables
  {
    name: '--pf-v6-c-jump-links__list--Display',
    defaultValue: 'flex',
    resolvedValue: 'flex',
    type: 'keyword',
    testValue: 'block',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '2rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '2rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '2rem',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '2rem',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links__list--FlexDirection',
    defaultValue: 'row',
    resolvedValue: 'row',
    type: 'keyword',
    testValue: 'column',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--FlexDirection',
    defaultValue: 'column',
    resolvedValue: 'column',
    type: 'keyword',
    testValue: 'row',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links__list--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--before--BorderBlockStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--before--BorderInlineEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--before--BorderBlockEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list--before--BorderInlineStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--before--BorderInlineStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__list--before--BorderBlockStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links__list__list--MarginBlockStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--sm, 0.5rem) * -1)',
    resolvedValue: 'calc(0.5rem * -1)',
    type: 'calc',
    testValue: '2rem',
    demo: 'expandable-vertical-with-subsection',
  },

  // Link Variables
  {
    name: '--pf-v6-c-jump-links__link--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__list__list__link--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__list__list__link--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '3rem',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__list__list__link--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__link--OutlineOffset',
    defaultValue: 'calc(-1 * var(--pf-t--global--spacer--sm, 0.5rem))',
    resolvedValue: 'calc(-1 * 0.5rem)',
    type: 'calc',
    testValue: '-2rem',
    demo: 'basic',
  },

  // Link Before (Underline) Variables
  {
    name: '--pf-v6-c-jump-links__link--before--BorderBlockStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--before--BorderInlineEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--before--BorderBlockEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--before--BorderInlineStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--before--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__item--m-current__link--before--BorderBlockStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--extra-strong, 3px)',
    resolvedValue: '3px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__item--m-current__link--before--BorderInlineStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__item--m-current__link--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--clicked, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__item--m-current__link--before--BorderBlockStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'vertical',
  },
  {
    name: '--pf-v6-c-jump-links--m-vertical__item--m-current__link--before--BorderInlineStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--extra-strong, 3px)',
    resolvedValue: '3px',
    type: 'size',
    testValue: '10px',
    demo: 'vertical',
  },

  // Link Text Variables
  {
    name: '--pf-v6-c-jump-links__link-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__link--hover__link-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(0, 255, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-jump-links__item--m-current__link-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(0, 0, 255)',
    demo: 'basic',
  },

  // Label Variables
  {
    name: '--pf-v6-c-jump-links__label--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '3rem',
    demo: 'with-label',
  },
  {
    name: '--pf-v6-c-jump-links__label--Display',
    defaultValue: 'block',
    resolvedValue: 'block',
    type: 'keyword',
    testValue: 'inline-block',
    demo: 'with-label',
  },

  // Toggle Variables
  {
    name: '--pf-v6-c-jump-links__toggle--MarginBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '2rem',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links--m-expanded__toggle--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '2rem',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__toggle--Display',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'keyword',
    testValue: 'block',
    demo: 'expandable-vertical-with-subsection',
  },

  // Toggle Icon Variables
  {
    name: '--pf-v6-c-jump-links__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__toggle-icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--default, 100ms)',
    resolvedValue: '100ms',
    type: 'time',
    testValue: '500ms',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__toggle-icon--TransitionTimingFunction',
    defaultValue:
      'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links__toggle-icon--Rotate',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'angle',
    testValue: '180deg',
    demo: 'expandable-vertical-with-subsection',
  },
  {
    name: '--pf-v6-c-jump-links--m-expanded__toggle-icon--Rotate',
    defaultValue: '90deg',
    resolvedValue: '90deg',
    type: 'angle',
    testValue: '270deg',
    demo: 'expandable-vertical-with-subsection',
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
          `Demo: ${demo}`,
        ].join('\n'),
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-jump-links/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-jump-links', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-jump-links/test/${demo}`);
        await applyCssOverride(page, 'pfv6-jump-links', name, testValue);
        await waitForFullLoad(page);

        // Take screenshots
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
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
          { threshold: 0 } // Pixel-perfect
        );

        // Attach images to report
        await test.info().attach('React with CSS override (expected)', {
          body: reactBuffer,
          contentType: 'image/png',
        });

        await test.info().attach('Lit with CSS override (actual)', {
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
