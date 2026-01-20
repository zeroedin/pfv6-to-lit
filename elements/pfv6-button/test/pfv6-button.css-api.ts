import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-button
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
      images.map(img =>
        img.complete ?
          Promise.resolve()
          : new Promise<void>(resolve => {
            const handler = () => {
              img.removeEventListener('load', handler);
              img.removeEventListener('error', handler);
              resolve();
            };
            img.addEventListener('load', handler);
            img.addEventListener('error', handler);
          }),
      ),
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
  value: string,
): Promise<void> {
  await page.addStyleTag({
    content: `${selector} { ${cssVar}: ${value}; }`,
  });
}

// CSS variables discovered from component CSS
// Each entry includes the variable name, default value, resolved value, detected type, and test value
const cssApiTests = [
  // Base button variables
  {
    name: '--pf-v6-c-button--Display',
    defaultValue: 'inline-flex',
    resolvedValue: 'inline-flex',
    type: 'keyword',
    testValue: 'block',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--AlignItems',
    defaultValue: 'baseline',
    resolvedValue: 'baseline',
    type: 'keyword',
    testValue: 'center',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--JustifyContent',
    defaultValue: 'center',
    resolvedValue: 'center',
    type: 'keyword',
    testValue: 'flex-start',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--Gap',
    defaultValue:
      'var(--pf-t--global--spacer--gap--text-to-element--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--PaddingBlockStart',
    defaultValue:
      'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--PaddingInlineEnd',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--PaddingBlockEnd',
    defaultValue:
      'var(--pf-t--global--spacer--control--vertical--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--PaddingInlineStart',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--default, 1.5rem)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular)',
    resolvedValue: 'var(--pf-t--color--gray--95)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--LineHeight',
    defaultValue: 'var(--pf-t--global--font--line-height--body, 1.5)',
    resolvedValue: '1.5',
    type: 'number',
    testValue: '3',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--default, 400)',
    resolvedValue: '400',
    type: 'font-weight',
    testValue: '900',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--default, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--action--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '50px',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--pill, 999px)',
    resolvedValue: '999px',
    type: 'size',
    testValue: '50px',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--TextDecorationLine',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'keyword',
    testValue: 'underline',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--TextDecorationStyle',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'keyword',
    testValue: 'solid',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--TextDecorationColor',
    defaultValue: 'currentcolor',
    resolvedValue: 'currentcolor',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--TransitionDelay',
    defaultValue: '0s',
    resolvedValue: '0s',
    type: 'time',
    testValue: '5s',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--ScaleX',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '2',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--ScaleY',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '2',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--border--offset',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '10',
    demo: 'types',
  },

  // Hover state
  {
    name: '--pf-v6-c-button--hover--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--hover--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--hover--ScaleX',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '2',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--hover--ScaleY',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '2',
    demo: 'types',
  },

  // Clicked state
  {
    name: '--pf-v6-c-button--m-clicked--BackgroundColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-clicked--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Primary variant
  {
    name: '--pf-v6-c-button--m-primary--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-brand--default)',
    resolvedValue: 'var(--pf-t--color--white)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-primary--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-primary__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-brand--default)',
    resolvedValue: 'var(--pf-t--color--white)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Secondary variant
  {
    name: '--pf-v6-c-button--m-secondary--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-secondary--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-secondary__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Tertiary variant
  {
    name: '--pf-v6-c-button--m-tertiary--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-tertiary--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default)',
    resolvedValue: 'var(--pf-t--color--gray--30)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-tertiary__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Link variant
  {
    name: '--pf-v6-c-button--m-link--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-link--PaddingInlineEnd',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-link--PaddingInlineStart',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-link--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-link--BackgroundColor',
    defaultValue:
      'var(--pf-t--global--background--color--action--plain--default, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-link__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default)',
    resolvedValue: 'var(--pf-t--color--blue--50)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Plain variant
  {
    name: '--pf-v6-c-button--m-plain--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-plain--PaddingInlineEnd',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-plain--PaddingInlineStart',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--plain--default, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-plain--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular)',
    resolvedValue: 'var(--pf-t--color--gray--90)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-plain__icon--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular)',
    resolvedValue: 'var(--pf-t--color--gray--95)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-plain--BackgroundColor',
    defaultValue:
      'var(--pf-t--global--background--color--action--plain--default, rgb(255 255 255 / 0%))',
    resolvedValue: 'rgba(255, 255, 255, 0)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-plain--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Control variant
  {
    name: '--pf-v6-c-button--m-control--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-control--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-control--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-control--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular)',
    resolvedValue: 'var(--pf-t--color--gray--95)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-control--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--control--default)',
    resolvedValue: 'var(--pf-t--color--white)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-control--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default)',
    resolvedValue: 'var(--pf-t--color--gray--30)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-control__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular)',
    resolvedValue: 'var(--pf-t--color--gray--90)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Stateful variant
  {
    name: '--pf-v6-c-button--m-stateful--BorderRadius',
    defaultValue: 'var(--pf-t--global--border--radius--small)',
    resolvedValue: '6px',
    type: 'size',
    testValue: '50px',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-stateful--PaddingInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-stateful--PaddingInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--horizontal--default)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },

  // Warning variant
  {
    name: '--pf-v6-c-button--m-warning--Color',
    defaultValue:
      'var(--pf-t--global--text--color--status--on-warning--default)',
    resolvedValue: 'var(--pf-t--color--gray--95)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-warning--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--warning--default)',
    resolvedValue: 'var(--pf-t--color--yellow--30)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-warning__icon--Color',
    defaultValue:
      'var(--pf-t--global--icon--color--status--on-warning--default)',
    resolvedValue: 'var(--pf-t--color--gray--90)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Danger variant
  {
    name: '--pf-v6-c-button--m-danger--Color',
    defaultValue:
      'var(--pf-t--global--text--color--status--on-danger--default)',
    resolvedValue: 'var(--pf-t--color--white)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-danger--BackgroundColor',
    defaultValue: 'var(--pf-t--global--color--status--danger--default)',
    resolvedValue: 'var(--pf-t--color--red-orange--60)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-danger__icon--Color',
    defaultValue:
      'var(--pf-t--global--icon--color--status--on-danger--default)',
    resolvedValue: 'var(--pf-t--color--white)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Disabled state
  {
    name: '--pf-v6-c-button--disabled--Color',
    defaultValue: 'var(--pf-t--global--text--color--on-disabled)',
    resolvedValue: 'var(--pf-t--color--gray--60)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--disabled--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--disabled--default)',
    resolvedValue: 'var(--pf-t--color--gray--30)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--disabled--TextDecorationColor',
    defaultValue: 'currentcolor',
    resolvedValue: 'currentcolor',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--disabled--BorderColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--disabled__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--on-disabled)',
    resolvedValue: 'var(--pf-t--color--gray--60)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },

  // Icon
  {
    name: '--pf-v6-c-button__icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular)',
    resolvedValue: 'var(--pf-t--color--gray--90)',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button__icon--MarginInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '10',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button__icon--MarginInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'number',
    testValue: '10',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button__icon--Rotate',
    defaultValue: '0deg',
    resolvedValue: '0deg',
    type: 'angle',
    testValue: '180deg',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button__icon--ScaleX',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '2',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button__icon--ScaleY',
    defaultValue: '1',
    resolvedValue: '1',
    type: 'number',
    testValue: '2',
    demo: 'types',
  },

  // Block modifier
  {
    name: '--pf-v6-c-button--m-block--Display',
    defaultValue: 'flex',
    resolvedValue: 'flex',
    type: 'keyword',
    testValue: 'inline-flex',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-block--Width',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '50%',
    demo: 'types',
  },

  // Small size
  {
    name: '--pf-v6-c-button--m-small--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--compact)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-small--PaddingInlineEnd',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--compact, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-small--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--compact)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-small--PaddingInlineStart',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--compact, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },

  // Display lg size
  {
    name: '--pf-v6-c-button--m-display-lg--PaddingBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--spacious)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-display-lg--PaddingInlineEnd',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--spacious, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-display-lg--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--control--vertical--spacious)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-display-lg--PaddingInlineStart',
    defaultValue:
      'var(--pf-t--global--spacer--action--horizontal--spacious, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50rem',
    demo: 'types',
  },
  {
    name: '--pf-v6-c-button--m-display-lg--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'types',
  },
];

test.describe('CSS API Tests - React vs Lit with CSS Overrides', () => {
  cssApiTests.forEach(
    ({ name, defaultValue, resolvedValue, type, testValue, demo }) => {
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
          await reactPage.goto(`/elements/pfv6-button/react/test/${demo}`);
          await applyCssOverride(reactPage, '.pf-v6-c-button', name, testValue);
          await waitForFullLoad(reactPage);

          // Load Lit demo with CSS override
          await page.goto(`/elements/pfv6-button/demo/${demo}`);
          await applyCssOverride(page, 'pfv6-button', name, testValue);
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

          const diff = new PNG({
            width: reactPng.width,
            height: reactPng.height,
          });

          const numDiffPixels = pixelmatch(
            reactPng.data,
            litPng.data,
            diff.data,
            reactPng.width,
            reactPng.height,
            { threshold: 0 }, // Pixel-perfect
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
    },
  );
});
