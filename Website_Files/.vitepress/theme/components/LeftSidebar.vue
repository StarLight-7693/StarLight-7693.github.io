<script setup lang="ts">
import SearchBox from './SearchBox.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
import { useNavigate } from '../useNavigate';

const navigate = useNavigate();

const navItems = [
  { name: '首页', url: '/' },
  { name: '学习笔记', url: '/?category=学习笔记' },
  { name: '生活随记', url: '/?category=生活随记' },
  { name: '校园活动', url: '/?category=校园活动' },
  { name: '留言板', url: '/' },
];
</script>

<template>
  <div class="widget">
    <div class="widget-title">导航</div>
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.name">
        <a :href="item.url" @click.prevent="navigate(item.url)">{{ item.name }}</a>
      </li>
    </ul>
  </div>

  <div class="widget">
    <div class="widget-title">搜索</div>
    <SearchBox />
  </div>

  <div class="widget">
    <div class="widget-title">深色模式</div>
    <ThemeSwitcher />
  </div>

  <div class="widget">
    <div class="widget-title">计数器</div>
    <div class="counter">000386</div>
    <div class="counter-note">人访问过本站</div>
  </div>
</template>
