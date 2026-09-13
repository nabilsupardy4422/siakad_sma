import { useCallback, useEffect, useState } from 'react'
import {
  Award,
  BookOpen,
  RefreshCw,
  Users,
  UserRound,
} from 'lucide-react'
import { getWakakurGradeMonitoring } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './WakakurGradeMonitoringPage.css'

function WakakurGradeMonitoringPage() {
  const { token } = useAuth()

  const [summary, setSummary] = useState(null)
  const [monitoring, setMonitoring] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadMonitoring = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response =
        await getWakakurGradeMonitoring(token)

      setSummary(
        response.data?.summary || null,
      )

      setMonitoring(
        response.data?.monitoring || [],
      )
    } catch (err) {
      setError(
        err.message ||
          'Gagal memuat monitoring nilai.',
      )

      setSummary(null)
      setMonitoring([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadMonitoring()
  }, [loadMonitoring])

  return (
    <div className="wakakur-grade-page">
      <div className="wakakur-grade-header">
        <div>
          <span className="wakakur-grade-eyebrow">
            MONITORING AKADEMIK
          </span>

          <h1 className="wakakur-grade-title">
            Monitoring Nilai
          </h1>

          <p className="wakakur-grade-description">
            Pantau ketersediaan data nilai berdasarkan
            kelas, mata pelajaran, dan guru.
          </p>
        </div>

        <button
          type="button"
          className="wakakur-grade-refresh"
          onClick={loadMonitoring}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? 'wakakur-grade-spin'
                : ''
            }
          />

          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div
          className="wakakur-grade-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="wakakur-grade-state">
          <RefreshCw
            size={24}
            className="wakakur-grade-spin"
          />

          <p>
            Memuat monitoring nilai...
          </p>
        </div>
      ) : (
        <>
          <div className="wakakur-grade-summary">
            <div className="wakakur-grade-stat">
              <div className="wakakur-grade-stat-icon">
                <Users size={20} />
              </div>

              <div>
                <span className="wakakur-grade-stat-label">
                  Total Siswa
                </span>

                <strong className="wakakur-grade-stat-value">
                  {summary?.total_students ?? 0}
                </strong>
              </div>
            </div>

            <div className="wakakur-grade-stat">
              <div className="wakakur-grade-stat-icon">
                <Award size={20} />
              </div>

              <div>
                <span className="wakakur-grade-stat-label">
                  Sudah Memiliki Nilai
                </span>

                <strong className="wakakur-grade-stat-value">
                  {summary?.students_with_grades ?? 0}
                </strong>
              </div>
            </div>

            <div className="wakakur-grade-stat">
              <div className="wakakur-grade-stat-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <span className="wakakur-grade-stat-label">
                  Belum Memiliki Nilai
                </span>

                <strong className="wakakur-grade-stat-value">
                  {summary?.students_without_grades ?? 0}
                </strong>
              </div>
            </div>

            <div className="wakakur-grade-stat">
              <div className="wakakur-grade-stat-icon">
                <Award size={20} />
              </div>

              <div>
                <span className="wakakur-grade-stat-label">
                  Total Data Nilai
                </span>

                <strong className="wakakur-grade-stat-value">
                  {summary?.total_grades ?? 0}
                </strong>
              </div>
            </div>
          </div>

          <div className="wakakur-grade-table-card">
            <div className="wakakur-grade-table-header">
              <div>
                <h2 className="wakakur-grade-table-title">
                  Rekap Monitoring Nilai
                </h2>

                <p className="wakakur-grade-table-description">
                  Status pengisian nilai berdasarkan
                  kelas dan mata pelajaran.
                </p>
              </div>
            </div>

            <div className="wakakur-grade-table-wrapper">
              <table className="wakakur-grade-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kelas</th>
                    <th>Mata Pelajaran</th>
                    <th>Guru</th>
                    <th>Total Siswa</th>
                    <th>Sudah Dinilai</th>
                    <th>Belum Dinilai</th>
                    <th>Total Data</th>
                  </tr>
                </thead>

                <tbody>
                  {monitoring.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="wakakur-grade-empty"
                      >
                        <div className="wakakur-grade-empty-content">
                          <BookOpen size={30} />

                          <strong>
                            Belum ada data monitoring nilai
                          </strong>

                          <span>
                            Data akan tampil setelah
                            terdapat nilai siswa.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    monitoring.map(
                      (item, index) => (
                        <tr
                          key={[
                            item.class?.id,
                            item.subject?.id,
                            item.teacher?.id,
                          ].join('-')}
                        >
                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <div className="wakakur-grade-class">
                              <strong>
                                {item.class?.name ||
                                  '-'}
                              </strong>

                              {item.class?.level && (
                                <span>
                                  {item.class.level}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="wakakur-grade-subject">
                              <strong>
                                {item.subject?.name ||
                                  '-'}
                              </strong>

                              {item.subject?.code && (
                                <span>
                                  {item.subject.code}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="wakakur-grade-teacher">
                              <div className="wakakur-grade-teacher-icon">
                                <UserRound
                                  size={15}
                                />
                              </div>

                              <div>
                                <strong>
                                  {item.teacher?.name ||
                                    '-'}
                                </strong>

                                {item.teacher?.nip && (
                                  <span>
                                    {item.teacher.nip}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            {item.total_students ?? 0}
                          </td>

                          <td>
                            <span className="wakakur-grade-badge wakakur-grade-badge-success">
                              {item.graded_students ??
                                0}
                            </span>
                          </td>

                          <td>
                            <span className="wakakur-grade-badge wakakur-grade-badge-warning">
                              {item.ungraded_students ??
                                0}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {item.total_grades ?? 0}
                            </strong>
                          </td>
                        </tr>
                      ),
                    )
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

export default WakakurGradeMonitoringPage