# NewFile Studio

Plataforma web para NewFile Studio — estudio de visualizacion arquitectonica en Merida, Yucatan.

Landing page publica + panel de administracion para gestionar portafolio y servicios.

---

## Requisitos

- **Node.js 20+** (las dependencias no funcionan con versiones anteriores)
- **npm** (viene incluido con Node)

Si usas nvm:

```bash
nvm install 20
nvm use 20
```

---

## Instalacion y arranque local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el archivo .env

```bash
cp .env.example .env
```

Abre `.env` y configura tus valores:

```
PORT=3000
JWT_SECRET=pon-una-clave-secreta-aqui
JWT_REFRESH_SECRET=otra-clave-secreta-diferente
ADMIN_EMAIL=tu-email@ejemplo.com
ADMIN_PASSWORD=tu-password-seguro
```

> `ADMIN_EMAIL` y `ADMIN_PASSWORD` son las credenciales del usuario administrador. Se crean automaticamente la primera vez que arranca el servidor.

### 3. Arrancar el servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo produccion
npm start
```

Veras en consola:

```
  ✓ Migration applied: 001_create_users.sql
  ✓ Migration applied: 002_create_projects.sql
  ✓ Migration applied: 003_create_images.sql
  ✓ Migration applied: 004_create_services.sql
Database migrations complete.
  ✓ Admin user seeded: tu-email@ejemplo.com
Server running on http://localhost:3000
```

---

## Acceso

| Que                  | URL                          |
|----------------------|------------------------------|
| Landing page         | http://localhost:3000         |
| Panel de admin       | http://localhost:3000/admin   |
| Portafolio           | http://localhost:3000/portafolio.html |
| Servicios            | http://localhost:3000/servicios.html  |
| Contacto             | http://localhost:3000/contacto.html   |

### Login del panel de administracion

Entra a **http://localhost:3000/admin** y usa las credenciales que pusiste en tu `.env`:

- **Email:** el valor de `ADMIN_EMAIL`
- **Password:** el valor de `ADMIN_PASSWORD`

Por ejemplo, si tu `.env` dice:

```
ADMIN_EMAIL=isai@newfile.studio
ADMIN_PASSWORD=MiPassword123
```

Entonces entras con `isai@newfile.studio` / `MiPassword123`.

---

## Estructura del proyecto

```
/
├── public/            # Landing page (HTML/CSS/JS)
├── admin/             # Panel de administracion (Vanilla JS)
├── uploads/           # Imagenes subidas (se crea automaticamente)
├── src/
│   ├── config/        # Base de datos, variables de entorno
│   ├── modules/       # auth, projects, images, services
│   ├── database/      # Migraciones SQL
│   └── shared/        # Errores y respuestas
├── server.js          # Punto de entrada Express
├── package.json
├── .env.example
└── DEPLOY.md          # Guia de deploy en DigitalOcean
```

---

## Desde el panel de admin puedes:

- **Portafolio:** crear proyectos, subir imagenes, reordenar con drag & drop
- **Servicios:** crear/editar servicios que se muestran en la landing
- Las imagenes se guardan en `uploads/{projectId}/` dentro del proyecto

---

## Resetear la base de datos

Si quieres empezar de cero, elimina el archivo de la BD y reinicia:

```bash
rm data.db
npm run dev
```

Se recrearan las tablas y el usuario admin automaticamente.
