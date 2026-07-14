import { useState } from 'react'

function extractMapName(text: string): string {
  const match = text.match(/《([^》]+)》/)
  if (match && match[1]) {
    return match[1].trim()
  }
  throw new Error('未找到地图名（未匹配到《地图名》）')
}

function extractMapCode(text: string): string {
  let match = text.match(/地图码(\d+[-]?\d+)/)
  if (match && match[1]) {
    return match[1].trim()
  }
  match = text.match(/(\d{4,}-\d+)/)
  if (match && match[1]) {
    return match[1]
  }
  throw new Error('未找到地图码')
}

function getExtraInformation(): string {
  const msgList = [
    '复制内容打开蛋仔派对，就能体验同款地图啦~',
    '超好玩的蛋仔地图，复制一下马上就能玩哦~',
    '快来试试这张可爱地图，复制内容进入游戏就可以啦~',
    '软软萌萌的蛋仔地图等你来玩，复制内容开启冒险吧~',
    '喜欢这张地图吗？复制内容打开蛋仔就能游玩咯~',
    '蛋仔专属趣味地图，一键复制，快乐上线~',
    '奔赴蛋仔乐园啦，复制内容即可体验同款地图~',
    '圆滚滚的蛋仔世界，这张地图超有趣，快来玩呀~',
    '把地图带回家~复制内容，在蛋仔派对里尽情玩耍吧~',
    '可爱地图已就位，复制内容，和蛋仔一起闯关吧~'
  ]
  return msgList[Math.floor(Math.random() * msgList.length)]
}

function generateOutput(mapName: string, mapCode: string): string {
  return `【蛋仔派对】地图《${mapName}》试玩

相关游戏：蛋仔派对
地图名：${mapName}
地图码：${mapCode}
${getExtraInformation()}
(EggyPartyCopyMapTextProcessor Generate)`
}

export function useEggyPartyMapTextProcessor() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState<'success' | 'error' | ''>('')
  const [error, setError] = useState('')

  function process() {
    const text = input.trim()
    if (!text) {
      setResult('请输入要处理的文本')
      setResultType('error')
      setError('')
      return
    }
    try {
      const mapName = extractMapName(text)
      const mapCode = extractMapCode(text)
      const output = generateOutput(mapName, mapCode)
      setResult(output)
      setResultType('success')
      setError('')
    } catch (error) {
      const message = (error as Error).message
      setResult(message)
      setResultType('error')
      setError(message)
    }
  }

  function loadExample() {
    setInput('复制打开【蛋仔派对】，游玩地图《此图菜鸟都能过！》，地图码6040-1745。')
  }

  function clear() {
    setInput('')
    setResult('')
    setResultType('')
    setError('')
  }

  async function copyResult() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      return true
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = result
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        return true
      } catch {
        return false
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }

  return { input, setInput, result, resultType, error, process, loadExample, clear, copyResult }
}
