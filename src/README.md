# DJ Presskit Capsule - Source Code

Este es el código fuente del template de presskit para DJs.

## Estructura

```
src/
├── app/            → Rutas de Next.js (App Router)
├── components/     → Componentes UI reutilizables
├── sections/       → Secciones de la página (Hero, About, Events, etc.)
├── domain/         → Lógica de negocio y transformación de datos
├── core/           → Funcionalidades core (i18n, SEO, theme, navigation)
├── lib/            → Utilidades y cliente API
├── styles/         → CSS global
└── types/          → TypeScript types compartidos
```

## Flujo de datos

```
API Response (DTO)
       ↓
   domain/getPresskitData()  ← Transforma los datos crudos
       ↓
   ViewModels (tipados)
       ↓
   sections/                  ← Renderiza los datos
       ↓
   HTML final
```

## Agregar una nueva sección

1. Crear el ViewModel en `domain/types.ts`
2. Crear el normalizer en `domain/[nombre]/normalize.ts`
3. Agregar a `domain/getPresskitData.ts`
4. Crear la sección en `sections/[Nombre].tsx`
5. Importar en `app/t/[slug]/[lang]/[[...rest]]/page.tsx`
