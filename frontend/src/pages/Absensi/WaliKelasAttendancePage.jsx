import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getWaliKelasAttendance } from '../../services/api'
import './WaliKelasAttendancePage.css'

function WaliKelasAttendancePage() {
  const { token } = useAuth()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadAttendance() {
      try {
        setLoading(true)
        setError('')

        const response = await getWaliKelasAttendance(token)

        if (mounted) {
          setData(response.data)
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.message || 'Gagal mengambil rekap presensi.',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    if (token) {
      loadAttendance()
    }

    return () => {
      mounted = false
    }
  }, [token])

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Rekap Presensi</h1>
          <p>Memuat data presensi kelas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Rekap Presensi</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { class: classData, summary, students } = data

  return (
    <div className="wali-attendance-page">
      <div className="wali-attendance-header">
        <div>
          <h1 className="wali-attendance-title">
            Rekap Presensi
          </h1>
  
          <p className="wali-attendance-description">
            Rekap kehadiran siswa kelas {classData.name}
          </p>
        </div>
      </div>
  
      <div className="wali-attendance-class-card">
        <div className="wali-attendance-info">
          <span className="wali-attendance-info-label">
            Kelas
          </span>
  
          <span className="wali-attendance-info-value">
            {classData.name} — {classData.level}
          </span>
        </div>
  
        <div className="wali-attendance-info">
          <span className="wali-attendance-info-label">
            Wali Kelas
          </span>
  
          <span className="wali-attendance-info-value">
            {classData.wali_kelas.name}
          </span>
        </div>
  
        <div className="wali-attendance-info">
          <span className="wali-attendance-info-label">
            NIP
          </span>
  
          <span className="wali-attendance-info-value">
            {classData.wali_kelas.nip}
          </span>
        </div>
      </div>
  
      <div className="wali-attendance-summary">
        <div className="wali-attendance-stat">
          <span className="wali-attendance-stat-label">
            Total Siswa
          </span>
          <strong className="wali-attendance-stat-value">
            {summary.total_students}
          </strong>
        </div>
  
        <div className="wali-attendance-stat">
          <span className="wali-attendance-stat-label">
            Hadir
          </span>
          <strong className="wali-attendance-stat-value">
            {summary.hadir}
          </strong>
        </div>
  
        <div className="wali-attendance-stat">
          <span className="wali-attendance-stat-label">
            Izin
          </span>
          <strong className="wali-attendance-stat-value">
            {summary.izin}
          </strong>
        </div>
  
        <div className="wali-attendance-stat">
          <span className="wali-attendance-stat-label">
            Sakit
          </span>
          <strong className="wali-attendance-stat-value">
            {summary.sakit}
          </strong>
        </div>
  
        <div className="wali-attendance-stat">
          <span className="wali-attendance-stat-label">
            Alpa
          </span>
          <strong className="wali-attendance-stat-value">
            {summary.alpa}
          </strong>
        </div>
      </div>
  
      <div className="wali-attendance-table-card">
        <div className="wali-attendance-table-header">
          <h2 className="wali-attendance-table-title">
            Rekap Siswa
          </h2>
  
          <p className="wali-attendance-table-description">
            Ringkasan kehadiran setiap siswa di kelas
          </p>
        </div>
  
        <div className="wali-attendance-table-wrapper">
          <table className="wali-attendance-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIS</th>
                <th>Nama Siswa</th>
                <th>Hadir</th>
                <th>Izin</th>
                <th>Sakit</th>
                <th>Alpa</th>
              </tr>
            </thead>
  
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="wali-attendance-empty"
                  >
                    Belum ada data siswa.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.nis}</td>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>{student.summary.hadir}</td>
                    <td>{student.summary.izin}</td>
                    <td>{student.summary.sakit}</td>
                    <td>{student.summary.alpa}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WaliKelasAttendancePage