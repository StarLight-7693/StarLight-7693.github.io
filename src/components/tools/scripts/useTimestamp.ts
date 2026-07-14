import { useState } from 'react'

function formatLocalTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export function useTimestamp() {
  const [timestampInput, setTimestampInput] = useState('')
  const [datetimeInput, setDatetimeInput] = useState('')
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState<'success' | 'error' | ''>('')

  function timestampToDatetime() {
    const val = timestampInput.trim()
    if (!val) {
      setResult('请输入时间戳')
      setResultType('error')
      return
    }
    try {
      if (!/^\d+$/.test(val)) {
        throw new Error('时间戳必须为数字')
      }
      let ts = parseInt(val, 10)
      if (val.length <= 10) {
        ts *= 1000
      }
      const date = new Date(ts)
      if (isNaN(date.getTime())) {
        throw new Error('无效的时间戳')
      }
      const localTime = formatLocalTime(date)
      const utcTime = date.toUTCString()
      const isoString = date.toISOString().slice(0, 16)
      setDatetimeInput(isoString)
      setResult(`本地时间：${localTime}\nUTC时间：${utcTime}\n时间戳类型：${val.length <= 10 ? '秒级' : '毫秒级'}`)
      setResultType('success')
    } catch (error) {
      setResult(`转换失败：${(error as Error).message}`)
      setResultType('error')
    }
  }

  function datetimeToTimestamp() {
    if (!datetimeInput) {
      setResult('请选择日期时间')
      setResultType('error')
      return
    }
    try {
      const date = new Date(datetimeInput)
      if (isNaN(date.getTime())) {
        throw new Error('无效的日期时间')
      }
      const tsSeconds = Math.floor(date.getTime() / 1000)
      const tsMilliseconds = date.getTime()
      setTimestampInput(String(tsSeconds))
      const localTime = formatLocalTime(date)
      setResult(`秒级时间戳：${tsSeconds}\n毫秒级时间戳：${tsMilliseconds}\n本地时间：${localTime}`)
      setResultType('success')
    } catch (error) {
      setResult(`转换失败：${(error as Error).message}`)
      setResultType('error')
    }
  }

  function getCurrentTimestamp() {
    const now = new Date()
    const tsSeconds = Math.floor(now.getTime() / 1000)
    const tsMilliseconds = now.getTime()
    setTimestampInput(String(tsSeconds))
    const isoString = now.toISOString().slice(0, 16)
    setDatetimeInput(isoString)
    const localTime = formatLocalTime(now)
    setResult(`当前时间戳（毫秒）：${tsMilliseconds}\n当前时间戳（秒）：${tsSeconds}\n当前本地时间：${localTime}`)
    setResultType('success')
  }

  function clear() {
    setTimestampInput('')
    setDatetimeInput('')
    setResult('')
    setResultType('')
  }

  return {
    timestampInput,
    setTimestampInput,
    datetimeInput,
    setDatetimeInput,
    result,
    resultType,
    timestampToDatetime,
    datetimeToTimestamp,
    getCurrentTimestamp,
    clear
  }
}
