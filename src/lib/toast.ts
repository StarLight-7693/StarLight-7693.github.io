/**
 * 轻量提示（Snackbar）。
 *
 * 动态 import：mdui 的入口会注册自定义元素，SSG 阶段不能在顶层执行。
 * 同一个 queue 名让连续点击的提示排队出现，而不是叠在一起。
 */
export async function toast(message: string): Promise<void> {
  try {
    const { snackbar } = await import('mdui');
    snackbar({
      message,
      placement: 'bottom',
      autoCloseDelay: 1800,
      queue: 'tools',
    });
  } catch {
    // 提示只是锦上添花，失败时不要打断复制本身
  }
}
