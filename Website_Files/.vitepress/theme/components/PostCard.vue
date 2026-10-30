<script setup lang="ts">
import type { Post } from '../posts.data';
import { useNavigate } from '../useNavigate';

defineProps<{ post: Post }>();

const navigate = useNavigate();

function catUrl(name: string): string {
  return `/?category=${encodeURIComponent(name)}`;
}
</script>

<template>
  <article class="post">
    <h2 class="post-title">
      <a :href="post.url">{{ post.title }}</a>
    </h2>
    <div class="post-meta">
      作者: {{ post.author }} | 日期: {{ post.date }} | 分类:
      <template v-for="(c, i) in post.categories" :key="c">
        <a :href="catUrl(c)" @click.prevent="navigate(catUrl(c))">{{ c }}</a><span v-if="i < post.categories.length - 1">、</span>
      </template>
      <span v-if="post.categories.length === 0">未分类</span>
      <span v-if="post.sticky" class="sticky-tag">[置顶]</span>
    </div>
    <div class="post-excerpt" v-if="post.description">{{ post.description }}</div>
    <div class="post-excerpt" v-else v-html="post.excerpt"></div>
    <div class="read-more">
      <a :href="post.url">阅读全文 →</a>
    </div>
  </article>
</template>
