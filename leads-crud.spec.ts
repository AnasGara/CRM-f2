
import { test, expect } from '@playwright/test';

test.describe('Leads CRUD Operations', () => {
  test('should allow a user to log in and view the leads page', async ({ page }) => {
    // Listen for all console events and log them to the test output.
    page.on('console', msg => console.log(`Browser Console: ${msg.text()}`));

    // Navigate to the application's root URL.
    await page.goto('http://localhost:5176/');

    // Click the "Se connecter" button to navigate to the login page.
    await page.click('text=Se connecter');

    // Wait for the login form to be visible.
    await page.waitForSelector('form');

    // Fill in the email and password fields.
    await page.fill('input[type="email"]', 'danaffs2@test.com');
    await page.fill('input[type="password"]', 'secret123');

    // Click the submit button to log in.
    await page.click('button[type="submit"]');

    try {
      // Wait for the dashboard to load after login.
      await expect(page.locator('text=/Bon retour, .*! 👋/')).toBeVisible({ timeout: 10000 });
    } catch (error) {
      // If the assertion fails, take a screenshot to help debug.
      await page.screenshot({ path: 'test-results/login-failure-screenshot.png' });
      console.log('Login failed. Screenshot saved to test-results/login-failure-screenshot.png');
      // Re-throw the error to ensure the test still fails.
      throw error;
    }

    // Click on the "Leads" tab in the sidebar.
    await page.click('text=Leads');

    // Assert that the leads table is visible on the page.
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Leads');
  });
});
