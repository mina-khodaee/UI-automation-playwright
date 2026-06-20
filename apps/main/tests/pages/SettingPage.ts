import { Page, Locator } from '@playwright/test';

export class SettingPage {
  readonly settingBtn: Locator;
  readonly closeBtn: Locator;
  readonly darkModeToggle: Locator;
  readonly directionToggle: Locator;

  constructor(private page: Page) {
    this.settingBtn = page.locator('button[aria-label="Settings button"]');
    this.closeBtn = page.locator('button[aria-label="بستن"]');
    this.darkModeToggle = page.locator('input[name="حالت تیره"]');
    this.directionToggle = page.locator('input[type="checkbox"][name="راست به چپ"]');
  }

  async open() {
    await this.settingBtn.click();
  }

  async close() {
    await this.closeBtn.click();
  }

  async enableDarkMode() {
    await this.darkModeToggle.check();
  }

  async disableDarkMode() {
    await this.darkModeToggle.uncheck();
  }

  async getAppSettings() {
    return this.page.evaluate(() => JSON.parse(localStorage.getItem('app-settings') || '{}'));
  }
  async toggleDirection() {
    await this.directionToggle.click();
  }
}
