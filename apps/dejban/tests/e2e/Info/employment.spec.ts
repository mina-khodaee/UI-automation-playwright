import { test, expect } from 'tests/utils/fixture';

test.describe('employment', () => {
  test.beforeEach(async ({ dashboard, employment }) => {
    await dashboard.open();
    await employment.openEmploymentTypesPage();
  });

  test.describe('smoke', () => {
    test('should display employment page', async ({ employment }) => {
      await employment.verifyEmploymentTypesPage();
    });
  });

  test.describe('Search', () => {
    test('should search employment', async ({ employment }) => {
      await employment.searchEmploymentType('رسمی');
      await employment.searchEmploymentTypeNoteVisible('آزمایشی');
    });
    test('should clear search employment', async ({ employment }) => {
      await employment.searchEmploymentType('رسمی');
      await employment.clearSearch('آزمایشی');
    });
  });

  test.describe('add', () => {
    test.beforeEach(async ({ employment }) => {
      await employment.openCreateEmploymentDialog();
      await employment.verifyCreateEmploymentDialog();
    });
    test('should close create employment dialog', async ({ employment }) => {
      await employment.closeButtonDialog();
    });
    test('should add employment successfully', async ({ employment }) => {
      const employmentName = `تستی-${Date.now()}`;
      const description = `توضیح اول است!  - ${Date.now()}`;

      await employment.addEmployment(employmentName, description);
    });
    test('should show error when employment type already exists', async ({ employment }) => {
      await employment.addEmployment('آزمایشی', '');
      await employment.verifyDuplicateEmploymentError();
    });
    test('should show required validation when employment name is empty', async ({
      employment,
    }) => {
      await employment.addEmployment('', '');
      await employment.verifyEmploymentNameRequiredError();
    });
  });

  test.describe('delete', () => {
    test('should delete employment name', async ({ employment }) => {
      await expect(employment.addEmploymentButton).toBeVisible();
      await employment.openCreateEmploymentDialog();
      await employment.verifyCreateEmploymentDialog();
      const employmentName = `سناریو پاک-${Date.now()}`;
      await employment.addEmployment(employmentName, '');
      await employment.deletEmployment(employmentName);
    });
  });

  test.describe('edit', () => {
    test('should edit employment successfully', async ({ employment }) => {
      await expect(employment.addEmploymentButton).toBeVisible();
      await employment.openCreateEmploymentDialog();
      await employment.verifyCreateEmploymentDialog();
      const oldName = `تست ویرایش-${Date.now()}`;
      const oldDescription = `توضیح برای ویرایش - ${Date.now()}`;

      const newName = `${Date.now()}-ویرایش شده`;
      const newDescription = `توضیح ویرایش شده-${Date.now()}`;

      await employment.addEmployment(oldName, oldDescription);

      await employment.editEmployment(oldName, newName, oldDescription, newDescription);
    });
  });

  test('should change rows per page to 20', async ({ employment }) => {
    await employment.changeRowsPerPage('20');
    await employment.verifyRowsCount(20);
  });
});
