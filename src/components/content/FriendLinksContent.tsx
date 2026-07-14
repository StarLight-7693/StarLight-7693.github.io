function FriendLinksContent() {
  const links = [
    { name: '冷域观者的个人网站', url: 'https://coldfieldobserver.github.io', desc: '基于Vue3构建', icon: `${window.location.origin}/images/friendlinkicon/coldfieldobserver.webp` },
    { name: '蛋仔资源站', url: 'https://eggyreshub.wordpress.com', desc: '一站式获取蛋仔派对相关资源', icon: `${window.location.origin}/images/friendlinkicon/eggyreshub.webp` },
    { name: '逃少音乐档案馆', url: 'https://space.bilibili.com/3632301571311734', desc: '《逃跑吧！少年》游戏背景音乐收集和存档基地', icon: `${window.location.origin}/images/friendlinkicon/dmmdzzmusicarchive.webp` },
    { name: 'React', url: 'https://react.docschina.org', desc: '一个用于构建用户界面的JavaScript库', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    { name: 'TypeScript', url: 'https://www.typescriptlang.org/zh', desc: '一个用于类型检查的JavaScript超集', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-plain.svg' },
    { name: 'Node.js', url: 'https://nodejs.org/zh-cn', desc: '一个基于Chrome V8引擎的JavaScript运行环境', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    { name: 'Vite', url: 'https://cn.vitejs.dev', desc: '一个用于前端开发的构建工具', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg' },
    { name: 'Sass', url: 'https://www.sass.hk', desc: '一个用于扩展CSS的预处理器', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg' },
    { name: 'HTML5', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML', desc: '一个用于创建网页的标记语言', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-plain.svg' }
  ]

  return (
    <main className="content">
      <h1>友情链接</h1>

      <div className="link-grid">
        {links.map((link, index) => (
          <a key={index} href={link.url} className="link-card" target="_blank">
            <img src={link.icon} alt={link.name} className="link-icon" />
            <div className="link-info">
              <h4>{link.name}</h4>
              <p>{link.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#475569', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.2rem' }}>
        部分链接可能会失效，我如果有时间会及时更新的。
      </p>
    </main>
  )
}

export default FriendLinksContent
