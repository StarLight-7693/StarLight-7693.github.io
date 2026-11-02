import { useCallback, useState } from 'react';
import type { ResultType } from './useBase64';

/** 单个码点转 \uXXXX（BMP 一段；星平面拆成代理对两段） */
function toEscaped(codePoint: number): string {
  const hex = (value: number) => value.toString(16).toUpperCase().padStart(4, '0');

  if (codePoint <= 0xffff) return `\\u${hex(codePoint)}`;

  const offset = codePoint - 0x10000;
  return `\\u${hex(0xd800 + (offset >> 10))}\\u${hex(0xdc00 + (offset & 0x3ff))}`;
}

/**
 * Unicode 编解码。
 *
 * 修复了旧实现的两处问题：
 *   1. 编码用 for...of 按「码点」遍历（旧代码用 charCodeAt，代理对分支永远走不到，
 *      emoji 会被拆成两个半字符）
 *   2. 解码的回调改成 (_, hex) —— 旧代码只声明了一个形参，拿到的是整个匹配
 *      "\u4F60" 而不是捕获组 "4F60"，parseInt 全部得到 NaN，正文变成 NUL
 *
 * 另外支持 \u{1F600} 这种带花括号的写法（部分工具会这样输出）。
 */
export function useUnicode() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<ResultType>('');

  const encode = useCallback(() => {
    if (!input.trim()) {
      setResult('请输入要编码的文本');
      setResultType('error');
      return;
    }

    let output = '';
    for (const char of input) {
      output += toEscaped(char.codePointAt(0) ?? 0);
    }
    setResult(output);
    setResultType('success');
  }, [input]);

  const decode = useCallback(() => {
    if (!input.trim()) {
      setResult('请输入要解码的 Unicode 文本');
      setResultType('error');
      return;
    }

    try {
      const output = input
        // \u{1F600} → 按码点解析
        .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, hex: string) =>
          String.fromCodePoint(Number.parseInt(hex, 16)),
        )
        // \u4F60 → 按码元解析（代理对的两段拼起来自然还原成 emoji）
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
          String.fromCharCode(Number.parseInt(hex, 16)),
        );

      if (output.includes('\\u')) {
        throw new Error('仍有未解析的转义序列');
      }

      setResult(output);
      setResultType('success');
    } catch {
      setResult('解码失败：请检查格式，例如 \\u4F60\\u597D 或 \\u{1F600}');
      setResultType('error');
    }
  }, [input]);

  const clear = useCallback(() => {
    setInput('');
    setResult('');
    setResultType('');
  }, []);

  return { input, setInput, result, resultType, encode, decode, clear };
}
