import { test as base, expect, Page } from '@playwright/test';
import { config } from 'tests/config/config';
import { loginViaApi } from 'tests/utils/auth';
import { Dashboard } from 'tests/pages/Dashboard';
import { Employment } from 'tests/pages/info/Employment';
import { EmploymentStatus } from 'tests/pages/info/EmploymentStatus';
import { Major } from 'tests/pages/info/Major';
import { Personnel } from 'tests/pages/Personnel/Personnel';
import { Center } from 'tests/pages/Centers/Center';
import { HomePage } from '../../../main/tests/pages/HomePage';

type MyFixtures = {
  pageWithAuth: Page;
  dashboard: Dashboard;
  employment: Employment;
  employmentStatus: EmploymentStatus;
  major: Major;
  personnel: Personnel;
  center: Center;
  homePage: HomePage;
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
  employmentStatus: async ({ page }, use) => {
    await use(new EmploymentStatus(page));
  },
  major: async ({ page }, use) => {
    await use(new Major(page));
  },
  personnel: async ({ page }, use) => {
    await use(new Personnel(page));
  },
  center: async ({ page }, use) => {
    await use(new Center(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
