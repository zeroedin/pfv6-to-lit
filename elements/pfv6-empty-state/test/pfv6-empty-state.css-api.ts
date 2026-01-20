import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-empty-state
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

// CSS variables discovered from component CSS
const cssApiTests = [
  // Padding variables
  {
    name: '--pf-v6-c-empty-state--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },

  // Content max-width variables
  {
    name: '--pf-v6-c-empty-state__content--MaxWidth',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'size',
    testValue: '500px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs__content--MaxWidth',
    defaultValue: '21.875rem',
    resolvedValue: '21.875rem',
    type: 'size',
    testValue: '500px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-sm__content--MaxWidth',
    defaultValue: '25rem',
    resolvedValue: '25rem',
    type: 'size',
    testValue: '500px',
    demo: 'small'
  },
  {
    name: '--pf-v6-c-empty-state--m-lg__content--MaxWidth',
    defaultValue: '37.5rem',
    resolvedValue: '37.5rem',
    type: 'size',
    testValue: '500px',
    demo: 'large'
  },

  // Icon variables
  {
    name: '--pf-v6-c-empty-state__icon--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--2xl, 3.5rem)',
    resolvedValue: '3.5rem',
    type: 'size',
    testValue: '100px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs__icon--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xl__icon--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-large'
  },
  {
    name: '--pf-v6-c-empty-state--m-xl__icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--3xl, 6rem)',
    resolvedValue: '6rem',
    type: 'size',
    testValue: '150px',
    demo: 'extra-large'
  },

  // Status variant icon colors
  {
    name: '--pf-v6-c-empty-state--m-danger__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status'
  },
  {
    name: '--pf-v6-c-empty-state--m-warning__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status'
  },
  {
    name: '--pf-v6-c-empty-state--m-success__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status'
  },
  {
    name: '--pf-v6-c-empty-state--m-info__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--info--default, #5e40be)',
    resolvedValue: '#5e40be',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status'
  },
  {
    name: '--pf-v6-c-empty-state--m-custom__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--custom--default, #147878)',
    resolvedValue: '#147878',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'with-status'
  },

  // Title text variables
  {
    name: '--pf-v6-c-empty-state__title-text--FontFamily',
    defaultValue: 'var(--pf-t--global--font--family--heading, "Red Hat Display", Helvetica, Arial, sans-serif)',
    resolvedValue: '"Red Hat Display", "RedHatDisplay", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans JP", "Noto Sans KR", "Noto Sans Malayalam", "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", Helvetica, Arial, sans-serif',
    type: 'font-family',
    testValue: 'monospace',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__title-text--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--heading--md, 1.25rem)',
    resolvedValue: '1.25rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__title-text--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--heading--default, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__title-text--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--heading, 1.3)',
    resolvedValue: '1.3',
    type: 'number',
    testValue: '3',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs__title-text--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--heading--xs, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xl__title-text--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--heading--2xl, 2.25rem)',
    resolvedValue: '2.25rem',
    type: 'size',
    testValue: '60px',
    demo: 'extra-large'
  },
  {
    name: '--pf-v6-c-empty-state--m-xl__title-text--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--heading, 1.3)',
    resolvedValue: '1.3',
    type: 'number',
    testValue: '3',
    demo: 'extra-large'
  },

  // Body variables
  {
    name: '--pf-v6-c-empty-state__body--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__body--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--body--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs__body--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs__body--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },
  {
    name: '--pf-v6-c-empty-state--m-xl__body--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-large'
  },
  {
    name: '--pf-v6-c-empty-state--m-xl__body--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-large'
  },

  // Footer variables
  {
    name: '--pf-v6-c-empty-state__footer--RowGap',
    defaultValue: 'var(--pf-t--global--spacer--gap--group-to-group--vertical--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__footer--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state--m-xs__footer--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'extra-small'
  },

  // Actions variables
  {
    name: '--pf-v6-c-empty-state__actions--RowGap',
    defaultValue: 'var(--pf-t--global--spacer--gap--group--vertical, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-empty-state__actions--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--gap--action-to-action--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
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
        await reactPage.goto(`/elements/pfv6-empty-state/react/demo/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-empty-state', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-empty-state/demo/${demo}`);
        await applyCssOverride(page, 'pfv6-empty-state', name, testValue);
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
