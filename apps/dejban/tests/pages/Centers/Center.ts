import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/helpers/BasePage';

export class Center extends BasePage {
  readonly page: Page;

  readonly centerMenu: Locator;
  readonly centerTypesMenu: Locator;

  readonly addCenterutton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly rowsPerPage: Locator;

  readonly createCenter: Locator;
  readonly closeButton: Locator;
  readonly createButton: Locator;
  readonly updateButton: Locator;

  readonly nameInput: Locator;
  readonly parentInput: Locator;
  readonly descriptionInput: Locator;

  readonly nameRequiredError: Locator;
  readonly parentCenterRequiredError: Locator;

  readonly deleteButton: Locator;
  readonly deleteConfirmationDialog: Locator;

  readonly editCenterDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.centerMenu = page.getByText('مرکز بندی');
    this.centerTypesMenu = page.locator('a[aria-label="sites.title"]');

    this.addCenterutton = page.getByRole('button', {
      name: 'افزودن مرکز',
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

    this.createCenter = page.getByText('ایجاد مرکز ');
    this.closeButton = page.getByRole('button', { name: 'انصراف' });
    this.createButton = page.getByRole('button', { name: 'ایجاد' });
    this.updateButton = page.getByRole('button', {
      name: 'به‌روزرسانی',
    });

    this.nameInput = page.getByRole('textbox', {
      name: 'نام مرکز',
    });

    this.parentInput = page.getByRole('combobox', {
      name: 'مرکز والد',
    });

    this.descriptionInput = page.getByRole('textbox', {
      name: 'توضیحات',
    });

    this.nameRequiredError = page.getByText('نام سایت اجباری است');

    this.parentCenterRequiredError = page.getByText('نام سایت والد اجباری است');

    this.deleteButton = page.getByRole('button', {
      name: 'حذف',
    });

    this.deleteConfirmationDialog = page.getByText('تأیید حذف');

    this.editCenterDialog = page.getByText('ویرایش مرکز ');
  }

  async openCentersPage() {
    await this.centerMenu.click();
    await this.centerTypesMenu.click();
  }

  async verifyCenterPage() {
    await expect(this.addCenterutton).toBeVisible();
    await expect(this.table).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.rowsPerPage).toBeVisible();
  }

  async openCreateCenterDialog() {
    await this.addCenterutton.click();
  }

  async verifyCreateCenterDialog() {
    await expect(this.createCenter).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.parentInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.createButton).toBeVisible();
    await expect(this.closeButton).toBeVisible();
  }

  async closeButtonDialog() {
    await this.closeButton.click();
    await expect(this.createCenter).not.toBeVisible();
  }

  async addCenter(name: string, parentInput: string, description?: string) {
    await this.nameInput.fill(name);
    if (parentInput?.trim()) {
      await this.selectOption(this.parentInput, parentInput);
    }

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
    await expect(this.page.getByRole('cell', { name: value }).first()).toBeVisible();
  }

  async verifySearchResultNotContains(value: string) {
    await expect(this.page.getByRole('cell', { name: value }).first()).not.toBeVisible();
  }

  async verifyCenterRequiredError() {
    await expect(this.nameRequiredError).toBeVisible();
    await expect(this.parentCenterRequiredError).toBeVisible();
  }

  async deleteCenter(name: string) {
    const row = this.page
      .locator('tr')
      .filter({
        has: this.page.getByRole('cell', { name }),
      })
      .first();

    await row
      .getByRole('button', {
        name: 'اقدامات ردیف',
      })
      .click();

    await this.page
      .getByRole('menuitem', {
        name: 'حذف',
      })
      .click();

    await expect(this.deleteConfirmationDialog).toBeVisible();

    await this.deleteButton.click();

    await expect(this.deleteConfirmationDialog).not.toBeVisible();
    await expect(row).toHaveCount(0);
  }

  async editCenter(
    oldName: string,
    newName: string,
    oldDescription: string,
    newDescription: string,
    oldParentcenter: string,
    newParentCenter: string
  ) {
    const row = this.page.locator('tr', {
      has: this.page.getByRole('cell', {
        name: oldName,
      }),
    });

    await row
      .getByRole('button', {
        name: 'اقدامات ردیف',
      })
      .click();

    await this.page
      .getByRole('menuitem', {
        name: 'ویرایش',
      })
      .click();

    await expect(this.editCenterDialog).toBeVisible();

    await this.nameInput.fill(newName);
    await this.selectOption(this.parentInput, newParentCenter);

    await this.descriptionInput.fill(newDescription);

    await this.updateButton.click();

    await expect(this.editCenterDialog).not.toBeVisible();
  }

  async changeRowsPerPage(value: string) {
    await this.rowsPerPage.click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async verifyRowsCount(maxRows: number) {
    expect(await this.tableRows.count()).toBeLessThanOrEqual(maxRows);
  }
}
