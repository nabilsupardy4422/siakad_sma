function Hero() {
    return (
      <section id="beranda" className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
  
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Sistem Informasi Akademik Sekolah
            </div>
  
            <h1>
              Kelola akademik sekolah
              <span> lebih terarah.</span>
            </h1>
  
            <p>
              SIAKAD SMA membantu sekolah mengelola dan menyampaikan
              informasi akademik secara lebih teratur, mudah diakses,
              dan terintegrasi.
            </p>
  
            <div className="hero-actions">
              <a href="/login" className="button button-primary">
                Masuk ke SIAKAD
                <span>→</span>
              </a>
  
              <a href="#fitur" className="button button-secondary">
                Jelajahi fitur
                <span>↓</span>
              </a>
            </div>
  
            <div className="hero-meta">
              <div className="meta-item">
                <strong>Terstruktur</strong>
                <span>Informasi akademik</span>
              </div>
  
              <div className="meta-divider" />
  
              <div className="meta-item">
                <strong>Terintegrasi</strong>
                <span>Untuk kebutuhan KBM</span>
              </div>
            </div>
          </div>
  
          <div className="hero-visual">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
  
            <div className="dashboard-window">
              <div className="dashboard-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
  
                <div className="window-title">SIAKAD SMA</div>
  
                <div className="window-status">
                  <span />
                  Aktif
                </div>
              </div>
  
              <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                  <div className="mini-logo">
                    <span>SI</span>
                  </div>
  
                  <div className="sidebar-item active">
                    <span className="sidebar-icon">⌂</span>
                    <span />
                  </div>
  
                  <div className="sidebar-item">
                    <span className="sidebar-icon">▦</span>
                    <span />
                  </div>
  
                  <div className="sidebar-item">
                    <span className="sidebar-icon">✓</span>
                    <span />
                  </div>
  
                  <div className="sidebar-item">
                    <span className="sidebar-icon">◇</span>
                    <span />
                  </div>
                </aside>
  
                <main className="dashboard-main">
                  <div className="dashboard-heading">
                    <div>
                      <small>OVERVIEW</small>
                      <h3>Informasi Akademik</h3>
                    </div>
  
                    <div className="profile-circle">S</div>
                  </div>
  
                  <div className="stat-grid">
                    <div className="stat-card">
                      <div className="stat-icon blue">▦</div>
                      <small>Jadwal</small>
                      <strong>24</strong>
                      <span>Jadwal tersedia</span>
                    </div>
  
                    <div className="stat-card">
                      <div className="stat-icon green">✓</div>
                      <small>Presensi</small>
                      <strong>96%</strong>
                      <span>Kehadiran</span>
                    </div>
  
                    <div className="stat-card">
                      <div className="stat-icon purple">◇</div>
                      <small>Nilai</small>
                      <strong>86.4</strong>
                      <span>Rata-rata</span>
                    </div>
                  </div>
  
                  <div className="dashboard-panel">
                    <div className="panel-heading">
                      <div>
                        <small>JADWAL HARI INI</small>
                        <strong>Agenda Pembelajaran</strong>
                      </div>
                      <span>Hari ini</span>
                    </div>
  
                    <div className="schedule-row">
                      <div className="schedule-time">07:00</div>
                      <div className="schedule-line">
                        <span className="schedule-dot" />
                      </div>
                      <div>
                        <strong>Matematika</strong>
                        <small>Kelas XII • Ruang 01</small>
                      </div>
                    </div>
  
                    <div className="schedule-row">
                      <div className="schedule-time">09:30</div>
                      <div className="schedule-line">
                        <span className="schedule-dot purple-dot" />
                      </div>
                      <div>
                        <strong>Bahasa Indonesia</strong>
                        <small>Kelas XII • Ruang 03</small>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
  
            <div className="floating-card attendance-card">
              <div className="floating-icon green">✓</div>
              <div>
                <small>Presensi</small>
                <strong>96% Hadir</strong>
              </div>
            </div>
  
            <div className="floating-card grade-card">
              <div className="grade-ring">
                <span>86</span>
              </div>
              <div>
                <small>Nilai Akademik</small>
                <strong>Performa baik</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default Hero