'use client';

import MduiTextField from '@/components/mdui/MduiTextField';
import ToolResult from '@/components/tools/ToolResult';
import { ICONS } from '@/data/icons';
import { useUrl } from '@/hooks/useUrl';

export default function UrlTool() {
  const {
    input,
    setInput,
    result,
    resultType,
    encodeUrl,
    decodeUrl,
    encodeComponent,
    decodeComponent,
    clear,
  } = useUrl();

  return (
    <div className="tool-body">
      <MduiTextField
        label="URL / 参数值"
        value={input}
        onChange={setInput}
        rows={6}
        placeholder="https://example.com/搜索?q=你好 或者 单段参数值"
        helper="整串地址用 encodeURI，拼进 query 的单段值用 encodeURIComponent"
      />

      <div className="tool-actions">
        <mdui-button icon={ICONS.encode} onClick={encodeUrl}>
          整串编码
        </mdui-button>
        <mdui-button variant="tonal" icon={ICONS.decode} onClick={decodeUrl}>
          整串解码
        </mdui-button>
        <mdui-button variant="outlined" onClick={encodeComponent}>
          组件编码
        </mdui-button>
        <mdui-button variant="outlined" onClick={decodeComponent}>
          组件解码
        </mdui-button>
        <mdui-button variant="text" onClick={clear}>
          清空
        </mdui-button>
      </div>

      <ToolResult result={result} resultType={resultType} />
    </div>
  );
}
