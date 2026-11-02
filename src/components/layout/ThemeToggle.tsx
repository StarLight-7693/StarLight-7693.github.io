'use client';

import { useEffect, useState } from 'react';
import { ICONS } from '@/data/icons';
import { applyTheme, readTheme, type ThemeMode } from '@/lib/theme';

// ============================================================
// 深色模式开关（二态）
// ------------------------------------------------------------
// 初始值必须等挂载后再读：SSR 阶段 <html> 上还没有主题类，
// 直接读会得到 'light'，与客户端真实值不一致 → hydration 警告。
// 所以首帧渲染一个「占位图标」，mount 后换成真实图标。
// ============================================================
export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    // 这里必须读一次外部系统（<html> 上的主题类），正是 effect 的正当用途：
    // 首帧 SSR 时没有 document，提前读会和客户端不一致。
    // oxlint-disable-next-line react/set-state-in-effect
    setMode(readTheme());
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setMode(next);
  };

  const label = mode === 'dark' ? '切换到浅色模式' : '切换到深色模式';

  return (
    <mdui-button-icon
      aria-label={label}
      title={label}
      onClick={toggle}
      icon={mode === 'dark' ? ICONS.lightMode : ICONS.darkMode}
    />
  );
}
