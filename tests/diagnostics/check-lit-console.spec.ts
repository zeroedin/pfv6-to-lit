import { test } from '@playwright/test';

test('Check Lit demo console errors', async ({ page }) => {
  const consoleMessages: string[] = [];
  const errors: string[] = [];

  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(text);
    }
  });

  page.on('pageerror', error => {
    errors.push(`[pageerror] ${error.message}`);
  });

  await page.goto('http://localhost:8000/elements/pfv6-card/demo/basic-cards');
  await page.waitForTimeout(2000); // Wait for any async errors

  console.log('\n📊 Console Messages:\n' + '='.repeat(80));
  consoleMessages.forEach(msg => console.log(msg));

  console.log('\n❌ Errors/Warnings:\n' + '='.repeat(80));
  if (errors.length > 0) {
    errors.forEach(err => console.log(err));
  } else {
    console.log('No errors or warnings found!');
  }

  console.log('\n📐 Page Content:');
  const cardContent = await page.locator('pfv6-card').first().innerHTML();
  console.log('Card element HTML:', cardContent.substring(0, 200));
});

