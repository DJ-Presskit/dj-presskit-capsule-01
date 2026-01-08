# Core

Funcionalidades compartidas del sistema.

## Módulos

| Módulo        | Descripción                              |
| ------------- | ---------------------------------------- |
| `i18n/`       | Internacionalización (ES/EN)             |
| `theme/`      | Colores accent y CSS variables           |
| `seo/`        | Metadata, Open Graph, canonical URLs     |
| `navigation/` | Scroll a secciones, deep links           |
| `background/` | Backgrounds animados (gradients, dither) |

## i18n

```ts
import { getDictionary, normalizeLocale } from "@/core/i18n";

const lang = normalizeLocale("es"); // "es" | "en"
const dict = getDictionary(lang);

dict.events.next; // "Próximos"
dict.events.past; // "Pasados"
```

## Theme

```tsx
import { ThemeProvider, getAccentColor } from "@/core/theme";

const accent = getAccentColor(theme?.accentColor);

<ThemeProvider accentColor={accent}>{children}</ThemeProvider>;
```

## SEO

```ts
import { buildCanonicalUrl, buildIconsMetadata } from "@/core/seo";

const canonical = buildCanonicalUrl({ canonicalHost, lang, restPath });
const icons = buildIconsMetadata(faviconSet);
```

## Background

```tsx
import { BackgroundRenderer } from "@/core/background";

<BackgroundRenderer theme={presskit.theme} />;
```
