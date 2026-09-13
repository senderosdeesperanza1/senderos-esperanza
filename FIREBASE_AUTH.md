# Autenticación con Firebase

Este proyecto utiliza Firebase Authentication para gestionar usuarios con correo y contraseña.

## Configuración

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Crear un proyecto"
3. Sigue los pasos de configuración
4. En la sección de Autenticación, habilita **Email/Contraseña**

### 2. Obtener las credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. En la pestaña "General", desplázate a "Tus aplicaciones"
3. Clic en el ícono </> para registrar una aplicación web
4. Copia la configuración de Firebase (apiKey, authDomain, projectId, etc.)

### 3. Configurar variables de entorno

1. Copia el archivo `example.env` a `.env.local`:
   ```bash
   cp example.env .env.local
   ```

2. Rellena las variables de Firebase con tus credenciales:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

3. Guarda el archivo

## Uso en componentes

### Hook useAuth()

```tsx
"use client";

import { useAuth } from "@/lib/auth-context";

export function MyComponent() {
  const { user, loading, login, signup, logout, error } = useAuth();

  return (
    <div>
      {loading ? <p>Cargando...</p> : null}
      {user ? <p>Hola {user.email}</p> : <p>No autenticado</p>}
    </div>
  );
}
```

### Propiedades de useAuth()

- **user**: Objeto del usuario autenticado o `null`
- **loading**: Booleano indicando si se está cargando
- **error**: Mensaje de error si hay alguno
- **login(email, password)**: Función para iniciar sesión
- **signup(email, password)**: Función para crear una cuenta
- **logout()**: Función para cerrar sesión
- **clearError()**: Limpiar el mensaje de error

## Flujo de autenticación

### Registro
1. Usuario accede a `/register`
2. Completa el formulario con email y contraseña
3. Se valida en el cliente
4. Se crea la cuenta en Firebase
5. Se redirige automáticamente a `/admin`

### Login
1. Usuario accede a `/login`
2. Ingresa email y contraseña
3. Se valida con Firebase
4. Se redirige a `/admin` si es exitoso

### Logout
1. Usuario hace clic en "Cerrar Sesión" en el admin
2. Se limpia la sesión de Firebase
3. Se redirige a `/login`

## Proteger rutas

Las rutas en `/admin` están protegidas. Si no estás autenticado, serás redirigido a `/login`.

El layout de admin utiliza el hook `useAuth()` para verificar autenticación y redirigir.

## Variables de entorno

### Públicas (NEXT_PUBLIC_)
Estas pueden ser vistas en el cliente y deben incluirse en el archivo `.env.local`:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

### Privadas
Si necesitas utilizar admin SDK o hacer operaciones en el servidor, debes agregar:
- FIREBASE_ADMIN_SDK_KEY (JSON como string)

## Archivos principales

- `lib/firebase.ts` - Configuración de Firebase
- `lib/auth-context.tsx` - Contexto de autenticación
- `app/login/page.tsx` - Página de login
- `app/register/page.tsx` - Página de registro
- `app/admin/layout.tsx` - Layout protegido del admin
- `app/api/auth/logout/route.ts` - Endpoint de logout

## Solución de problemas

### Error: "Firebase app not initialized"
Verifica que las variables de entorno estén correctas en `.env.local`

### Error: "Email already in use"
El email ya está registrado en Firebase. Usa otro email o restablece la contraseña.

### No puedo acceder al admin
Verifica que hayas iniciado sesión correctamente. Si aún tienes problemas, borra los cookies del navegador.

## Documentación oficial

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Next.js Firebase Integration](https://firebase.google.com/docs/web/setup)
