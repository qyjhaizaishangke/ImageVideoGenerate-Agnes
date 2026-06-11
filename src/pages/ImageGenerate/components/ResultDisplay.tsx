import { Image, Loader2, AlertCircle } from "lucide-solid";
import type { Accessor } from "solid-js";
import { createM } from "../../../i18n";

interface ResultDisplayProps {
  state: Accessor<"idle" | "loading" | "success" | "error">;
  imageBase64: Accessor<string | null>;
  error: Accessor<string | null>;
  onRetry: () => void;
}

export default function ResultDisplay(props: ResultDisplayProps) {
  const m = createM();

  const download = () => {
    const b64 = props.imageBase64();
    if (!b64) return;
    const link = document.createElement("a");
    link.href = b64;
    link.download = "generated-image.png";
    link.click();
  };

  return (
    <div class="flex-1 flex items-center justify-center p-4">
      {/* ---- Idle ---- */}
      {props.state() === "idle" && (
        <div class="flex flex-col items-center gap-3 text-on-surface-variant">
          <Image class="w-12 h-12 opacity-40" />
          <span class="text-body-lg">{m.result_idleHint()}</span>
        </div>
      )}

      {/* ---- Loading ---- */}
      {props.state() === "loading" && (
        <div class="flex flex-col items-center gap-3">
          <div class="w-64 h-48 bg-surface-container rounded-corner-lg animate-pulse" />
          <div class="flex items-center gap-2 text-on-surface-variant text-body-md">
            <Loader2 class="w-4 h-4 animate-spin" />
            <span>{m.result_generating()}</span>
          </div>
        </div>
      )}

      {/* ---- Success ---- */}
      {props.state() === "success" && props.imageBase64() && (
        <div class="relative group max-w-full max-h-full">
          <img
            src={props.imageBase64()!}
            alt={m.result_altText()}
            class="rounded-corner-lg shadow-elevation-3 max-h-[65vh] object-contain"
          />
          <button
            onClick={download}
            class="absolute bottom-3 right-3 px-3 py-1.5
                   bg-inverse-surface text-inverse-on-surface
                   text-label-md rounded-corner-sm
                   opacity-0 group-hover:opacity-100 transition-opacity
                   hover:bg-primary hover:text-on-primary"
            title={m.result_downloadTitle()}
          >
            {m.result_download()}
          </button>
        </div>
      )}

      {/* ---- Error ---- */}
      {props.state() === "error" && (
        <div class="flex flex-col items-center gap-3 max-w-md text-center">
          <div class="flex items-center gap-2 bg-error-container
                      rounded-corner-md px-4 py-3">
            <AlertCircle class="w-5 h-5 text-error shrink-0" />
            <span class="text-on-error-container text-body-md">
              {props.error() || m.result_unknownError()}
            </span>
          </div>
          <button
            onClick={props.onRetry}
            class="px-4 py-2 bg-primary text-on-primary text-label-lg
                   rounded-corner-full hover:opacity-90 transition-opacity"
          >
            {m.result_retry()}
          </button>
        </div>
      )}
    </div>
  );
}