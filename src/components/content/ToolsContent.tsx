interface ToolsContentProps {
  onNavigate?: (path: string) => void
}

function ToolsContent({ onNavigate }: ToolsContentProps) {
  const tools = [
    {
      key: 'base64',
      name: 'Base64 编解码工具',
      desc: '支持文本与 Base64 编码之间的相互转换',
      icon: '🔐',
      tag: '编码工具'
    },
    {
      key: 'unicode',
      name: 'Unicode 编解码工具',
      desc: '支持文本与 Unicode 码点之间的相互转换',
      icon: '🔢',
      tag: '编码工具'
    },
    {
      key: 'timestamp',
      name: '时间戳转换工具',
      desc: '支持时间戳与日期时间之间的相互转换',
      icon: '🕐',
      tag: '时间工具'
    },
    {
      key: 'url',
      name: 'URL 编解码工具',
      desc: '支持 URL 字符串的编码和解码操作',
      icon: '🔗',
      tag: '编码工具'
    },
    {
      key: 'eggypartymaptextprocessor',
      name: '蛋仔派对地图文本处理器',
      desc: '快速解析游戏内复制的地图分享文本',
      icon: '🎮',
      tag: '游戏工具'
    }
  ]

  const handleClick = (key: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(`/tools/${key}`)
    }
  }

  return (
    <main className="content">
      <h1>工具集</h1>

      <div className="tool-grid">
        {tools.map((tool) => (
          <a
            key={tool.key}
            href={`/tools/${tool.key}`}
            className="tool-card"
            onClick={(e) => handleClick(tool.key, e)}
          >
            <div className="tool-icon">{tool.icon}</div>
            <h4>{tool.name}</h4>
            <p>{tool.desc}</p>
            <span className="tool-tag">{tool.tag}</span>
          </a>
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#475569', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.2rem' }}>
        更多工具正在开发中...
      </p>
    </main>
  )
}

export default ToolsContent