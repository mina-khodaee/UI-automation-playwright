import { test, expect } from 'tests/utils/fixture';

test.describe('center', () => {
  test.beforeEach(async ({ dashboard, center }) => {
    await dashboard.open();
    await center.openCentersPage();
  });

  test.describe('smoke', () => {
    test('should display center page', async ({ center }) => {
      await center.verifyCenterPage();
    });
  });

  test.describe('add', () => {
    test.beforeEach(async ({ center }) => {
      await center.openCreateCenterDialog();
      await center.verifyCreateCenterDialog();
    });

    test('should close create center dialog', async ({ center }) => {
      await center.closeButtonDialog();
    });

    test('should add center successfully', async ({ center }) => {
      const timestamp = Date.now();

      const centerName = `تستی-${timestamp}`;
      const parentInput = `پیام گستر فاوا`;
      const description = `توضیح اول است - ${timestamp}`;

      await center.addCenter(centerName, parentInput, description);

      await center.search(centerName);
      await center.verifySearchResultContains(centerName);

      await center.search(parentInput);
      await center.verifySearchResultContains(parentInput);

      await expect(center.createCenter).not.toBeVisible();
      await expect(center.page.getByText('مرکز با موفقیت ایجاد شد')).toBeVisible();
    });

    test('should show error when center already exists', async ({ center }) => {
      await center.addCenter('پیام گستر فاوا', 'پارک فناوری فاوا');

      await expect(center.page.getByText('این مرکز قبلا ثبت شده است')).toBeVisible();
    });

    test('should show required validation when name and parent is empty', async ({ center }) => {
      await center.addCenter('', '', '');

      await center.verifyCenterRequiredError();
    });
  });

  test.describe('search', () => {
    test.beforeEach(async ({ center }) => {
      await center.openCreateCenterDialog();
      await center.verifyCreateCenterDialog();
    });

    test('should search center', async ({ center }) => {
      const timestamp = Date.now();

      const centerName = `جستجو-${timestamp}`;
      const parentInput = `پیام گستر فاوا`;

      await center.addCenter(centerName, parentInput);

      await center.search(centerName);
      await center.verifySearchResultContains(centerName);

      await center.search(parentInput);
      await center.verifySearchResultContains(parentInput);

      await center.verifySearchResultNotContains('پارک فناوری فاوا');
    });

    test('should clear search', async ({ center }) => {
      const timestamp = Date.now();

      const centerName = `جستجو-${timestamp}`;
      const parentInput = `پیام گستر فاوا`;

      await center.addCenter(centerName, parentInput);

      await center.search(centerName);
      await center.verifySearchResultContains(centerName);

      await center.clearSearch();

      await expect(center.searchInput).toHaveValue('');
      await expect(center.tableRows.first()).toBeVisible();
    });
  });

  test.describe('delete', () => {
    test('should delete center successfully', async ({ center }) => {
      const timestamp = Date.now();

      const centerName = `سناریو حذف-${timestamp}`;
      const parentInput = `پیام گستر فاوا`;

      await center.openCreateCenterDialog();
      await center.verifyCreateCenterDialog();

      await center.addCenter(centerName, parentInput);

      await center.search(centerName);
      await center.verifySearchResultContains(centerName);

      await center.deleteCenter(centerName);
    });
  });

  test.describe('edit', () => {
    test('should edit center successfully', async ({ center }) => {
      const timestamp = Date.now();

      const oldName = `تست ویرایش-${timestamp}`;
      const oldParentcenter = `پیام گستر فاوا`;
      const oldDescription = `توضیح برای ویرایش-${timestamp}`;

      const newName = `ویرایش شده-${timestamp}`;
      const newParentCenter = `پارک فناوری فاوا`;
      const newDescription = `توضیح ویرایش شده-${timestamp}`;

      await center.openCreateCenterDialog();
      await center.verifyCreateCenterDialog();

      await center.addCenter(oldName, oldParentcenter, oldDescription);

      await center.editCenter(
        oldName,
        newName,
        oldDescription,
        newDescription,
        oldParentcenter,
        newParentCenter
      );
    });
  });

  test.describe('pagination', () => {
    test('should change rows per page to 20', async ({ center }) => {
      await center.changeRowsPerPage('20');

      await center.verifyRowsCount(20);
    });
  });
});
