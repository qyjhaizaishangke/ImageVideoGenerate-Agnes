import { m } from "../../../i18n";
 import Select from "../../../components/Select";
 import type { Accessor } from "solid-js";

 interface ModelSelectProps {
   value: Accessor<string>;
   onChange: (model: string) => void;
   disabled: Accessor<boolean>;
 }

 export default function ModelSelect(props: ModelSelectProps) {

   const options = () => [
     { value: "agnes-image-2.0-flash", label: m.model_image20Flash() },
     { value: "agnes-image-2.1-flash", label: m.model_image21Flash() },
   ];

   return (
     <Select
       value={props.value}
       onChange={props.onChange}
       options={options()}
       disabled={props.disabled}
     />
   );
 }
