# NewFile Studio — Contexto del Proyecto

## Qué es
Plataforma web para **NewFile Studio**, estudio de visualización arquitectónica en Mérida, Yucatán.
Landing page pública + panel de administración para gestionar portafolio, servicios y configuración del sitio.

---

## Stack

- **Backend:** Node.js + Express + TypeScript (tsx para ejecutar)
- **Base de datos:** SQLite (better-sqlite3) con migraciones SQL automáticas
- **Frontend público:** Vanilla HTML/CSS/JS + Tailwind (CDN)
- **Frontend admin:** Vanilla HTML/CSS/JS (sin framework)
- **Almacenamiento de archivos:** Local en carpeta `uploads/` (NO S3/Spaces)
- **Auth:** JWT (access token 15min + refresh token 7 días) en cookies del navegador
- **Testing:** Playwright E2E (31+ tests)
- **Deploy target:** DigitalOcean Droplet + Nginx + PM2

---

## Estructura del Proyecto

```
/
├── server.ts                  # Punto de entrada Express
├── tsconfig.json
├── package.json
├── .env / .env.example
├── DEPLOY.md                  # Guía de deploy en DigitalOcean
├── playwright.config.ts
├── run-tests.sh               # Script automatizado de testing
│
├── public/                    # Landing page pública (servida como estático)
│   ├── index.html             # Home — hero + secciones dinámicas (servicios/proyectos del API)
│   ├── portafolio.html        # Grid dinámico del API con infinite scroll + lightbox carrusel
│   ├── servicios.html         # Servicios dinámicos del API, alternando imagen/texto
│   ├── equipo.html            # Estático (no se gestiona desde admin, se edita directo)
│   ├── nosotros.html          # Estático
│   ├── contacto.html          # Dinámico — email, dirección, redes se cargan del API settings
│   ├── css/
│   │   ├── styles.css         # Entry point — importa todos los CSS via @import
│   │   ├── base/              # variables.css, reset.css, utilities.css
│   │   ├── components/        # loader, header, footer, buttons, mobile-menu, animations, social-sidebar
│   │   └── sections/          # hero, portfolio-grid, contact-form, services, carousel, instagram-feed, tech-grid
│   ├── js/
│   │   ├── main.js            # Orquestador: page loader, scroll animations, contact form, bootstrap
│   │   ├── lazyload.js        # IntersectionObserver para lazy loading de imágenes
│   │   ├── api-connect.js     # Conecta home con API de servicios y proyectos
│   │   └── components/
│   │       ├── header.js      # Renderiza header dinámicamente (nav, mobile menu, active links)
│   │       ├── footer.js      # Renderiza footer + social sidebar + loadSettingsLinks()
│   │       └── instagram-feed.js  # Feed de Instagram via Netlify function (legacy)
│   └── assets/images/         # Logos (logo-blanco.png, logo-negro.png, etc.)
│
├── admin/                     # Panel de administración
│   ├── index.html             # Login page
│   ├── dashboard.html         # SPA con secciones: Portafolio, Servicios, Configuración
│   ├── css/admin.css          # Estilos del admin (sidebar, cards, modals, drop zones, toasts, grid preview)
│   └── js/
│       ├── auth.js            # Manejo de tokens en cookies (login, refresh, logout, requireAuth)
│       ├── api.js             # Fetch wrapper con Authorization header + auto-refresh en 401
│       ├── toast.js           # Sistema de notificaciones toast (success, error, loading)
│       ├── projects.js        # CRUD proyectos + upload imágenes + drag&drop reorder + grid preview
│       ├── services.js        # CRUD servicios con tarjetas, imágenes, drag&drop
│       └── settings.js        # Gestión de configuración del sitio (SiteSettings)
│
├── src/                       # Backend TypeScript
│   ├── config/
│   │   ├── env.ts             # Validación de variables de entorno
│   │   └── database.ts        # Conexión SQLite + runner de migraciones
│   ├── shared/
│   │   ├── errors.ts          # AppError class + errorHandler middleware
│   │   └── response.ts        # Helper success(res, data, statusCode)
│   ├── database/migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_projects.sql
│   │   ├── 003_create_images.sql
│   │   ├── 004_create_services.sql
│   │   ├── 005_create_team.sql
│   │   ├── 006_create_settings.sql
│   │   ├── 007_add_link_url_to_services.sql
│   │   ├── 008_add_image_url_to_services.sql
│   │   └── 009_add_grid_size_to_projects.sql
│   └── modules/
│       ├── auth/              # Login, refresh, logout, JWT middleware, admin seed
│       ├── projects/          # CRUD + reorder + upload-cover + paginación
│       ├── images/            # Upload a uploads/{projectId}/, delete, reorder
│       ├── services/          # CRUD + reorder + upload-image
│       ├── team/              # CRUD + reorder + upload-photo (backend existe, NO está en el dashboard)
│       └── settings/          # Key-value store para config del sitio
│
├── uploads/                   # Imágenes subidas (gitignored)
│   ├── covers/                # Portadas de proyectos
│   ├── services/              # Imágenes de servicios
│   ├── team/                  # Fotos de equipo
│   └── {projectId}/           # Galería de imágenes por proyecto
│
├── tests/
│   ├── TEST-CASES.md          # Documentación de todos los casos de test
│   ├── admin-auth.spec.ts     # 4 tests: login, login incorrecto, sin token, logout
│   ├── admin-projects.spec.ts # 10 tests: CRUD proyectos + imágenes
│   ├── admin-services.spec.ts # 4 tests: CRUD servicios + link URL
│   ├── admin-settings.spec.ts # 3 tests: cargar, editar, redes sociales
│   └── public-pages.spec.ts   # 10 tests: todas las páginas públicas
│
└── netlify/                   # Legacy — función de Instagram (puede eliminarse)
    └── functions/instagram.js
```

---

## API Endpoints

### Auth (`/api/v1/auth`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /login | No | Login → access + refresh token |
| POST | /refresh | No | Nuevo access token |
| POST | /logout | No | Invalidar refresh token |

### Projects (`/api/v1/projects`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /published | No | Proyectos publicados (soporta ?limit=N&offset=N para paginación) |
| GET | / | Sí | Todos los proyectos |
| GET | /:id | Sí | Un proyecto |
| POST | / | Sí | Crear proyecto |
| PUT | /:id | Sí | Actualizar proyecto |
| DELETE | /:id | Sí | Eliminar proyecto |
| PATCH | /reorder | Sí | Reordenar (array de {id, order}) |
| POST | /upload-cover | Sí | Subir portada (multer, acepta project_id para registrar en images) |

### Images (`/api/v1/images`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /?project_id=X | No | Imágenes de un proyecto (público para lightbox) |
| POST | /upload | Sí | Subir imagen (multer) |
| DELETE | /:id | Sí | Eliminar imagen |
| PATCH | /reorder | Sí | Reordenar imágenes |

### Services (`/api/v1/services`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | / | No | Todos (soporta ?active=true) |
| GET | /:id | Sí | Un servicio |
| POST | / | Sí | Crear |
| PUT | /:id | Sí | Actualizar |
| DELETE | /:id | Sí | Eliminar |
| PATCH | /reorder | Sí | Reordenar |
| POST | /upload-image | Sí | Subir imagen del servicio |

### Team (`/api/v1/team`) — Backend existe, NO está en dashboard
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | / | No | Todos (soporta ?active=true) |
| POST | / | Sí | Crear |
| PUT | /:id | Sí | Actualizar |
| DELETE | /:id | Sí | Eliminar |
| PATCH | /reorder | Sí | Reordenar |
| POST | /upload-photo | Sí | Subir foto |

### Settings (`/api/v1/settings`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | / | No | Todas las configuraciones |
| GET | /:key | No | Una configuración |
| PUT | / | Sí | Actualizar en bulk ({items: [{key, value}]}) |

---

## Modelos de Datos

### users
`id, email, password (bcrypt), refresh_token, created_at`

### projects
`id, title, description, category, cover_image_url, is_published, sort_order, grid_w (1|2), grid_h (1|2), created_at`

### images
`id, project_id (FK), url, filename, size_bytes, sort_order, created_at`

### services
`id, title, description, icon_name, image_url, link_url, sort_order, is_active, created_at`

### team_members
`id, name, role, bio, photo_url, sort_order, is_active, created_at`

### settings
`key (PK), value, label, category (general|contacto|redes), updated_at`

---

## Funcionalidades Clave del Admin

### Portafolio
- Grid de tarjetas con imagen de portada, título, categoría, badge publicado/borrador
- **Vista Previa Grid**: modo que muestra el portafolio como se verá en la landing (dense grid 4 columnas), con hover para cambiar tamaño (1×1, 2×1, 1×2, 2×2) y drag&drop para reordenar
- Modal de creación/edición con: título, descripción, categoría, selector de tamaño grid, drop zone multi-archivo (primera = portada, resto = galería), toggle publicado
- Sección de imágenes por proyecto: drop zone para subir, grid de thumbnails con drag&drop para reordenar, hover con overlay y número, primera imagen = portada automática
- Al reordenar imágenes, la #1 se asigna como portada del proyecto

### Servicios
- Grid de tarjetas (igual que portafolio) con imagen, título, descripción truncada, badge activo/inactivo
- Modal con: título, descripción, URL de enlace, drop zone para imagen, toggle activo
- Drag&drop para reordenar

### Configuración
- Formulario con inputs agrupados por categoría: General, Contacto, Redes Sociales
- Botón "Guardar Cambios" → bulk update al API
- Settings predefinidos: site_name, site_description, contact_email, contact_phone, contact_address, whatsapp_url, social_instagram, social_facebook, social_tiktok, social_behance, social_linkedin

### Sistema de Toasts
- Esquina inferior derecha
- 3 estados: loading (spinner), success (oscuro), error (rojo)
- Se auto-eliminan a los 3.5s
- Conectados a todas las acciones CRUD

---

## Landing Page — Conexión con API

### portafolio.html
- Infinite scroll: carga 15 proyectos a la vez con IntersectionObserver
- Dense grid con clases `item-w-{grid_w} item-h-{grid_h}` del API
- Click en proyecto → lightbox carrusel con todas las imágenes (cover + galería)
- Usa `<img>` tags (NO background-image, causa problemas)

### servicios.html
- Carga servicios activos del API, renderiza con layout alternado (imagen izq/der)
- Si tiene link_url, el bloque es clickeable
- NO usar clases `fade-in` ni `scale-in` en contenido dinámico (tienen opacity:0)

### contacto.html
- Email, WhatsApp, dirección, Instagram, LinkedIn se actualizan desde `/api/v1/settings`
- Usa `data-setting="key"` en los links + script inline que actualiza hrefs

### Footer y Sidebar (todas las páginas)
- `loadSettingsLinks()` se llama después de `renderFooter()`
- Actualiza todas las URLs con `data-setting` desde la API
- Links sin valor configurado se ocultan

---

## Reglas Importantes

- **NO usar `scale-in` ni `fade-in`** en contenido inyectado dinámicamente — tienen `opacity: 0` y el IntersectionObserver no los detecta
- **Usar `<img>` tags** en vez de `background-image` para imágenes dinámicas — background-image tuvo problemas de renderizado
- **Rate limit** solo activo en producción (`NODE_ENV=production`) — en dev/test está desactivado
- **Tokens en cookies** (no localStorage) — access_token (15min), refresh_token (7 días), path=/, SameSite=Strict
- **Uploads locales** en `uploads/` — organizados por tipo (covers, services, team, {projectId})
- **Cover + Images**: al subir cover con project_id, también se registra en tabla images para que aparezca en la galería
- **Equipo**: el módulo backend existe pero fue quitado del dashboard — se edita directo en el HTML

---

## Comandos

```bash
# Desarrollo
nvm use 20
npx tsx server.ts

# Testing (31 tests)
npm run test:e2e          # Completo con navegador abierto
npm test                  # Headless
npm run test:ui           # UI interactiva de Playwright

# Type check
npx tsc --noEmit

# Acceso
http://localhost:3000          # Landing
http://localhost:3000/admin    # Admin (credenciales en .env)
```

---

## Pendientes / Notas

- Los proyectos creados ANTES del fix de cover+images no tienen registro en la tabla images — necesitan re-subir la imagen
- El módulo de team existe en el backend pero no está expuesto en el dashboard (se quitó por decisión del usuario)
- La función de Instagram de Netlify (`netlify/functions/instagram.js`) es legacy y puede eliminarse si ya no se usa
- Los tests de Playwright necesitan actualizarse si se hacen cambios significativos al flujo del admin
