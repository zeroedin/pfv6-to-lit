import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-toggle-group
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

// CSS variables discovered from component CSS with full resolution chains
const cssApiTests = [
  // Compact modifier variables (from pfv6-toggle-group.css)
  {
    name: '--pf-v6-c-toggle-group--m-compact__button--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-toggle-group--m-compact__button--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-toggle-group--m-compact__button--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-toggle-group--m-compact__button--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-toggle-group--m-compact__button--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },

  // Button variables (from pfv6-toggle-group-item.css)
  {
    name: '--pf-v6-c-toggle-group__button--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--BackgroundColor',
    defaultValue:
      'var(--pf-t--global--background--color--action--plain--default, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgb(255 255 255 / 0%)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--ZIndex',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },

  // Hover state variables
  {
    name: '--pf-v6-c-toggle-group__button--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--hover, #f2f2f2)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--hover--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--hover--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--hover--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0)',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },

  // Border variables
  {
    name: '--pf-v6-c-toggle-group__button--before--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },

  // Selected state variables
  {
    name: '--pf-v6-c-toggle-group__button--m-selected--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--m-selected--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-brand--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--m-selected--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--clicked, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--m-selected-selected--before--BorderInlineStartColor',
    defaultValue: 'var(--pf-t--global--border--color--alt, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-multiple',
  },
  {
    name: '--pf-v6-c-toggle-group__button--m-selected--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--m-selected--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--strong, 0)',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },

  // Disabled state variables
  {
    name: '--pf-v6-c-toggle-group__button--disabled--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--disabled--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--disabled-disabled--before--BorderInlineStartColor',
    defaultValue: 'var(--pf-t--global--border--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'default-single',
  },
  {
    name: '--pf-v6-c-toggle-group__button--disabled--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'default-single',
  },

  // Icon/text spacing
  {
    name: '--pf-v6-c-toggle-group__icon--text--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'text-icon',
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
        await reactPage.goto(`/elements/pfv6-toggle-group/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-toggle-group', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-toggle-group/test/${demo}`);
        await applyCssOverride(page, 'pfv6-toggle-group', name, testValue);
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
