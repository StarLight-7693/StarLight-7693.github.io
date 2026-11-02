/**
 * 图标名集中处。
 *
 * 全部取自 Material Icons 的连字名（snake_case），字体走 jsDelivr CDN。
 * 改图标只改这里，不要在组件里散写字符串 —— 字体缺某个连字时，
 * 页面上会显示该英文名本身，集中管理便于一次性排查。
 */
export const ICONS = {
  // 外壳
  menu: 'menu',
  close: 'close',
  moreVert: 'more_vert',
  darkMode: 'dark_mode',
  lightMode: 'light_mode',
  info: 'info',
  home: 'home',
  build: 'build',
  chevronRight: 'chevron_right',

  // 工具分类
  base64: 'code',
  unicode: 'translate',
  timestamp: 'schedule',
  url: 'link',
  eggy: 'sports_esports',

  // 工具内动作
  encode: 'code',
  decode: 'lock_open',
  contentCopy: 'content_copy',
  refresh: 'refresh',
  movie: 'movie',
  article: 'article',
  example: 'auto_fix_high',
} as const;
