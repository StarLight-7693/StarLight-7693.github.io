// ============================================================
// 主题（二态：浅色 / 深色）
// ------------------------------------------------------------
// 落地点是 <html> 上的 MDUI 主题类：mdui-theme-light | mdui-theme-dark。
// 同时写 style.colorScheme，让滚动条、原生控件、表单外观一起变。
//
// 首帧防闪：THEME_BOOTSTRAP 由 app/layout.tsx 放进 <head> 内联执行，
// 在首次绘制前就把 class 落地，避免「先白后黑」。
// storage key 与旧站（starlight-theme）隔离，两站互不影响。
// ============================================================

export const THEME_STORAGE_KEY = 'qxg-tools-theme';

export type ThemeMode = 'light' | 'dark';

/** 首帧内联脚本：读 localStorage → 没有就跟随系统 → 写 <html> class */
export const THEME_BOOTSTRAP = `(function(){try{var k='${THEME_STORAGE_KEY}';var v=localStorage.getItem(k);var dark=v==='dark'||(v!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.add(dark?'mdui-theme-dark':'mdui-theme-light');e.style.colorScheme=dark?'dark':'light';}catch(err){document.documentElement.classList.add('mdui-theme-light');}})();`;

/** 当前生效的主题（以 <html> 上的类为准，不读 React state） */
export function readTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('mdui-theme-dark') ? 'dark' : 'light';
}

/** 应用并持久化主题 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('mdui-theme-dark', mode === 'dark');
  root.classList.toggle('mdui-theme-light', mode === 'light');
  root.style.colorScheme = mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // 隐私模式下写入失败：本次切换仍然生效，只是不持久化
  }
}
