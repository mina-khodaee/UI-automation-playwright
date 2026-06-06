import { test, expect } from 'tests/fixture';
import { URLS } from 'tests/config/urls';
import { loginData } from 'tests/data/loginData';

test.describe('smoke', () => {
  test('user can login successfully', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    await expect(page).toHaveURL(URLS.home);
    await expect(page.getByText('انتخاب ماژول')).toBeVisible();
  });

  test('user cannot login with invalid credentials', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Login failed');
  });
});
