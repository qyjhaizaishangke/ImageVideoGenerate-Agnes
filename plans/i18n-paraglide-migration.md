# i18n Migration Plan — Paraglide JS

## Overview

Introduce [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) as
the i18n framework. Paraglide is a compiler-first, tree-shakeable i18n library that
integrates with Vite and works across frameworks including Solid.js.

**Target languages**: English (`en`) + Chinese (`zh`) to start, extensible to more.

**Locale strategy**: Client-side only. Language is detected from
`localStorage` (user choice) → `navigator.language` (first visit) → fallback
`en`. No URL prefix, no backend redirect — routes stay exactly as they are.

---

## 1. Dependencies to install

```bash
bun add @inlang/paraglide-js
bun add -D @inlang/paraglide-js-adapter-vite
```

> The Vite adapter handles message compilation at dev/build time and injects the
> runtime. No Solid-specific adapter is needed; Paraglide's framework-agnostic
> `m.*()` functions work directly in JSX.

---

## 2. New files to create

### 2.1 Project config: `project.inlang/project.json`

Paraglide requires an Inlang project directory with a manifest. Defines the
source language, target languages, and plugin (paraglide-js).

### 2.2 Message definitions: `messages/en.json` + `messages/zh.json`

All user-facing strings live here as key-value JSON. The English file is the
source of truth; Chinese is a translation target.

### 2.3 Language context: `src/i18n/LanguageProvider.tsx`

A Solid.js context that holds the current locale, provides a `setLanguage`
mutator, syncs `document.documentElement.lang`, and persists the choice to
`localStorage` key `app-locale`. Detects initial language on mount from
`localStorage` → `navigator.language` → `"en"`.

### 2.4 Runtime init: `src/i18n/index.ts`

Re-exports from the generated `src/paraglide/` runtime, plus the
`LanguageProvider` and `useLanguage` hook. Single import point for the rest
of the app.

### 2.5 Language switcher UI: `src/components/LanguageSwitcher.tsx`

A small dropdown or toggle button placed in the Menu sidebar (near the theme
toggle) that lets the user switch between `en` / `zh`. Calls
`setLanguage()` and persists to `localStorage`.

---

## 3. All user-facing strings to extract

### 3.1 `src/components/Menu/index.tsx` — 6 strings

| Current text          | Key suggestion          |
|-----------------------|-------------------------|
| `"Image Generate"`    | `nav.imageGenerate`     |
| `"Video Generate"`    | `nav.videoGenerate`     |
| `"Switch to light"`   | `menu.switchToLight`    |
| `"Switch to dark"`    | `menu.switchToDark`     |
| `"Collapse menu"`     | `menu.collapse`         |
| `"Expand menu"`       | `menu.expand`           |

### 3.2 `src/pages/ImageGenerate/components/PromptInput.tsx` — 1 string

| Current text                                  | Key suggestion          |
|-----------------------------------------------|-------------------------|
| `"Describe the image you want to generate..."` | `prompt.placeholder`    |

### 3.3 `src/pages/ImageGenerate/components/SendButton.tsx` — 1 string

| Current text    | Key suggestion   |
|-----------------|------------------|
| `"Send"`        | `common.send`    |

### 3.4 `src/pages/ImageGenerate/components/ImageUpload.tsx` — 1 string

| Current text               | Key suggestion         |
|----------------------------|------------------------|
| `"Upload reference image"` | `upload.title`         |

### 3.5 `src/pages/ImageGenerate/components/ModelSelect.tsx` — 2 strings

Model names are identifiers that the backend and Agnes API depend on. Keep
`value` attributes unchanged (English identifiers). Only the display labels
need i18n:

| Current display label | Key suggestion           |
|-----------------------|--------------------------|
| `"Image 2.0 Flash"`  | `model.image20Flash`     |
| `"Image 2.1 Flash"`  | `model.image21Flash`     |

> Implementation: build a small `MODEL_OPTIONS` const array of
> `{ value, labelKey }` objects, map over it in JSX, render `m[labelKey]()`.

### 3.6 `src/pages/ImageGenerate/components/ResultDisplay.tsx` — 7 strings

| Current text                        | Key suggestion           |
|-------------------------------------|--------------------------|
| `"Enter a prompt to start generating"` | `result.idleHint`     |
| `"Generating..."`                   | `result.generating`      |
| `"Download"`                        | `result.download`        |
| `"Download image"`                  | `result.downloadTitle`   |
| `"Generated result"`                | `result.altText`         |
| `"An unknown error occurred"`       | `result.unknownError`    |
| `"Retry"`                           | `result.retry`           |

### 3.7 `src/pages/VideoGenerate/index.tsx` — 2 strings

| Current text                       | Key suggestion          |
|------------------------------------|-------------------------|
| `"Video Generate"`                 | `nav.videoGenerate`     |
| `"Generate stunning videos with AI."` | `video.description` |

> `nav.videoGenerate` is reused from the Menu nav label — same key.

### 3.8 `index.html` — 2 values

| Current text               | Change                        |
|----------------------------|-------------------------------|
| `lang="en"`                | Dynamic via Paraglide runtime |
| `<title>Image Video Generator</title>` | Dynamic via JS side-effect |

> The `lang` attribute and `<title>` can be set by the LanguageProvider on
> mount via `document.documentElement.lang = ...` and `document.title = m.title()(...)`.

### 3.9 Summary: total ~23 user-facing strings (22 UI + 1 title)

---

## 4. Files to modify

| File                                            | Change                                                        |
|-------------------------------------------------|---------------------------------------------------------------|
| `vite.config.ts`                                | Add `paraglide()` plugin to Vite plugins array                |
| `index.html`                                    | Remove hardcoded `lang="en"`; runtime sets it                 |
| `src/index.tsx`                                 | Wrap app in `LanguageProvider`; call `initLanguage()`         |
| `src/components/Menu/index.tsx`                 | Replace 6 strings with `m.*()` calls + add LanguageSwitcher   |
| `src/pages/ImageGenerate/components/PromptInput.tsx` | Replace placeholder string                               |
| `src/pages/ImageGenerate/components/ModelSelect.tsx`  | Replace option labels with `m.*()` calls                |
| `src/pages/ImageGenerate/components/SendButton.tsx`   | Replace title string                                    |
| `src/pages/ImageGenerate/components/ImageUpload.tsx`  | Replace title string                                    |
| `src/pages/ImageGenerate/components/ResultDisplay.tsx`| Replace 7 hardcoded strings                           |
| `src/pages/VideoGenerate/index.tsx`             | Replace heading + description                                  |
| `package.json`                                  | Add 2 new dependencies                                         |
| `.gitignore`                                    | Add `src/paraglide/` (generated, should not be committed)      |

> Routes (`src/routes/index.tsx`) and backend (`src-back/`) are **not** modified.
> No URL prefix, no server-side redirect. Language lives entirely in client state.

---

## 5. Architecture decisions

### 5.1 Language detection priority

1. `localStorage` key `app-locale` (persisted user choice)
2. `navigator.language` (first visit only, mapped to supported locales)
3. Fallback: `en`

### 5.2 Generated output

Paraglide's compiler generates `src/paraglide/` at build time. This directory:
- Contains `messages.js` and `runtime.js`
- Must be added to `.gitignore`
- Must be listed in `tsconfig.app.json` `include` (or generated before `tsc`)

### 5.3 Interaction with existing theme system

The theme system (`src/theme/`) stores `app-theme` in `localStorage`. The
locale system will store `app-locale` separately in the same storage. Both
are initialized in `src/index.tsx` before the app mounts. The language
switcher sits next to the theme toggle in the Menu sidebar.

### 5.4 Paraglide + Solid.js reactivity

Paraglide's `m.*()` functions return plain strings and are not inherently
reactive. When the user switches language, Paraglide's internal
`languageTag()` changes, which means re-rendering must be triggered.
Approach: the LanguageProvider holds the locale in a Solid signal; setting it
calls Paraglide's `setLanguageTag()` and updates the signal, which cascades
through Solid's reactivity to re-render every component that calls `m.*()`.

### 5.5 Backend i18n

Backend error messages (`imageService.ts`, `ImageGenerateRoute.ts`) are NOT
translated. They are developer-facing API errors and should stay in English
for consistency with server logs. The frontend already maps them to
user-visible strings ("An unknown error occurred" → `m.result_unknownError()`).
This pattern is correct and continues unchanged.

---

## 6. Step-by-step migration order

| Step | Task                                                    | Risk  |
|------|---------------------------------------------------------|-------|
| 1    | Install dependencies (`bun add ...`)                     | Low   |
| 2    | Create `project.inlang/project.json`                     | Low   |
| 3    | Create `messages/en.json` with all ~23 keys              | Low   |
| 4    | Create `messages/zh.json` with Chinese translations      | Low   |
| 5    | Add `paraglide()` to `vite.config.ts`                    | Low   |
| 6    | Create `src/i18n/index.ts` + `LanguageProvider.tsx`      | Low   |
| 7    | Create `src/components/LanguageSwitcher.tsx`             | Low   |
| 8    | Wrap app in `LanguageProvider` in `src/index.tsx`        | Low   |
| 9    | Migrate `Menu` component (6 strings) + add switcher      | Low   |
| 10   | Migrate `VideoGenerate` page (2 strings)                 | Low   |
| 11   | Migrate `ModelSelect` (2 display labels)                 | Low   |
| 12   | Migrate `PromptInput` (1 string)                         | Low   |
| 13   | Migrate `SendButton` (1 string)                          | Low   |
| 14   | Migrate `ImageUpload` (1 string)                         | Low   |
| 15   | Migrate `ResultDisplay` (7 strings)                      | Low   |
| 16   | Update `index.html` for dynamic `lang` + `title`         | Low   |
| 17   | Update `.gitignore` to exclude `src/paraglide/`          | Low   |
| 18   | Test: language switch, persist across reload, fallback   | Low   |

---

## 7. Risks and open questions

1. **Paraglide + Solid.js reactivity**: Paraglide's `m.*()` returns static
   strings. LanguageProvider must bridge `setLanguageTag()` with a Solid
   signal so that switching language triggers re-render. This is a known
   pattern — wrap `setLanguageTag()` inside the signal setter.

2. **Bun compatibility**: Paraglide's Vite adapter uses Node APIs. Since the
   project runs Vite via Bun (which implements most Node APIs), this should
   work but is worth verifying early (step 5).

3. **First-load flash**: Without a URL prefix, the initial render will use
   the fallback language until the LanguageProvider mounts and corrects it.
   Mitigation: read `localStorage` in a blocking `<script>` in `index.html`
   (same pattern as the existing theme script), set `document.documentElement.lang`
   before the app mounts, and have Paraglide pick it up.

4. **RTL readiness**: Not needed now, but Paraglide supports it. The theme
   system's `dir` attribute can be set per locale if RTL languages are added
   later.
