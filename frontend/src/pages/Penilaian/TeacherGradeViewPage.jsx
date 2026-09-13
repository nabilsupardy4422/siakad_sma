import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Award,
  BookOpen,
  RefreshCw,
  Users,
  UserRound,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getGrades } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './TeacherGradeViewPage.css'

function TeacherGradeViewPage() {
  const { token } = useAuth()
  const { scheduleId } = useParams()

  const [schedule, setSchedule] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadGrades = useCallback(async () => {
    if (!token || !scheduleId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getGrades(token, scheduleId)

      setSchedule(response.data?.schedule || null)
      setStudents(response.data?.students || [])
    } catch (err) {
      setError(
        err.message || 'Gagal memuat monitoring nilai.',
      )
      setSchedule(null)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [token, scheduleId])

  useEffect(() => {
    loadGrades()
  }, [loadGrades])

  const filledStudents = useMemo(() => {
    return students.filter((student) => {
      const score = student.grade?.score

      return (
        score !== null &&
        score !== undefined &&
        String(score).trim() !== ''
      )
    })
  }, [students])

  const emptyStudents = students.length - filledStudents.length

  return (
    <section className="teacher-grade-view-page">
      <div className="teacher-grade-view-header">
        <div>
          <span className="teacher-grade-view-eyebrow">
            MONITORING NILAI
          </span>

          <h1 className="teacher-grade-view-title">
            Nilai Siswa
          </h1>

          <p className="teacher-grade-view-description">
            Pantau nilai siswa berdasarkan jadwal mengajar Anda.
          </p>
        </div>

        <button
          type="button"
          className="teacher-grade-view-refresh"
          onClick={loadGrades}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? 'teacher-grade-view-spin'
                : ''
            }
          />

          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div
          className="teacher-grade-view-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="teacher-grade-view-state">
          <RefreshCw
            size={24}
            className="teacher-grade-view-spin"
          />

          <p>Memuat data nilai...</p>
        </div>
      ) : (
        <>
          {schedule && (
            <div className="teacher-grade-view-schedule">
              <div>
                <span className="teacher-grade-view-info-label">
                  MATA PELAJARAN
                </span>

                <strong className="teacher-grade-view-info-value">
                  {schedule.subject?.name || '-'}
                </strong>
              </div>

              <div>
                <span className="teacher-grade-view-info-label">
                  KELAS
                </span>

                <strong className="teacher-grade-view-info-value">
                  {schedule.class?.name || '-'}
                </strong>
              </div>

              <div>
                <span className="teacher-grade-view-info-label">
                  JADWAL
                </span>

                <strong className="teacher-grade-view-info-value">
                  {schedule.day || '-'} •{' '}
                  {schedule.start_time?.slice(0, 5) || '-'} -{' '}
                  {schedule.end_time?.slice(0, 5) || '-'}
                </strong>
              </div>

              <div>
                <span className="teacher-grade-view-info-label">
                  STATUS
                </span>

                <strong className="teacher-grade-view-info-value">
                  {schedule.status || '-'}
                </strong>
              </div>
            </div>
          )}

          <div className="teacher-grade-view-summary">
            <div className="teacher-grade-view-stat">
              <div className="teacher-grade-view-stat-icon">
                <Users size={20} />
              </div>

              <div>
                <span className="teacher-grade-view-stat-label">
                  Total Siswa
                </span>

                <strong className="teacher-grade-view-stat-value">
                  {students.length}
                </strong>
              </div>
            </div>

            <div className="teacher-grade-view-stat">
              <div className="teacher-grade-view-stat-icon">
                <Award size={20} />
              </div>

              <div>
                <span className="teacher-grade-view-stat-label">
                  Sudah Dinilai
                </span>

                <strong className="teacher-grade-view-stat-value">
                  {filledStudents.length}
                </strong>
              </div>
            </div>

            <div className="teacher-grade-view-stat">
              <div className="teacher-grade-view-stat-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <span className="teacher-grade-view-stat-label">
                  Belum Dinilai
                </span>

                <strong className="teacher-grade-view-stat-value">
                  {emptyStudents}
                </strong>
              </div>
            </div>
          </div>

          <div className="teacher-grade-view-table-card">
            <div className="teacher-grade-view-table-header">
              <div>
                <h2 className="teacher-grade-view-table-title">
                  Monitoring Nilai Siswa
                </h2>

                <p className="teacher-grade-view-table-description">
                  Data nilai yang telah tersimpan untuk jadwal ini.
                </p>
              </div>
            </div>

            <div className="teacher-grade-view-table-wrapper">
              <table className="teacher-grade-view-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>NIS</th>
                    <th>Nama Siswa</th>
                    <th>Nilai</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="teacher-grade-view-empty"
                      >
                        <div className="teacher-grade-view-empty-content">
                          <BookOpen size={30} />

                          <strong>
                            Belum ada data siswa
                          </strong>

                          <span>
                            Tidak terdapat siswa pada kelas jadwal ini.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => {
                      const hasScore =
                        student.grade?.score !== null &&
                        student.grade?.score !== undefined &&
                        String(student.grade?.score).trim() !== ''

                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>

                          <td>
                            {student.nis || '-'}
                          </td>

                          <td>
                            <div className="teacher-grade-view-student">
                              <div className="teacher-grade-view-student-icon">
                                <UserRound size={16} />
                              </div>

                              <strong>
                                {student.name || '-'}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <span className="teacher-grade-view-score">
                              {hasScore
                                ? student.grade.score
                                : '-'}
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                hasScore
                                  ? 'teacher-grade-view-status teacher-grade-view-status-filled'
                                  : 'teacher-grade-view-status teacher-grade-view-status-empty'
                              }
                            >
                              {hasScore
                                ? 'Sudah Dinilai'
                                : 'Belum Dinilai'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default TeacherGradeViewPage