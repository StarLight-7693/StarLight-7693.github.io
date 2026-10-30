import { ref, onMounted } from 'vue';

type ThemeMode = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'sl-theme';

const current = ref<ThemeMode>('auto');

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'auto' || value === 'light' || value === 'dark';
}

function apply(mode: ThemeMode): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = mode;
  }
}

function readStored(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isThemeMode(stored)) {
      return stored;
    }
  } catch (e) {
    /* 忽略读取失败 */
  }
  return 'auto';
}

function persist(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch (e) {
    /* 忽略写入失败 */
  }
}

export function useTheme() {
  onMounted(() => {
    const mode = readStored();
    current.value = mode;
    apply(mode);
  });

  function setTheme(mode: ThemeMode): void {
    current.value = mode;
    apply(mode);
    persist(mode);
  }

  return { current, setTheme };
}
