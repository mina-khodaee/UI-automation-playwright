import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/helpers/BasePage';

export class ActionsRow extends BasePage {
  readonly page: Page;
  readonly createButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.createButton = page.getByRole('button', { name: 'ثبت' });
  }

  async assignRolePersonnel(data: { firstName: string; lastName: string }) {
    const row = this.page.locator('tr', {
      has: this.page.getByRole('cell', {
        name: data.firstName,
      }),
    });
    await row
      .getByRole('button', {
        name: 'اقدامات ردیف',
      })
      .click();

    await this.page
      .getByRole('menuitem', {
        name: 'اعطای نقش',
      })
      .click();

    await expect(
      this.page.getByText(`اعطای نقش به ${data.firstName} ${data.lastName}`, { exact: true })
    ).toBeVisible();

    const roles = this.page.getByRole('combobox', {
      name: 'نقش‌ها',
    });
    await this.selectOption(roles, 'SuperAdmin');

    const centers = this.page.getByRole('combobox', {
      name: 'مراکز',
    });
    await this.selectOption(centers, 'پیام گستر فاوا');

    await this.createButton.click();

    await expect(
      this.page.getByText(`اعطای نقش به ${data.firstName}`, { exact: true })
    ).not.toBeVisible();
  }

  async changePassword(data: { firstName: string; password: string }) {
    const row = this.page.locator('tr', {
      has: this.page.getByRole('cell', {
        name: data.firstName,
      }),
    });
    const actionsButton = row.getByRole('button', {
      name: 'اقدامات ردیف',
    });

    await actionsButton.click();

    await this.page
      .getByRole('menuitem', {
        name: 'تغییر نام کاربری / رمز عبور',
      })
      .click();

    await expect(
      this.page.getByRole('heading', {
        name: 'تغییر نام کاربری / رمز عبور',
      })
    ).toBeVisible();
    const userName = this.page.locator('input[name="userName"]');
    const currentUsername = await userName.inputValue();
    await this.fillInput(userName, currentUsername);

    const password = this.page.locator('input[name="password"]');
    await this.fillInput(password, data.password);

    await this.createButton.click();

    await expect(
      this.page.getByRole('heading', {
        name: 'تغییر نام کاربری / رمز عبور',
      })
    ).not.toBeVisible();
    await this.page.mouse.click(5, 5);
  }
}
