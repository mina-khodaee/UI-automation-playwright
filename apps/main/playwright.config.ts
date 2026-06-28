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
  testIgnore: ['**/unitTest/**'],

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [['list', { printSteps: true }]],

  use: {
    baseURL: config.baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'smoke-public',
      testMatch: /.*smoke\/public\/.*\.spec\.ts/,
      use: { browserName: 'chromium' },
    },
    {
      name: 'smoke-auth',
      testMatch: /.*smoke\/auth\/.*\.spec\.ts/,
      use: { browserName: 'chromium' },
    },
    {
      name: 'regression',
      testMatch: /.*regression\/.*\.spec\.ts/,
      use: { browserName: 'chromium' },
    },
    {
      name: 'e2e',
      testMatch: /.*e2e\/.*\.spec\.ts/,
      use: { browserName: 'chromium' },
    },
  ],
});
