# ImageVideoGenerate-Agnes

通过 [Agnes AI](https://agnes-ai.com) API 生成图片和视频的 Web 应用。

## 功能

| 功能 | 状态 |
|------|------|
| Text-to-Image（Agnes Image 2.0 / 2.1 Flash） | ✅ 已实现 |
| Image-to-Image | 🚧 计划中 |
| Text-to-Video（Agnes Video V2.0） | 🚧 计划中 |
| 国际化（中 / 英） | ✅ 已实现 |
| 主题切换（亮色 / 暗色 / 自动） | ✅ 已实现 |
| Docker 部署 | 🚧 待实现 |

## 技术栈

- **前端**: Solid.js + TypeScript + Vite · Tailwind CSS v4 · Solid Router
- **后端**: Elysia + TypeScript（Bun 运行时）
- **AI**: [Agnes Image 2.0 Flash](https://agnes-ai.com/doc/agnes-image-20-flash) · [Agnes Image 2.1 Flash](https://agnes-ai.com/doc/agnes-image-21-flash) · [Agnes Video V2.0](https://agnes-ai.com/doc/agnes-video-v20)

## 本地开发

### 环境要求

- [Bun](https://bun.sh/) ≥ 1.0

### 启动

```bash
# 安装依赖
bun install

# 复制环境变量并填入 AGNES_API_KEY
cp .env.example .env

# 同时启动前后端（开发模式）
bun run dev
```

前端运行在 `http://localhost:3000`，后端运行在 `http://localhost:3001`。

### 可用脚本

| 命令 | 说明 |
|------|------|
| `bun run dev` | 并行启动前端（Vite）和后端（Elysia） |
| `bun run dev:fontend` | 仅启动前端，端口 3000 |
| `bun run dev:backend` | 仅启动后端，端口 3001 |
| `bun run build:fontend` | 构建前端到 `dist/` |

## 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `AGNES_API_KEY` | ✅ | — | Agnes AI API Key |
| `BACKEND_PORT` | ❌ | `3001` | 后端端口 |

复制 `.env.example` 为 `.env` 并填写 `AGNES_API_KEY`。

## API

### 图片生成

```
POST /api/image/generate
```

后端作为 Agnes Image API 的薄代理层，使用 `return_base64: true` 模式，直接返回 base64 图片数据。

**请求体：**

```json
{
  "model": "agnes-image-2.0-flash",
  "prompt": "A scenic mountain landscape at sunset",
  "size": "1024x768"
}
```

**成功响应：**

```json
{
  "imageBase64": "iVBORw0KGgo..."
}
```

**错误响应：**

```json
{
  "error": "AGNES_API_KEY environment variable is not set"
}
```

### 视频生成

TBD — Agnes Video API 可能为异步，实现时再确定轮询 / WebSocket 方案。

## 项目结构

```text
ImageVideoGenerate-Agnes/
├── src/                     # 前端 (Solid.js)
│   ├── components/          #   通用组件
│   │   └── Menu/            #     侧边栏导航 + 主题切换
│   ├── pages/               #   页面组件
│   │   ├── ImageGenerate/   #     图片生成页
│   │   ├── VideoGenerate/   #     视频生成页（占位）
│   │   └── Settings/        #     设置页
│   ├── i18n/                #   国际化
│   ├── routes/              #   路由定义
│   ├── theme/               #   主题系统 (data-theme, MD3 tokens)
│   ├── index.tsx            #   入口
│   ├── index.css            #   全局样式
│   └── Layout.tsx           #   根布局
├── src-back/                # 后端 (Elysia)
│   ├── routes/              #   API 路由
│   ├── service/             #   业务逻辑 / AI API 调用
│   └── index.ts             #   入口 (CORS + 路由, 端口 3001)
├── plans/                   # 开发计划文档
├── index.html               # HTML 入口
├── vite.config.ts           # Vite 配置
├── package.json             # 项目配置
└── .env.example             # 环境变量模板
```

## License

MIT
