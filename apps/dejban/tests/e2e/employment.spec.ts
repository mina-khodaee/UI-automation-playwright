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
      await employment.searchEmploymentType('آزمایشی');
      await employment.searchEmploymentTypeNoteVisible('قراردادی');
    });
    test('should clear search employment', async ({ employment }) => {
      await employment.searchEmploymentType('آزمایشی');
      await employment.clearSearch();
      await employment.searchEmploymentType('آزمایشی');
      await employment.searchEmploymentType('قراردادی');
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
      await employment.addEmployment(employmentName, 'فقط تست است!');
    });
  });
});
