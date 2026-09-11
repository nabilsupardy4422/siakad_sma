export const roleDashboardConfig = {
    TU: {
      title: 'Dashboard TU',
      description: 'Pusat administrasi dan pengelolaan akademik sekolah.',
      menu: [
        { label: 'Dashboard', path: '/tu' },
        { label: 'Jadwal', path: '/tu/jadwal' },
        { label: 'Guru', path: '/tu/guru' },
        { label: 'Kelas', path: '/tu/kelas' },
        { label: 'Siswa', path: '/tu/siswa' },
        { label: 'Pengaturan', path: '/tu/pengaturan' },
      ],
    },
  
    Wakakur: {
      title: 'Dashboard Wakakur',
      description: 'Pusat monitoring dan evaluasi kegiatan belajar mengajar.',
      menu: [
        { label: 'Dashboard', path: '/wakakur' },
        { label: 'Jadwal', path: '/wakakur/jadwal' },
        { label: 'Monitoring KBM', path: '/wakakur/monitoring' },
        { label: 'Evaluasi', path: '/wakakur/evaluasi' },
        { label: 'Laporan', path: '/wakakur/laporan' },
      ],
    },
  
    'Guru Mata Pelajaran': {
      title: 'Dashboard Guru',
      description: 'Pusat kegiatan pembelajaran dan pengelolaan akademik guru.',
      menu: [
        { label: 'Dashboard', path: '/guru' },
        { label: 'Jadwal Mengajar', path: '/guru/jadwal' },
        { label: 'Absensi', path: '/guru/absensi' },
        { label: 'Penilaian', path: '/guru/penilaian' },
      ],
    },
  
    'Wali Kelas': {
      title: 'Dashboard Wali Kelas',
      description: 'Pusat monitoring siswa dan evaluasi kelas.',
      menu: [
        { label: 'Dashboard', path: '/wali-kelas' },
        { label: 'Data Siswa', path: '/wali-kelas/siswa' },
        { label: 'Absensi', path: '/wali-kelas/absensi' },
        { label: 'Nilai', path: '/wali-kelas/nilai' },
        { label: 'Evaluasi Kelas', path: '/wali-kelas/evaluasi' },
      ],
    },
  
    Siswa: {
      title: 'Dashboard Siswa',
      description: 'Pusat informasi akademik siswa.',
      menu: [
        { label: 'Dashboard', path: '/siswa' },
        { label: 'Jadwal', path: '/siswa/jadwal' },
        { label: 'Absensi', path: '/siswa/absensi' },
        { label: 'Nilai', path: '/siswa/nilai' },
        { label: 'Profil', path: '/siswa/profil' },
      ],
    },
  }