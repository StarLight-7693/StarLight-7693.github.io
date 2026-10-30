import { ref, type Ref } from 'vue';
import { useRouter } from 'vitepress';

/**
 * VitePress 1.x 的 route 对象不解析 query（route.path 不含 ?...），
 * 因此自建响应式 query 状态，统一从 window.location.search 同步：
 * - 模块加载时（含带参数直链）解析一次
 * - popstate（前进/后退）时同步
 * - 站内同路径导航时由 navigate() 手动同步
 * - 跨页面导航时由消费组件 watch route.path 后调用 syncQuery()
 */
export const queryParams = ref<Record<string, string>>(parseSearch());

function parseSearch(): Record<string, string> {
  const result: Record<string, string> = {};
  if (typeof window === 'undefined') {
    return result;
  }
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function syncQuery(): void {
  queryParams.value = parseSearch();
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    syncQuery();
  });
}

export function useQuery(): Ref<Record<string, string>> {
  return queryParams;
}

/**
 * 统一站内导航：
 * - 同路径（如 / -> /?search=xx）：pushState 更新 query 并同步状态，不触发 VitePress 路由
 * - 跨路径（如 /posts/a.html -> /?category=xx）：交给 VitePress router.go
 * href 仍保留在 <a> 上，便于右键/中键在新标签打开。
 */
export function useNavigate(): (href: string) => void {
  const router = useRouter();

  const navigate = (href: string): void => {
    if (!href || typeof window === 'undefined') {
      return;
    }
    const qIndex = href.indexOf('?');
    const pathname = qIndex >= 0 ? href.slice(0, qIndex) : href;
    const search = qIndex >= 0 ? href.slice(qIndex) : '';
    if (pathname === window.location.pathname) {
      window.history.pushState({}, '', search ? `${pathname}${search}` : pathname);
      syncQuery();
      window.scrollTo(0, 0);
    } else {
      router.go(href);
    }
  };

  return navigate;
}
