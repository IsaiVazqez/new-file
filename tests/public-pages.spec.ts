import { test, expect } from '@playwright/test';

test.describe('Public - Landing Page', () => {
  test('cargar pagina principal con hero visible y titulo NewFile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('hero-title')).toContainText('NewFile');
  });

  test('navegacion: todos los links del header funcionan', async ({ page }) => {
    await page.goto('/');

    // Verify nav links exist and are visible
    await expect(page.getByTestId('nav-inicio')).toBeVisible();
    await expect(page.getByTestId('nav-portafolio')).toBeVisible();
    await expect(page.getByTestId('nav-servicios')).toBeVisible();
    await expect(page.getByTestId('nav-equipo')).toBeVisible();
    await expect(page.getByTestId('nav-contacto')).toBeVisible();

    // Click portafolio link and verify navigation
    await page.getByTestId('nav-portafolio').click();
    await expect(page).toHaveURL(/portafolio/);

    // Go back and click servicios
    await page.goto('/');
    await page.getByTestId('nav-servicios').click();
    await expect(page).toHaveURL(/servicios/);

    // Go back and click equipo
    await page.goto('/');
    await page.getByTestId('nav-equipo').click();
    await expect(page).toHaveURL(/equipo/);

    // Go back and click contacto
    await page.goto('/');
    await page.getByTestId('nav-contacto').click();
    await expect(page).toHaveURL(/contacto/);
  });

  test('CTA Contactanos navega a contacto.html', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-cta').click();
    await expect(page).toHaveURL(/contacto/);
  });
});

test.describe('Public - Portafolio', () => {
  test('cargar portafolio con grid de imagenes visible', async ({ page }) => {
    await page.goto('/portafolio.html');
    await expect(page.getByTestId('portfolio-grid')).toBeVisible();
  });

  test('quote section visible', async ({ page }) => {
    await page.goto('/portafolio.html');
    await expect(page.getByTestId('portfolio-quote')).toBeVisible();
  });
});

test.describe('Public - Servicios', () => {
  test('cargar servicios con hero visible', async ({ page }) => {
    await page.goto('/servicios.html');
    await expect(page.getByTestId('services-hero')).toBeVisible();
  });

  test('los 5 servicios se muestran', async ({ page }) => {
    await page.goto('/servicios.html');
    await expect(page.getByTestId('service-1')).toBeVisible();
    await expect(page.getByTestId('service-2')).toBeVisible();
    await expect(page.getByTestId('service-3')).toBeVisible();
    await expect(page.getByTestId('service-4')).toBeVisible();
    await expect(page.getByTestId('service-5')).toBeVisible();
  });
});

test.describe('Public - Equipo', () => {
  test('cargar equipo con 2 tarjetas de fundadores visibles', async ({ page }) => {
    await page.goto('/equipo.html');
    await expect(page.getByTestId('team-hero')).toBeVisible();
    await expect(page.getByTestId('founder-1')).toBeVisible();
    await expect(page.getByTestId('founder-2')).toBeVisible();
  });
});

test.describe('Public - Contacto', () => {
  test('cargar contacto con formulario visible', async ({ page }) => {
    await page.goto('/contacto.html');
    await expect(page.getByTestId('contact-form')).toBeVisible();
  });

  test('llenar formulario y enviar muestra mensaje de exito', async ({ page }) => {
    await page.goto('/contacto.html');

    await page.getByTestId('contact-name').fill('Usuario de Prueba');
    await page.getByTestId('contact-email').fill('test@example.com');
    await page.getByTestId('contact-message').fill('Este es un mensaje de prueba enviado por Playwright.');
    await page.getByTestId('contact-submit').click();

    // Verify success message appears
    const successMessage = page.getByText(/enviado|exito|gracias/i);
    await expect(successMessage).toBeVisible();
  });
});

test.describe('Public - Nosotros', () => {
  test('cargar nosotros con mision y vision visibles', async ({ page }) => {
    await page.goto('/nosotros.html');
    await expect(page.getByTestId('about-hero')).toBeVisible();
    await expect(page.getByTestId('about-mission')).toBeVisible();
    await expect(page.getByTestId('about-vision')).toBeVisible();
  });
});
