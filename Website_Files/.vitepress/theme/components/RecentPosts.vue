<script setup lang="ts">
import { data } from '../posts.data';

const recent = data.slice(0, 5);
</script>

<template>
  <div class="widget">
    <div class="widget-title">最近文章</div>
    <ul>
      <li v-for="post in recent" :key="post.url">
        <a :href="post.url">{{ post.title }}</a>
      </li>
    </ul>
  </div>
</template>
