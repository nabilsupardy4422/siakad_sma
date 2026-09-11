import {
    CalendarDays,
    Users,
    ClipboardCheck,
    Award,
  } from 'lucide-react'
  
  const statistics = [
    {
      label: 'Jadwal Mengajar',
      value: '-',
      description: 'Data belum tersedia',
      icon: CalendarDays,
    },
    {
      label: 'Kelas Diajar',
      value: '-',
      description: 'Data belum tersedia',
      icon: Users,
    },
    {
      label: 'Absensi',
      value: '-',
      description: 'Data belum tersedia',
      icon: ClipboardCheck,
    },
    {
      label: 'Penilaian',
      value: '-',
      description: 'Data belum tersedia',
      icon: Award,
    },
  ]
  
  function GuruDashboard() {
    return (
      <section className="role-dashboard">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">PEMBELAJARAN</span>
            <h1>Dashboard Guru</h1>
            <p>
              Kelola kegiatan pembelajaran, presensi, dan penilaian siswa.
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
                <span className="dashboard-eyebrow">HARI INI</span>
                <h2>Jadwal Mengajar</h2>
              </div>
  
              <CalendarDays size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <CalendarDays size={32} />
              <strong>Belum ada jadwal mengajar</strong>
              <p>
                Jadwal mengajar akan ditampilkan setelah data jadwal tersedia.
              </p>
            </div>
          </article>
  
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-eyebrow">AKTIVITAS</span>
                <h2>Aktivitas Pembelajaran</h2>
              </div>
  
              <ClipboardCheck size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <ClipboardCheck size={32} />
              <strong>Belum ada aktivitas</strong>
              <p>
                Aktivitas presensi dan penilaian akan muncul setelah fitur
                tersedia.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }
  
  export default GuruDashboard