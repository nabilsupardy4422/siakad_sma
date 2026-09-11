function Footer() {
    return (
      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a href="#beranda" className="brand">
              <span className="brand-mark">
                <span className="brand-mark-line" />
                <span className="brand-mark-dot" />
              </span>
  
              <span>
                <strong>SIAKAD</strong>
                <small>SMA</small>
              </span>
            </a>
  
            <p>
              Sistem informasi akademik sekolah untuk mendukung
              pengelolaan informasi kegiatan belajar mengajar.
            </p>
          </div>
  
          <div className="footer-nav">
            <span>NAVIGASI</span>
            <a href="#beranda">Beranda</a>
            <a href="#fitur">Fitur</a>
            <a href="#tentang">Tentang</a>
            <a href="/login">Masuk ke SIAKAD</a>
          </div>
        </div>
  
        <div className="container footer-bottom">
          <span>© 2026 SIAKAD SMA. All rights reserved.</span>
          <span>Sistem Informasi Akademik Sekolah</span>
        </div>
      </footer>
    )
  }
  
  export default Footer