import {
    CalendarDays,
    Users,
    School,
    UserRound,
    ClipboardList,
  } from 'lucide-react'
  
  const statistics = [
    {
      label: 'Jadwal',
      value: '-',
      description: 'Data belum tersedia',
      icon: CalendarDays,
    },
    {
      label: 'Guru',
      value: '-',
      description: 'Data belum tersedia',
      icon: Users,
    },
    {
      label: 'Kelas',
      value: '-',
      description: 'Data belum tersedia',
      icon: School,
    },
    {
      label: 'Siswa',
      value: '-',
      description: 'Data belum tersedia',
      icon: UserRound,
    },
  ]
  
  function TuDashboard() {
    return (
      <section className="role-dashboard">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">ADMINISTRASI AKADEMIK</span>
            <h1>Dashboard TU</h1>
            <p>
              Kelola dan pantau informasi administrasi akademik sekolah dari satu
              tempat.
            </p>
          </div>
        </div>
  
        <div className="dashboard-stat-grid">
          {statistics.map((item) => {
            const Icon = item.icon
  
            return (
              <article className="dashboard-stat-card" key={item.label}>
                <div className="dashboard-stat-icon">
                  <Icon size={21} />
                </div>
  
                <div className="dashboard-stat-content">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.description}</small>
                </div>
              </article>
            )
          })}
        </div>
  
        <div className="dashboard-section-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-eyebrow">JADWAL</span>
                <h2>Status Jadwal</h2>
              </div>
  
              <CalendarDays size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <ClipboardList size={32} />
              <strong>Belum ada data jadwal</strong>
              <p>
                Data jadwal akan ditampilkan setelah modul jadwal tersedia.
              </p>
            </div>
          </article>
  
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-eyebrow">AKTIVITAS</span>
                <h2>Aktivitas Administrasi</h2>
              </div>
  
              <ClipboardList size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <ClipboardList size={32} />
              <strong>Belum ada aktivitas</strong>
              <p>
                Aktivitas administrasi akan muncul setelah fitur terkait
                tersedia.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }
  
  export default TuDashboard