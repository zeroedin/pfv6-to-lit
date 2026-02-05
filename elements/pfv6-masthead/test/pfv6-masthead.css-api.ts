import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-masthead
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
  {
    name: '--pf-v6-c-masthead--RowGap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--gutter--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--PaddingBlock',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--PaddingInline',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f0f0f0)',
    resolvedValue: '#f0f0f0',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__main--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__main--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--inset--page-chrome, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__logo--MaxHeight',
    defaultValue: '2.375rem',
    resolvedValue: '2.375rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__logo--Width',
    defaultValue: '11.8125rem',
    resolvedValue: '11.8125rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__toggle--Size',
    defaultValue: 'var(--pf-t--global--icon--size--xl, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__content--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--gutter--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack--GridTemplateColumns',
    defaultValue: 'max-content 1fr',
    resolvedValue: 'max-content 1fr',
    type: 'unknown',
    testValue: '50px 50px',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__brand--GridColumn',
    defaultValue: '-1 / 1',
    resolvedValue: '-1 / 1',
    type: 'unknown',
    testValue: '1 / 2',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__brand--Order',
    defaultValue: '-1',
    resolvedValue: '-1',
    type: 'number',
    testValue: '999',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__brand--PaddingBlockEnd',
    defaultValue: 'var(--pf-v6-c-masthead--RowGap)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__brand--BorderBlockEnd',
    defaultValue: 'var(--pf-v6-c-masthead--BorderWidth) solid var(--pf-v6-c-masthead--BorderColor)',
    resolvedValue: '1px solid #c7c7c7',
    type: 'border',
    testValue: '10px solid rgb(255, 0, 0)',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__content--GridColumn',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__content--Order',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__main--toggle--content--GridColumn',
    defaultValue: '2',
    resolvedValue: '2',
    type: 'number',
    testValue: '999',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__main--Display',
    defaultValue: 'contents',
    resolvedValue: 'contents',
    type: 'unknown',
    testValue: 'block',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-stack__main--ColumnGap',
    defaultValue: 'unset',
    resolvedValue: 'unset',
    type: 'unknown',
    testValue: '50px',
    demo: 'display-stack',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline--ColumnGap',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline--GridTemplateColumns',
    defaultValue: 'min-content 1fr',
    resolvedValue: 'min-content 1fr',
    type: 'unknown',
    testValue: '50px 50px',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline--breakpoint--xl--GridTemplateColumns',
    defaultValue: 'subgrid',
    resolvedValue: 'subgrid',
    type: 'unknown',
    testValue: '50px 50px',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__brand--GridColumn',
    defaultValue: 'initial',
    resolvedValue: 'initial',
    type: 'unknown',
    testValue: '1 / 2',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__brand--Order',
    defaultValue: 'initial',
    resolvedValue: 'initial',
    type: 'unknown',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__brand--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__brand--BorderBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__main--GridColumn',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__content--GridColumn',
    defaultValue: '2',
    resolvedValue: '2',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__content--Order',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__main--toggle--content--GridColumn',
    defaultValue: '2',
    resolvedValue: '2',
    type: 'number',
    testValue: '999',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__main--Display',
    defaultValue: 'flex',
    resolvedValue: 'flex',
    type: 'unknown',
    testValue: 'block',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead--m-display-inline__main--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'display-inline',
  },
  {
    name: '--pf-v6-c-masthead__expandable-content--BoxShadow',
    defaultValue: 'var(--pf-t--global--box-shadow--md--bottom, '
      + '0 0.625rem 0.5625rem -0.5rem rgb(41 41 41 / 15%))',
    resolvedValue: '0 0.625rem 0.5625rem -0.5rem rgb(41 41 41 / 15%)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead__expandable-content--BorderBlockStart',
    defaultValue: 'var(--pf-v6-c-masthead--BorderWidth) solid var(--pf-v6-c-masthead--BorderColor)',
    resolvedValue: '1px solid #c7c7c7',
    type: 'border',
    testValue: '10px solid rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--c-toolbar--Width',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-masthead--c-toolbar--PaddingBlock',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
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
        await reactPage.goto(`/elements/pfv6-masthead/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-masthead', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-masthead/test/${demo}`);
        await applyCssOverride(page, 'pfv6-masthead', name, testValue);
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
