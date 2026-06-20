import { test, expect } from 'tests/utils/fixture';
import { URLS } from 'tests/config/urls';

test.describe('smoke', () => {
  test('user can open and close settings', async ({ pageWithAuth, settingPage }) => {
    await pageWithAuth.goto(URLS.home);

    await settingPage.open();

    await expect(pageWithAuth.getByText('تنظیمات')).toBeVisible();

    await settingPage.close();

    await expect(pageWithAuth.getByText('تنظیمات')).not.toBeVisible();
  });
});
