import { test, expect } from 'tests/utils/fixture';
import { URLS } from 'tests/config/urls';

test.describe('smoke', () => {
  test('user can logout successfully', async ({ pageWithAuth, homePage }) => {
    await pageWithAuth.goto(URLS.home);

    await expect(pageWithAuth.getByRole('heading', { name: 'دژبان' })).toBeVisible();

    await homePage.logout();

    const token = await pageWithAuth.evaluate(() => localStorage.getItem('jwt_access_token'));
    expect(token).toBeNull();
    await expect(pageWithAuth).toHaveURL(URLS.login);
  });

  // test('auth token is removed after logout', async ({ homePage,loginPage, page  }) => {
  //   await loginPage.goto();
  //   await loginPage.login(loginData.validUser.username, loginData.validUser.password);

  //   await homePage.logout();

  // const token = await page.evaluate(() => localStorage.getItem('token'));
  // expect(token).toBeFalsy();
});
