import { Elysia, t } from "elysia";
import { createVideo, getVideoStatus } from "../service/videoService.ts";

export const videoGenerateRoute = new Elysia()
  .post(
    "/api/video/generate",
    async ({ body }) => {
      const { prompt } = body;
      try {
        const result = await createVideo({ prompt });
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
        prompt: t.String({ minLength: 1 }),
      }),
    },
  )
  .get(
    "/api/video/status",
    async ({ query }) => {
      const { video_id } = query;

      if (!video_id) {
        return new Response(
          JSON.stringify({ error: "video_id is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      try {
        const result = await getVideoStatus(video_id);
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
      query: t.Object({
        video_id: t.String(),
      }),
    },
  );
