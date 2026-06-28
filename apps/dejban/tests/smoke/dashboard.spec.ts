import { test, expect } from 'tests/utils/fixture';

test.describe('smoke', () => {
  test.beforeEach(async ({ page, dashboard }) => {
    page.on('pageerror', (err) => {
      throw new Error(`Page error: ${err.message}`);
    });

    await dashboard.open();
  });

  test('cards load', async ({ dashboard }) => {
    await expect(dashboard.personnelCard).toBeVisible();
    await expect(dashboard.trafficCard).toBeVisible();
    await expect(dashboard.visitorsCard).toBeVisible();
    await expect(dashboard.inboxCard).toBeVisible();
  });

  test('weekly traffic chart loads', async ({ dashboard }) => {
    await expect(dashboard.weeklyTrafficTitle).toBeVisible();
    await expect(dashboard.weeklyTrafficSubtitle).toBeVisible();
    await expect(dashboard.weeklyTrafficChart).toBeVisible();
  });

  test('security alerts chart loads', async ({ dashboard }) => {
    await expect(dashboard.securityAlertsCard).toBeVisible();
    await expect(dashboard.securityAlertsCard).toBeVisible();
  });

  test('requests table loads', async ({ dashboard }) => {
    await expect(dashboard.requestsSection).toBeVisible();
    await expect(dashboard.requestsTable).toBeVisible();
    await expect(dashboard.requestsTable.getByText('عنوان درخواست')).toBeVisible();
    await expect(dashboard.requestsTable.getByText('متقاضی')).toBeVisible();
    await expect(dashboard.requestsTable.getByText('وضعیت')).toBeVisible();
    await expect(dashboard.requestsTable.getByText('اولویت')).toBeVisible();
  });

  test('equipment table loads', async ({ dashboard }) => {
    await expect(dashboard.equipmentSection).toBeVisible();
    await expect(dashboard.equipmentTable).toBeVisible();
    await expect(dashboard.equipmentTable.getByText('تجهیزات/اسلحه')).toBeVisible();
    await expect(dashboard.equipmentTable.getByText('سریال')).toBeVisible();
    await expect(dashboard.equipmentTable.getByText('متولی')).toBeVisible();
    await expect(dashboard.equipmentTable.getByText('وضعیت')).toBeVisible();
  });

  test('User can toggle sidebar', async ({ dashboard }) => {
    await dashboard.collapseSidebar();
    await dashboard.expandSidebar();
  });
});
