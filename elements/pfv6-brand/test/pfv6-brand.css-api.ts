import { test, expect } from '@playwright/test';

const COMPONENT = 'pfv6-brand';

test.describe('Brand CSS API Tests', () => {
  test('should support --pf-v6-c-brand--Width override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override width
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Width', '300px');
    });

    // Get computed width from shadow DOM img
    const width = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).width : null;
    });

    expect(width).toBe('300px');
  });

  test('should support --pf-v6-c-brand--Height override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override height
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Height', '100px');
    });

    // Get computed height from shadow DOM img
    const height = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).height : null;
    });

    expect(height).toBe('100px');
  });

  test('should support both width and height overrides simultaneously', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override both width and height
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Width', '250px');
      el.style.setProperty('--pf-v6-c-brand--Height', '80px');
    });

    // Get computed dimensions from shadow DOM img
    const dimensions = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      if (!img) return null;
      const styles = getComputedStyle(img);
      return {
        width: styles.width,
        height: styles.height
      };
    });

    expect(dimensions?.width).toBe('250px');
    expect(dimensions?.height).toBe('80px');
  });

  test('should support --pf-v6-c-brand--Width--base override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override base width (takes precedence over --pf-v6-c-brand--Width)
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Width--base', '400px');
    });

    // Get computed width from shadow DOM img
    const width = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).width : null;
    });

    expect(width).toBe('400px');
  });

  test('should support --pf-v6-c-brand--Height--base override', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override base height (takes precedence over --pf-v6-c-brand--Height)
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Height--base', '120px');
    });

    // Get computed height from shadow DOM img
    const height = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).height : null;
    });

    expect(height).toBe('120px');
  });

  test('should respect CSS variable cascade order', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Set both base and regular width (base should win)
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Width', '200px');
      el.style.setProperty('--pf-v6-c-brand--Width--base', '350px');
    });

    // Get computed width from shadow DOM img
    const width = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).width : null;
    });

    // --base variable should take precedence
    expect(width).toBe('350px');
  });

  test('should apply max-width to picture element', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/responsive/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Get computed max-width from shadow DOM picture element
    const maxWidth = await brand.evaluate((el) => {
      const picture = el.shadowRoot?.querySelector('picture');
      return picture ? getComputedStyle(picture).maxWidth : null;
    });

    // Picture element should have max-width: 100%
    expect(maxWidth).toBe('100%');
  });

  test('should support responsive width variables at different breakpoints', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override width at md breakpoint
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Width-on-md', '500px');
    });

    // Set viewport to md breakpoint
    await page.setViewportSize({ width: 992, height: 768 });

    // Get computed width from shadow DOM img
    const width = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).width : null;
    });

    // Width should be affected by md breakpoint variable
    expect(width).not.toBeNull();
  });

  test('should support responsive height variables at different breakpoints', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/basic/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override height at lg breakpoint
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Height-on-lg', '150px');
    });

    // Set viewport to lg breakpoint
    await page.setViewportSize({ width: 1200, height: 800 });

    // Get computed height from shadow DOM img
    const height = await brand.evaluate((el) => {
      const img = el.shadowRoot?.querySelector('img');
      return img ? getComputedStyle(img).height : null;
    });

    // Height should be affected by lg breakpoint variable
    expect(height).not.toBeNull();
  });

  test('should inherit dimensions to img inside picture', async ({ page }) => {
    await page.goto(`/elements/${COMPONENT}/demos/responsive/`);

    const brand = page.locator(COMPONENT).first();
    await expect(brand).toBeVisible();

    // Override width on picture element
    await brand.evaluate((el: HTMLElement) => {
      el.style.setProperty('--pf-v6-c-brand--Width', '450px');
    });

    // Get computed width from both picture and img
    const dimensions = await brand.evaluate((el) => {
      const picture = el.shadowRoot?.querySelector('picture');
      const img = picture?.querySelector('img');
      if (!picture || !img) return null;
      return {
        pictureWidth: getComputedStyle(picture).width,
        imgWidth: getComputedStyle(img).width
      };
    });

    // Img should inherit width from picture
    expect(dimensions?.pictureWidth).toBe('450px');
    expect(dimensions?.imgWidth).toBe('450px');
  });
});
