import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-expandable-section
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

// CSS variables discovered from component CSS with resolved values
const cssApiTests = [
  {
    name: '--pf-v6-c-expandable-section--Gap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__toggle-icon--MinWidth',
    defaultValue: '1em',
    resolvedValue: '1em',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__toggle-icon--TransitionTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__toggle-icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--default, 100ms)',
    resolvedValue: '100ms',
    type: 'duration',
    testValue: '500ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__toggle-icon--Rotate',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'angle',
    testValue: '45deg',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__toggle-icon--m-expand-top--Rotate',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'angle',
    testValue: '45deg',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-expanded__toggle-icon--Rotate',
    defaultValue: '90deg',
    resolvedValue: '90deg',
    type: 'angle',
    testValue: '180deg',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-expanded__toggle-icon--m-expand-top--Rotate',
    defaultValue: '-90deg',
    resolvedValue: '-90deg',
    type: 'angle',
    testValue: '-180deg',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--TransitionDuration--collapse--slide',
    defaultValue: '0s',
    resolvedValue: '0s',
    type: 'duration',
    testValue: '500ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--TransitionDuration--collapse--fade',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--short, 100ms)',
    resolvedValue: '100ms',
    type: 'duration',
    testValue: '500ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--TransitionDuration--expand--slide',
    defaultValue: '0s',
    resolvedValue: '0s',
    type: 'duration',
    testValue: '500ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--TransitionDuration--expand--fade',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--default, 200ms)',
    resolvedValue: '200ms',
    type: 'duration',
    testValue: '500ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--TransitionTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--Opacity',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '0.5',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--TranslateY',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-expand-top__content--TranslateY',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-expand-bottom__content--TranslateY',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-expanded__content--Opacity',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '0.5',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-expanded__content--TranslateY',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section__content--MaxWidth',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'size',
    testValue: '300px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-limit-width__content--MaxWidth',
    defaultValue: '46.875rem',
    resolvedValue: '46.875rem',
    type: 'size',
    testValue: '300px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--m-expanded--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f2f2f2)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-display-lg--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'disclosure'
  },
  {
    name: '--pf-v6-c-expandable-section--m-indented__content--PaddingInlineStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem) + var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem) + var(--pf-v6-c-expandable-section__toggle-icon--MinWidth))',
    resolvedValue: 'calc(0.5rem + 0.5rem + 1em)',
    type: 'size',
    testValue: '50px',
    demo: 'indented'
  },
  {
    name: '--pf-v6-c-expandable-section--m-truncate__content--LineClamp',
    defaultValue: '3',
    resolvedValue: '3',
    type: 'number',
    testValue: '10',
    demo: 'truncate-expansion'
  },
  {
    name: '--pf-v6-c-expandable-section--m-truncate--Gap',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'truncate-expansion'
  }
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
        await reactPage.goto(`/elements/pfv6-expandable-section/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-expandable-section', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-expandable-section/test/${demo}`);
        await applyCssOverride(page, 'pfv6-expandable-section', name, testValue);
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
