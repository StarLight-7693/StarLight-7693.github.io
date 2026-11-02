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

- **顶栏**：品牌 + 主题切换 + 关于。窄屏（≤840px）左侧换成汉堡按钮，点开抽屉式侧栏。
- **侧栏**：按分类分组列出全部工具（编码转换 / 时间处理 / 游戏工具），当前工具高亮。
- **首页**：`/`，简介 → 工具矩阵 → 友情链接。
- **工具页**：`/tools/<slug>/`，左侧输入、右侧结果，一键复制。
- **底栏**：站点说明、技术栈与仓库入口。

## 工具

| 工具             | 路径                    | 说明                                         |
| ---------------- | ----------------------- | -------------------------------------------- |
| Base64 编解码    | `/tools/base64/`        | UTF-8 优先，中文与 emoji 可安全往返          |
| Unicode 编解码   | `/tools/unicode/`       | 按码点处理，支持 `\u4F60` 与 `\u{1F600}`     |
| URL 编解码       | `/tools/url/`           | 整串 URI 与 URI 组件两种粒度                 |
| 时间戳转换       | `/tools/timestamp/`     | 秒 / 毫秒自动识别，本地时间与 UTC 对照       |
| 蛋仔派对地图文本 | `/tools/eggy-map-text/` | 从分享文本里提取地图名与地图码，生成标准文案 |

全部计算在浏览器里完成，没有任何后端请求。

## 技术栈

- [Next.js 16](https://nextjs.org/)（App Router，`output: 'export'` 静态导出，`trailingSlash: true`）
- [React 19](https://react.dev/)
- [TypeScript 7.0.2](https://www.typescriptlang.org/)
- [MDUI 2](https://www.mdui.org/)（Material Design 3 的 Web Components 组件库）
- [SCSS](https://sass-lang.com/)（按职责分片，无 CSS 框架）
- [oxlint](https://oxc.rs/) + [Prettier](https://prettier.io/)（代码检查与排版）

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

## 字体与图标

三类字体全部走 jsDelivr CDN，仓库不保留字体文件：**HarmonyOS Sans SC**（界面，400 / 500 / 700 按 unicode-range 分片）、**Cascadia Code**（代码与输入输出）、**Material Icons**（图标连字）。图标名集中在 `src/data/icons.ts`，站点不内置任何图标文件。

## 部署方式

本网站部署于 **GitHub Pages**，通过静态托管对外提供服务。推送到 `main` 后由 `.github/workflows/deploy.yml` 自动执行代码检查（`lint.yml`）→ `pnpm build` → 上传 `out/` → 部署 Pages；检查不通过就不会发布。站点没有后端，所有内容以静态资源形式存在，更新时需重新构建并推送。

仓库里不需要 `public/.nojekyll` 与 `public/CNAME`：这两个文件只对「从分支直接发布」的 Pages 生效。本站走自定义 GitHub Actions 工作流发布，域名在仓库 Settings → Pages 里配。

## 参与开发

实现层面的约定（MDUI 的注册时机、布尔属性、样式分片顺序、滚动容器等）与提交前自检清单写在 [.github/copilot-instructions.md](.github/copilot-instructions.md)，改代码前请先读一遍。

## 许可证

本项目采用 **MIT** 许可证，详见 [LICENSE](LICENSE)。
