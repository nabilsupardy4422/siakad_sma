import { useCallback, useEffect, useState } from 'react'
import {
  Award,
  BookOpen,
  RefreshCw,
  UserRound,
} from 'lucide-react'
import { getStudentGrades } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './StudentGradePage.css'

function StudentGradePage() {
  const { token } = useAuth()

  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
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

      const response = await getStudentGrades(token)

      setStudent(response.data?.student || null)
      setGrades(response.data?.grades || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data nilai.')
      setStudent(null)
      setGrades([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadGrades()
  }, [loadGrades])

  return (
    <div className="student-grade-page">
      <div className="student-grade-header">
        <div>
          <span className="student-grade-eyebrow">
            PENILAIAN SISWA
          </span>

          <h1 className="student-grade-title">
            Nilai Saya
          </h1>

          <p className="student-grade-description">
            Lihat hasil penilaian berdasarkan data akademik Anda.
          </p>
        </div>

        <button
          type="button"
          className="student-grade-refresh"
          onClick={loadGrades}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? 'student-grade-spin' : ''}
          />

          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="student-grade-alert" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="student-grade-state">
          <RefreshCw
            size={24}
            className="student-grade-spin"
          />

          <p>Memuat data nilai...</p>
        </div>
      ) : (
        <>
          {student && (
            <div className="student-grade-profile">
              <div className="student-grade-profile-icon">
                <UserRound size={22} />
              </div>

              <div className="student-grade-profile-main">
                <span className="student-grade-profile-label">
                  SISWA
                </span>

                <h2>
                  {student.name || '-'}
                </h2>

                <div className="student-grade-profile-meta">
                  <span>
                    NIS: {student.nis || '-'}
                  </span>

                  <span>
                    Kelas: {student.class?.name || '-'}
                  </span>

                  {student.class?.level && (
                    <span>
                      Tingkat: {student.class.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="student-grade-summary">
            <div className="student-grade-stat">
              <div className="student-grade-stat-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <span className="student-grade-stat-label">
                  Mata Pelajaran Dinilai
                </span>

                <strong className="student-grade-stat-value">
                  {grades.length}
                </strong>
              </div>
            </div>

            <div className="student-grade-stat">
              <div className="student-grade-stat-icon">
                <Award size={20} />
              </div>

              <div>
                <span className="student-grade-stat-label">
                  Total Data Nilai
                </span>

                <strong className="student-grade-stat-value">
                  {grades.length}
                </strong>
              </div>
            </div>
          </div>

          <div className="student-grade-table-card">
            <div className="student-grade-table-header">
              <div>
                <h2 className="student-grade-table-title">
                  Daftar Nilai
                </h2>

                <p className="student-grade-table-description">
                  Nilai yang telah diberikan oleh guru mata pelajaran.
                </p>
              </div>
            </div>

            <div className="student-grade-table-wrapper">
              <table className="student-grade-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Mata Pelajaran</th>
                    <th>Kode</th>
                    <th>Guru</th>
                    <th>Nilai</th>
                  </tr>
                </thead>

                <tbody>
                  {grades.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="student-grade-empty"
                      >
                        <div className="student-grade-empty-content">
                          <BookOpen size={30} />

                          <strong>
                            Belum ada data nilai
                          </strong>

                          <span>
                            Nilai akan tampil setelah guru memasukkan
                            hasil penilaian.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    grades.map((grade, index) => (
                      <tr key={grade.id}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="student-grade-subject">
                            <strong>
                              {grade.subject?.name || '-'}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="student-grade-code">
                            {grade.subject?.code || '-'}
                          </span>
                        </td>

                        <td>
                          <div className="student-grade-teacher">
                            <div className="student-grade-teacher-icon">
                              <UserRound size={15} />
                            </div>

                            <span>
                              {grade.teacher?.name || '-'}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="student-grade-score">
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

export default StudentGradePage