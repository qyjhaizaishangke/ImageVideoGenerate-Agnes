 # GOAL.md

 ## Project Goal

 Build an image/video generation web application powered by Agnes AI API.

 - **Agnes Image 2.0 Flash**: Text-to-Image / Image-to-Image / Multi-image composition / Image editing
 - **Agnes Image 2.1 Flash**: Text-to-Image / Image-to-Image, optimized for information density
 - **Agnes Video V2.0**: AI video generation

 ## Tech Stack

 - **Frontend**: Solid.js + TypeScript + Vite (port 3000)
 - **Backend**: Elysia + TypeScript (Bun runtime, port 3001)
 - **AI Service**: Agnes AI API (`https://apihub.agnes-ai.com`)
 - **Deployment**: Docker single-container (pending)

 ## Feature Plan

 ### Core Features
 - [x] **Image Generation** -- Phase 1
   - [x] Text-to-Image (base64 mode, `POST /api/image/generate`)
   - [x] Model selection (Image 2.0 Flash / Image 2.1 Flash)
   - [ ] Image-to-Image (Phase 2 -- ImageUpload base64 support)
   - [x] Result preview (idle / loading / success / error states)
 - [x] **i18n** -- English / Chinese language switching (en/zh, Paraglide-style)
 - [x] **Theme** -- Light / Dark / Auto (system preference + manual toggle)
 - [ ] **Settings page** -- Centralized theme toggle + language switcher + API key (planned)
 - [ ] **Video Generation**
   - [ ] Text-to-Video
   - [ ] Image-to-Video
   - [ ] Progress notification
   - [ ] Result preview / download

 ### Non-Functional
 - [x] Agnes Image API thin proxy (sync interface, no taskId polling)
 - [x] Base64 image transfer (`return_base64: true`)
 - [ ] File storage (local disk)
 - [ ] API documentation (OpenAPI / Swagger)
 - [ ] Containerized deployment (Docker)
 - [x] Frontend routing + Menu navigation component

 ## Project Status

 | Phase | Status | Notes |
 |-------|--------|-------|
 | Project init | Done | `src/` + `src-back/` directories, AGENTS.md / GOAL.md |
 | Frontend scaffold | Done | Solid.js + Tailwind CSS v4 + Router + Theme + Menu |
 | Backend scaffold | Done | Elysia server + CORS + route skeleton |
 | Dev plans | Done | Image page, i18n, settings page specs |
 | Image page UI | Done | PromptInput, ModelSelect, ImageUpload, SendButton, ResultDisplay |
 | Image API (backend) | Done | `POST /api/image/generate` -> Agnes `/v1/images/generations` proxy |
 | Text-to-Image E2E | Done | Full flow: prompt -> backend -> Agnes -> base64 -> frontend display |
 | i18n | Done | en/zh, LanguageProvider, 39 message keys |
 | Theme system | Done | `data-theme` attribute, manual > system, 3 modes (Light/Dark/Auto) |
 | Settings page | Pending | Plan: `plans/settings-page.md` -- theme + language + API key placeholder |
 | Image-to-Image | Pending | Phase 2 -- wire ImageUpload base64 to API |
 | Video generation | Pending | Backend route + service + frontend page |
 | Docker deployment | Pending | `Dockerfile.back` + `.dockerignore` |

 ## API Design

 ### Image Generation

 ```
 POST /api/image/generate
 ```

 Agnes Image API (`/v1/images/generations`) is synchronous -- returns `{ data: [{ b64_json }] }` directly. Backend acts as thin proxy: validates request, forwards to Agnes, returns base64 image data.

 **Request:**
 ```json
 {
   "model": "agnes-image-2.0-flash",
   "prompt": "A scenic mountain landscape at sunset",
   "size": "1024x768"
 }
 ```

 **Response (success):**
 ```json
 {
   "imageBase64": "iVBORw0KGgo..."
 }
 ```

 **Response (error):**
 ```json
 {
   "error": "AGNES_API_KEY environment variable is not set"
 }
 ```

 > Base64 mode (`return_base64: true`) is used instead of URL mode. Frontend prepends `data:image/png;base64,` before rendering.
 >
 > Image-to-Image (Phase 2) will add an optional `image` field with base64 data in the request body. See `plans/image-generate-page.md` for model-specific details.

 ### Video Generation

 TBD. Agnes Video API may be asynchronous -- will decide between polling and WebSocket when implementing.

 ## Deployment Architecture

 ### Docker (pending)

 ```
 Single container: Elysia + Bun
   / -> dist/index.html (SPA routing)
   /api/* -> API handlers
   Port: 3000
 ```

 ### Backend Static File Serving (Prod)

 1. Build frontend `src/` -> `dist/`
 2. Copy build output -> `src-back/dist/`
 3. Backend `/` serves `dist/index.html`
 4. Non-`/api/*` requests redirect to `index.html` (SPA routing)

 ### Local Development

 ```bash
 bun install              # Install dependencies
 bun run dev              # Start frontend + backend concurrently
 bun run dev:fontend      # Frontend only (Vite, port 3000)
 bun run dev:backend      # Backend only (Elysia, port 3001)
 bun run build:fontend    # Build frontend
 ```

 ## Environment Variables

 | Variable | Required | Default | Description |
 |----------|----------|---------|-------------|
 | `AGNES_API_KEY` | Yes | -- | Agnes AI API key |
 | `BACKEND_PORT` | No | `3001` | Backend server port |

 Copy `.env.example` to `.env` and set `AGNES_API_KEY` before running the app.

 ## Development Conventions

 1. **Bun as package manager**: all dependency installs, builds, scripts use `bun`
 2. **No auth**: API requires no JWT/authentication layer
 3. **Module resolution**: `nodenext` -- relative imports in `src-back/` need `.ts` extensions
 4. **CORS**: manual headers, no extra dependency
 5. **Error handling**: unified error format (`{ error: "message" }`), friendly messages
 6. **Agnes Image API**: synchronous, base64 mode; backend thin proxy
 7. **Theme**: `data-theme` attribute driven, never class-based; priority: manual > system
 8. **i18n**: All user-facing text via `import { m } from "../../i18n"` -- no createM(); use `{m.key()}` directly in JSX (reactive via module-level signal)

 ## File Structure

 ```
 ImageVideoGenerate-Agnes/
 ├── src/                       # Frontend Solid.js app
 │   ├── components/            # Reusable UI components
 │   │   └── Menu/              #   Sidebar (nav links, expand/collapse)
 │   ├── pages/                 # Page components
 │   │   ├── ImageGenerate/     #   Image generation page
 │   │   │   └── components/    #     PromptInput, ModelSelect, ImageUpload, ResultDisplay, SendButton
 │   │   ├── VideoGenerate/     #   Video generation page (placeholder)
 │   │   └── Settings/          #   Settings page (planned)
 │   │       └── components/    #     ThemeSetting, LanguageSetting, ApiKeySetting
 │   ├── i18n/                  # i18n runtime (LanguageProvider, runtime.js, m export)
│   ├── lib/                    # Shared lib (locale.ts -- Solid signal injection)
 │   ├── paraglide/             # Auto-generated messages (git-ignored, run gen:i18n)
 │   ├── routes/                # Frontend route config
 │   │   └── index.tsx
 │   ├── theme/                 # Theme system
 │   │   ├── theme.css          #   Maps MD3 tokens to Tailwind utilities
 │   │   ├── utils.ts           #   Theme helpers (setTheme, clearThemeOverride, resolveStoredTheme)
 │   │   └── themes/            #   Light/dark token definitions
 │   │       ├── light.css
 │   │       └── dark.css
 │   ├── index.tsx              # Entry (theme init + system preference listener)
 │   ├── index.css              # Global styles (bg-surface on html/body)
 │   └── Layout.tsx             # Root layout (Menu sidebar + main content)
 ├── i18n/                      # Translation source files (en.json / zh.json)
├── scripts/                    # Build scripts
│   └── gen_messages.mjs       #   Generate src/paraglide/ from i18n/*.json
├── src-back/                  # Backend Elysia server
 │   ├── index.ts               # Entry (CORS + routes, port 3001)
 │   ├── routes/                # API routes
 │   │   ├── ImageGenerateRoute.ts   # POST /api/image/generate
 │   │   └── VideoGenerateRoute.ts   # (empty stub)
 │   └── service/               # Business logic
 │       └── imageService.ts    #   Agnes Image API call (base64 mode)
 ├── plans/                     # Development plans
 │   ├── image-generate-page.md
 │   ├── i18n-paraglide-migration.md
 │   └── settings-page.md
 ├── index.html                 # HTML entry (FOWT prevention)
 ├── vite.config.ts             # Vite config (port 3000, Tailwind plugin)
 ├── package.json               # Dependencies + scripts (Bun)
 ├── tsconfig.json              # TypeScript root config
 ├── tsconfig.app.json          #   Frontend TS config
 ├── tsconfig.node.json         #   Backend TS config
 ├── .env.example               # Env template
 ├── AGENTS.md                  # Project docs
 ├── GOAL.md                    # This file
 └── .gitignore
 ```
