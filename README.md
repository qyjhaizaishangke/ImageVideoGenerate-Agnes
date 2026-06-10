# ImageVideoGenerate-Agnes

通过 Agnes AI API 生成图片和视频的网站应用

## 技术栈

- **前端**: Solid.js + TypeScript + Vite
- **后端**: Elysia + TypeScript (Bun)
- **AI**: Agnes Image 2.1 Flash / Agnes Video V2.0
- **部署**: Docker 容器化

## 项目特点

- 无鉴权 API 调用
- 单一 Elysia 容器部署（API + 静态文件）
- 前后端分离开发，统一部署

## 快速开始

### 环境要求

- [Bun](https://bun.sh/) 1.0+
- [Docker](https://www.docker.com/) 20+

### 本地开发

```bash
# 1. 克隆项目
git clone <repository>
cd ImageVideoGenerate-Agnes

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 AGNES_API_KEY

# 4. 启动服务（两个终端）
# 终端 1: 启动前端
bun run dev:frontend

# 终端 2: 启动后端
bun run dev:backend
```

### Docker 部署

```bash
# 构建镜像
bun run docker:build

# 启动服务
bun run docker:up

# 查看日志
bun run docker:logs

# 停止服务
bun run docker:down
```

### 构建生产版本

```bash
# 构建前后端
bun run build
```

## API 文档

API 文档通过 Elysia OpenAPI 自动生成，访问 `http://localhost:3000/docs`

## 项目结构

```
ImageVideoGenerate-Agnes/
├── src/                     # 前端代码 (Solid.js)
│   ├── src/
│   │   ├── components/      # UI 组件
│   │   ├── pages/           # 页面组件
│   │   └── ...
│   └── dist/               # 构建产物
├── src-back/                # 后端代码 (Elysia)
│   ├── src-back/
│   │   ├── routes/          # API 路由
│   │   ├── services/        # 业务逻辑
│   │   ├── utils/           # 工具函数
│   │   └── index.ts         # 主入口
│   └── dist/               # 构建产物
├── scripts/                 # 构建脚本
│   └── copy-dist.ts        # 复制前端产物到后端
├── Dockerfile.back          # Docker 镜像
├── docker-compose.yml       # Docker Compose 配置
├── .env.example             # 环境变量示例
└── package.json            # 项目配置
```

## 环境配置

创建 `.env` 文件：

```bash
AGNES_API_KEY=your_api_key_here
```

## 许可证

MIT