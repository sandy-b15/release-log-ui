import { test, expect } from '@playwright/test';
import { loginTestUser } from './helpers.js';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
  });

  test('should show default project in switcher', async ({ page }) => {
    await expect(page.locator('.project-switcher-name')).toBeVisible();
    const name = await page.locator('.project-switcher-name').textContent();
    expect(name.length).toBeGreaterThan(0);
  });

  test('should open new project form', async ({ page }) => {
    await page.click('.project-switcher-btn');
    await page.click('button:has-text("New Project")');
    await expect(page.locator('.project-switcher-input')).toBeVisible({ timeout: 3000 });
  });

  test('should create a new project', async ({ page }) => {
    await page.click('.project-switcher-btn');
    await page.click('button:has-text("New Project")');
    const projectName = `Test Project ${Date.now()}`;
    await page.fill('.project-switcher-input', projectName);
    await page.click('button:has-text("Add")');

    // Page should reload with new project
    await page.waitForTimeout(2000);
  });

  test('should show projects in settings tab', async ({ page }) => {
    await page.goto('http://localhost:5173/settings');
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Projects")');
    await expect(page.locator('text=My Project').first()).toBeVisible({ timeout: 5000 });
  });
});
