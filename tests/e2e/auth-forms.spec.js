import { test, expect } from '@playwright/test';

test.describe('Login Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.click('text=Sign in');
    // Toast error should appear (react-hot-toast)
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 3000 });
  });

  test('should allow typing email and password', async ({ page }) => {
    await page.fill('input[placeholder="you@example.com"]', 'test@example.com');
    await page.fill('input[placeholder="Your password"]', 'password123');

    await expect(page.locator('input[placeholder="you@example.com"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[placeholder="Your password"]')).toHaveValue('password123');
  });
});

test.describe('Signup Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should show all required fields', async ({ page }) => {
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Min 8 characters"]')).toBeVisible();
  });

  test('should allow filling in signup form', async ({ page }) => {
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.fill('input[placeholder="you@example.com"]', 'test@example.com');
    await page.fill('input[placeholder="Min 8 characters"]', 'password123');

    await expect(page.locator('input[placeholder="Your name"]')).toHaveValue('Test User');
    await expect(page.locator('input[placeholder="you@example.com"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[placeholder="Min 8 characters"]')).toHaveValue('password123');
  });
});

test.describe('Forgot Password Form', () => {
  test('should load and show email field', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('text=Forgot password?')).toBeVisible();
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    await expect(page.locator('text=Send reset code')).toBeVisible();
  });
});
