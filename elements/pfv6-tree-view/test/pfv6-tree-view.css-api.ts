import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-tree-view
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
const cssApiTests = [
  // Content
  {
    name: '--pf-v6-c-tree-view__content--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'with-icons',
  },

  // Node padding
  {
    name: '--pf-v6-c-tree-view__node--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },

  // Node colors
  {
    name: '--pf-v6-c-tree-view__node--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--BorderRadius',
    defaultValue: 'var(--pf-v6-c-tree-view__content--BorderRadius)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgb(255 255 255 / 0%)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--default, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--hover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--hover, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--m-current--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--clicked, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--m-current--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--m-current--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--clicked, #e0e0e0)',
    resolvedValue: '#e0e0e0',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--hover, #e0e0e0)',
    resolvedValue: '#e0e0e0',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },

  // Node content
  {
    name: '--pf-v6-c-tree-view__node-content--RowGap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },

  // List transitions
  {
    name: '--pf-v6-c-tree-view__list--TransitionDuration--expand--fade',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--default, 200ms)',
    resolvedValue: '200ms',
    type: 'size',
    testValue: '50ms',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__list--TransitionDuration--collapse--fade',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--short, 100ms)',
    resolvedValue: '100ms',
    type: 'size',
    testValue: '50ms',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__list--Opacity',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '0.5',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view--m-expanded__list--Opacity',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '0.5',
    demo: 'with-icons',
  },

  // Toggle
  {
    name: '--pf-v6-c-tree-view__node-toggle--Color',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-toggle--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__list-item--m-expanded__node-toggle--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },

  // Toggle icon
  {
    name: '--pf-v6-c-tree-view__node-toggle-icon--MinWidth',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-toggle--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-toggle--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-toggle--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-toggle--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-toggle-icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--default, 100ms)',
    resolvedValue: '100ms',
    type: 'size',
    testValue: '50ms',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__list-item--m-expanded__node-toggle-icon--Rotate',
    defaultValue: '90deg',
    resolvedValue: '90deg',
    type: 'size',
    testValue: '180deg',
    demo: 'with-icons',
  },

  // Check
  {
    name: '--pf-v6-c-tree-view__node-check--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-checkboxes',
  },

  // Badge
  {
    name: '--pf-v6-c-tree-view__node-count--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-badges',
  },

  // Icon
  {
    name: '--pf-v6-c-tree-view__node-icon--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },
  {
    name: '--pf-v6-c-tree-view__node-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-icons',
  },

  // Text
  {
    name: '--pf-v6-c-tree-view__node-text--max-lines',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'with-icons',
  },

  // Title
  {
    name: '--pf-v6-c-tree-view__node-title--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'with-icons',
  },

  // Action
  {
    name: '--pf-v6-c-tree-view__action--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'with-icons',
  },

  // Guides
  {
    name: '--pf-v6-c-tree-view--m-guides--guide-color--base',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides--guide-width--base',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__list-node--guide-width--base',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__list-item--before--Width',
    defaultValue: 'var(--pf-v6-c-tree-view--m-guides--guide-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__list-item--before--Height',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__list-item--before--BackgroundColor',
    defaultValue: 'var(--pf-v6-c-tree-view--m-guides--guide-color--base)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__list-item--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__node--before--Width',
    defaultValue: '1rem',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__node--before--Height',
    defaultValue: 'var(--pf-v6-c-tree-view--m-guides--guide-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__node--before--InsetBlockStart',
    defaultValue: '1.125rem',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'guides',
  },
  {
    name: '--pf-v6-c-tree-view--m-guides__node--before--BackgroundColor',
    defaultValue: 'var(--pf-v6-c-tree-view--m-guides--guide-color--base)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'guides',
  },

  // Compact
  {
    name: '--pf-v6-c-tree-view--m-compact__node--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '50px',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '50px',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node--nested--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node--nested--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__list-item--BorderBlockEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__list-item--BorderBlockEndColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--nested--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--nested--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--nested--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--nested--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact__node-container--nested--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f2f2f2)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'compact',
  },

  // No background
  {
    name: '--pf-v6-c-tree-view--m-no-background__node-container--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'compact-no-background',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact--m-no-background__node--nested-indent--base',
    defaultValue: 'var(--pf-t--global--spacer--2xl, 3rem)',
    resolvedValue: '3rem',
    type: 'size',
    testValue: '50rem',
    demo: 'compact-no-background',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact--m-no-background__node--nested--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '50px',
    demo: 'compact-no-background',
  },
  {
    name: '--pf-v6-c-tree-view--m-compact--m-no-background__node--nested--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '50px',
    demo: 'compact-no-background',
  },
];

test.describe('CSS API Tests - pfv6-tree-view', () => {
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
        await reactPage.goto(`/elements/pfv6-tree-view/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-tree-view', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-tree-view/test/${demo}`);
        await applyCssOverride(page, 'pfv6-tree-view', name, testValue);
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
