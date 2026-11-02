'use client';

import MduiTextField from '@/components/mdui/MduiTextField';
import ToolResult from '@/components/tools/ToolResult';
import { ICONS } from '@/data/icons';
import { useUnicode } from '@/hooks/useUnicode';

export default function UnicodeTool() {
  const { input, setInput, result, resultType, encode, decode, clear } = useUnicode();

  return (
    <div className="tool-body">
      <MduiTextField
        label="文本 / 转义序列"
        value={input}
        onChange={setInput}
        rows={8}
        placeholder="文本，或 \u4F60\u597D 这样的转义序列"
        helper="按码点处理，emoji 不会被拆成两个半字符"
      />

      <div className="tool-actions">
        <mdui-button icon={ICONS.unicode} onClick={encode}>
          编码
        </mdui-button>
        <mdui-button variant="tonal" icon={ICONS.decode} onClick={decode}>
          解码
        </mdui-button>
        <mdui-button variant="text" onClick={clear}>
          清空
        </mdui-button>
      </div>

      <ToolResult result={result} resultType={resultType} />
    </div>
  );
}
