<script setup lang="ts">
import { computed } from 'vue';
import { data } from '../posts.data';
import { useNavigate } from '../useNavigate';

const navigate = useNavigate();

const cats = computed(() => {
  const map = new Map<string, number>();
  for (const post of data) {
    for (const c of post.categories) {
      map.set(c, (map.get(c) || 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
});

function catUrl(name: string): string {
  return `/?category=${encodeURIComponent(name)}`;
}
</script>

<template>
  <div class="widget">
    <div class="widget-title">分类</div>
    <ul>
      <li v-for="c in cats" :key="c.name">
        <a :href="catUrl(c.name)" @click.prevent="navigate(catUrl(c.name))">{{ c.name }} ({{ c.count }})</a>
      </li>
    </ul>
  </div>
</template>
