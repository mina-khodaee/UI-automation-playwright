import { test, expect } from 'tests/utils/fixture';

test.describe('employmentStatus', () => {
  test.beforeEach(async ({ dashboard, employmentStatus }) => {
    await dashboard.open();
    await employmentStatus.openEmploymentTypesPage();
  });

  test.describe('smoke', () => {
    test('should display employment status page', async ({ employmentStatus }) => {
      await employmentStatus.verifyEmploymentTypesPage();
    });
  });

  test.describe('add', () => {
    test.beforeEach(async ({ employmentStatus }) => {
      await employmentStatus.openCreateEmploymentDialog();
      await employmentStatus.verifyCreateEmploymentDialog();
    });

    test('should close create employment status dialog', async ({ employmentStatus }) => {
      await employmentStatus.closeButtonDialog();
    });

    test('should add employment status successfully', async ({ employmentStatus }) => {
      const employmentName = `تستی-${Date.now()}`;
      const description = `توضیح اول است! - ${Date.now()}`;
      await employmentStatus.addEmployment(employmentName, description);
      await employmentStatus.searchEmploymentType(employmentName);
      await expect(employmentStatus.page.getByText('نوع اشتغال با موفقیت ایجاد شد')).toBeVisible();
    });

    test('should show error when employment status type already exists', async ({
      employmentStatus,
    }) => {
      await employmentStatus.addEmployment('اخراج', '');
      await employmentStatus.verifyDuplicateEmploymentError();
      await expect(
        employmentStatus.page.getByText('این نوع اشتغال قبلا ثبت شده است')
      ).toBeVisible();
    });

    test('should show required validation when employment status name is empty', async ({
      employmentStatus,
    }) => {
      await employmentStatus.addEmployment('', '');
      await employmentStatus.verifyEmploymentNameRequiredError();
    });
  });

  test.describe('Search', () => {
    test.beforeEach(async ({ employmentStatus }) => {
      await expect(employmentStatus.addEmploymentButton).toBeVisible();
      await employmentStatus.openCreateEmploymentDialog();
      await employmentStatus.verifyCreateEmploymentDialog();
    });

    test('should search employment status', async ({ employmentStatus }) => {
      const employmentName = `جست و جو -${Date.now()}`;
      await employmentStatus.addEmployment(employmentName, '');
      await employmentStatus.searchEmploymentType(employmentName);
      await employmentStatus.searchEmploymentTypeNoteVisible('اخراج');
    });

    test('should clear search employment status', async ({ employmentStatus }) => {
      const employmentName = `جست و جو -${Date.now()}`;
      await employmentStatus.addEmployment(employmentName, '');
      await employmentStatus.searchEmploymentType(employmentName);
      await employmentStatus.clearSearch();
      await employmentStatus.searchEmploymentType('اخراج');
    });
  });

  test.describe('delete', () => {
    test('should delete employment status name', async ({ employmentStatus }) => {
      await expect(employmentStatus.addEmploymentButton).toBeVisible();
      await employmentStatus.openCreateEmploymentDialog();
      await employmentStatus.verifyCreateEmploymentDialog();
      const employmentName = `سناریو پاک-${Date.now()}`;
      await employmentStatus.addEmployment(employmentName, '');
      await employmentStatus.searchEmploymentType(employmentName);
      await employmentStatus.deletEmployment(employmentName);
    });
  });

  test.describe('edit', () => {
    test('should edit employment status successfully', async ({ employmentStatus }) => {
      await expect(employmentStatus.addEmploymentButton).toBeVisible();
      await employmentStatus.openCreateEmploymentDialog();
      await employmentStatus.verifyCreateEmploymentDialog();
      const oldName = `تست ویرایش-${Date.now()}`;
      const oldDescription = `توضیح برای ویرایش - ${Date.now()}`;

      const newName = `${Date.now()}-ویرایش شده`;
      const newDescription = `توضیح ویرایش شده-${Date.now()}`;

      await employmentStatus.addEmployment(oldName, oldDescription);

      await employmentStatus.editEmployment(oldName, newName, oldDescription, newDescription);
    });
  });

  test.describe('pagination', () => {
    test('should change rows per page to 20', async ({ employmentStatus }) => {
      await employmentStatus.changeRowsPerPage('20');
      await employmentStatus.verifyRowsCount(20);
    });
  });
});
