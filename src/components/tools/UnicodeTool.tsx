import { useUnicode } from './scripts/useUnicode'
import ToolResultBox from '../layout/ToolResultBox'
import SidebarBlock from '../layout/SidebarBlock'

function UnicodeTool() {
  const { input, setInput, result, resultType, encode, decode, clear } = useUnicode()

  function handleKeydown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'Enter') {
        event.preventDefault()
        encode()
      } else if (event.key === 'd') {
        event.preventDefault()
        decode()
      }
    }
  }

  return (
    <main className="content">
      <h1>Unicode 编解码</h1>

      <p>这是一个简单的 Unicode 编码和解码工具，支持文本与 Unicode 码点之间的相互转换。</p>

      <div className="form-group">
        <label className="form-label" htmlFor="inputText">输入文本：</label>
        <textarea
          className="textarea"
          id="inputText"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入要编码或解码的文本..."
          onKeyDown={handleKeydown}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-block" onClick={encode}>编码为 Unicode</button>
        <button className="btn btn-block" onClick={decode}>解码 Unicode</button>
        <button className="btn btn-block" onClick={clear}>清空</button>
      </div>

      <ToolResultBox label="结果：" result={result} resultType={resultType} />

      <SidebarBlock title="关于 Unicode">
        <ul>
          <li>Unicode 是一种字符编码标准，旨在统一世界上所有文字的编码</li>
          <li>支持超过 14 万个字符，涵盖世界上绝大多数文字系统</li>
          <li>Unicode 码点通常表示为 U+XXXX 格式，其中 XXXX 是十六进制数</li>
          <li>本工具支持 UTF-16 编码格式的 Unicode 转换</li>
        </ul>
      </SidebarBlock>
    </main>
  )
}

export default UnicodeTool