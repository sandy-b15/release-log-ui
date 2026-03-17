import { test, expect } from '@playwright/test';

test.describe('Public Page Navigation', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Releaslyy/);
    await expect(page.locator('text=Your tools talk')).toBeVisible();
  });

  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.locator('text=Welcome!')).toBeVisible();
    await expect(page.locator('text=Continue with Google')).toBeVisible();
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
  });

  test('signup page loads correctly', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveTitle(/Sign Up/);
    await expect(page.locator('text=Create your account')).toBeVisible();
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
  });

  test('pricing page loads correctly', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/Pricing/);
  });

  test('docs page loads correctly', async ({ page }) => {
    await page.goto('/docs');
    await expect(page).toHaveTitle(/Documentation/);
  });

  test('terms page loads correctly', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveTitle(/Terms/);
    await expect(page.locator('text=Terms & Conditions')).toBeVisible();
  });

  test('privacy page loads correctly', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveTitle(/Privacy/);
  });

  test('support page loads correctly', async ({ page }) => {
    await page.goto('/support');
    await expect(page).toHaveTitle(/Support/);
  });

  test('integrations hub page loads correctly', async ({ page }) => {
    await page.goto('/integrations');
    await expect(page).toHaveTitle(/Integrations/);
    await expect(page.locator('text=GitHub')).toBeVisible();
    await expect(page.locator('text=Jira')).toBeVisible();
    await expect(page.locator('text=DevRev')).toBeVisible();
  });

  test('integration detail pages load correctly', async ({ page }) => {
    await page.goto('/integrations/github');
    await expect(page).toHaveTitle(/GitHub Integration/);

    await page.goto('/integrations/jira');
    await expect(page).toHaveTitle(/Jira Integration/);

    await page.goto('/integrations/devrev');
    await expect(page).toHaveTitle(/DevRev Integration/);

    await page.goto('/integrations/slack');
    await expect(page).toHaveTitle(/Slack Integration/);
  });
});

test.describe('Navigation Links', () => {
  test('login page links to signup', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Create account');
    await expect(page).toHaveURL(/signup/);
  });

  test('signup page links to login', async ({ page }) => {
    await page.goto('/signup');
    await page.click('text=Log in');
    await expect(page).toHaveURL(/login/);
  });

  test('login page links to forgot password', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('forgot password page links back to login', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('text=Back to login')).toBeVisible();
  });
});

test.describe('Auth Guard', () => {
  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('settings redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/login/);
  });
});
