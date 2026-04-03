# Guía de Despliegue — NewFile Studio

Despliegue en DigitalOcean Droplet con Nginx, PM2 y SSL gratuito.

---

## 1. Crear Droplet en DigitalOcean

1. Ve a [cloud.digitalocean.com](https://cloud.digitalocean.com) → **Create** → **Droplets**
2. Selecciona **Ubuntu 22.04 LTS**
3. Plan: **Basic** → **$6/mo** (1 vCPU, 1 GB RAM, 25 GB SSD)
4. Datacenter: el más cercano a tus usuarios (ej. NYC1, SFO3)
5. Authentication: **SSH Key** (recomendado)
6. Crea el droplet y copia la IP

---

## 2. Configuración Inicial del Servidor

```bash
# Conéctate como root
ssh root@TU_IP

# Crear usuario con sudo
adduser deploy
usermod -aG sudo deploy

# Configurar firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable

# Cambiar a usuario deploy
su - deploy
```

---

## 3. Instalar Node.js 20 con nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
node -v  # Debe mostrar v20.x.x
```

---

## 4. Instalar Nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Verifica que Nginx está corriendo visitando `http://TU_IP` en el navegador.

---

## 5. Clonar el Repositorio e Instalar Dependencias

```bash
cd /home/deploy
git clone TU_REPO_URL newfile-studio
cd newfile-studio
npm install
```

---

## 6. Crear el Archivo .env

```bash
cp .env.example .env
nano .env
```

Llena todas las variables:

```
PORT=3000
JWT_SECRET=genera-una-clave-segura-aquí
JWT_REFRESH_SECRET=otra-clave-segura-diferente
ADMIN_EMAIL=admin@newfile.studio
ADMIN_PASSWORD=tu-password-seguro
```

> Para generar claves seguras: `openssl rand -base64 32`

---

## 7. Ejecutar con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start server.js --name "newfile-studio"

# Verificar que está corriendo
pm2 status

# Configurar para que inicie al reiniciar el servidor
pm2 startup
# (copia y ejecuta el comando que PM2 te muestre)
pm2 save
```

---

## 8. Configurar Nginx como Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/newfile-studio
```

Pega esta configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Tamaño máximo de subida (para imágenes)
    client_max_body_size 25M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/newfile-studio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 9. SSL con Let's Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

Certbot configurará automáticamente la redirección HTTP → HTTPS.

Verifica la renovación automática:

```bash
sudo certbot renew --dry-run
```

---

## 10. Troubleshooting

### Ver logs de la aplicación

```bash
pm2 logs newfile-studio
pm2 logs newfile-studio --lines 50
```

### Reiniciar la aplicación

```bash
pm2 restart newfile-studio
```

### Actualizar el código (deploy)

```bash
cd /home/deploy/newfile-studio
git pull origin main
npm install
pm2 restart newfile-studio
```

### Ver logs de Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Verificar que el puerto está en uso

```bash
sudo lsof -i :3000
```

### Resetear la base de datos (borra todo)

```bash
rm data.db
pm2 restart newfile-studio
```

### Si PM2 no inicia al reiniciar

```bash
pm2 unstartup
pm2 startup
pm2 save
```
