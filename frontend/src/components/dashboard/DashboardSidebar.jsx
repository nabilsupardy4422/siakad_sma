import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    School,
    UserRound,
    Settings,
    ClipboardCheck,
    FileText,
    GraduationCap,
    ClipboardList,
    UserCheck,
    Award,
    ChartNoAxesCombined,
    LogOut,
  } from 'lucide-react'
import { roleDashboardConfig } from './dashboardConfig'

const iconMap = {
  Dashboard: LayoutDashboard,
  Jadwal: CalendarDays,
  Guru: Users,
  Kelas: School,
  Siswa: UserRound,
  Pengaturan: Settings,
  'Monitoring KBM': ClipboardCheck,
  Evaluasi: ChartNoAxesCombined,
  Laporan: FileText,
  'Jadwal Mengajar': CalendarDays,
  Absensi: UserCheck,
  Penilaian: Award,
  'Data Siswa': GraduationCap,
  'Evaluasi Kelas': ChartNoAxesCombined,
  Nilai: Award,
  Profil: UserRound,
}

function DashboardSidebar({ user, onLogout, isOpen, onClose }) {
  const roleName = user?.role?.name
  const config = roleDashboardConfig[roleName]

  if (!config) {
    return null
  }

  return (
    <>
      <div
        className={`dashboard-sidebar-overlay ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="dashboard-sidebar-header">
          <div className="dashboard-logo">
            <div className="dashboard-logo-mark">
              <GraduationCap size={22} strokeWidth={2.2} />
            </div>

            <div>
              <strong>SIAKAD</strong>
              <span>SMA</span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-sidebar-close"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            &times;
          </button>
        </div>

        <div className="dashboard-sidebar-role">
          <span>ROLE</span>
          <strong>{roleName}</strong>
        </div>

        <nav className="dashboard-sidebar-nav">
          <span className="dashboard-nav-label">MENU UTAMA</span>

          {config.menu.map((item) => {
            const Icon = iconMap[item.label] || ClipboardList

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `/${getRolePath(roleName)}`}
                className={({ isActive }) =>
                  `dashboard-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="dashboard-sidebar-footer">
          <button
            type="button"
            className="dashboard-logout-button"
            onClick={onLogout}
          >
            <LogOut size={19} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

function getRolePath(roleName) {
  const paths = {
    TU: 'tu',
    Wakakur: 'wakakur',
    'Guru Mata Pelajaran': 'guru',
    'Wali Kelas': 'wali-kelas',
    Siswa: 'siswa',
  }

  return paths[roleName] || ''
}

export default DashboardSidebar