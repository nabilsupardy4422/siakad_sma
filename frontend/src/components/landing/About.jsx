function About() {
    return (
      <section id="tentang" className="about-section">
        <div className="container about-grid">
          <div className="about-visual">
            <div className="about-pattern" />
  
            <div className="about-card-main">
              <div className="about-card-header">
                <span className="section-label">SIAKAD SMA</span>
                <span className="about-status">
                  <i />
                  Sistem Akademik
                </span>
              </div>
  
              <div className="about-symbol">
                <span className="symbol-horizontal" />
                <span className="symbol-vertical" />
                <span className="symbol-center" />
              </div>
  
              <div className="about-card-footer">
                <strong>Informasi akademik</strong>
                <span>Lebih teratur. Lebih mudah diakses.</span>
              </div>
            </div>
  
            <div className="about-mini-card">
              <strong>KBM</strong>
              <span>Pelaksanaan & evaluasi</span>
            </div>
          </div>
  
          <div className="about-content">
            <span className="section-label">TENTANG SIAKAD</span>
  
            <h2>
              Satu ruang untuk
              <span> informasi akademik.</span>
            </h2>
  
            <p>
              SIAKAD SMA merupakan sistem informasi akademik berbasis web
              yang membantu sekolah dalam mengelola dan menyampaikan
              informasi yang berkaitan dengan kegiatan akademik.
            </p>
  
            <p>
              Sistem berfokus pada pelaksanaan dan evaluasi kegiatan belajar
              mengajar sehingga informasi seperti jadwal, presensi, dan
              penilaian dapat dikelola secara lebih teratur dan mudah diakses
              sesuai dengan hak pengguna.
            </p>
  
            <div className="about-points">
              <div>
                <span>01</span>
                <strong>Terorganisir</strong>
              </div>
  
              <div>
                <span>02</span>
                <strong>Mudah diakses</strong>
              </div>
  
              <div>
                <span>03</span>
                <strong>Sesuai peran</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default About