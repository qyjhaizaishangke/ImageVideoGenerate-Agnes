# MD3 Design Token Reference

Complete mapping of Material Design 3 tokens to Tailwind CSS v4 utilities in this project.

## Colors

### Primary

| Tailwind | CSS Variable | Light | Dark |
|----------|-------------|-------|------|
| `text-primary` | `--md-sys-color-primary` | `#6750a4` | `#d0bcff` |
| `text-on-primary` | `--md-sys-color-on-primary` | `#ffffff` | `#381e72` |
| `bg-primary-container` | `--md-sys-color-primary-container` | `#eaddff` | `#4f378b` |
| `text-on-primary-container` | `--md-sys-color-on-primary-container` | `#21005d` | `#eaddff` |

### Secondary

| Tailwind | CSS Variable | Light | Dark |
|----------|-------------|-------|------|
| `text-secondary` | `--md-sys-color-secondary` | `#625b71` | `#ccc2dc` |
| `text-on-secondary` | `--md-sys-color-on-secondary` | `#ffffff` | `#332d41` |
| `bg-secondary-container` | `--md-sys-color-secondary-container` | `#e8def8` | `#4a4458` |
| `text-on-secondary-container` | `--md-sys-color-on-secondary-container` | `#1d192b` | `#e8def8` |

### Tertiary

| Tailwind | CSS Variable | Light | Dark |
|----------|-------------|-------|------|
| `text-tertiary` | `--md-sys-color-tertiary` | `#7d5260` | `#efb8c8` |
| `text-on-tertiary` | `--md-sys-color-on-tertiary` | `#ffffff` | `#492532` |
| `bg-tertiary-container` | `--md-sys-color-tertiary-container` | `#ffd8e4` | `#633b48` |
| `text-on-tertiary-container` | `--md-sys-color-on-tertiary-container` | `#31111d` | `#ffd8e4` |

### Error

| Tailwind | CSS Variable | Light | Dark |
|----------|-------------|-------|------|
| `text-error` | `--md-sys-color-error` | `#b3261e` | `#f2b8b5` |
| `text-on-error` | `--md-sys-color-on-error` | `#ffffff` | `#601410` |
| `bg-error-container` | `--md-sys-color-error-container` | `#f9dedc` | `#8c1d18` |
| `text-on-error-container` | `--md-sys-color-on-error-container` | `#410e0b` | `#f9dedc` |

### Surface

| Tailwind | CSS Variable | Light | Dark |
|----------|-------------|-------|------|
| `bg-surface-dim` | `--md-sys-color-surface-dim` | `#ddd8e0` | `#141218` |
| `bg-surface` | `--md-sys-color-surface` | `#fdf8ff` | `#141218` |
| `bg-surface-bright` | `--md-sys-color-surface-bright` | `#fdf8ff` | `#3b383e` |
| `bg-surface-container-lowest` | `--md-sys-color-surface-container-lowest` | `#ffffff` | `#0f0d14` |
| `bg-surface-container-low` | `--md-sys-color-surface-container-low` | `#f7f2fa` | `#1d1b20` |
| `bg-surface-container` | `--md-sys-color-surface-container` | `#f1ecf5` | `#211f26` |
| `bg-surface-container-high` | `--md-sys-color-surface-container-high` | `#ece6f0` | `#2b2930` |
| `bg-surface-container-highest` | `--md-sys-color-surface-container-highest` | `#e6e0e9` | `#36343b` |
| `text-on-surface` | `--md-sys-color-on-surface` | `#1d1b20` | `#e6e0e9` |
| `text-on-surface-variant` | `--md-sys-color-on-surface-variant` | `#49454f` | `#cac4d0` |

### Outline / Inverse

| Tailwind | CSS Variable | Light | Dark |
|----------|-------------|-------|------|
| `border-outline` | `--md-sys-color-outline` | `#79747e` | `#938f99` |
| `border-outline-variant` | `--md-sys-color-outline-variant` | `#cac4d0` | `#49454f` |
| `bg-inverse-surface` | `--md-sys-color-inverse-surface` | `#322f37` | `#e6e0e9` |
| `text-inverse-on-surface` | `--md-sys-color-inverse-on-surface` | `#f4eff8` | `#322f37` |
| `text-inverse-primary` | `--md-sys-color-inverse-primary` | `#d0bcff` | `#6750a4` |

## Elevation (shadows)

| Tailwind | Level | Use |
|----------|-------|-----|
| `shadow-elevation-0` | 0 | Flat surfaces |
| `shadow-elevation-1` | 1 | Cards, buttons (rest) |
| `shadow-elevation-2` | 2 | FAB, raised buttons |
| `shadow-elevation-3` | 3 | Dialogs, menus |
| `shadow-elevation-4` | 4 | Nav drawers, modals |
| `shadow-elevation-5` | 5 | Full-screen dialogs |

## Shape (border-radius)

| Tailwind | CSS Variable | px |
|----------|-------------|-----|
| `rounded-corner-none` | `--md-sys-shape-corner-none` | 0 |
| `rounded-corner-xs` | `--md-sys-shape-corner-extra-small` | 4 |
| `rounded-corner-sm` | `--md-sys-shape-corner-small` | 8 |
| `rounded-corner-md` | `--md-sys-shape-corner-medium` | 12 |
| `rounded-corner-lg` | `--md-sys-shape-corner-large` | 16 |
| `rounded-corner-xl` | `--md-sys-shape-corner-extra-large` | 28 |
| `rounded-corner-full` | `--md-sys-shape-corner-full` | 9999 |

## Typography

### Typescale (font-size/line-height)

| Tailwind | MD3 role | Size |
|----------|---------|------|
| `text-display-lg` | Display Large | 57/64 |
| `text-display-md` | Display Medium | 45/52 |
| `text-display-sm` | Display Small | 36/44 |
| `text-headline-lg` | Headline Large | 32/40 |
| `text-headline-md` | Headline Medium | 28/36 |
| `text-headline-sm` | Headline Small | 24/32 |
| `text-title-lg` | Title Large | 22/28 |
| `text-title-md` | Title Medium | 16/24 |
| `text-title-sm` | Title Small | 14/20 |
| `text-label-lg` | Label Large | 14/20 |
| `text-label-md` | Label Medium | 12/16 |
| `text-label-sm` | Label Small | 11/16 |
| `text-body-lg` | Body Large | 16/24 |
| `text-body-md` | Body Medium | 14/20 |
| `text-body-sm` | Body Small | 12/16 |

## Motion (not mapped to Tailwind)

Use as CSS custom properties directly:

```css
transition-duration: var(--md-sys-motion-duration-medium2);
transition-timing-function: var(--md-sys-motion-easing-standard);
```

| Variable | Value |
|----------|-------|
| `--md-sys-motion-duration-short1` | 50ms |
| `--md-sys-motion-duration-short2` | 100ms |
| `--md-sys-motion-duration-medium1` | 250ms |
| `--md-sys-motion-duration-medium2` | 300ms |
| `--md-sys-motion-duration-long2` | 500ms |
| `--md-sys-motion-easing-standard` | cubic-bezier(0.2, 0, 0, 1) |
| `--md-sys-motion-easing-emphasized` | cubic-bezier(0.05, 0.7, 0.1, 1) |
