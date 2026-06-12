# AGENTS.md

## Project Structure

```
ImageVideoGenerate-Agnes/
├── src/                        # Frontend (Solid.js)
│   ├── components/             # Reusable UI components
│   │   └── Menu/               #   Sidebar navigation + theme toggle
│   ├── pages/                  # Page-level components
│   │   ├── ImageGenerate/      #   Image generation page
│   │   │   └── components/     #     Page-specific sub-components
│   │   │       ├── ImageUpload.tsx
│   │   │       ├── ModelSelect.tsx
│   │   │       ├── PromptInput.tsx
│   │   │       ├── ResultDisplay.tsx
│   │   │       └── SendButton.tsx
│   │   └── VideoGenerate/      #   Video generation page (placeholder)
│   ├── routes/                 # Frontend route definitions
│   │   └── index.tsx
│   ├── theme/                  # Theme system (Tailwind + MD3 tokens)
│   │   ├── theme.css           #   Theme entry, maps MD3 vars to Tailwind
│   │   ├── utils.ts            #   Theme switch helpers (setTheme / clearThemeOverride)
│   │   └── themes/             #   Light/dark token definitions
│   │       ├── light.css
│   │       └── dark.css
│   ├── index.tsx               # Frontend entry (theme init + mount)
│   ├── index.css               # Global styles (body bg-surface, text-on-surface)
│   └── Layout.tsx              # Root layout (Menu sidebar + <main>)
├── i18n/                       # Translation source files (en.json / zh.json)
├── scripts/                    # Build scripts
│   └── gen_messages.mjs        #   Generate src/paraglide/ from i18n/*.json
├── src-back/                   # Backend (Elysia + Bun)
│   ├── index.ts                # Server entry (CORS, routes, port 3001)
│   ├── routes/                 # API route definitions
│   │   ├── ImageGenerateRoute.ts   # POST /api/image/generate
│   │   └── VideoGenerateRoute.ts   # (empty stub)
│   └── service/                # Business logic / AI API calls
│       └── imageService.ts     #   Agnes Image API proxy (base64 mode)
├── plans/                      # Development plans
│   └── image-generate-page.md  #   Image page spec + Agnes API docs
├── index.html                  # HTML entry (FOWT prevention via blocking <script>)
├── package.json                # Dependencies + scripts (Bun)
├── vite.config.ts              # Vite config (port 3000, Tailwind plugin)
├── tsconfig.json               # TypeScript root config
├── tsconfig.app.json           #   Frontend TS config (jsx: preserve, jsxImportSource: solid-js)
├── tsconfig.node.json          #   Backend TS config
├── .env.example                # Environment variable template
├── AGENTS.md                   # Project documentation (this file)
├── GOAL.md                     # Project requirements
├── .gitignore
├── bun.lock
└── README.md
```

## Tech Specs

- **Frontend (src/)**: Solid.js + TypeScript
  - Router: Solid Router v0.16 (`src/routes/`), RouteDefinition with nested children layout
  - State: Solid Signals
  - Build: Vite (port 3000)
  - Styles: Tailwind CSS v4 + custom theme tokens (`src/theme/`)
  - Theme: `data-theme` attribute on `<html>`, priority: manual > system preference
  - Icons: lucide-solid

- **Backend (src-back/)**: Elysia + TypeScript (Bun runtime)
  - API: RESTful via Elysia route decorators
  - **Auth: none** (no JWT / authentication layer)
  - CORS: manual headers in `onRequest` hook (no `@elysiajs/cors` dependency)
  - **Static files**: `/` serves built `dist/index.html` (prod only; dev uses Vite)

- **AI Models**: via Agnes AI API (`https://apihub.agnes-ai.com`)
  - [Agnes Image 2.0 Flash](https://agnes-ai.com/doc/agnes-image-20-flash)
  - [Agnes Image 2.1 Flash](https://agnes-ai.com/doc/agnes-image-21-flash)
  - [Agnes Video V2.0](https://agnes-ai.com/doc/agnes-video-v20)

## Code Conventions

1. All code in TypeScript, strict mode (`strict: true`)
2. Frontend organized in `src/components/`, `src/pages/`, `src/routes/`
3. Backend: routes in `src-back/routes/`, business logic in `src-back/service/`
4. Sensitive info via environment variables (`.env`), never hardcoded
5. **Use Bun for all package management and scripts**
6. Build tool: Vite with Rolldown (default for Vite 8.x)
7. Theme: data-theme attribute driven, never class-based; priority: manual > system preference
8. i18n: All user-facing text via `import { m } from "../../i18n"` -- no createM() needed. Use `{m.key()}` directly in JSX (reactive via module-level Solid signal, no t() wrapper)


## Deployment Architecture

**Key point**: Backend `/` returns built `dist/index.html` in production.

Implementation:
1. Build frontend `src/` -> `dist/`
2. Copy build output to `src-back/dist/`
3. Backend `/` reads and returns `dist/index.html`
4. Non-`/api/*` paths redirect to `index.html` (SPA routing support)

## Directory Responsibilities

| Directory | Responsibility |
|-----------|---------------|
| src/ | Frontend Solid.js application source |
| src/components/ | Reusable UI components |
| src/pages/ | Page route components |
| src/i18n/ | i18n runtime (LanguageProvider, runtime.js, index.ts -- exports m, languageTag) |
| src/paraglide/ | Auto-generated translation messages (git-ignored, run `bun run gen:i18n` to regenerate) |
| src/routes/ | Frontend route config (Solid Router) |
| src/theme/ | Theme styles (Tailwind + custom CSS tokens) |
| src/theme/themes/ | Light/dark token definitions |
| src/Layout.tsx | Root layout component (Menu + page content) |
| src/index.css | Global styles (body background) |
| src-back/ | Backend Elysia server source |
| src-back/index.ts | Backend entry (CORS + routes, port 3001) |
| src-back/routes/ | API route definitions |
| src-back/service/ | Business logic / AI API calls |
| plans/ | Development plan documents |

## Deployment

### Docker (pending)

Project uses Docker containerized deployment — single container (Elysia serves API + static files):

1. **Single container**: Elysia
   - `/api/*` handles API requests
   - **`/` and all other paths return `src-back/dist/index.html`** (SPA routing)

```bash
# Build frontend (output to dist/)
bun run build:fontend
```

> `Dockerfile.back` and `.dockerignore` still need to be created.

### Local Development

```bash
# Install dependencies
bun install

# Start both frontend + backend (development mode)
bun run dev

# Frontend only
bun run dev:fontend

# Backend only
bun run dev:backend

# Build frontend
bun run build:fontend
```

### Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Concurrently start frontend (Vite) + backend (Elysia) |
| `bun run dev:fontend` | Vite dev server on port 3000 |
| `bun run dev:backend` | Elysia server on port 3001 (`bun run src-back/index.ts`) |
| `bun run build:fontend` | Build frontend to `dist/` |
| `bun run gen:i18n` | Regenerate `src/paraglide/` from `i18n/*.json` |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AGNES_API_KEY` | Yes | Agnes AI API key (get from https://agnes-ai.com) |
| `BACKEND_PORT` | No | Backend port (default: 3001) |

Copy `.env.example` to `.env` and fill in your API key before running.

## Notes

- Backend `/` serves frontend page in production; `/api/*` handles API requests
- **Agnes Image API (`/v1/images/generations`) is synchronous** — returns `{ data: [{ b64_json }] }` directly, no taskId polling needed
- Backend uses `return_base64: true` for base64 image data transfer
- Video generation: API details TBD, may be async
- File storage: local disk, served via API
- Docker deployment pending: needs `Dockerfile.back` and `.dockerignore`
- `moduleResolution: "nodenext"` — all relative imports in `src-back/` require `.ts` extensions (with `allowImportingTsExtensions: true`)