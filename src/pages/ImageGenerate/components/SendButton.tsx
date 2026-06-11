import { LoaderCircle, SendHorizontal } from "lucide-solid";
import type { Accessor } from "solid-js";
import { createM } from "../../../i18n";

interface SendButtonProps {
  onClick: () => void;
  disabled: Accessor<boolean>;
  loading: Accessor<boolean>;
}

export default function SendButton(props: SendButtonProps) {
  const m = createM();
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled() || props.loading()}
      class="w-9 h-9 flex items-center justify-center rounded-corner-full
             transition-colors bg-primary text-on-primary hover:opacity-90
             disabled:bg-surface-container-highest disabled:text-on-surface-variant
             disabled:opacity-50 disabled:cursor-not-allowed"
      title={m.common_send()}
    >
      {props.loading() ? (
        <LoaderCircle class="w-5 h-5 animate-spin" />
      ) : (
        <SendHorizontal class="w-5 h-5" />
      )}
    </button>
  );
}