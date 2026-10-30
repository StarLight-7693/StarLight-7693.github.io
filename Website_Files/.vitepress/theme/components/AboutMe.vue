<script setup lang="ts">
import { aboutMe } from '../RightSidebarContent';
</script>

<template>
  <div class="widget">
    <div class="widget-title">关于我</div>
    <div class="about-me">
      <div>网名：{{ aboutMe.nickname }}</div>
      <div>坐标：{{ aboutMe.location }}</div>
      <div>爱好：{{ aboutMe.hobbies }}</div>
      <div>QQ：{{ aboutMe.qq }}</div>
    </div>
  </div>
</template>
