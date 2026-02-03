import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-notification-badge
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
  // Base stateful button properties
  {
    name: '--pf-v6-c-button--m-stateful--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-stateful--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-stateful--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-stateful--m-small--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-stateful--m-small--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Read variant
  {
    name: '--pf-v6-c-button--m-read--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-read--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-read--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-read--hover--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--hover)',
    resolvedValue: '#4394e5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-read--m-clicked--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-read--m-clicked--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--clicked)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Unread variant
  {
    name: '--pf-v6-c-button--m-unread--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--unread--on-default--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-unread--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--unread--default)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-unread__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--unread--on-default--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-unread--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--unread--hover)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-unread--m-clicked--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--unread--clicked)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Attention variant
  {
    name: '--pf-v6-c-button--m-attention--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--unread--on-attention--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-attention--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--unread--attention--default)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-attention__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--unread--on-attention--default)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-attention--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--unread--attention--hover)',
    resolvedValue: '#731f00',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-attention--clicked--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--unread--attention--clicked)',
    resolvedValue: '#731f00',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Animation properties
  {
    name: '--pf-v6-c-button--m-notify__icon--AnimationDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--3xl)',
    resolvedValue: '600ms',
    type: 'duration',
    testValue: '2000ms',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-notify__icon--AnimationTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--default)',
    resolvedValue: 'cubic-bezier(.4, 0, .2, 1)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'basic',
  },

  // Base button properties
  {
    name: '--pf-v6-c-button--Display',
    defaultValue: 'inline-flex',
    resolvedValue: 'inline-flex',
    type: 'display',
    testValue: 'block',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--AlignItems',
    defaultValue: 'baseline',
    resolvedValue: 'baseline',
    type: 'align-items',
    testValue: 'center',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--JustifyContent',
    defaultValue: 'center',
    resolvedValue: 'center',
    type: 'justify-content',
    testValue: 'flex-start',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--Gap',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--default)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--default)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--default)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '2.5',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--default)',
    resolvedValue: '400',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--default)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--pill)',
    resolvedValue: '999px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--TransitionDelay',
    defaultValue: '0s',
    resolvedValue: '0s',
    type: 'duration',
    testValue: '1s',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--default)',
    resolvedValue: '200ms',
    type: 'duration',
    testValue: '2000ms',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--TransitionTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--accelerate)',
    resolvedValue: 'cubic-bezier(.4, 0, .7, .2)',
    type: 'timing-function',
    testValue: 'linear',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--TransitionProperty',
    defaultValue: 'color, background, border-color',
    resolvedValue: 'color, background, border-color',
    type: 'transition-property',
    testValue: 'all',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--hover--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--hover--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--hover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--hover)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-clicked--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-clicked--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-clicked--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--clicked)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--hover__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--m-clicked__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-button--border--offset',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '10',
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
        await reactPage.goto(`/elements/pfv6-notification-badge/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-button', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-notification-badge/test/${demo}`);
        await applyCssOverride(page, 'pfv6-notification-badge', name, testValue);
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
