const AGNES_API_KEY = process.env.AGNES_API_KEY;
const AGNES_BASE_URL = "https://apihub.agnes-ai.com";

interface GenerateImageParams {
  model: string;
  prompt: string;
  size: string;
}

interface GenerateImageResult {
  imageBase64: string;
}

export async function generateImage(
  params: GenerateImageParams,
): Promise<GenerateImageResult> {
  if (!AGNES_API_KEY) {
    throw new Error("AGNES_API_KEY environment variable is not set");
  }

  const body: Record<string, unknown> = {
    model: params.model,
    prompt: params.prompt,
    size: params.size,
    return_base64: true,
  };

  const res = await fetch(`${AGNES_BASE_URL}/v1/images/generations`, {
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
  const b64: string | undefined = json.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("Agnes API returned no base64 image data");
  }

  return { imageBase64: b64 };
}
