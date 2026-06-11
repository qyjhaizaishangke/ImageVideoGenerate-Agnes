 import { Globe } from "lucide-solid";
 import Select from "../../../components/Select";
 import { useLanguage, createM } from "../../../i18n";
 import type { AvailableLanguageTag } from "../../../i18n";
 import type { m as _m } from "../../../i18n";

 const LANGUAGES: { value: AvailableLanguageTag; labelKey: keyof typeof _m }[] = [
   { value: "en", labelKey: "lang_en" },
   { value: "zh", labelKey: "lang_zh" },
 ];

 export default function LanguageSetting() {
   const { language, setLanguage: switchLanguage } = useLanguage();
   const m = createM();

   const options = () =>
     LANGUAGES.map(({ value, labelKey }) => ({
       value,
       label: m[labelKey](),
     }));

   return (
     <div class="bg-surface-container rounded-corner-xl p-5">
       <h2 class="text-title-md text-on-surface mb-4">
         {m.settings_language()}
       </h2>
       <Select
         value={language}
         onChange={(value) => switchLanguage(value as AvailableLanguageTag)}
         options={options()}
         leadingIcon={Globe}
       />
     </div>
   );
 }
