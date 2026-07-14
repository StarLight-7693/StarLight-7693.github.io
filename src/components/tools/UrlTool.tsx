import { useState, useEffect } from 'react'
import { useUrl } from './scripts/useUrl'
import ToolResultBox from '../layout/ToolResultBox'
import SidebarBlock from '../layout/SidebarBlock'

function UrlTool() {
  const {
    input,
    setInput,
    result,
    resultType,
    encodeURL,
    decodeURL,
    encodeComponent,
    decodeComponent,
    clear
  } = useUrl()
  const [placeholder, setPlaceholder] = useState('请输入要编码或解码的 URL 文本...')

  const exampleText = '示例：https://example.com/测试页面?参数=值&name=张三'

  useEffect(() => {
    setPlaceholder(exampleText)
  }, [])

  function loadExample() {
    setInput(exampleText)
  }

  function handleKeydown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'Enter') {
        event.preventDefault()
        encodeURL()
      } else if (event.key === 'd') {
        event.preventDefault()
        decodeURL()
      } else if (event.key === 'e') {
        event.preventDefault()
        encodeComponent()
      }
    }
  }

  return (
    <main className="content">
      <h1>URL 编解码</h1>

      <p>这是一个简单的 URL 编码和解码工具，支持 URL 字符串的编码和解码操作。</p>

      <div className="form-group">
        <label className="form-label" htmlFor="inputText">输入文本：</label>
        <textarea
          className="textarea"
          id="inputText"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeydown}
        />
        <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={loadExample}>
          加载示例
        </button>
      </div>

      <div className="btn-group">
        <button className="btn btn-block" onClick={encodeURL}>编码 URL</button>
        <button className="btn btn-block" onClick={decodeURL}>解码 URL</button>
        <button className="btn btn-block" onClick={encodeComponent}>编码 URL 组件</button>
        <button className="btn btn-block" onClick={decodeComponent}>解码 URL 组件</button>
        <button className="btn btn-block" onClick={clear}>清空</button>
      </div>

      <ToolResultBox label="结果：" result={result} resultType={resultType} />

      <SidebarBlock title="关于 URL 编码">
        <ul>
          <li>URL 编码用于将特殊字符转换为 % 后跟两位十六进制数的格式</li>
          <li>encodeURI() 用于编码整个 URL，保留合法字符</li>
          <li>encodeURIComponent() 用于编码 URL 组件，编码更多字符</li>
          <li>空格会被编码为 %20，中文字符会被编码为 UTF-8 格式</li>
          <li>本工具支持完整的 URL 编码和解码功能</li>
        </ul>
      </SidebarBlock>
    </main>
  )
}

export default UrlTool