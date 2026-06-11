import { Plus } from "lucide-solid";
import { createSignal, type Accessor } from "solid-js";
import { createM } from "../../../i18n";

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  disabled: Accessor<boolean>;
}

export default function ImageUpload(props: ImageUploadProps) {
  const [fileName, setFileName] = createSignal<string | null>(null);
  const [thumbnail, setThumbnail] = createSignal<string | null>(null);
  const m = createM();
  let inputRef: HTMLInputElement | undefined;

  const handleFile = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      props.onImageSelected(b64);
      setFileName(file.name);
      setThumbnail(b64);
    };
    reader.readAsDataURL(file);

    // Reset so re-selecting the same file works
    input.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        class="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef?.click()}
        disabled={props.disabled()}
        class="w-9 h-9 flex items-center justify-center rounded-corner-full
               transition-colors text-on-surface-variant
               hover:bg-surface-container-highest
               disabled:opacity-50 disabled:cursor-not-allowed"
        title={m.upload_title()}
      >
        {thumbnail() ? (
          <img
            src={thumbnail()!}
            alt={fileName() ?? ""}
            class="w-6 h-6 rounded-corner-xs object-cover"
          />
        ) : (
          <Plus class="w-5 h-5" />
        )}
      </button>
    </>
  );
}