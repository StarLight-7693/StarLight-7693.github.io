<div align="center">

# StarLight-7693.github.io

![Last Commit](https://img.shields.io/github/last-commit/StarLight-7693/StarLight-7693.github.io?label=Last%20Commit)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?logo=Next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=React&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-sass%201.101-CF649A?logo=sass&logoColor=white)](https://sass-lang.com/)
[![MDUI](https://img.shields.io/badge/MDUI-2.1.5-757575?logo=materialdesign&logoColor=white)](https://www.mdui.org/)
![License](https://img.shields.io/badge/License-MIT-blue)
[![GitHub](https://img.shields.io/badge/GitHub-StarLight--7693-blue?logo=github&logoColor=F5F5F5)](https://github.com/StarLight-7693)

栖小光的工具站：一堆纯前端小工具，输入的内容不上传服务器。使用 Next.js 16 + React 19 + TypeScript + SCSS + MDUI 构建，`output: 'export'` 静态生成（SSG）后部署到 GitHub Pages，线上地址 <https://www.skystarlight.top>。

</div>

## 网站结构

版式是「顶栏 + 侧栏 + 内容 + 底栏」，内容区是唯一的滚动容器。

- **顶栏**：品牌 + 主题切换 + 关于（`TopBar`）。窄屏（≤840px）左侧换成汉堡按钮，点开抽屉式侧栏。
- **侧栏**：按分类分组列出全部工具（编码转换 / 时间处理 / 游戏工具），当前工具高亮；窄屏收成抽屉，支持跟手滑动手势（`useDrawerSwipe`）。
- **首页**：`/`，Hero 简介 → 工具矩阵（`ToolGrid`）→ 友情链接（`FriendLinks`）。
- **工具页**：`/tools/<slug>/`，左侧输入、右侧结果，一键复制；五个工具全部是纯前端计算，`generateStaticParams` 在构建期一次生成。
  - `/tools/base64/` —— 文本与 Base64 互转，UTF-8 优先，中文与 emoji 可安全往返；
  - `/tools/unicode/` —— 按码点处理，支持 `\u4F60` 与 `\u{1F600}`；
  - `/tools/url/` —— 整串 URI 与 URI 组件两种粒度；
  - `/tools/timestamp/` —— 秒 / 毫秒自动识别，本地时间与 UTC 对照；
  - `/tools/eggy-map-text/` —— 从游戏分享文本里提取地图名与地图码，生成标准文案。
- **底栏**：站点说明、技术栈与仓库入口。
- **404**：`not-found.tsx`，保留站点外壳。

## 技术栈

- [Next.js 16](https://nextjs.org/)（App Router，`output: 'export'` 静态导出；`trailingSlash: true` 走目录式 URL）
- [React 19](https://react.dev/)
- [TypeScript 7.0.2](https://www.typescriptlang.org/)（原生 tsc；`tsc --noEmit` 与 `next build` 都会做类型检查）
- [MDUI 2](https://www.mdui.org/)（Material Design 3 的 Web Components 组件库，主题色与图标由它提供）
- [SCSS](https://sass-lang.com/)（`sass` 编译，`src/styles/` 下按职责分片，无 CSS 框架）
- [oxlint](https://oxc.rs/)（Lint）+ [Prettier](https://prettier.io/)（排版）

## 数据文件

- `src/data/tools.ts` —— **全站唯一的工具注册表**：侧栏分组、首页卡片、`generateStaticParams`、`generateMetadata`、404 判定、图标名都读它。新增工具只改这里 + `components/tools/ToolBody.tsx` 的映射。
- `src/data/site.ts` —— 站名、描述、作者、许可、技术栈、站点与仓库地址；`toolPath()` 负责拼带尾斜杠的站内链接。
- `src/data/icons.ts` —— Material Icons 连字名清单，图标缺字形时只改一处。
- `src/data/friends.ts` —— 友情链接（名称 / 描述 / 头像 / 链接）。
- `src/hooks/` —— 五个工具的计算逻辑与抽屉手势，全部是纯函数式、不依赖 UI。
- `src/types/mdui.d.ts` —— MDUI 的 JSX 类型声明（Web Components 在 TSX 里需要它才有属性提示）。

## 构建步骤

1. [下载并安装 Node.js](https://nodejs.org/zh-cn)（建议 22 LTS）
2. 安装 `pnpm`：`npm install -g pnpm`（`pnpm --version` 可验证）
3. 在项目文件夹下执行 `pnpm install`
4. `pnpm dev` 启动开发服务器（默认 `http://localhost:3000`）
5. `pnpm build` 生成静态产物，输出在 **`out/`**

提交前这几条都要绿：

```bash
pnpm typecheck     # tsc --noEmit
pnpm lint          # oxlint
pnpm format:check  # prettier --check
pnpm build         # next build，产物在 out/
```

> [!TIP]
> 如果 `npm install` 安装较慢，可先执行 `npm config set registry https://registry.npmmirror.com` 切换至镜像源。

> [!NOTE]
> TypeScript 7 是原生（Go）实现，包里只有 `tsc` 可执行文件，不再提供旧版编译器 API。本项目的类型检查全部走命令行，因此不受影响；但如果将来接入依赖 TS API 的工具（例如 typescript-eslint），需要按官方说明并用 `@typescript/typescript6` 别名共存。

## 字体与图标

三类字体全部走 jsDelivr CDN，仓库不保留任何字体文件（见 `src/styles/_fonts.scss`）：

- **HarmonyOS Sans SC**（界面）—— 400 / 500 / 700 三个字重，按 unicode-range 分片，浏览器只下当前页面用到的切片；
- **Cascadia Code**（代码 / 输入输出）—— Windows 自带，其余平台靠 webfont 兜底，否则会掉到 `monospace` 导致中文行高全乱；
- **Material Icons**（图标）—— `@font-face` 单独声明并配 `font-display: block`，避免字形未到时先渲染成 `more_vert` 这类英文单词。

图标是 MDUI 的 `<mdui-icon>` 连字字体（名字集中在 `src/data/icons.ts`），不是把 SVG 内联进组件。首屏会有一次中文 FOUT，这是分片中文字体的固有代价。

## 样式分层

`src/styles/globals.scss` 是唯一入口，`@use` 顺序有语义，不要随意调整：

| 文件            | 职责                                                       |
| --------------- | ---------------------------------------------------------- |
| `_tokens.scss`  | 设计令牌：断点、尺寸、圆角、动效曲线（**不含颜色**）       |
| `_palette.scss` | 主题色静态覆写 `--mdui-color-primary-*`（浅色 / 深色两套） |
| `_fonts.scss`   | 字体 `@font-face` 与 `mdui-icon` 字体族绑定                |
| `_fouc.scss`    | 首帧可见性控制，避免未初始化时闪一下裸元素                 |
| `_base.scss`    | 盒模型、重置、滚动条等全局基线                             |
| `_layout.scss`  | 外壳布局：顶栏、侧栏、内容区、底栏与滚动容器               |
| `_sidebar.scss` | 侧栏分组与抽屉（`::part(panel)` 自己滚）                   |
| `_content.scss` | 首页与工具页的通用版式                                     |
| `_tool.scss`    | 工具页专属：输入 / 输出面板、结果区、复制按钮              |

- **`mdui.css` 必须排在 `globals.scss` 之前**（`app/layout.tsx` 里先 import 它）：后声明者胜，主题覆写才压得住 MDUI 默认的紫。
- **颜色只用 MDUI 的 CSS 变量**，`_tokens.scss` 里不写死色值；主题色是静态覆写，不在运行时调 `setColorScheme()`（那只能在客户端跑，首帧会先紫后蓝）。
- **断点与 MDUI 对齐**：`$bp-md: 840px`（抽屉的 modal 临界）、`$bp-sm: 600px`，不另起一套像素值。

## 交互与动效

- 主题（浅色 / 深色）—— `src/lib/theme.ts`，落地点是 `<html>` 上的 `mdui-theme-*` 类并同步 `style.colorScheme`；首帧由 `THEME_BOOTSTRAP` 内联脚本在 `<head>` 里执行，避免「先白后黑」，storage key 是 `qxg-tools-theme`（与旧站隔离）。
- 首屏防闪的另一半在 `app/layout.tsx`：生产用同步内联 `<script>`，dev 改用 `next/script`（React 19 不会在客户端执行组件里的 `<script>`，dev 下内联会红一片控制台）。
- 窄屏抽屉 —— `SideNav` + `hooks/useDrawerSwipe.ts`：左边缘右滑拉出、抽屉内左滑收回，手势跟手；起手区刻意避开屏幕最外侧，免得被系统的返回手势吞掉。
- 结果反馈 —— `lib/toast.ts`（MDUI `snackbar`，只在客户端动态 `import('mdui')`）+ `lib/copy.ts`（剪贴板，含降级路径）。
- 动效只用 `_tokens.scss` 里的缓动曲线，不做夸张位移。

## 实现约定

几条踩过坑、必须遵守的规则：

1. **不要在任何模块顶层 `import 'mdui'`**。SSG 阶段 Node 里没有 `HTMLElement`，`customElements.define` 会让构建直接失败。只能在 `MduiProvider` 的 `useEffect` 里动态 `import('mdui')`；`snackbar()` 同理。
2. **布尔属性不要走 JSX**（`open` / `disabled` / `active`）。React 会把 `false` 序列化成 `"false"` 字符串，而 Web Components 的布尔转换只看「属性存在与否」→ 反而变成 true。统一用 `ref` 命令式赋值，或 `cond ? undefined : true`。
3. **盒模型由 `_base.scss` 的 `* { box-sizing: border-box }` 统一设定**。MDUI 的全局样式里一条 `box-sizing` 都没有（组件各自在 shadow DOM 内自理），漏掉这条就会让「`width: 100%` + 左右 padding」的元素按 content-box 撑出横向滚动条。
4. **页面滚动发生在 `<mdui-layout-main>`，不是 `window`**。`html/body` 给足高度、`mdui-layout` 锁成 `100dvh`、`.app-main` 的 `min-height` 必须是 0（否则 flex 子项收缩不了）。任何需要监听滚动的地方都得显式指向主区（见顶栏的 `scroll-target`）。
5. **侧栏在 `::part(panel)` 上自己滚**（`height: 100%` + `overflow-y: auto`）。不给高度的话面板会被 `:host` 的 `overflow: hidden` 直接裁掉，条目多时看不到底部。
6. **站内链接一律走 `toolPath()`**（`trailingSlash: true` 下必须带尾斜杠），且用 Next 的 `Link` 而不是裸 `<a>`，否则每次跳转都是整页刷新。

## 部署方式

本网站部署于 **GitHub Pages**，通过静态托管对外提供服务。推送到 `main` 后由 `.github/workflows/deploy.yml` 自动执行 `pnpm install --frozen-lockfile` → `pnpm build` → 上传 `out/` → 部署 Pages。站点没有后端，所有内容以静态资源形式存在，更新时需重新构建并推送。

仓库里不需要 `public/.nojekyll` 与 `public/CNAME`：这两个文件只对「从分支直接发布」的 Pages 生效。本站走自定义 GitHub Actions 工作流发布，Pages 不会再跑 Jekyll（`_next/` 不会被过滤），域名也在仓库 Settings → Pages 里配。

### 域名接管注意

`www.skystarlight.top` 原先指向 `StarLight-7693-New`。要让本站接管：

1. 旧仓库 Settings → Pages 清空 Custom domain，并从分支里删掉它的 `CNAME`（否则下次推送会重新注册）
2. 本仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 首次部署成功后填 Custom domain `www.skystarlight.top`，再勾 **Enforce HTTPS**
4. DNS：`www` 为 `CNAME → starlight-7693.github.io`
5. 无 www 的 `skystarlight.top` 建议一并指到本仓库（GitHub 会 301 到 www），否则会出现「www 是新站、apex 是旧站」的分裂

## 许可证

本项目采用 **MIT** 许可证，详见 [LICENSE](LICENSE)。
