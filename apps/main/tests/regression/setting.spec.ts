import { test, expect } from 'tests/utils/fixture';
import { URLS } from 'tests/config/urls';

test.describe('regression', () => {
  test('User can enable dark mode', async ({ pageWithAuth, settingPage }) => {
    await pageWithAuth.goto(URLS.home);
    await settingPage.open();
    await settingPage.enableDarkMode();

    await expect(pageWithAuth.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
    expect((await settingPage.getAppSettings()).mode).toBe('dark');
    await settingPage.disableDarkMode();

    await expect(pageWithAuth.locator('html')).toHaveAttribute('data-color-scheme', 'light');
    expect((await settingPage.getAppSettings()).mode).toBe('light');
  });

  test('User can change menu direction', async ({ pageWithAuth, settingPage }) => {
    await pageWithAuth.goto(URLS.home);
    await settingPage.open();

    //ltr
    await settingPage.toggleDirection();
    await expect(pageWithAuth.locator('html')).toHaveAttribute('dir', 'ltr', { timeout: 10000 });

    //rtl
    await settingPage.toggleDirection();
    await expect(pageWithAuth.locator('html')).toHaveAttribute('dir', 'rtl', { timeout: 10000 });
  });

  test('User can toggle fullscreen mode', async ({ pageWithAuth, settingPage }) => {
    await pageWithAuth.goto(URLS.home);
    await settingPage.open();
    await settingPage.fullScreenShow();

    // Enter fullscreen
    await expect
      .poll(async () => pageWithAuth.evaluate(() => !!document.fullscreenElement))
      .toBe(true);

    // Exit fullscreen
    await pageWithAuth.evaluate(() => document.exitFullscreen());
    await expect
      .poll(async () => pageWithAuth.evaluate(() => !!document.fullscreenElement))
      .toBe(false);
  });
});
