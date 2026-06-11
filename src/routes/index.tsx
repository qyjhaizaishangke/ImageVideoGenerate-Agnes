 import type { RouteDefinition } from "@solidjs/router";
 import Layout from "../Layout";
 import ImageGenerate from "../pages/ImageGenerate";
 import VideoGenerate from "../pages/VideoGenerate";
 import Settings from "../pages/Settings";

 const routes: RouteDefinition[] = [
   {
     path: "/",
     component: Layout,
     children: [
       { path: "/", component: ImageGenerate },
       { path: "/image-generate", component: ImageGenerate },
       { path: "/video-generate", component: VideoGenerate },
       { path: "/settings", component: Settings },
     ],
   },
 ];

 export default routes;
