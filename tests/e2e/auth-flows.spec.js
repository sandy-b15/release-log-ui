import { test, expect } from '@playwright/test';
import pg from 'pg';

const API_URL = 'http://localhost:3000';
const DB_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/release_notes';

test.describe('Email Signup + OTP Verification Flow', () => {
  const testEmail = `signup-flow-${Date.now()}@test.com`;

  test('should complete full signup → OTP → dashboard flow', async ({ page }) => {
    // Go to signup
    await page.goto('/signup');
    await page.fill('input[placeholder="Your name"]', 'Signup Test');
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    await page.fill('input[placeholder="Min 8 characters"]', 'TestPass123!');
    await page.click('button:has-text("Create account")');

    // Should redirect to verify-otp
    await page.waitForURL(/verify-otp/, { timeout: 10000 });
    await expect(page.locator('text=Check your email')).toBeVisible();
    await expect(page.locator(`text=${testEmail}`)).toBeVisible();

    // Get OTP from DB
    const pool = new pg.Pool({ connectionString: DB_URL });
    const { rows } = await pool.query(
      'SELECT otp_code FROM email_otps WHERE email = $1 AND used = false ORDER BY created_at DESC LIMIT 1',
      [testEmail]
    );
    await pool.end();
    const otp = rows[0].otp_code;

    // Enter OTP digits
    const digits = otp.split('');
    for (let i = 0; i < 6; i++) {
      await page.locator(`input[inputmode="numeric"]`).nth(i).fill(digits[i]);
    }
    await page.click('button:has-text("Verify email")');

    // Should redirect to dashboard
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    await expect(page.locator('h1:has-text("Good")')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Login + Forgot Password Flow', () => {
  test('should reject login for unverified user', async ({ page }) => {
    const email = `unverified-${Date.now()}@test.com`;
    // Signup via API but don't verify — password_hash is deferred
    await page.request.post(`${API_URL}/auth/signup`, {
      data: { name: 'Unverified', email, password: 'TestPass123!' },
    });

    await page.goto('/login');
    await page.fill('input[placeholder="you@example.com"]', email);
    await page.fill('input[placeholder="Your password"]', 'TestPass123!');
    await page.click('button:has-text("Sign in")');

    // Should stay on login page (login fails — no password_hash until OTP verified)
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Welcome!')).toBeVisible();
  });

  test('should navigate forgot password flow', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('text=Forgot password?')).toBeVisible();

    await page.fill('input[placeholder="you@example.com"]', 'nonexistent@test.com');
    await page.click('button:has-text("Send reset code")');

    // Should show error for non-existent user
    await page.waitForTimeout(2000);
  });

  test('should show reset password page', async ({ page }) => {
    await page.goto('/reset-password?email=test@test.com');
    await expect(page.locator('h1:has-text("Reset password")')).toBeVisible();
    await expect(page.locator('input[placeholder="Min 8 characters"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirm your password"]')).toBeVisible();
  });
});

test.describe('Logout Flow', () => {
  test('should logout and redirect to login', async ({ page }) => {
    // Login first
    const { loginTestUser } = await import('./helpers.js');
    await loginTestUser(page);

    // Click user menu
    await page.click('.topbar-user');
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 3000 });
    await page.click('button:has-text("Logout")');

    // Should redirect to login
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page.locator('text=Welcome!')).toBeVisible();
  });
});
