---
name: page-generator
description: Generate Solid.js page components using Material Design 3 design tokens, Tailwind CSS v4 utilities, and the project theme system. Use when creating a new page (route-level component) in a Solid.js app that follows MD3 theming, or when asked to scaffold a page layout, form page, dashboard page, or any full-page view with proper MD3 surface layers, typography, and spacing. NOT for reusable UI components -- use component-generator for buttons, cards, inputs, dialogs, etc.
---

# Page Generator

## Styling priority

1. **Tailwind CSS utilities** (preferred) -- use MD3-mapped token classes from `src/theme/theme.css`
2. **CSS Modules** (`*.module.css`) -- for complex animations, container queries, or when Tailwind cannot express it

## Page structure

Every page must follow this skeleton:

```tsx
import type { Component } from "solid-js";

const PageName: Component = () => {
  return (
    <main class="min-h-screen bg-surface text-on-surface">
      {/* page content */}
    </main>
  );
};

export default PageName;
```

## Router registration

After creating a page, register it in `src/routes/index.tsx`:

```tsx
import PageName from "../pages/PageName";
// Add to routes array:
{ path: "/page-path", component: PageName }
```

## Layout patterns

### Standard page with header + content

```tsx
<main class="min-h-screen bg-surface">
  <header class="bg-surface-container px-6 py-4 border-b border-outline-variant">
    <h1 class="text-headline-lg text-on-surface">Page Title</h1>
    <p class="text-body-md text-on-surface-variant mt-1">Page description</p>
  </header>
  <section class="p-6 max-w-7xl mx-auto">
    {/* main content */}
  </section>
</main>
```

### Centered form page

```tsx
<main class="min-h-screen bg-surface flex items-center justify-center p-6">
  <div class="bg-surface-container-low rounded-corner-md shadow-elevation-2 p-8 w-full max-w-lg">
    <h2 class="text-headline-md text-on-surface">Form Title</h2>
    {/* form fields */}
  </div>
</main>
```

### Sidebar + content (dashboard)

```tsx
<main class="min-h-screen bg-surface flex">
  <aside class="w-64 bg-surface-container-low border-r border-outline-variant p-4">
    <nav>
      {/* nav items */}
    </nav>
  </aside>
  <section class="flex-1 p-6">
    {/* main content */}
  </section>
</main>
```

## MD3 surface layering

Use ascending surface containers from lowest to highest to create visual hierarchy:

| Layer | Tailwind | Purpose |
|-------|----------|---------|
| Page background | `bg-surface` | `<main>` always |
| Navigation / sidebar | `bg-surface-container-low` | Sidebars, bottom bars |
| Content cards | `bg-surface-container-lowest` | Cards, sheets |
| Input fields | `bg-surface-container-highest` | Text fields, selects |

## Typography rules

- **Page title**: `text-headline-lg` (32/40)
- **Section title**: `text-headline-md` (28/36) or `text-title-lg` (22/28)
- **Card title**: `text-title-md` (16/24)
- **Body text**: `text-body-lg` (16/24) or `text-body-md` (14/20)
- **Labels / captions**: `text-label-md` (12/16)

## Spacing

- Page padding: `p-6` (24px)
- Section gaps: `gap-6` or `space-y-6`
- Card padding: `p-4` to `p-6`
- Max content width: `max-w-7xl` (80rem)

## File placement

```
src/pages/<PageName>/index.tsx          # page component
src/pages/<PageName>/index.module.css   # (only if needed)
```

If the page needs sub-components, create a `src/pages/<PageName>/components/` folder.

## Theme awareness

Never hardcode colors. All MD3 tokens auto-switch between light/dark via `data-theme`.
See `.codex/skills/material-design/references/tokens.md` for the full token reference.

## When to use CSS Modules

Only when Tailwind cannot express it:

- Complex `@keyframes` animations
- `@container` queries
- Pseudo-elements with custom content (`::before`, `::after`)
- Very long class strings that hurt readability (rare -- prefer `@apply` or component extraction)

When using CSS Modules, still reference MD3 tokens via `var(--md-sys-*)"):

```css
.myCard {
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level1);
}
```
