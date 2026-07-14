import { test, expect } from 'tests/utils/fixture';
import { URLS } from '../../../../main/tests/config/urls';

test.describe('personnel', () => {
  test.beforeEach(async ({ dashboard, personnel }) => {
    await dashboard.open();
    await personnel.openPersonnelTypesPage();
  });

  test.describe('smoke', () => {
    test('should display personnel page', async ({ personnel }) => {
      await personnel.verifyPersonnelTypesPage();
    });
  });

  test.describe('add', () => {
    test.beforeEach(async ({ personnel }) => {
      await personnel.openCreatePersonnelDialog();
      await personnel.verifyCreatePersonnelDialog();
    });

    test('should create personnel successfully', async ({ personnel }) => {
      const timestamp = Date.now();
      const per = {
        firstName: `مینا${timestamp}`,
        lastName: 'خدایی',
        personnelCode: `qa-${timestamp}`,
        nationalCode: `12345${timestamp.toString().slice(-5)}`,
        mobileNumber: '09123456789',
        fatherName: 'محمد',
        birthCertificateCode: '123456',
        plateTwoDigits: '12',
        plateThreeDigits: '345',
        plateCode: '67',
      };
      await personnel.addPersonnel(per);

      await expect(personnel.createPersonnel).not.toBeVisible();

      await personnel.search(per.firstName);
      await personnel.verifySearchResultContains(per.firstName);

      await personnel.search(per.lastName);
      await personnel.verifySearchResultContains(per.lastName);

      await personnel.search(per.personnelCode);
      await personnel.verifySearchResultContains(per.personnelCode);

      await personnel.search(per.nationalCode);
      await personnel.verifySearchResultContains(per.nationalCode);
    });

    test('should close create Personnel dialog', async ({ personnel }) => {
      await personnel.closeButtonDialog();
    });
  });

  test.describe('search', () => {
    // test.beforeEach(async ({ personnel }) => {
    //   await personnel.openCreatePersonnelDialog();
    //   await personnel.verifyCreatePersonnelDialog();
    // });
    test('should search table', async ({ personnel }) => {
      // const timestamp = Date.now();
      // const personnel = {
      //   firstName: `مینا${timestamp}`,
      //   lastName: 'خدایی',
      //   personnelCode: `qa-${timestamp}`,
      //   nationalCode: `12345${timestamp.toString().slice(-5)}`,
      //   mobileNumber: '09123456789',
      //   fatherName: 'محمد',
      //   birthCertificateCode: '123456',
      //   plateTwoDigits: '12',
      //   plateThreeDigits: '345',
      //   plateCode: '67',
      // };
      // await personnel.addPersonnel(personnel);

      // await personnel.search(personnel.firstName);
      // await personnel.verifySearchResultContains(personnel.firstName);

      // await personnel.search(personnel.lastName);
      // await personnel.verifySearchResultContains(personnel.lastName);

      // await personnel.search(personnel.personnelCode);
      // await personnel.verifySearchResultContains(personnel.personnelCode);
      await personnel.search('مینا');
      await personnel.verifySearchResultContains('مینا');

      await personnel.search('خدایی');
      await personnel.verifySearchResultContains('خدایی');

      await personnel.search('1203');
      await personnel.verifySearchResultContains('1203');
    });
  });

  test.describe('pagination', () => {
    test('should change rows per page to 20', async ({ personnel }) => {
      await personnel.changeRowsPerPage('20');

      await personnel.verifyRowsCount(20);
    });
  });

  test.describe('actions row', () => {
    test('should assign role to personnel', async ({ personnel }) => {
      const data = {
        firstName: `مینا`,
        lastName: 'خدایی',
      };
      await personnel.assignRole(data);
    });
    test('should change password', async ({ personnel, homePage, page }) => {
      const data = {
        firstName: `مینا`,
        password: '1234567',
      };
      await personnel.changePassword(data);

      await homePage.logout();
    });
  });
});
