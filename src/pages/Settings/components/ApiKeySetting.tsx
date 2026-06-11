 import { createM } from "../../../i18n";

 export default function ApiKeySetting() {
   const m = createM();

   return (
     <div class="bg-surface-container rounded-corner-xl p-5 opacity-70">
       <h2 class="text-title-md text-on-surface mb-4">
         {m.settings_apiKey()}
       </h2>
       <div class="relative">
         <input
           type="password"
           disabled
           placeholder={m.settings_apiKeyPlaceholder()}
           class="w-full h-9 px-3 pr-24 bg-surface-container-highest
                  text-on-surface-variant text-label-md
                  border border-outline-variant rounded-corner-sm
                  disabled:cursor-not-allowed disabled:opacity-50"
         />
         <span class="absolute right-2 top-1/2 -translate-y-1/2
                       bg-tertiary-container text-on-tertiary-container
                       rounded-corner-sm px-2 py-0.5 text-label-sm">
           {m.settings_comingSoon()}
         </span>
       </div>
     </div>
   );
 }
