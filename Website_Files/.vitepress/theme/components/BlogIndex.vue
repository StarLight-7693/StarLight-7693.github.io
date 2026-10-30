<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vitepress';
import { data, type Post } from '../posts.data';
import PostCard from './PostCard.vue';
import { useNavigate, useQuery, syncQuery } from '../useNavigate';

const route = useRoute();
const navigate = useNavigate();
const queryParams = useQuery();
const PAGE_SIZE = 10;

// 跨页面导航（如文章页 -> /?category=xx）后，从新 URL 同步 query；
// immediate 覆盖带参数直链的首屏加载；同路径导航由 navigate() 内部同步。
watch(
  () => route.path,
  () => {
    syncQuery();
  },
  { immediate: true },
);

const search = computed(() => (queryParams.value.search || '').trim());
const category = computed(() => queryParams.value.category || '');
const tag = computed(() => queryParams.value.tag || '');
const date = computed(() => queryParams.value.date || '');
const page = computed(() => {
  const p = Number(queryParams.value.page || '');
  return Number.isFinite(p) && p > 0 ? p : 1;
});

function matches(post: Post): boolean {
  if (category.value) {
    if (!(post.categories || []).includes(category.value)) {
      return false;
    }
  }
  if (tag.value) {
    if (!(post.tags || []).includes(tag.value)) {
      return false;
    }
  }
  if (date.value) {
    const ym = (post.date || '').slice(0, 7);
    if (ym !== date.value) {
      return false;
    }
  }
  if (search.value) {
    const q = search.value.toLowerCase();
    const hay = [
      post.title,
      post.description,
      (post.tags || []).join(' '),
      post.src || '',
    ].join(' ').toLowerCase();
    if (!hay.includes(q)) {
      return false;
    }
  }
  return true;
}

const filtered = computed(() => data.filter(matches));
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)));
const safePage = computed(() => Math.min(page.value, totalPages.value));
const pageItems = computed(() =>
  filtered.value.slice((safePage.value - 1) * PAGE_SIZE, safePage.value * PAGE_SIZE),
);

const pageNumbers = computed(() => {
  const arr: number[] = [];
  for (let i = 1; i <= totalPages.value; i++) {
    arr.push(i);
  }
  return arr;
});

function buildUrl(targetPage: number): string {
  const params = new URLSearchParams();
  if (search.value) {
    params.set('search', search.value);
  }
  if (category.value) {
    params.set('category', category.value);
  }
  if (tag.value) {
    params.set('tag', tag.value);
  }
  if (date.value) {
    params.set('date', date.value);
  }
  if (targetPage > 1) {
    params.set('page', String(targetPage));
  }
  const qsString = params.toString();
  return qsString ? `/?${qsString}` : '/';
}

const filterLabel = computed(() => {
  if (search.value) {
    return `搜索：“${search.value}”`;
  }
  if (category.value) {
    return `分类：${category.value}`;
  }
  if (tag.value) {
    return `标签：${tag.value}`;
  }
  if (date.value) {
    return `归档：${date.value}`;
  }
  return '';
});
</script>

<template>
  <div v-if="filterLabel" class="search-hint">
    {{ filterLabel }} · 共 {{ filtered.length }} 篇结果 · <a href="/" @click.prevent="navigate('/')">清除筛选</a>
  </div>

  <PostCard v-for="post in pageItems" :key="post.url" :post="post" />

  <div v-if="filtered.length === 0" class="no-result">没有找到符合条件的文章。</div>

  <div class="posts-divider">
    共 {{ filtered.length }} 篇文章 | 第 {{ safePage }} 页 / 共 {{ totalPages }} 页
  </div>

  <div class="pager" v-if="totalPages > 1">
    <a v-if="safePage > 1" :href="buildUrl(safePage - 1)" @click.prevent="navigate(buildUrl(safePage - 1))">上一页</a>
    <span v-else class="disabled">上一页</span>

    <template v-for="n in pageNumbers" :key="n">
      <a v-if="n !== safePage" :href="buildUrl(n)" @click.prevent="navigate(buildUrl(n))">{{ n }}</a>
      <span v-else class="current">{{ n }}</span>
    </template>

    <a v-if="safePage < totalPages" :href="buildUrl(safePage + 1)" @click.prevent="navigate(buildUrl(safePage + 1))">下一页</a>
    <span v-else class="disabled">下一页</span>
  </div>
</template>
