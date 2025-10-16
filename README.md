# CivilHud 🏗️

<p align="center">
  <img src="./assets/logo-1.png" alt="CivilHud Logo" width="200"/>
</p>

# CivilHud - Plataforma de Cálculo de Materiales y Licitaciones

CivilHud es una aplicación web completa para ingenieros civiles, arquitectos y profesionales de la construcción que permite calcular materiales de construcción, gestionar licitaciones y conectar con proveedores.

---

## Características Principales

- **Calculadoras de Materiales**: Mampostería, columnas/vigas y pisos
- **Sistema de Licitaciones**: Crea, explora y participa en licitaciones
- **Chat en Tiempo Real**: Comunicación directa entre clientes y contratistas
- **Gestión de Perfil**: Dashboard personalizado para cada tipo de usuario
- **Tiendas de Materiales**: Directorio de ferreterías y proveedores

---

## 🚀 Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS v4
- **Animaciones**: Framer Motion
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **UI Components**: Radix UI, shadcn/ui

---

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta en Supabase (gratuita)

---

## 🛠️ Desarrollo

### Servidor de desarrollo

```bash
npm run dev
```
Navega a http://localhost:3000/ 🚀. La aplicación se recargará automáticamente al hacer cambios en los archivos fuente.

## 🛠️ Contruccion del proyecto

```bash
npm run build
```

Esto compilará el proyecto y almacenará los artefactos en la carpeta dist/.
El build de producción incluye optimizaciones para rendimiento y velocidad.

---

### 3. Configurar Supabase

#### a) Crear un Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que el proyecto se inicialice (2-3 minutos)

#### b) Obtener las Credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (URL)
   - **anon public** (API Key pública)
   - **service_role** (API Key privada - ¡mantén esto secreto!)

3. Ve a **Settings** → **Database** y copia:
   - **Connection string** (URI)

#### c) Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` y renómbralo a `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Abre `.env.local` y reemplaza los valores con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_URL=https://tu-proyecto.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_ANON_KEY=tu_anon_key_aqui

SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
SUPABASE_JWT_SECRET=tu_jwt_secret_aqui

# Las URLs de PostgreSQL las encuentras en Settings → Database
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. Configurar la Base de Datos

Ejecuta los scripts SQL en tu proyecto de Supabase:

1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Ejecuta los scripts en este orden:

   **Script 1: Crear Tablas** (`scripts/01-create-tables.sql`)
   - Copia y pega el contenido completo
   - Haz clic en "Run"

   **Script 2: Políticas de Seguridad** (`scripts/02-create-policies.sql`)
   - Copia y pega el contenido completo
   - Haz clic en "Run"

   **Script 3: Datos de Ejemplo** (`scripts/03-seed-hardware-stores.sql`)
   - Copia y pega el contenido completo
   - Haz clic en "Run"

   **Script 4: Trigger de Perfiles** (`scripts/04-create-profile-trigger.sql`)
   - Copia y pega el contenido completo
   - Haz clic en "Run"

### 5. Ejecutar el Proyecto

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
civilhud/
├── app/                          # Rutas de Next.js
│   ├── page.tsx                 # Landing page
│   ├── login/                   # Página de inicio de sesión
│   ├── signup/                  # Página de registro
│   ├── dashboard/               # Dashboard de usuario
│   ├── calculators/             # Calculadoras de materiales
│   │   ├── masonry/            # Calculadora de mampostería
│   │   ├── column-beam/        # Calculadora de columnas/vigas
│   │   └── floor/              # Calculadora de pisos
│   ├── tenders/                 # Sistema de licitaciones
│   ├── messages/                # Chat en tiempo real
│   ├── profile/                 # Configuración de perfil
│   └── stores/                  # Tiendas de materiales
├── components/                   # Componentes React
│   ├── auth/                    # Componentes de autenticación
│   ├── calculators/             # Componentes de calculadoras
│   ├── dashboard/               # Componentes del dashboard
│   ├── messages/                # Componentes de chat
│   ├── tenders/                 # Componentes de licitaciones
│   └── ui/                      # Componentes UI reutilizables
├── lib/                         # Utilidades y configuración
│   └── supabase/               # Clientes de Supabase
├── scripts/                     # Scripts SQL para la base de datos
└── public/                      # Archivos estáticos

```

## Rutas de la Aplicación

### Públicas
- `/` - Página principal
- `/login` - Inicio de sesión
- `/signup` - Registro
- `/calculators` - Lista de calculadoras
- `/calculators/masonry` - Calculadora de mampostería
- `/calculators/column-beam` - Calculadora de columnas y vigas
- `/calculators/floor` - Calculadora de pisos
- `/tenders` - Explorar licitaciones
- `/stores` - Tiendas de materiales

### Protegidas (requieren autenticación)
- `/dashboard` - Panel de usuario
- `/profile` - Configuración de perfil
- `/tenders/create` - Crear licitación
- `/tenders/[id]` - Detalles de licitación
- `/messages` - Mensajes
- `/messages/[tenderId]` - Chat de licitación

## Tipos de Usuario

1. **Cliente**: Puede crear licitaciones y ver ofertas
2. **Contratista**: Puede ofertar en licitaciones
3. **Proveedor**: Puede ver licitaciones y ofrecer materiales

## Solución de Problemas

### Error: "Profile creation error"
- Asegúrate de haber ejecutado el script `04-create-profile-trigger.sql`
- Verifica que las políticas RLS estén correctamente configuradas

### Error: "Invalid API key"
- Verifica que las variables de entorno en `.env.local` sean correctas
- Asegúrate de haber copiado las claves completas sin espacios

### Error: "Database connection failed"
- Verifica que las URLs de PostgreSQL sean correctas
- Asegúrate de que tu proyecto de Supabase esté activo

### La aplicación no carga
- Verifica que todas las dependencias estén instaladas: `npm install`
- Limpia el caché: `rm -rf .next` y vuelve a ejecutar `npm run dev`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 📊 Modelo de Negocio (Canvas)

**Propuesta de valor**
CivilHud es la integración única de cálculos técnicos y subasta digital en una sola web.

✅ Ahorro económico y reducción de desperdicios para usuarios.

✅ Transparencia y acceso a nuevos clientes para ferreterías.

✅ Inclusión digital de usuarios con y sin conocimientos técnicos.

✅ Reducción de la economía informal en el sector construcción.

<p align="center">
    <h1 align="center">💡 Construyendo el futuro de la construcción digital en Nicaragua.</h1>
</p>