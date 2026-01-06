# DJ Presskit Capsule Core

**Professional Boilerplate** for DJ Presskit capsules — router-first, multi-tenant, batteries included.

## 🎯 Router-First Architecture

This capsule core does **NOT** resolve hosts. The external router (`dj-presskit-router`) handles `host → slug` resolution and rewrites requests to:

```
/t/{slug}/{lang}/[...rest]
```

The capsule purely renders presskit data fetched by slug.

---

## 📦 Features

| Feature                | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| **UI Kit**             | Container, Section, Stack, Text, Heading, Button, Badge, Link, Icon      |
| **Theme System**       | ThemeProvider with CSS variables (`--accent`, `--bg`, `--fg`, `--muted`) |
| **Background Library** | 5 presets: gradient, silk, dither-noise, dither-waves, video             |
| **Deep Links (SPA)**   | Section scroll on path segments (`/t/slug/es/gallery`)                   |
| **SEO Helpers**        | Canonical URLs exclude section paths (no duplicate content)              |
| **i18n**               | Spanish/English UI labels (`getDictionary(lang)`)                        |
| **API Client Pro**     | Zod validation, AbortController timeout, graceful 404 handling           |
| **Reduced Motion**     | Respects `prefers-reduced-motion` for animations                         |
| **Lazy Loading**       | Background presets loaded dynamically, GSAP optional                     |

---

## 🔗 Deep Links (SPA)

Presskits are SPA (single-page applications), but support deep links to sections via path segments:

```
/t/servando/es/technical-rider  → Scrolls to #technical-rider
/t/servando/es/gallery          → Scrolls to #gallery
/t/servando/es/soundcloud       → Scrolls to #soundcloud
```

### Supported Sections

- `about`, `events`, `releases`, `soundcloud`, `youtube`, `gallery`, `technical-rider`, `contact`

### Aliases

Aliases are automatically normalized:

- `rider` → `technical-rider`
- `music` → `releases`
- `bio` → `about`
- `photos` → `gallery`

### Unknown Sections

If a path includes an unknown section (e.g. `/t/slug/es/whatever`), the SPA renders normally from the top. No 404.

### SEO Behavior

**Canonical URLs exclude section paths** to prevent duplicate content indexing:

```html
<!-- For /t/servando/es/gallery -->
<link rel="canonical" href="https://servando.dj-presskit.com/es" />
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <this-repo> my-capsule
cd my-capsule
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_DJ_PRESSKIT_API_URL=http://localhost:3010
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/t/{slug}/es` (where `{slug}` is a valid DJ slug).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, globals.css)
│   ├── page.tsx               # Root redirect
│   ├── gone/page.tsx          # 410 page (deleted presskit)
│   ├── not-found-tenant/page.tsx  # 404 page (unknown presskit)
│   └── t/[slug]/[lang]/
│       ├── layout.tsx         # Sets <html lang>
│       └── [[...rest]]/page.tsx  # Main presskit renderer
├── components/ui/             # UI Kit
│   ├── Container.tsx
│   ├── Section.tsx
│   ├── Stack.tsx
│   ├── Text.tsx
│   ├── Heading.tsx
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Link.tsx
│   ├── Icon.tsx
│   └── index.ts
├── core/
│   ├── background/            # Background system
│   │   ├── BackgroundRenderer.tsx
│   │   ├── normalizeTheme.ts
│   │   ├── backgroundCatalog.ts
│   │   └── presets/
│   │       ├── GradientBackground.tsx
│   │       ├── SilkBackground.tsx
│   │       ├── DitherNoiseBackground.tsx
│   │       ├── DitherWavesBackground.tsx
│   │       └── VideoBackground.tsx
│   ├── config/index.ts        # App configuration
│   ├── i18n/                  # Internationalization
│   │   ├── index.ts
│   │   └── dictionaries/
│   │       ├── es.ts
│   │       └── en.ts
│   ├── seo/index.ts           # SEO helpers
│   └── theme/                 # Theme system
│       ├── ThemeProvider.tsx
│       ├── tokens.ts
│       └── index.ts
├── lib/
│   ├── cn.ts                  # clsx + tailwind-merge helper
│   └── api/                   # API client
│       ├── presskit.ts
│       ├── schemas.ts
│       └── index.ts
├── styles/
│   └── globals.css            # Tailwind + CSS variables
└── types/
    └── index.ts               # TypeScript types
```

---

## 🎨 Theming

The theme is set via API data. ThemeProvider injects CSS variables:

```css
:root {
  --accent: #59c6ba; /* From presskit.theme.accentColor */
  --bg: #0a0a0a;
  --fg: #ffffff;
  --muted: #1a1a1a;
  --muted-fg: #a3a3a3;
}
```

Use Tailwind classes like `bg-accent`, `text-foreground`, etc.

---

## 🖼️ Backgrounds

BackgroundRenderer supports:

| Mode     | Description                                               |
| -------- | --------------------------------------------------------- |
| `preset` | Animated backgrounds (gradient, silk, dither-noise/waves) |
| `video`  | Cloudflare Stream or direct URL                           |
| `image`  | Static image (fallback to gradient)                       |
| `none`   | No background                                             |

All animated presets are **lazy loaded** and respect **prefers-reduced-motion**.

---

## 🌐 Environment Variables

| Variable                          | Required | Description                      |
| --------------------------------- | -------- | -------------------------------- |
| `NEXT_PUBLIC_DJ_PRESSKIT_API_URL` | ✅       | API base URL (no trailing slash) |

---

## ✅ QA Checklist

### Pre-Deploy

- [ ] `npm run build` passes
- [ ] `npm run lint` clean
- [ ] API URL configured in `.env.local`

### Test Cases

1. **Valid Presskit**: Navigate to `/t/servando/es`

   - ✅ Theme accent applied
   - ✅ Background renders
   - ✅ Hero shows artistName + bio

2. **Non-existent Presskit**: Navigate to `/t/nonexistent/es`

   - ✅ Redirects to `/not-found-tenant`
   - ✅ robots: noindex, nofollow

3. **Reduced Motion**: Enable in OS accessibility
   - ✅ Animations disabled
   - ✅ Background still renders (static)

### Manual Verification

```bash
# Check canonical URLs
curl -I "http://localhost:3000/t/servando/es" | grep -i canonical

# Check robots meta
curl -s "http://localhost:3000/t/servando/es" | grep -i robots
```

---

## 📝 Performance Notes

- **Background presets** are dynamically imported (no SSR, lazy load)
- **GSAP** is installed but NOT imported globally — use in skin components only
- **framer-motion** used for lightweight animations
- **Zod validation** runs on API responses but allows passthrough for forward compatibility

---

## 🔧 Extending

To create a custom presskit skin:

1. Clone this boilerplate
2. Modify components in `src/components/ui/`
3. Add sections in `src/app/t/[slug]/[lang]/[[...rest]]/page.tsx`
4. Customize backgrounds by editing presets in `src/core/background/presets/`

---

## 📄 License

Private — DJ Presskit © 2024-2026
