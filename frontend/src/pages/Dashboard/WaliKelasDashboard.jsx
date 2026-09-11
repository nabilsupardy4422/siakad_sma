import {
    Users,
    UserCheck,
    Award,
    ChartNoAxesCombined,
  } from 'lucide-react'
  
  const statistics = [
    {
      label: 'Jumlah Siswa',
      value: '-',
      description: 'Data belum tersedia',
      icon: Users,
    },
    {
      label: 'Kehadiran',
      value: '-',
      description: 'Data belum tersedia',
      icon: UserCheck,
    },
    {
      label: 'Rekap Nilai',
      value: '-',
      description: 'Data belum tersedia',
      icon: Award,
    },
    {
      label: 'Evaluasi',
      value: '-',
      description: 'Data belum tersedia',
      icon: ChartNoAxesCombined,
    },
  ]
  
  function WaliKelasDashboard() {
    return (
      <section className="role-dashboard">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">MONITORING KELAS</span>
            <h1>Dashboard Wali Kelas</h1>
            <p>
              Pantau kondisi akademik dan perkembangan siswa dalam kelas yang
              menjadi tanggung jawab Anda.
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
                <span className="dashboard-eyebrow">KELAS</span>
                <h2>Informasi Kelas</h2>
              </div>
  
              <Users size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <Users size={32} />
              <strong>Belum ada data siswa</strong>
              <p>
                Informasi siswa akan ditampilkan setelah data kelas tersedia.
              </p>
            </div>
          </article>
  
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-eyebrow">EVALUASI</span>
                <h2>Status Evaluasi Kelas</h2>
              </div>
  
              <ChartNoAxesCombined size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <ChartNoAxesCombined size={32} />
              <strong>Belum ada data evaluasi</strong>
              <p>
                Rekap presensi dan nilai akan ditampilkan setelah data akademik
                tersedia.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }
  
  export default WaliKelasDashboard