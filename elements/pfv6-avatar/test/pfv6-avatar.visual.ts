import { test, expect } from '@playwright/test';

const COMPONENT = 'pfv6-avatar';

test.describe('Avatar Visual Parity', () => {
  test('basic', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    await expect(page).toHaveScreenshot(`${COMPONENT}-basic.png`);
  });

  test('bordered', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/bordered/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    await expect(page).toHaveScreenshot(`${COMPONENT}-bordered.png`);
  });

  test('size-variations', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/size-variations/`);
    const avatars = page.locator(COMPONENT);
    await expect(avatars.first()).toBeVisible();
    await expect(page).toHaveScreenshot(`${COMPONENT}-size-variations.png`);
  });
});

test.describe('Avatar vs React Visual Parity', () => {
  test('basic - Lit vs React', async ({ page }) => {
    // Take screenshot of Lit version
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    const litScreenshot = await page.screenshot();

    // Take screenshot of React version
    await page.goto(`/react/basic/`);
    await page.waitForSelector('[class*="pf-v6-c-avatar"]');
    const reactScreenshot = await page.screenshot();

    // Compare screenshots
    expect(litScreenshot).toMatchSnapshot(`${COMPONENT}-basic-lit.png`);
    expect(reactScreenshot).toMatchSnapshot(`${COMPONENT}-basic-react.png`);
  });

  test('bordered - Lit vs React', async ({ page }) => {
    // Take screenshot of Lit version
    await page.goto(`/elements/${COMPONENT}/demos/bordered/`);
    await expect(page.locator(COMPONENT)).toBeVisible();
    const litScreenshot = await page.screenshot();

    // Take screenshot of React version
    await page.goto(`/react/bordered/`);
    await page.waitForSelector('[class*="pf-v6-c-avatar"]');
    const reactScreenshot = await page.screenshot();

    // Compare screenshots
    expect(litScreenshot).toMatchSnapshot(`${COMPONENT}-bordered-lit.png`);
    expect(reactScreenshot).toMatchSnapshot(`${COMPONENT}-bordered-react.png`);
  });

  test('size-variations - Lit vs React', async ({ page }) => {
    // Take screenshot of Lit version
    await page.goto(`/elements/${COMPONENT}/demos/size-variations/`);
    await expect(page.locator(COMPONENT).first()).toBeVisible();
    const litScreenshot = await page.screenshot();

    // Take screenshot of React version
    await page.goto(`/react/size-variations/`);
    await page.waitForSelector('[class*="pf-v6-c-avatar"]');
    const reactScreenshot = await page.screenshot();

    // Compare screenshots
    expect(litScreenshot).toMatchSnapshot(`${COMPONENT}-size-variations-lit.png`);
    expect(reactScreenshot).toMatchSnapshot(`${COMPONENT}-size-variations-react.png`);
  });
});
