import { test, expect } from '@playwright/test';

test.describe('Verify OTP Page', () => {
  test('should redirect to signup if no email param', async ({ page }) => {
    await page.goto('/verify-otp');
    await page.waitForURL(/signup/, { timeout: 5000 });
  });

  test('should show email and 6 digit inputs', async ({ page }) => {
    await page.goto('/verify-otp?email=test@example.com');
    await expect(page.locator('text=test@example.com')).toBeVisible();
    const inputs = page.locator('input[inputmode="numeric"]');
    await expect(inputs).toHaveCount(6);
  });

  test('should auto-advance focus between OTP inputs', async ({ page }) => {
    await page.goto('/verify-otp?email=test@example.com');
    const inputs = page.locator('input[inputmode="numeric"]');

    await inputs.nth(0).fill('1');
    await expect(inputs.nth(1)).toBeFocused();

    await inputs.nth(1).fill('2');
    await expect(inputs.nth(2)).toBeFocused();
  });

  test('should show resend button', async ({ page }) => {
    await page.goto('/verify-otp?email=test@example.com');
    await expect(page.locator('button:has-text("Resend code")')).toBeVisible();
  });
});
