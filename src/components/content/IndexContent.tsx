const gameIDList = [
  { name: '逃跑吧少年', id: 'WORKGROUP', imgLink: 'images/gameid/tpbsn_workgroup.webp' },
  { name: '蛋仔派对', id: '实况主灯塔', imgLink: 'images/gameid/eggyparty_skzdt.webp' }
]

function IndexContent() {
  return (
    <main className="content">
      <h1>关于我</h1>
      <p>你好，我是TP-RLX-LIGHT。时隔三年，我又用这个名字回归了！</p>
      <p>我是一个逃跑吧少年和蛋仔派对玩家（虽然现在我不怎么玩逃跑吧少年了），还玩其他的一些游戏，就比如说Minecraft。另外，我也喜欢编程（这个网站就是我做的）。</p>
      <p>你可知道？在以前的时候，我只是一个普普通通的内容创作者。如今，我会做的事情也越来越多了。</p>
      <h2>我的游戏ID</h2>
      <p>以下是我的游戏ID。欢迎加我好友。（仅列出部分）</p>
      {gameIDList.map((game, index) => (
        <div key={index}>
          <a href={game.imgLink} target="_blank">
            <img src={game.imgLink} className="screenshot-img" alt={`${game.name}：${game.id}`} style={{cursor: 'zoom-in'}} />
          </a>
          <p style={{textAlign: 'center'}}>{game.name}：{game.id}</p>
        </div>
      ))}
      <a href="https://github.com/StarLight-7693/StarLight-7693.github.io" className="action-btn" target="_blank">查看网站源代码</a>
      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#475569', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.2rem' }}>本网站基于React 19+TypeScript+SCSS构建，感谢AI部分协助。</p>
    </main>
  )
}

export default IndexContent