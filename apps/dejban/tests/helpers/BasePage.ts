import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async fillInput(locator: Locator, value: string) {
    await expect(locator).toBeVisible();
    await locator.click();
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  async selectOption(locator: Locator, option: string) {
    await expect(locator).toBeVisible();
    await locator.click();

    const targetOption = this.page.getByRole('option', {
      name: option,
      exact: true,
    });

    await expect(targetOption).toBeVisible();
    await targetOption.click();
  }

  async checkTreeItem(parentText: string, childText: string) {
    // Expand parent
    await this.page
      .locator('.label', { hasText: parentText })
      .locator('xpath=preceding-sibling::div')
      .click();

    // Check child
    const checkbox = this.page
      .locator('.label', { hasText: childText })
      .locator('xpath=preceding-sibling::span//input');

    await expect(checkbox).toBeVisible();
    await checkbox.check();
  }
}
