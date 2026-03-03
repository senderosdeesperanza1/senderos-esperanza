# Cómo subir el proyecto a senderosdeesperanza.com

Este proyecto es una aplicación **Next.js** con **MySQL**. Para que funcione en tu dominio necesitas **servidor con Node.js y base de datos MySQL**, no solo FTP.

---

## Importante: FileZilla no basta por sí solo

- **FileZilla** solo sube archivos (FTP/SFTP).
- **Next.js** debe **ejecutarse** en el servidor con **Node.js**.
- La **base de datos** debe estar en un **MySQL** accesible desde el servidor.

Si tu hosting de senderosdeesperanza.com es **solo hosting compartido** (cPanel, PHP, sin Node.js), **no podrás ejecutar esta app ahí** solo subiendo archivos. Sigue las alternativas más abajo.

---

## Opción A: Tu hosting tiene Node.js y MySQL (VPS o plan con Node)

Si tu proveedor te da **Node.js** y **MySQL** (por ejemplo un VPS, o un plan “Node.js” / “aplicaciones”), puedes usar FileZilla y luego configurar el servidor.

### 1. Obtener datos de FTP y MySQL

De tu proveedor de hosting necesitas:

- **FTP/SFTP**: host, usuario, contraseña y puerto (ej. 21 o 22).
- **MySQL**: host (puede ser `localhost` o algo como `mysql.tudominio.com`), usuario, contraseña y nombre de la base de datos.

### 2. Crear la base de datos en el servidor

En el panel (cPanel, Plesk, etc.):

- Crear una base de datos MySQL (ej. `senderos_db`).
- Crear un usuario con permisos sobre esa base.
- Anotar: host, usuario, contraseña, nombre de la base.

(El proyecto no incluye scripts SQL; si ya tienes tablas en local, exporta desde phpMyAdmin o `mysqldump` e impórtalas en la base del servidor.)

### 3. Build del proyecto en tu PC

En la carpeta del proyecto:

```bash
npm install
npm run build
```

### 4. Subir con FileZilla

Conecta a tu servidor por FTP/SFTP y sube **solo**:

- Carpeta **`.next`** (contenido de la carpeta después de `npm run build`).
- Carpeta **`public`** (si tienes imágenes/archivos estáticos).
- Archivos en la raíz: **`package.json`**, **`next.config.mjs`**.
- **No subas**: `node_modules`, `.env`, `.git`, archivos de desarrollo.

O bien sube todo el proyecto **excepto** `node_modules` y `.next`, y en el servidor ejecutas `npm install --production` y `npm run build`.

### 5. Variables de entorno en el servidor

En el servidor crea un archivo **`.env`** en la raíz del proyecto (misma carpeta que `package.json`) con los datos **reales** de producción. Usa como guía el archivo **`example.env`** del repositorio:

```env
DB_HOST=el_host_mysql_que_te_dio_el_hosting
DB_PORT=3306
DB_USER=usuario_mysql
DB_PASSWORD=contraseña_mysql
DB_NAME=nombre_base_datos
APP_URL=https://senderosdeesperanza.com
JWT_SECRET=una_clave_larga_y_aleatoria_segura
```

Ajusta también las variables de Wompi si usas donaciones en producción.

### 6. Ejecutar la app en el servidor

Por SSH (si tienes acceso):

```bash
cd /ruta/donde/subiste/el/proyecto
npm install --production
npm run build
npm start
```

Para dejarla corriendo siempre (recomendado), usa un gestor de procesos como **PM2**:

```bash
npm install -g pm2
pm2 start npm --name "senderos" -- start
pm2 save
pm2 startup
```

### 7. Dominio y HTTPS

Configura el dominio **senderosdeesperanza.com** para que apunte al servidor (DNS). Si el hosting ofrece proxy inverso (Nginx/Apache), configúralo para que envíe las peticiones al puerto donde corre Next.js (por defecto 3000). Activa HTTPS (certificado SSL) desde el panel o con Let’s Encrypt.

---

## Opción B: Hosting solo FTP/PHP (sin Node.js)

En este caso **no puedes ejecutar Next.js** en ese mismo hosting. Tienes dos caminos:

### B1. Vercel (gratis) + base de datos externa

- **Front y API (Next.js)** en [Vercel](https://vercel.com): conectas tu repositorio Git y Vercel despliega automáticamente. No uses FileZilla para esto.
- **Base de datos**: usa un MySQL en la nube, por ejemplo:
  - [PlanetScale](https://planetscale.com) (MySQL compatible),
  - [Railway](https://railway.app),
  - O el **MySQL que te ofrezca tu actual hosting** (acceso remoto), si lo tienen.

En Vercel defines las mismas variables de entorno (`DB_HOST`, `DB_USER`, etc.) con los datos del MySQL externo. No subes archivos con FileZilla para la app; solo para lo que sea contenido estático en tu hosting actual si lo necesitas.

### B2. Contratar VPS o plan con Node.js

Contratas un VPS (DigitalOcean, Linode, etc.) o un plan que soporte Node.js. Ahí instalas Node.js y MySQL y sigues la **Opción A** (incluyendo subir el proyecto por FileZilla o por Git).

---

## Resumen

| Qué quieres hacer | Qué necesitas |
|-------------------|----------------|
| Subir archivos al servidor | FileZilla + datos FTP del hosting |
| Que la web funcione con base de datos | Servidor con **Node.js** + **MySQL** (o desplegar en Vercel y MySQL externo) |

Si me dices qué tipo de hosting tienes (nombre del plan, si es cPanel, VPS, etc.), se puede afinar los pasos (por ejemplo solo FileZilla + panel, o solo Vercel + MySQL).
