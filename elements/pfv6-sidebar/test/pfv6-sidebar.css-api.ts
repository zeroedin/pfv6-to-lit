import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-sidebar
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
        : new Promise(resolve => {
          img.addEventListener('load', img.onerror = resolve);
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
  // Base spacing and inset
  {
    name: '--pf-v6-c-sidebar--inset',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Base inset spacing for sidebar',
  },
  {
    name: '--pf-v6-c-sidebar--xl--inset',
    defaultValue: 'var(--pf-t--global--spacer--lg, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'XL breakpoint inset spacing',
  },

  // Border properties
  {
    name: '--pf-v6-c-sidebar--BorderWidth--base',
    defaultValue: 'var(--pf-t--global--border--width--regular, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'border',
    description: 'Base border width',
  },
  {
    name: '--pf-v6-c-sidebar--BorderColor--base',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'border',
    description: 'Base border color',
  },

  // Panel padding properties
  {
    name: '--pf-v6-c-sidebar__panel--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Panel padding block start',
  },
  {
    name: '--pf-v6-c-sidebar__panel--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Panel padding inline end',
  },
  {
    name: '--pf-v6-c-sidebar__panel--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Panel padding block end',
  },
  {
    name: '--pf-v6-c-sidebar__panel--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Panel padding inline start',
  },

  // Panel order
  {
    name: '--pf-v6-c-sidebar__panel--Order',
    defaultValue: '-1',
    resolvedValue: '-1',
    type: 'number',
    testValue: '999',
    demo: 'basic',
    description: 'Panel flex order',
  },

  // Panel padding modifier
  {
    name: '--pf-v6-c-sidebar__panel--m-padding--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-panel',
    description: 'Panel padding modifier block start',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-padding--PaddingInlineEnd',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-panel',
    description: 'Panel padding modifier inline end',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-padding--PaddingBlockEnd',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-panel',
    description: 'Panel padding modifier block end',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-padding--PaddingInlineStart',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-panel',
    description: 'Panel padding modifier inline start',
  },

  // Content padding properties
  {
    name: '--pf-v6-c-sidebar__content--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Content padding block start',
  },
  {
    name: '--pf-v6-c-sidebar__content--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Content padding inline end',
  },
  {
    name: '--pf-v6-c-sidebar__content--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Content padding block end',
  },
  {
    name: '--pf-v6-c-sidebar__content--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Content padding inline start',
  },

  // Content order
  {
    name: '--pf-v6-c-sidebar__content--Order',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'basic',
    description: 'Content flex order',
  },

  // Content padding modifier
  {
    name: '--pf-v6-c-sidebar__content--m-padding--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-content',
    description: 'Content padding modifier block start',
  },
  {
    name: '--pf-v6-c-sidebar__content--m-padding--PaddingInlineEnd',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-content',
    description: 'Content padding modifier inline end',
  },
  {
    name: '--pf-v6-c-sidebar__content--m-padding--PaddingBlockEnd',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-content',
    description: 'Content padding modifier block end',
  },
  {
    name: '--pf-v6-c-sidebar__content--m-padding--PaddingInlineStart',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'padding-content',
    description: 'Content padding modifier inline start',
  },

  // Main flex properties
  {
    name: '--pf-v6-c-sidebar__main--FlexDirection',
    defaultValue: 'column',
    resolvedValue: 'column',
    type: 'keyword',
    testValue: 'row',
    demo: 'basic',
    description: 'Main flex direction',
  },
  {
    name: '--pf-v6-c-sidebar__main--md--FlexDirection',
    defaultValue: 'row',
    resolvedValue: 'row',
    type: 'keyword',
    testValue: 'column',
    demo: 'basic',
    description: 'Main flex direction at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar__main--AlignItems',
    defaultValue: 'stretch',
    resolvedValue: 'stretch',
    type: 'keyword',
    testValue: 'flex-start',
    demo: 'basic',
    description: 'Main align items',
  },
  {
    name: '--pf-v6-c-sidebar__main--md--AlignItems',
    defaultValue: 'flex-start',
    resolvedValue: 'flex-start',
    type: 'keyword',
    testValue: 'stretch',
    demo: 'basic',
    description: 'Main align items at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar__main--child--MarginBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Main child margin block start',
  },

  // Gutter
  {
    name: '--pf-v6-c-sidebar--m-gutter__main--Gap',
    defaultValue: 'var(--pf-v6-c-sidebar--inset)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'panel-right-gutter',
    description: 'Gutter gap',
  },

  // Border modifier
  {
    name: '--pf-v6-c-sidebar__main--m-border--before--Display',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'keyword',
    testValue: 'block',
    demo: 'border',
    description: 'Border before display',
  },
  {
    name: '--pf-v6-c-sidebar__main--m-border--before--md--Display',
    defaultValue: 'block',
    resolvedValue: 'block',
    type: 'keyword',
    testValue: 'none',
    demo: 'border',
    description: 'Border before display at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar__main--m-border--before--BorderWidth',
    defaultValue: 'var(--pf-v6-c-sidebar--BorderWidth--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'border',
    description: 'Border before width',
  },
  {
    name: '--pf-v6-c-sidebar__main--m-border--before--BorderColor',
    defaultValue: 'var(--pf-v6-c-sidebar--BorderColor--base)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'border',
    description: 'Border before color',
  },

  // Panel right modifier
  {
    name: '--pf-v6-c-sidebar--m-panel-right__panel--Order',
    defaultValue: '-1',
    resolvedValue: '-1',
    type: 'number',
    testValue: '999',
    demo: 'panel-right-gutter',
    description: 'Panel right order',
  },
  {
    name: '--pf-v6-c-sidebar--m-panel-right__panel--md--Order',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'panel-right-gutter',
    description: 'Panel right order at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar--m-panel-right__content--md--Order',
    defaultValue: '-1',
    resolvedValue: '-1',
    type: 'number',
    testValue: '999',
    demo: 'panel-right-gutter',
    description: 'Panel right content order at md breakpoint',
  },

  // Stack modifier
  {
    name: '--pf-v6-c-sidebar--m-stack__main--FlexDirection',
    defaultValue: 'column',
    resolvedValue: 'column',
    type: 'keyword',
    testValue: 'row',
    demo: 'stack',
    description: 'Stack main flex direction',
  },
  {
    name: '--pf-v6-c-sidebar--m-stack__main--AlignItems',
    defaultValue: 'stretch',
    resolvedValue: 'stretch',
    type: 'keyword',
    testValue: 'flex-start',
    demo: 'stack',
    description: 'Stack main align items',
  },
  {
    name: '--pf-v6-c-sidebar--m-stack__panel--Position',
    defaultValue: 'sticky',
    resolvedValue: 'sticky',
    type: 'keyword',
    testValue: 'static',
    demo: 'stack',
    description: 'Stack panel position',
  },
  {
    name: '--pf-v6-c-sidebar--m-stack__panel--InsetBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'stack',
    description: 'Stack panel inset block start',
  },
  {
    name: '--pf-v6-c-sidebar--m-stack__panel--BoxShadow',
    defaultValue: 'var(--pf-v6-c-sidebar__panel--BoxShadow--base)',
    resolvedValue: '0px 4px 9px 0px rgb(41 41 41 / 15%)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'stack',
    description: 'Stack panel box shadow',
  },
  {
    name: '--pf-v6-c-sidebar--m-stack__panel--BorderBlockEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '10px',
    demo: 'stack',
    description: 'Stack panel border block end width',
  },
  {
    name: '--pf-v6-c-sidebar--m-stack--m-panel-right__panel--Order',
    defaultValue: '-1',
    resolvedValue: '-1',
    type: 'number',
    testValue: '999',
    demo: 'stack',
    description: 'Stack panel right order',
  },

  // Split modifier
  {
    name: '--pf-v6-c-sidebar--m-split__main--AlignItems',
    defaultValue: 'flex-start',
    resolvedValue: 'flex-start',
    type: 'keyword',
    testValue: 'stretch',
    demo: 'basic',
    description: 'Split main align items',
  },
  {
    name: '--pf-v6-c-sidebar--m-split__main--FlexDirection',
    defaultValue: 'row',
    resolvedValue: 'row',
    type: 'keyword',
    testValue: 'column',
    demo: 'basic',
    description: 'Split main flex direction',
  },
  {
    name: '--pf-v6-c-sidebar--m-split__panel--Position',
    defaultValue: 'static',
    resolvedValue: 'static',
    type: 'keyword',
    testValue: 'sticky',
    demo: 'basic',
    description: 'Split panel position',
  },
  {
    name: '--pf-v6-c-sidebar--m-split__panel--InsetBlockStart',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '50px',
    demo: 'basic',
    description: 'Split panel inset block start',
  },
  {
    name: '--pf-v6-c-sidebar--m-split--m-panel-right__panel--Order',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '999',
    demo: 'basic',
    description: 'Split panel right order',
  },
  {
    name: '--pf-v6-c-sidebar--m-split__main--m-border--before--Display',
    defaultValue: 'block',
    resolvedValue: 'block',
    type: 'keyword',
    testValue: 'none',
    demo: 'border',
    description: 'Split main border before display',
  },

  // Panel properties
  {
    name: '--pf-v6-c-sidebar__panel--FlexBasis--base',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '300px',
    demo: 'basic',
    description: 'Panel flex basis base',
  },
  {
    name: '--pf-v6-c-sidebar__panel--BorderBlockEndColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgb(255 255 255 / 0%)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    description: 'Panel border block end color',
  },
  {
    name: '--pf-v6-c-sidebar__panel--BorderBlockEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
    description: 'Panel border block end width',
  },
  {
    name: '--pf-v6-c-sidebar__panel--BoxShadow--base',
    defaultValue: 'var(--pf-t--global--box-shadow--md--bottom, 0px 4px 9px 0px rgb(41 41 41 / 15%))',
    resolvedValue: '0px 4px 9px 0px rgb(41 41 41 / 15%)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
    description: 'Panel box shadow base',
  },
  {
    name: '--pf-v6-c-sidebar__panel--BoxShadow',
    defaultValue: 'var(--pf-v6-c-sidebar__panel--BoxShadow--base)',
    resolvedValue: '0px 4px 9px 0px rgb(41 41 41 / 15%)',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
    description: 'Panel box shadow',
  },
  {
    name: '--pf-v6-c-sidebar__panel--InsetBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    description: 'Panel inset block start',
  },
  {
    name: '--pf-v6-c-sidebar__panel--md--InsetBlockStart',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '50px',
    demo: 'basic',
    description: 'Panel inset block start at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar__panel--Position',
    defaultValue: 'sticky',
    resolvedValue: 'sticky',
    type: 'keyword',
    testValue: 'static',
    demo: 'basic',
    description: 'Panel position',
  },
  {
    name: '--pf-v6-c-sidebar__panel--md--Position',
    defaultValue: 'static',
    resolvedValue: 'static',
    type: 'keyword',
    testValue: 'sticky',
    demo: 'basic',
    description: 'Panel position at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar__panel--FlexBasis-base',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '300px',
    demo: 'basic',
    description: 'Panel flex basis base (legacy)',
  },
  {
    name: '--pf-v6-c-sidebar__panel--FlexBasis',
    defaultValue: 'var(--pf-v6-c-sidebar__panel--FlexBasis-base)',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '300px',
    demo: 'basic',
    description: 'Panel flex basis',
  },
  {
    name: '--pf-v6-c-sidebar__panel--md--FlexBasis',
    defaultValue: '15.625rem',
    resolvedValue: '15.625rem',
    type: 'size',
    testValue: '300px',
    demo: 'responsive-panel',
    description: 'Panel flex basis at md breakpoint',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-split--FlexBasis',
    defaultValue: '15.625rem',
    resolvedValue: '15.625rem',
    type: 'size',
    testValue: '300px',
    demo: 'basic',
    description: 'Panel flex basis in split mode',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-stack--FlexBasis',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '300px',
    demo: 'stack',
    description: 'Panel flex basis in stack mode',
  },
  {
    name: '--pf-v6-c-sidebar__panel--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'basic',
    description: 'Panel z-index',
  },
  {
    name: '--pf-v6-c-sidebar__panel--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    description: 'Panel background color',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-secondary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f5f5f5)',
    resolvedValue: '#f5f5f5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    description: 'Panel secondary background color',
  },

  // Content properties
  {
    name: '--pf-v6-c-sidebar__content--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    description: 'Content background color',
  },
  {
    name: '--pf-v6-c-sidebar__content--m-secondary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f5f5f5)',
    resolvedValue: '#f5f5f5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    description: 'Content secondary background color',
  },

  // Sticky modifier
  {
    name: '--pf-v6-c-sidebar__panel--m-sticky--InsetBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'sticky-panel',
    description: 'Sticky panel inset block start',
  },
  {
    name: '--pf-v6-c-sidebar__panel--m-sticky--Position',
    defaultValue: 'sticky',
    resolvedValue: 'sticky',
    type: 'keyword',
    testValue: 'static',
    demo: 'sticky-panel',
    description: 'Sticky panel position',
  },
];

test.describe('CSS API Tests - React vs Lit with CSS Overrides', () => {
  cssApiTests.forEach(({ name, defaultValue, resolvedValue, type, testValue, demo, description }) => {
    test(`CSS API: ${name}`, async ({ page, browser }) => {
      // Add metadata to test report
      test.info().annotations.push({
        type: 'css-variable',
        description: [
          `Variable: ${name}`,
          `Description: ${description}`,
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
        await reactPage.goto(`/elements/pfv6-sidebar/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-sidebar', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-sidebar/test/${demo}`);
        await applyCssOverride(page, 'pfv6-sidebar', name, testValue);
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
