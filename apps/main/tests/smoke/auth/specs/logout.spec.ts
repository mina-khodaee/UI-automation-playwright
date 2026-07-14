import { test, expect } from 'tests/utils/fixture';
import { URLS } from 'tests/config/urls';
import { loginData } from 'tests/data/loginData';

test.describe('smoke', () => {
  test('user can logout successfully', async ({ loginPage, homePage, page }) => {
    await loginPage.goto();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);

    await expect(page).toHaveURL(new RegExp(URLS.home));

    await homePage.logout();
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      localStorage.removeItem('jwt_access_token');
    });

    expect(await page.evaluate(() => localStorage.getItem('jwt_access_token'))).toBeNull();

    await page.goto(URLS.login);
    await expect(page).toHaveURL(URLS.login);
    await expect(page.getByRole('button', { name: 'ورود' })).toBeVisible();
  });

  // test('user can logout successfully', async ({ pageWithAuth, homePage }) => {
  //   await pageWithAuth.goto(URLS.home);

  //   await expect(pageWithAuth.getByRole('heading', { name: 'دژبان' })).toBeVisible();
  //   await homePage.logout();

  //   await pageWithAuth.waitForURL(URLS.login);
  // const token = await pageWithAuth.evaluate(() => localStorage.getItem('jwt_access_token'));
  // expect(token).toBeNull();
  //   await pageWithAuth.waitForURL(URLS.login);
  //   // await expect(pageWithAuth).toHaveURL(URLS.login);
  // });

  // test('auth token is removed after logout', async ({ homePage,loginPage, page  }) => {
  //   await loginPage.goto();
  //   await loginPage.login(loginData.validUser.username, loginData.validUser.password);

  //   await homePage.logout();

  // const token = await page.evaluate(() => localStorage.getItem('token'));
  // expect(token).toBeFalsy();
});
