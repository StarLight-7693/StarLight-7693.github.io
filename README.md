# 栖小光的工具站

纯前端的在线小工具集合，输入内容不上传服务器。

- 线上地址：<https://www.skystarlight.top>
- 技术栈：Next.js（App Router，`output: 'export'` 静态导出）· React 19 · TypeScript · SCSS · [MDUI 2](https://www.mdui.org/)
- 许可：[MIT](LICENSE)

## 功能

| 工具             | 路径                    | 说明                                         |
| ---------------- | ----------------------- | -------------------------------------------- |
| Base64 编解码    | `/tools/base64/`        | UTF-8 优先，中文与 emoji 可安全往返          |
| Unicode 编解码   | `/tools/unicode/`       | 按码点处理，支持 `\u4F60` 与 `\u{1F600}`     |
| URL 编解码       | `/tools/url/`           | 整串 URI 与 URI 组件两种粒度                 |
| 时间戳转换       | `/tools/timestamp/`     | 秒/毫秒自动识别，本地时间与 UTC 对照         |
| 蛋仔派对地图文本 | `/tools/eggy-map-text/` | 从分享文本里提取地图名与地图码，生成标准文案 |

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

质量门禁（提交前都要绿）：

```bash
pnpm typecheck     # tsc --noEmit
pnpm lint          # oxlint
pnpm format:check  # prettier --check
pnpm build         # next build，产物在 out/
```

## 目录结构

```
src/
├─ app/                     # 路由（App Router）
│  ├─ layout.tsx            # 外壳：主题首帧脚本、字体预加载、全局样式
│  ├─ page.tsx              # 首页：介绍 + 工具入口 + 友情链接
│  ├─ not-found.tsx         # 404
│  └─ tools/[slug]/page.tsx # 工具页（generateStaticParams 全量生成）
├─ components/
│  ├─ layout/               # AppShell / TopBar / SideNav / ThemeToggle / AboutDialog / SiteFooter
│  ├─ mdui/                 # MduiProvider（动态注册）、MduiTextField（受控输入桥）
│  ├─ home/                 # Hero / ToolGrid / FriendLinks
│  └─ tools/                # ToolBody（slug→组件）、ToolResult、5 个工具
├─ data/                    # site / tools（唯一 registry）/ friends / icons
├─ hooks/                   # 5 个工具的逻辑（纯函数式，无 UI 依赖）
├─ lib/                     # theme / copy / toast
├─ styles/                  # globals.scss + 分片（tokens/palette/fonts/fouc/base/layout/sidebar/content/tool）
└─ types/                   # MDUI 的 JSX 类型声明
```

## 几个必须知道的实现约定

1. **不要在任何模块顶层 `import 'mdui'`**。SSG 阶段 Node 里没有 `HTMLElement`，`customElements.define` 会让构建直接失败。只能在 `MduiProvider` 的 `useEffect` 里动态 `import('mdui')`；`snackbar()` 同理（见 `lib/toast.ts`）。
2. **布尔属性不要走 JSX**（`open` / `disabled` / `active`）。React 会把 `false` 序列化成 `"false"` 字符串，而 Web Components 的布尔转换只看「属性存在与否」→ 反而变成 true。统一用 `ref` 命令式赋值，或 `cond ? undefined : true`。
3. **`mdui.css` 必须排在 `globals.scss` 之前**，否则主题色覆写压不住 MDUI 默认的紫。
4. **主题色是静态覆写的 `--mdui-color-primary-*`**（`_palette.scss`），不要在运行时调 `setColorScheme()`：它只能在客户端跑，首帧会先紫后蓝。
5. **图标字体走 jsDelivr CDN**（`_fonts.scss` + `layout.tsx` 的 preload），仓库不存字体文件；图标名集中在 `data/icons.ts`，缺字形时只改一处。
6. **新增工具**：`data/tools.ts` 加一条 → `components/tools/ToolBody.tsx` 的 registry 加一行 → 写组件 + hook。
7. **盒模型由 `_base.scss` 的 `* { box-sizing: border-box }` 统一设定**。MDUI 的全局样式里一条 `box-sizing` 都没有（组件各自在 shadow DOM 内自理），漏掉这条就会让「`width: 100%` + 左右 padding」的元素按 content-box 撑出横向滚动条。
8. **页面滚动发生在 `<mdui-layout-main>`，不是 `window`**。`html/body` 给足高度、`mdui-layout` 锁成 `100dvh`、`.app-main` 的 `min-height` 必须是 0（否则 flex 子项收缩不了，布局被内容撑高，独立滚动失效）。顶栏与抽屉是 layout 的 absolute item，因此天然吸顶/固定；任何需要监听滚动的地方都得显式指向主区（见顶栏的 `scroll-target`）。
9. **侧栏在 `::part(panel)` 上自己滚**（`height: 100%` + `overflow-y: auto`）。不给高度的话面板会被 `:host` 的 `overflow: hidden` 直接裁掉，条目多时看不到底部。

## 部署

推送到 `main` 后由 `.github/workflows/deploy.yml` 自动执行 `pnpm install --frozen-lockfile` → `pnpm build` → 上传 `out/` → 部署 GitHub Pages。

仓库里必须保留：

- `public/.nojekyll` —— 否则 GitHub Pages 会过滤 `_next/` 目录，线上会变成纯文本
- `public/CNAME` —— `www.skystarlight.top`

### 域名接管注意

`www.skystarlight.top` 原先指向 `StarLight-7693-New`。要让本站接管：

1. 旧仓库 Settings → Pages 清空 Custom domain，并从分支里删掉它的 `CNAME`（否则下次推送会重新注册）
2. 本仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 首次部署成功后填 Custom domain `www.skystarlight.top`，再勾 **Enforce HTTPS**
4. DNS：`www` 为 `CNAME → starlight-7693.github.io`
5. 无 www 的 `skystarlight.top` 建议一并指到本仓库（GitHub 会 301 到 www），否则会出现「www 是新站、apex 是旧站」的分裂
