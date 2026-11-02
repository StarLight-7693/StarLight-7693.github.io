'use client';

import { useEffect, useState } from 'react';
import { ICONS } from '@/data/icons';
import { applyTheme, readTheme, type ThemeMode } from '@/lib/theme';

// ============================================================
// 深色模式开关（二态）
// ------------------------------------------------------------
// 初始值必须等挂载后再读：SSR 阶段 <html> 上还没有主题类，
// 直接读会得到 'light'，与客户端真实值不一致 → hydration 警告。
// 所以首帧渲染一个占位图标，mount 后换成真实图标。
//
// 图标语义：显示「当前处于哪种模式」——浅色给太阳、深色给月亮。
// 按钮的无障碍名称反过来描述「点一下会切到哪」，读屏用户拿到的是动作。
// ============================================================
export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    // 这里必须读一次外部系统（<html> 上的主题类），正是 effect 的正当用途：
    // 首帧 SSR 时没有 document，提前读会和客户端不一致。
    // oxlint-disable-next-line react/set-state-in-effect
    setMode(readTheme());
  }, []);

  const isDark = mode === 'dark';

  const toggle = () => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    applyTheme(next);
    setMode(next);
  };

  const label = isDark ? '切换到浅色模式' : '切换到深色模式';

  return (
    <mdui-button-icon
      aria-label={label}
      title={label}
      icon={isDark ? ICONS.darkMode : ICONS.lightMode}
      onClick={toggle}
    />
  );
}
