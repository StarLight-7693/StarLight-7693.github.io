interface NotFoundContentProps {
  onGoHome?: () => void
}

function getRandomErrReason(): string {
  const reasonList = [
    '跑丢了',
    '飞走了',
    '去玩蛋仔派对了',
    '去玩逃跑吧少年了',
    '去玩Minecraft了',
    '去玩保卫萝卜了',
    '去玩PVZ2了',
    '被Rick Astley骗走了',
  ]
  return reasonList[Math.floor(Math.random() * reasonList.length)]
}

function NotFoundContent({ onGoHome }: NotFoundContentProps) {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <main className="content">
      <h1>找不到页面</h1>

      <p>{`你想要看的页面${getRandomErrReason()}，我找不到它`}</p>

      <iframe
        src="https://player.bilibili.com/player.html?isOutside=true&aid=80433022&bvid=BV1GJ411x7h7&cid=137649199&p=1"
        allowFullScreen={true}
        loading={"lazy"}
        style={{ maxWidth: '100%', aspectRatio: '16 / 9', border: 'none'}}
      ></iframe>

      <a 
        href="#"
        className="action-btn"
        style={{ cursor: 'pointer', border: 'none' }}
        onClick={(e) => {
          e.preventDefault()
          handleGoHome()
        }}
      >返回首页</a>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#475569', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.2rem' }}>
        你知道吗？“你被骗了”是2021年在网络平台广泛传播的网络流行语，其表现形式为通过具有误导性的标题或封面吸引用户点击，实际内容却跳转至瑞克·艾斯利（Rick Astley）的《Never Gonna Give You Up》音乐视频。该现象因2021年11月前后相关恶搞视频的大量传播而再次流行。
      </p>
    </main>
  )
}

export default NotFoundContent