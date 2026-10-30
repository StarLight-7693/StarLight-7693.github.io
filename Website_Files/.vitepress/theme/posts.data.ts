import { createContentLoader } from 'vitepress';

export interface Post {
  title: string;
  url: string;
  date: string;
  author: string;
  categories: string[];
  tags: string[];
  description: string;
  sticky: boolean;
  excerpt: string | undefined;
  src: string | undefined;
}

declare const data: Post[];

export { data };

export default createContentLoader('posts/*.md', {
  excerpt: true,
  includeSrc: true,
  transform(raw): Post[] {
    const list = raw.map((p) => ({
      title: (p.frontmatter.title as string) || '',
      url: p.url,
      date: (p.frontmatter.date as string) || '',
      author: (p.frontmatter.author as string) || '',
      categories: (p.frontmatter.categories as string[]) || [],
      tags: (p.frontmatter.tags as string[]) || [],
      description: (p.frontmatter.description as string) || '',
      sticky: p.frontmatter.stickypost === true,
      excerpt: p.excerpt,
      src: p.src,
    }));

    list.sort((a, b) => {
      if (a.sticky !== b.sticky) {
        return a.sticky ? -1 : 1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return list;
  },
});
