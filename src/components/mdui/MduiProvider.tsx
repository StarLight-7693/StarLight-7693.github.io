'use client';

import { useEffect } from 'react';

// ============================================================
// MDUI 注册器
// ------------------------------------------------------------
// 必须在浏览器里、组件挂载后动态 import：
//   - mdui 入口会 class X extends HTMLElement + customElements.define，
//     SSG 的 Node 环境没有 HTMLElement，顶层 import 直接让构建失败
//   - 动态 import 让 mdui 进独立 chunk，不污染首屏关键路径
//
// 注册完成后给 <html> 加 mdui-ready：只作为「可以放行显示」的标记，
// 视觉上的隐藏由 :not(:defined) 负责（见 _fouc.scss），二者互不依赖。
// ============================================================

/** 本站实际使用的 MDUI 标签，用于 whenDefined 兜底 */
const TAGS = [
  'mdui-layout',
  'mdui-layout-main',
  'mdui-top-app-bar',
  'mdui-top-app-bar-title',
  'mdui-navigation-drawer',
  'mdui-list',
  'mdui-list-item',
  'mdui-collapse',
  'mdui-collapse-item',
  'mdui-button',
  'mdui-button-icon',
  'mdui-card',
  'mdui-icon',
  'mdui-divider',
  'mdui-dropdown',
  'mdui-menu',
  'mdui-menu-item',
  'mdui-dialog',
  'mdui-text-field',
  'mdui-switch',
  'mdui-snackbar',
];

/** 个别组件升级失败时也要放行，不能把整页卡在隐藏状态 */
const READY_TIMEOUT = 3000;

export default function MduiProvider() {
  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) document.documentElement.classList.add('mdui-ready');
    };

    void import('mdui')
      .then(() =>
        Promise.race([
          Promise.allSettled(TAGS.map((tag) => customElements.whenDefined(tag))),
          new Promise((resolve) => setTimeout(resolve, READY_TIMEOUT)),
        ]),
      )
      .then(markReady)
      .catch(markReady);

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
