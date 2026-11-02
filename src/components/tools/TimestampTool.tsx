'use client';

import MduiTextField from '@/components/mdui/MduiTextField';
import ToolResult from '@/components/tools/ToolResult';
import { ICONS } from '@/data/icons';
import { useTimestamp } from '@/hooks/useTimestamp';

export default function TimestampTool() {
  const {
    timestampInput,
    setTimestampInput,
    datetimeInput,
    setDatetimeInput,
    result,
    resultType,
    timestampToDatetime,
    datetimeToTimestamp,
    fillCurrent,
    clear,
  } = useTimestamp();

  return (
    <div className="tool-body">
      <div className="tool-fields">
        <MduiTextField
          label="时间戳"
          value={timestampInput}
          onChange={setTimestampInput}
          placeholder="1759999999 或 1759999999123"
          helper="10 位以内按秒解析，更长的按毫秒解析"
        />

        <MduiTextField
          label="日期时间"
          value={datetimeInput}
          onChange={setDatetimeInput}
          type="datetime-local"
          helper="按本地时区解析"
        />
      </div>

      <div className="tool-actions">
        <mdui-button icon="arrow_forward" onClick={timestampToDatetime}>
          时间戳 → 时间
        </mdui-button>
        <mdui-button variant="tonal" icon="arrow_back" onClick={datetimeToTimestamp}>
          时间 → 时间戳
        </mdui-button>
        <mdui-button variant="outlined" icon={ICONS.refresh} onClick={fillCurrent}>
          当前时间
        </mdui-button>
        <mdui-button variant="text" onClick={clear}>
          清空
        </mdui-button>
      </div>

      <ToolResult result={result} resultType={resultType} />
    </div>
  );
}
