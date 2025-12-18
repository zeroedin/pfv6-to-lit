import { test, expect } from '@playwright/test';

const COMPONENT = 'pfv6-avatar';

test.describe('Avatar CSS API Tests', () => {
  test('should support --pf-v6-c-avatar--Width override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const avatar = page.locator(COMPONENT);
    await expect(avatar).toBeVisible();

    // Override width
    await avatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--Width', '100px');
    });

    const img = avatar.locator('img');
    const width = await img.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('100px');
  });

  test('should support --pf-v6-c-avatar--Height override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const avatar = page.locator(COMPONENT);
    await expect(avatar).toBeVisible();

    // Override height
    await avatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--Height', '100px');
    });

    const img = avatar.locator('img');
    const height = await img.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('100px');
  });

  test('should support --pf-v6-c-avatar--BorderRadius override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const avatar = page.locator(COMPONENT);
    await expect(avatar).toBeVisible();

    // Override border radius
    await avatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--BorderRadius', '8px');
    });

    const img = avatar.locator('img');
    const borderRadius = await img.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe('8px');
  });

  test('should support --pf-v6-c-avatar--m-bordered--BorderColor override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/bordered/`);

    const avatar = page.locator(COMPONENT);
    await expect(avatar).toBeVisible();

    // Override border color
    await avatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--m-bordered--BorderColor', 'rgb(255, 0, 0)');
    });

    const img = avatar.locator('img');
    const borderColor = await img.evaluate((el) => getComputedStyle(el).borderColor);
    expect(borderColor).toBe('rgb(255, 0, 0)');
  });

  test('should support --pf-v6-c-avatar--m-bordered--BorderWidth override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/bordered/`);

    const avatar = page.locator(COMPONENT);
    await expect(avatar).toBeVisible();

    // Override border width
    await avatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--m-bordered--BorderWidth', '4px');
    });

    const img = avatar.locator('img');
    const borderWidth = await img.evaluate((el) => getComputedStyle(el).borderWidth);
    expect(borderWidth).toBe('4px');
  });

  test('should support --pf-v6-c-avatar--m-sm--Width override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/size-variations/`);

    const avatars = page.locator(COMPONENT);
    const smAvatar = avatars.filter({ has: page.locator('[size="sm"]') }).first();
    await expect(smAvatar).toBeVisible();

    // Override small size width
    await smAvatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--m-sm--Width', '50px');
    });

    const img = smAvatar.locator('img');
    const width = await img.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('50px');
  });

  test('should support --pf-v6-c-avatar--m-md--Width override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/size-variations/`);

    const avatars = page.locator(COMPONENT);
    const mdAvatar = avatars.filter({ has: page.locator('[size="md"]') }).first();
    await expect(mdAvatar).toBeVisible();

    // Override medium size width
    await mdAvatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--m-md--Width', '60px');
    });

    const img = mdAvatar.locator('img');
    const width = await img.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('60px');
  });

  test('should support --pf-v6-c-avatar--m-lg--Width override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/size-variations/`);

    const avatars = page.locator(COMPONENT);
    const lgAvatar = avatars.filter({ has: page.locator('[size="lg"]') }).first();
    await expect(lgAvatar).toBeVisible();

    // Override large size width
    await lgAvatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--m-lg--Width', '100px');
    });

    const img = lgAvatar.locator('img');
    const width = await img.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('100px');
  });

  test('should support --pf-v6-c-avatar--m-xl--Width override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/size-variations/`);

    const avatars = page.locator(COMPONENT);
    const xlAvatar = avatars.filter({ has: page.locator('[size="xl"]') }).first();
    await expect(xlAvatar).toBeVisible();

    // Override extra large size width
    await xlAvatar.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-avatar--m-xl--Width', '150px');
    });

    const img = xlAvatar.locator('img');
    const width = await img.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('150px');
  });

  test('should cascade CSS variable overrides from parent', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    // Add wrapper div and apply CSS variable to it
    await page.evaluate(() => {
      const avatar = document.querySelector('pfv6-avatar');
      const wrapper = document.createElement('div');
      wrapper.style.setProperty('--pf-v6-c-avatar--Width', '80px');
      wrapper.style.setProperty('--pf-v6-c-avatar--Height', '80px');

      avatar?.parentNode?.insertBefore(wrapper, avatar);
      wrapper.appendChild(avatar!);
    });

    const avatar = page.locator(COMPONENT);
    const img = avatar.locator('img');

    const width = await img.evaluate((el) => getComputedStyle(el).width);
    const height = await img.evaluate((el) => getComputedStyle(el).height);

    expect(width).toBe('80px');
    expect(height).toBe('80px');
  });

  test('should use fallback values when CSS variables are not defined', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const avatar = page.locator(COMPONENT);
    await expect(avatar).toBeVisible();

    // Test that default values work without token variables
    await page.addStyleTag({
      content: `
        * {
          --pf-t--global--border--radius--pill: initial !important;
        }
      `
    });

    const img = avatar.locator('img');
    const borderRadius = await img.evaluate((el) => getComputedStyle(el).borderRadius);

    // Should use fallback value of 999px
    expect(borderRadius).toBe('999px');
  });
});
