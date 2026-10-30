<script setup lang="ts">
import { useTheme } from '../useTheme';

const { current, setTheme } = useTheme();

const options = [
  { value: 'auto', label: '跟随系统' },
  { value: 'light', label: '浅色模式' },
  { value: 'dark', label: '深色模式' },
] as const;

function onSelect(value: string): void {
  if (value === 'auto' || value === 'light' || value === 'dark') {
    setTheme(value);
  }
}
</script>

<template>
  <div class="theme-switch">
    <label v-for="opt in options" :key="opt.value">
      <input
        type="radio"
        name="theme"
        :value="opt.value"
        :checked="current === opt.value"
        @change="onSelect(opt.value)"
      />
      {{ opt.label }}
    </label>
  </div>
</template>
