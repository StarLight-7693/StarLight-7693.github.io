import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import IndexContent from './components/content/IndexContent'
import FriendLinksContent from './components/content/FriendLinksContent'
import ToolsContent from './components/content/ToolsContent'
import Base64Tool from './components/tools/Base64Tool'
import UnicodeTool from './components/tools/UnicodeTool'
import TimestampTool from './components/tools/TimestampTool'
import UrlTool from './components/tools/UrlTool'
import EggyPartyMapTextProcessor from './components/tools/EggyPartyMapTextProcessor'
import NotFoundContent from './components/content/NotFoundContent'

type PageKey =
  | 'index'
  | 'links'
  | 'tools'
  | 'tools/base64'
  | 'tools/unicode'
  | 'tools/timestamp'
  | 'tools/url'
  | 'tools/eggypartymaptextprocessor'
  | '404'

// 路径到页面的映射
const pathToPage: Record<string, PageKey> = {
  '/': 'index',
  '/index': 'index',
  '/links': 'links',
  '/tools': 'tools',
  '/tools/base64': 'tools/base64',
  '/tools/unicode': 'tools/unicode',
  '/tools/timestamp': 'tools/timestamp',
  '/tools/url': 'tools/url',
  '/tools/eggypartymaptextprocessor': 'tools/eggypartymaptextprocessor'
}

// 页面到路径的映射
const pageToPath: Record<PageKey, string> = {
  index: '/',
  links: '/links',
  tools: '/tools',
  'tools/base64': '/tools/base64',
  'tools/unicode': '/tools/unicode',
  'tools/timestamp': '/tools/timestamp',
  'tools/url': '/tools/url',
  'tools/eggypartymaptextprocessor': '/tools/eggypartymaptextprocessor',
  '404': '/404'
}

function App() {
  const [activePage, setActivePage] = useState<PageKey>('index')

  // 根据当前路径设置页面
  useEffect(() => {
    const path = window.location.pathname
    const basePath = '/starlight-7693.github.io'
    const normalizedPath = path.startsWith(basePath)
      ? path.slice(basePath.length) || '/'
      : path || '/'

    const page = pathToPage[normalizedPath] || '404'
    setActivePage(page)
  }, [])

  // 监听浏览器历史变化
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const basePath = '/starlight-7693.github.io'
      const normalizedPath = path.startsWith(basePath)
        ? path.slice(basePath.length) || '/'
        : path || '/'

      const page = pathToPage[normalizedPath] || '404'
      setActivePage(page)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // 页面切换处理
  const handlePageChange = (page: PageKey) => {
    setActivePage(page)
    const path = pageToPath[page]
    window.history.pushState({}, '', path)
  }

  // 渲染当前页面内容
  const renderContent = () => {
    switch (activePage) {
      case 'index':
        return <IndexContent />
      case 'links':
        return <FriendLinksContent />
      case 'tools':
        return <ToolsContent onNavigate={(path) => handlePageChange(pathToPage[path] || '404')} />
      case 'tools/base64':
        return <Base64Tool />
      case 'tools/unicode':
        return <UnicodeTool />
      case 'tools/timestamp':
        return <TimestampTool />
      case 'tools/url':
        return <UrlTool />
      case 'tools/eggypartymaptextprocessor':
        return <EggyPartyMapTextProcessor />
      case '404':
        return <NotFoundContent onGoHome={() => handlePageChange('index')} />
      default:
        return <IndexContent />
    }
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="main-grid">
        <Sidebar
          activePage={activePage}
          onPageChange={(page) => handlePageChange(page as PageKey)}
        />
        {renderContent()}
      </div>
    </div>
  )
}

export default App