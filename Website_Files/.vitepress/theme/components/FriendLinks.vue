<script setup lang="ts">
import { friendLinks } from '../RightSidebarContent';
</script>

<template>
  <div class="widget">
    <div class="widget-title">友情链接</div>
    <ul class="blogroll-list">
      <li v-for="link in friendLinks" :key="link.url">
        <a :href="link.url" :class="{ 'rss-link': link.url.endsWith('rss.xml') }">{{ link.name }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rss-link {
  font-weight: bold;
}
</style>
