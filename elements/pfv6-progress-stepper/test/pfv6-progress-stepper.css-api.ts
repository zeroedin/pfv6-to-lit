import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * CSS API Tests for pfv6-progress-stepper
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

// CSS variables discovered from component CSS files
// Resolution chain: component var → token var → final value
const cssApiTests = [
  // pfv6-progress-stepper variables
  {
    name: '--pf-v6-c-progress-stepper--GridTemplateRows',
    defaultValue: 'auto 1fr',
    resolvedValue: 'auto 1fr',
    type: 'grid-template',
    testValue: '50px 1fr',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--GridAutoFlow',
    defaultValue: 'row',
    resolvedValue: 'row',
    type: 'keyword',
    testValue: 'column',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--GridTemplateColumns',
    defaultValue: 'auto 1fr',
    resolvedValue: 'auto 1fr',
    type: 'grid-template',
    testValue: '100px 2fr',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--GridAutoFlow',
    defaultValue: 'row',
    resolvedValue: 'row',
    type: 'keyword',
    testValue: 'column',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--GridTemplateColumns',
    defaultValue: 'auto 1fr',
    resolvedValue: 'auto 1fr',
    type: 'grid-template',
    testValue: '80px 1fr',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--InsetBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '20px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--InsetInlineStart',
    defaultValue: 'calc(var(--pf-v6-c-progress-stepper__step-icon--Width) / 2)',
    resolvedValue: 'calc(1.5rem / 2)',
    type: 'calc',
    testValue: '30px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--Width',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '5px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--Height',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '150px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--BorderInlineEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '5px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--BorderInlineEndColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--BorderBlockEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '3px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--BorderBlockEndColor',
    defaultValue: 'transparent',
    resolvedValue: 'transparent',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-connector--before--Transform',
    defaultValue: 'translateX(-50%)',
    resolvedValue: 'translateX(-50%)',
    type: 'transform',
    testValue: 'translateX(-100%)',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-main--MarginBlockStart',
    defaultValue: '0px',
    resolvedValue: '0px',
    type: 'size',
    testValue: '20px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-main--MarginInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '15px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-main--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--xl, 2rem)',
    resolvedValue: '2rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical__step-main--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '30px',
    demo: 'basic',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal--GridAutoFlow',
    defaultValue: 'column',
    resolvedValue: 'column',
    type: 'keyword',
    testValue: 'row',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal--GridTemplateColumns',
    defaultValue: 'initial',
    resolvedValue: 'initial',
    type: 'keyword',
    testValue: '1fr 1fr 1fr',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--InsetBlockStart',
    defaultValue: 'calc(var(--pf-v6-c-progress-stepper__step-icon--Height) / 2)',
    resolvedValue: 'calc(1.5rem / 2)',
    type: 'calc',
    testValue: '25px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--InsetInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--Width',
    defaultValue: '100%',
    resolvedValue: '100%',
    type: 'size',
    testValue: '200px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--Height',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '8px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--BorderInlineEndWidth',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '2px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--BorderInlineEndColor',
    defaultValue: 'unset',
    resolvedValue: 'unset',
    type: 'keyword',
    testValue: 'rgb(255, 0, 0)',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--BorderBlockEndWidth',
    defaultValue: 'var(--pf-t--global--border--width--divider--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '4px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--BorderBlockEndColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-connector--before--Transform',
    defaultValue: 'translateY(-50%)',
    resolvedValue: 'translateY(-50%)',
    type: 'transform',
    testValue: 'translateY(-100%)',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-main--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '25px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-main--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '20px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-main--MarginBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '15px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal__step-main--MarginInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'horizontal',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-compact--GridTemplateColumns',
    defaultValue: '1fr',
    resolvedValue: '1fr',
    type: 'grid-template',
    testValue: 'auto',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-compact__step-connector--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '20px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-compact__step-connector--GridRow',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '2',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-compact__step-main--MarginBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-compact__step-main--MarginInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-compact__step-main--MarginInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal--m-compact--GridTemplateColumns',
    defaultValue: 'repeat(auto-fill, 1.75rem)',
    resolvedValue: 'repeat(auto-fill, 1.75rem)',
    type: 'grid-template',
    testValue: 'repeat(auto-fill, 50px)',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal--m-compact__step-connector--PaddingBlockEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '5px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-horizontal--m-compact__step-connector--GridRow',
    defaultValue: '2',
    resolvedValue: '2',
    type: 'number',
    testValue: '1',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact--GridAutoFlow',
    defaultValue: 'row',
    resolvedValue: 'row',
    type: 'keyword',
    testValue: 'column',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact--GridTemplateColumns',
    defaultValue: '1fr',
    resolvedValue: '1fr',
    type: 'grid-template',
    testValue: 'auto',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-connector--GridRow',
    defaultValue: 'auto',
    resolvedValue: 'auto',
    type: 'keyword',
    testValue: '1',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-connector--MinWidth',
    defaultValue: '1.75rem',
    resolvedValue: '1.75rem',
    type: 'size',
    testValue: '60px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-connector--PaddingBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '25px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-main--MarginBlockStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '12px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-main--MarginBlockEnd',
    defaultValue: 'var(--pf-t--global--spacer--sm, 0.5rem)',
    resolvedValue: '0.5rem',
    type: 'size',
    testValue: '30px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-icon--Width',
    defaultValue: '1.125rem',
    resolvedValue: '1.125rem',
    type: 'size',
    testValue: '40px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '20px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-title--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '24px',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-compact__step-title--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'compact',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center--GridTemplateColumns',
    defaultValue: '1fr',
    resolvedValue: '1fr',
    type: 'grid-template',
    testValue: 'auto',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-connector--JustifyContent',
    defaultValue: 'center',
    resolvedValue: 'center',
    type: 'keyword',
    testValue: 'flex-end',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-connector--before--InsetInlineStart',
    defaultValue: '50%',
    resolvedValue: '50%',
    type: 'size',
    testValue: '75%',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-connector--before--Content',
    defaultValue: '""',
    resolvedValue: '""',
    type: 'content',
    testValue: 'none',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-main--before--Content',
    defaultValue: 'none',
    resolvedValue: 'none',
    type: 'content',
    testValue: '""',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-main--MarginInlineEnd',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '20px',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-main--MarginInlineStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '20px',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-main--TextAlign',
    defaultValue: 'center',
    resolvedValue: 'center',
    type: 'keyword',
    testValue: 'left',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-description--MarginInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '15px',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-center__step-description--MarginInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '15px',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-center__step-main--MarginInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },
  {
    name: '--pf-v6-c-progress-stepper--m-vertical--m-center__step-main--MarginInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '10px',
    demo: 'center',
    selector: 'pfv6-progress-stepper'
  },

  // pfv6-progress-step variables
  {
    name: '--pf-v6-c-progress-stepper__step-icon--ZIndex',
    defaultValue: 'var(--pf-t--global--z-index--xs, 100)',
    resolvedValue: '100',
    type: 'number',
    testValue: '999',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--Width',
    defaultValue: '1.5rem',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--Height',
    defaultValue: 'var(--pf-v6-c-progress-stepper__step-icon--Width)',
    resolvedValue: '1.5rem',
    type: 'size',
    testValue: '50px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--FontSize',
    defaultValue: 'var(--pf-t--global--icon--size--font--body--default, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '30px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--regular, #1f1f1f)',
    resolvedValue: '#1f1f1f',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--BackgroundColor',
    defaultValue: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
    resolvedValue: '#ffffff',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--BorderWidth',
    defaultValue: 'var(--pf-t--global--border--width--box--default, 1px)',
    resolvedValue: '1px',
    type: 'size',
    testValue: '5px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-icon--BorderColor',
    defaultValue: 'var(--pf-t--global--border--color--default, #c7c7c7)',
    resolvedValue: '#c7c7c7',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--TextAlign',
    defaultValue: 'start',
    resolvedValue: 'start',
    type: 'keyword',
    testValue: 'center',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--lg, 1rem)',
    resolvedValue: '1rem',
    type: 'size',
    testValue: '24px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--default, 400)',
    resolvedValue: '400',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-description--MarginBlockStart',
    defaultValue: 'var(--pf-t--global--spacer--xs, 0.25rem)',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '20px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-description--FontSize',
    defaultValue: 'var(--pf-t--global--font--size--body--sm, 0.875rem)',
    resolvedValue: '0.875rem',
    type: 'size',
    testValue: '18px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-description--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-description--TextAlign',
    defaultValue: 'start',
    resolvedValue: 'start',
    type: 'keyword',
    testValue: 'right',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--PaddingInlineStart',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '15px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--PaddingInlineEnd',
    defaultValue: '0',
    resolvedValue: '0',
    type: 'size',
    testValue: '15px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--TextDecorationLine',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--line--default, underline)',
    resolvedValue: 'underline',
    type: 'text-decoration',
    testValue: 'none',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--TextDecorationStyle',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--style--default, dashed)',
    resolvedValue: 'dashed',
    type: 'text-decoration',
    testValue: 'solid',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--TextUnderlineOffset',
    defaultValue: '0.25rem',
    resolvedValue: '0.25rem',
    type: 'size',
    testValue: '10px',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--hover--TextDecorationLine',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--line--hover, underline)',
    resolvedValue: 'underline',
    type: 'text-decoration',
    testValue: 'none',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--hover--TextDecorationStyle',
    defaultValue: 'var(--pf-t--global--text-decoration--help-text--style--hover, dashed)',
    resolvedValue: 'dashed',
    type: 'text-decoration',
    testValue: 'solid',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-title--m-help-text--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--brand--hover, #004d99)',
    resolvedValue: '#004d99',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-current__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--brand--default, #0066cc)',
    resolvedValue: '#0066cc',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-current__step-title--FontWeight',
    defaultValue: 'var(--pf-t--global--font--weight--body--bold, 500)',
    resolvedValue: '500',
    type: 'font-weight',
    testValue: '900',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-current__step-title--Color',
    defaultValue: 'var(--pf-t--global--text--color--regular, #151515)',
    resolvedValue: '#151515',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-pending__step-title--Color',
    defaultValue: 'var(--pf-t--global--text--color--subtle, #4d4d4d)',
    resolvedValue: '#4d4d4d',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-info__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--info--default, #5e40be)',
    resolvedValue: '#5e40be',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-success__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--success--default, #3d7317)',
    resolvedValue: '#3d7317',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-warning__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--warning--default, #dca614)',
    resolvedValue: '#dca614',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-danger__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-danger__step-title--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--danger--default, #b1380b)',
    resolvedValue: '#b1380b',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-danger__step-title--m-help-text--hover--Color',
    defaultValue: 'var(--pf-t--global--text--color--status--danger--hover, #731f00)',
    resolvedValue: '#731f00',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step--m-custom__step-icon--Color',
    defaultValue: 'var(--pf-t--global--icon--color--status--custom--default, #147878)',
    resolvedValue: '#147878',
    type: 'color',
    testValue: 'rgb(255, 0, 0)',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
  {
    name: '--pf-v6-c-progress-stepper__step-connector--JustifyContent',
    defaultValue: 'flex-start',
    resolvedValue: 'flex-start',
    type: 'keyword',
    testValue: 'center',
    demo: 'basic',
    selector: 'pfv6-progress-step'
  },
];

test.describe('CSS API Tests - pfv6-progress-stepper and pfv6-progress-step', () => {
  cssApiTests.forEach(({ name, defaultValue, resolvedValue, type, testValue, demo, selector }) => {
    test(`CSS API: ${name} (${selector})`, async ({ page, browser }) => {
      // Add metadata to test report
      test.info().annotations.push({
        type: 'css-variable',
        description: [
          `Variable: ${name}`,
          `Selector: ${selector}`,
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
        // Determine correct CSS selector for React vs Lit
        const reactSelector = selector === 'pfv6-progress-stepper'
          ? '.pf-v6-c-progress-stepper'
          : selector === 'pfv6-progress-step'
          ? '.pf-v6-c-progress-stepper__step'
          : selector;

        // Load React demo with CSS override
        await reactPage.goto(`/elements/pfv6-progress-stepper/react/test/${demo}`);
        await applyCssOverride(reactPage, reactSelector, name, testValue);
        await waitForFullLoad(reactPage);

        // Load Lit demo with CSS override
        await page.goto(`/elements/pfv6-progress-stepper/test/${demo}`);
        await applyCssOverride(page, selector, name, testValue);
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
