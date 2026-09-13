# 📚 GUÍA PASO A PASO - AUTENTICACIÓN CON FIREBASE

## ✅ PASO 1: Verificar que Firebase está instalado

Abre una terminal en tu proyecto y ejecuta:

```bash
npm install
```

**Resultado esperado:** Firebase ya está instalado desde antes ✓

---

## ✅ PASO 2: Crear tu proyecto en Firebase

1. Ve a **https://console.firebase.google.com/**
2. Haz clic en **"Crear un proyecto"**
3. Sigue estos pasos:
   - Nombre del proyecto: `senderos-de-esperanza` (o el que prefieras)
   - Desactiva Google Analytics (opcional)
   - Clic en **"Crear proyecto"**

4. Espera a que se cree (toma unos segundos)
5. Ve a **Compilación > Autenticación**
6. Haz clic en **"Comenzar"**
7. Selecciona **"Correo electrónico/Contraseña"**
8. Habilita **"Correo/Contraseña"** y **"Correo electrónico con vinculación de contraseña"**
9. Haz clic en **"Guardar"**

---

## ✅ PASO 3: Obtener tus credenciales de Firebase

1. En Firebase Console, haz clic en el ícono de engranaje (⚙️) en la esquina superior izquierda
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"General"**
4. Desplázate hacia abajo hasta **"Tus aplicaciones"**
5. Haz clic en el ícono **`</>`** (Firebase SDK)
6. Copia el objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "proyecto.firebaseapp.com",
  projectId: "proyecto",
  storageBucket: "proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def"
};
```

---

## ✅ PASO 4: Configurar el archivo .env.local

Ya tienes el archivo creado. Verifica que contenga:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

---

## ✅ PASO 5: Iniciar el proyecto

Ejecuta en la terminal:

```bash
npm run dev
```

**Resultado esperado:** El servidor inicia en http://localhost:3000

---

## ✅ PASO 6: Probar el registro

1. Abre http://localhost:3000/register
2. Completa el formulario:
   - Email: `test@ejemplo.com`
   - Contraseña: `password123`
   - Confirmar: `password123`
3. Haz clic en **"Registrarse"**

**Resultado esperado:**
- ✅ Se crea la cuenta en Firebase
- ✅ Redirige automáticamente a `/admin`
- ✅ Ves el panel admin con tu email mostrado

---

## ✅ PASO 7: Probar el login

1. Abre http://localhost:3000/login
2. Completa:
   - Email: `test@ejemplo.com`
   - Contraseña: `password123`
3. Haz clic en **"Ingresar"**

**Resultado esperado:**
- ✅ Se conecta correctamente
- ✅ Redirige a `/admin`
- ✅ Muestra tu email en la esquina superior

---

## ✅ PASO 8: Probar logout

1. En el panel admin, busca el botón **"Cerrar Sesión"**
2. Haz clic

**Resultado esperado:**
- ✅ Se cierra la sesión
- ✅ Redirige a `/login`

---

## 🔒 Protección de rutas

El panel admin (`/admin` y todas sus subrutas) está **automáticamente protegido**:

- Si intentas entrar sin estar autenticado → Redirige a `/login`
- Si cierras sesión → Redirige a `/login`
- Si recargas la página → Mantiene tu sesión (Firebase lo maneja)

---

## 📁 Archivos clave creados

| Archivo | Función |
|---------|---------|
| `lib/firebase.ts` | Configuración de Firebase |
| `lib/auth-context.tsx` | Contexto global de autenticación |
| `app/login/page.tsx` | Página de login funcional |
| `app/register/page.tsx` | Página de registro funcional |
| `app/admin/layout.tsx` | Layout protegido del admin |
| `.env.local` | Variables de entorno (confidencial) |

---

## 🚀 Próximos pasos opcionales

### 1. Agregar usuarios adicionales en Firebase

1. Ve a Firebase Console
2. En **Autenticación**, pestaña **"Usuarios"**
3. Haz clic en **"Agregar usuario"**
4. Ingresa email y contraseña
5. Haz clic en **"Crear usuario"**

Luego puedes iniciar sesión con esas credenciales.

### 2. Personalizar los mensajes de error

En `lib/auth-context.tsx`, función `translateFirebaseError()`, puedes agregar más errores personalizados.

### 3. Integrar con tu base de datos

Si quieres guardar información adicional del usuario (nombre, rol, etc.), puedes usar **Firestore** que ya está configurado en `lib/firebase.ts`.

### 4. Restablecer contraseña

Próxima mejora: agregar formulario de "¿Olvidaste tu contraseña?"

---

## ❌ Solución de problemas

### Error: "Firebase app not initialized"
- Verifica que `.env.local` está correcto
- Reinicia el servidor: `npm run dev`

### Error: "Email already in use"
- El email ya existe en Firebase
- Usa otro email o elimina el usuario desde Firebase Console

### No puedo acceder al admin
- Verifica estar autenticado en `/login`
- Abre la consola del navegador (F12) para ver errores
- Borra cookies si hay problemas de caché

### Cambios en .env no se aplican
- Detén el servidor (Ctrl + C)
- Reinicia: `npm run dev`

---

## 📞 Resumen rápido

| Acción | URL |
|--------|-----|
| Registrarse | http://localhost:3000/register |
| Iniciar sesión | http://localhost:3000/login |
| Panel admin | http://localhost:3000/admin |
| Cerrar sesión | Click en botón en admin |

¡**Tu autenticación está lista para usar! 🎉**
