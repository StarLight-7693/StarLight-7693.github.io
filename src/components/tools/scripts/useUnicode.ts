import { useState } from 'react'

export function useUnicode() {
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
      let output = ''
      for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i)
        if (charCode <= 0xFFFF) {
          output += '\\u' + charCode.toString(16).toUpperCase().padStart(4, '0')
        } else {
          const highSurrogate = Math.floor((charCode - 0x10000) / 0x400) + 0xD800
          const lowSurrogate = ((charCode - 0x10000) % 0x400) + 0xDC00
          output += '\\u' + highSurrogate.toString(16).toUpperCase().padStart(4, '0') +
                    '\\u' + lowSurrogate.toString(16).toUpperCase().padStart(4, '0')
        }
      }
      setResult(output)
      setResultType('success')
    } catch {
      setResult('编码失败：输入包含无效字符')
      setResultType('error')
    }
  }

  function decode() {
    if (!input.trim()) {
      setResult('请输入要解码的Unicode文本')
      setResultType('error')
      return
    }
    try {
      const unicodeRegex = /\\u([0-9a-fA-F]{4})/g
      let output = input.replace(unicodeRegex, function(hex) {
        return String.fromCharCode(parseInt(hex, 16))
      })
      if (output.includes('\\u')) {
        throw new Error('无效的Unicode格式')
      }
      setResult(output)
      setResultType('success')
    } catch {
      setResult('解码失败：请输入有效的Unicode编码格式（如\\u4F60\\u597D）')
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
