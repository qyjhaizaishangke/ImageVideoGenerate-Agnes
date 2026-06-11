---
name: material-design
description: Build UI components in this project using Material Design 3 design tokens and patterns. Use when creating or styling any frontend component, handling theming (light/dark), or picking colors, typography, elevation, or shape values. This skill maps the project's MD3 CSS custom properties and Tailwind v4 theme tokens so components stay visually consistent and theme-aware.
---

# Material Design 3

## Token usage

### Tailwind utilities (preferred)

All MD3 tokens are mapped in `src/theme/theme.css` via `@theme`. Use Tailwind utility classes directly:

```tsx
<button class="bg-primary text-on-primary rounded-corner-full shadow-elevation-1">
  Click
</button>
<div class="bg-surface-container text-on-surface text-body-lg">
  Content
</div>
```

### CSS custom properties (for inline styles / dynamic values)

```tsx
<div style={{ "background-color": "var(--md-sys-color-surface-container)" }}>
```

## Color tokens

| Role | Tailwind class | CSS variable |
|------|---------------|--------------|
| Primary | `bg-primary` `text-primary` | `--md-sys-color-primary` |
| On Primary | `text-on-primary` | `--md-sys-color-on-primary` |
| Primary Container | `bg-primary-container` | `--md-sys-color-primary-container` |
| Secondary | `bg-secondary` | `--md-sys-color-secondary` |
| Tertiary | `bg-tertiary` | `--md-sys-color-tertiary` |
| Error | `bg-error` `text-error` | `--md-sys-color-error` |
| Surface (main bg) | `bg-surface` | `--md-sys-color-surface` |
| On Surface (main text) | `text-on-surface` | `--md-sys-color-on-surface` |
| On Surface Variant | `text-on-surface-variant` | `--md-sys-color-on-surface-variant` |
| Outline | `border-outline` | `--md-sys-color-outline` |
| Outline Variant | `border-outline-variant` | `--md-sys-color-outline-variant` |
| Surface Container | `bg-surface-container` | `--md-sys-color-surface-container` |
| Surface Container Low | `bg-surface-container-low` | `--md-sys-color-surface-container-low` |
| Surface Container High | `bg-surface-container-high` | `--md-sys-color-surface-container-high` |

See [references/tokens.md](references/tokens.md) for the complete token reference.

## Elevation / shadows

Use Tailwind shadow utilities that map to MD3 elevation levels:

```
shadow-elevation-0   (none)
shadow-elevation-1   (cards, buttons at rest)
shadow-elevation-2   (FAB, raised buttons)
shadow-elevation-3   (dialogs, menus)
shadow-elevation-4   (nav drawers, modals)
shadow-elevation-5   (full-screen dialogs)
```

## Shape / border radius

```
rounded-corner-none    (0px)
rounded-corner-xs      (4px)
rounded-corner-sm      (8px)
rounded-corner-md      (12px)  — cards, sheets
rounded-corner-lg      (16px)
rounded-corner-xl      (28px)
rounded-corner-full    (9999px) — pills, chips
```

## Typography

MD3 typescale classes map to Tailwind `text-*` and `leading-*`:

| MD3 role | Tailwind | Use for |
|----------|----------|---------|
| Display Large | `text-display-lg` | Hero headlines |
| Headline Large | `text-headline-lg` | Page titles |
| Headline Medium | `text-headline-md` | Section titles |
| Title Large | `text-title-lg` | Dialog titles |
| Title Medium | `text-title-md` | Card titles |
| Body Large | `text-body-lg` | Body paragraphs |
| Body Medium | `text-body-md` | Default text |
| Label Large | `text-label-lg` | Button text |

Font family is Roboto, set via `--md-sys-typescale-*` tokens.

## Component patterns

### Card

```tsx
<div class="bg-surface-container-low rounded-corner-md shadow-elevation-1 p-4">
  <h2 class="text-title-md text-on-surface">Title</h2>
  <p class="text-body-md text-on-surface-variant">Description</p>
</div>
```

### Primary button (filled)

```tsx
<button class="bg-primary text-on-primary px-6 py-2.5 rounded-corner-full
               text-label-lg shadow-elevation-1
               hover:shadow-elevation-2 transition-shadow">
  Action
</button>
```

### Outlined button

```tsx
<button class="border border-outline text-primary px-6 py-2.5
               rounded-corner-full text-label-lg
               hover:bg-primary/8">
  Cancel
</button>
```

### Input field

```tsx
<div class="bg-surface-container-highest rounded-corner-xs border-b
            border-on-surface-variant px-4 py-3">
  <input class="bg-transparent text-on-surface text-body-lg outline-none w-full"
         placeholder=" " />
</div>
```

### Navigation rail / tabs

```
bg-surface-container text-on-surface-variant  (inactive tab)
bg-primary-container text-on-primary-container (active tab)
```

## Theme: light / dark

This project auto-follows system `prefers-color-scheme` and persists manual overrides in `localStorage` key `app-theme`.

- **Light theme**: default (`:root` in `src/theme/themes/light.css`)
- **Dark theme**: `html[data-theme="dark"]` in `src/theme/themes/dark.css`)
- Theme is applied via `document.documentElement.dataset.theme`

### Manual theme toggle

```tsx
import { setTheme, clearThemeOverride } from "../index";

// Force dark
setTheme("dark");

// Force light
setTheme("light");

// Follow system again
clearThemeOverride();
```

### Component-level theme awareness

Never hardcode colors; always use tokens. Components work in both themes automatically because tokens switch values when `data-theme="dark"` is set.

## Files

| File | Purpose |
|------|---------|
| `src/theme/theme.css` | Tailwind `@theme` block mapping tokens |
| `src/theme/themes/light.css` | Light theme CSS variables |
| `src/theme/themes/dark.css` | Dark theme CSS variables |
| `src/index.tsx` | Theme init + `setTheme`/`clearThemeOverride` exports |
| `src/index.css` | Imports Tailwind + theme.css |
