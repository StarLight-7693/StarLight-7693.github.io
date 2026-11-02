/**
 * 站点常量：站名、描述、作者、许可、仓库。
 * 前后端共用（页面 metadata 与页脚都读这一份），不要在这里 import 浏览器 API。
 */

export const SITE = {
  /** 站点名（顶栏标题、<title> 后缀都用它） */
  name: '栖小光的工具站',
  /** 一句话描述 */
  description: '一堆纯前端小工具：编码转换、时间戳、URL、游戏文本处理，数据不上传服务器。',
  /** 作者 */
  author: '栖小光',
  /** 作者主页（GitHub Pages 个人站） */
  authorUrl: 'https://github.com/StarLight-7693',
  /** 许可 */
  license: 'MIT',
  /** 技术栈（关于对话框与页脚展示） */
  tech: ['Next.js', 'React', 'TypeScript', 'SCSS', 'MDUI'],
  /** 开发域名 */
  url: 'https://www.skystarlight.top',
} as const;

/** 站内路由帮助函数：trailingSlash 模式下必须带尾斜杠 */
export function toolPath(slug: string): string {
  return `/tools/${slug}/`;
}
