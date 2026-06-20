import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  readonly accountBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(private page: Page) {
    this.accountBtn = page.getByRole('button', { name: 'Account button' });
    this.logoutBtn = page.getByRole('button', { name: 'خروج' });
  }

  async logout() {
    await expect(this.accountBtn).toBeVisible({ timeout: 15000 });
    await this.accountBtn.click();

    await expect(this.logoutBtn).toBeVisible({ timeout: 15000 });

    await this.logoutBtn.click();
  }
}
