import { test } from '@playwright/test';
import { LoginPage } from 'tests/pages/LoginPage';
import { loginData } from 'tests/data/loginData';

test('save auth state', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(loginData.validUser.username, loginData.validUser.password);

  await page.waitForURL('**/home/');
  const token = await page.evaluate(() => localStorage.getItem('token'));
  console.log('TOKEN:', token);
  await page.context().storageState({ path: 'auth.json' });
});
