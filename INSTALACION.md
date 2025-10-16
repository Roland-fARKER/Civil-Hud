# Guía de Instalación Rápida - CivilHud

## Pasos Rápidos

### 1. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings → API** y copia:
   - Project URL
   - anon public key
   - service_role key

### 3. Configurar Variables de Entorno

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edita `.env.local` con tus credenciales de Supabase.

### 4. Ejecutar Scripts SQL

En Supabase, ve a **SQL Editor** y ejecuta en orden:

1. `scripts/01-create-tables.sql`
2. `scripts/02-create-policies.sql`
3. `scripts/03-seed-hardware-stores.sql`
4. `scripts/04-create-profile-trigger.sql`

### 5. Iniciar la Aplicación

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000)

## ¿Problemas?

Consulta el archivo `README.md` para más detalles.
