import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly accountBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(private page: Page) {
    this.accountBtn = page.getByRole('button', { name: 'Account button' });
    this.logoutBtn = page.getByRole('button', { name: 'خروج' });
  }

  async logout() {
    await this.accountBtn.waitFor({ state: 'visible' });
    await this.accountBtn.click(); // step 1: open menu

    await this.logoutBtn.waitFor({ state: 'visible' });
    await this.logoutBtn.click(); // step 2: logout
  }
}
