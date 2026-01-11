# DJ Presskit Capsule 01

Template de presskit para DJs con arquitectura escalable.

---

## Arquitectura

```
src/
├── app/            # Next.js App Router
├── components/     # Componentes UI
│   ├── nav/        # Navegación
│   ├── media/      # Imágenes, video, logo
│   └── ui/         # Base (Text, Icon, etc.)
├── config/         # Configuración estática
├── context/        # React Context (PresskitContext)
├── core/           # Theme, SEO, i18n, background
├── sections/       # Secciones de página
├── styles/         # CSS global
└── types/          # TypeScript types
```

---

## Convenciones de Código

### Archivos

| Tipo        | Convención       | Ejemplo               |
| ----------- | ---------------- | --------------------- |
| Componentes | `PascalCase.tsx` | `Nav.tsx`             |
| Hooks       | `use*.ts`        | `usePresskit.ts`      |
| Context     | `*Context.tsx`   | `PresskitContext.tsx` |
| Utils       | `camelCase.ts`   | `navigation.ts`       |
| Carpetas    | `camelCase`      | `nav/`, `media/`      |

### Exports/Imports

```tsx
// ✅ Named export para componentes
export function Nav() { ... }
export default Nav;

// ✅ Barrel export en index.ts
export { Nav } from "./Nav";

// ✅ Imports absolutos
import { Nav } from "@/components/nav";

// ✅ Imports relativos en misma carpeta
import SocialLinks from "./SocialLinks";
```

### Orden en Componentes

```tsx
// 1. External imports
import { clsx } from "clsx";

// 2. Internal imports (@/)
import { usePresskit } from "@/context";

// 3. Relative imports
import SocialLinks from "./SocialLinks";

// 4. Types
interface NavProps { ... }

// 5. Component
export function Nav() { ... }

// 6. Default export
export default Nav;
```

---

## Flujo de Datos

```
PresskitProvider (context)
        ↓
  usePresskit() hook
        ↓
  Nav / Hero / Sections
```

Los componentes acceden a los datos via `usePresskit()`, sin prop drilling.

---

## Agregar una Sección

1. Crear en `sections/NombreSeccion.tsx`
2. Usar `usePresskit()` para acceder a datos
3. Agregar barrel export en `sections/index.ts`
4. Importar en `page.tsx`
