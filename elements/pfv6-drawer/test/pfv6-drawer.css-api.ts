import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-drawer
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

// CSS variables discovered from component CSS files
const cssApiTests = [
  // Section
  {
    name: '--pf-v6-c-drawer__section--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__section--m-secondary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f0f0f0)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Content
  {
    name: '--pf-v6-c-drawer__content--FlexBasis',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content--m-primary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content--m-secondary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f0f0f0)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'basic',
  },

  // Panel
  {
    name: '--pf-v6-c-drawer__panel--MinWidth',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '200px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--MaxHeight',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'size',
    testValue: '500px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--sm, 200)',
    resolvedValue: '200',
    type: 'number',
    testValue: '999',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--BorderBlockStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--BorderBlockEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--BorderInlineStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--BorderInlineEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--floating--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--m-inline--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--m-secondary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--secondary--default, #f0f0f0)',
    resolvedValue: '#f2f2f2',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--RowGap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--TransitionTimingFunction',
    defaultValue: 'var(--pf-t--global--motion--timing-function--decelerate, cubic-bezier(0, 0, 0.2, 1))',
    resolvedValue: 'cubic-bezier(0, 0, 0.2, 1)',
    type: 'unknown',
    testValue: 'linear',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--TransitionDuration--fade',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--default, 200ms)',
    resolvedValue: '200ms',
    type: 'size',
    testValue: '50ms',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--Opacity',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '0.5',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-expanded__panel--Opacity',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '0.5',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--FlexBasis',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--md--FlexBasis--min',
    defaultValue: '1.5rem',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--md--FlexBasis',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '75%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--md--FlexBasis--max',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--xl--MinWidth',
    defaultValue: '28.125rem',
    resolvedValue: '28.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--xl--FlexBasis',
    defaultValue: '28.125rem',
    resolvedValue: '28.125rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__panel--md--MinHeight',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '75%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__panel--xl--MinHeight',
    defaultValue: '18.75rem',
    resolvedValue: '18.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__panel--xl--FlexBasis',
    defaultValue: '18.75rem',
    resolvedValue: '18.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--m-resizable--MinWidth',
    defaultValue: '1.5rem',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__panel--m-resizable--MinHeight',
    defaultValue: '1.5rem',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Drawer panel head
  {
    name: '--pf-v6-c-drawer__head--ColumnGap',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__head--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__head--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__head--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__head--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Drawer panel description
  {
    name: '--pf-v6-c-drawer__description--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__description--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Drawer body padding
  {
    name: '--pf-v6-c-drawer__body--PaddingBlockStart--base',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__body--PaddingInlineEnd--base',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__body--PaddingBlockEnd--base',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__body--PaddingInlineStart--base',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Drawer content body
  {
    name: '--pf-v6-c-drawer__content__body--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content__body--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content__body--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__content__body--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Drawer panel body
  {
    name: '--pf-v6-c-drawer__panel__body--PaddingBlockStart',
    defaultValue: 'var(--pf-v6-c-drawer__body--PaddingBlockStart--base)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel__body--PaddingInlineEnd',
    defaultValue: 'var(--pf-v6-c-drawer__body--PaddingInlineEnd--base)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel__body--PaddingBlockEnd',
    defaultValue: 'var(--pf-v6-c-drawer__body--PaddingBlockEnd--base)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel__body--PaddingInlineStart',
    defaultValue: 'var(--pf-v6-c-drawer__body--PaddingInlineStart--base)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Modified body padding
  {
    name: '--pf-v6-c-drawer__body--m-padding--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__body--m-padding--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__body--m-padding--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__body--m-padding--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--md, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Splitter
  {
    name: '--pf-v6-c-drawer__splitter--Height',
    defaultValue: '0.5625rem',
    resolvedValue: '0.5625rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--Width',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical--Height',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical--Width',
    defaultValue: '0.5625rem',
    resolvedValue: '0.5625rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline__splitter--focus--OutlineOffset',
    defaultValue: '-0.0625rem',
    resolvedValue: '-0.0625rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Splitter border
  {
    name: '--pf-v6-c-drawer__splitter--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--after--border-width--base',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--after--BorderBlockStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--after--BorderInlineEndWidth',
    defaultValue: 'var(--pf-v6-c-drawer__splitter--after--border-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--after--BorderBlockEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--after--BorderInlineStartWidth',
    defaultValue: 'var(--pf-v6-c-drawer__splitter--after--border-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__splitter--after--BorderBlockStartWidth',
    defaultValue: 'var(--pf-v6-c-drawer__splitter--after--border-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__splitter--after--BorderBlockEndWidth',
    defaultValue: 'var(--pf-v6-c-drawer__splitter--after--border-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline__splitter--m-vertical--Width',
    defaultValue: '0.625rem',
    resolvedValue: '0.625rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline__splitter-handle--InsetInlineStart',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '25%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline--m-panel-bottom__splitter--Height',
    defaultValue: '0.625rem',
    resolvedValue: '0.625rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline--m-panel-bottom__splitter-handle--InsetBlockStart',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '25%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline--m-panel-bottom__splitter--after--BorderBlockStartWidth',
    defaultValue: 'var(--pf-v6-c-drawer__splitter--after--border-width--base)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },

  // Splitter handle
  {
    name: '--pf-v6-c-drawer__splitter-handle--InsetBlockStart',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '25%',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-left__splitter-handle--InsetInlineStart',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '25%',
    demo: 'basic',
  },

  // Splitter handle line
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--BorderBlockStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--BorderInlineEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--BorderBlockEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--BorderInlineStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--hover__splitter-handle--after--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--hover, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical__splitter-handle--after--BorderBlockStartWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical__splitter-handle--after--BorderInlineEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical__splitter-handle--after--BorderBlockEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical__splitter-handle--after--BorderInlineStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--Width',
    defaultValue: '0.75rem',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter-handle--after--Height',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical__splitter-handle--after--Width',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__splitter--m-vertical__splitter-handle--after--Height',
    defaultValue: '0.75rem',
    resolvedValue: '0.75rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Actions
  {
    name: '--pf-v6-c-drawer__actions--MarginBlockStart',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--vertical--compact, 0.25rem) * -1.5)',
    resolvedValue: 'calc(0.25rem * -1.5)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__actions--MarginInlineEnd',
    defaultValue: 'calc(var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem) * -1.5)',
    resolvedValue: 'calc(0.5rem * -1.5)',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },

  // Box shadow
  {
    name: '--pf-v6-c-drawer__panel--BoxShadow',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'shadow',
    testValue: '0 0 20px 10px rgba(255, 0, 0, 0.8)',
    demo: 'basic',
  },

  // Divider
  {
    name: '--pf-v6-c-drawer__panel--after--Width',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline__panel--after--Width',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline__panel--after--md--Width',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom__panel--after--Height',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer__panel--after--BackgroundColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline--m-expanded__panel--after--BackgroundColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-inline__panel--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-left--m-inline__panel--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-drawer--m-panel-bottom--m-inline__panel--PaddingBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '50px',
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
        await reactPage.goto(`/elements/pfv6-drawer/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-drawer', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-drawer/test/${demo}`);
        await applyCssOverride(page, 'pfv6-drawer', name, testValue);
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
