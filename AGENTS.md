# AGENTS.md

## 项目结构

```
ImageVideoGenerate-Agnes/
├── src/                        # 前端代码 (Solid.js)
│   ├── components/             # UI 组件
│   ├── pages/                  # 页面路由
│   ├── index.tsx              # 入口文件
│   ├── index.css              # 全局样式
│   └── ...
├── src-back/                   # 后端服务 (Elysia)
│   ├── index.ts               # 入口文件
│   └── ...
├── Dockerfile.back             # Docker 镜像
├── AGENTS.md                   # 项目文档
├── GOAL.md                     # 项目需求
├── package.json                # 根 package.json
├── vite.config.ts             # Vite 配置
├── bun.lock
└── README.md
```

## 技术规范

- **前端 (src/)**: Solid.js + TypeScript
  - 路由：Solid Router
  - 状态管理：Solid Signals / Store
  - 构建工具：Vite
  - 样式：CSS Modules + Tailwind CSS

- **后端 (src-back/)**: Elysia + TypeScript (Bun 运行时)
  - API 设计：RESTful 使用 Elysia 路由装饰器
  - **鉴权：无** (去掉鉴权)
  - 文档：Swagger (Elysia OpenAPI)
  - **静态文件**: `/` 路径返回前端构建的 `dist/index.html`

- **AI 模型**: 通过 Agnes AI API 调用
  - 图片生成：[Agnes Image 2.1 Flash](https://agnes-ai.com/doc/agnes-image-21-flash)
  - 视频生成：[Agnes Video V2.0](https://agnes-ai.com/doc/agnes-video-v20)

## 代码规范

1. 所有代码使用 TypeScript，严格模式 (strict: true)
2. 前端代码组织在 `src/components/` 和 `src/pages/`
3. 后端代码在 `src-back/`，路由在 `src-back/routes/`，业务逻辑在 `src-back/services/`
4. 敏感信息通过环境变量注入，密钥不要直接写入代码
5. **所有操作使用 Bun 作为包管理器**

## 部署架构

**关键点**: 后端 `/` 路径返回前端构建的 `dist/index.html`

实现方式:
1. 前端构建 `src/` → `dist/index.html`
2. 构建产物复制到 `src-back/dist/`
3. 后端 `/` 路由读取并返回 `dist/index.html`
4. 其他 `/` 请求重定向到 `index.html` (支持 SPA 路由)

## 目录职责

| 目录 | 职责 |
|------|------|
| src/ | 前端 Solid.js 应用源码 |
| src/components/ | 可复用 UI 组件 |
| src/pages/ | 页面路由组件 |
| src/index.tsx | 前端入口文件 |
| src/index.css | 全局样式 |
| src-back/ | 后端 Elysia 服务源码 |
| src-back/index.ts | 后端入口文件 |
| src-back/routes/ | API 路由定义 |
| src-back/services/ | 业务逻辑 / API 调用 |
| ./Dockerfile.back | Docker 镜像构建 |

## 部署方式

### Docker 容器化部署

**项目采用 Docker 容器化部署，单一容器部署 (Elysia 同时提供 API 和静态文件)：**

1. **单一容器**: Elysia 服务
   - 构建 `src-back/` 包含 API 和前端构建产物
   - `/api/*` 路径处理 API 请求
   - **`/` 和其他所有路径返回 `src-back/dist/index.html`** (SPA 路由支持)

```bash
# 构建所有镜像
bun run docker:build

# 启动服务
bun run docker:up

# 查看日志
bun run docker:logs

# 停止服务
bun run docker:down

# 一键启动
bun run docker:start
```

### 本地开发

```bash
# 安装依赖
bun install

# 启动前端开发服务器
bun run dev:frontend

# 启动后端开发服务器
bun run dev:backend
```

### 构建流程

```bash
# 构建前后端（自动复制 index.html 到后端）
bun run build
```

## 注意事项

- 后端 `/` 路径返回前端页面 `/api/*` 路径处理 API 请求
- 图片/视频生成是异步任务，支持查询、WebSocket 回调
- 文件存储使用本地磁盘或 S3，通过 API 提供上传/下载
- Docker 镜像构建产物需 `.dockerignore` 排除不必要的文件