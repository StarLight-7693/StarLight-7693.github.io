'use client';

import MduiTextField from '@/components/mdui/MduiTextField';
import ToolResult from '@/components/tools/ToolResult';
import { ICONS } from '@/data/icons';
import { useBase64 } from '@/hooks/useBase64';

export default function Base64Tool() {
  const { input, setInput, result, resultType, encode, decode, clear } = useBase64();

  return (
    <div className="tool-body">
      <MduiTextField
        label="文本"
        value={input}
        onChange={setInput}
        rows={8}
        placeholder="粘贴要编码的文本，或者要解码的 Base64"
        helper="编码按 UTF-8 处理，中文与 emoji 都能安全往返"
      />

      <div className="tool-actions">
        <mdui-button icon={ICONS.encode} onClick={encode}>
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
