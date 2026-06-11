# Component Patterns Reference

## Compound component: card with image

```tsx
import type { Component } from "solid-js";

interface Props { title: string; description: string; imageUrl: string; onClick?: () => void; }

const ImageCard: Component<Props> = (props) => (
  <div
    class="bg-surface-container-lowest rounded-corner-md shadow-elevation-1 overflow-hidden
           hover:shadow-elevation-2 transition-shadow cursor-pointer"
    onClick={props.onClick}
  >
    <img src={props.imageUrl} alt={props.title} class="w-full h-48 object-cover" />
    <div class="p-4">
      <h3 class="text-title-md text-on-surface">{props.title}</h3>
      <p class="text-body-md text-on-surface-variant mt-1 line-clamp-2">{props.description}</p>
    </div>
  </div>
);
```

## File upload button (MD3 filled tonal)

```tsx
<label class="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container
              px-6 py-2.5 rounded-corner-full text-label-lg shadow-elevation-1
              hover:shadow-elevation-2 transition-shadow cursor-pointer">
  <span class="material-symbols-outlined text-xl">upload</span>
  Upload
  <input type="file" class="hidden" />
</label>
```

## Progress indicator (linear)

```tsx
<div class="w-full h-1 bg-surface-container-highest rounded-corner-full overflow-hidden">
  <div class="h-full bg-primary rounded-corner-full transition-all duration-300"
       style={{ width: `${progress}%` }} />
</div>
```

## Snackbar / toast

```tsx
<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            bg-inverse-surface text-inverse-on-surface
            px-6 py-3 rounded-corner-sm shadow-elevation-3
            flex items-center gap-3 text-body-md">
  <span>Message text</span>
  <button class="text-inverse-primary text-label-lg hover:underline">Action</button>
</div>
```

## Segmented button

```tsx
<div class="inline-flex border border-outline rounded-corner-full overflow-hidden">
  <button class="px-4 py-2 text-label-lg bg-secondary-container text-on-secondary-container">Selected</button>
  <button class="px-4 py-2 text-label-lg text-on-surface-variant hover:bg-surface-container-highest">Option</button>
  <button class="px-4 py-2 text-label-lg text-on-surface-variant hover:bg-surface-container-highest">Option</button>
</div>
```
