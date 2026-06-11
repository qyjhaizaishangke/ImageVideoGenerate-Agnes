import { createSignal, type Component } from "solid-js";
import PromptInput from "./components/PromptInput";
import ResultDisplay from "./components/ResultDisplay";

// Dev: backend runs on port 3001
// Prod: same-origin, served by Elysia on /
const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : "";

type PageState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; imageBase64: string }
  | { kind: "error"; message: string };

const ImageGenerate: Component = () => {
  const [prompt, setPrompt] = createSignal("");
  const [model, setModel] = createSignal("agnes-image-2.0-flash");
  const [imageBase64, setImageBase64] = createSignal<string | null>(null);
  const [pageState, setPageState] = createSignal<PageState>({ kind: "idle" });

  const state = () => pageState().kind;
  const error = () => {
    const s = pageState();
    return s.kind === "error" ? s.message : null;
  };
  const loading = () => pageState().kind === "loading";
  const disabled = () => pageState().kind === "loading";

  const handleSend = async () => {
    const p = prompt().trim();
    if (!p) return;

    setPageState({ kind: "loading" });

    try {
      const res = await fetch(`${API_BASE}/api/image/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model(),
          prompt: p,
          size: "1024x768",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      if (!data.imageBase64) {
        throw new Error("No image data returned");
      }

      // Agnes returns raw base64 (no data: prefix when using return_base64)
      const fullDataUrl = data.imageBase64.startsWith("data:")
        ? data.imageBase64
        : `data:image/png;base64,${data.imageBase64}`;

      setImageBase64(fullDataUrl);
      setPageState({ kind: "success", imageBase64: fullDataUrl });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setPageState({ kind: "error", message });
    }
  };

  const handleRetry = () => {
    setPageState({ kind: "idle" });
  };

  const handleUpload = (_base64: string) => {
    // Phase 2: send base64 to backend for image-to-image
  };

  return (
    <div class="flex flex-col h-full max-w-3xl mx-auto p-6 gap-4 bg-surface">
      <PromptInput
        value={prompt}
        onInput={setPrompt}
        onSend={handleSend}
        disabled={disabled}
        loading={loading}
        hasImage={() => imageBase64() !== null}
        onUploadClick={handleUpload}
        model={model}
        onModelChange={setModel}
      />
      <ResultDisplay
        state={state}
        imageBase64={imageBase64}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default ImageGenerate;

