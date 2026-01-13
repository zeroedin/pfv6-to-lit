import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-switch
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

// CSS variables discovered from component CSS with full resolution chain
const cssApiTests = [
  {
    name: '--pf-v6-c-switch--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle-icon--FontSize',
    defaultValue: 'calc(var(--pf-v6-c-switch--FontSize) * 0.625)',
    resolvedValue: 'calc(0.875rem * 0.625)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-brand--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle-icon--InsetInlineStart',
    defaultValue: 'calc(var(--pf-v6-c-switch--FontSize) * 0.4)',
    resolvedValue: 'calc(0.875rem * 0.4)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle-icon--Offset',
    defaultValue: '0.125rem',
    resolvedValue: '0.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__input--disabled__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled'
  },
  {
    name: '--pf-v6-c-switch--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch--Height',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__input--checked__toggle--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'checked-with-label'
  },
  {
    name: '--pf-v6-c-switch__input--checked__toggle--before--TranslateX',
    defaultValue: 'calc(100% + var(--pf-v6-c-switch__toggle-icon--Offset))',
    resolvedValue: 'calc(100% + 0.125rem)',
    type: 'size',
    testValue: '50px',
    demo: 'checked-with-label'
  },
  {
    name: '--pf-v6-c-switch__input--checked__toggle--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'checked-with-label'
  },
  {
    name: '--pf-v6-c-switch__input--checked__toggle--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'checked-with-label'
  },
  {
    name: '--pf-v6-c-switch__input--checked__label--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'checked-with-label'
  },
  {
    name: '--pf-v6-c-switch__input--not-checked__label--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__input--disabled__label--Color',
    defaultValue: 'var(--pf-t--global--text--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled'
  },
  {
    name: '--pf-v6-c-switch__input--disabled__toggle--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled'
  },
  {
    name: '--pf-v6-c-switch__input--disabled__toggle--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled'
  },
  {
    name: '--pf-v6-c-switch__input--checked__toggle--before--BackgroundColor',
    defaultValue: 'var(--pf-t--global--icon--color--inverse, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'checked-with-label'
  },
  {
    name: '--pf-v6-c-switch__input--not-checked__toggle--before--BackgroundColor',
    defaultValue: 'var(--pf-t--global--icon--color--subtle, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__input--disabled__toggle--before--BackgroundColor',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'disabled'
  },
  {
    name: '--pf-v6-c-switch__input--focus__toggle--OutlineWidth',
    defaultValue: 'var(--pf-t--global--border--width--strong, 2px)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__input--focus__toggle--OutlineOffset',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__input--focus__toggle--OutlineColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--Height',
    defaultValue: 'calc(var(--pf-v6-c-switch--FontSize) * var(--pf-v6-c-switch--LineHeight))',
    resolvedValue: 'calc(0.875rem * 1.5)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--pill, 999px)',
    resolvedValue: '999px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--Width',
    defaultValue: 'calc(var(--pf-v6-c-switch--FontSize) - var(--pf-v6-c-switch__toggle-icon--Offset))',
    resolvedValue: 'calc(0.875rem - 0.125rem)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--Height',
    defaultValue: 'var(--pf-v6-c-switch__toggle--before--Width)',
    resolvedValue: 'calc(0.875rem - 0.125rem)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--InsetInlineStart',
    defaultValue: 'calc((var(--pf-v6-c-switch__toggle--Height) - var(--pf-v6-c-switch__toggle--before--Height)) / 2)',
    resolvedValue: 'calc((calc(0.875rem * 1.5) - calc(0.875rem - 0.125rem)) / 2)',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--large, 24px)',
    resolvedValue: '24px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--TransitionTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--default, cubic-bezier(0.4, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--md, 200ms)',
    resolvedValue: '200ms',
    type: 'duration',
    testValue: '5000ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--before--Transition',
    defaultValue: 'transform var(--pf-v6-c-switch__toggle--before--TransitionTimingFunction) var(--pf-v6-c-switch__toggle--before--TransitionDuration), background-color var(--pf-v6-c-switch__toggle--before--TransitionTimingFunction) var(--pf-v6-c-switch__toggle--before--TransitionDuration)',
    resolvedValue: 'transform cubic-bezier(0.4, 0, 0.2, 1) 200ms, background-color cubic-bezier(0.4, 0, 0.2, 1) 200ms',
    type: 'transition',
    testValue: 'transform linear 5000ms, background-color linear 5000ms',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-switch__toggle--Width',
    defaultValue: 'calc(var(--pf-v6-c-switch__toggle--Height) + var(--pf-v6-c-switch__toggle-icon--Offset) + var(--pf-v6-c-switch__toggle--before--Width))',
    resolvedValue: 'calc(calc(0.875rem * 1.5) + 0.125rem + calc(0.875rem - 0.125rem))',
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
          `Test value: ${testValue}`
        ].join('\n')
      });

      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Open second page for React
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });

      try {
        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-switch/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-switch', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-switch/test/${demo}`);
        await applyCssOverride(page, 'pfv6-switch', name, testValue);
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
