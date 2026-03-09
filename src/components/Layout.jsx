import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { path: '/dashboard', cn: '总览', en: 'Dashboard', icon: '⊞' },
  { path: '/calendar', cn: '预约日历', en: 'Booking Calendar', icon: '📅' },
  { path: '/pos', cn: '收银台', en: 'Point of Sale', icon: '💳' },
  { path: '/crm', cn: '会员管理', en: 'CRM Members', icon: '👥' },
  { path: '/analytics', cn: '数据分析', en: 'Analytics', icon: '📊' },
  { path: '/commission', cn: '员工提成', en: 'Commission', icon: '💰' },
  { path: '/inventory', cn: '进销存', en: 'Inventory', icon: '📦' },
  { path: '/promotions', cn: '促销活动', en: 'Promotions', icon: '📣' },
]

const PAGE_TITLES = {
  '/dashboard': { cn: '总览', en: 'Dashboard Overview' },
  '/calendar': { cn: '预约日历', en: 'Booking Calendar' },
  '/pos': { cn: '收银台', en: 'Point of Sale' },
  '/crm': { cn: '会员管理', en: 'CRM Members' },
  '/analytics': { cn: '数据分析', en: 'Analytics Dashboard' },
  '/commission': { cn: '员工提成', en: 'Staff Commission' },
  '/inventory': { cn: '进销存', en: 'Inventory Management' },
  '/promotions': { cn: '促销活动', en: 'Marketing Campaigns' },
}

export default function Layout() {
  const location = useLocation()
  const pageKey = '/' + location.pathname.split('/')[1]
  const title = PAGE_TITLES[pageKey] || { cn: '木木d店', en: 'Mumuddian ERP' }
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close sidebar on outside click
  useEffect(() => {
    if (!sidebarOpen) return
    const handler = (e) => {
      if (!e.target.closest('.sidebar') && !e.target.closest('.hamburger-btn')) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [sidebarOpen])

  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  const dateStrShort = now.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' })

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="brand-name">木木d店</div>
          <div className="brand-sub">Mumuddian Wellness</div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>
                <span className="nav-label-cn">{item.cn}</span>
                <span className="nav-label-en">{item.en}</span>
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          v1.0.0 · 演示版本
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Header */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
            <div className="header-title">
              <span className="page-title-cn">{title.cn}</span>
              <span className="page-title-en">{title.en}</span>
            </div>
          </div>
          <div className="header-right">
            <span className="header-date header-date-full">{dateStr}</span>
            <span className="header-date header-date-short">{dateStrShort}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="user-avatar">Ad</div>
              <div className="header-user-info">
                <div style={{ fontFamily: 'Noto Serif SC', fontWeight: 600, color: 'var(--brand-dark)', fontSize: 12 }}>管理员</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
