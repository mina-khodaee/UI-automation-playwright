import { test, expect } from '@playwright/test';
import { URLS } from '../../../config/urls';

test.describe('smoke', () => {
  test.use({ storageState: undefined });
  test('login page loads', async ({ page }) => {
    await page.goto(URLS.base);
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});
