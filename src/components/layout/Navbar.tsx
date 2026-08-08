function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        TP-RLX-LIGHT的小站
      </div>
      <div className="nav-links">
        <a href={`${window.location.origin}`} className="active" onClick={(e) => {
          e.preventDefault()
          window.history.pushState({}, '', '/')
          window.dispatchEvent(new PopStateEvent('popstate'))
        }}>首页</a>
        <a href={`${window.location.origin}/blog`}>博客</a>
        <a href="https://github.com/StarLight-7693" target="_blank">GitHub</a>
        <a href="https://space.bilibili.com/3632301571311734" target="_blank">B站</a>
      </div>
    </nav>
  )
}

export default Navbar