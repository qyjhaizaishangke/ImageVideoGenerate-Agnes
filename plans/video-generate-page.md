 # Video Generate 页面开发计划

 ## 概述

 构建视频生成页面（Text-to-Video），模仿 Image Generate 页面的结构。**Phase 1 聚焦文生视频**，后端做薄代理转发 Agnes Video V2.0 API，前端实现异步轮询 + 进度展示。

 **关键差异**: 视频 API 是异步的（image API 是同步的），需要创建任务 → 轮询状态 → 获取结果。

 ---

 ## 页面布局

 与 Image Generate 页面一致：上部输入卡片 + 下部结果展示区。

 ```
 +-----------------------------------------------------------------+
 | Menu  |                                                         |
 |       |    +-------------------------------------------------+  |
 |       |    |   Describe the video you want to generate...     |  |
 |       |    |   [Model v]                     [->]           |  |
 |       |    +-------------------------------------------------+  |
 |       |    +-------------------------------------------------+  |
 |       |    |   Result Display (video player / progress)      |  |
 |       |    +-------------------------------------------------+  |
 +-----------------------------------------------------------------+
 ```

 ---

 ## 组件树

 ```
 src/pages/VideoGenerate/
 +-- index.tsx                  # 页面容器：状态管理 + API 调用 + 轮询
 +-- components/
     +-- VideoPromptInput.tsx   # 输入卡片：textarea + 模型选择 + 发送按钮
     +-- VideoResultDisplay.tsx  # 结果展示：空态 / 加载 / 进度 / 视频 / 错误
 ```

 > 相比 Image 页面，视频页不需要 ImageUpload（Phase 1 文生视频），不需要独立的 ModelSelect/SendButton（内聚在 PromptInput 中更简洁）。考虑到只有 `agnes-video-v2.0` 一个模型，Phase 1 硬编码模型名，ModelSelect 预留为下拉但仅显示一个选项。

 ---

 ## 页面状态机

 ```
                  +----------+
      页面加载 ->  |   idle   |
                  +----+-----+
                       | 用户输入 prompt + 点发送
                  +----v-----+
                  | submitting|  ← POST 创建任务阶段
                  +----+-----+
                  +----+----------+
            成功  |               |  失败
       +---------v--+      +----v-------+
       | processing  |      |   error     |
       | (轮询中)     |      +------------+
       +----+--------+
       +----+---------+
       |               |
 +----v-----+   +-----v----+
 | completed |   |  failed   |
 +-----------+   +-----------+
 ```

 **状态定义:**

 ```typescript
 type PageState =
   | { kind: "idle" }
   | { kind: "submitting" }                                          // 正在 POST 创建任务
   | { kind: "processing"; videoId: string; progress: number }        // 轮询中，progress 0-100
   | { kind: "completed"; videoUrl: string; videoId: string }        // 完成，可播放
   | { kind: "failed"; message: string }                             // 任务失败
   | { kind: "error"; message: string }                              // 请求/网络错误
 ```

 **信号清单:**

 ```typescript
 const [prompt, setPrompt] = createSignal("");
 const [pageState, setPageState] = createSignal<PageState>({ kind: "idle" });
 let pollingTimer: ReturnType<typeof setInterval> | null = null;
 ```

 ---

 ## 数据流

 ```
 用户输入 prompt
        |
        v
 setPageState({ kind: "submitting" })
        |
        v
 POST /api/video/generate
   body: { prompt, model: "agnes-video-v2.0", num_frames: 121, frame_rate: 24 }
        |
        v
 后端转发 Agnes POST /v1/videos → 返回 { video_id, status: "queued" }
        |
        v
 setPageState({ kind: "processing", videoId, progress: 0 })
        |
        v
 每隔 5s 轮询 GET /api/video/status?video_id=xxx
        |
        +-- status=completed → setPageState({ kind: "completed", videoUrl })
        +-- status=failed    → setPageState({ kind: "failed", message })
        +-- 其他              → 更新 progress，继续轮询
 ```

 > **轮询在前端做**，后端只做薄代理（创建任务 + 查询状态），不持有轮询逻辑。

 ---

 ## API 设计

 ### `POST /api/video/generate`

 **Request:**
 ```json
 {
   "prompt": "A cinematic shot of a cat walking on the beach at sunset",
   "model": "agnes-video-v2.0",
   "num_frames": 121,
   "frame_rate": 24
 }
 ```

 **Response (成功创建):**
 ```json
 {
   "video_id": "video_xxxxxx",
   "status": "queued",
   "progress": 0
 }
 ```

 ### `GET /api/video/status?video_id=xxx`

 **Response (处理中):**
 ```json
 {
   "video_id": "video_xxxxxx",
   "status": "in_progress",
   "progress": 45
 }
 ```

 **Response (完成):**
 ```json
 {
   "video_id": "video_xxxxxx",
   "status": "completed",
   "progress": 100,
   "video_url": "https://storage.googleapis.com/agnes-aigc/aigc/videos/.../video_xxxxxx.mp4"
 }
 ```

 **Response (失败):**
 ```json
 {
   "video_id": "video_xxxxxx",
   "status": "failed",
   "error": "Generation failed: ..."
 }
 ```

 ---

 ## 组件规格

 ### 1. `VideoPromptInput.tsx`

 基本复用 Image 页的 `PromptInput` 模式，差异：
 - placeholder: "描述你想生成的视频..." (新 i18n key)
 - 模型选择器仅 `agnes-video-v2.0`（一个选项，Phase 1 可硬编码隐藏）
 - 无 ImageUpload（Phase 1 文生视频）
 - 工具栏布局: `[Model v]` 左对齐, `[Send ->]` 右对齐

 **Props:**
 | Prop | Type | 说明 |
 |------|------|------|
 | `value` | `Accessor<string>` | 提示词 |
 | `onInput` | `(v: string) => void` | 变更回调 |
 | `onSend` | `() => void` | 发送 |
 | `disabled` | `Accessor<boolean>` | 禁用态 |

 ### 2. `VideoResultDisplay.tsx`

 **Props:**
 | Prop | Type | 说明 |
 |------|------|------|
 | `state` | `Accessor<PageState>` | 完整状态 |
 | `onRetry` | `() => void` | 重试/新建 |

 **状态渲染:**

 | kind | 展示内容 |
 |------|---------|
 | `idle` | 空态图标 + "输入提示词开始生成视频" |
 | `submitting` | 骨架屏 + "正在提交..." |
 | `processing` | 进度条 (0-100%) + "正在生成... X%" + 预计剩余时间 |
 | `completed` | `<video>` 播放器 + 下载按钮 |
 | `failed` | 错误图标 + 错误信息 + "重试" 按钮 |
 | `error` | 错误图标 + 错误信息 + "重试" 按钮 |

 **进度条**: 使用 MD3 线性进度指示器样式，`bg-primary` 填充，从 `progress` 信号驱动。

 ---

 ## 后端实现

 ### `src-back/service/videoService.ts` (新增)

 ```typescript
 interface CreateVideoParams {
   model: string;
   prompt: string;
   num_frames?: number;
   frame_rate?: number;
 }

 interface CreateVideoResult {
   video_id: string;
   status: string;
   progress: number;
 }

 export async function createVideo(params: CreateVideoParams): Promise<CreateVideoResult>;
 export async function getVideoStatus(videoId: string): Promise<VideoStatusResult>;
 ```

 - `createVideo`: POST `https://apihub.agnes-ai.com/v1/videos`，从响应的 `video_id` + `status` + `progress` 提取返回
 - `getVideoStatus`: GET `https://apihub.agnes-ai.com/agnesapi?video_id=xxx`，透传 status/progress/video_url

 ### `src-back/routes/VideoGenerateRoute.ts` (重写空文件)

 ```typescript
 // POST /api/video/generate  → createVideo
 // GET  /api/video/status    → getVideoStatus(videoId)
 ```

 - POST body 验证: `t.Object({ prompt: t.String({ minLength: 1 }) })`
 - 其他参数（model/num_frames/frame_rate）在 service 中设默认值
 - 统一错误格式 `{ error: "..." }`

 ### `src-back/index.ts` (更新)

 注册 `videoGenerateRoute`，方式同 `imageGenerateRoute`。

 ---

 ## i18n 新增 Keys

 在 `src/paraglide/messages/_index.js` 中新增:

 | Key | en | zh |
 |-----|----|----|
 | `video_prompt_placeholder` | "Describe the video you want to generate..." | "描述你想生成的视频..." |
 | `video_result_idleHint` | "Enter a prompt to start generating a video" | "输入提示词开始生成视频" |
 | `video_result_submitting` | "Submitting..." | "正在提交..." |
 | `video_result_processing` | "Generating... {progress}%" | "正在生成... {progress}%" |
 | `video_result_download` | "Download video" | "下载视频" |
 | `video_result_altText` | "Generated video" | "生成视频" |
 | `model_videoV20` | "Agnes Video V2.0" | "Agnes Video V2.0" |

 ---

 ## 实施步骤

 | # | 任务 | 文件 | 说明 |
 |---|------|------|------|
 | 1 | 创建 `videoService.ts` | `src-back/service/videoService.ts` | 封装 Agnes Video API (create + query) |
 | 2 | 重写 `VideoGenerateRoute.ts` | `src-back/routes/VideoGenerateRoute.ts` | POST + GET 路由，薄代理 |
 | 3 | 更新后端入口 | `src-back/index.ts` | 注册 videoGenerateRoute |
 | 4 | 新增 i18n keys | `src/paraglide/messages/_index.js` | 7 个新 message key |
 | 5 | 创建 `VideoPromptInput.tsx` | `src/pages/VideoGenerate/components/VideoPromptInput.tsx` | textarea + ModelSelect + SendButton |
 | 6 | 创建 `VideoResultDisplay.tsx` | `src/pages/VideoGenerate/components/VideoResultDisplay.tsx` | 6 状态渲染 + 视频播放器 |
 | 7 | 重写 `VideoGenerate/index.tsx` | `src/pages/VideoGenerate/index.tsx` | 状态机 + 轮询逻辑 + 组合子组件 |

 ---

 ## 样式约定

 与 Image Generate 页面完全一致，复用同一套 MD3 design tokens：
 - 输入卡片: `bg-surface-container-high rounded-corner-xl shadow-elevation-2`
 - textarea: `bg-transparent` 无边框
 - 视频播放器: `rounded-corner-lg shadow-elevation-3`，带原生 controls
 - 进度条: MD3 线性进度 `h-1 bg-primary rounded-corner-full`，宽度由 progress 信号驱动

 ---

 ## 文件清单

 ```
 src-back/
 +-- service/
 |   +-- videoService.ts              # 新增
 +-- routes/
 |   +-- VideoGenerateRoute.ts        # 重写
 +-- index.ts                         # 更新（注册 route）

 src/
 +-- pages/VideoGenerate/
 |   +-- index.tsx                    # 重写
 |   +-- components/
 |       +-- VideoPromptInput.tsx     # 新增
 |       +-- VideoResultDisplay.tsx   # 新增
 +-- paraglide/messages/
     +-- _index.js                    # 更新（新增 7 keys）
 ```

 ---

 ## 假设 & 默认值

 - **Phase 1 仅文生视频**：`image` 参数和 `mode` 不支持
 - **默认视频参数**: `num_frames: 121`, `frame_rate: 24` (~5s), `width: 1152`, `height: 768`
 - **模型**: 硬编码 `agnes-video-v2.0`（Phase 1 仅一个模型）
 - **轮询间隔**: 5 秒，持续到 `completed` 或 `failed`，或 10 分钟超时
 - **轮询在前端**: `setInterval` 在组件内管理，组件卸载时清理
 - **视频播放**: 原生 `<video>` 元素，`controls` 属性，`max-w-full`
 - **下载**: 视频 URL 直接作为 `<a download>` 链接
 - **无视频 base64 传输**: 视频通过 URL 传播放，不走 base64（文件大）

 ---

 ## Phase 2 图生视频：前置约束

 Agnes Video V2.0 的 `image` 参数**仅接受公网可访问的 HTTP(S) URL**，不支持 `data:` URI 或 base64 直接传输。这与 Image API (`/v1/images/generations`) 的行为不同 —— 后者通过 `image: ["data:image/png;base64,..."]` 可以直传 base64。

 因此图生视频比文生视频多出一环：**用户上传图片 → 转为公网 URL → 传给 Agnes**。策略待定，主要选项：

 - **后端文件服务器**：后端接收 base64 存本地，通过自身域名暴露 `/uploads/xxx.png`（需要公网部署才有意义；`localhost` URL 对 Agnes 不可达）
 - **第三方图床中转**：上传到 imgbb / imgur 等服务拿公网 URL（依赖外部服务，有速率与隐私考量）
 - **云存储中转**：上传到 S3 / R2 / GCS 等获取公网 URL（需额外配置与费用）

 > 以上方案**暂不选定**，Phase 1 先走纯文生视频路径。

 ---

 ## Agnes Video V2.0 API 参考

 > 以下信息提取自 [Agnes Video V2.0](https://agnes-ai.com/doc/agnes-video-v20) 官方文档。

 ### 公共信息

 | 项目 | 值 |
 |------|-----|
 | Base URL | `https://apihub.agnes-ai.com` |
 | Endpoint (创建) | `POST /v1/videos` |
 | Endpoint (查询, 推荐) | `GET /agnesapi?video_id=<VIDEO_ID>` |
 | Endpoint (查询, 兼容) | `GET /v1/videos/{task_id}` |
 | 认证 | `Authorization: Bearer YOUR_API_KEY` |
 | Content-Type | `application/json` |
 | API 类型 | 异步任务式 |

 ### 创建任务参数（Phase 1 文生视频）

 | 参数 | 类型 | 必填 | 说明 |
 |------|------|------|------|
 | `model` | string | 是 | 固定 `agnes-video-v2.0` |
 | `prompt` | string | 是 | 视频内容的文本描述 |
 | `num_frames` | integer | 否 | 帧数，≤441 且满足 8n+1，默认按内部规则 |
 | `frame_rate` | number | 否 | FPS，1–60，默认 24 |
 | `height` | integer | 否 | 高度，默认 768 |
 | `width` | integer | 否 | 宽度，默认 1152 |
 | `seed` | integer | 否 | 随机种子 |
 | `negative_prompt` | string | 否 | 负向提示词 |

 ### 创建任务响应

 ```json
 {
   "id": "task_YOUR_TASK_ID",
   "task_id": "task_YOUR_TASK_ID",
   "video_id": "video_YOUR_VIDEO_ID",
   "object": "video",
   "model": "agnes-video-v2.0",
   "status": "queued",
   "progress": 0,
   "created_at": 1780457477,
   "seconds": "10.0",
   "size": "1280x768"
 }
 ```

 ### 查询结果响应（完成时）

 ```json
 {
   "id": "task_YOUR_TASK_ID",
   "video_id": "video_YOUR_VIDEO_ID",
   "model": "agnes-video-v2.0",
   "object": "video",
   "status": "completed",
   "progress": 100,
   "seconds": "10.0",
   "size": "1280x768",
   "remixed_from_video_id": "https://storage.googleapis.com/agnes-aigc/aigc/videos/.../video_xxxxxx.mp4",
   "error": null
 }
 ```

 ### 任务状态

 | 状态 | 说明 |
 |------|------|
 | `queued` | 任务正在队列中等待 |
 | `in_progress` | 视频正在生成中 |
 | `completed` | 视频已生成完成 |
 | `failed` | 视频生成失败 |

 ### 视频时长控制

 `seconds = num_frames / frame_rate`

 | 目标时长 | 推荐参数 |
 |---------|---------|
 | 约 3 秒 | `num_frames: 81`, `frame_rate: 24` |
 | 约 5 秒 | `num_frames: 121`, `frame_rate: 24` |
 | 约 10 秒 | `num_frames: 241`, `frame_rate: 24` |
 | 约 18 秒 | `num_frames: 441`, `frame_rate: 24` |

 ### Prompt 最佳实践

 **文生视频推荐结构**: `[主体] + [动作] + [场景] + [镜头运动] + [光照] + [风格]`

 示例:
 ```
 A young astronaut walking across a red desert planet, dust blowing in the wind,
 slow cinematic tracking shot, dramatic sunset lighting, realistic sci-fi style
 ```

 ### 错误码

 | 状态码 | 说明 |
 |--------|------|
 | 400 | 请求无效，请检查请求参数 |
 | 401 | 未授权，请检查 API Key |
 | 404 | 任务或视频不存在 |
 | 500 | 服务器错误 |
 | 503 | 服务繁忙，请稍后重试 |
