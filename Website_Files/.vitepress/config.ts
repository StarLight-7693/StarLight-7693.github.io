import { defineConfig } from 'vitepress';
import { RssPlugin } from 'vitepress-plugin-rss';

const BASE_URL = (process.env.BASE_URL || 'https://www.skystarlight.top').replace(/\/+$/, '');

/** 站点标题 */
const SITE_TITLE = '青春纪念册';

/** 站点描述 */
const SITE_DESC = '2003 级信息技术课个人博客 · 复古风';

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
  head: [
    ['meta', { name: 'keywords', content: SITE_KEYWORDS }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: 'images/favicon.ico' }],
  ],
  transformHead({ pageData, head }) {
    const author = String(pageData.frontmatter?.author || SITE_AUTHOR);
    const pageTitle = pageData.title || SITE_TITLE;
    const pageDescription = pageData.description || SITE_DESC;
    const pagePath = pageData.relativePath.replace(/\.md$/, '.html');
    const canonicalPath = pagePath === 'index.html'
      ? '/'
      : pagePath.replace(/(^|\/)index\.html$/, '$1');
    const canonicalUrl = new URL(canonicalPath, `${BASE_URL}/`).href;

    head.push(['meta', { name: 'author', content: author }]);
    head.push(['link', { rel: 'canonical', href: canonicalUrl }]);
    head.push(['meta', { property: 'og:site_name', content: SITE_TITLE }]);
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }]);
    head.push(['meta', { property: 'og:type', content: pageData.frontmatter?.date ? 'article' : 'website' }]);
    head.push(['meta', { property: 'og:title', content: pageTitle }]);
    head.push(['meta', { property: 'og:description', content: pageDescription }]);
    head.push(['meta', { property: 'og:url', content: canonicalUrl }]);
    head.push(['meta', { name: 'twitter:card', content: 'summary' }]);
    head.push(['meta', { name: 'twitter:title', content: pageTitle }]);
    head.push(['meta', { name: 'twitter:description', content: pageDescription }]);

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
