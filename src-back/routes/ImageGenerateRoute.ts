import { Elysia, t } from "elysia";
import { generateImage } from "../service/imageService.ts";

export const imageGenerateRoute = new Elysia().post(
  "/api/image/generate",
  async ({ body }) => {
    const { model, prompt, size } = body;
    try {
      const result = await generateImage({ model, prompt, size });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  {
    body: t.Object({
      model: t.String(),
      prompt: t.String({ minLength: 1 }),
      size: t.String(),
    }),
  }
);
