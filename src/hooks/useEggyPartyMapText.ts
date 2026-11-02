import { useCallback, useState } from 'react';
import type { ResultType } from './useBase64';

/** 从《地图名》里取名字 */
function extractMapName(text: string): string {
  const match = text.match(/《([^》]+)》/);
  const name = match?.[1]?.trim();
  if (!name) throw new Error('没找到地图名：分享文本里要有《地图名》这样的书名号');
  return name;
}

/** 地图码：优先「地图码xxxx-xxxx」，退化为任意 4 位以上-若干位 的数字串 */
function extractMapCode(text: string): string {
  const labeled = text.match(/地图码\s*(\d{4,}-\d+)/);
  if (labeled?.[1]) return labeled[1].trim();

  const loose = text.match(/(\d{4,}-\d+)/);
  if (loose?.[1]) return loose[1];

  throw new Error('没找到地图码：分享文本里要有 6040-1745 这样的数字串');
}

// ---- 随机文案库 ----
const EXTRA_INFO = [
  '长按复制这段内容，打开蛋仔派对，玩视频内同款地图~',
  '想体验这张超好玩的地图吗？长按复制这段内容，打开蛋仔派对就可以了~',
  '小蛋仔，想要体验这张地图吗？只需要长按复制这段内容，然后打开蛋仔派对就能玩喽~',
  '想要挑战自己的极限吗？长按复制这段内容，打开蛋仔派对，开启你的冒险之旅吧~',
  '想要和你的蛋搭子一起玩这张地图？没问题！长按复制这段内容，打开蛋仔派对，然后约上你的蛋搭子和你一起玩就可以了~',
  '想要检验自己的技术实力吗？长按复制这段内容，打开蛋仔派对，来挑战这张地图吧~',
  '这张地图太难了，希望你能来挑战一下！长按复制这段内容，打开蛋仔派对，来试试你的技术吧~',
  '这张地图太好玩了，你也来试试吧！长按复制这段内容，打开蛋仔派对，来体验一下吧~',
  '如果你觉得不开心的话，不妨来玩一下这张地图吧！长按复制这段内容，打开蛋仔派对，撞走不开心~',
  '还在为找不到好玩的地图而发愁吗？那么你一定要来玩玩这张地图！长按复制这段内容，打开蛋仔派对，一起来玩吧~',
];

const VIDEO_PREFIX = [
  '快来快来！我发现了一张超好玩的地图',
  '挖到宝藏蛋仔地图啦',
  '被这张蛋仔地图狠狠拿捏住了',
  '蛋仔必玩宝藏地图分享',
  '谁还没玩过这张神仙蛋仔地图',
  '安利一款超有意思的蛋仔闯关图',
  '蛋仔地图推荐｜亲测好玩不踩雷',
  '闲得无聊？试试这张蛋仔地图',
  '蛋搭子速来集合！优质地图奉上',
  '近期玩过体验感拉满的蛋仔地图',
];

const TAGS = [
  '蛋仔派对_',
  '蛋仔日常',
  '蛋仔派对地图打卡',
  '蛋仔宝藏地图',
  '蛋仔地图推荐',
  '蛋仔奇思妙想计划',
  '蛋仔旅行家',
  '蛋仔带你看世界',
  '蛋仔派对创计划',
  '可爱蛋仔',
];

/** 等概率取一条 */
function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? '';
}

/** Fisher–Yates 洗牌：旧实现用 sort(() => Math.random() - 0.5)，分布不均匀 */
function shuffle<T>(list: readonly T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

/** 随机取 3 个话题标签 */
function randomTags(): string {
  return shuffle(TAGS)
    .slice(0, 3)
    .map((tag) => `#${tag}`)
    .join(' ');
}

function buildOutput(mapName: string, mapCode: string, shortVideo: boolean): string {
  if (shortVideo) {
    return `${pick(VIDEO_PREFIX)}《${mapName}》，地图码是${mapCode}。${pick(EXTRA_INFO)} #蛋仔派对 ${randomTags()}`;
  }

  return [
    `【蛋仔派对】地图《${mapName}》试玩`,
    '',
    '相关游戏：蛋仔派对',
    `地图名：${mapName}`,
    `地图码：${mapCode}`,
    pick(EXTRA_INFO),
  ].join('\n');
}

/**
 * 蛋仔派对地图文本处理。
 *
 * 相对旧实现：去掉没人调用的 copyResult（复制统一走 lib/copy），
 * 随机排序换成 Fisher–Yates，其余解析规则保持一致。
 */
export function useEggyPartyMapText() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<ResultType>('');

  const process = useCallback(
    (shortVideo = false) => {
      const text = input.trim();
      if (!text) {
        setResult('请先把游戏里复制的分享文本粘贴进来');
        setResultType('error');
        return;
      }

      try {
        setResult(buildOutput(extractMapName(text), extractMapCode(text), shortVideo));
        setResultType('success');
      } catch (error) {
        setResult((error as Error).message);
        setResultType('error');
      }
    },
    [input],
  );

  const loadExample = useCallback(() => {
    setInput('复制打开【蛋仔派对】，游玩地图《此图菜鸟都能过！》，地图码6040-1745。');
    setResult('');
    setResultType('');
  }, []);

  const clear = useCallback(() => {
    setInput('');
    setResult('');
    setResultType('');
  }, []);

  return { input, setInput, result, resultType, process, loadExample, clear };
}
