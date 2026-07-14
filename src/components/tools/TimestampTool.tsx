import { useEffect } from 'react'
import { useTimestamp } from './scripts/useTimestamp'
import ToolResultBox from '../layout/ToolResultBox'
import SidebarBlock from '../layout/SidebarBlock'

function TimestampTool() {
  const {
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
  } = useTimestamp()

  useEffect(() => {
    getCurrentTimestamp()
  }, [getCurrentTimestamp])

  function onTimestampInput(value: string) {
    setTimestampInput(value)
    if (value.trim()) {
      timestampToDatetime()
    }
  }

  function onDatetimeChange(value: string) {
    setDatetimeInput(value)
    if (value) {
      datetimeToTimestamp()
    }
  }

  function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'Enter') {
        event.preventDefault()
        timestampToDatetime()
      } else if (event.key === 'd') {
        event.preventDefault()
        datetimeToTimestamp()
      } else if (event.key === 'n') {
        event.preventDefault()
        getCurrentTimestamp()
      }
    }
  }

  return (
    <main className="content">
      <h1>时间戳转换</h1>

      <p>这是一个简单的时间戳转换工具，支持时间戳与日期时间之间的相互转换。</p>

      <div className="form-group">
        <label className="form-label" htmlFor="timestampInput">时间戳：</label>
        <input
          type="text"
          className="input"
          id="timestampInput"
          value={timestampInput}
          onChange={(e) => onTimestampInput(e.target.value)}
          placeholder="请输入时间戳（秒或毫秒）"
          onKeyDown={handleKeydown}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="datetimeInput">日期时间：</label>
        <input
          type="datetime-local"
          className="input"
          id="datetimeInput"
          value={datetimeInput}
          onChange={(e) => onDatetimeChange(e.target.value)}
          onKeyDown={handleKeydown}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-block" onClick={timestampToDatetime}>时间戳 → 日期时间</button>
        <button className="btn btn-block" onClick={datetimeToTimestamp}>日期时间 → 时间戳</button>
        <button className="btn btn-block" onClick={getCurrentTimestamp}>获取当前时间戳</button>
        <button className="btn btn-block" onClick={clear}>清空</button>
      </div>

      <ToolResultBox label="转换结果：" result={result} resultType={resultType} />

      <SidebarBlock title="关于时间戳">
        <ul>
          <li>时间戳是从 1970 年 1 月 1 日 00:00:00 UTC 开始计算的秒数或毫秒数</li>
          <li>Unix 时间戳通常以秒为单位（10 位数字）</li>
          <li>JavaScript 时间戳以毫秒为单位（13 位数字）</li>
          <li>本工具自动识别秒级和毫秒级时间戳</li>
          <li>支持本地时间和 UTC 时间的转换</li>
        </ul>
      </SidebarBlock>
    </main>
  )
}

export default TimestampTool