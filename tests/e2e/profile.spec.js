import { test, expect } from '@playwright/test';
import { loginTestUser } from './helpers.js';

test.describe('Profile Settings', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
    await page.goto('http://localhost:5173/settings');
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible({ timeout: 10000 });
  });

  test('should show profile fields with user data', async ({ page }) => {
    // Basic Info tab should be default — wait for form to load
    await expect(page.locator('.form-input, input[type="text"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should show password section', async ({ page }) => {
    await expect(page.locator('text=Password').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show delete account option', async ({ page }) => {
    await expect(page.locator('text=Delete').first()).toBeVisible({ timeout: 5000 });
  });
});
