import { test, expect } from '@playwright/test';

test('app loads without critical errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  const response = await page.goto('/');
  expect(response?.status()).toBeLessThan(400);

  // Wait for the app to hydrate
  await page.waitForTimeout(3000);

  // Check that the page has rendered something meaningful
  const body = await page.locator('body').innerText();
  expect(body.length).toBeGreaterThan(10);

  // Report any JS errors
  if (errors.length > 0) {
    console.log('Page errors:', errors);
  }
  expect(errors).toHaveLength(0);
});

test('main routes are accessible', async ({ page }) => {
  const routes = ['/overview', '/locations', '/reviews', '/catalog', '/offline-conversions'];

  for (const route of routes) {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const response = await page.goto(route);
    expect(response?.status(), `${route} returned error status`).toBeLessThan(400);

    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log(`Errors on ${route}:`, errors);
    }
    expect(errors, `JS errors on ${route}`).toHaveLength(0);
  }
});
