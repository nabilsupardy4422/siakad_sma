import {
    CalendarDays,
    ClipboardCheck,
    ChartNoAxesCombined,
    FileText,
  } from 'lucide-react'
  
  const statistics = [
    {
      label: 'Jadwal',
      value: '-',
      description: 'Data belum tersedia',
      icon: CalendarDays,
    },
    {
      label: 'KBM',
      value: '-',
      description: 'Data belum tersedia',
      icon: ClipboardCheck,
    },
    {
      label: 'Evaluasi',
      value: '-',
      description: 'Data belum tersedia',
      icon: ChartNoAxesCombined,
    },
    {
      label: 'Laporan',
      value: '-',
      description: 'Data belum tersedia',
      icon: FileText,
    },
  ]
  
  function WakakurDashboard() {
    return (
      <section className="role-dashboard">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">KURIKULUM</span>
            <h1>Dashboard Wakakur</h1>
            <p>
              Pantau kegiatan belajar mengajar dan evaluasi akademik sekolah.
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
                <span className="dashboard-eyebrow">MONITORING</span>
                <h2>Monitoring KBM</h2>
              </div>
  
              <ClipboardCheck size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <ClipboardCheck size={32} />
              <strong>Belum ada data monitoring</strong>
              <p>
                Data kegiatan belajar mengajar akan ditampilkan setelah modul
                monitoring tersedia.
              </p>
            </div>
          </article>
  
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-eyebrow">EVALUASI</span>
                <h2>Evaluasi Akademik</h2>
              </div>
  
              <ChartNoAxesCombined size={20} />
            </div>
  
            <div className="dashboard-empty-state">
              <ChartNoAxesCombined size={32} />
              <strong>Belum ada data evaluasi</strong>
              <p>
                Data evaluasi akademik akan ditampilkan setelah fitur tersedia.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }
  
  export default WakakurDashboard