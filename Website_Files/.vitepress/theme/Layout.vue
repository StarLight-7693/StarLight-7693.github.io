<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useData } from 'vitepress';
import LeftSidebar from './components/LeftSidebar.vue';
import RightSidebar from './components/RightSidebar.vue';
import BlogIndex from './components/BlogIndex.vue';

const route = useRoute();
const { frontmatter, title } = useData();

onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('button.copy');
    if (!btn) {
      return;
    }
    const block = btn.closest('div[class*="language-"]');
    if (!block) {
      return;
    }
    const pre = block.querySelector('pre');
    if (!pre) {
      return;
    }
    navigator.clipboard.writeText(pre.textContent || '').then(() => {
      btn.classList.add('copied');
      window.setTimeout(() => {
        btn.classList.remove('copied');
      }, 1500);
    });
  });
});

const isHome = computed(() => route.path === '/');

const postTitle = computed(() => {
  const fm = frontmatter.value as Record<string, unknown> | undefined;
  if (fm && typeof fm.title === 'string' && fm.title) {
    return fm.title;
  }
  return (title.value as string) || '';
});

const postMeta = computed(() => {
  const fm = (frontmatter.value || {}) as Record<string, unknown>;
  const cats = Array.isArray(fm.categories) ? (fm.categories as string[]).join('、') : '';
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]).join('、') : '';
  const parts: string[] = [];
  if (typeof fm.author === 'string' && fm.author) {
    parts.push(`作者: ${fm.author}`);
  }
  if (typeof fm.date === 'string' && fm.date) {
    parts.push(`日期: ${fm.date}`);
  }
  if (cats) {
    parts.push(`分类: ${cats}`);
  }
  if (tags) {
    parts.push(`标签: ${tags}`);
  }
  return parts.join(' | ');
});

const showPostHeader = computed(() => !isHome.value && postMeta.value !== '');
</script>

<template>
  <div class="container">
    <header class="header">
      <div class="site-title">☆ 青春纪念册 ☆</div>
      <div class="site-subtitle">— 2003级 信息技术课 个人博客 —</div>
    </header>

    <aside class="sidebar-left">
      <LeftSidebar />
    </aside>

    <main class="main-content">
      <BlogIndex v-if="isHome" />
      <article v-else class="retro-doc">
        <header v-if="showPostHeader" class="post-header">
          <h1 class="post-header-title">{{ postTitle }}</h1>
          <div class="post-header-meta">{{ postMeta }}</div>
          <hr class="post-header-rule" />
        </header>
        <Content />
      </article>
    </main>

    <aside class="sidebar-right">
      <RightSidebar />
    </aside>

    <footer class="footer">
      <p>© 2003 小飞侠的个人主页 · 信息技术课作品 · 最佳分辨率 1024×768</p>
    </footer>
  </div>
</template>
