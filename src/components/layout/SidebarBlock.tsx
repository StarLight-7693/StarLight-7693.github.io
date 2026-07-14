import type { ReactNode } from 'react'

interface SidebarBlockProps {
  title: string
  children: ReactNode
}

function SidebarBlock({ title, children }: SidebarBlockProps) {
  return (
    <div className="sidebar-block mica-card">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default SidebarBlock