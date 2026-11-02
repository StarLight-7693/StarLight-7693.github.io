'use client';

import { useEffect, useRef } from 'react';

// ============================================================
// 受控的多行文本框（包一层 mdui-text-field）
// ------------------------------------------------------------
// 真实的 <textarea> 在 shadow root 里，React 拿不到它的 value：
//   - 读：在宿主元素上监听 input 事件，读 el.value（不是 e.target.value）
//   - 写：直接赋值 el.value，且「值不同才写」，否则光标会跳到末尾
// 所以这里不用 JSX 的 value={...} 做双向绑定，而是单向回写 + 事件上抛。
// ============================================================

interface MduiTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  helper?: string;
  /** 单行时给 'text'，取日期用 'datetime-local' 等（不传即单行文本） */
  type?: string;
}

export default function MduiTextField({
  label,
  value,
  onChange,
  rows,
  placeholder,
  helper,
  type,
}: MduiTextFieldProps) {
  const ref = useRef<HTMLElement>(null);

  // 外部改值（清空、载入示例、两个输入框互相回填）时同步到 DOM
  useEffect(() => {
    const el = ref.current as (HTMLElement & { value: string }) | null;
    if (el && el.value !== value) el.value = value;
  }, [value]);

  useEffect(() => {
    const el = ref.current as (HTMLElement & { value: string }) | null;
    if (!el) return;

    const onInput = () => onChange(el.value);
    el.addEventListener('input', onInput);
    return () => el.removeEventListener('input', onInput);
  }, [onChange]);

  return (
    <mdui-text-field
      ref={ref}
      variant="outlined"
      label={label}
      placeholder={placeholder}
      helper={helper}
      rows={rows}
      type={type}
      className="tool-field"
    />
  );
}
