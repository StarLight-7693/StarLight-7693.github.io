import { useCallback, useState } from 'react';
import type { ResultType } from './useBase64';

/** 本地时间：YYYY/MM/DD HH:mm:ss（24 小时制） */
function formatLocal(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/** 只保留 10 位以内按秒、其余按毫秒 —— 与大多数工具站的习惯一致 */
function toMilliseconds(raw: string): number {
  const value = Number.parseInt(raw, 10);
  return raw.length <= 10 ? value * 1000 : value;
}

/**
 * 时间戳转换。
 *
 * 旧实现的 getCurrentTimestamp 每次渲染都是新函数，却被塞进 useEffect 依赖，
 * 导致严格模式下多跑一轮（这里用 useCallback 固定引用）。
 */
export function useTimestamp() {
  const [timestampInput, setTimestampInput] = useState('');
  const [datetimeInput, setDatetimeInput] = useState('');
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<ResultType>('');

  const timestampToDatetime = useCallback(() => {
    const raw = timestampInput.trim();
    if (!raw) {
      setResult('请输入时间戳');
      setResultType('error');
      return;
    }
    if (!/^\d+$/.test(raw)) {
      setResult('转换失败：时间戳只能由数字组成');
      setResultType('error');
      return;
    }

    const ms = toMilliseconds(raw);
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) {
      setResult('转换失败：这个时间戳超出可表示范围');
      setResultType('error');
      return;
    }

    setDatetimeInput(date.toISOString().slice(0, 16));
    setResult(
      [
        `本地时间：${formatLocal(date)}`,
        `UTC 时间：${date.toUTCString()}`,
        `识别为：${raw.length <= 10 ? '秒级' : '毫秒级'}`,
      ].join('\n'),
    );
    setResultType('success');
  }, [timestampInput]);

  const datetimeToTimestamp = useCallback(() => {
    if (!datetimeInput) {
      setResult('请先选择日期时间');
      setResultType('error');
      return;
    }

    const date = new Date(datetimeInput);
    if (Number.isNaN(date.getTime())) {
      setResult('转换失败：日期时间格式不正确');
      setResultType('error');
      return;
    }

    const seconds = Math.floor(date.getTime() / 1000);
    setTimestampInput(String(seconds));
    setResult(
      [
        `秒级时间戳：${seconds}`,
        `毫秒级时间戳：${date.getTime()}`,
        `本地时间：${formatLocal(date)}`,
      ].join('\n'),
    );
    setResultType('success');
  }, [datetimeInput]);

  const fillCurrentTime = useCallback(() => {
    const now = new Date();
    const seconds = Math.floor(now.getTime() / 1000);

    setTimestampInput(String(seconds));
    setDatetimeInput(now.toISOString().slice(0, 16));
    setResult(
      [
        `当前毫秒时间戳：${now.getTime()}`,
        `当前秒级时间戳：${seconds}`,
        `当前本地时间：${formatLocal(now)}`,
      ].join('\n'),
    );
    setResultType('success');
  }, []);

  const clear = useCallback(() => {
    setTimestampInput('');
    setDatetimeInput('');
    setResult('');
    setResultType('');
  }, []);

  return {
    timestampInput,
    setTimestampInput,
    datetimeInput,
    setDatetimeInput,
    result,
    resultType,
    timestampToDatetime,
    datetimeToTimestamp,
    fillCurrent: fillCurrentTime,
    clear,
  };
}
