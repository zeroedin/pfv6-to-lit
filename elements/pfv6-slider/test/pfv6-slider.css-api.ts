import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-slider
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
  {
    name: '--pf-v6-c-slider--value',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--Height',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--base--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--nonstatus--gray--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--fill--BackgroundColor',
    defaultValue: 'var(--pf-t--global--border--color--hover, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--tiny, 4px)',
    resolvedValue: '4px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--fill--BackgroundColor--gradient-stop',
    defaultValue: 'var(--pf-v6-c-slider--value)',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__steps--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--InsetBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--Width',
    defaultValue: '0.15rem',
    resolvedValue: '0.15rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--Height',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--BackgroundColor',
    defaultValue: 'var(--pf-t--global--icon--color--nonstatus--on-gray--default, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-tick--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--sharp, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step--m-active__slider-tick--BackgroundColor',
    defaultValue: 'var(--pf-t--global--icon--color--on-brand--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step--first-child__step-tick--TranslateX',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step--last-child__step-tick--TranslateX',
    defaultValue: '-100%',
    resolvedValue: '-100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-label--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step-label--InsetBlockStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--xl, 2rem) + var(--pf-v6-c-slider__rail-track--Height))',
    resolvedValue: 'calc(2rem + 0.25rem)',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step--first-child__step-label--TranslateX',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__step--last-child__step-label--TranslateX',
    defaultValue: '-100%',
    resolvedValue: '-100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--InsetBlockStart',
    defaultValue: 'calc(var(--pf-v6-c-slider__rail-track--Height) / 2 + var(--pf-t--global--spacer--md, 1rem))',
    resolvedValue: 'calc(0.25rem / 2 + 1rem)',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--Width',
    defaultValue: '1rem',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--Height',
    defaultValue: '1rem',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--InsetInlineStart',
    defaultValue: 'var(--pf-v6-c-slider--value)',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--high-contrast--regular, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--large, 24px)',
    resolvedValue: '24px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--BoxShadow--base',
    defaultValue: '0 0 0 2px var(--pf-t--global--background--color--primary--default, #ffffff), 0 0 0 3px var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '0 0 0 2px #ffffff, 0 0 0 3px #0066cc',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--hover--BoxShadow',
    defaultValue: 'var(--pf-v6-c-slider__thumb--BoxShadow--base)',
    resolvedValue: '0 0 0 2px #ffffff, 0 0 0 3px #0066cc',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--focus--BoxShadow',
    defaultValue: 'var(--pf-v6-c-slider__thumb--BoxShadow--base)',
    resolvedValue: '0 0 0 2px #ffffff, 0 0 0 3px #0066cc',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--active--BoxShadow',
    defaultValue: 'var(--pf-v6-c-slider__thumb--BoxShadow--base), 0 0 2px 5px var(--pf-t--global--color--nonstatus--blue--clicked, #92c5f9)',
    resolvedValue: '0 0 0 2px #ffffff, 0 0 0 3px #0066cc, 0 0 2px 5px #92c5f9',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--before--Width',
    defaultValue: '44px',
    resolvedValue: '44px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--before--Height',
    defaultValue: 'var(--pf-v6-c-slider__thumb--before--Width)',
    resolvedValue: '44px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--before--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--large, 24px)',
    resolvedValue: '24px',
    type: 'size',
    testValue: '50px',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--before--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__thumb--before--TranslateY',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--c-form-control--width-base',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--default, 1rem) + var(--pf-t--global--spacer--control--horizontal--default, 1rem) + 1.25rem)',
    resolvedValue: 'calc(1rem + 1rem + 1.25rem)',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--c-form-control--width-chars',
    defaultValue: '3',
    resolvedValue: '3',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--c-form-control--Width',
    defaultValue: 'calc(var(--pf-v6-c-slider__value--c-form-control--width-base) + var(--pf-v6-c-slider__value--c-form-control--width-chars) * 1ch)',
    resolvedValue: 'calc(calc(1rem + 1rem + 1.25rem) + 3 * 1ch)',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--m-floating--TranslateX',
    defaultValue: '-50%',
    resolvedValue: '-50%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--m-floating--TranslateY',
    defaultValue: '-100%',
    resolvedValue: '-100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--m-floating--InsetInlineStart',
    defaultValue: 'var(--pf-v6-c-slider--value)',
    resolvedValue: '0',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__value--m-floating--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--sm, 200)',
    resolvedValue: '200',
    type: 'number',
    testValue: '999',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__actions--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__main--actions--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider--m-disabled__rail-track--before--fill--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider--m-disabled__step--m-active__slider-tick--BackgroundColor',
    defaultValue: 'var(--pf-t--global--icon--color--disabled, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider--m-disabled__thumb--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic'
  },
  {
    name: '--pf-v6-c-slider__rail-track--before--fill--direction',
    defaultValue: 'right',
    resolvedValue: 'right',
    type: 'unknown',
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
        await reactPage.goto(`/elements/pfv6-slider/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-slider', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-slider/test/${demo}`);
        await applyCssOverride(page, 'pfv6-slider', name, testValue);
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
