# DJ Presskit Capsule Core - Migration Notes

## Source of Truth Mapping

| Domain          | Source                  | File                            | Notes                                         |
| --------------- | ----------------------- | ------------------------------- | --------------------------------------------- |
| **Fonts**       | Capsule 00              | `app/layout.tsx`                | Bebas_Neue + Unbounded. Added Inter for body. |
| **SEO**         | Capsule 00              | `app/[lang]/layout.tsx:19-201`  | Comprehensive generateMetadata.               |
| **Favicon**     | Capsule 00              | `app/[lang]/layout.tsx:141-182` | FaviconSet with custom or defaults.           |
| **OG Image**    | Capsule 00              | `app/[lang]/layout.tsx:30-32`   | Default `/og_image.png`.                      |
| **API Client**  | Capsule Core (existing) | `src/lib/api.ts`                | Enhanced with AbortController + zod.          |
| **Types**       | Capsule Core            | `src/types/index.ts`            | Extended with PresskitPublicView.             |
| **Theme**       | Capsule 00              | `components/ThemeProvider.tsx`  | CSS variable injection.                       |
| **Backgrounds** | Capsule 00              | `components/background/*`       | Ported with framer-motion (not Three.js).     |
| **i18n**        | Capsule 00              | `i18n/index.ts`                 | getDictionary pattern.                        |

---

## What Was Copied

### From Capsule 00 (`dj-presskit-00-template`)

1. **`app/layout.tsx`** → Fonts setup (Bebas_Neue, Unbounded)

   - Modified: Added Inter as body font
   - Why: Baseline typography for all capsules

2. **`app/[lang]/layout.tsx`** → SEO generation pattern

   - Copied: Entire generateMetadata function
   - Modified: Adapted for `/t/[slug]/[lang]/...` route
   - Why: Comprehensive SEO with OG, Twitter, robots, icons

3. **`public/logos/`** → Default favicon assets

   - Copied: All sizes (16, 32, 48, 180, 192, 512)
   - Why: Default branding when DJ has no custom favicon

4. **`public/og_image.png`** → Default OG image

   - Copied: 70KB PNG
   - Why: Default social sharing image

5. **`components/ThemeProvider.tsx`** → Theme system

   - Modified: Extended with derived colors (muted, border)
   - Why: CSS variable injection for accent color

6. **`components/background/BackgroundRenderer.tsx`** → Background system

   - Modified: Replaced Three.js with framer-motion
   - Why: Lighter bundle, same visual effect

7. **`i18n/`** → Internationalization
   - Copied: Dictionary structure (es, en)
   - Modified: Added more UI strings
   - Why: Locale-aware UI labels

---

## What Was NOT Copied (Intentionally)

- **NavBar, Footer components** → Skin-specific
- **Section components (Events, About, etc.)** → Skin-specific
- **Analytics, ExternalTags** → Capsule-specific
- **StructuredData** → Can be added per capsule
- **Host resolution middleware** → Moved to Router

---

## Key Modifications

### 1. API Client (`src/lib/api/presskit.ts`)

```diff
+ AbortController with 3s timeout
+ Zod validation with passthrough
+ Returns { presskit, isNotFound, error } instead of throwing
```

### 2. Route Structure

```diff
- /[lang]/page.tsx (slug from env)
+ /t/[slug]/[lang]/[[...rest]]/page.tsx (slug from URL)
```

### 3. Backgrounds

```diff
- react-three-fiber (WebGL, heavy)
+ framer-motion (CSS animations, light)
```

### 4. Types (`src/types/index.ts`)

```diff
+ Comprehensive PresskitPublicView with all sub-types
+ Index signature for forward compatibility
```

---

## TODOs for Router/API

### Router (`dj-presskit-router`)

- [x] Rewrite `/` → `/t/{slug}/{lang}/`
- [ ] Consider passing `X-Canonical-Host` header for canonical URL

### API (`dj-presskit-api`)

- [ ] Ensure `faviconSet` is included in public endpoint response
- [ ] Ensure `theme.background.cloudflareStreamId` is exposed

---

## QA Validation

### Test Case 1: Valid Presskit

```bash
curl -I "http://localhost:3000/t/servando/es"
# Expected: 200 OK
# Check: og:image, canonical, favicon links
```

### Test Case 2: Non-existent Presskit

```bash
curl -I "http://localhost:3000/t/nonexistent/es"
# Expected: 302 redirect to /not-found-tenant
# Check: robots noindex
```

### Test Case 3: Deleted Presskit

```bash
# Requires API to return status=DELETED for some slug
curl -I "http://localhost:3000/t/deleted-dj/es"
# Expected: 302 redirect to /gone
# Check: robots noindex
```

---

## File Count Summary

```
src/app/            - 7 files (layouts + pages)
src/components/ui/  - 10 files (UI kit)
src/core/           - 17 files (background, config, design, i18n, seo, theme)
src/lib/            - 4 files (api, cn)
src/types/          - 1 file
src/styles/         - 1 file
public/             - 9 files (logos, og, manifest)
TOTAL               - ~49 source files
```
