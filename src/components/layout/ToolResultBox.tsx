import { useState } from 'react'

interface ToolResultBoxProps {
  label?: string
  result: string
  resultType?: 'success' | 'error' | ''
  placeholder?: string
}

function ToolResultBox({
  label = '结果：',
  result,
  resultType = '',
  placeholder = '结果将显示在这里...'
}: ToolResultBoxProps) {
  const [copyText, setCopyText] = useState('')

  const displayText = result || placeholder

  const canCopy = result && result !== placeholder && resultType !== 'error'

  async function handleCopy() {
    if (!canCopy) {
      return
    }
    try {
      await navigator.clipboard.writeText(result)
      setCopyText('已复制！')
      setTimeout(() => setCopyText(''), 2000)
    } catch {
      setCopyText('复制失败')
      setTimeout(() => setCopyText(''), 2000)
    }
  }

  return (
    <div className="form-group tool-result-group">
      <label className="form-label">{label}</label>
      <div className={`tool-result-box ${resultType}`}>{displayText}</div>
      {canCopy && (
        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
          {copyText || '复制结果'}
        </button>
      )}
    </div>
  )
}

export default ToolResultBox