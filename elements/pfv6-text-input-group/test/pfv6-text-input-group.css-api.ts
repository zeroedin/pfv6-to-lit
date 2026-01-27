/* eslint-disable @stylistic/max-len -- PatternFly CSS variable names */
import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-text-input-group
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

// CSS variables discovered from component CSS with full resolution chain
const cssApiTests = [
  // Background color
  {
    name: '--pf-v6-c-text-input-group--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Border properties
  {
    name: '--pf-v6-c-text-input-group--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },

  // Status border colors - success
  {
    name: '--pf-v6-c-text-input-group--m-success--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },

  // Status border colors - warning
  {
    name: '--pf-v6-c-text-input-group--m-warning--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },

  // Status border colors - error
  {
    name: '--pf-v6-c-text-input-group--m-error--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },

  // Typography
  {
    name: '--pf-v6-c-text-input-group__LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '999',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Hover state border colors
  {
    name: '--pf-v6-c-text-input-group--m-hover--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--hover, #4394e5)',
    resolvedValue: '#4394e5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group--m-hover--m-success--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--success--hover, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group--m-hover--m-warning--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--warning--hover, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group--m-hover--m-error--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--danger--hover, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },

  // Main element spacing
  {
    name: '--pf-v6-c-text-input-group__main--first-child--not--text-input--MarginInlineStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--plain, 0.5rem) / 2)',
    resolvedValue: 'calc(0.5rem / 2)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__main--m-icon__text-input--PaddingInlineStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--default, 1rem) + var(--pf-v6-c-text-input-group__icon--FontSize) + var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem))',
    resolvedValue: 'calc(1rem + 0.875rem + 0.5rem)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group--status__text-input--PaddingInlineEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--default, 1rem) + var(--pf-v6-c-text-input-group__icon--FontSize) + var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem))',
    resolvedValue: 'calc(1rem + 0.875rem + 0.5rem)',
    type: 'size',
    testValue: '50px',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group--utilities--status__text-input--PaddingInlineEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--sm, 0.5rem) + var(--pf-v6-c-text-input-group__icon--FontSize) + var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem))',
    resolvedValue: 'calc(0.5rem + 0.875rem + 0.5rem)',
    type: 'size',
    testValue: '50px',
    demo: 'utilities-and-icon',
  },

  // Main element gaps
  {
    name: '--pf-v6-c-text-input-group__main--RowGap',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__main--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Border radius properties
  {
    name: '--pf-v6-c-text-input-group__text--BorderRadius--base',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text--BorderStartStartRadius',
    defaultValue: 'var(--pf-v6-c-text-input-group__text--BorderRadius--base)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text--BorderStartEndRadius',
    defaultValue: 'var(--pf-v6-c-text-input-group__text--BorderRadius--base)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text--BorderEndEndRadius',
    defaultValue: 'var(--pf-v6-c-text-input-group__text--BorderRadius--base)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text--BorderEndStartRadius',
    defaultValue: 'var(--pf-v6-c-text-input-group__text--BorderRadius--base)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Label group padding
  {
    name: '--pf-v6-c-text-input-group--c-label-group__main--PaddingBlockStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--vertical--default, 0.5rem) / 2)',
    resolvedValue: 'calc(0.5rem / 2)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group--c-label-group__main--PaddingInlineEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--plain, 0.5rem) / 2)',
    resolvedValue: 'calc(0.5rem / 2)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group--c-label-group__main--PaddingBlockEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--vertical--default, 0.5rem) / 2)',
    resolvedValue: 'calc(0.5rem / 2)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Text input padding
  {
    name: '--pf-v6-c-text-input-group__text-input--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text-input--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text-input--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text-input--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Text input sizing
  {
    name: '--pf-v6-c-text-input-group__text-input--MinWidth',
    defaultValue: '12ch',
    resolvedValue: '12ch',
    type: 'size',
    testValue: '50ch',
    demo: 'basic',
  },

  // Text input colors
  {
    name: '--pf-v6-c-text-input-group__text-input--m-hint--Color',
    defaultValue: 'var(--pf-t--global--text--color--placeholder, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text-input--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text-input--placeholder--Color',
    defaultValue: 'var(--pf-t--global--text--color--placeholder, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__text-input--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Text input outline
  {
    name: '--pf-v6-c-text-input-group__text-input--OutlineOffset',
    defaultValue: '-6px',
    resolvedValue: '-6px',
    type: 'size',
    testValue: '-50px',
    demo: 'basic',
  },

  // Icon properties
  {
    name: '--pf-v6-c-text-input-group__icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__icon--InsetInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group__icon--m-status--InsetInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group--utilities--icon--m-status--InsetInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'utilities-and-icon',
  },

  // Icon colors
  {
    name: '--pf-v6-c-text-input-group__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-text-input-group--m-disabled__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled',
  },
  {
    name: '--pf-v6-c-text-input-group__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group--m-disabled__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled',
  },
  {
    name: '--pf-v6-c-text-input-group__main--m-success__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group__main--m-warning__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },
  {
    name: '--pf-v6-c-text-input-group__main--m-error__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status',
  },

  // Icon transform
  {
    name: '--pf-v6-c-text-input-group__icon--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '-100%',
    demo: 'basic',
  },

  // Utilities spacing
  {
    name: '--pf-v6-c-text-input-group__utilities--child--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'utilities-and-icon',
  },

  // Disabled state
  {
    name: '--pf-v6-c-text-input-group--m-disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled',
  },
  {
    name: '--pf-v6-c-text-input-group--m-disabled--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled',
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
        await reactPage.goto(`/elements/pfv6-text-input-group/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-text-input-group', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-text-input-group/test/${demo}`);
        await applyCssOverride(page, 'pfv6-text-input-group', name, testValue);
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
