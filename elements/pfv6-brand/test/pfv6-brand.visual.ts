import { test, expect } from '@playwright/test';

const COMPONENT = 'pfv6-brand';

test.describe('Brand Visual Parity', () => {
  test('basic', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    await expect(page).toHaveScreenshot(`${COMPONENT}-basic.png`);
  });

  test('responsive', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/responsive/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    await expect(page).toHaveScreenshot(`${COMPONENT}-responsive.png`);
  });
});

test.describe('Brand vs React Visual Parity', () => {
  test('basic - Lit vs React', async ({ page }) => {
    // Take screenshot of Lit version
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    const litScreenshot = await page.screenshot();

    // Take screenshot of React version
    await page.goto(`/react/basic/`);
    await page.waitForSelector('[class*="pf-v6-c-brand"]');
    const reactScreenshot = await page.screenshot();

    // Compare screenshots
    expect(litScreenshot).toMatchSnapshot(`${COMPONENT}-basic-lit.png`);
    expect(reactScreenshot).toMatchSnapshot(`${COMPONENT}-basic-react.png`);
  });

  test('responsive - Lit vs React', async ({ page }) => {
    // Take screenshot of Lit version
    await page.goto(`/elements/${COMPONENT}/demos/responsive/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    const litScreenshot = await page.screenshot();

    // Take screenshot of React version
    await page.goto(`/react/responsive/`);
    await page.waitForSelector('[class*="pf-v6-c-brand"]');
    const reactScreenshot = await page.screenshot();

    // Compare screenshots
    expect(litScreenshot).toMatchSnapshot(`${COMPONENT}-responsive-lit.png`);
    expect(reactScreenshot).toMatchSnapshot(`${COMPONENT}-responsive-react.png`);
  });
});

test.describe('Brand Responsive Behavior', () => {
  test('should render different images at different viewport sizes', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/responsive/`);
    
    // Desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator(COMPONENT)).toBeVisible();
    await expect(page).toHaveScreenshot(`${COMPONENT}-responsive-desktop.png`);

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot(`${COMPONENT}-responsive-tablet.png`);

    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot(`${COMPONENT}-responsive-mobile.png`);
  });

  test('should apply responsive widths at different breakpoints', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);
    
    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Desktop viewport (xl breakpoint)
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page).toHaveScreenshot(`${COMPONENT}-width-desktop.png`);

    // Tablet viewport (md breakpoint)
    await page.setViewportSize({ width: 992, height: 768 });
    await expect(page).toHaveScreenshot(`${COMPONENT}-width-tablet.png`);

    // Mobile viewport (default)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot(`${COMPONENT}-width-mobile.png`);
  });
});

