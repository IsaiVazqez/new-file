import { test, expect, Page } from '@playwright/test';

/** Helper: login as admin and wait for dashboard */
async function loginAsAdmin(page: Page) {
  await page.goto('/admin');
  await page.getByTestId('login-email').fill('admin@newfile.studio');
  await page.getByTestId('login-password').fill('admin123');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/dashboard/);
}

test.describe('Admin - Servicios', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    // Navigate to services section
    await page.getByTestId('nav-services').click();
    await expect(page.getByTestId('section-services')).toBeVisible();
  });

  test('crear nuevo servicio aparece en tabla', async ({ page }) => {
    await page.getByTestId('btn-new-service').click();
    await expect(page.getByTestId('service-modal')).toBeVisible();

    await page.getByTestId('input-service-title').fill('Servicio de Prueba E2E');
    await page.getByTestId('input-service-description').fill('Descripcion del servicio generada por prueba automatizada');
    await page.getByTestId('input-service-icon').fill('view_in_ar');
    await page.getByTestId('input-service-link').fill('https://example.com/catalogo');
    await page.getByTestId('input-service-active').check();
    await page.getByTestId('btn-service-save').click();

    // Modal should close
    await expect(page.getByTestId('service-modal')).toBeHidden();

    // New service should appear in the table
    await expect(page.getByText('Servicio de Prueba E2E')).toBeVisible();
  });

  test('editar servicio cambia titulo correctamente', async ({ page }) => {
    // Create a service first
    await page.getByTestId('btn-new-service').click({force: true});
    await page.getByTestId('input-service-title').fill('Servicio Original');
    await page.getByTestId('input-service-description').fill('Descripcion original del servicio');
    await page.getByTestId('input-service-icon').fill('fa-pencil');
    await page.getByTestId('input-service-active').check();
    await page.getByTestId('btn-service-save').click();
    await expect(page.getByTestId('service-modal')).toBeHidden();

    // Find the service row and get its edit button
    const serviceRow = page.locator('[data-testid^="service-row-"]').last();
    const serviceTestId = await serviceRow.getAttribute('data-testid');
    const id = serviceTestId?.replace('service-row-', '');

    await page.getByTestId(`btn-edit-service-${id}`).click();
    await expect(page.getByTestId('service-modal')).toBeVisible();

    await page.getByTestId('input-service-title').clear();
    await page.getByTestId('input-service-title').fill('Servicio Editado');
    await page.getByTestId('btn-service-save').click();
    await expect(page.getByTestId('service-modal')).toBeHidden();

    // Verify updated title
    await expect(page.getByText('Servicio Editado')).toBeVisible();
  });

  test('crear servicio con URL muestra enlace en tabla', async ({ page }) => {
    await page.getByTestId('btn-new-service').click();
    await page.getByTestId('input-service-title').fill('Servicio con Link');
    await page.getByTestId('input-service-description').fill('Tiene URL');
    await page.getByTestId('input-service-icon').fill('link');
    await page.getByTestId('input-service-link').fill('https://example.com/renders');
    await page.getByTestId('input-service-active').check();
    await page.getByTestId('btn-service-save').click();
    await expect(page.getByTestId('service-modal')).not.toBeVisible();

    // Verify the link appears in the table
    await expect(page.getByText('Ver enlace').first()).toBeVisible();
  });

  test('eliminar servicio desaparece de tabla', async ({ page }) => {
    // Create a service first
    await page.getByTestId('btn-new-service').click();
    await page.getByTestId('input-service-title').fill('Servicio a Eliminar');
    await page.getByTestId('input-service-description').fill('Este servicio sera eliminado');
    await page.getByTestId('input-service-icon').fill('fa-trash');
    await page.getByTestId('input-service-active').check();
    await page.getByTestId('btn-service-save').click();
    await expect(page.getByTestId('service-modal')).toBeHidden();

    // Get service ID
    const serviceRow = page.locator('[data-testid^="service-row-"]').last();
    const serviceTestId = await serviceRow.getAttribute('data-testid');
    const id = serviceTestId?.replace('service-row-', '');

    // Accept confirmation dialog
    page.on('dialog', (dialog) => dialog.accept());

    await page.getByTestId(`btn-delete-service-${id}`).click();

    // Verify the service is gone
    await expect(page.getByTestId(`service-row-${id}`)).toBeHidden();
  });
});
