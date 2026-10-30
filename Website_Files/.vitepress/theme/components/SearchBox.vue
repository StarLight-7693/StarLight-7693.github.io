<script setup lang="ts">
import { ref } from 'vue';
import { useNavigate } from '../useNavigate';

const navigate = useNavigate();
const keyword = ref('');

function onSubmit(): void {
  const q = keyword.value.trim();
  if (q) {
    navigate(`/?search=${encodeURIComponent(q)}`);
  } else {
    navigate('/');
  }
}
</script>

<template>
  <input
    class="search-input"
    type="search"
    v-model="keyword"
    placeholder="站内搜索..."
    aria-label="搜索"
    @keyup.enter="onSubmit"
  />
  <button class="search-btn" @click="onSubmit">查找</button>
</template>
