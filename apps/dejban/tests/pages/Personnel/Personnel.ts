import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/helpers/BasePage';
import { Add as AddPersonnel } from './Add';
import { ActionsRow } from './ActionsRow';

export class Personnel extends BasePage {
  readonly page: Page;
  readonly addPersonnelPage: AddPersonnel;
  readonly assignRolePersonnelPage: ActionsRow;
  readonly changePasswordPage: ActionsRow;
  readonly personnelStep: Locator;
  readonly humanResourcesMenu: Locator;
  readonly personalStep: Locator;
  readonly organizationalStep: Locator;
  readonly vehicleStep: Locator;
  readonly PerssonelTypesMenu: Locator;

  readonly addPerssonelButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly rowsPerPage: Locator;

  readonly createPersonnel: Locator;
  readonly closeButton: Locator;
  readonly createButton: Locator;

  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly perssonelCode: Locator;
  readonly nationCode: Locator;
  readonly gender: Locator;

  readonly birthDate: Locator;
  readonly mobileNumber: Locator;
  readonly fatherName: Locator;
  readonly birthCertificateCode: Locator;
  readonly uploadPhotoButton: Locator;

  // Certificate Place
  readonly certificateCountry: Locator;
  readonly certificateProvince: Locator;
  readonly certificateCity: Locator;

  // Birth Place
  readonly birthCountry: Locator;
  readonly birthProvince: Locator;
  readonly birthCity: Locator;

  readonly contractStartDate: Locator;
  readonly contractEndDate: Locator;

  readonly employmentType: Locator;
  readonly organizationUnit: Locator;
  readonly employmentStatus: Locator;
  readonly position: Locator;

  readonly vehicleType: Locator;
  readonly plateType: Locator;
  readonly plateTwoDigits: Locator;
  readonly plateLetters: Locator;
  readonly plateThreeDigits: Locator;
  readonly plateCode: Locator;

  readonly additionalInfoAccordion: Locator;

  readonly model: Locator;
  readonly color: Locator;
  readonly fuelType: Locator;
  readonly chassisNumber: Locator;
  readonly vinNumber: Locator;
  readonly engineNumber: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addPersonnelPage = new AddPersonnel(page);
    this.assignRolePersonnelPage = new ActionsRow(page);
    this.changePasswordPage = new ActionsRow(page);

    this.humanResourcesMenu = page.getByText('مدیریت منابع انسانی');
    this.PerssonelTypesMenu = page.locator('a[href="/dejban/dashboard/personnel/staff"]');

    this.addPerssonelButton = page.getByRole('button', {
      name: 'افزودن پرسنل جدید',
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

    this.createPersonnel = page.getByText('ایجاد پرسنل ');
    this.closeButton = page.getByRole('button', { name: 'انصراف' });
    this.createButton = page.getByRole('button', { name: 'ثبت' });
    this.personnelStep = page.getByRole('button', {
      name: 'پرسنلی',
    });

    this.personalStep = page.getByRole('button', {
      name: 'شخصی',
    });

    this.organizationalStep = page.getByRole('button', {
      name: 'سازمانی',
    });

    this.vehicleStep = page.getByRole('button', {
      name: 'خودرو',
    });
    this.nameInput = page.locator('[name="firstName"]');
    this.lastNameInput = page.locator('[name="lastName"]');

    this.perssonelCode = page.getByRole('textbox', {
      name: 'کد پرسنلی',
    });

    this.nationCode = page.getByRole('textbox', {
      name: 'کد ملی',
    });

    this.gender = page.getByRole('combobox', {
      name: 'جنسیت',
    });

    this.birthDate = page.getByRole('group', { name: 'تاریخ تولد' });

    this.mobileNumber = page.getByRole('textbox', {
      name: 'شماره تماس',
    });

    this.fatherName = page.getByRole('textbox', {
      name: 'نام پدر',
    });

    this.birthCertificateCode = page.getByRole('textbox', {
      name: 'شماره شناسنامه',
    });

    this.uploadPhotoButton = page.locator('input[type="file"]');

    this.certificateCountry = page.getByRole('combobox', { name: 'کشور' }).first();
    this.certificateProvince = page.getByRole('combobox', { name: 'استان' }).first();
    this.certificateCity = page.getByRole('combobox', { name: 'شهر' }).first();
    this.birthCountry = page.getByRole('combobox', { name: 'کشور' }).nth(1);
    this.birthProvince = page.getByRole('combobox', { name: 'استان' }).nth(1);
    this.birthCity = page.getByRole('combobox', { name: 'شهر' }).nth(1);

    this.mobileNumber = page.locator('input[name="mobileNumber"]');
    this.fatherName = page.locator('input[name="fatherName"]');
    this.birthCertificateCode = page.locator('input[name="birthCertificateCode"]');

    this.uploadPhotoButton = page.locator('input[type="file"]');

    this.contractStartDate = page.getByLabel('تاریخ شروع قرارداد');
    this.contractEndDate = page.getByLabel('تاریخ پایان قرارداد');
    this.employmentType = page.getByRole('combobox', {
      name: 'نوع استخدام',
    });

    const dialog = page.getByRole('dialog', { name: 'ایجاد پرسنل' });
    this.organizationUnit = dialog.getByText('انتخاب مرکز یا واحد', { exact: true });

    this.employmentStatus = page.getByRole('combobox', {
      name: 'نوع اشتغال',
    });
    this.position = page.getByRole('combobox', {
      name: 'سمت',
    });
    this.vehicleType = page.getByRole('combobox', {
      name: 'نوع خودرو',
    });
    this.plateType = page.getByRole('combobox', {
      name: 'نوع پلاک',
    });

    this.plateTwoDigits = page.locator('[name="plateTwoDigits"]');
    this.plateLetters = page.locator('input[name="plateLetters"]').locator('..');
    this.plateThreeDigits = page.locator('[name="plateThreeDigits"]');
    this.plateCode = page.locator('[name="plateCode"]');

    this.additionalInfoAccordion = page.getByRole('button', {
      name: 'اطلاعات تکمیلی',
    });

    this.model = page.locator('[name="model"]');
    this.color = page.locator('[name="color"]');
    this.fuelType = page.locator('[name="fuelType"]');
    this.chassisNumber = page.locator('[name="chassisNumber"]');
    this.vinNumber = page.locator('[name="vinNumber"]');
    this.engineNumber = page.locator('[name="engineNumber"]');
  }

  async openPersonnelTypesPage() {
    await this.humanResourcesMenu.click();
    await this.PerssonelTypesMenu.click();
  }

  async verifyPersonnelTypesPage() {
    await expect(this.addPerssonelButton).toBeVisible();
    await expect(this.table).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.rowsPerPage).toBeVisible();
  }

  async openCreatePersonnelDialog() {
    await this.addPerssonelButton.click();
  }

  async verifyCreatePersonnelDialog() {
    await expect(this.personnelStep).toBeVisible();
    await expect(this.personalStep).toBeVisible();
    await expect(this.organizationalStep).toBeVisible();
    await expect(this.vehicleStep).toBeVisible();

    await expect(this.nameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.perssonelCode).toBeVisible();
    await expect(this.nationCode).toBeVisible();
    await expect(this.gender).toBeVisible();

    await expect(this.createButton).toBeVisible();
    await expect(this.closeButton).toBeVisible();
  }

  async verifyPersonalStep() {
    await expect(this.birthDate).toBeVisible();
    await expect(this.mobileNumber).toBeVisible();
    await expect(this.fatherName).toBeVisible();
    await expect(this.birthCertificateCode).toBeVisible();

    await expect(this.uploadPhotoButton).toBeAttached();

    await expect(this.certificateCountry).toBeAttached();
    await expect(this.certificateProvince).toBeAttached();
    await expect(this.certificateCity).toBeAttached();

    await expect(this.birthCountry).toBeAttached();
    await expect(this.birthProvince).toBeAttached();
    await expect(this.birthCity).toBeAttached();
  }

  async verifyOrganizationalTab() {
    await expect(this.contractStartDate).toBeVisible();
    await expect(this.contractEndDate).toBeVisible();

    await expect(this.employmentType).toBeVisible();
    await expect(this.organizationUnit).toBeVisible();
    await expect(this.employmentStatus).toBeVisible();
    await expect(this.position).toBeVisible();
  }

  async verifyVehicleTab() {
    await expect(this.vehicleType).toBeVisible();
    await expect(this.plateType).toBeVisible();

    await expect(this.plateTwoDigits).toBeVisible();
    await expect(this.plateLetters).toBeAttached();
    await expect(this.plateThreeDigits).toBeVisible();
    await expect(this.plateCode).toBeVisible();

    await expect(this.additionalInfoAccordion).toBeVisible();

    await expect(this.model).toBeVisible();
    await expect(this.color).toBeVisible();
    await expect(this.fuelType).toBeVisible();
    await expect(this.chassisNumber).toBeVisible();
    await expect(this.vinNumber).toBeVisible();
    await expect(this.engineNumber).toBeVisible();
  }

  async addPersonnel(data: {
    firstName: string;
    lastName: string;
    personnelCode: string;
    nationalCode: string;
    mobileNumber: string;
    fatherName: string;
    birthCertificateCode: string;
    plateTwoDigits: string;
    plateThreeDigits: string;
    plateCode: string;
  }) {
    await this.addPersonnelPage.addPersonnel(data);
  }

  async assignRole(data: { firstName: string; lastName: string }) {
    await this.assignRolePersonnelPage.assignRolePersonnel(data);
  }
  async changePassword(data: { firstName: string; password: string }) {
    await this.changePasswordPage.changePassword(data);
  }

  async closeButtonDialog() {
    await this.closeButton.click();
    await expect(this.createPersonnel).not.toBeVisible();
  }

  async search(value: string) {
    await this.searchInput.fill(value);
  }

  async verifySearchResultContains(value: string) {
    await expect(this.page.getByRole('cell', { name: value }).first()).toBeVisible();
  }

  async changeRowsPerPage(value: string) {
    await this.rowsPerPage.click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async verifyRowsCount(maxRows: number) {
    expect(await this.tableRows.count()).toBeLessThanOrEqual(maxRows);
  }
}
