import { useState } from 'react'

export function useUrl() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState<'success' | 'error' | ''>('')

  function encodeURL() {
    if (!input.trim()) {
      setResult('请输入要编码的URL文本')
      setResultType('error')
      return
    }
    try {
      setResult(encodeURI(input))
      setResultType('success')
    } catch {
      setResult('编码失败：输入包含无效字符')
      setResultType('error')
    }
  }

  function decodeURL() {
    if (!input.trim()) {
      setResult('请输入要解码的URL文本')
      setResultType('error')
      return
    }
    try {
      setResult(decodeURI(input))
      setResultType('success')
    } catch {
      setResult('解码失败：请输入有效的URL编码')
      setResultType('error')
    }
  }

  function encodeComponent() {
    if (!input.trim()) {
      setResult('请输入要编码的URL组件文本')
      setResultType('error')
      return
    }
    try {
      setResult(encodeURIComponent(input))
      setResultType('success')
    } catch {
      setResult('编码失败：输入包含无效字符')
      setResultType('error')
    }
  }

  function decodeComponent() {
    if (!input.trim()) {
      setResult('请输入要解码的URL组件文本')
      setResultType('error')
      return
    }
    try {
      setResult(decodeURIComponent(input))
      setResultType('success')
    } catch {
      setResult('解码失败：请输入有效的URL组件编码')
      setResultType('error')
    }
  }

  function clear() {
    setInput('')
    setResult('')
    setResultType('')
  }

  return { input, setInput, result, resultType, encodeURL, decodeURL, encodeComponent, decodeComponent, clear }
}
