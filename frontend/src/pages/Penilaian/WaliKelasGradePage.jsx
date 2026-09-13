import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Award,
  RefreshCw,
  Users,
  BookOpen,
  UserRound,
} from 'lucide-react'
import { getWaliKelasGrades } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './WaliKelasGradePage.css'

function WaliKelasGradePage() {
  const { token } = useAuth()

  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadGrades = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getWaliKelasGrades(token)

      setClassData(response.data?.class || null)
      setStudents(response.data?.students || [])
      setSummary(response.data?.summary || null)
    } catch (err) {
      setError(err.message || 'Gagal memuat rekap nilai.')
      setClassData(null)
      setStudents([])
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadGrades()
  }, [loadGrades])

  const gradeRows = useMemo(() => {
    const rows = []

    students.forEach((student) => {
      ;(student.grades || []).forEach((grade) => {
        rows.push({
          studentId: student.id,
          nis: student.nis,
          studentName: student.name,
          gradeId: grade.id,
          subject: grade.subject?.name || '-',
          subjectCode: grade.subject?.code || '-',
          teacher: grade.teacher?.name || '-',
          score: grade.score,
        })
      })
    })

    return rows
  }, [students])

  const totalStudents = summary?.total_students ?? students.length
  const totalGrades = summary?.total_grades ?? gradeRows.length

  return (
    <div className="wali-grade-page">
      <div className="wali-grade-header">
        <div>
          <span className="wali-grade-eyebrow">PENILAIAN KELAS</span>

          <h1 className="wali-grade-title">
            Rekap Nilai Siswa
          </h1>

          <p className="wali-grade-description">
            Rekap nilai siswa pada kelas yang menjadi tanggung jawab Anda.
          </p>
        </div>

        <button
          type="button"
          className="wali-grade-refresh"
          onClick={loadGrades}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? 'wali-grade-spin' : ''}
          />
          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="wali-grade-alert" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="wali-grade-state">
          <RefreshCw
            size={24}
            className="wali-grade-spin"
          />
          <p>Memuat rekap nilai...</p>
        </div>
      ) : (
        <>
          {classData && (
            <div className="wali-grade-class-card">
              <div className="wali-grade-info">
                <span className="wali-grade-info-label">
                  KELAS
                </span>

                <strong className="wali-grade-info-value">
                  {classData.name || '-'}
                  {classData.level
                    ? ` — ${classData.level}`
                    : ''}
                </strong>
              </div>

              <div className="wali-grade-info">
                <span className="wali-grade-info-label">
                  WALI KELAS
                </span>

                <strong className="wali-grade-info-value">
                  {classData.wali_kelas?.name || '-'}
                </strong>
              </div>

              <div className="wali-grade-info">
                <span className="wali-grade-info-label">
                  NIP
                </span>

                <strong className="wali-grade-info-value">
                  {classData.wali_kelas?.nip || '-'}
                </strong>
              </div>
            </div>
          )}

          <div className="wali-grade-summary">
            <div className="wali-grade-stat">
              <div className="wali-grade-stat-icon">
                <Users size={20} />
              </div>

              <div>
                <span className="wali-grade-stat-label">
                  Total Siswa
                </span>

                <strong className="wali-grade-stat-value">
                  {totalStudents}
                </strong>
              </div>
            </div>

            <div className="wali-grade-stat">
              <div className="wali-grade-stat-icon">
                <Award size={20} />
              </div>

              <div>
                <span className="wali-grade-stat-label">
                  Total Data Nilai
                </span>

                <strong className="wali-grade-stat-value">
                  {totalGrades}
                </strong>
              </div>
            </div>
          </div>

          <div className="wali-grade-table-card">
            <div className="wali-grade-table-header">
              <div>
                <h2 className="wali-grade-table-title">
                  Rekap Nilai
                </h2>

                <p className="wali-grade-table-description">
                  Nilai siswa berdasarkan mata pelajaran dan guru pengampu.
                </p>
              </div>
            </div>

            <div className="wali-grade-table-wrapper">
              <table className="wali-grade-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>NIS</th>
                    <th>Nama Siswa</th>
                    <th>Mata Pelajaran</th>
                    <th>Guru</th>
                    <th>Nilai</th>
                  </tr>
                </thead>

                <tbody>
                  {gradeRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="wali-grade-empty"
                      >
                        <div className="wali-grade-empty-content">
                          <BookOpen size={30} />

                          <strong>
                            Belum ada data nilai
                          </strong>

                          <span>
                            Data nilai siswa akan tampil setelah guru
                            menginput nilai.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gradeRows.map((grade, index) => (
                      <tr key={grade.gradeId}>
                        <td>{index + 1}</td>

                        <td>
                          <span className="wali-grade-nis">
                            {grade.nis || '-'}
                          </span>
                        </td>

                        <td>
                          <div className="wali-grade-student">
                            <div className="wali-grade-student-icon">
                              <UserRound size={16} />
                            </div>

                            <strong>
                              {grade.studentName || '-'}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <div className="wali-grade-subject">
                            <strong>
                              {grade.subject}
                            </strong>

                            {grade.subjectCode !== '-' && (
                              <span>
                                {grade.subjectCode}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          {grade.teacher}
                        </td>

                        <td>
                          <span className="wali-grade-score">
                            {grade.score ?? '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WaliKelasGradePage