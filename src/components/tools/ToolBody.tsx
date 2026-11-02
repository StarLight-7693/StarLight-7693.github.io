'use client';

// ============================================================
// 工具主体分发
// ------------------------------------------------------------
// 只做「slug → 组件」的映射，所有工具组件都是客户端组件
// （需要 useState / 剪贴板 / 事件）。
// ============================================================

export default function ToolBody({ slug }: { slug: string }) {
  return (
    <mdui-card className="tool-panel">
      <p className="tool-placeholder">工具「{slug}」正在接线中。</p>
    </mdui-card>
  );
}
