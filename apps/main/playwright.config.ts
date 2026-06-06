import { defineConfig } from '@playwright/test';
import { config } from './tests/config/config';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './tests/playwright-report',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list', { printSteps: true }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    baseURL: config.baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'smoke-public',
      testMatch: /.*smoke\/public\/.*\.spec\.ts/,
      use: {
        storageState: undefined, //without login
        channel: 'chrome',
      },
    },
    {
      name: 'smoke-auth',
      testMatch: /.*smoke\/auth\/.*\.spec\.ts/,
      use: {
        storageState: 'auth.json', //with login
        channel: 'chrome',
      },
    },
    {
      name: 'e2e',
      testMatch: /.*e2e\/.*\.spec\.ts/,
      use: {
        storageState: 'auth.json', //with login
        channel: 'chrome',
      },
    },
    // {
    //   name: 'main',
    //   testMatch: 'tests/smoke/specs/**/*.spec.ts',
    //   use: {
    //     baseURL: config.baseURL,
    //     launchOptions: {
    //       executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    //     },
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: config.baseURL,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
