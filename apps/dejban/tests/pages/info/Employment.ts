import { expect, Locator, Page } from '@playwright/test';

export class Employment {
  readonly page: Page;

  readonly humanResourcesMenu: Locator;
  readonly infoMenu: Locator;
  readonly employmentTypesMenu: Locator;
  readonly addEmploymentButton: Locator;
  readonly table: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly rowsPerPage: Locator;
  readonly createEmployment: Locator;
  readonly closeButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.humanResourcesMenu = page.getByText('مدیریت منابع انسانی');
    this.infoMenu = page.getByText('اطلاعات پایه');
    this.employmentTypesMenu = page.getByText('انواع استخدام');

    this.addEmploymentButton = page.getByRole('button', {
      name: 'افزودن نوع استخدام جدید',
    });

    this.table = page.locator('table');

    this.searchInput = page.locator('input[placeholder="جستجو"]');
    this.clearSearchButton = page.getByRole('button', { name: 'پاک کردن جستجو' });
    this.rowsPerPage = page.getByRole('combobox', {
      name: 'تعداد ردیف در هر صفحه',
    });
    this.createEmployment = page.getByText('ایجاد نوع استخدام');
    this.closeButton = page.getByRole('button', { name: 'انصراف' });
    this.createButton = page.getByRole('button', { name: 'ایجاد' });
    this.nameInput = page.getByRole('textbox', { name: 'نام' });
    this.descriptionInput = page.getByRole('textbox', { name: 'توضیحات' });
  }

  async openEmploymentTypesPage() {
    await this.humanResourcesMenu.click();
    await this.infoMenu.click();
    await this.employmentTypesMenu.click();
  }
  async verifyEmploymentTypesPage() {
    await expect(this.addEmploymentButton).toBeVisible();
    await expect(this.table).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.rowsPerPage).toBeVisible();
  }
  async searchEmploymentType(name: string) {
    await this.searchInput.fill(name);
    await expect(this.page.getByText(name)).toBeVisible();
  }
  async clearSearch() {
    await this.clearSearchButton.click();
  }
  async searchEmploymentTypeNoteVisible(name: string) {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }
  async openCreateEmploymentDialog() {
    await this.addEmploymentButton.click();
  }
  async closeButtonDialog() {
    await this.closeButton.click();
    await expect(this.createEmployment).not.toBeVisible();
  }
  async verifyCreateEmploymentDialog() {
    await expect(this.createEmployment).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.closeButton).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }
  async addEmployment(name: string, description?: string) {
    await this.nameInput.fill(name);
    if (description) {
      await this.descriptionInput.fill(description);
    }
    await this.createButton.click();

    await expect(this.createEmployment).not.toBeVisible();
    await expect(this.page.getByText(name)).toBeVisible();
    if (description) {
      await expect(this.page.getByText(description)).toBeVisible();
    }
  }
}
