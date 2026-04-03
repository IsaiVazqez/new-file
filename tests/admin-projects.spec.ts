import { test, expect, Page } from '@playwright/test';

/** Helper: login as admin and wait for dashboard */
async function loginAsAdmin(page: Page) {
  await page.goto('/admin');
  await page.getByTestId('login-email').fill('admin@newfile.studio');
  await page.getByTestId('login-password').fill('admin123');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/dashboard/);
}

test.describe('Admin - Portafolio (Proyectos)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('ver lista de proyectos vacia muestra mensaje', async ({ page }) => {
    // Verify the empty state message is shown when there are no projects
    const emptyMessage = page.getByText('No hay proyectos');
    await expect(emptyMessage).toBeVisible();
  });

  test('crear nuevo proyecto aparece tarjeta en grid', async ({ page }) => {
    await page.getByTestId('btn-new-project').click();
    await expect(page.getByTestId('project-modal')).toBeVisible();

    await page.getByTestId('input-project-title').fill('Proyecto de Prueba E2E');
    await page.getByTestId('input-project-description').fill('Descripcion generada por prueba automatizada');
    await page.getByTestId('input-project-category').fill('Arquitectura');
    await page.getByTestId('input-project-published').check();
    await page.getByTestId('btn-project-save').click();

    // Modal should close
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // New project card should appear
    await expect(page.getByText('Proyecto de Prueba E2E')).toBeVisible();
  });

  test('editar proyecto cambia titulo correctamente', async ({ page }) => {
    // Create a project first
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto Original');
    await page.getByTestId('input-project-description').fill('Descripcion original');
    await page.getByTestId('input-project-category').fill('Diseno');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Find the project card and get its edit button
    const projectCard = page.locator('[data-testid^="project-card-"]').first();
    const projectId = await projectCard.getAttribute('data-testid');
    const id = projectId?.replace('project-card-', '');

    await page.getByTestId(`btn-edit-${id}`).click();
    await expect(page.getByTestId('project-modal')).toBeVisible();

    await page.getByTestId('input-project-title').clear();
    await page.getByTestId('input-project-title').fill('Proyecto Editado');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Verify updated title
    await expect(page.getByText('Proyecto Editado')).toBeVisible();
  });

  test('eliminar proyecto desaparece del grid', async ({ page }) => {
    // Create a project first
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto a Eliminar');
    await page.getByTestId('input-project-description').fill('Este proyecto sera eliminado');
    await page.getByTestId('input-project-category').fill('Test');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Get project ID
    const projectCard = page.locator('[data-testid^="project-card-"]').last();
    const projectId = await projectCard.getAttribute('data-testid');
    const id = projectId?.replace('project-card-', '');

    // Accept the confirmation dialog
    page.on('dialog', (dialog) => dialog.accept());

    await page.getByTestId(`btn-delete-${id}`).click();

    // Verify the project is gone
    await expect(page.getByTestId(`project-card-${id}`)).toBeHidden();
  });

  test('crear proyecto publicado muestra badge Publicado', async ({ page }) => {
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto Publicado E2E');
    await page.getByTestId('input-project-description').fill('Proyecto con estado publicado');
    await page.getByTestId('input-project-category').fill('Render');
    await page.getByTestId('input-project-published').check();
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    await expect(page.getByText('Publicado').first()).toBeVisible();
  });

  test('crear proyecto borrador muestra badge Borrador', async ({ page }) => {
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto Borrador E2E');
    await page.getByTestId('input-project-description').fill('Proyecto en estado borrador');
    await page.getByTestId('input-project-category').fill('Render');
    // Do NOT check the published checkbox
    await page.getByTestId('input-project-published').uncheck();
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    await expect(page.getByText('Borrador').first()).toBeVisible();
  });
});

test.describe('Admin - Imagenes por Proyecto', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('abrir seccion imagenes muestra grid vacio', async ({ page }) => {
    // Create a project first
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto con Imagenes');
    await page.getByTestId('input-project-description').fill('Para probar imagenes');
    await page.getByTestId('input-project-category').fill('Foto');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Click on images button
    const projectCard = page.locator('[data-testid^="project-card-"]').last();
    const projectId = await projectCard.getAttribute('data-testid');
    const id = projectId?.replace('project-card-', '');

    await page.getByTestId(`btn-images-${id}`).click();
    await expect(page.getByTestId('images-grid')).toBeVisible();
  });

  test('subir imagen aparece thumbnail en grid', async ({ page }) => {
    // Create a project
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto Upload Imagen');
    await page.getByTestId('input-project-description').fill('Para probar upload');
    await page.getByTestId('input-project-category').fill('Foto');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Navigate to images
    const projectCard = page.locator('[data-testid^="project-card-"]').last();
    const projectId = await projectCard.getAttribute('data-testid');
    const id = projectId?.replace('project-card-', '');
    await page.getByTestId(`btn-images-${id}`).click();
    await expect(page.getByTestId('images-grid')).toBeVisible();

    // Upload a test image file (auto-uploads on file select)
    const fileInput = page.getByTestId('input-image-upload');
    await fileInput.setInputFiles('/Users/isaivazquez/Downloads/jesus vazquez 979/000009790001.jpg');

    // Wait for upload to complete and thumbnail to appear
    const thumbnails = page.getByTestId('images-grid').locator('img');
    await expect(thumbnails.first()).toBeVisible({ timeout: 10000 });
  });

  test('eliminar imagen desaparece del grid', async ({ page }) => {
    // Create a project
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto Eliminar Imagen');
    await page.getByTestId('input-project-description').fill('Para probar eliminacion');
    await page.getByTestId('input-project-category').fill('Foto');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Navigate to images
    const projectCard = page.locator('[data-testid^="project-card-"]').last();
    const projectId = await projectCard.getAttribute('data-testid');
    const id = projectId?.replace('project-card-', '');
    await page.getByTestId(`btn-images-${id}`).click();
    await expect(page.getByTestId('images-grid')).toBeVisible();

    // Upload an image first
    const fileInput = page.getByTestId('input-image-upload');
    await fileInput.setInputFiles('/Users/isaivazquez/Downloads/jesus vazquez 979/000009790002.jpg');

    const thumbnails = page.getByTestId('images-grid').locator('img');
    await expect(thumbnails.first()).toBeVisible({ timeout: 10000 });

    // Accept confirmation dialog
    page.on('dialog', (dialog) => dialog.accept());

    // Delete the image
    const deleteBtn = page.locator('[data-testid^="btn-delete-img-"]').first();
    await deleteBtn.click();

    // Verify image is removed
    await expect(page.getByTestId('images-grid').locator('img')).toHaveCount(0);
  });

  test('volver a proyectos regresa al grid de proyectos', async ({ page }) => {
    // Create a project
    await page.getByTestId('btn-new-project').click();
    await page.getByTestId('input-project-title').fill('Proyecto Volver');
    await page.getByTestId('input-project-description').fill('Para probar volver');
    await page.getByTestId('input-project-category').fill('Test');
    await page.getByTestId('btn-project-save').click();
    await expect(page.getByTestId('project-modal')).toBeHidden();

    // Navigate to images
    const projectCard = page.locator('[data-testid^="project-card-"]').last();
    const projectId = await projectCard.getAttribute('data-testid');
    const id = projectId?.replace('project-card-', '');
    await page.getByTestId(`btn-images-${id}`).click();
    await expect(page.getByTestId('images-grid')).toBeVisible();

    // Go back to projects
    await page.getByTestId('btn-back-projects').click();

    // Verify we are back to the projects grid
    await expect(page.getByTestId('btn-new-project')).toBeVisible();
  });
});
