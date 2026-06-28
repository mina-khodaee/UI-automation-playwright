import { expect, Locator, Page } from '@playwright/test';
import { URLS } from 'tests/config/urls';

export class Dashboard {
  readonly page: Page;

  readonly dejbanMenu: Locator;
  readonly dashboardTitle: Locator;

  readonly personnelCard: Locator;
  readonly trafficCard: Locator;
  readonly visitorsCard: Locator;
  readonly inboxCard: Locator;

  readonly weeklyTrafficTitle: Locator;
  readonly weeklyTrafficSubtitle: Locator;
  readonly weeklyTrafficChart: Locator;

  readonly securityAlertsCard: Locator;
  readonly securityAlertsChart: Locator;

  readonly requestsSection: Locator;
  readonly requestsTable: Locator;

  readonly equipmentSection: Locator;
  readonly equipmentTable: Locator;

  readonly sidebarToggleButton: Locator;
  readonly mainMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dejbanMenu = page.locator('h6', { hasText: 'دژبان' });

    this.dashboardTitle = page.getByRole('heading', {
      level: 3,
      name: 'داشبورد سامانه جامع دژبان',
    });

    this.personnelCard = page.getByText('کل پرسنل');
    this.trafficCard = page.getByText('تردد امروز');
    this.visitorsCard = page.getByText('ارباب رجوع امروز');
    this.inboxCard = page.getByText('کارتابل باز');
    this.weeklyTrafficTitle = page.getByText('نمودار تردد هفتگی');
    this.weeklyTrafficSubtitle = page.getByText('آمار ورود، خروج و میهمانان');
    this.weeklyTrafficChart = page.locator('.recharts-responsive-container').first();
    this.securityAlertsCard = page
      .locator('.MuiCard-root')
      .filter({ hasText: 'آمار تخلفات و هشدارهای امنیتی' });
    this.securityAlertsChart = this.securityAlertsCard.locator('.recharts-responsive-container');
    this.requestsSection = page.getByText('کارتابل درخواست‌های حراست');
    this.requestsTable = page.getByRole('table').filter({ hasText: 'عنوان درخواست' });
    this.equipmentSection = page.getByText('کارتابل تجهیزات و اسلحه‌خانه');
    this.equipmentTable = page.getByRole('table').filter({ hasText: 'تجهیزات/اسلحه' });

    this.sidebarToggleButton = page.locator('button.MuiIconButton-root').first();
    this.mainMenu = page.locator('[data-title="منوی اصلی"]');
  }

  async open() {
    await this.page.goto(URLS.home);
    await this.dejbanMenu.click();
    await expect(this.page).toHaveURL(URLS.dejban);
    await expect(this.dashboardTitle).toBeVisible();
  }

  async collapseSidebar() {
    await expect(this.mainMenu).toBeVisible();
    await this.sidebarToggleButton.click();
    await expect(this.mainMenu).not.toBeVisible();
  }

  async expandSidebar() {
    await expect(this.mainMenu).not.toBeVisible();
    await this.sidebarToggleButton.click();
    await expect(this.mainMenu).toBeVisible();
  }
}
