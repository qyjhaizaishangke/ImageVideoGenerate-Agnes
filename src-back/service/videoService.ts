const AGNES_API_KEY = process.env.AGNES_API_KEY;
const AGNES_BASE_URL = "https://apihub.agnes-ai.com";

export interface CreateVideoParams {
  prompt: string;
  model?: string;
  num_frames?: number;
  frame_rate?: number;
  width?: number;
  height?: number;
}

export interface CreateVideoResult {
  video_id: string;
  status: string;
  progress: number;
}

export interface VideoStatusResult {
  video_id: string;
  status: string;
  progress: number;
  video_url?: string | null;
  error?: string | null;
}

export async function createVideo(
  params: CreateVideoParams,
): Promise<CreateVideoResult> {
  if (!AGNES_API_KEY) {
    throw new Error("AGNES_API_KEY environment variable is not set");
  }

  const body = {
    model: params.model ?? "agnes-video-v2.0",
    prompt: params.prompt,
    num_frames: params.num_frames ?? 121,
    frame_rate: params.frame_rate ?? 24,
    width: params.width ?? 1152,
    height: params.height ?? 768,
  };

  const res = await fetch(`${AGNES_BASE_URL}/v1/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AGNES_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Agnes API error (${res.status}): ${errText}`);
  }

  const json: any = await res.json();

  const video_id: string | undefined =
    json.video_id ?? json.id ?? json.task_id;
  if (!video_id) {
    throw new Error("Agnes API returned no video_id");
  }

  return {
    video_id,
    status: json.status ?? "queued",
    progress: json.progress ?? 0,
  };
}

export async function getVideoStatus(
  videoId: string,
): Promise<VideoStatusResult> {
  if (!AGNES_API_KEY) {
    throw new Error("AGNES_API_KEY environment variable is not set");
  }

  const url = `${AGNES_BASE_URL}/agnesapi?video_id=${encodeURIComponent(videoId)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AGNES_API_KEY}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Agnes API error (${res.status}): ${errText}`);
  }

  const json: any = await res.json();

  const video_id: string = json.video_id ?? videoId;

  // completed → video URL lives in remixed_from_video_id
  const video_url: string | null =
    json.remixed_from_video_id ?? json.video_url ?? null;

  return {
    video_id,
    status: json.status ?? "queued",
    progress: json.progress ?? 0,
    video_url,
    error: json.error ?? null,
  };
}
