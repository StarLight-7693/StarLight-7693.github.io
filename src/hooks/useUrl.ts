import { useCallback, useState } from 'react';
import type { ResultType } from './useBase64';

/**
 * URL 编解码。
 *
 * 保留两种粒度（整串 URI / URI 组件），它们不可互相替代：
 *   encodeURI 保留 : / ? # & = 等分隔符，适合整条地址
 *   encodeURIComponent 连分隔符一起编码，适合拼在查询参数里的单段值
 */
export function useUrl() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<ResultType>('');

  const run = useCallback(
    (transform: (value: string) => string, emptyHint: string) => {
      if (!input.trim()) {
        setResult(emptyHint);
        setResultType('error');
        return;
      }
      try {
        setResult(transform(input));
        setResultType('success');
      } catch {
        setResult('转换失败：输入不是合法的百分号编码');
        setResultType('error');
      }
    },
    [input],
  );

  const encodeUrl = useCallback(
    () => run((value) => encodeURI(value), '请输入要编码的 URL'),
    [run],
  );

  const decodeUrl = useCallback(
    () => run((value) => decodeURI(value), '请输入要解码的 URL'),
    [run],
  );

  const encodeComponent = useCallback(
    () => run((value) => encodeURIComponent(value), '请输入要编码的 URL 组件'),
    [run],
  );

  const decodeComponent = useCallback(
    () => run((value) => decodeURIComponent(value), '请输入要解码的 URL 组件'),
    [run],
  );

  const clear = useCallback(() => {
    setInput('');
    setResult('');
    setResultType('');
  }, []);

  return {
    input,
    setInput,
    result,
    resultType,
    encodeUrl,
    decodeUrl,
    encodeComponent,
    decodeComponent,
    clear,
  };
}
