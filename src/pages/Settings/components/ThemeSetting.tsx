import { m } from "../../../i18n";
 import { Sun, Moon, MonitorSmartphone } from "lucide-solid";
 import { createSignal, onMount } from "solid-js";
 import { setTheme, clearThemeOverride } from "../../../theme/utils";
 import type { m as _m } from "../../../i18n";

 type Theme = "light" | "dark";
 type ThemeMode = Theme | "auto";

 const OPTIONS: { mode: ThemeMode; icon: typeof Sun; labelKey: keyof typeof _m }[] = [
   { mode: "light", icon: Sun, labelKey: "settings_light" },
   { mode: "dark", icon: Moon, labelKey: "settings_dark" },
   { mode: "auto", icon: MonitorSmartphone, labelKey: "settings_auto" },
 ];

 export default function ThemeSetting() {
   const [mode, setMode] = createSignal<ThemeMode>("auto");

   onMount(() => {
     const stored = localStorage.getItem("app-theme") as Theme | null;
     if (stored === "light" || stored === "dark") {
       setMode(stored);
     } else {
       setMode("auto");
     }
   });

   const handleSelect = (next: ThemeMode) => {
     setMode(next);
     if (next === "auto") {
       clearThemeOverride();
     } else {
       setTheme(next);
     }
   };

   return (
     <div class="bg-surface-container rounded-corner-xl p-5">
       <h2 class="text-title-md text-on-surface mb-4">
         {m.settings_appearance()}
       </h2>
       <div class="bg-surface-container-highest rounded-corner-full p-1 inline-flex gap-0.5">
         {OPTIONS.map(({ mode: opt, icon: Icon, labelKey }) => (
           <button
             onClick={() => handleSelect(opt)}
             class="flex items-center gap-2 px-5 py-2 rounded-corner-full text-label-lg
                    cursor-pointer transition-colors select-none"
             classList={{
               "bg-primary text-on-primary shadow-elevation-1": mode() === opt,
               "text-on-surface-variant hover:bg-surface-container-high": mode() !== opt,
             }}
             title={m[labelKey]()}
           >
             <Icon class="w-5 h-5" />
             {m[labelKey]()}
           </button>
         ))}
       </div>
     </div>
   );
 }
