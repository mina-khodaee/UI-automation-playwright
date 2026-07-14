import { expect, Locator, Page } from '@playwright/test';

export class Major {
  readonly page: Page;

  readonly humanResourcesMenu: Locator;
  readonly infoMenu: Locator;
  readonly majorTypesMenu: Locator;

  readonly addMajorButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  readonly searchInput: Locator;
 readonly clearSearchButton: Locator;
  readonly rowsPerPage: Locator;

  readonly createMajor: Locator;
  readonly closeButton: Locator;
  readonly createButton: Locator;
  readonly updateButton: Locator;

  readonly nameInput: Locator;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;

  readonly majorNameRequiredError: Locator;
  readonly majorCodeRequiredError: Locator;

  readonly deleteButton: Locator;
  readonly deleteConfirmationDialog: Locator;

  readonly editMajorDialog: Locator;

  constructor(page: Page) {
    this.page = page;

    this.humanResourcesMenu = page.getByText('مدیریت منابع انسانی');
    this.infoMenu = page.getByText('اطلاعات پایه');
    this.majorTypesMenu = page.getByText('رشته تحصیلی');

    this.addMajorButton = page.getByRole('button', {
      name: 'افزودن رشته جدید',
    });

    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');

    this.searchInput = page.locator('input[placeholder="جستجو"]');
    this.clearSearchButton = page.getByRole('button', {
      name: 'پاک کردن جستجو',
    });

    this.rowsPerPage = page.getByRole('combobox', {
      name: 'تعداد ردیف در هر صفحه',
    });

    this.createMajor = page.getByText('ایجاد رشته ');
    this.closeButton = page.getByRole('button', { name: 'انصراف' });
    this.createButton = page.getByRole('button', { name: 'ایجاد' });
    this.updateButton = page.getByRole('button', {
      name: 'ثبت تغییرات',
    });

    this.nameInput = page.getByRole('textbox', {
      name: 'نام رشته',
    });

    this.codeInput = page.getByRole('textbox', {
      name: 'کد رشته',
    });

    this.descriptionInput = page.getByRole('textbox', {
      name: 'توضیحات',
    });

    this.majorNameRequiredError = page.getByText(
      'وارد کردن نام رشته الزامی است'
    );

    this.majorCodeRequiredError = page.getByText(
      'وارد کردن کد رشته الزامی است'
    );

    this.deleteButton = page.getByRole('button', {
      name: 'حذف',
    });

    this.deleteConfirmationDialog = page.getByText('تأیید حذف');

    this.editMajorDialog = page.getByText('ویرایش رشته ');
  }

  async openMajorTypesPage() {
    await this.humanResourcesMenu.click();
    await this.infoMenu.click();
    await this.majorTypesMenu.click();
  }

  async verifyMajorTypesPage() {
    await expect(this.addMajorButton).toBeVisible();
    await expect(this.table).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.rowsPerPage).toBeVisible();
  }

  async openCreateMajorDialog() {
    await this.addMajorButton.click();
  }

  async verifyCreateMajorDialog() {
    await expect(this.createMajor).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.codeInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.createButton).toBeVisible();
    await expect(this.closeButton).toBeVisible();
  }

  async closeButtonDialog() {
    await this.closeButton.click();
    await expect(this.createMajor).not.toBeVisible();
  }

  async addMajor(name: string, code: string, description?: string) {
    await this.nameInput.fill(name);
    await this.codeInput.fill(code);

    if (description) {
      await this.descriptionInput.fill(description);
    }

    await this.createButton.click();
  }

  async search(value: string) {
    await this.searchInput.fill(value);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async verifySearchResultContains(value: string) {
    await expect(
      this.page.getByRole('cell', { name: value }).first()
    ).toBeVisible();
  }

  async verifySearchResultNotContains(value: string) {
    await expect(
      this.page.getByRole('cell', { name: value }).first()
    ).not.toBeVisible();
  }

  async verifyMajorRequiredError() {
    await expect(this.majorNameRequiredError).toBeVisible();
    await expect(this.majorCodeRequiredError).toBeVisible();
  }

  async deleteMajor(name: string) {
    const row = this.page
      .locator('tr')
      .filter({
        has: this.page.getByRole('cell', { name }),
      })
      .first();

    await row.getByRole('button', {
      name: 'اقدامات ردیف',
    }).click();

    await this.page.getByRole('menuitem', {
      name: 'حذف',
    }).click();

    await expect(this.deleteConfirmationDialog).toBeVisible();

    await this.deleteButton.click();

    await expect(this.deleteConfirmationDialog).not.toBeVisible();
    await expect(row).toHaveCount(0);
  }

  async editMajor(
    oldName: string,
    newName: string,
    oldDescription: string,
    newDescription: string,
    oldCode: string,
    newCode: string
  ) {
    const row = this.page.locator('tr', {
      has: this.page.getByRole('cell', {
        name: oldName,
      }),
    });

    await row.getByRole('button', {
      name: 'اقدامات ردیف',
    }).click();

    await this.page.getByRole('menuitem', {
      name: 'ویرایش',
    }).click();

    await expect(this.editMajorDialog).toBeVisible();

    await this.nameInput.fill(newName);
    await this.codeInput.fill(newCode);
    await this.descriptionInput.fill(newDescription);

    await this.updateButton.click();

    await expect(this.editMajorDialog).not.toBeVisible();
  }

  async changeRowsPerPage(value: string) {
    await this.rowsPerPage.click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async verifyRowsCount(maxRows: number) {
    expect(await this.tableRows.count()).toBeLessThanOrEqual(maxRows);
  }
}