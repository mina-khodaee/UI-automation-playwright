import { Locator, Page } from '@playwright/test';
import { URLS } from '../config/urls';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.username = page.locator('[name="username"]');
    this.password = page.locator('[name="password"]');
    this.submitBtn = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.MuiAlert-message');
  }

  async goto() {
    await this.page.goto(URLS.login);
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submitBtn.click();
  }
}
