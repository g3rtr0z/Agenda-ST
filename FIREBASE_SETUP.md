# Configuración de Firebase para Agenda Santo Tomás

## Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: **"Agenda Santo Tomás"**
4. Sigue los pasos del asistente de creación

## Paso 2: Registrar Aplicación Web

1. En el panel del proyecto, haz clic en el ícono **Web** (`</>`)
2. Nombre de la app: **"Agenda ST Web"**
3. **NO** marques "Firebase Hosting" por ahora
4. Haz clic en "Registrar app"

## Paso 3: Copiar Credenciales

Verás un fragmento de código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "agenda-santo-tomas.firebaseapp.com",
  projectId: "agenda-santo-tomas",
  storageBucket: "agenda-santo-tomas.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Paso 4: Configurar en la Aplicación

1. Abre el archivo: `src/firebase.ts`
2. Reemplaza las credenciales de ejemplo con tus credenciales reales:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_AUTH_DOMAIN_AQUI",
  projectId: "TU_PROJECT_ID_AQUI",
  storageBucket: "TU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "TU_MESSAGING_SENDER_ID_AQUI",
  appId: "TU_APP_ID_AQUI"
};
```

## Paso 5: Habilitar Firestore Database

1. En el menú lateral de Firebase Console, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de producción"** (lo configuraremos después)
4. Elige la ubicación más cercana (ej: `southamerica-east1` para Santiago)
5. Haz clic en **"Habilitar"**

## Paso 6: Configurar Reglas de Seguridad

Por defecto, las reglas son muy restrictivas. Para desarrollo, usa estas reglas básicas:

1. En Firestore, ve a la pestaña **"Reglas"**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura en departments
    match /departments/{document=**} {
      allow read, write: if true;
    }
    
    // Permitir lectura y escritura en contacts
    match /contacts/{document=**} {
      allow read, write: if true;
    }
  }
}
```

> **⚠️ IMPORTANTE**: Estas reglas permiten acceso público. Para producción, deberás implementar autenticación y reglas más estrictas.

3. Haz clic en **"Publicar"**

## Paso 7: Verificar Configuración

1. Inicia el servidor de desarrollo si no está corriendo:
   ```bash
   npm run dev
   ```

2. Abre el navegador en `http://localhost:5173`

3. Intenta:
   - Seleccionar una institución
   - Crear un departamento
   - Agregar un contacto

4. Verifica en Firebase Console > Firestore Database que se crean las colecciones `departments` y `contacts`

## Estructura de Datos en Firestore

### Colección: `departments`
```javascript
{
  name: string,           // "Rectoría"
  institution: string,    // "Universidad" | "Instituto Profesional" | "CFT"
  createdAt: number      // timestamp
}
```

### Colección: `contacts`
```javascript
{
  fullName: string,       // "Juan Pérez"
  email: string,          // "jperez@santotomas.cl"
  extension: string,      // "1234"
  location: string,       // "Edificio A, Oficina 201"
  departmentId: string,   // ID del departamento
  institution: string,    // "Universidad" | "Instituto Profesional" | "CFT"
  position: string?,      // "Director" (opcional)
  phone: string?,         // "+56 9 1234 5678" (opcional)
  schedule: string?,      // "Lunes a Viernes, 9:00 - 18:00" (opcional)
  createdAt: number,     // timestamp
  updatedAt: number      // timestamp
}
```

## Reglas de Seguridad para Producción (Futuro)

Cuando estés listo para producción, considera implementar:

1. **Firebase Authentication** para usuarios autorizados
2. **Reglas estrictas** basadas en roles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Solo administradores pueden escribir
    match /departments/{department} {
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    match /contacts/{contact} {
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

## Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que copiaste todas las credenciales correctamente
- Asegúrate de que el proyecto existe en Firebase Console

### Error: "Missing or insufficient permissions"
- Revisa las reglas de seguridad en Firestore
- Asegúrate de haber publicado las reglas

### Los datos no se sincronizan
- Verifica tu conexión a internet
- Revisa la consola del navegador para errores
- Confirma que Firestore esté habilitado en Firebase Console

## ¡Listo! 🎉

Tu aplicación de Agenda Santo Tomás ahora está conectada a Firebase y lista para usar.
