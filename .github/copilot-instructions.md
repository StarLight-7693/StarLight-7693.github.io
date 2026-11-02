# Copilot Instructions

> 本文件仅适用于 **StarLight-7693-Tools**（栖小光的工具站，仓库 `StarLight-7693/StarLight-7693.github.io`），请勿套用到同作者的其他仓库（PidanUI-Website、coldfieldobserver.github.io、StarLight-7693-New 等）。

## 项目指南

### 交互与视觉（硬性规则）

- 版式是「**顶栏 + 侧栏 + 内容 + 底栏**」：`<mdui-layout>` 包住 `TopBar` / `mdui-navigation-drawer` / `mdui-layout-main`，底栏在内容之后。**不要**把外壳换回普通的 `flex` 布局——抽屉裸用是 `position: fixed` 且从 y=0 铺满，会盖住顶栏最左的开关按钮。
- 桌面与窄屏的临界值是 **840px**（`--mdui-breakpoint-md`）：≥840 抽屉推挤内容、<840 覆盖 + 遮罩。**不要**另起一套断点值，`_tokens.scss` 的 `$bp-md: 840px` 是唯一来源。
- 视觉语言由 MDUI（Material Design 3）决定：圆角、阴影、状态层都用组件自带能力。**本项目没有 Tailwind**，不要引入工具类写法或第二个 UI 框架。
- 悬浮 / 按下反馈只用 MDUI 的状态层（`--mdui-state-*`）与已有的描边、阴影，**不要**新增大位移、旋转、缩放入场等夸张效果。
- 动效缓动曲线取自 `_tokens.scss`，**不要**在组件里散写 `cubic-bezier`。

### Web Components 与 MDUI（硬性规则）

- **禁止在任何模块顶层 `import 'mdui'`**。mdui 入口会 `class X extends HTMLElement` + `customElements.define`，而 `output: 'export'` 的构建在 Node 里跑，没有 `HTMLElement`，顶层 import 会让 `next build` 直接失败。只能像 `components/mdui/MduiProvider.tsx` 那样在 `useEffect` 里动态 `import('mdui')`；`snackbar()` 同理（见 `lib/toast.ts`）。
- **布尔属性不要走 JSX**（`open` / `disabled` / `active` / `full-height`…）。React 会把 `false` 序列化成字符串 `"false"`，而 Web Components 的布尔转换只看「属性存在与否」→ 反而变成 `true`。统一用 `ref` 命令式赋值（`el.open = true`），或写 `cond ? undefined : true`。
- **新增 MDUI 标签要同时改两处**：`MduiProvider` 的 `TAGS`（`customElements.whenDefined` 兜底）与 `styles/_fouc.scss` 的 `$mdui-tags`（`:not(:defined)` 隐藏）。少改一处，新组件在注册完成前会以裸文本形式闪出来。
- **`mdui.css` 必须先于 `globals.scss` 引入**（`app/layout.tsx` 里按顺序 import）。后声明者胜，顺序反了 `_palette.scss` 的主题色覆写就压不住 MDUI 默认的紫。
- **文本框不要用受控 `value`**。真实 `<textarea>` 在 shadow root 里，React 拿不到：读值靠监听宿主的 `input` 事件读 `el.value`，写值靠直接赋值且「值不同才写」（否则光标跳到末尾）。统一封装在 `components/mdui/MduiTextField.tsx`，新输入框复用它。

### 禁止注入式增强（硬性规则）

- **禁止在 `public/` 下放 JS / CSS，再通过 `app/layout.tsx` 的 `<link>` / `<script>` 注入来做功能增强。** 需要交互就写 React 组件 / `src/hooks/`，需要样式就写进 `src/styles/` 的对应分片。`public/` 只放原样发给浏览器的图片（`images/favicon.svg`、`images/friendlinkicon/*`）。
- 为什么（同作者 PidanUI 官网的返工教训：先做了一套 `public/custom/{custom.css,custom.js}` 注入层，随后整层拆回主站代码）：
  - **客户端路由不接管**：注入脚本只在首次加载扫一遍 DOM，站内跳转后新增的页面不会被处理。
  - **绕开样式分层**：`public/` 里的 CSS 不参与 `globals.scss` 的 `@use` 顺序，只能靠 `!important` 与特异性堆叠去压既有规则。
  - **不受 lint 与构建覆盖**：`public/` 是原样拷贝，`oxlint`、`prettier`、`tsc` 都检查不到，等于在受管代码之外开了一个无人守的口子。

### 一致性

- **工具注册表只有一处数据源**：`src/data/tools.ts`。侧栏分组、首页卡片、`generateStaticParams`、`generateMetadata`、404 判定、图标名全部读它。**不要在组件里另写一份工具清单或路径前缀**。
- 站内链接一律用 `toolPath()`（`trailingSlash: true` 下必须带尾斜杠）并走 Next 的 `Link`；**严禁裸 `<a href>` 指向站内路由**——静态导出后每次跳转都会整页刷新。
- 所有工具页共用同一套外观：`tool-page > header.tool-header` + `ToolBody`，输入 / 输出都放在 `_tool.scss` 定义的 `.tool-panel` 里。**不要**给某个工具单独做一套版式。
- 工具结果统一是 `ToolResult` 的三种状态（`success` / `error` / `''` 未计算），见 `hooks/useBase64.ts` 的 `ResultType`。**不要**自造第二套结果呈现。
- 图标名集中在 `src/data/icons.ts` 的 `ICONS`；组件里**不要**散写 `name="..."` 字符串——字体缺某个连字时页面会直接显示英文名（如 `more_vert`），集中管理才便于一次性排查。
- 文案、链接、站点信息集中在 `src/data/{site,tools,friends,icons}.ts`。**改内容只改数据文件，不动组件。**

## 项目概况

| 项       | 值                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------- |
| 定位     | 纯前端在线工具集合站，`output: 'export'` 静态导出（SSG），部署于 GitHub Pages                   |
| 线上地址 | https://www.skystarlight.top（`trailingSlash: true`，站内 URL 一律带尾斜杠）                    |
| 技术栈   | Next.js `16.4.3`（App Router + Turbopack）+ React `19.3` + TypeScript `7.0.2` + SCSS + MDUI `2` |
| 包管理器 | pnpm（`packageManager: pnpm@12.11.2`），CI 用 `pnpm install --frozen-lockfile`                  |
| 发布流程 | 推送到 `main` → `.github/workflows/deploy.yml` 构建并部署 `out/`                                |
| 许可证   | MIT                                                                                             |

## 常用命令

```bash
pnpm dev           # 本地开发（默认 http://localhost:3000）
pnpm build         # 生产构建 = next build，产物在 out/
pnpm typecheck     # tsc --noEmit
pnpm lint          # oxlint（不是 ESLint）
pnpm format:check  # prettier --check
pnpm format        # prettier --write
```

- **提交前这四条必须全绿**：`typecheck` / `lint` / `format:check` / `build`（`pnpm build` 会真的做类型检查，副作用是也能发现 `tsc` 单独跑时漏掉的 Next 相关类型问题）。
- `output: 'export'` **只在 `NODE_ENV=production` 时开启**（见 `next.config.ts`）：dev 下开 export 会让 Next 拿「已生成路径」比对每次导航，动态段容易被误判成 404。所以本地复现线上行为要用 `pnpm build` + 静态服务器，不要指望 `pnpm dev`。
- 若 `pnpm build` 报错但 `pnpm typecheck` 通过，先删 `.next/` 与 `tsconfig.tsbuildinfo` 再试——增量缓存偶尔会留住旧的路由类型。

## 目录结构

```
src/
├─ app/                              # App Router
│  ├─ layout.tsx                     # 外壳 + metadata + 主题首帧脚本 + 字体 preload
│  ├─ page.tsx                       # 首页：Hero / ToolGrid / FriendLinks
│  ├─ not-found.tsx                  # 404（保留站点外壳）
│  └─ tools/[slug]/page.tsx          # 工具页：generateStaticParams 全量生成
├─ components/
│  ├─ layout/                        # AppShell / TopBar / SideNav / ThemeToggle / AboutDialog / SiteFooter
│  ├─ mdui/                          # MduiProvider（动态注册）/ MduiTextField（受控桥）
│  ├─ home/                          # Hero / ToolGrid / FriendLinks
│  └─ tools/                         # ToolBody（slug→组件）/ ToolResult / 5 个工具
├─ data/                             # site / tools（唯一注册表）/ friends / icons
├─ hooks/                            # 工具逻辑 + useDrawerSwipe（纯函数式，不依赖 UI）
├─ lib/                              # theme / copy / toast
├─ styles/                           # globals.scss + 9 个分片（见「样式约定」）
└─ types/mdui.d.ts                   # MDUI 的 JSX 类型声明
public/images/                       # favicon 与友链头像（只放图片）
```

## 路由与页面机制

- **路由 = 文件**：`app/page.tsx` 是 `/`，`app/tools/[slug]/page.tsx` 是 `/tools/<slug>/`。**没有** `pages/` 目录、也没有 content 集合。
- `output: 'export'` 要求动态段给出全部路径：`generateStaticParams()` 从 `TOOL_SLUGS` 产出。**新增工具必须让 slug 进 `data/tools.ts`**，否则构建期就没有这条路由。
- 未登记的 slug 走 `notFound()`，产物里落 `404.html`；`generateMetadata` 里也要独立判空，两个函数不共享上下文。
- `trailingSlash: true` → `/tools/base64/` 输出 `out/tools/base64/index.html`。`next.config.ts` 里的 `images.unoptimized` 是静态导出必需的（没有图片优化服务端）。
- 页面 `<Metadata>`（title 模板、openGraph、icons）在 `app/layout.tsx` 集中定义，工具页只覆盖 `title` / `description` / `keywords` / `canonical`。

## 外壳与滚动

- **滚动根是 `.app-scroll`，不是 `window`，也不是 `mdui-layout-main`**：`mdui-layout.app-layout[full-height]` 锁成 `100dvh`，`.app-main` 的 `overflow` 被压成 `hidden` 且 `min-height: 0`（否则 flex 子项收缩不了、内容把布局撑高），真正滚动的是内层 `.app-scroll`（`overflow-y: auto`）。
- 为什么滚动条要下移一层：`mdui-layout-main` 自带 `padding-top`（顶栏高度），overflow 放在它身上时滚动条会从视口 y=0 开始，顶部那一段正好被 `position: absolute` 的顶栏盖住。
- 任何滚动监听 / `scrollIntoView` 都要显式指向 `.app-scroll` 或对应的 `scroll-target`（顶栏就是靠 `scroll-target` 拿到主区的），**不要**监听 `window`。
- 顶栏真实高度由 `AppShell` 的 `ResizeObserver` 写进 `--app-bar-h`：MDUI 组件首次渲染高度是 0，**不要**写死 `64px`。抽屉让位、主区留白都读这个变量。
- 抽屉不传 `modal` 属性：MDUI 的规则是「屏宽 < 840px 时无视 `modal` 强制遮罩」，正好实现「桌面推挤 / 窄屏覆盖」两套行为。窄屏抽屉要让开顶栏，靠 `_sidebar.scss` 用同权重规则压回 MDUI 的 `!important`。

## 数据与内容

- `src/data/tools.ts` —— `TOOLS`（slug / name / desc / category / icon / keywords）+ `TOOL_CATEGORIES` + `TOOL_SLUGS` + `getTool()`。**这是唯一注册表**。
- `src/data/site.ts` —— 站名、描述、作者、许可、技术栈、`url`、`repoUrl`；`toolPath()` 拼站内链接。
- `src/data/friends.ts` —— 友链（名称 / 描述 / 头像 / 链接），头像放 `public/images/friendlinkicon/`。
- `src/data/icons.ts` —— `ICONS` 常量表（Material Icons 连字名，snake_case）。
- `src/types/mdui.d.ts` —— MDUI 标签的 JSX 类型；新增用到的组件标签时要在这里补属性声明。

## 工具页开发

新增一个工具只有三处：

1. `data/tools.ts` 的 `TOOLS` 加一条（slug / 名称 / 描述 / 分类 / 图标 / 关键词）；
2. `components/tools/ToolBody.tsx` 的 `REGISTRY` 加一行 `slug: 组件`；
3. 写组件（`components/tools/XxxTool.tsx`）+ 逻辑（`hooks/useXxx.ts`）。

约定：

- **逻辑放 hook，组件只负责版式**。hook 返回 `{ 输入状态, setter, result, resultType, 动作… }`，错误信息用中文可读句子写进 `result` 并把 `resultType` 置 `'error'`，不要 `throw` 到组件层。
- 编解码一律按 UTF-8 处理：`TextEncoder` / `TextDecoder`，需要严格时用 `TextDecoder('utf-8', { fatal: true })`。**不要**再用已废弃的 `escape` / `unescape`（只处理 Latin-1，孤立代理项会静默产出乱码）。
- 结果展示走 `ToolResult`；复制走 `lib/copy.ts`；提示走 `lib/toast.ts`（内部是 MDUI `snackbar`，只在客户端动态 import）。
- 每个工具都要有 `placeholder` 与 `helper` 文案，空输入时给出明确提示而不是静默无反应。

## 样式约定

`src/styles/globals.scss` 是唯一入口，`@use` 顺序有语义，**不要随意调整**：

| 文件            | 职责                                                       |
| --------------- | ---------------------------------------------------------- |
| `_tokens.scss`  | 设计令牌：断点、尺寸、圆角、动效曲线（**不含颜色**）       |
| `_palette.scss` | 主题色静态覆写 `--mdui-color-primary-*`（浅色 / 深色两套） |
| `_fonts.scss`   | 字体 `@font-face` 与 `mdui-icon` 字体族绑定                |
| `_fouc.scss`    | 未注册组件的可见性控制（`:not(:defined)` + `.mdui-ready`） |
| `_base.scss`    | 盒模型、重置、滚动条等全局基线                             |
| `_layout.scss`  | 外壳布局：顶栏、侧栏、内容区、滚动容器                     |
| `_sidebar.scss` | 侧栏分组与抽屉（`::part(panel)` 自己滚）                   |
| `_content.scss` | 首页与工具页的通用版式                                     |
| `_tool.scss`    | 工具页专属：输入 / 输出面板、结果区、复制的按钮样式        |

- **颜色只用 MDUI 的 CSS 变量**（`--mdui-color-*`），`_tokens.scss` 里不写死色值；SCSS 变量只放「不随主题变化」的静态值。
- **主题色是静态覆写**（`_palette.scss`），**不要**在运行时调 `setColorScheme()`：它只能在客户端跑，首帧会先紫后蓝。
- **盒模型由 `_base.scss` 的 `* { box-sizing: border-box }` 统一设定**：MDUI 的全局样式里一条 `box-sizing` 都没有（组件各自在 shadow DOM 内自理），漏掉它会让「`width: 100%` + 左右 padding」的元素按 content-box 撑出横向滚动条。
- 侧栏在 `::part(panel)` 上自己滚（`height: 100%` + `overflow-y: auto`）：不给高度会被 `:host` 的 `overflow: hidden` 裁掉，条目多时看不到底部。
- 类名用语义化的 `app-*` / `tool-*` / `hero-*`，与分片文件对应；**不要**在 TSX 里写内联 `style` 做版式（动态量如 `--app-bar-h` 除外）。
- 注释风格与现有文件一致：中文、`// ====` 分节横幅，只解释「为什么」，不复述代码。

## 主题与首帧

- 主题只有两态（浅色 / 深色），落地点是 `<html>` 上的 `mdui-theme-light` / `mdui-theme-dark` 类，并同步 `style.colorScheme`（滚动条与原生控件才会一起变）。逻辑在 `src/lib/theme.ts`，storage key 是 `qxg-tools-theme`（**与旧站隔离，不要复用旧 key**）。
- 首帧防闪靠 `THEME_BOOTSTRAP` 内联脚本在 `<head>` 里同步执行。`app/layout.tsx` 里**生产与 dev 是两条路**：
  - 生产：静态导出由构建期 SSR 生成 HTML，浏览器解析即执行，零闪；
  - dev：改用 `next/script` 并让 SSR 默认 `mdui-theme-auto`，因为 React 19 会警告并跳过组件里的 `<script>`，dev 下内联会红一片控制台。
- **不要**把生产改成 `next/script`：它的 `beforeInteractive` 在 App Router 里只是把脚本推进 `self.__next_s` 队列，要等 async chunk 才执行，深色用户会先看到一闪白屏。
- 生产环境 React 不接管 `<html className>`（否则每次重渲染都会把类冲回 SSR 时的空值），`suppressHydrationWarning` 是刻意加的。

## 字体与图标

三类字体全部走 jsDelivr CDN，**仓库不保留任何字体文件**（见 `_fonts.scss`）：

- **HarmonyOS Sans SC**（界面）—— 400 / 500 / 700 三个字重，unicode-range 分片，`<link>` 在 `app/layout.tsx`；
- **Cascadia Code**（代码 / 输入输出）—— Windows 自带，其余平台必须靠 webfont 兜底，否则会掉到 `monospace` 导致中文行高错乱；
- **Material Icons**（图标）—— `@font-face` 单独声明并配 `font-display: block`，避免字形未到时先渲染成 `more_vert` 这类英文单词。

图标是 `<mdui-icon name={ICONS.xxx}>` 的连字字体，**不是**内联 SVG，也没有 Iconify。首屏会有一次中文 FOUT，这是分片中文字体的固有代价，**不要**为了消闪把整页藏起来。

## 无障碍与降级

- 图标一律 `aria-hidden="true"`，可点元素补 `aria-label`；抽屉/对话框的焦点陷阱、ESC、遮罩由 MDUI 负责，**不要**自己再实现一套滚动锁。
- 依赖 JS 的视觉（未注册组件）用 `visibility: hidden` 而不是 `display: none`——不改变布局，隐藏期间页面不会跳；注册完成或超时 3s 后由 `.mdui-ready` 无条件放行。
- `@media (scripting: none)` 分支必须保持可用：禁用脚本时 `whenDefined` 永远不 resolve，要直接放行。
- 新增交互时确认键盘可达（Tab 顺序、Enter/Space 触发），移动端点击区域不小于 44px。

## 配置与类型（易踩坑）

- `tsconfig.json` 开了 `strict` + `noUnusedLocals` + `noUnusedParameters` + `isolatedModules`，路径别名 `@/*` → `src/*`。**不要**为了图省事关掉这几项。
- **TypeScript 7 是原生（Go）实现，包里只有 `tsc` 可执行文件，不提供旧版编译器 API**（`require('typescript').createProgram` 为 `undefined`）。本项目类型检查全走命令行（`tsc --noEmit` 与 `next build` 的自检阶段），因此不受影响；但**接任何依赖 TS API 的工具前先想清楚**——例如 typescript-eslint 会直接拒绝 TS 7，官方做法是用 `@typescript/typescript6` 别名共存。
- **lint 用 oxlint，不是 ESLint**（配置见 `.oxlintrc.json`，只开 `react/rules-of-hooks` 与 `react/only-export-components`）。不要新增 `eslint.config.*` 制造第二套规则。
- 排版用 Prettier（`.prettierrc`：单引号 / `printWidth: 100` / `trailingComma: all` / 分号必写）。`out/`、`.next/`、`pnpm-lock.yaml`、`next-env.d.ts` 在 `.prettierignore` 里。
- `next-env.d.ts` 由 Next 生成、已在 `.gitignore`，**不要手动编辑或提交**。
- 需要 `'use client'` 的组件只有两类：用了 hooks / 事件的，或直接渲染 MDUI 标签的（`AppShell`、各 `Tool*`、`MduiTextField`）。页面级 `page.tsx` 保持 Server Component，不要整页加 `'use client'`。

## Git 与协作

- 分支命名 `feat/<简述>` / `fix/<简述>` / `docs/<简述>`；同一主题的改动留在同一分支。
- 提交信息用中文，`feat:` / `fix:` / `style:` / `refactor:` / `chore:` / `docs:` 前缀；正文说清「为什么这么做、影响面是什么」，不要复述 diff。
- **每个提交都要能独立 `pnpm build` 通过**（`output: 'export'` 下任何路由缺失都会让构建失败）。
- 依赖变更必须同时提交 `pnpm-lock.yaml`（CI 用 `--frozen-lockfile`）；新增需要构建脚本的依赖要在 `pnpm-workspace.yaml` 的 `allowBuilds` 里放行（当前只有 `@parcel/watcher`）。
- **CI 顺序：`.github/workflows/lint.yml`（Prettier + oxlint + tsc）先跑，`deploy.yml` 的 `build` 用 `needs: quality` 卡在它后面**——检查不过就不构建、不部署。`lint.yml` 以可复用工作流（`workflow_call`）被调用，所以 `push` 触发里要排除 `main`，否则同一次推送会跑两遍。
- 不要提交产物与临时文件：`out/`、`.next/`、`tsconfig.tsbuildinfo`、`next-env.d.ts`、`*.log`。
- 视觉改动请附截图（浅色 + 深色、桌面 + ≤840px 各一组）。

## 提交前自检清单

1. `pnpm typecheck`、`pnpm lint`、`pnpm format:check`、`pnpm build` 全绿。
2. `out/` 里 8 个页面齐全：`index.html`、`404.html`、`tools/{base64,unicode,url,timestamp,eggy-map-text}/index.html`。
3. 浏览器实看：`/`、五个工具页、随便一个不存在的 `/tools/xxx/`（应为 404 且保留外壳）。
4. 宽度 1440 / 840 / 839 / 375 各过一遍：抽屉推挤 ↔ 覆盖切换、窄屏边缘右滑拉出、抽屉内左滑收回、`--app-bar-h` 与实际顶栏高度一致、无横向滚动条。
5. 内容区滚动时顶栏与侧栏不动；滚动条从顶栏下边缘开始（不是视口顶端）。
6. 主题切换正常、首帧不闪（深色浏览器刷新一遍），图标没有显示成英文连字名。
7. 站内跳转不整页刷新（Network 里不应出现 document 请求），URL 带尾斜杠。
8. 五个工具各跑一遍正常输入 + 一段非法输入，错误提示可读、复制可用。
9. 新增 MDUI 标签已同时补进 `MduiProvider` 的 `TAGS` 与 `_fouc.scss` 的 `$mdui-tags`。
10. 没有提交 `out/`、`.next/`、`tsconfig.tsbuildinfo` 或临时文件。
