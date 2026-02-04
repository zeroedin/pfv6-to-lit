import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-popover
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

// CSS variables discovered from component CSS
// Resolution chain traced through tokens to final values
const cssApiTests = [
  // Component level
  {
    name: '--pf-v6-c-popover--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover--MinWidth',
    defaultValue: 'calc(var(--pf-v6-c-popover__content--PaddingInlineStart) + '
      + 'var(--pf-v6-c-popover__content--PaddingInlineEnd) + 18.75rem)',
    resolvedValue: 'calc(1rem + 1rem + 18.75rem)',
    type: 'size',
    testValue: '100rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover--MaxWidth',
    defaultValue: 'calc(var(--pf-v6-c-popover__content--PaddingInlineStart) + '
      + 'var(--pf-v6-c-popover__content--PaddingInlineEnd) + 18.75rem)',
    resolvedValue: 'calc(1rem + 1rem + 18.75rem)',
    type: 'size',
    testValue: '100rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--md)',
    resolvedValue: '0px 4px 9px 0px rgba(41, 41, 41, 0.15)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Alert severity variants
  {
    name: '--pf-v6-c-popover--m-danger__title-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'alert',
  },
  {
    name: '--pf-v6-c-popover--m-warning__title-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'alert',
  },
  {
    name: '--pf-v6-c-popover--m-success__title-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'alert',
  },
  {
    name: '--pf-v6-c-popover--m-info__title-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--info--default)',
    resolvedValue: '#5e40be',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'alert',
  },
  {
    name: '--pf-v6-c-popover--m-custom__title-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--custom--default)',
    resolvedValue: '#147878',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'alert',
  },

  // Content
  {
    name: '--pf-v6-c-popover__content--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--floating--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__content--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__content--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__content--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__content--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__content--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Arrow
  {
    name: '--pf-v6-c-popover__arrow--Width',
    defaultValue: '0.9375rem',
    resolvedValue: '0.9375rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--Height',
    defaultValue: '0.9375rem',
    resolvedValue: '0.9375rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--md)',
    resolvedValue: '0px 4px 9px 0px rgba(41, 41, 41, 0.15)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--floating--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-top--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-top--TranslateY',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-top--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-right--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-right--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-right--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-bottom--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-bottom--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-bottom--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-left--TranslateX',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-left--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-left--Rotate',
    defaultValue: '45deg',
    resolvedValue: '45deg',
    type: 'angle',
    testValue: '90deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-inline-top--InsetBlockStart',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-inline-bottom--InsetBlockEnd',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-block-left--InsetInlineStart',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__arrow--m-block-right--InsetInlineEnd',
    defaultValue: 'var(--pf-t--global--border--radius--medium, 16px)',
    resolvedValue: '16px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Close button
  {
    name: '--pf-v6-c-popover__close--InsetBlockStart',
    defaultValue: 'calc(var(--pf-v6-c-popover__content--PaddingBlockStart) - '
      + 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem))',
    resolvedValue: 'calc(1rem - 0.5rem)',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__close--InsetInlineEnd',
    defaultValue: 'var(--pf-v6-c-popover__content--PaddingInlineEnd)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__close--sibling--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--2xl, 3rem)',
    resolvedValue: '3rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Header
  {
    name: '--pf-v6-c-popover__header--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Title
  {
    name: '--pf-v6-c-popover__title-text--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__title-text--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__title-text--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-popover__title-icon--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icon-in-the-title',
  },
  {
    name: '--pf-v6-c-popover__title-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icon-in-the-title',
  },
  {
    name: '--pf-v6-c-popover__title-icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icon-in-the-title',
  },

  // Footer
  {
    name: '--pf-v6-c-popover__footer--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
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
        ].join('\n'),
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-popover/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-popover', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-popover/test/${demo}`);
        await applyCssOverride(page, 'pfv6-popover', name, testValue);
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
