interface SidebarProps {
  activePage: string
  onPageChange: (page: string) => void
}

function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const navItems = [
    { name: '关于我', key: 'index' },
    { name: '友情链接', key: 'links' },
    { name: '工具集', key: 'tools' }
  ]

  const toolItems = [
    { name: 'Base64 编解码', key: 'tools/base64' },
    { name: 'Unicode 编解码', key: 'tools/unicode' },
    { name: '时间戳转换', key: 'tools/timestamp' },
    { name: 'URL 编解码', key: 'tools/url' },
    { name: '蛋仔派对地图文本处理', key: 'tools/eggypartymaptextprocessor' }
  ]

  const isToolActive = activePage.startsWith('tools')

  return (
    <aside className="sidebar">
      <h3>导航</h3>
      <ul>
        {navItems.map((item) => (
          <li key={item.key}>
            <a
              href={`${window.location.origin}/${item.key}`}
              className={activePage === item.key ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(item.key)
              }}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      {isToolActive && (
        <>
          <h3 style={{ marginTop: '1.5rem' }}>工具</h3>
          <ul>
            {toolItems.map((item) => (
              <li key={item.key}>
                <a
                  href={`${window.location.origin}/${item.key}`}
                  className={activePage === item.key ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(item.key)
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="sidebar-meta">
        <span>2022-2026 TP-RLX-LIGHT</span>
        <span>本网站由GitHub Pages托管，基于React 19构建。</span>
      </div>
    </aside>
  )
}

export default Sidebar