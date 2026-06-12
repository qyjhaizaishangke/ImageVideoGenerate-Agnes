import { m } from "../../i18n";
 import ThemeSetting from "./components/ThemeSetting";
 import LanguageSetting from "./components/LanguageSetting";
 import ApiKeySetting from "./components/ApiKeySetting";

 export default function Settings() {

   return (
     <div class="h-full p-6 max-w-3xl mx-auto bg-surface">
       <h1 class="text-headline-lg text-on-surface mb-6">{m.nav_settings()}</h1>
       <div class="flex flex-col gap-4">
         <ThemeSetting />
         <LanguageSetting />
         <ApiKeySetting />
       </div>
     </div>
   );
 }
