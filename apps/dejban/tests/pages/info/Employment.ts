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
  readonly employmentNameRequiredError: Locator;
  readonly deleteButton: Locator;
  readonly deleteConfirmationDialog: Locator;
  readonly editEploymentDialog: Locator;
  readonly updateButton: Locator;
  readonly tableRows: Locator;

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
    this.tableRows = page.locator('tbody tr');
    this.createEmployment = page.getByText('ایجاد نوع استخدام');
    this.closeButton = page.getByRole('button', { name: 'انصراف' });
    this.createButton = page.getByRole('button', { name: 'ایجاد' });
    this.nameInput = page.getByRole('textbox', { name: 'نام' });
    this.descriptionInput = page.getByRole('textbox', { name: 'توضیحات' });
    this.employmentNameRequiredError = page.getByText('وارد کردن نام الزامی است');
    this.deleteButton = page.getByRole('button', { name: 'حذف' });
    this.deleteConfirmationDialog = page.getByText('تأیید حذف');
    this.editEploymentDialog = page.getByText('ویرایش نوع استخدام');
    this.updateButton = page.getByRole('button', { name: 'ثبت تغییرات' });
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
  }

  async searchEmploymentType(name: string) {
    await this.searchInput.fill(name);
    await expect(this.page.getByRole('cell', { name }).first()).toBeVisible();
  }

  async clearSearch() {
    await expect(this.clearSearchButton).toBeEnabled();
    await this.clearSearchButton.click();
  }

  async searchEmploymentTypeNoteVisible(name: string) {
    await expect(this.page.getByRole('cell', { name }).first()).not.toBeVisible();
  }

  async verifyDuplicateEmploymentError() {
    await expect(this.page.getByText('نوع استخدام تکراری است')).toBeVisible();
  }

  async verifyEmploymentNameRequiredError() {
    await expect(this.employmentNameRequiredError).toBeVisible();
  }

  async deletEmployment(name: string) {
    const row = this.page
      .locator('tr')
      .filter({
        has: this.page.getByRole('cell', { name }),
      })
      .first();
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: 'اقدامات ردیف' }).click();

    await this.page.getByRole('menuitem', { name: 'حذف' }).click();

    await expect(this.deleteConfirmationDialog).toBeVisible();

    await this.deleteButton.click();

    await expect(this.deleteConfirmationDialog).not.toBeVisible();

    await expect(this.page.getByText('حذف نوع استخدام با موفقیت انجام شد')).toBeVisible();

    // Wait until the row is removed from DOM
    await expect(row).toHaveCount(0);
  }

  async editEmployment(
    oldName: string,
    newName: string,
    oldDescription: string,
    newDescription: string
  ) {
    const row = this.page.locator('tr', {
      has: this.page.getByRole('cell', { name: oldName }),
    });

    await row.getByRole('button', { name: 'اقدامات ردیف' }).click();

    await this.page.getByRole('menuitem', { name: 'ویرایش' }).click();

    await expect(this.editEploymentDialog).toBeVisible();

    await expect(this.nameInput).toHaveValue(oldName);
    await expect(this.descriptionInput).toHaveValue(oldDescription);

    await this.nameInput.clear();
    await this.nameInput.fill(newName);

    await this.descriptionInput.clear();
    await this.descriptionInput.fill(newDescription);

    await this.updateButton.click();

    await expect(this.editEploymentDialog).not.toBeVisible();
    await expect(this.page.getByText('به‌روزرسانی نوع استخدام با موفقیت انجام شد')).toBeVisible();

    const updatedRow = this.page.locator('tr', {
      has: this.page.getByRole('cell', { name: newName }),
    });

    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(newDescription);
  }

  async changeRowsPerPage(value: string) {
    await this.rowsPerPage.click();
    await this.page.getByRole('option', { name: value }).click();
    await expect(this.rowsPerPage).toHaveText(value);
  }
  async verifyRowsPerPageValue(value: string) {
    await expect(this.rowsPerPage).toHaveText(value);
  }
  async verifyRowsCount(maxRows: number) {
    const count = await this.tableRows.count();
    expect(count).toBeLessThanOrEqual(maxRows);
  }
}
