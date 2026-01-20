import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-text-input
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
  // Layout and spacing
  {
    name: '--pf-v6-c-form-control--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--Width',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },

  // Typography
  {
    name: '--pf-v6-c-form-control--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '999',
    demo: 'basic',
  },

  // Background
  {
    name: '--pf-v6-c-form-control--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Border radius
  {
    name: '--pf-v6-c-form-control--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Border - before pseudo-element
  {
    name: '--pf-v6-c-form-control--before--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--before--BorderStyle',
    defaultValue: 'solid',
    resolvedValue: 'solid',
    type: 'keyword',
    testValue: 'dashed',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--before--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Border - after pseudo-element (hover/focus)
  {
    name: '--pf-v6-c-form-control--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--after--BorderStyle',
    defaultValue: 'solid',
    resolvedValue: 'solid',
    type: 'keyword',
    testValue: 'dashed',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--after--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Padding - base
  {
    name: '--pf-v6-c-form-control--inset--base',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--PaddingBlockStart--base',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--PaddingBlockEnd--base',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Outline
  {
    name: '--pf-v6-c-form-control--OutlineOffset',
    defaultValue: '-6px',
    resolvedValue: '-6px',
    type: 'size',
    testValue: '-50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--Resize',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'keyword',
    testValue: 'both',
    demo: 'basic',
  },

  // Hover state
  {
    name: '--pf-v6-c-form-control--hover--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--hover, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--hover--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--hover, #4394e5)',
    resolvedValue: '#4394e5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Expanded state (focus)
  {
    name: '--pf-v6-c-form-control--m-expanded--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--clicked, 2px)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-expanded--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--clicked, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Placeholder
  {
    name: '--pf-v6-c-form-control--m-placeholder--Color',
    defaultValue: 'var(--pf-t--global--text--color--placeholder, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Readonly state
  {
    name: '--pf-v6-c-form-control--m-readonly--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--read-only, #f2f2f2)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'read-only',
  },
  {
    name: '--pf-v6-c-form-control--m-readonly--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--control--read-only, #e0e0e0)',
    resolvedValue: '#e0e0e0',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'read-only',
  },
  {
    name: '--pf-v6-c-form-control--m-readonly--hover--after--BorderColor',
    defaultValue: 'revert',
    resolvedValue: 'revert',
    type: 'keyword',
    testValue: 'rgb(255, 0, 0)',
    demo: 'read-only',
  },

  // Readonly plain variant
  {
    name: '--pf-v6-c-form-control--m-readonly--m-plain--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'read-only',
  },
  {
    name: '--pf-v6-c-form-control--m-readonly--m-plain--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'read-only',
  },
  {
    name: '--pf-v6-c-form-control--m-readonly--m-plain--inset--base',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'read-only',
  },
  {
    name: '--pf-v6-c-form-control--m-readonly--m-plain--OutlineOffset',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'read-only',
  },

  // Icon sizing
  {
    name: '--pf-v6-c-form-control--icon--width',
    defaultValue: 'var(--pf-v6-c-form-control--FontSize)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'custom-icon',
  },

  // Success state
  {
    name: '--pf-v6-c-form-control--m-success--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-success--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-success--hover--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--success--hover, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Warning state
  {
    name: '--pf-v6-c-form-control--m-warning--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-warning--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-warning--hover--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--warning--hover, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Error state
  {
    name: '--pf-v6-c-form-control--m-error--after--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'invalid',
  },
  {
    name: '--pf-v6-c-form-control--m-error--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'invalid',
  },
  {
    name: '--pf-v6-c-form-control--m-error--hover--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--danger--hover, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'invalid',
  },

  // Custom icon
  {
    name: '--pf-v6-c-form-control--m-icon--icon--width',
    defaultValue: 'var(--pf-v6-c-form-control--FontSize)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'custom-icon',
  },
  {
    name: '--pf-v6-c-form-control--m-icon--icon--spacer',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--default, 1rem) / 2)',
    resolvedValue: 'calc(1rem / 2)',
    type: 'size',
    testValue: '50px',
    demo: 'custom-icon',
  },

  // Icon colors
  {
    name: '--pf-v6-c-form-control__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'custom-icon',
  },
  {
    name: '--pf-v6-c-form-control__icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'custom-icon',
  },
  {
    name: '--pf-v6-c-form-control__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'custom-icon',
  },
  {
    name: '--pf-v6-c-form-control--m-success__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-warning__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-form-control--m-error__icon--m-status--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'invalid',
  },

  // Utilities
  {
    name: '--pf-v6-c-form-control__utilities--Gap',
    defaultValue: 'var(--pf-t--global--spacer--gap--group--horizontal, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'custom-icon',
  },

  // Danger jiggle animation
  {
    name: '--pf-v6-danger-jiggle--TranslateX',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'invalid',
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
        await reactPage.goto(`/elements/pfv6-text-input/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-form-control', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-text-input/test/${demo}`);
        await applyCssOverride(page, 'pfv6-text-input', name, testValue);
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
