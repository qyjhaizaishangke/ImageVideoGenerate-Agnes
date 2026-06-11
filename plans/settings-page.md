 # Settings 页面开发计划

 ## 概述

 新增设置页面，将主题切换和语言选择从 Menu 侧边栏迁移至独立的 Settings 页面集中管理。
 后续 API Key 配置也将迁移至此（本次不实现）。
 同时提取公用 `Select` 组件，消除 `ModelSelect` 和 `LanguageSwitcher` 中的重复 `<select>` 样板代码。

 ---

 ## 页面布局

 ```
 +-----------------------------------------------------------------+
 | Menu  |                                                         |
 |       |    Settings                                            |
 |       |                                                         |
 |       |    +-------------------------------------------------+  |
 |       |    |  Appearance                                      |  |
 |       |    |  [Light] [Dark] [Auto]                          |  |
 |       |    +-------------------------------------------------+  |
 |       |    |                                                 |  |
 |       |    +-------------------------------------------------+  |
 |       |    |  Language                                        |  |
 |       |    |  [English v]                                    |  |
 |       |    +-------------------------------------------------+  |
 |       |    |                                                 |  |
 |       |    +-------------------------------------------------+  |
 |       |    |  API Key (coming soon)                          |  |
 |       |    |  [●●●●●●●●●●●●●●]  (disabled, placeholder)      |  |
 |       |    +-------------------------------------------------+  |
 |       |                                                         |
 +-----------------------------------------------------------------+
 ```

 - 页面内容区 `max-w-3xl mx-auto` 与现有页面风格一致
 - 设置项使用分组卡片布局，每组一个 `bg-surface-container rounded-corner-xl` 卡片
 - API Key 区域为占位状态（disabled input + "Coming soon" 标签），本次不实现后端对接

 ---

 ## 组件树

 ```
 src/pages/Settings/
 +-- index.tsx                  # 页面容器：组合各设置区块
 +-- components/
     +-- ThemeSetting.tsx       # 主题设置：三态切换 (Light / Dark / Auto)
     +-- LanguageSetting.tsx    # 语言设置：使用公用 Select 组件
     +-- ApiKeySetting.tsx      # API Key 设置（占位，disabled 态）

 src/components/                # 公用组件
 +-- Select.tsx                 # 公用下拉选择器（新增）
     +-- Menu/
         +-- index.tsx          # 现有
 ```

 ---

 ## 公用组件: `Select.tsx`

 ### 动机

 `ModelSelect.tsx` 和 `LanguageSwitcher.tsx` 中存在高度重复的 `<select>` 样板代码：

 | 差异点 | ModelSelect | LanguageSwitcher |
 |--------|-------------|------------------|
 | 前置图标 | 无 | Globe (left) |
 | 后置图标 | ChevronDown (right) | ChevronDown (right) |
 | options 来源 | `MODEL_OPTIONS` 常量 | `LANGUAGES` 常量 |
 | disabled | 有 | 无 |
 | i18n 解析 | 组件内部 `m[labelKey]()` | 组件内部 `m[labelKey]()` |

 提取公用 `Select` 后，两侧差异仅剩 options 数据和图标配置，`<select>` / 样式 / 交互逻辑不再重复。

 ### 接口设计

 ```typescript
 interface SelectOption {
   value: string;
   label: string;        // 调用方负责 i18n 解析，组件只渲染纯字符串
 }

 interface SelectProps {
   value: Accessor<string>;
   onChange: (value: string) => void;
   options: SelectOption[];           // 静态数组或 derived signal
   disabled?: Accessor<boolean>;
   leadingIcon?: Component;           // 前置图标组件 (e.g. Globe)，不传则无
   class?: string;                    // 外层容器额外 class
 }
 ```

 **设计原则**:
- `label` 是纯字符串，i18n 解析由调用方完成。这避免了 `Select` 组件依赖 `createM()`，保持其纯粹无副作用。
- `leadingIcon` 为可选的 lucide 图标组件，渲染在 select 左侧。
- ChevronDown 后置图标内置在组件中，不可配置（所有场景都需要）。
- `disabled` 可选，不传时为 `false`。

 ### 外观

 ```
 +------------------------------------------+
 |  container: relative inline-flex          |
 |  +----+  +----------------------------+  |
 |  | ico|  | [select]            [v]   |  |
 |  +----+  +----------------------------+  |
 +------------------------------------------+
 ```

 - 容器: `relative inline-flex items-center`
 - select: `h-9 bg-transparent text-on-surface-variant text-label-md border border-outline-variant rounded-corner-sm hover:bg-surface-container-highest focus:border-primary focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`
 - 左 padding: 有 leadingIcon 时 `pl-7`，否则 `pl-2`
 - 右 padding: 统一 `pr-7`（给 ChevronDown 留空间）
 - 前置图标定位: `absolute left-1.5 w-4 h-4 text-on-surface-variant pointer-events-none`
 - 后置图标定位: `absolute right-1.5 w-4 h-4 text-on-surface-variant pointer-events-none`

 ### 使用示例

 **ModelSelect 重构后**:
 ```tsx
 const m = createM();
 const modelOptions = () => [
   { value: "agnes-image-2.0-flash", label: m.model_image20Flash() },
   { value: "agnes-image-2.1-flash", label: m.model_image21Flash() },
 ];

 <Select
   value={props.value}
   onChange={props.onChange}
   options={modelOptions()}
   disabled={props.disabled}
 />
 ```

 **LanguageSetting 重构后**:
 ```tsx
 const m = createM();
 const langOptions = () => [
   { value: "en", label: m.lang_en() },
   { value: "zh", label: m.lang_zh() },
 ];

 <Select
   value={language}
   onChange={setLanguage}
   options={langOptions()}
   leadingIcon={Globe}
 />
 ```

 ---

 ## 组件规格

 ### 1. `ThemeSetting.tsx`

 **功能**: 主题三态切换 — 浅色 / 深色 / 跟随系统

 **三态说明**:
 | 状态 | 含义 | 实现 |
 |------|------|------|
 | Light | 强制浅色 | `setTheme("light")` |
 | Dark  | 强制深色 | `setTheme("dark")` |
 | Auto  | 跟随系统 | `clearThemeOverride()` → 使用 `matchMedia` 监听 |

 **UI 形态**: Segmented control（分段控制器），三个选项并排

 **外观**:
 - 分段控件: `bg-surface-container-highest rounded-corner-full p-1 inline-flex`
 - 每个选项: `px-5 py-2 rounded-corner-full text-label-lg`，选中态 `bg-primary text-on-primary`，非选中 `text-on-surface-variant hover:bg-surface-container-high`
 - 三个选项: Sun 图标 (Light) / Moon 图标 (Dark) / Monitor 图标 (Auto)

 **当前主题检测**:
 - 读取 `document.documentElement.dataset.theme` 判断当前是 light/dark
 - 检查 `localStorage` 是否有 `app-theme` 键来判断是手动选择还是跟随系统
 - 若 localStorage 有值 → 对应 Light/Dark；无值 → Auto

 **交互**:
 - 点击 Light → `setTheme("light")`
 - 点击 Dark → `setTheme("dark")`
 - 点击 Auto → `clearThemeOverride()` — 清除 localStorage 并跟随系统

 ### 2. `LanguageSetting.tsx`

 **功能**: 使用公用 `Select` 组件实现语言切换，放置在设置卡片中

 **外观**:
 - 标签 "Language" + Select 组件
 - 使用 `Globe` 作为 leadingIcon
 - i18n options 由调用方通过 `createM()` 解析后传入

 **实现**: 不再移动 `LanguageSwitcher`，而是新建 `LanguageSetting` 直接使用 `Select`。旧的 `LanguageSwitcher.tsx` 在迁移完成后删除。

 ### 3. `ApiKeySetting.tsx` — 占位

 **功能**: 预留 API Key 输入区，本次为 disabled 占位状态

 **外观**:
 - 标签 "API Key" + 输入框 `bg-surface-container-highest text-on-surface-variant opacity-50`
 - 输入框右侧 "Coming soon" 标签（`text-label-sm bg-tertiary-container text-on-tertiary-container rounded-corner-sm px-2 py-0.5`）
 - 输入框 `disabled`，placeholder: "●●●●●●●●●●●●●●"
 - 整组卡片 `opacity-70` 暗示不可用状态

 **未来实现**:
 - 读取环境变量或后端 API 获取当前 API Key
 - 支持修改后保存到后端 / 环境变量

 ---

 ## Menu 侧边栏改动

 **移除**: 主题切换按钮 + LanguageSwitcher（从底部控件区删除）

 **新增**: Settings 导航项（`/settings` 路由链接）
 - 图标: `Settings` (lucide-solid)，齿轮 icon
 - 定位: 导航区下方，与 Image/Video Generate 同级
 - 样式: 与现有 nav 项一致（`navClass` 函数样式）
 - i18n key: 新增 `nav_settings` → "Settings" / "设置"

 **底部控件区保留**: 折叠/展开按钮（`PanelLeftClose` / `PanelLeft`）

 ---

 ## 路由改动

 在 `src/routes/index.tsx` 中新增路由:
 ```typescript
 import Settings from "../pages/Settings";

 // 在 children 数组中添加:
 { path: "/settings", component: Settings },
 ```

 ---

 ## i18n 新增 key

 | Key | English | 中文 |
 |-----|---------|------|
 | `nav_settings` | Settings | 设置 |
 | `settings_appearance` | Appearance | 外观 |
 | `settings_language` | Language | 语言 |
 | `settings_apiKey` | API Key | API 密钥 |
 | `settings_apiKeyPlaceholder` | ●●●●●●●●●●●●●● | ●●●●●●●●●●●●●● |
 | `settings_comingSoon` | Coming soon | 即将推出 |
 | `settings_light` | Light | 浅色 |
 | `settings_dark` | Dark | 深色 |
 | `settings_auto` | Auto | 跟随系统 |
 | `menu_settings` | Settings | 设置 |

 ---

 ## 实施步骤

 | # | 任务 | 文件 | 说明 |
 |---|------|------|------|
 | 1 | 更新 GOAL.md + 创建本计划 | `GOAL.md`, `plans/settings-page.md` | 已完成 |
 | 2 | 创建公用 `Select.tsx` | `src/components/Select.tsx` | 提取通用 select 组件 |
 | 3 | 重构 `ModelSelect` 使用 `Select` | `src/pages/ImageGenerate/components/ModelSelect.tsx` | 删除内联 select 样板 |
 | 4 | 新增 i18n keys | `src/paraglide/messages/_index.js` | 10 个新 key，中英双语 |
 | 5 | 创建 `ThemeSetting.tsx` | `src/pages/Settings/components/ThemeSetting.tsx` | 三态分段控件 |
 | 6 | 创建 `ApiKeySetting.tsx` | `src/pages/Settings/components/ApiKeySetting.tsx` | 占位 disabled 态 |
 | 7 | 创建 `LanguageSetting.tsx` | `src/pages/Settings/components/LanguageSetting.tsx` | 使用 Select + Globe |
 | 8 | 创建 `Settings/index.tsx` | `src/pages/Settings/index.tsx` | 组合各设置卡片 |
 | 9 | 添加 `/settings` 路由 | `src/routes/index.tsx` | 导入 + 路由定义 |
 | 10 | 修改 Menu：移除主题/语言，新增 Settings 导航 | `src/components/Menu/index.tsx` | 删除 toggle + selector 逻辑，添加 nav 项 |
 | 11 | 删除旧 `LanguageSwitcher` | `src/components/LanguageSwitcher.tsx` | 迁移后清理 |
 | 12 | 构建验证 | — | `bun run build:fontend` 确保无编译错误 |

 ---

 ## 样式约定

 - **设置卡片**: `bg-surface-container rounded-corner-xl p-5`，卡片间 `gap-4`
 - **卡片标题**: `text-title-md text-on-surface mb-4`
 - **分段控件**: `bg-surface-container-highest rounded-corner-full p-1 inline-flex gap-0.5`
 - **分段选项**: `px-5 py-2 rounded-corner-full text-label-lg cursor-pointer transition-colors`
 - **Select 组件**: 见上方公用组件外观规格
 - **禁用区域**: 整卡 `opacity-70`，输入框 `bg-surface-container-highest disabled:cursor-not-allowed`
 - **Coming soon 标签**: `bg-tertiary-container text-on-tertiary-container rounded-corner-sm px-2 py-0.5 text-label-sm`

 ---

 ## 文件清单

 ```
 src/pages/Settings/
 +-- index.tsx                           # 新增
 +-- components/
     +-- ThemeSetting.tsx                # 新增
     +-- LanguageSetting.tsx             # 新增（使用 Select 组件）
     +-- ApiKeySetting.tsx              # 新增

 src/components/
 +-- Select.tsx                         # 新增（公用下拉选择器）
 +-- LanguageSwitcher.tsx               # 删除（迁移至 Settings/components/LanguageSetting）

 src/components/Menu/
 +-- index.tsx                          # 修改（移除 theme/lang + 新增 Settings nav）

 src/pages/ImageGenerate/components/
 +-- ModelSelect.tsx                    # 修改（重构为使用 Select 组件）

 src/routes/
 +-- index.tsx                          # 修改（新增 /settings 路由）

 src/paraglide/messages/
 +-- _index.js                          # 修改（新增 10 keys + 中英翻译）
 ```
