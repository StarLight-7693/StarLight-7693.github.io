'use client';

import MduiTextField from '@/components/mdui/MduiTextField';
import ToolResult from '@/components/tools/ToolResult';
import { ICONS } from '@/data/icons';
import { useEggyPartyMapText } from '@/hooks/useEggyPartyMapText';

export default function EggyMapTextTool() {
  const { input, setInput, result, resultType, process, loadExample, clear } =
    useEggyPartyMapText();

  return (
    <div className="tool-body">
      <MduiTextField
        label="游戏内复制的分享文本"
        value={input}
        onChange={setInput}
        rows={6}
        placeholder="复制打开【蛋仔派对】，游玩地图《此图菜鸟都能过！》，地图码6040-1745。"
        helper="需要文本里带《地图名》与地图码（形如 6040-1745）"
      />

      <div className="tool-actions">
        <mdui-button icon={ICONS.article} onClick={() => process(false)}>
          生成文案
        </mdui-button>
        <mdui-button variant="tonal" icon={ICONS.movie} onClick={() => process(true)}>
          短视频文案
        </mdui-button>
        <mdui-button variant="outlined" icon={ICONS.example} onClick={loadExample}>
          填入示例
        </mdui-button>
        <mdui-button variant="text" onClick={clear}>
          清空
        </mdui-button>
      </div>

      <ToolResult result={result} resultType={resultType} label="生成的文案" />
    </div>
  );
}
