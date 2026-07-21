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
    '长按复制这段内容，打开蛋仔派对，玩视频内同款地图~',
    '想体验这张超好玩的地图吗？长按复制这段内容，打开蛋仔派对就可以了~',
    '你好，我的小蛋仔，想要体验这张地图吗？只需要长按复制这段内容，然后打开蛋仔派对就能玩喽~',
    '想要挑战自己的极限吗？长按复制这段内容，打开蛋仔派对，开启你的冒险之旅吧~',
    '想要和你的蛋搭子一起玩这张地图？没问题！长按复制这段内容，打开蛋仔派对，然后约上你的蛋搭子和你一起玩就可以了~',
    '想要检验自己的技术实力吗？长按复制这段内容，打开蛋仔派对，来挑战这张地图吧~',
    '这张地图太难了，希望你能来挑战一下！长按复制这段内容，打开蛋仔派对，来试试你的技术吧~',
    '这张地图太好玩了，你也来试试吧！长按复制这段内容，打开蛋仔派对，来体验一下吧~',
    '如果你觉得不开心的话，不妨来玩一下这张地图吧！长按复制这段内容，打开蛋仔派对，撞走不开心~',
    '还在为找不到好玩的地图而发愁吗？那么你一定要来玩玩这张地图！长按复制这段内容，打开蛋仔派对，一起来玩吧~'
  ]
  return msgList[Math.floor(Math.random() * msgList.length)]
}

function generateOutput(mapName: string, mapCode: string): string {
  return `【蛋仔派对】地图《${mapName}》试玩

相关游戏：蛋仔派对
地图名：${mapName}
地图码：${mapCode}
${getExtraInformation()}
(EggyPartyCopyMapTextProcessor for TP-RLX-LIGHT's Website Generate)`
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
