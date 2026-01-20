import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-icon
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
  // Container sizes - default
  {
    name: '--pf-v6-c-icon--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-icon--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Standalone icon sizes
  {
    name: '--pf-v6-c-icon--m-sm--Width',
    defaultValue: 'var(--pf-t--global--icon--size--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-sm--Height',
    defaultValue: 'var(--pf-t--global--icon--size--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-md--Width',
    defaultValue: 'var(--pf-t--global--icon--size--md, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-md--Height',
    defaultValue: 'var(--pf-t--global--icon--size--md, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-lg--Width',
    defaultValue: 'var(--pf-t--global--icon--size--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-lg--Height',
    defaultValue: 'var(--pf-t--global--icon--size--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-xl--Width',
    defaultValue: 'var(--pf-t--global--icon--size--xl, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-xl--Height',
    defaultValue: 'var(--pf-t--global--icon--size--xl, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-2xl--Width',
    defaultValue: 'var(--pf-t--global--icon--size--2xl, 3.5rem)',
    resolvedValue: '3.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-2xl--Height',
    defaultValue: 'var(--pf-t--global--icon--size--2xl, 3.5rem)',
    resolvedValue: '3.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-3xl--Width',
    defaultValue: 'var(--pf-t--global--icon--size--3xl, 6rem)',
    resolvedValue: '6rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-3xl--Height',
    defaultValue: 'var(--pf-t--global--icon--size--3xl, 6rem)',
    resolvedValue: '6rem',
    type: 'size',
    testValue: '50rem',
    demo: 'standalone-icon-sizes',
  },

  // Body sizes
  {
    name: '--pf-v6-c-icon--m-body-sm--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'body-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-sm--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'body-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-default--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'body-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-default--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'body-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-lg--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--lg, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'body-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-lg--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--lg, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'body-icon-sizes',
  },

  // Heading sizes
  {
    name: '--pf-v6-c-icon--m-heading-sm--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h6, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-sm--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h6, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-md--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h5, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-md--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h5, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-lg--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h4, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-lg--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h4, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-xl--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h3, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-xl--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h3, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-2xl--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h2, 1.75rem)',
    resolvedValue: '1.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-2xl--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h2, 1.75rem)',
    resolvedValue: '1.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-3xl--Width',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h1, 2.25rem)',
    resolvedValue: '2.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-3xl--Height',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h1, 2.25rem)',
    resolvedValue: '2.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'heading-icon-sizes',
  },

  // Inline sizes
  {
    name: '--pf-v6-c-icon--m-inline--Width',
    defaultValue: '1em',
    resolvedValue: '1em',
    type: 'size',
    testValue: '5em',
    demo: 'inline',
  },
  {
    name: '--pf-v6-c-icon--m-inline--Height',
    defaultValue: '1em',
    resolvedValue: '1em',
    type: 'size',
    testValue: '5em',
    demo: 'inline',
  },

  // Content SVG vertical alignment
  {
    name: '--pf-v6-c-icon__content--svg--VerticalAlign',
    defaultValue: '-0.125em',
    resolvedValue: '-0.125em',
    type: 'size',
    testValue: '5em',
    demo: 'basic',
  },

  // Content colors
  {
    name: '--pf-v6-c-icon__content--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-icon__content--m-danger--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status',
  },
  {
    name: '--pf-v6-c-icon__content--m-warning--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status',
  },
  {
    name: '--pf-v6-c-icon__content--m-success--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status',
  },
  {
    name: '--pf-v6-c-icon__content--m-info--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--info--default, #5e40be)',
    resolvedValue: '#5e40be',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status',
  },
  {
    name: '--pf-v6-c-icon__content--m-custom--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--custom--default, #147878)',
    resolvedValue: '#147878',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'status',
  },
  {
    name: '--pf-v6-c-icon--m-inline__content--Color',
    defaultValue: 'initial',
    resolvedValue: 'initial',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'inline',
  },

  // Content font sizes
  {
    name: '--pf-v6-c-icon__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Standalone content sizes
  {
    name: '--pf-v6-c-icon--m-sm__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--sm, 0.75rem)',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-md__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--md, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-lg__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-xl__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--xl, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-2xl__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--2xl, 3.5rem)',
    resolvedValue: '3.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-3xl__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--3xl, 6rem)',
    resolvedValue: '6rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },

  // Body content sizes
  {
    name: '--pf-v6-c-icon--m-body-sm__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-default__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-body-lg__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },

  // Heading content sizes
  {
    name: '--pf-v6-c-icon--m-heading-sm__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h6, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-md__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h5, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-lg__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h4, 1.125rem)',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-xl__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h3, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-2xl__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h2, 1.75rem)',
    resolvedValue: '1.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },
  {
    name: '--pf-v6-c-icon--m-heading-3xl__content--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--heading--h1, 2.25rem)',
    resolvedValue: '2.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'content-sizes',
  },

  // Inline content size
  {
    name: '--pf-v6-c-icon--m-inline__content--FontSize',
    defaultValue: '1em',
    resolvedValue: '1em',
    type: 'size',
    testValue: '5em',
    demo: 'inline',
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
        await reactPage.goto(`/elements/pfv6-icon/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-icon', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-icon/demo/${demo}`);
        await applyCssOverride(page, 'pfv6-icon', name, testValue);
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
