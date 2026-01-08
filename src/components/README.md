# Components

Componentes UI reutilizables.

## Componentes de layout

| Componente   | Descripción                          |
| ------------ | ------------------------------------ |
| `Nav`        | Barra de navegación sticky con blur  |
| `EmptyState` | Placeholder para secciones sin datos |

## Componentes de contenido

| Componente     | Props                    | Descripción                       |
| -------------- | ------------------------ | --------------------------------- |
| `EventCard`    | `event`                  | Card de un evento                 |
| `ReleaseCard`  | `release, dict`          | Card de un release                |
| `RiderItem`    | `item`                   | Item del rider técnico            |
| `SocialIcon`   | `platform, url, iconUrl` | Icono de red social               |
| `EmbedFrame`   | `src, title`             | Iframe seguro para YouTube        |
| `ExternalLink` | `href, children`         | Link externo con `rel="noopener"` |

## Componentes UI base (`ui/`)

Componentes genéricos en `components/ui/`:

- `Container` - Contenedor responsive
- `Section` - Wrapper de sección con ID
- `Stack` - Flexbox con gap
- `Heading` - Títulos (h1-h6)
- `Text` - Párrafos con variantes
- `Badge` - Badges/tags
- `Button` - Botones

## Uso

```tsx
import { EventCard } from "@/components/EventCard";
import { Container, Section } from "@/components/ui";

<Section id="events">
  <Container>
    {events.map((event) => (
      <EventCard key={event.id} event={event} />
    ))}
  </Container>
</Section>;
```
