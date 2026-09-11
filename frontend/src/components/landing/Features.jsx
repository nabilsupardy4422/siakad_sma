const features = [
    {
      number: '01',
      icon: '▦',
      title: 'Jadwal Pelajaran',
      description:
        'Akses informasi jadwal pembelajaran secara terstruktur dan mudah dipahami.',
    },
    {
      number: '02',
      icon: '✓',
      title: 'Absensi',
      description:
        'Mendukung pencatatan dan pemantauan kehadiran siswa dalam kegiatan belajar.',
    },
    {
      number: '03',
      icon: '◇',
      title: 'Penilaian',
      description:
        'Informasi nilai akademik dapat dikelola dan diakses sesuai hak pengguna.',
    },
    {
      number: '04',
      icon: '◎',
      title: 'Informasi Akademik',
      description:
        'Menyediakan informasi akademik yang terorganisir untuk mendukung kegiatan sekolah.',
    },
  ]
  
  function Features() {
    return (
      <section id="fitur" className="features-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">FITUR UTAMA</span>
              <h2>Semua yang dibutuhkan<br />untuk aktivitas akademik.</h2>
            </div>
  
            <p>
              SIAKAD dirancang untuk membantu pengelolaan dan penyampaian
              informasi akademik dalam pelaksanaan kegiatan belajar mengajar.
            </p>
          </div>
  
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <div className="feature-top">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-number">{feature.number}</span>
                </div>
  
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
  
                <span className="feature-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default Features