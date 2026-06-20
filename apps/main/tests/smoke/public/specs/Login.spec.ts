import { test, expect } from 'tests/utils/fixture';
import { URLS } from 'tests/config/urls';
import { loginData } from 'tests/data/loginData';

test.describe('smoke', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(URLS.base);
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
  test('user can login successfully', async ({ loginPage, page }) => {
    await loginPage.goto();

    await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    await expect(page).toHaveURL(new RegExp(URLS.home));

    await expect(page.getByRole('heading', { name: 'دژبان' })).toBeVisible();
  });

  test('user cannot login with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Login failed');
  });
  test('user cannot login with empty username', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', loginData.validUser.password);

    await expect(loginPage.usernameRequired).toBeVisible();
  });

  test('user cannot login with empty password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.validUser.username, '');

    await expect(loginPage.passwordRequired).toBeVisible();
  });

  test('user cannot login with empty username and password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');

    await expect(loginPage.usernameRequired).toBeVisible({ timeout: 5000 });
    await expect(loginPage.passwordRequired).toBeVisible({ timeout: 5000 });
  });

  test('user remains logged in after refresh', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);

    await expect(page).toHaveURL(URLS.home);

    await page.reload();

    await expect(page).toHaveURL(URLS.home);
  });
});
