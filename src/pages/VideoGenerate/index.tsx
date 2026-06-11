import type { Component } from "solid-js";
import { createM } from "../../i18n";

const VideoGenerate: Component = () => {
  const m = createM();

  return (
    <div class="h-full p-6 max-w-7xl mx-auto bg-surface">
      <h1 class="text-headline-lg text-on-surface">
        {m.nav_videoGenerate()}
      </h1>
      <p class="text-body-lg text-on-surface-variant mt-2">
        {m.video_description()}
      </p>
    </div>
  );
};

export default VideoGenerate;