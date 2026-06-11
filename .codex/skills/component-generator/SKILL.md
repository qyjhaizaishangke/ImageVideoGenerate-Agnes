---
name: component-generator
description: Generate reusable Solid.js UI components using Material Design 3 design tokens, Tailwind CSS v4 utilities, and the project theme system. Use when creating a new UI component (button, card, input, dialog, chip, badge, navigation, etc.) that follows MD3 patterns, or when asked to build any reusable piece of UI that needs MD3 styling. Prefer Tailwind utility classes over CSS Modules; use CSS Modules only for complex animations or container queries. NOT for full-page layouts -- use page-generator for route-level components.
---

# Component Generator

## Styling priority

1. **Tailwind CSS utilities** (preferred) -- use MD3-mapped token classes from `src/theme/theme.css`
2. **CSS Modules** (`*.module.css`) -- only when Tailwind cannot express it (keyframes, container queries)

## Component file structure

```
src/components/<ComponentName>/index.tsx          # component
src/components/<ComponentName>/index.module.css   # (only if needed)
```

## Base component template

```tsx
import type { Component } from "solid-js";

interface Props {
  /* define props */
}

const ComponentName: Component<Props> = (props) => {
  return (
    <div>
      {/* component content */}
    </div>
  );
};

export default ComponentName;
```

## MD3 component patterns

### Primary button (filled)

```tsx
<button class="bg-primary text-on-primary px-6 py-2.5 rounded-corner-full
               text-label-lg shadow-elevation-1
               hover:shadow-elevation-2 active:shadow-elevation-0
               transition-shadow disabled:opacity-40 disabled:pointer-events-none">
  Label
</button>
```

### Outlined button

```tsx
<button class="border border-outline text-primary px-6 py-2.5
               rounded-corner-full text-label-lg
               hover:bg-primary/8 active:bg-primary/12
               transition-colors disabled:opacity-40 disabled:pointer-events-none">
  Label
</button>
```

### Text button

```tsx
<button class="text-primary px-3 py-2 rounded-corner-full text-label-lg
               hover:bg-primary/8 active:bg-primary/12
               transition-colors">
  Label
</button>
```

### Icon button (standard)

```tsx
<button class="w-10 h-10 flex items-center justify-center rounded-corner-full
               text-on-surface-variant hover:bg-surface-container-highest
               transition-colors">
  <span class="material-symbols-outlined">icon_name</span>
</button>
```

### Card

```tsx
<div class="bg-surface-container-lowest rounded-corner-md shadow-elevation-1
            p-4 hover:shadow-elevation-2 transition-shadow">
  <h3 class="text-title-md text-on-surface">Title</h3>
  <p class="text-body-md text-on-surface-variant mt-1">Description</p>
</div>
```

### Filled card (elevated variant)

```tsx
<div class="bg-surface-container-low rounded-corner-md shadow-elevation-1 p-6">
  <h2 class="text-title-lg text-on-surface">Card Title</h2>
  <p class="text-body-lg text-on-surface-variant mt-2">Supporting text for this card.</p>
  <div class="mt-4 flex gap-2">
    <button class="text-primary text-label-lg px-3 py-2 rounded-corner-full hover:bg-primary/8">Action</button>
    <button class="text-primary text-label-lg px-3 py-2 rounded-corner-full hover:bg-primary/8">Action</button>
  </div>
</div>
```

### Text field (filled variant)

```tsx
<div class="bg-surface-container-highest rounded-corner-xs
            border-b border-on-surface-variant
            focus-within:border-primary focus-within:border-b-2
            px-4 py-3 transition-colors">
  <label class="text-body-sm text-on-surface-variant block">Label</label>
  <input class="bg-transparent text-on-surface text-body-lg outline-none w-full mt-0.5"
         placeholder="Placeholder" />
</div>
<span class="text-body-sm text-on-surface-variant mt-1 px-4">Helper text</span>
```

### Outlined text field

```tsx
<div class="rounded-corner-xs border border-outline
            focus-within:border-primary focus-within:border-2
            px-4 py-3 transition-colors">
  <label class="text-body-sm text-on-surface-variant block">Label</label>
  <input class="bg-transparent text-on-surface text-body-lg outline-none w-full mt-0.5" />
</div>
```

### Select / dropdown

```tsx
<div class="bg-surface-container-highest rounded-corner-xs
            border-b border-on-surface-variant
            focus-within:border-primary focus-within:border-b-2
            px-4 py-3 relative">
  <label class="text-body-sm text-on-surface-variant block">Label</label>
  <select class="bg-transparent text-on-surface text-body-lg outline-none w-full mt-0.5 appearance-none cursor-pointer">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
  <span class="material-symbols-outlined absolute right-3 top-1/2 text-on-surface-variant pointer-events-none">
    arrow_drop_down
  </span>
</div>
```

### Chip / badge

```tsx
<span class="inline-flex items-center gap-1 px-3 py-1 rounded-corner-full
             bg-secondary-container text-on-secondary-container text-label-md">
  Label
</span>
```

### Divider

```tsx
<hr class="border-outline-variant" />
```

### Dialog shell

```tsx
<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-surface-container-high rounded-corner-xl shadow-elevation-3 p-6 w-full max-w-sm">
    <h2 class="text-headline-sm text-on-surface">Dialog Title</h2>
    <p class="text-body-md text-on-surface-variant mt-2">Dialog content.</p>
    <div class="mt-6 flex justify-end gap-2">
      <button class="text-primary text-label-lg px-3 py-2 rounded-corner-full hover:bg-primary/8">Cancel</button>
      <button class="text-primary text-label-lg px-3 py-2 rounded-corner-full hover:bg-primary/8">Confirm</button>
    </div>
  </div>
</div>
```

### Switch / toggle

```tsx
<label class="flex items-center gap-3 cursor-pointer">
  <span class="relative w-12 h-8">
    <input type="checkbox" class="sr-only peer" />
    <span class="block w-full h-full rounded-corner-full bg-surface-container-highest
                 border-2 border-outline peer-checked:bg-primary peer-checked:border-primary
                 transition-colors" />
    <span class="absolute left-1 top-1 w-6 h-6 rounded-corner-full bg-outline
                 peer-checked:bg-on-primary peer-checked:translate-x-4
                 transition-all shadow-elevation-1" />
  </span>
  <span class="text-body-lg text-on-surface">Label</span>
</label>
```

### Slider

```tsx
<div class="w-full">
  <label class="text-label-lg text-on-surface block mb-2">Label</label>
  <input type="range" min="0" max="100" value="50"
         class="w-full h-2 rounded-corner-full bg-surface-container-highest
                appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-corner-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:shadow-elevation-1" />
</div>
```

### Tabs

```tsx
<div class="flex border-b border-outline-variant">
  <button class="px-4 py-3 text-label-lg text-primary border-b-2 border-primary">Active</button>
  <button class="px-4 py-3 text-label-lg text-on-surface-variant hover:text-on-surface
                 hover:bg-surface-container-highest transition-colors">Inactive</button>
</div>
```

### Navigation bar (bottom)

```tsx
<nav class="flex bg-surface-container border-t border-outline-variant h-20">
  <a class="flex-1 flex flex-col items-center justify-center gap-1
            text-primary" href="#">
    <span class="material-symbols-outlined material-symbols-filled text-2xl">home</span>
    <span class="text-label-sm">Home</span>
  </a>
  <a class="flex-1 flex flex-col items-center justify-center gap-1
            text-on-surface-variant" href="#">
    <span class="material-symbols-outlined text-2xl">search</span>
    <span class="text-label-sm">Search</span>
  </a>
</nav>
```

## Elevation guidelines

| Component | Elevation | Tailwind |
|-----------|-----------|----------|
| Flat text, icons | Level 0 | `shadow-elevation-0` |
| Cards, buttons (rest) | Level 1 | `shadow-elevation-1` |
| FAB, raised buttons | Level 2 | `shadow-elevation-2` |
| Dialogs, menus | Level 3 | `shadow-elevation-3` |
| Nav drawers, modals | Level 4 | `shadow-elevation-4` |

## Corner radius guidelines

| Component | Radius | Tailwind |
|-----------|--------|----------|
| Input fields, chips | Extra small (4px) | `rounded-corner-xs` |
| Cards, sheets | Medium (12px) | `rounded-corner-md` |
| Dialogs | Extra large (28px) | `rounded-corner-xl` |
| Buttons, pills, badges | Full (9999px) | `rounded-corner-full` |

## State layers (hover / active / focus)

Use Tailwind opacity modifiers on the primary color:

- Hover: `hover:bg-primary/8` (8% opacity state layer)
- Active/pressed: `active:bg-primary/12` (12% opacity state layer)
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`
- Disabled: `disabled:opacity-40 disabled:pointer-events-none`

## Color rules

- Never hardcode hex colors. Always use MD3 Tailwind tokens.
- Interactive elements: `bg-primary` / `text-primary` or surface container variants
- Non-interactive text: `text-on-surface` (primary text), `text-on-surface-variant` (secondary text)
- Borders: `border-outline` (emphasis), `border-outline-variant` (subtle)
- See `.codex/skills/material-design/references/tokens.md` for the full token reference.

## When to use CSS Modules

Only for cases Tailwind cannot handle:

- Complex `@keyframes` animations
- `@container` queries
- Pseudo-elements with complex content (`::before`, `::after`)
- Very long class strings (rare)

When using CSS Modules, always reference MD3 tokens:

```css
.badge {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  border-radius: var(--md-sys-shape-corner-full);
  padding: 4px 12px;
  font-size: var(--md-sys-typescale-label-medium);
}
```

## Solid.js specifics

- Use `Component<Props>` type or `ParentComponent<Props>` for children
- Use `createSignal` for local state, `createMemo` for derived values
- Use `createEffect` sparingly; prefer declarative patterns
- Pass `class` as a prop for composable class merging (not `className`) -- Solid uses `class` for the HTML class attribute in JSX
- Use `<For>` for lists, `<Show>` for conditionals, `<Switch>/<Match>` for multiple branches


## i18n convention

All user-facing text must use the project i18n system:

```tsx
import { createM } from "../../i18n";
// Inside the component:
const m = createM();
<span>{m.some_key()}</span>  // reactive, no t() wrapper needed
```