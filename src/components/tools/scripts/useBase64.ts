import { useState } from 'react'

export function useBase64() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState<'success' | 'error' | ''>('')

  function encode() {
    if (!input.trim()) {
      setResult('请输入要编码的文本')
      setResultType('error')
      return
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setResult(encoded)
      setResultType('success')
    } catch {
      setResult('编码失败：输入包含无效字符')
      setResultType('error')
    }
  }

  function decode() {
    if (!input.trim()) {
      setResult('请输入要解码的Base64文本')
      setResultType('error')
      return
    }
    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setResult(decoded)
      setResultType('success')
    } catch {
      setResult('解码失败：请输入有效的Base64编码')
      setResultType('error')
    }
  }

  function clear() {
    setInput('')
    setResult('')
    setResultType('')
  }

  return { input, setInput, result, resultType, encode, decode, clear }
}
