import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolBody from '@/components/tools/ToolBody';
import { TOOL_SLUGS, getTool } from '@/data/tools';

// ============================================================
// 工具页（动态段 + 全量静态生成）
// ------------------------------------------------------------
// output: 'export' 要求动态段必须给出全部路径，靠 generateStaticParams；
// 未登记的 slug 在构建期就不存在，直接 notFound()（产物里落 404.html）。
// ============================================================

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return TOOL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: '工具不存在' };

  return {
    title: tool.name,
    description: tool.desc,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}/` },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <article className="tool-page">
      <header className="tool-header">
        <span className="tool-header-icon" aria-hidden="true">
          <mdui-icon name={tool.icon}></mdui-icon>
        </span>
        <div>
          <h1 className="tool-title">{tool.name}</h1>
          <p className="tool-desc">{tool.desc}</p>
        </div>
      </header>

      <ToolBody slug={tool.slug} />
    </article>
  );
}
