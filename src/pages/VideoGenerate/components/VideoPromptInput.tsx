import { m } from "../../../i18n";
import Select from "../../../components/Select";
import { Film } from "lucide-solid";
import type { Accessor } from "solid-js";

interface VideoPromptInputProps {
  value: Accessor<string>;
  onInput: (value: string) => void;
  onSend: () => void;
  disabled: Accessor<boolean>;
}

export default function VideoPromptInput(props: VideoPromptInputProps) {
  const canSend = () => props.value().trim().length > 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend() && !props.disabled()) {
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
        placeholder={m.video_prompt_placeholder()}
        disabled={props.disabled()}
        rows={3}
        class="w-full min-h-30 resize-none bg-transparent
               text-on-surface text-body-lg
               placeholder:text-on-surface-variant
               px-4 pt-4 pb-2 focus:outline-none
               disabled:opacity-50"
      />
      <div class="flex items-center justify-between px-3 pb-3
                  border-t border-outline-variant pt-2">
        <Select
          value={() => "agnes-video-v2.0"}
          onChange={() => {}}
          options={[{ value: "agnes-video-v2.0", label: m.model_videoV20() }]}
          disabled={() => props.disabled()}
          leadingIcon={(p) => <Film class={p.class} />}
        />
        <button
          onClick={props.onSend}
          disabled={!canSend() || props.disabled()}
          class="flex items-center gap-1.5 px-4 py-2.5
                 bg-primary text-on-primary text-label-lg
                 rounded-corner-full
                 hover:opacity-90 transition-opacity
                 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{m.common_send()}</span>
        </button>
      </div>
    </div>
  );
}
