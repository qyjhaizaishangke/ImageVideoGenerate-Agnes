import { Elysia } from "elysia";
import { imageGenerateRoute } from "./routes/ImageGenerateRoute.ts";
import { videoGenerateRoute } from "./routes/VideoGenerateRoute.ts";

const PORT = Number(process.env.BACKEND_PORT) || 3001;

new Elysia()
  .onRequest(({ set }) => {
    set.headers["Access-Control-Allow-Origin"] = "*";
    set.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    set.headers["Access-Control-Allow-Headers"] = "Content-Type";
  })
  .options("*", () => new Response(null, { status: 204 }))
  .use(imageGenerateRoute)
  .use(videoGenerateRoute)
  .listen(PORT);

console.log(`Backend running at http://localhost:${PORT}`);
