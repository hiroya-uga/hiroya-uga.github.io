# Component Structure

## `src/components/Pages/`

Place page-level UI here. Keep `app/` focused on routing/SEO/metadata only.

```
src/components/Pages/<PageName>/
  index.ts               # barrel export
  <PageName>.tsx         # main component
  client/
    index.ts
    <ComponentName>.tsx  # 'use client' components
  server/
    index.ts
    <ComponentName>.tsx  # server components (only if needed)
```

Naming: PascalCase for dirs/files; `client/` and `server/` are lowercase exceptions.

### `app/page.tsx` pattern

```tsx
import { HomePage } from '@/components/Pages/HomePage';
import { JsonLd } from '@/components/Meta';
import { DEFAULT_JSON_LD } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/');

export default function Home() {
  return (
    <>
      <JsonLd data={{ ...DEFAULT_JSON_LD }} />
      <HomePage />
    </>
  );
}
```

---

## i18n

- Switch copy via `lang: 'ja' | 'en'` prop
- Manage strings in per-component `i18n` objects
- Define `languages` in `seo.ts` for hreflang; `getMetadata` handles `URL_ORIGIN` joining

| Lang | File                                             | URL                |
| ---- | ------------------------------------------------ | ------------------ |
| ja   | `src/app/(ja)/(common)/tools/<name>/page.tsx`    | `/tools/<name>`    |
| en   | `src/app/(en)/(common)/tools/<name>/en/page.tsx` | `/tools/<name>/en` |

---

## Articles directory

| Path                         | Content                          |
| ---------------------------- | -------------------------------- |
| `articles/blog/<year>/`      | Diary, camera, gadgets, non-tech |
| `articles/tech-blog/<year>/` | CSS, HTML, JS tech posts         |
| `articles/gunpla/<series>/`  | Gunpla build logs                |

`articles/tech-blog/` frontmatter requires `proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced'`.
