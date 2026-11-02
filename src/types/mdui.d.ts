import type { DetailedHTMLProps, HTMLAttributes, RefAttributes } from 'react';

// ============================================================
// MDUI v2 的 JSX 类型声明
// ------------------------------------------------------------
// MDUI 是 Web Components，React 不认识这些标签，必须自行增补。
// React 19 把 JSX 命名空间移进了 `React.JSX`，所以要用
// `declare module 'react'` 做模块增补，不能写在全局 namespace JSX 里。
//
// 属性一律放宽成索引签名：MDUI 的属性/事件太多（open / modal / variant /
// scroll-behavior / close-on-overlay-click …），逐个列举的维护成本高于收益。
// 代价是属性名拼错不会报错，靠 review 比对官方文档。
// ============================================================

/** 常用 MDUI 元素的最小接口（只声明我们真的会命令式读写的成员） */
export interface MduiDrawerElement extends HTMLElement {
  open: boolean;
}

export interface MduiDialogElement extends HTMLElement {
  open: boolean;
}

export interface MduiTextFieldElement extends HTMLElement {
  value: string;
}

export interface MduiSwitchElement extends HTMLElement {
  checked: boolean;
}

/**
 * 涟漪层。它本身 `pointer-events: none`，也不会自己绑事件，
 * 要由外层在 pointerdown / pointerup 时手动驱动。
 */
export interface MduiRippleElement extends HTMLElement {
  startPress(event?: Event): void;
  endPress(): void;
}

type MduiAttrs = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
  RefAttributes<HTMLElement> & {
    [attr: string]: unknown;
  };

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'mdui-layout': MduiAttrs;
      'mdui-layout-main': MduiAttrs;
      'mdui-top-app-bar': MduiAttrs;
      'mdui-top-app-bar-title': MduiAttrs;
      'mdui-navigation-drawer': MduiAttrs;
      'mdui-list': MduiAttrs;
      'mdui-list-item': MduiAttrs;
      'mdui-list-subheader': MduiAttrs;
      'mdui-collapse': MduiAttrs;
      'mdui-collapse-item': MduiAttrs;
      'mdui-button': MduiAttrs;
      'mdui-button-icon': MduiAttrs;
      'mdui-card': MduiAttrs;
      'mdui-icon': MduiAttrs;
      'mdui-divider': MduiAttrs;
      'mdui-dropdown': MduiAttrs;
      'mdui-menu': MduiAttrs;
      'mdui-menu-item': MduiAttrs;
      'mdui-dialog': MduiAttrs;
      'mdui-text-field': MduiAttrs;
      'mdui-switch': MduiAttrs;
      'mdui-snackbar': MduiAttrs;
      'mdui-ripple': MduiAttrs;
    }
  }
}
