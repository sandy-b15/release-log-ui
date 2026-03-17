import { test, expect } from '@playwright/test';
import { loginTestUser } from './helpers.js';

test.describe('Plans & Billing', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
    await page.goto('http://localhost:5173/settings');
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Plans & Billing")');
    await expect(page.locator('text=Choose a Plan')).toBeVisible({ timeout: 5000 });
  });

  test('should show plan cards', async ({ page }) => {
    await expect(page.locator('text=Free')).toBeVisible();
  });

  test('should show current plan badge', async ({ page }) => {
    await expect(page.locator('text=Current').first()).toBeVisible({ timeout: 5000 });
  });

  test('should toggle between monthly and annual', async ({ page }) => {
    await page.click('button:has-text("Annual")');
    await expect(page.locator('button:has-text("Annual")')).toBeVisible();

    await page.click('button:has-text("Monthly")');
    await expect(page.locator('button:has-text("Monthly")')).toBeVisible();
  });

  test('should toggle currency', async ({ page }) => {
    const currencyBtn = page.locator('button:has-text("USD"), button:has-text("INR")');
    await expect(currencyBtn).toBeVisible({ timeout: 3000 });
    const initialText = await currencyBtn.textContent();
    await currencyBtn.click();
    // Currency should toggle
    await page.waitForTimeout(500);
    const newText = await currencyBtn.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should show usage section', async ({ page }) => {
    // Usage is now in Usage Metrics tab
    await page.click('button:has-text("Usage Metrics")');
    await expect(page.locator('text=Plan Usage')).toBeVisible({ timeout: 5000 });
  });
});
