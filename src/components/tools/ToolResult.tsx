'use client';

import { ICONS } from '@/data/icons';
import { copyText } from '@/lib/copy';
import { toast } from '@/lib/toast';
import type { ResultType } from '@/hooks/useBase64';

// ============================================================
// 结果框：展示文本 + 一键复制
// ------------------------------------------------------------
// 结果用 <pre> 保留换行（时间戳工具会输出多行），复制失败时提示原因，
// 不静默失败 —— 剪贴板在非 HTTPS / 无权限时确实会失败。
// ============================================================

interface ToolResultProps {
  result: string;
  resultType: ResultType;
  /** 还没算过时的占位文案 */
  placeholder?: string;
  /** 结果为空时是否仍显示复制按钮（默认显示但禁用） */
  label?: string;
}

export default function ToolResult({
  result,
  resultType,
  placeholder = '结果会显示在这里',
  label = '结果',
}: ToolResultProps) {
  const copy = async () => {
    const ok = await copyText(result);
    void toast(ok ? '已复制到剪贴板' : '复制失败，请手动选择文本');
  };

  return (
    <div className="tool-result">
      <div className="tool-result-head">
        <span className="tool-result-label">{label}</span>
        <mdui-button
          variant="text"
          icon={ICONS.contentCopy}
          disabled={result ? undefined : true}
          onClick={copy}
        >
          复制
        </mdui-button>
      </div>

      <pre
        className={resultType === 'error' ? 'tool-result-body is-error' : 'tool-result-body'}
        aria-live="polite"
      >
        {result || placeholder}
      </pre>
    </div>
  );
}
