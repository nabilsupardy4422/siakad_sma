import {
    CalendarDays,
    UserCheck,
    Award,
    UserRound,
  } from 'lucide-react'
  
  const statistics = [
    {
      label: 'Jadwal',
      value: '-',
      description: 'Data belum tersedia',
      icon: CalendarDays,
    },
    {
      label: 'Kehadiran',
      value: '-',
      description: 'Data belum tersedia',
      icon: UserCheck,
    },
    {
      label: 'Nilai',
      value: '-',
      description: 'Data belum tersedia',
      icon: Award,
    },
    {
      label: 'Profil',
      value: '-',
      description: 'Data belum tersedia',
      icon: UserRound,
    },
  ]
  
  function SiswaDashboard() {
    return (
      <section className="role-dashboard">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">AKADEMIK SISWA</span>
            <h1>Dashboard Siswa</h1>
            <p>
              Akses informasi jadwal, kehadiran, nilai, dan informasi akademik
              Anda.
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
                <h2>Jadwal Pelajaran</h2>
              </div>
  
              <CalendarDays size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <CalendarDays size={32} />
              <strong>Belum ada jadwal</strong>
              <p>
                Jadwal pelajaran akan ditampilkan setelah data jadwal tersedia.
              </p>
            </div>
          </article>
  
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-eyebrow">AKADEMIK</span>
                <h2>Informasi Akademik</h2>
              </div>
  
              <Award size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <Award size={32} />
              <strong>Belum ada data akademik</strong>
              <p>
                Informasi presensi dan nilai akan muncul setelah data tersedia.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }
  
  export default SiswaDashboard