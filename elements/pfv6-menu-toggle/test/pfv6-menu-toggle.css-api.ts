import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-menu-toggle
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
  // Base styles
  {
    name: '--pf-v6-c-menu-toggle--Gap',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '999',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--border--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--short, 100ms)',
    resolvedValue: '100ms',
    type: 'size',
    testValue: '50ms',
    demo: 'basic',
  },

  // Hover states
  {
    name: '--pf-v6-c-menu-toggle--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--hover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--hover, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--hover--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--hover, #4394e5)',
    resolvedValue: '#4394e5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--hover__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Expanded states
  {
    name: '--pf-v6-c-menu-toggle--expanded--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--expanded--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--expanded--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--control--clicked, 2px)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--expanded--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--clicked, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--expanded__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Disabled states
  {
    name: '--pf-v6-c-menu-toggle--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--disabled__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--disabled__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--disabled__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--disabled--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Icon
  {
    name: '--pf-v6-c-menu-toggle__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__icon--TransitionDelay',
    defaultValue: '0s',
    resolvedValue: '0s',
    type: 'size',
    testValue: '50s',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__icon--TransitionDuration',
    defaultValue: '0s',
    resolvedValue: '0s',
    type: 'size',
    testValue: '50s',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__icon--Rotate',
    defaultValue: '0deg',
    resolvedValue: '0deg',
    type: 'size',
    testValue: '50deg',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--hover__icon--Rotate',
    defaultValue: '0deg',
    resolvedValue: '0deg',
    type: 'size',
    testValue: '50deg',
    demo: 'basic',
  },

  // Toggle icon
  {
    name: '--pf-v6-c-menu-toggle__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Primary variant
  {
    name: '--pf-v6-c-menu-toggle--m-primary--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-brand--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--pill, 999px)',
    resolvedValue: '999px',
    type: 'size',
    testValue: '50px',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-brand--hover, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--hover--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--expanded--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-brand--clicked, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--expanded--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--clicked, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--expanded--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-brand--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--hover__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-brand--hover, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--expanded__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-brand--clicked, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--m-small--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--compact, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'primary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-primary--m-small--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--compact, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'primary',
  },

  // Secondary variant
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--pill, 999px)',
    resolvedValue: '999px',
    type: 'size',
    testValue: '50px',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--hover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--hover, 2px)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '50px',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--hover--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--brand--hover, #4394e5)',
    resolvedValue: '#4394e5',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--expanded--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--clicked, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--expanded--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--expanded--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--clicked, 2px)',
    resolvedValue: '2px',
    type: 'size',
    testValue: '50px',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--expanded--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--brand--clicked, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--hover__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--expanded__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--clicked, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--m-small--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--compact, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'secondary',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-secondary--m-small--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--compact, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'secondary',
  },

  // Full height
  {
    name: '--pf-v6-c-menu-toggle--m-full-height--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--spacious, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-full-height--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--spacious, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Split button
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--child--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--child--disabled--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--child--BorderInlineStartWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--child--BorderInlineStartColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--child--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--pill, 999px)',
    resolvedValue: '999px',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--child--disabled--BorderInlineStartColor',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--pill--child--PaddingInlineStart--offset',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--pill--child--PaddingInlineEnd--offset',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-small--pill--child--PaddingInlineStart--offset',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-small--pill--child--PaddingInlineEnd--offset',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Split button primary
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-primary--child--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-primary--child--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-primary--child--BorderInlineStartColor',
    defaultValue: 'var(--pf-t--global--border--color--alt, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-primary--expanded--child--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--clicked, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Split button secondary
  {
    name: '--pf-v6-c-menu-toggle--m-split-button--m-secondary--child--BorderInlineStartColor',
    defaultValue: 'var(--pf-t--global--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Button
  {
    name: '--pf-v6-c-menu-toggle__button--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__button--Gap',
    defaultValue: 'var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__button--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--plain, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__button--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--plain, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__button--m-text--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__button--toggle-icon--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__button--toggle-icon--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-small__button--toggle-icon--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-small__button--toggle-icon--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Plain variant
  {
    name: '--pf-v6-c-menu-toggle--m-plain--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--action--plain--default, transparent)',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--high-contrast, transparent)',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--default, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--hover--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--hover, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--expanded--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--plain--clicked, 0px)',
    resolvedValue: '0px',
    type: 'size',
    testValue: '50px',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small, 6px)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--hover--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--action--plain--hover, rgb(199 199 199 / 25%))',
    resolvedValue: 'rgb(199 199 199 / 25%)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--expanded--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--action--plain--clicked, rgb(199 199 199 / 25%))',
    resolvedValue: 'rgb(199 199 199 / 25%)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--disabled__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--disabled__toggle-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--disabled, #a3a3a3)',
    resolvedValue: '#a3a3a3',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--disabled--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--m-small--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--plain--compact, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'plain',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-plain--m-small--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--action--horizontal--plain--compact, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'plain',
  },

  // Small variant
  {
    name: '--pf-v6-c-menu-toggle--m-small--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--compact, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-small--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--compact, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-small--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-small--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--compact, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Status icon
  {
    name: '--pf-v6-c-menu-toggle__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle__status-icon--m-danger--TransitionDuration--Opacity',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--default, 100ms)',
    resolvedValue: '100ms',
    type: 'size',
    testValue: '50ms',
    demo: 'basic',
  },

  // Success
  {
    name: '--pf-v6-c-menu-toggle--m-success--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-success__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Warning
  {
    name: '--pf-v6-c-menu-toggle--m-warning--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-warning__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #ffcc17)',
    resolvedValue: '#ffcc17',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Danger
  {
    name: '--pf-v6-c-menu-toggle--m-danger--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--status--danger--default, #f0561d)',
    resolvedValue: '#f0561d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-danger__status-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #f0561d)',
    resolvedValue: '#f0561d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-danger--AnimationDuration--Transform',
    defaultValue: 'var(--pf-t--global--motion--duration--fade--default, 200ms)',
    resolvedValue: '200ms',
    type: 'size',
    testValue: '50ms',
    demo: 'basic',
  },

  // Placeholder
  {
    name: '--pf-v6-c-menu-toggle--m-placeholder--Color',
    defaultValue: 'var(--pf-t--global--text--color--placeholder, #707070)',
    resolvedValue: '#707070',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
  },

  // Controls
  {
    name: '--pf-v6-c-menu-toggle__controls--Gap',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'basic',
  },

  // Settings
  {
    name: '--pf-v6-c-menu-toggle--m-settings__icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--long, 200ms)',
    resolvedValue: '200ms',
    type: 'size',
    testValue: '50ms',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-settings--hover__icon--TransitionDuration',
    defaultValue: 'var(--pf-t--global--motion--duration--icon--long, 200ms)',
    resolvedValue: '200ms',
    type: 'size',
    testValue: '50ms',
    demo: 'basic',
  },
  {
    name: '--pf-v6-c-menu-toggle--m-settings--hover__icon--Rotate',
    defaultValue: '60deg',
    resolvedValue: '60deg',
    type: 'size',
    testValue: '50deg',
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
        await reactPage.goto(`/elements/pfv6-menu-toggle/react/test/${demo}`);
        await applyCssOverride(reactPage, '.pf-v6-c-menu-toggle', name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-menu-toggle/test/${demo}`);
        await applyCssOverride(page, 'pfv6-menu-toggle', name, testValue);
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
