# Domain

El módulo `domain/` contiene la **lógica de negocio** que transforma los datos de la API en ViewModels listos para renderizar.

## ¿Por qué existe?

La API devuelve datos "crudos" que pueden tener:

- Campos nulos o vacíos
- URLs inválidas
- Fechas en distintos formatos
- Datos desordenados

Los **normalizers** limpian y transforman estos datos en un formato predecible.

## Estructura

```
domain/
├── types.ts           → Definición de ViewModels (AboutVM, EventsVM, etc.)
├── validators.ts      → Funciones puras de validación (isValidUrl, parseDate)
├── getPresskitData.ts → Función principal que ejecuta todos los normalizers
├── index.ts           → Exports
└── [section]/
    └── normalize.ts   → Normalizer específico para esa sección
```

## Ejemplo

```ts
// Input de la API (puede tener datos sucios)
{
  events: {
    upcoming: [{ date: "2024-02-15", venue: null }, ...]
  }
}

// Output del normalizer (limpio y tipado)
{
  events: {
    upcoming: [{ id: "...", date: Date, formattedDate: "15 Feb 2024", ... }],
    past: [],
    hasEvents: true,
    hasUpcoming: true
  }
}
```

## Archivos

| Archivo                 | Propósito                                 |
| ----------------------- | ----------------------------------------- |
| `types.ts`              | Interfaces de ViewModels                  |
| `validators.ts`         | Validación de URLs, fechas, strings       |
| `getPresskitData.ts`    | Ejecuta todos los normalizers             |
| `about/normalize.ts`    | Bio, géneros, ubicación                   |
| `events/normalize.ts`   | Separa próximos/pasados, ordena por fecha |
| `gallery/normalize.ts`  | Valida URLs, limita a 20 imágenes         |
| `releases/normalize.ts` | Parsea fechas, ordena releases            |
| `youtube/normalize.ts`  | Extrae IDs de videos                      |
| `rider/normalize.ts`    | Ordena items del rider técnico            |
| `socials/normalize.ts`  | Links de redes y contacto                 |
| `contact/normalize.ts`  | Email, WhatsApp, Google Drive             |
