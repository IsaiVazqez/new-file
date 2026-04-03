import { test, expect, Page } from '@playwright/test';

/** Helper: login as admin and wait for dashboard */
async function loginAsAdmin(page: Page) {
  await page.goto('/admin');
  await page.getByTestId('login-email').fill('admin@newfile.studio');
  await page.getByTestId('login-password').fill('admin123');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/dashboard/);
}

test.describe('Admin - Configuración', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    // Navigate to settings section
    await page.getByTestId('nav-settings').click();
    await expect(page.getByTestId('section-settings')).toBeVisible();
  });

  test('cargar configuración muestra campos con valores por defecto', async ({ page }) => {
    // Verify the settings inputs are loaded with defaults
    const emailInput = page.locator('.setting-input[data-key="contact_email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveValue('hola@newfile.studio');

    const phoneInput = page.locator('.setting-input[data-key="contact_phone"]');
    await expect(phoneInput).toBeVisible();
    await expect(phoneInput).toHaveValue('+52-999-123-4567');

    // Check social fields exist
    const igInput = page.locator('.setting-input[data-key="social_instagram"]');
    await expect(igInput).toBeVisible();
    await expect(igInput).toHaveValue('https://instagram.com/new.file');
  });

  test('editar y guardar configuración persiste cambios', async ({ page }) => {
    // Change the phone number
    const phoneInput = page.locator('.setting-input[data-key="contact_phone"]');
    await phoneInput.clear();
    await phoneInput.fill('+52-999-888-7777');

    // Change Instagram URL
    const igInput = page.locator('.setting-input[data-key="social_instagram"]');
    await igInput.clear();
    await igInput.fill('https://instagram.com/newfile.studio');

    // Save and wait for toast confirmation
    await page.getByTestId('btn-save-settings').click();
    await expect(page.locator('.toast.success')).toBeVisible({ timeout: 5000 });

    // Reload the page and verify persistence
    await page.reload();
    await page.getByTestId('nav-settings').click();
    await expect(page.getByTestId('section-settings')).toBeVisible();

    // Wait for settings to load
    const phoneInputReloaded = page.locator('.setting-input[data-key="contact_phone"]');
    await expect(phoneInputReloaded).toHaveValue('+52-999-888-7777');

    const igInputReloaded = page.locator('.setting-input[data-key="social_instagram"]');
    await expect(igInputReloaded).toHaveValue('https://instagram.com/newfile.studio');
  });

  test('campos de redes sociales están presentes', async ({ page }) => {
    await expect(page.locator('.setting-input[data-key="social_facebook"]')).toBeVisible();
    await expect(page.locator('.setting-input[data-key="social_tiktok"]')).toBeVisible();
    await expect(page.locator('.setting-input[data-key="social_behance"]')).toBeVisible();
    await expect(page.locator('.setting-input[data-key="social_linkedin"]')).toBeVisible();
  });
});
