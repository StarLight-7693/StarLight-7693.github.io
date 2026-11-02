/**
 * 工具注册表 —— 全站唯一数据源。
 *
 * 同时驱动：侧栏分组、首页卡片、generateStaticParams、generateMetadata、
 * 404 判定、图标名。新增一个工具 = 这里加一条 + components/tools/registry.tsx 加一行。
 */

export type ToolCategory = 'encoding' | 'time' | 'game';

export interface ToolMeta {
  /** URL 段（/tools/<slug>/），同时也是组件映射的 key */
  slug: string;
  /** 展示名 */
  name: string;
  /** 一句话说明（卡片与 meta description 共用） */
  desc: string;
  category: ToolCategory;
  /** Material Icons 连字名 */
  icon: string;
  /** 站内搜索与阅读用的关键词 */
  keywords: string[];
}

/** 分类元信息：侧栏分组标题与排序都读这里 */
export const TOOL_CATEGORIES: { key: ToolCategory; label: string }[] = [
  { key: 'encoding', label: '编码转换' },
  { key: 'time', label: '时间处理' },
  { key: 'game', label: '游戏工具' },
];

export const TOOLS: ToolMeta[] = [
  {
    slug: 'base64',
    name: 'Base64 编解码',
    desc: '文本与 Base64 互转，支持中文、emoji 与非法字节提示。',
    category: 'encoding',
    icon: 'code',
    keywords: ['base64', '编码', '解码', '中文'],
  },
  {
    slug: 'unicode',
    name: 'Unicode 编解码',
    desc: '文本与 \\uXXXX 码点互转，按码点处理，emoji 不会被拆坏。',
    category: 'encoding',
    icon: 'translate',
    keywords: ['unicode', '码点', '转义', 'emoji'],
  },
  {
    slug: 'url',
    name: 'URL 编解码',
    desc: '整串 URI 与 URI 组件两种编码方式，各自可逆。',
    category: 'encoding',
    icon: 'link',
    keywords: ['url', 'uri', 'encodeURI', 'encodeURIComponent'],
  },
  {
    slug: 'timestamp',
    name: '时间戳转换',
    desc: '秒 / 毫秒时间戳与本地时间、UTC 互转，支持取当前时间。',
    category: 'time',
    icon: 'schedule',
    keywords: ['timestamp', '时间戳', 'unix', 'utc', '日期'],
  },
  {
    slug: 'eggy-map-text',
    name: '蛋仔派对地图文本',
    desc: '把游戏内复制的分享文本整理成标准文案与短视频文案。',
    category: 'game',
    icon: 'sports_esports',
    keywords: ['蛋仔派对', '地图', '地图码', '文案'],
  },
];

/** 全部 slug（generateStaticParams 用） */
export const TOOL_SLUGS: string[] = TOOLS.map((tool) => tool.slug);

/** 按 slug 取工具元信息（不存在返回 undefined → 调用方 notFound()） */
export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

/** 按分类分组（空分组自动跳过） */
export function getGroupedTools(): { key: ToolCategory; label: string; tools: ToolMeta[] }[] {
  return TOOL_CATEGORIES.map((category) => ({
    ...category,
    tools: TOOLS.filter((tool) => tool.category === category.key),
  })).filter((group) => group.tools.length > 0);
}
