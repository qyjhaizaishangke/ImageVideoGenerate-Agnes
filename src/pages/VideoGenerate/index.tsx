import { createSignal, onCleanup, type Component } from "solid-js";
import VideoPromptInput from "./components/VideoPromptInput";
import VideoResultDisplay from "./components/VideoResultDisplay";
import type { PageState } from "./components/VideoResultDisplay";

const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : "";
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

const VideoGenerate: Component = () => {
  const [prompt, setPrompt] = createSignal("");
  const [pageState, setPageState] = createSignal<PageState>({ kind: "idle" });
  let pollingTimer: ReturnType<typeof setInterval> | null = null;
  let pollStartTime = 0;

  const isActive = () =>
    pageState().kind === "submitting" || pageState().kind === "processing";

  const loading = () => pageState().kind === "submitting";

  const clearPolling = () => {
    if (pollingTimer !== null) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  };

  onCleanup(clearPolling);

  const handleSend = async () => {
    const p = prompt().trim();
    if (!p) return;

    clearPolling();
    setPageState({ kind: "submitting" });

    try {
      const res = await fetch(`${API_BASE}/api/video/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const videoId: string = data.video_id;
      if (!videoId) {
        throw new Error("No video_id returned");
      }

      setPageState({ kind: "processing", videoId, progress: data.progress ?? 0 });
      pollStartTime = Date.now();
      startPolling(videoId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setPageState({ kind: "error", message });
    }
  };

  const startPolling = (videoId: string) => {
    pollingTimer = setInterval(async () => {
      try {
        if (Date.now() - pollStartTime > POLL_TIMEOUT_MS) {
          clearPolling();
          setPageState({
            kind: "error",
            message: "Video generation timed out. Please try again.",
          });
          return;
        }

        const res = await fetch(
          `${API_BASE}/api/video/status?video_id=${encodeURIComponent(videoId)}`,
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Status check failed (${res.status})`);
        }

        const data = await res.json();

        if (data.status === "completed") {
          clearPolling();
          const videoUrl: string | null =
            data.video_url ?? data.remixed_from_video_id ?? null;
          if (!videoUrl) {
            setPageState({
              kind: "error",
              message: "Video completed but no URL returned.",
            });
            return;
          }
          setPageState({ kind: "completed", videoUrl, videoId });
        } else if (data.status === "failed") {
          clearPolling();
          setPageState({
            kind: "failed",
            message: data.error || "Video generation failed.",
          });
        } else {
          setPageState({
            kind: "processing",
            videoId,
            progress: Math.min(data.progress ?? 0, 99),
          });
        }
      } catch (err) {
        clearPolling();
        const message = err instanceof Error ? err.message : "Unknown error";
        setPageState({ kind: "error", message });
      }
    }, POLL_INTERVAL_MS);
  };

  const handleRetry = () => {
    clearPolling();
    setPageState({ kind: "idle" });
  };

  return (
    <div class="flex flex-col h-full max-w-3xl mx-auto p-6 gap-4 bg-surface">
      <VideoPromptInput
        value={prompt}
        onInput={setPrompt}
        onSend={handleSend}
        disabled={() => isActive()}
        loading={loading}
      />
      <VideoResultDisplay state={pageState} onRetry={handleRetry} />
    </div>
  );
};

export default VideoGenerate;
