'use client';

import type { Ref } from 'react';
import { ICONS } from '@/data/icons';
import { SITE } from '@/data/site';

// ============================================================
// 「关于」模态框
// ------------------------------------------------------------
// 打开方式是命令式的（el.open = true），不用 React state：
// MDUI 的 open 是 Lit 的布尔属性，走 JSX 传 false 会被序列化成
// "false" 字符串，而布尔转换器只看「属性存在与否」→ 反而恒为 true。
// ============================================================

export default function AboutDialog({ ref }: { ref?: Ref<HTMLElement> }) {
  /** 关闭按钮自己找宿主对话框：slotted 内容仍在 light DOM，closest 可用 */
  const close = (event: React.MouseEvent<HTMLElement>) => {
    const dialog = event.currentTarget.closest('mdui-dialog') as HTMLElement & { open: boolean };
    if (dialog) dialog.open = false;
  };

  return (
    <mdui-dialog
      ref={ref}
      icon={ICONS.info}
      headline={`关于 ${SITE.name}`}
      description="一个只有纯前端工具的小站：所有计算都在你的浏览器里完成，输入内容不会上传到任何服务器。"
    >
      <div className="about-body">
        <dl className="about-list">
          <div>
            <dt>站点名称</dt>
            <dd>{SITE.name}</dd>
          </div>
          <div>
            <dt>技术栈</dt>
            <dd>{SITE.tech.join(' · ')}</dd>
          </div>
          <div>
            <dt>作者</dt>
            <dd>{SITE.author}</dd>
          </div>
          <div>
            <dt>开源许可</dt>
            <dd>{SITE.license}</dd>
          </div>
          <div>
            <dt>站点地址</dt>
            <dd>
              <a href={SITE.url} target="_blank" rel="noopener noreferrer">
                {SITE.url.replace('https://', '')}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <mdui-button slot="action" variant="text" onClick={close}>
        关闭
      </mdui-button>
    </mdui-dialog>
  );
}
