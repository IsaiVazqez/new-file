# Casos de Prueba E2E - NewFile Studio

Documento de casos de prueba end-to-end para la plataforma NewFile Studio.
Herramienta: Playwright. Selectores: `data-testid`.

---

## A. Admin - Autenticacion

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| A1 | Login con credenciales correctas | 1. Navegar a `/admin` 2. Llenar email y password correctos 3. Click en "Iniciar sesion" | Redirige a `/admin/dashboard.html` |
| A2 | Login con credenciales incorrectas | 1. Navegar a `/admin` 2. Llenar email y password incorrectos 3. Click en "Iniciar sesion" | Muestra mensaje de error visible |
| A3 | Dashboard sin token | 1. Navegar directamente a `/admin/dashboard.html` sin autenticarse | Redirige a `/admin` (login) |
| A4 | Logout | 1. Iniciar sesion 2. Click en boton "Cerrar sesion" | Limpia tokens y redirige a `/admin` |

---

## B. Admin - Portafolio (Proyectos)

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| B1 | Ver lista de proyectos vacia | 1. Login 2. Verificar estado inicial sin proyectos | Muestra mensaje "No hay proyectos" |
| B2 | Crear nuevo proyecto | 1. Login 2. Click en "Nuevo Proyecto" 3. Llenar titulo, descripcion, categoria, cover URL 4. Guardar | Aparece tarjeta del proyecto en el grid |
| B3 | Editar proyecto | 1. Login 2. Click en "Editar" de un proyecto existente 3. Cambiar titulo 4. Guardar | Titulo actualizado visible en la tarjeta |
| B4 | Eliminar proyecto | 1. Login 2. Click en "Eliminar" de un proyecto existente 3. Confirmar eliminacion | Proyecto desaparece del grid |
| B5 | Crear proyecto publicado | 1. Login 2. Crear proyecto con checkbox "Publicado" activado | Badge "Publicado" visible en la tarjeta |
| B6 | Crear proyecto borrador | 1. Login 2. Crear proyecto con checkbox "Publicado" desactivado | Badge "Borrador" visible en la tarjeta |

---

## C. Admin - Imagenes por Proyecto

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| C1 | Abrir seccion imagenes de un proyecto | 1. Login 2. Crear proyecto 3. Click en boton "Imagenes" | Muestra grid de imagenes vacio |
| C2 | Subir imagen | 1. En seccion imagenes 2. Seleccionar archivo de imagen 3. Click en subir | Aparece thumbnail en el grid |
| C3 | Eliminar imagen | 1. En seccion imagenes con imagen existente 2. Click en eliminar imagen | Imagen desaparece del grid |
| C4 | Volver a proyectos | 1. En seccion imagenes 2. Click en "Volver a proyectos" | Regresa al grid de proyectos |

---

## D. Admin - Servicios

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| D1 | Ver lista de servicios vacia | 1. Login 2. Navegar a seccion servicios | Muestra estado vacio o tabla sin filas |
| D2 | Crear nuevo servicio | 1. Login 2. Click en "Nuevo Servicio" 3. Llenar titulo, descripcion, icono 4. Guardar | Servicio aparece en la tabla |
| D3 | Editar servicio | 1. Login 2. Click en "Editar" de un servicio existente 3. Cambiar titulo 4. Guardar | Titulo actualizado visible en la tabla |
| D4 | Eliminar servicio | 1. Login 2. Click en "Eliminar" de un servicio existente 3. Confirmar | Servicio desaparece de la tabla |

---

## E. Public - Landing Page

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| E1 | Cargar pagina principal | 1. Navegar a `/` | Hero visible con titulo "NewFile" |
| E2 | Navegacion | 1. Verificar links del header | Todos los links del header funcionan correctamente |
| E3 | CTA "Contactanos" | 1. Click en boton CTA del hero | Navega a `contacto.html` |

---

## F. Public - Portafolio

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| F1 | Cargar portafolio | 1. Navegar a `/portafolio.html` | Grid de imagenes visible |
| F2 | Quote section | 1. Navegar a `/portafolio.html` | Seccion de quote/cita visible |

---

## G. Public - Servicios

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| G1 | Cargar servicios | 1. Navegar a `/servicios.html` | Hero visible |
| G2 | Los 5 servicios se muestran | 1. Navegar a `/servicios.html` 2. Scroll hacia abajo | Los 5 bloques de servicios son visibles |

---

## H. Public - Equipo

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| H1 | Cargar equipo | 1. Navegar a `/equipo.html` | 2 tarjetas de fundadores visibles |

---

## I. Public - Contacto

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| I1 | Cargar contacto | 1. Navegar a `/contacto.html` | Formulario de contacto visible |
| I2 | Llenar formulario y enviar | 1. Llenar nombre, email y mensaje 2. Click en enviar | Mensaje de exito visible |

---

## J. Public - Nosotros

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| J1 | Cargar nosotros | 1. Navegar a `/nosotros.html` | Secciones de mision y vision visibles |

---

## K. Admin - Equipo

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| K1 | Crear nuevo miembro | 1. Login 2. Navegar a seccion Equipo 3. Click en "Nuevo Miembro" 4. Llenar nombre, cargo, bio 5. Guardar | Aparece tarjeta en grid con nombre y cargo |
| K2 | Editar miembro | 1. Login 2. Crear miembro 3. Click en "Editar" 4. Cambiar nombre 5. Guardar | Nombre actualizado visible en la tarjeta |
| K3 | Eliminar miembro | 1. Login 2. Crear miembro 3. Click en "Eliminar" 4. Confirmar | Miembro desaparece del grid |

---

## L. Admin - Configuración

| # | Caso de prueba | Pasos | Resultado esperado |
|---|---------------|-------|-------------------|
| L1 | Cargar configuración con valores por defecto | 1. Login 2. Navegar a seccion Configuración | Campos con valores por defecto visibles (email, teléfono, Instagram) |
| L2 | Editar y guardar configuración | 1. Login 2. Cambiar teléfono e Instagram 3. Guardar 4. Recargar página | Cambios persisten al recargar |
| L3 | Campos de redes sociales presentes | 1. Login 2. Navegar a Configuración | Campos de Instagram, Facebook, TikTok, Behance y LinkedIn visibles |
