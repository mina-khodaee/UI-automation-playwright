import { test, expect } from 'tests/utils/fixture';

test.describe('major', () => {
  test.beforeEach(async ({ dashboard, major }) => {
    await dashboard.open();
    await major.openMajorTypesPage();
  });

  test.describe('smoke', () => {
    test('should display major page', async ({ major }) => {
      await major.verifyMajorTypesPage();
    });
  });

  test.describe('add', () => {
    test.beforeEach(async ({ major }) => {
      await major.openCreateMajorDialog();
      await major.verifyCreateMajorDialog();
    });

    test('should close create major dialog', async ({ major }) => {
      await major.closeButtonDialog();
    });

    test('should add major successfully', async ({ major }) => {
      const timestamp = Date.now();

      const majorName = `تستی-${timestamp}`;
      const majorCode = `00-${timestamp}`;
      const description = `توضیح اول است - ${timestamp}`;

      await major.addMajor(majorName, majorCode, description);

      await major.search(majorName);
      await major.verifySearchResultContains(majorName);

      await major.search(majorCode);
      await major.verifySearchResultContains(majorCode);


      await expect(major.createMajor).not.toBeVisible();
      await expect(
        major.page.getByText('رشته با موفقیت ایجاد شد')
      ).toBeVisible();
    });

    test('should show error when major already exists', async ({ major }) => {
      await major.addMajor('نرم افزار', '001');

      await expect(
        major.page.getByText('این کد تحصیلی قبلا ثبت شده است')
      ).toBeVisible();
    });

    test('should show required validation when name and code is empty', async ({
      major,
    }) => {
      await major.addMajor('', '', '');

      await major.verifyMajorRequiredError();
    });
  });

  test.describe('search', () => {
    test.beforeEach(async ({ major }) => {
      await major.openCreateMajorDialog();
      await major.verifyCreateMajorDialog();
    });

    test('should search major by name', async ({ major }) => {
      const timestamp = Date.now();

      const majorName = `جستجو-${timestamp}`;
      const majorCode = `00-${timestamp}`;

      await major.addMajor(majorName, majorCode);

      await major.search(majorName);

      await major.verifySearchResultContains(majorName);
      await major.verifySearchResultNotContains('نرم افزار');
    });

    test('should search major by code', async ({ major }) => {
      const timestamp = Date.now();

      const majorName = `جستجو-${timestamp}`;
      const majorCode = `00-${timestamp}`;

      await major.addMajor(majorName, majorCode);

      await major.search(majorCode);

      await major.verifySearchResultContains(majorCode);
      await major.verifySearchResultNotContains('001');
    });

    test('should clear search', async ({ major }) => {
      const timestamp = Date.now();

      const majorName = `جستجو-${timestamp}`;
      const majorCode = `00-${timestamp}`;

      await major.addMajor(majorName, majorCode);

      await major.search(majorName);
      await major.verifySearchResultContains(majorName);

      await major.clearSearch();

      await expect(major.searchInput).toHaveValue('');
      await expect(major.tableRows.first()).toBeVisible();
    });
  });

  test.describe('delete', () => {
    test('should delete major successfully', async ({ major }) => {
      const timestamp = Date.now();

      const majorName = `سناریو حذف-${timestamp}`;
      const majorCode = `00-${timestamp}`;

      await major.openCreateMajorDialog();
      await major.verifyCreateMajorDialog();

      await major.addMajor(majorName, majorCode);

      await major.search(majorName);
      await major.verifySearchResultContains(majorName);

      await major.deleteMajor(majorName);
    });
  });

  test.describe('edit', () => {
    test('should edit major successfully', async ({ major }) => {
      const timestamp = Date.now();

      const oldName = `تست ویرایش-${timestamp}`;
      const oldCode = `0023-${timestamp}`;
      const oldDescription = `توضیح برای ویرایش-${timestamp}`;

      const newName = `ویرایش شده-${timestamp}`;
      const newCode = `0033-${timestamp}`;
      const newDescription = `توضیح ویرایش شده-${timestamp}`;

      await major.openCreateMajorDialog();
      await major.verifyCreateMajorDialog();

      await major.addMajor(oldName, oldCode, oldDescription);

      await major.editMajor(
        oldName,
        newName,
        oldDescription,
        newDescription,
        oldCode,
        newCode
      );
    });
  });

  test.describe('pagination', () => {
    test('should change rows per page to 20', async ({ major }) => {
      await major.changeRowsPerPage('20');

      await major.verifyRowsCount(20);
    });
  });
});