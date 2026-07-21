import { useEggyPartyMapTextProcessor } from './scripts/useEggyPartyMapTextProcessor'
import ToolResultBox from '../layout/ToolResultBox'
import SidebarBlock from '../layout/SidebarBlock'

function EggyPartyMapTextProcessor() {
  const { input, setInput, result, resultType, process, loadExample, clear } = useEggyPartyMapTextProcessor()

  function handleProcess() {
    process()
  }

  return (
    <main className="content">
      <h1>蛋仔派对地图文本处理</h1>

      <p>复制蛋仔派对游戏内的地图分享文本，粘贴到下方进行处理，即可生成标准格式的地图分享文案。</p>

      <div className="form-group">
        <label className="form-label" htmlFor="inputText">粘贴分享文本：</label>
        <textarea
          className="textarea"
          id="inputText"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="复制打开【蛋仔派对】，游玩地图《地图名》，地图码1234-5678。"
          rows={4}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-block" onClick={handleProcess}>
          处理文本
        </button>
        <button className="btn btn-block" onClick={loadExample}>
          加载示例
        </button>
        <button className="btn btn-block" onClick={clear}>
          清空
        </button>
      </div>

      <ToolResultBox label="处理结果：" result={result} resultType={resultType} />

      <SidebarBlock title="使用示例">
        <p><strong>输入格式：</strong></p>
        <code className="code-block">
          复制打开【蛋仔派对】，游玩地图《此图菜鸟都能过！》，地图码6040-1745。
        </code>
        <p><strong>输出结果：</strong></p>
        <pre className="code-block">
{`【蛋仔派对】地图《此图菜鸟都能过！》试玩

相关游戏：蛋仔派对
地图名：此图菜鸟都能过！
地图码：6040-1745
想要检验自己的技术实力吗？长按复制这段内容，打开蛋仔派对，来挑战这张地图吧~
(EggyPartyCopyMapTextProcessor Generate)`}
        </pre>
      </SidebarBlock>
    </main>
  )
}

export default EggyPartyMapTextProcessor
