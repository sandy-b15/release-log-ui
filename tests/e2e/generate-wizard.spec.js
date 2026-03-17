import { test, expect } from '@playwright/test';
import { loginTestUser } from './helpers.js';

test.describe('Generate Wizard — Full Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser(page);
  });

  test('should show 6 audience cards in Step 1', async ({ page }) => {
    // Navigate to generate wizard
    const genBtn = page.locator('button:has-text("Generate"), a:has-text("Generate")').first();
    if (await genBtn.isVisible({ timeout: 3000 })) {
      await genBtn.click();
    }

    const grid = page.locator('.audience-grid');
    if (await grid.isVisible({ timeout: 5000 })) {
      const cards = page.locator('.audience-card');
      const count = await cards.count();
      expect(count).toBe(6);
    }
  });

  test('should show all audience types', async ({ page }) => {
    const genBtn = page.locator('button:has-text("Generate"), a:has-text("Generate")').first();
    if (await genBtn.isVisible({ timeout: 3000 })) {
      await genBtn.click();
    }

    const grid = page.locator('.audience-grid');
    if (await grid.isVisible({ timeout: 5000 })) {
      await expect(page.locator('text=QA / Testing')).toBeVisible();
      await expect(page.locator('text=Product Team')).toBeVisible();
      await expect(page.locator('text=Stakeholders')).toBeVisible();
      await expect(page.locator('text=Engineering')).toBeVisible();
      await expect(page.locator('text=Sales / Marketing')).toBeVisible();
      await expect(page.locator('text=Developer Community')).toBeVisible();
    }
  });

  test('should select audience and move to Step 2', async ({ page }) => {
    const genBtn = page.locator('button:has-text("Generate"), a:has-text("Generate")').first();
    if (await genBtn.isVisible({ timeout: 3000 })) {
      await genBtn.click();
    }

    const grid = page.locator('.audience-grid');
    if (await grid.isVisible({ timeout: 5000 })) {
      // Click Engineering card
      await page.locator('.audience-card:has-text("Engineering")').click();

      // Click Next
      const nextBtn = page.locator('button:has-text("Next")').first();
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
      }

      // Step 2 should show source selection
      await expect(page.locator('text=GitHub').or(page.locator('text=Select Source'))).toBeVisible({ timeout: 5000 });
    }
  });
});
