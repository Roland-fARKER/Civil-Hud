## Arquitectura de CivilHud

### **Tipo de Arquitectura: Arquitectura en Capas con Patrón Feature-Based**

La aplicación utiliza una **arquitectura modular en capas** combinada con **Next.js App Router**, siguiendo estos principios:

---

## Capas de la Arquitectura

### **1. Capa de Presentación (UI Layer)**

```plaintext
components/
├── ui/              # Componentes base reutilizables (botones, cards, inputs)
├── auth/            # Componentes de autenticación
├── calculators/     # Componentes de calculadoras
├── dashboard/       # Componentes del dashboard
├── messages/        # Componentes de mensajería
├── tenders/         # Componentes de licitaciones
└── profile/         # Componentes de perfil
```

**Características:**

- Componentes React reutilizables
- Sistema de diseño basado en shadcn/ui
- Separación por funcionalidad (feature-based)


---

### **2. Capa de Rutas (Routing Layer)**

```plaintext
app/
├── page.tsx                    # Landing page (/)
├── login/page.tsx              # Login (/login)
├── signup/page.tsx             # Registro (/signup)
├── dashboard/page.tsx          # Dashboard (/dashboard)
├── calculators/
│   ├── page.tsx               # Lista de calculadoras
│   ├── masonry/page.tsx       # Calculadora de mampostería
│   ├── column-beam/page.tsx   # Calculadora de columnas
│   └── floor/page.tsx         # Calculadora de pisos
├── tenders/
│   ├── page.tsx               # Lista de licitaciones
│   ├── create/page.tsx        # Crear licitación
│   └── [id]/page.tsx          # Detalle de licitación
├── messages/
│   ├── page.tsx               # Lista de mensajes
│   └── [tenderId]/page.tsx    # Chat específico
├── profile/page.tsx            # Perfil de usuario
└── stores/page.tsx             # Tiendas de materiales
```

**Características:**

- File-based routing de Next.js 14+
- Rutas dinámicas con parámetros `[id]`
- Server Components por defecto


---

### **3. Capa de Lógica de Negocio (Business Logic Layer)**

```plaintext
lib/
├── supabase/
│   ├── client.ts    # Cliente Supabase para el navegador
│   └── server.ts    # Cliente Supabase para el servidor
└── utils.ts         # Utilidades generales (cn, formatters)
```

**Características:**

- Singleton pattern para clientes Supabase
- Separación cliente/servidor
- Funciones de utilidad compartidas


---

### **4. Capa de Datos (Data Layer)**

```plaintext
scripts/
├── 01-create-tables.sql          # Esquema de base de datos
├── 02-create-policies.sql        # Políticas RLS
├── 03-seed-hardware-stores.sql   # Datos iniciales
└── 04-create-profile-trigger.sql # Triggers automáticos
```

**Base de datos:** PostgreSQL (Supabase)

**Tablas principales:**

- `profiles` - Perfiles de usuario
- `calculations` - Cálculos guardados
- `tenders` - Licitaciones
- `bids` - Ofertas
- `messages` - Mensajes
- `hardware_stores` - Tiendas de materiales


---

### **5. Capa de Seguridad (Security Layer)**

```plaintext
middleware.ts  # Protección de rutas y gestión de sesiones
```

**Características:**

- Row Level Security (RLS) en Supabase
- Middleware de Next.js para proteger rutas
- Autenticación basada en JWT
- Refresh automático de tokens


---

## Flujo de Datos

```plaintext
Usuario → UI Component → Supabase Client → Supabase (PostgreSQL) → RLS Policies → Datos
                ↓
         Server Actions
                ↓
         Supabase Server Client
```

**Ejemplo de flujo:**

1. Usuario completa formulario de calculadora
2. Componente React captura datos
3. Cliente Supabase envía datos al servidor
4. RLS verifica permisos
5. Datos se guardan en PostgreSQL
6. Respuesta regresa al componente
7. UI se actualiza


---

## Patrones de Diseño Utilizados

### **1. Singleton Pattern**

```typescript
// lib/supabase/client.ts
let client: TypedSupabaseClient | undefined
export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(...)
  }
  return client
}
```

### **2. Repository Pattern (implícito)**

- Supabase actúa como repositorio
- Abstracción de acceso a datos


### **3. Component Composition**

```typescript
// app/page.tsx
<div>
  <Header />
  <Hero />
  <Features />
  <HowItWorks />
  <Footer />
</div>
```

### **4. Server/Client Component Pattern**

- Server Components para datos estáticos
- Client Components para interactividad


---

## ️ Principios Arquitectónicos

### **Separation of Concerns (SoC)**

- UI separada de lógica de negocio
- Componentes por funcionalidad
- Rutas organizadas por feature


### **DRY (Don't Repeat Yourself)**

- Componentes UI reutilizables
- Utilidades compartidas
- Hooks personalizados


### **Security by Default**

- RLS en todas las tablas
- Middleware de autenticación
- Variables de entorno para secretos


### **Scalability**

- Estructura modular
- Fácil agregar nuevas features
- Componentes independientes


---

## Stack Tecnológico

| Capa | Tecnología
|-----|-----
| **Frontend** | React 18 + Next.js 14 (App Router)
| **UI Components** | shadcn/ui + Radix UI
| **Styling** | Tailwind CSS v4
| **Animaciones** | Framer Motion
| **Backend** | Next.js API Routes + Server Actions
| **Base de Datos** | PostgreSQL (Supabase)
| **Autenticación** | Supabase Auth
| **Real-time** | Supabase Realtime
| **Hosting** | Vercel


---

## Ventajas de esta Arquitectura

✅ **Modular** - Fácil agregar/modificar features
✅ **Escalable** - Crece con el proyecto
✅ **Mantenible** - Código organizado y limpio
✅ **Segura** - RLS + Middleware + JWT
✅ **Performante** - Server Components + Edge Runtime
✅ **Type-Safe** - TypeScript en todo el stack

Esta arquitectura es ideal para aplicaciones SaaS modernas con múltiples features y necesidades de escalabilidad.
