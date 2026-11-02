/**
 * 图标名集中处。
 *
 * 全部取自 Material Icons 的连字名（snake_case），字体走 jsDelivr CDN。
 * 改图标只改这里，不要在组件里散写字符串 —— 字体缺某个连字时，
 * 页面上会显示该英文名本身，集中管理便于一次性排查。
 */
export const ICONS = {
  menu: 'menu',
  close: 'close',
  moreVert: 'more_vert',
  darkMode: 'dark_mode',
  lightMode: 'light_mode',
  info: 'info',
  home: 'home',
  build: 'build',
  contentCopy: 'content_copy',
  check: 'check',
  swapHoriz: 'swap_horiz',
  base64: 'code',
  unicode: 'translate',
  timestamp: 'schedule',
  url: 'link',
  eggy: 'sports_esports',
} as const;
