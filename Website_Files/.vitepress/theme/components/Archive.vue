<script setup lang="ts">
import { computed } from 'vue';
import { data } from '../posts.data';
import { useNavigate } from '../useNavigate';

const navigate = useNavigate();

const groups = computed(() => {
  const map = new Map<string, { label: string; ym: string; count: number }>();
  for (const post of data) {
    const ym = (post.date || '').slice(0, 7);
    if (!ym) {
      continue;
    }
    const parts = ym.split('-');
    const year = parts[0];
    const month = parts[1];
    if (!year || !month) {
      continue;
    }
    const label = `${year}年${Number(month)}月`;
    const existing = map.get(label);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(label, { label, ym, count: 1 });
    }
  }
  return Array.from(map.values());
});

function dateUrl(ym: string): string {
  return `/?date=${encodeURIComponent(ym)}`;
}
</script>

<template>
  <div class="widget">
    <div class="widget-title">归档</div>
    <ul class="archive-list">
      <li v-for="g in groups" :key="g.label">
        <a :href="dateUrl(g.ym)" @click.prevent="navigate(dateUrl(g.ym))">{{ g.label }} ({{ g.count }})</a>
      </li>
    </ul>
  </div>
</template>
