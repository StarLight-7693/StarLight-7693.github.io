# StarLight-7693.github.io

![Last Commit](https://img.shields.io/github/last-commit/StarLight-7693/StarLight-7693.github.io?label=Last%20Commit)
[![BiliBili](https://img.shields.io/badge/BiliBili-TP--RLX--LIGHT-FF69B4?logo=bilibili&logoColor=F5F5F5)](https://space.bilibili.com/3632301571311734)
[![GitHub](https://img.shields.io/badge/GitHub-StarLight--7693-blue?logo=github&logoColor=F5F5F5)](https://github.com/StarLight-7693)

## 简介

这是TP-RLX-LIGHT（又称StarLight-7693）的个人网站仓库。这个网站由GitHub Pages托管。

我想说的话都写在[这个网站](https://starlight-7693.github.io)里了，也没什么好介绍的。

这个网站是基于 VitePress 构建的，网站整体视觉风格为复古风格。

本网站代码基于 MIT 许可证开源。

## 项目结构

为避免仓库根目录中的其他文件影响 VitePress 对配置、页面和静态资源的识别，所有 VitePress 项目文件统一放在 `Website_Files/` 目录中。GitHub Actions 部署工作流仍位于仓库根目录，并通过 `working-directory` 在该目录中安装依赖和执行构建。

```text
StarLight-7693.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 构建与部署
├── Website_Files/              # VitePress 项目根目录
│   ├── .vitepress/
│   │   ├── theme/              # 自定义主题、布局和组件
│   │   ├── config.ts           # VitePress 配置
│   │   └── env.d.ts
│   ├── posts/                  # 博客文章
│   ├── public/                 # 静态资源
│   ├── .gitignore
│   ├── .npmrc
│   ├── index.md                # 网站首页
│   ├── LICENSE
│   ├── package.json            # VitePress 脚本和依赖
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   └── tsconfig.json
├── .gitignore
└── README.md
```

本地开发或构建时，请在 `Website_Files/` 目录中运行 `pnpm dev` 或 `pnpm build`。部署工作流会从同一目录读取锁文件、运行构建，并发布 `.vitepress/dist`。

## Stone Badge

下面是这个仓库的[Stone Badge](https://stone.professorlee.work/)。

![Stone Badge](https://stone.professorlee.work/api/stone/StarLight-7693/StarLight-7693.github.io)