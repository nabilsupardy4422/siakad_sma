import { Menu, Bell, ChevronDown, UserRound } from 'lucide-react'

function DashboardTopbar({ user, onMenuClick }) {
  const roleName = user?.role?.name || 'Pengguna'
  const userName = user?.name || 'Pengguna'

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <button
          type="button"
          className="dashboard-menu-button"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>

        <div className="dashboard-page-context">
          <span>SIAKAD SMA</span>
          <strong>Portal Akademik</strong>
        </div>
      </div>

      <div className="dashboard-topbar-right">
        <button
          type="button"
          className="dashboard-notification-button"
          aria-label="Notifikasi"
        >
          <Bell size={20} />
          <span className="dashboard-notification-dot" />
        </button>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">
            <UserRound size={19} />
          </div>

          <div className="dashboard-user-info">
            <strong>{userName}</strong>
            <span>{roleName}</span>
          </div>

          <ChevronDown size={17} className="dashboard-user-chevron" />
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar