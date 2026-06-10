# GOAL.md

## 项目目标

构建一个图片/视频生成网站，通过 Agnes AI API 调用

- **Agnes Image 2.1 Flash**: 生成图片
- **Agnes Video V2.0**: AI 视频生成

## 技术栈

- **前端**: Solid.js + TypeScript + Vite
- **后端**: Elysia + TypeScript (Bun 运行时)
- **AI 服务**: Agnes AI API
- **部署**: Docker 容器化部署 (单一 Elysia 容器)

## 功能规划

### 核心功能
- [ ] 图片生成功能
  - [ ] 文生图片 (Text-to-Image)
  - [ ] 图生图片 (Image-to-Image)
    - [ ] Base64 图片传输
    - [ ] 图片风格调整
    - [ ] 图片参数修改（宽高、步数等）
    - [ ] 生成结果预览/下载
  - [ ] 图片转视频
  - [ ] 生成结果预览/下载
- [ ] 视频生成功能
  - [ ] 文生视频 (Text-to-Video)
  - [ ] 图片转视频 (Image-to-Video)
  - [ ] 生成结果实时通知
  - [ ] 生成结果预览/下载

### 非功能性需求
- [ ] 异步任务处理机制
- [ ] 生成状态查询 / WebSocket 通知
- [ ] 文件存储 (本地磁盘 / S3)
- [ ] API 文档自动生成 (OpenAPI)
- [ ] 容器化部署 (Docker)
- [ ] **鉴权：已去掉** (无 JWT/认证)

## 项目状态

| 阶段 | 状态 | 说明 |
|------|------|------|
| 项目启动 | ✅ 已完成 | 创建 src/ 和 src-back/ 目录及 AGENTS.md / GOAL.md |
| 后端架构搭建 | ? 未开始 | 搭建 Elysia 服务、路由、中间件 |
| 前端架构搭建 | ? 未开始 | 搭建 Solid.js 应用、路由、状态管理 |
| API 接口 | ? 未开始 | 对接 Agnes AI API(图片 + 视频) |
| 核心功能开发 | ? 未开始 | 实现图片/视频生成功能 |
| 测试优化 | ? 未开始 | 单元测试、集成测试、性能优化 |

## 部署架构

### Docker 容器化 (单一 Elysia 容器)

```
┌─────────────────────────────────────────────────────┐
│                  Docker Compose                      │
│  ┌─────────────────────────────────────────┐        │
│  │         Backend (Elysia + Bun)          │        │
│  │                                         │        │
│  │  / → index.html (SPA 路由)              │        │
│  │  /api/* → API 处理                      │        │
│  │                                         │        │
│  │  Ports: 3000:3000                       │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

### 后端静态文件服务

**关键点**: 后端 `/` 路径返回前端构建的 `dist/index.html`

实现方式:
1. 前端构建 `src/` -> `dist/index.html`
2. 构建产物复制到 `src-back/dist/`
3. 后端 `/` 路由读取并返回 `dist/index.html`
4. 其他 `/` 请求重定向到 `index.html` (支持 SPA 路由)

### Docker Compose 配置

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.back
    ports:
      - "3000:3000"
    environment:
      - AGNES_API_KEY=${AGNES_API_KEY}
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## 开发约定

1. **Bun 作为包管理器**: 所有依赖安装、构建、启动都用 `bun`
   - `bun install` - 安装依赖
   - `bun run dev` - 开发模式
   - `bun run build` - 构建

2. **去掉鉴权**: API 无需 JWT/认证，直接调用

3. **Docker 优先**: 开发环境可以用 Bun 直接运行，生产环境必须用 Docker

4. **错误处理**: 
   - 统一错误格式
   - 友好错误提示
   - 日志记录

## 文件结构

```
ImageVideoGenerate-Agnes/
├── src/                       # 前端
│   ├── components/            # UI 组件
│   ├── pages/                 # 页面路由
│   ├── index.tsx              # 入口文件
│   ├── index.css              # 全局样式
│   └── ...
├── src-back/                  # 后端
│   ├── index.ts               # 入口文件
│   └── ...
├── index.html                 # 前端 HTML 入口
├── vite.config.ts            # Vite 配置
├── Dockerfile.back            # 后端 Docker 镜像构建
├── docker-compose.yml         # 容器编排
└── ...
```