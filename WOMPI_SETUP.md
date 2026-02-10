# Configuración de Wompi para Donaciones

## Pasos para configurar Wompi

### 1. Crear cuenta en Wompi
1. Ve a [https://comercios.wompi.co/](https://comercios.wompi.co/)
2. Regístrate como comercio
3. Completa el proceso de verificación

### 2. Obtener las credenciales
1. Inicia sesión en tu panel de Wompi
2. Ve a **Configuración > API Keys**
3. Copia las siguientes credenciales:
   - **Public Key** (pub_test_... para pruebas, pub_prod_... para producción)
   - **Private Key** (prv_test_... para pruebas, prv_prod_... para producción)
   - **Events Key** (para verificar webhooks)

### 3. Configurar variables de entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con tus credenciales reales:

\`\`\`env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_tu_clave_publica
WOMPI_PRIVATE_KEY=prv_test_tu_clave_privada
WOMPI_EVENTS_KEY=tu_clave_de_eventos
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Configurar Webhooks
1. En el panel de Wompi, ve a **Configuración > Webhooks**
2. Agrega la URL de tu webhook: `https://tu-dominio.com/api/wompi/webhook`
3. Selecciona los eventos que quieres recibir:
   - `transaction.updated`

### 5. Datos de prueba (Sandbox)

#### PSE
- **Banco aprobado**: Código `1`
- **Banco rechazado**: Código `2`

#### Nequi
- **Teléfono aprobado**: `3991111111`
- **Teléfono rechazado**: `3992222222`

#### Daviplata
- Usa los mismos números de prueba que Nequi

### 6. Ir a producción
1. Completa el proceso de verificación en Wompi
2. Reemplaza las keys de prueba (`test`) por las de producción (`prod`)
3. Actualiza la URL del webhook con tu dominio de producción
4. Configura `NEXT_PUBLIC_APP_URL` con tu dominio real

## Métodos de pago disponibles

✅ **PSE** - Pagos desde cualquier banco colombiano
✅ **Nequi** - Pagos con cuenta Nequi
✅ **Daviplata** - Pagos con cuenta Daviplata

## Flujo de donación

1. Usuario hace clic en "Donar Ahora"
2. Se abre el modal con el formulario de donación
3. Usuario selecciona método de pago y completa datos
4. Se crea la transacción en Wompi
5. Usuario es redirigido a completar el pago:
   - **PSE**: Redirige al banco seleccionado
   - **Nequi/Daviplata**: Usuario aprueba en su app móvil
6. Wompi envía webhook con el resultado
7. Usuario es redirigido a página de confirmación

## Soporte

Para más información, consulta la documentación oficial:
- [Documentación Wompi](https://docs.wompi.co/)
- [Métodos de pago](https://docs.wompi.co/docs/colombia/metodos-de-pago/)
