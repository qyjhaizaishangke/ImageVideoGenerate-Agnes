# Image Generate 页面开发计划

## 概述

构建图片生成页面的核心交互界面。**Phase 1 聚焦文生图**（Text-to-Image），图生图仅预留 UI 入口和数据结构，不做后端对接。

**重要**: Agnes AI 的 `/v1/images/generations` 是同步接口，请求直接返回 `{ data: [{ url }] }`，无需 taskId 轮询。后端做薄代理即可。

---

## 页面布局

```
+-----------------------------------------------------------------+
| Menu  |                                                         |
|       |                                                         |
|       |    +-------------------------------------------------+  |
|       |    |                                                 |  |
|       |    |   Describe the image you want to generate...    |  |
|       |    |                                                 |  |
|       |    |   [Model v]  [+]                    [->]       |  |
|       |    +-------------------------------------------------+  |
|       |                                                         |
|       |    +-------------------------------------------------+  |
|       |    |                                                 |  |
|       |    |          Result Display Area                    |  |
|       |    |          (empty / loading / image)              |  |
|       |    |                                                 |  |
|       |    +-------------------------------------------------+  |
|       |                                                         |
+-----------------------------------------------------------------+
```

- 页面内容区 `max-w-3xl mx-auto` 约束宽度，上下居中
- 上部：输入卡片（PromptInput），包含 textarea + 底部工具栏
- 下部：结果展示区，flex-1 撑满剩余空间
- 输入卡片内部：textarea 在上，工具栏（模型选择 / `+` 上传 / `SendHorizonal` 发送）在底部

---

## 组件树

```
src/pages/ImageGenerate/
+-- index.tsx                  # 页面容器：组合子组件 + 状态管理
+-- components/
    +-- PromptInput.tsx        # 输入卡片：textarea + 工具栏
    +-- ModelSelect.tsx        # 模型选择下拉
    +-- ImageUpload.tsx        # 图片上传按钮（图生图预留）
    +-- SendButton.tsx         # 发送按钮
    +-- ResultDisplay.tsx      # 结果展示：空态 / 加载 / 图片 / 错误
```

---

## 组件规格

### 1. `PromptInput.tsx`

**Props:**
| Prop | Type | 说明 |
|------|------|------|
| `value` | `Accessor<string>` | 提示词内容 |
| `onInput` | `(value: string) => void` | 文本变更回调 |
| `onSend` | `() => void` | 发送回调 |
| `disabled` | `Accessor<boolean>` | 禁用态（生成中） |
| `hasImage` | `Accessor<boolean>` | 是否已选图片 |
| `onUploadClick` | `() => void` | 上传按钮点击 |

**布局:**
```
+---------------------------------------+
|  bg-surface-container-high            |
|  rounded-corner-xl                    |
|  shadow-elevation-2                   |
|                                       |
|  +---------------------------------+  |
|  |  textarea                       |  |
|  |  min-h-[120px]                  |  |
|  |  resize-none                    |  |
|  |  placeholder: "描述你想生成的图片..."|  |
|  |  bg-transparent                 |  |
|  |  text-on-surface                |  |
|  |  text-body-lg                   |  |
|  +---------------------------------+  |
|                                       |
|  +---------------------------------+  |
|  | [Model v]  [+]        [Send ->] |  |
|  |  toolbar: flex justify-between  |  |
|  +---------------------------------+  |
+---------------------------------------+
```

**交互:**
- textarea 自动撑高（监听 `onInput`，调整 `rows` 或 `style.height`），最小 3 行
- Enter 发送（Shift+Enter 换行）
- 发送后保留 prompt，方便迭代调整
- 发送按钮：prompt 为空时 `opacity-50 cursor-not-allowed`，有内容时全亮

### 2. `ModelSelect.tsx`

**Props:**
| Prop | Type | 说明 |
|------|------|------|
| `value` | `Accessor<string>` | 当前模型 ID |
| `onChange` | `(model: string) => void` | 模型变更回调 |
| `disabled` | `Accessor<boolean>` | 禁用态 |

**模型列表:**
| ID | 显示名称 |
|----|---------|
| `agnes-image-2.1-flash` | Image 2.1 Flash |
| `agnes-image-2.0-flash` | Image 2.0 Flash |

**外观:**
- 紧凑下拉选择器，`h-9` 与工具栏按钮对齐
- `bg-transparent text-on-surface-variant text-label-md`
- `border border-outline-variant rounded-corner-sm`
- `px-2` 左右内边距，右侧小箭头图标（`ChevronDown`）
- hover: `bg-surface-container-highest`
- focus: `border-primary` ring

**实现:**
- 使用原生 `<select>` + Tailwind 样式，简洁可访问
- `appearance-none` 隐藏原生箭头，用 `ChevronDown` 替代
- 模型 ID 存入 Signal，发送时随 prompt 一并传给 API
- 默认选中 `agnes-image-2.1-flash`

### 3. `ImageUpload.tsx` — 图生图预留

**Props:**
| Prop | Type | 说明 |
|------|------|------|
| `onImageSelected` | `(base64: string) => void` | 选中图片回调 |
| `disabled` | `Accessor<boolean>` | 禁用态 |

**外观:**
- `+` 图标按钮（lucide-solid `Plus`），`w-9 h-9`，圆形
- `text-on-surface-variant hover:bg-surface-container-highest`
- hover tooltip: "上传参考图"
- 选中图片后按钮变为缩略图预览（16x16 小圆角方块），旁边显示文件名

**实现:**
- 隐藏 `<input type="file" accept="image/*">`, 按钮 click -> `input.click()`
- 读取为 base64：`FileReader.readAsDataURL(file)`
- **Phase 1**: UI 完整，`onImageSelected` 触发后存储 base64 但不发送到后端
- Phase 2 才会把 base64 放入 API 请求体

### 4. `SendButton.tsx`

**Props:**
| Prop | Type | 说明 |
|------|------|------|
| `onClick` | `() => void` | 点击回调 |
| `disabled` | `Accessor<boolean>` | 禁用态 |
| `loading` | `Accessor<boolean>` | 加载态（显示 spinner） |

**外观:**
- `SendHorizonal` 图标（lucide-solid），`w-9 h-9`，圆形
- 空闲: `bg-primary text-on-primary hover:opacity-90`
- 禁用: `bg-surface-container-highest text-on-surface-variant opacity-50`
- 加载: 图标替换为 `Loader2` + `animate-spin`

### 5. `ResultDisplay.tsx`

**Props:**
| Prop | Type | 说明 |
|------|------|------|
| `state` | `"idle" | "loading" | "success" | "error"` | 当前状态 |
| `imageUrl` | `Accessor<string | null>` | 生成结果 URL |
| `error` | `Accessor<string | null>` | 错误信息 |
| `onRetry` | `() => void` | 重试回调 |
| `onDownload` | `() => void` | 下载回调 |

**四种状态:**

| 状态 | 展示内容 |
|------|---------|
| `idle` | 空态插画/图标 + "输入提示词开始生成" 提示文字 |
| `loading` | 骨架屏或脉冲动画占位 + "正在生成..." + 进度条（可选） |
| `success` | 生成的图片，带下载按钮悬浮层 |
| `error` | 错误 icon + 错误信息 + "重试" 按钮 |

---

## 页面状态机

```
                    +----------+
        页面加载 ->  |   idle   |
                    +----+-----+
                         | 用户输入 prompt + 点发送
                    +----v-----+
                    |  loading  |
                    +----+-----+
                    +----+-----+
              成功  |           |  失败
           +-------v--+   +---v-------+
           | success  |   |   error    |
           +--+-------+   +---+-------+
              | 新生成         | 点重试
              +--> loading    +--> loading
```

**状态定义（TypeScript）:**
```typescript
type PageState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; imageUrl: string }
  | { kind: "error"; message: string };
```

**信号清单（`ImageGenerate/index.tsx`）:**
```typescript
const [prompt, setPrompt] = createSignal("");
const [model, setModel] = createSignal("agnes-image-2.1-flash");
const [imageBase64, setImageBase64] = createSignal<string | null>(null); // Phase 1 预留
const [pageState, setPageState] = createSignal<PageState>({ kind: "idle" });
```

---

## 数据流

```
用户输入 prompt + 选择模型
       |
       v
prompt Signal<string>   model Signal<string>
       |                        |
       | 点击发送               |
       v                        v
setPageState({ kind: "loading" })
       |
       v
POST /api/image/generate
  body: { model, prompt, size: "1024x768" }
       |
       v
后端转发 Agnes API (同步接口，直接返回)
       |
       +-- 成功 -> setPageState({ kind: "success", imageUrl })
       +-- 失败 -> setPageState({ kind: "error", message })
```

---

## API 设计

### `POST /api/image/generate`

后端薄代理——收到请求后转发到 Agnes `POST /v1/images/generations`，直接将 Agnes 返回的 `data[0].url` 包装返回给前端。Agnes API 是同步的，无需 taskId 轮询。

**Request:**
```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "A scenic mountain landscape at sunset",
  "size": "1024x768",
  "image": "data:image/png;base64,..."
}
```
> `model` 必填；`image` 字段 Phase 2 才启用

**Response (成功):**
```json
{
  "imageUrl": "https://storage.googleapis.com/agnes-aigc/xxx.png"
}
```

**Response (失败):**
```json
{
  "error": "Generation failed: ..."
}
```

---

## 实施步骤

### Phase 1 -- 文生图（本次实现）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 1 | 创建 `ModelSelect` 组件 | `src/pages/ImageGenerate/components/ModelSelect.tsx` | 模型下拉选择器 |
| 2 | 创建 `SendButton` 组件 | `src/pages/ImageGenerate/components/SendButton.tsx` | 三态：空闲/禁用/加载 |
| 3 | 创建 `ImageUpload` 组件 | `src/pages/ImageGenerate/components/ImageUpload.tsx` | 完整 UI + base64 读取，不调 API |
| 4 | 创建 `PromptInput` 组件 | `src/pages/ImageGenerate/components/PromptInput.tsx` | textarea + 工具栏（ModelSelect + ImageUpload + SendButton） |
| 5 | 创建 `ResultDisplay` 组件 | `src/pages/ImageGenerate/components/ResultDisplay.tsx` | 四种状态渲染 |
| 6 | 重写 `ImageGenerate/index.tsx` | `src/pages/ImageGenerate/index.tsx` | 状态管理 + API 调用 + 组合子组件 |
| 7 | 补全 `ImageGenerateRoute.ts` | `src-back/routes/ImageGenerateRoute.ts` | `POST /api/image/generate` 薄代理转发 Agnes |
| 8 | 创建 `imageService.ts` | `src-back/service/imageService.ts` | 封装 Agnes API（按模型分支构建不同请求体） |

### Phase 2 -- 图生图（后续迭代）

| # | 任务 |
|---|------|
| 1 | API 请求体加入 `image` base64 字段（2.1 放在 `extra_body` 中） |
| 2 | 选中图片后在输入区显示缩略图预览 |
| 3 | 后端对接 Agnes Image-to-Image endpoint |

---

## 样式约定

- **输入卡片**: `bg-surface-container-high rounded-corner-xl shadow-elevation-2`
- **textarea**: `bg-transparent` 无边框，融入卡片背景
- **工具栏**: 卡片底部 `border-t border-outline-variant` 分隔；左侧模型选择 + 上传，右侧发送
- **模型选择器**: 原生 `<select>` 样式化，`h-9 rounded-corner-sm border-outline-variant`
- **按钮**: 圆形 icon button，`w-9 h-9 rounded-corner-full`，同 Menu 组件风格
- **加载态**: `Loader2` icon + `animate-spin`
- **空态**: `ImageIcon`（lucide）灰色大图标 + 提示文字 `text-on-surface-variant`
- **成功图**: `rounded-corner-lg`, `shadow-elevation-3`，hover 显示下载 overlay
- **错误态**: `AlertCircle` icon + `text-error` 文字 + 带 `bg-error-container` 的提示条

---

## 文件清单

```
src/pages/ImageGenerate/
+-- index.tsx                        # 页面入口（重写）
+-- components/
    +-- PromptInput.tsx              # 新增
    +-- ModelSelect.tsx              # 新增
    +-- ImageUpload.tsx              # 新增
    +-- SendButton.tsx               # 新增
    +-- ResultDisplay.tsx            # 新增

src-back/
+-- routes/
|   +-- ImageGenerateRoute.ts        # 补全
+-- service/
    +-- imageService.ts              # 新增
```

---

## 设计 Token 速查

| Token | Tailwind Class | 值（Light） |
|-------|---------------|-------------|
| 主色 | `bg-primary` / `text-primary` | `#6750a4` |
| 表面 | `bg-surface` | `#fdf8ff` |
| 表面容器高 | `bg-surface-container-high` | `#ece6f0` |
| 表面文字 | `text-on-surface` | `#1d1b20` |
| 表面文字次级 | `text-on-surface-variant` | `#49454f` |
| 轮廓 | `border-outline` / `border-outline-variant` | `#79747e` / `#cac4d0` |
| 错误容器 | `bg-error-container` | `#f9dedc` |
| 圆角-xl | `rounded-corner-xl` | `1.75rem` |
| 圆角-lg | `rounded-corner-lg` | `1rem` |
| 圆角-full | `rounded-corner-full` | `9999px` |
| 阴影-2 | `shadow-elevation-2` | 卡片级阴影 |
| 阴影-3 | `shadow-elevation-3` | 结果图阴影 |

---

## Agnes API 参考

> 以下信息提取自 [Agnes Image 2.0 Flash](https://agnes-ai.com/doc/agnes-image-20-flash) 和 [Agnes Image 2.1 Flash](https://agnes-ai.com/doc/agnes-image-21-flash) 官方文档。

### 公共信息（两个模型共享）

| 项目 | 值 |
|------|-----|
| Base URL | `https://apihub.agnes-ai.com` |
| Endpoint | `POST /v1/images/generations` |
| 认证 | `Authorization: Bearer YOUR_API_KEY` |
| Content-Type | `application/json` |
| 请求方法 | POST |
| 客户端超时 | 建议 60s ~ 360s |

### Agnes Image 2.0 Flash

**模型名称**: `agnes-image-2.0-flash`

**能力**: 文生图 / 图生图 / 多图合成 / 图像编辑 / 风格控制 / 快速生成

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | 固定 `agnes-image-2.0-flash` |
| `prompt` | string | 是 | 描述目标图像的文本提示词 |
| `size` | string | 是 | 输出尺寸，如 `1024x768`、`1024x1024`、`768x1024` |
| `image` | string[] | 图生图必填 | 输入图片数组，支持公网 URL 或 Data URI Base64 |
| `return_base64` | boolean | 否 | 文生图返回 Base64 时设为 `true` |
| `n` | number | 否 | 生成数量，1-4，默认 1 |

**文生图示例 (curl):**
```bash
curl https://apihub.agnes-ai.com/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-image-2.0-flash",
    "prompt": "A scenic mountain landscape at sunset",
    "size": "1024x768"
  }'
```

### Agnes Image 2.1 Flash

**模型名称**: `agnes-image-2.1-flash`

**能力**: 文生图 / 图生图 / 高信息密度图像优化 / 构图保持 / 灵活尺寸控制 / URL 或 Base64 返回

**2.1 相比 2.0 的增强**: 针对复杂视觉细节、丰富构图、密集元素和清晰语义对齐进行优化，更适合高信息密度场景。

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | 固定 `agnes-image-2.1-flash` |
| `prompt` | string | 是 | 图片生成或编辑提示词 |
| `size` | string | 是 | 输出尺寸，如 `1024x768` |
| `image` | string[] | 图生图必填 | 输入图片数组，支持公网 URL 或 Data URI Base64 |
| `return_base64` | boolean | 否 | 文生图返回 Base64 时设为 `true` |
| `extra_body` | object | 否 | 高级扩展参数 |
| `extra_body.response_format` | string | 否 | 输出格式 `"url"` 或 `"b64_json"` |

**重要**: `response_format` **不能**放在请求体顶层，必须嵌套在 `extra_body` 中，否则返回 400。图生图的 `image` 数组放在 `extra_body` 中。**不需要**传 `tags: ["img2img"]`。

**文生图 (URL 输出) 示例:**
```bash
curl https://apihub.agnes-ai.com/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-image-2.1-flash",
    "prompt": "A luminous floating city above a misty canyon at sunrise, cinematic realism",
    "size": "1024x768",
    "extra_body": { "response_format": "url" }
  }'
```

**文生图 (Base64 输出) 示例:**
```bash
curl https://apihub.agnes-ai.com/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-image-2.1-flash",
    "prompt": "A clean product photo on white background",
    "size": "1024x768",
    "return_base64": true
  }'
```

### 返回格式

**URL 输出:**
```json
{
  "created": 1780000000,
  "data": [{
    "url": "https://storage.googleapis.com/agnes-aigc/xxx.png",
    "b64_json": null,
    "revised_prompt": null
  }]
}
```

**Base64 输出:**
```json
{
  "created": 1780000000,
  "data": [{
    "url": null,
    "b64_json": "iVBORw0KGgoAAAANSUhEUgAA...",
    "revised_prompt": null
  }]
}
```

### 提示词最佳实践

**文生图推荐结构**: `[主体] + [场景/环境] + [风格] + [光照] + [构图] + [质量要求]`

**图生图推荐结构**: `[修改要求] + [新风格/新场景] + [需添加/移除的元素] + [需保留的元素]`

### 两种模型对比

| 维度 | Image 2.0 Flash | Image 2.1 Flash |
|------|-----------------|-----------------|
| 模型名 | `agnes-image-2.0-flash` | `agnes-image-2.1-flash` |
| 文生图 | Yes | Yes |
| 图生图 | Yes | Yes |
| 多图合成 | Yes | No |
| 图像编辑 | Yes | Yes（构图保持更强） |
| 高密度场景 | 基础 | **专门优化** |
| `extra_body` | 不需要 | 需要放 `response_format` 和 `image` |
| 价格 | 免费 | $0.003 / 张 |
