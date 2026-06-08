import { test, expect } from 'tests/fixture';
import { URLS } from 'tests/config/urls';

test.describe('smoke', () => {
  test('user can logout successfully', async ({ homePage, page }) => {
    await page.goto(URLS.home);
    await expect(page.getByText('انتخاب ماژول')).toBeVisible();
    await homePage.logout();
    await expect(page).toHaveURL(URLS.login);
  });

  // test('auth token is removed after logout', async ({ homePage,loginPage, page  }) => {
  //   await loginPage.goto();
  //   await loginPage.login(loginData.validUser.username, loginData.validUser.password);

  //   await homePage.logout();

  // const token = await page.evaluate(() => localStorage.getItem('token'));
  // expect(token).toBeFalsy();
});
