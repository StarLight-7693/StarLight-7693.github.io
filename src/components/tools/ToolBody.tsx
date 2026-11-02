'use client';

import type { ComponentType } from 'react';

import Base64Tool from './Base64Tool';
import EggyMapTextTool from './EggyMapTextTool';
import TimestampTool from './TimestampTool';
import UnicodeTool from './UnicodeTool';
import UrlTool from './UrlTool';

// ============================================================
// 工具主体分发
// ------------------------------------------------------------
// slug → 组件的唯一映射。新增工具时：data/tools.ts 加一条，
// 这里加一行，再写组件。三处之外不需要动任何东西。
// ============================================================

const REGISTRY: Record<string, ComponentType> = {
  base64: Base64Tool,
  unicode: UnicodeTool,
  url: UrlTool,
  timestamp: TimestampTool,
  'eggy-map-text': EggyMapTextTool,
};

export default function ToolBody({ slug }: { slug: string }) {
  const Tool = REGISTRY[slug];

  if (!Tool) {
    return (
      <mdui-card className="tool-panel">
        <p className="tool-placeholder">没有这个工具。</p>
      </mdui-card>
    );
  }

  return <Tool />;
}
