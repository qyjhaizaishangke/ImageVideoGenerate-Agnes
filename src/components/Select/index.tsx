import { ChevronDown, Check } from "lucide-solid";
import { createEffect, createSignal, onCleanup, Show, type Component as SolidComponent, type Accessor } from "solid-js";
import type { JSX } from "solid-js";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: Accessor<string>;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: Accessor<boolean>;
  leadingIcon?: (props: { class: string }) => JSX.Element;
  class?: string;
}

/**
 * Material Design 3 filled select with custom dropdown menu.
 * Replaces native <select> for full MD3 styling: hover/selected states,
 * elevation shadow, checkmark on active item, keyboard navigation.
 */
const Select: SolidComponent<Props> = (props) => {
  const [open, setOpen] = createSignal(false);
  let containerRef!: HTMLDivElement;

  const selectedLabel = () =>
    props.options.find((o) => o.value === props.value())?.label ?? "";

  const isDisabled = () => props.disabled?.() ?? false;

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) setOpen(false);
  };
  createEffect(() => {
    if (open()) document.addEventListener("click", handleClickOutside);
    else document.removeEventListener("click", handleClickOutside);
  });
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); return; }
    if (!open()) return;
    const idx = props.options.findIndex((o) => o.value === props.value());
    if (e.key === "ArrowDown") { e.preventDefault(); props.onChange(props.options[(idx + 1) % props.options.length].value); }
    if (e.key === "ArrowUp") { e.preventDefault(); props.onChange(props.options[(idx - 1 + props.options.length) % props.options.length].value); }
  };

  return (
    <div
      ref={containerRef}
      class={`relative bg-surface-container-highest rounded-corner-xs
              border-b border-on-surface-variant
              focus-within:border-primary focus-within:border-b-2
              transition-colors
              ${isDisabled() ? "opacity-40 pointer-events-none" : ""}
              ${props.class ?? ""}`}
    >
      <button
        type="button"
        onClick={() => !isDisabled() && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled()}
        class="flex items-center w-full text-left
               bg-transparent text-on-surface text-body-lg
               outline-none cursor-pointer
               px-3 py-3
               disabled:cursor-not-allowed"
      >
        {props.leadingIcon?.({ class: "mr-3 w-5 h-5 text-on-surface-variant shrink-0" })}
        <span class="flex-1 truncate">{selectedLabel()}</span>
        <ChevronDown
          class={`ml-3 w-5 h-5 text-on-surface-variant shrink-0 transition-transform duration-150
                  ${open() ? "rotate-180" : ""}`}
        />
      </button>

      <Show when={open()}>
        <ul
          class="absolute top-full left-0 right-0 mt-1 z-50
                 bg-surface-container rounded-corner-xs
                 shadow-elevation-2
                 max-h-60 overflow-y-auto
                 py-1"
          role="listbox"
        >
          {props.options.map(({ value, label }) => {
            const selected = value === props.value();
            return (
              <li
                role="option"
                aria-selected={selected}
                onClick={() => { props.onChange(value); setOpen(false); }}
                class={`flex items-center px-4 py-3 text-body-lg cursor-pointer
                        hover:bg-surface-container-highest transition-colors
                        ${selected ? "text-primary bg-primary-container" : "text-on-surface"}`}
              >
                <span class="flex-1">{label}</span>
                <Show when={selected}>
                  <Check class="w-5 h-5 shrink-0" />
                </Show>
              </li>
            );
          })}
        </ul>
      </Show>
    </div>
  );
};

export default Select;