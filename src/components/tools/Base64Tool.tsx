import { useBase64 } from './scripts/useBase64'
import ToolResultBox from '../layout/ToolResultBox'
import SidebarBlock from '../layout/SidebarBlock'

function Base64Tool() {
  const { input, setInput, result, resultType, encode, decode, clear } = useBase64()

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
      <h1>Base64 编解码</h1>

      <p>这是一个简单的 Base64 编码和解码工具，支持文本的相互转换。</p>

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
        <button className="btn btn-block" onClick={encode}>编码为 Base64</button>
        <button className="btn btn-block" onClick={decode}>解码 Base64</button>
        <button className="btn btn-block" onClick={clear}>清空</button>
      </div>

      <ToolResultBox label="结果：" result={result} resultType={resultType} />

      <SidebarBlock title="关于 Base64">
        <ul>
          <li>Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方式</li>
          <li>常用于在文本环境中传输或存储二进制数据</li>
          <li>编码后的数据比原始数据大约增加 33%</li>
          <li>广泛应用于电子邮件、数据 URL、图片编码等场景</li>
        </ul>
      </SidebarBlock>
    </main>
  )
}

export default Base64Tool