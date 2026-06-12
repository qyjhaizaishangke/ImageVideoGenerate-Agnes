import { m } from "../../i18n";
 import { A, useLocation } from "@solidjs/router";
 import { createSignal, Show } from "solid-js";
 import {
   Image,
   Video,
   Settings,
   PanelLeftClose,
   PanelLeft,
 } from "lucide-solid";

 export default function Menu() {
   const [expanded, setExpanded] = createSignal(true);
   const location = useLocation();

   const isActive = (path: string) => {
     if (path === "/") return location.pathname === "/";
     return location.pathname.startsWith(path);
   };

   const navClass = (path: string) => {
     const active = isActive(path);
     const base =
       "flex items-center gap-3 rounded-corner-full transition-colors text-label-lg";
     if (expanded()) {
       return `${base} px-4 py-2.5 ${
         active
           ? "bg-secondary-container text-on-secondary-container"
           : "text-on-surface-variant hover:bg-surface-container-highest"
       }`;
     }
     return `${base} w-10 h-10 justify-center ${
       active
         ? "bg-secondary-container text-on-secondary-container"
         : "text-on-surface-variant hover:bg-surface-container-highest"
     }`;
   };

   return (
     <nav
       class="flex flex-col bg-surface-container-low border-r border-outline-variant
              transition-[width] duration-300 h-screen shrink-0"
       classList={{
         "w-56": expanded(),
         "w-16": !expanded(),
       }}
     >
       {/* Top nav items */}
       <div class="flex flex-col gap-1 p-3">
         <A href="/" class={navClass("/")}>
           <Image class="w-5 h-5 shrink-0" />
           <Show when={expanded()}>
             <span>{m.nav_imageGenerate()}</span>
           </Show>
         </A>
         <A href="/video-generate" class={navClass("/video-generate")}>
           <Video class="w-5 h-5 shrink-0" />
           <Show when={expanded()}>
             <span>{m.nav_videoGenerate()}</span>
           </Show>
         </A>
         <A href="/settings" class={navClass("/settings")}>
           <Settings class="w-5 h-5 shrink-0" />
           <Show when={expanded()}>
             <span>{m.nav_settings()}</span>
           </Show>
         </A>
       </div>

       {/* Bottom controls */}
       <div class="mt-auto p-3 flex items-center justify-end">
         <button
           onClick={() => setExpanded((v) => !v)}
           class="w-10 h-10 flex items-center justify-center rounded-corner-full
                  text-on-surface-variant hover:bg-surface-container-highest transition-colors"
           title={expanded() ? m.menu_collapse() : m.menu_expand()}
         >
           {expanded() ? (
             <PanelLeftClose class="w-5 h-5" />
           ) : (
             <PanelLeft class="w-5 h-5" />
           )}
         </button>
       </div>
     </nav>
   );
 }
