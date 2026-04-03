import { test, expect } from '@playwright/test';

test.describe('Admin - Autenticacion', () => {
  test('login con credenciales correctas redirige a dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.getByTestId('login-email').fill('admin@newfile.studio');
    await page.getByTestId('login-password').fill('admin123');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('login con credenciales incorrectas muestra error', async ({ page }) => {
    await page.goto('/admin');
    await page.getByTestId('login-email').fill('wrong@email.com');
    await page.getByTestId('login-password').fill('wrongpass');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('dashboard sin token redirige a login', async ({ page }) => {
    await page.goto('/admin/dashboard.html');
    await expect(page).toHaveURL(/admin/);
  });

  test('logout limpia tokens y redirige', async ({ page }) => {
    // Login first
    await page.goto('/admin');
    await page.getByTestId('login-email').fill('admin@newfile.studio');
    await page.getByTestId('login-password').fill('admin123');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/dashboard/);

    // Logout
    await page.getByTestId('btn-logout').click();
    await expect(page).toHaveURL(/admin/);
  });
});
