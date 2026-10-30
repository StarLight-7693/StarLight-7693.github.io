import { link } from 'node:fs';
import { /* createContentLoader, */ defineConfig, type HeadConfig } from 'vitepress';
import { RssPlugin } from 'vitepress-plugin-rss';

const BASE_URL = (process.env.BASE_URL || 'https://www.skystarlight.top').replace(/\/+$/, '');

/** 站点标题 */
const SITE_TITLE = '青春纪念册 · TP-RLX-LIGHT 个人网站';

/** 站点描述 */
const SITE_DESC = 'TP-RLX-LIGHT 个人网站，记录青春的点滴，分享生活的美好。';

/** 站点作者 */
const SITE_AUTHOR = 'StarLight-7693';

/** 站点关键词 */
const SITE_KEYWORDS = 'ColdFieldObserver,冷域观者,AloneVoyager,冷域航者,冷落的小情绪,实况主灯塔,逃少音乐档案馆,逃跑吧少年背景音乐,CFObserver,TP-RLX-STAR-LIGHT,TP-RLX-LIGHT,StarLight-7693,SL-7693';

export default defineConfig({
  title: SITE_TITLE,
  description: SITE_DESC,
  lang: 'zh-CN',
  base: '/',
  appearance: false,
  lastUpdated: true,
  transformHead({ pageData, head }) {
    const author = String(pageData.frontmatter?.author || SITE_AUTHOR);
    const pageTitle = pageData.title || SITE_TITLE;
    const pageDescription = pageData.description || SITE_DESC;
    const pagePath = pageData.relativePath.replace(/\.md$/, '.html');
    const canonicalPath = pagePath === 'index.html'
      ? '/'
      : pagePath.replace(/(^|\/)index\.html$/, '$1');
    const canonicalUrl = new URL(canonicalPath, `${BASE_URL}/`).href;

    /** head数据 */
    const headConfig: HeadConfig[] = [
      ['meta', { name: 'author', content: author }],
      ['meta', { name: 'keywords', content: SITE_KEYWORDS }],
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['link', { rel: 'alternate', type: 'application/rss+xml', title: SITE_TITLE, href: `${BASE_URL}/rss.xml` }],
      ['link', { rel: 'icon', type: 'image/png', href: `${BASE_URL}/images/favicon.ico` }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:type', content: pageData.frontmatter?.date ? 'article' : 'website' }],
      ['meta', { property: 'og:site_name', content: SITE_TITLE }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
    ];
    head.push(...headConfig);

    const themeInit = `(function(){try{var t=localStorage.getItem('sl-theme')||'auto';document.documentElement.dataset.theme=t;}catch(e){}})();`;
    head.push(['script', {}, themeInit]);
  },
  vite: {
    plugins: [
      RssPlugin({
        baseUrl: BASE_URL,
        title: SITE_TITLE,
        description: SITE_DESC,
        language: 'zh-CN',
        copyright: 'Copyright © 2003 小飞侠',
        author: { name: '小飞侠' },
        filename: 'rss.xml',
        ignoreHome: true,
        log: true,
        filter: (post) => {
          if (post.url === '/' || post.url === '/index.html') {
            return false;
          }
          return true;
        },
      }),
    ],
  },
});
