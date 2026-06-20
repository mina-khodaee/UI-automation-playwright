import { test as base, expect, Page } from '@playwright/test';
import { config } from 'tests/config/config';
import { LoginPage } from 'tests/pages/LoginPage';
import { HomePage } from 'tests/pages/HomePage';
import { loginViaApi } from 'tests/utils/auth';
import { SettingPage } from 'tests/pages/SettingPage';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  pageWithAuth: Page;
  settingPage: SettingPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ pageWithAuth }, use) => {
    await use(new HomePage(pageWithAuth));
  },

  settingPage: async ({ pageWithAuth }, use) => {
    await use(new SettingPage(pageWithAuth));
  },

  pageWithAuth: async ({ browser, request }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const { accessToken } = await loginViaApi(request);

    await page.goto(config.baseURL);

    // inject BEFORE navigation
    await context.addInitScript((token) => {
      localStorage.setItem('jwt_access_token', token);
    }, accessToken);

    await use(page);

    await context.close();
  },
});

export { expect };
