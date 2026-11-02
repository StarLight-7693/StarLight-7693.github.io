import { useCallback, useState } from 'react';

/** 工具结果的三态：成功 / 失败 / 还没算过 */
export type ResultType = 'success' | 'error' | '';

/**
 * Base64 编解码。
 *
 * 与旧实现的差别：不再用已废弃的 escape/unescape（它只处理 Latin-1，
 * 且对孤立的代理项会静默产出乱码），改为先转 UTF-8 字节再 btoa；
 * 解码时用 fatal 模式，非法 Base64 / 非法 UTF-8 都会抛出可读错误，
 * 而不是输出一堆替换字符。
 */
export function useBase64() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<ResultType>('');

  const encode = useCallback(() => {
    if (!input.trim()) {
      setResult('请输入要编码的文本');
      setResultType('error');
      return;
    }

    try {
      const bytes = new TextEncoder().encode(input);
      let binary = '';
      for (const byte of bytes) binary += String.fromCharCode(byte);
      setResult(btoa(binary));
      setResultType('success');
    } catch {
      setResult('编码失败：文本含无法编码的字符');
      setResultType('error');
    }
  }, [input]);

  const decode = useCallback(() => {
    if (!input.trim()) {
      setResult('请输入要解码的 Base64 文本');
      setResultType('error');
      return;
    }

    try {
      const binary = atob(input.trim());
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      // fatal: true —— 不是合法 UTF-8 就抛错，不静默替换成 �
      setResult(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
      setResultType('success');
    } catch {
      setResult('解码失败：不是合法的 Base64，或解码结果不是 UTF-8 文本');
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
