# Sections

Las **secciones** son los bloques visuales de la página del DJ.

Cada sección recibe un **ViewModel** (datos ya normalizados) y renderiza el UI.

## Secciones disponibles

| Sección    | Props                        | Descripción                     |
| ---------- | ---------------------------- | ------------------------------- |
| `Hero`     | `presskit, lang`             | Imágenes hero, nombre y tagline |
| `About`    | `about, dict`                | Bio, géneros, ubicación         |
| `Events`   | `events, dict`               | Próximos y pasados (tabs)       |
| `Releases` | `releases, dict`             | Discografía con links           |
| `YouTube`  | `youtube, dict`              | Videos embebidos                |
| `Gallery`  | `gallery, dict`              | Galería de fotos                |
| `Rider`    | `rider, dict`                | Requerimientos técnicos         |
| `Socials`  | `socials, dict`              | Iconos de redes + CTAs          |
| `Footer`   | `artistName, driveUrl, dict` | Copyright y links               |

## Uso

```tsx
import { About } from "@/sections/About";
import { getPresskitData } from "@/domain/getPresskitData";

// En el page.tsx
const data = getPresskitData(presskit);

<About about={data.about} dict={dict} />;
```

## Manejo de estados vacíos

Cada sección maneja automáticamente cuando no hay datos:

```tsx
if (!events.hasEvents) {
  return <EmptyState icon="📅" title="No hay eventos" />;
}
```

## Estilos

Las secciones usan:

- Clases de Tailwind
- `.glass` para efecto glassmorphism
- CSS variables (`--accent`, `--bg`, `--fg`)
