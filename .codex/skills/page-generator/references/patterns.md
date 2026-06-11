# Page Patterns Reference

## Form page

For any page with user input (text, selects, file uploads):

\`\`\`tsx
import type { Component } from "solid-js";

const FormPage: Component = () => {
  return (
    <main class="min-h-screen bg-surface flex items-center justify-center p-6">
      <div class="bg-surface-container-low rounded-corner-md shadow-elevation-2 p-8 w-full max-w-lg">
        <h2 class="text-headline-md text-on-surface">Form Title</h2>
        <p class="text-body-md text-on-surface-variant mt-1">Supporting text.</p>

        <form class="mt-6 space-y-5">
          <div>
            <label class="text-label-lg text-on-surface block mb-1">Field Label</label>
            <div class="bg-surface-container-highest rounded-corner-xs border-b border-on-surface-variant px-4 py-3">
              <input class="bg-transparent text-on-surface text-body-lg outline-none w-full" placeholder="Placeholder" />
            </div>
            <span class="text-body-sm text-on-surface-variant mt-1">Helper text</span>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="border border-outline text-primary px-6 py-2.5 rounded-corner-full text-label-lg hover:bg-primary/8">
              Cancel
            </button>
            <button type="submit" class="bg-primary text-on-primary px-6 py-2.5 rounded-corner-full text-label-lg shadow-elevation-1 hover:shadow-elevation-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
\`\`\`

## Dashboard page

Multi-section layout with cards:

\`\`\`tsx
<main class="min-h-screen bg-surface flex">
  <aside class="w-64 bg-surface-container-low border-r border-outline-variant p-4 flex-shrink-0">
    <nav class="space-y-1">
      <a class="flex items-center gap-3 px-4 py-2.5 rounded-corner-full bg-secondary-container text-on-secondary-container text-label-lg" href="#">
        <span class="material-symbols-outlined text-xl">image</span> Overview
      </a>
      <a class="flex items-center gap-3 px-4 py-2.5 rounded-corner-full text-on-surface-variant text-label-lg hover:bg-surface-container-high" href="#">
        <span class="material-symbols-outlined text-xl">settings</span> Settings
      </a>
    </nav>
  </aside>

  <section class="flex-1 p-6">
    <h1 class="text-headline-lg text-on-surface">Dashboard</h1>
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-surface-container-lowest rounded-corner-md shadow-elevation-1 p-5">
        <h3 class="text-title-md text-on-surface">Card Title</h3>
        <p class="text-body-md text-on-surface-variant mt-1">Card content</p>
      </div>
    </div>
  </section>
</main>
\`\`\`

## List page

With search bar and item list:

\`\`\`tsx
<main class="min-h-screen bg-surface">
  <header class="bg-surface-container px-6 py-4 border-b border-outline-variant">
    <h1 class="text-headline-lg text-on-surface">Items</h1>
    <div class="mt-3 bg-surface-container-highest rounded-corner-full px-4 py-2 flex items-center gap-2 max-w-md">
      <span class="material-symbols-outlined text-on-surface-variant">search</span>
      <input class="bg-transparent text-on-surface text-body-lg outline-none w-full" placeholder="Search..." />
    </div>
  </header>
  <section class="p-6 max-w-4xl mx-auto space-y-2">
    <div class="bg-surface-container-low rounded-corner-md p-4 hover:bg-surface-container transition-colors">
      <p class="text-title-md text-on-surface">List Item</p>
      <p class="text-body-sm text-on-surface-variant">Description</p>
    </div>
  </section>
</main>
\`\`\`
