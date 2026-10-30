<script setup lang="ts">
import { computed } from 'vue';
import { data } from '../posts.data';
import { useNavigate } from '../useNavigate';

const navigate = useNavigate();

const tags = computed(() => {
  const map = new Map<string, number>();
  for (const post of data) {
    for (const t of post.tags) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
});

function tagUrl(name: string): string {
  return `/?tag=${encodeURIComponent(name)}`;
}
</script>

<template>
  <div class="widget">
    <div class="widget-title">标签</div>
    <ul>
      <li v-for="t in tags" :key="t.name">
        <a :href="tagUrl(t.name)" @click.prevent="navigate(tagUrl(t.name))">{{ t.name }} ({{ t.count }})</a>
      </li>
    </ul>
  </div>
</template>
