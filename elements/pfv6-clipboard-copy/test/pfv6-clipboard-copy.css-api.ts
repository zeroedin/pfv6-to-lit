import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-clipboard-copy
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
  // Toggle icon
  {
    name: '--pf-v6-c-clipboard-copy__toggle-icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--default, 100ms)',
    resolvedValue: '100ms',
    type: 'duration',
    testValue: '500ms',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__toggle-icon--TransitionTimingFunction',
    defaultValue:
      'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy--m-expanded__toggle-icon--Rotate',
    defaultValue: '90deg',
    resolvedValue: '90deg',
    type: 'angle',
    testValue: '180deg',
    demo: 'expanded',
  },

  // Expandable content - spacing
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'expanded',
  },

  // Expandable content - appearance
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BorderBlockStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BorderInlineEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BorderBlockEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BorderInlineStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--OutlineOffset',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'expanded',
  },
  {
    name: '--pf-v6-c-clipboard-copy__expandable-content--BoxShadow',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'expanded',
  },

  // Group
  {
    name: '--pf-v6-c-clipboard-copy__group--Gap',
    defaultValue: 'var(--pf-t--global--spacer--gap--control-to-control--default, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Inline
  {
    name: '--pf-v6-c-clipboard-copy--m-inline--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'inline-compact',
  },
  {
    name: '--pf-v6-c-clipboard-copy--m-inline--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'inline-compact',
  },
  {
    name: '--pf-v6-c-clipboard-copy--m-inline--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f2f2f2)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'inline-compact',
  },

  // Actions
  {
    name: '--pf-v6-c-clipboard-copy__actions--Gap',
    defaultValue: 'var(--pf-t--global--spacer--gap--action-to-action--plain, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'inline-compact-with-additional-action',
  },
  {
    name: '--pf-v6-c-clipboard-copy__actions--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--compact, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-clipboard-copy__actions-item--button--Color',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-clipboard-copy__actions-item--button--hover--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Text
  {
    name: '--pf-v6-c-clipboard-copy__text--m-code--FontFamily',
    defaultValue:
      // eslint-disable-next-line @stylistic/max-len
      'var(--pf-t--global--font--family--mono, "Red Hat Mono", "RedHatMono", "Courier New", Courier, monospace)',
    resolvedValue: '"Red Hat Mono", "RedHatMono", "Courier New", Courier, monospace',
    type: 'font-family',
    testValue: 'serif',
    demo: 'inline-compact-code',
  },
  {
    name: '--pf-v6-c-clipboard-copy__text--m-code--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'inline-compact-code',
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
        await reactPage.goto(`/elements/pfv6-clipboard-copy/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-clipboard-copy', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-clipboard-copy/test/${demo}`);
        await applyCssOverride(page, 'pfv6-clipboard-copy', name, testValue);
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
