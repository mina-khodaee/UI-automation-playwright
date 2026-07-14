import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/helpers/BasePage';

export class Add extends BasePage {
  readonly page: Page;

  readonly personnelStep: Locator;
  readonly personalStep: Locator;
  readonly organizationalStep: Locator;
  readonly vehicleStep: Locator;

  readonly closeButton: Locator;
  readonly createButton: Locator;
  readonly updateButton: Locator;

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

  //   readonly additionalInfoAccordion: Locator;

  //   readonly model: Locator;
  //   readonly color: Locator;
  //   readonly fuelType: Locator;
  //   readonly chassisNumber: Locator;
  //   readonly vinNumber: Locator;
  //   readonly engineNumber: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.closeButton = page.getByRole('button', { name: 'انصراف' });
    this.createButton = page.getByRole('button', { name: 'ثبت' });
    this.updateButton = page.getByRole('button', {
      name: 'ویرایش',
    });
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

    // this.additionalInfoAccordion = page.getByRole('button', {
    //   name: 'اطلاعات تکمیلی',
    // });

    // this.model = page.locator('[name="model"]');
    // this.color = page.locator('[name="color"]');
    // this.fuelType = page.locator('[name="fuelType"]');
    // this.chassisNumber = page.locator('[name="chassisNumber"]');
    // this.vinNumber = page.locator('[name="vinNumber"]');
    // this.engineNumber = page.locator('[name="engineNumber"]');
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
    // Personnel
    await this.nameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.perssonelCode.fill(data.personnelCode);
    await this.nationCode.fill(data.nationalCode);
    await this.selectOption(this.gender, 'زن');

    await this.personalStep.click();
    await this.birthDate.getByRole('spinbutton', { name: 'سال' }).fill('1378');
    await this.birthDate.getByRole('spinbutton', { name: 'ماه' }).fill('05');
    await this.birthDate.getByRole('spinbutton', { name: 'روز' }).fill('20');
    await this.mobileNumber.fill(data.mobileNumber);
    await this.fatherName.fill(data.fatherName);
    await this.birthCertificateCode.fill(data.birthCertificateCode);
    // Certificate Place
    await this.selectOption(this.certificateCountry, 'ایران');
    await this.selectOption(this.certificateProvince, 'البرز');
    await this.selectOption(this.certificateCity, 'گرمدره');
    // Birth Place
    await this.selectOption(this.birthCountry, 'ایران');
    await this.selectOption(this.birthProvince, 'البرز');
    await this.selectOption(this.birthCity, 'گرمدره');
    // Organizational
    await this.organizationalStep.click();
    await this.contractStartDate.getByRole('spinbutton', { name: 'سال' }).fill('1405');
    await this.contractStartDate.getByRole('spinbutton', { name: 'ماه' }).fill('04');
    await this.contractStartDate.getByRole('spinbutton', { name: 'روز' }).fill('18');

    await this.contractEndDate.getByRole('spinbutton', { name: 'سال' }).fill('1406');
    await this.contractEndDate.getByRole('spinbutton', { name: 'ماه' }).fill('04');
    await this.contractEndDate.getByRole('spinbutton', { name: 'روز' }).fill('18');

    await this.selectOption(this.employmentType, 'رسمی');
    await this.selectOption(this.employmentStatus, 'شاغل');
    await this.selectOption(this.position, 'رییس هیئت مدیره');
    await this.organizationUnit.click();
    await this.checkTreeItem('پیام گستر فاوا', 'واحد توسعه دژبان');
    // Vehicle
    // await this.vehicleStep.click();
    // await this.selectOption(this.vehicleType, 'خودرو');
    // await this.selectOption(this.plateType, 'استاندارد');
    // await this.plateTwoDigits.fill(data.plateTwoDigits);
    // await this.plateThreeDigits.fill(data.plateThreeDigits);
    // await this.selectOption(this.plateLetters, 'ب');
    // await this.plateCode.fill(data.plateCode);
    await this.createButton.click();
  }
}
