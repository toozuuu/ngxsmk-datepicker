import { test, expect } from '@playwright/test';

test.describe('Datepicker smoke', () => {
  test('opens calendar, selects date, closes', async ({ page }) => {
    await page.goto('/examples');
    const firstPicker = page.locator('ngxsmk-datepicker').first();
    const trigger = firstPicker.locator('.ngxsmk-input-group[role="button"]');
    await trigger.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 15000 });
    const day = page.locator('[role="gridcell"][data-date]').first();
    await day.click({ timeout: 10000 });
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('range picker opens and selects range', async ({ page }) => {
    await page.goto('/examples');
    const rangePicker = page.locator('ngxsmk-datepicker').nth(1);
    const trigger = rangePicker.locator('.ngxsmk-input-group[role="button"]');
    await trigger.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 15000 });
    const days = page.locator('[role="gridcell"][data-date]');
    await days.nth(5).click();
    await days.nth(12).click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
