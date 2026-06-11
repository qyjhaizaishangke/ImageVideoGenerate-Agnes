import type { Accessor } from "solid-js";
import ModelSelect from "./ModelSelect";
import ImageUpload from "./ImageUpload";
import SendButton from "./SendButton";
import { createM } from "../../../i18n";

interface PromptInputProps {
  value: Accessor<string>;
  onInput: (value: string) => void;
  onSend: () => void;
  disabled: Accessor<boolean>;
  loading: Accessor<boolean>;
  hasImage: Accessor<boolean>;
  onUploadClick: (base64: string) => void;
  model: Accessor<string>;
  onModelChange: (model: string) => void;
}

export default function PromptInput(props: PromptInputProps) {
  const canSend = () => props.value().trim().length > 0;
  const m = createM();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend() && !props.disabled() && !props.loading()) {
        props.onSend();
      }
    }
  };

  return (
    <div class="bg-surface-container-high rounded-corner-xl shadow-elevation-2">
      <textarea
        value={props.value()}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder={m.prompt_placeholder()}
        disabled={props.disabled() || props.loading()}
        rows={3}
        class="w-full min-h-30 resize-none bg-transparent
               text-on-surface text-body-lg
               placeholder:text-on-surface-variant
               px-4 pt-4 pb-2 focus:outline-none
               disabled:opacity-50"
      />
      <div class="flex items-center justify-between px-3 pb-3
                  border-t border-outline-variant pt-2">
        <div class="flex items-center gap-1.5">
          <ModelSelect
            value={props.model}
            onChange={props.onModelChange}
            disabled={() => props.disabled() || props.loading()}
          />
          <ImageUpload
            onImageSelected={props.onUploadClick}
            disabled={() => props.disabled() || props.loading()}
          />
        </div>
        <SendButton
          onClick={props.onSend}
          disabled={() => !canSend()}
          loading={props.loading}
        />
      </div>
    </div>
  );
}