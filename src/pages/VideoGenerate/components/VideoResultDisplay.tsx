import { m } from "../../../i18n";
import { Film, LoaderCircle, Download, CircleAlert } from "lucide-solid";
import type { Accessor } from "solid-js";

export type PageState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "processing"; videoId: string; progress: number }
  | { kind: "completed"; videoUrl: string; videoId: string }
  | { kind: "failed"; message: string }
  | { kind: "error"; message: string };

interface VideoResultDisplayProps {
  state: Accessor<PageState>;
  onRetry: () => void;
}

export default function VideoResultDisplay(props: VideoResultDisplayProps) {

  const download = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-video.mp4";
    link.rel = "noopener";
    link.click();
  };

  const s = () => props.state();

  return (
    <div class="flex-1 flex items-center justify-center p-4">
      {/* ---- Idle ---- */}
      {s().kind === "idle" && (
        <div class="flex flex-col items-center gap-3 text-on-surface-variant">
          <Film class="w-12 h-12 opacity-40" />
          <span class="text-body-lg">{m.video_result_idleHint()}</span>
        </div>
      )}

      {/* ---- Submitting ---- */}
      {s().kind === "submitting" && (
        <div class="flex flex-col items-center gap-3">
          <div class="w-80 h-48 bg-surface-container rounded-corner-lg animate-pulse" />
          <div class="flex items-center gap-2 text-on-surface-variant text-body-md">
            <LoaderCircle class="w-4 h-4 animate-spin" />
            <span>{m.video_result_submitting()}</span>
          </div>
        </div>
      )}

      {/* ---- Processing ---- */}
      {s().kind === "processing" && (
        (() => {
          const st = s() as Extract<PageState, { kind: "processing" }>;
          const pct = Math.round(st.progress);
          return (
            <div class="flex flex-col items-center gap-4 w-full max-w-md">
              <div class="w-80 h-48 bg-surface-container rounded-corner-lg animate-pulse" />
              <div class="w-full">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="flex items-center gap-2 text-on-surface-variant text-body-md">
                    <LoaderCircle class="w-4 h-4 animate-spin" />
                    <span>
                      {m.video_result_processing().replace("{progress}", String(pct))}
                    </span>
                  </span>
                  <span class="text-label-md text-on-surface-variant">{pct}%</span>
                </div>
                <div class="w-full h-1 bg-surface-container-highest rounded-corner-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-corner-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* ---- Completed ---- */}
      {s().kind === "completed" && (
        (() => {
          const st = s() as Extract<PageState, { kind: "completed" }>;
          return (
            <div class="relative group max-w-full max-h-full">
              <video
                src={st.videoUrl}
                controls
                autoplay
                loop
                class="rounded-corner-lg shadow-elevation-3 max-h-[65vh] max-w-full"
              >
                {m.video_result_altText()}
              </video>
              <button
                onClick={() => download(st.videoUrl)}
                class="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5
                       bg-inverse-surface text-inverse-on-surface
                       text-label-md rounded-corner-sm
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-primary hover:text-on-primary"
                title={m.video_result_download()}
              >
                <Download class="w-4 h-4" />
                <span>{m.video_result_download()}</span>
              </button>
            </div>
          );
        })()
      )}

      {/* ---- Failed / Error ---- */}
      {(s().kind === "failed" || s().kind === "error") && (
        (() => {
          const st = s() as Extract<PageState, { kind: "failed" | "error" }>;
          return (
            <div class="flex flex-col items-center gap-3 max-w-md text-center">
              <div
                class="flex items-center gap-2 bg-error-container
                          rounded-corner-md px-4 py-3"
              >
                <CircleAlert class="w-5 h-5 text-error shrink-0" />
                <span class="text-on-error-container text-body-md">
                  {st.message || m.result_unknownError()}
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
          );
        })()
      )}
    </div>
  );
}
