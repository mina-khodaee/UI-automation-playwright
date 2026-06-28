import { test as base, expect, Page } from '@playwright/test';
import { config } from 'tests/config/config';
import { loginViaApi } from 'tests/utils/auth';
import { Dashboard } from 'tests/pages/Dashboard';
import { Employment } from 'tests/pages/info/Employment';

type MyFixtures = {
  pageWithAuth: Page;
  dashboard: Dashboard;
  employment: Employment;
};

export const test = base.extend<MyFixtures>({
  page: async ({ browser, request }, use) => {
    const context = await browser.newContext();
    const { accessToken } = await loginViaApi(request);
    await context.addInitScript((token) => {
      localStorage.setItem('jwt_access_token', token);
    }, accessToken);
    const page = await context.newPage();
    await page.goto(config.baseURL);
    await use(page);
    await context.close();
  },
  dashboard: async ({ page }, use) => {
    await use(new Dashboard(page));
  },
  employment: async ({ page }, use) => {
    await use(new Employment(page));
  },
});

export { expect };
