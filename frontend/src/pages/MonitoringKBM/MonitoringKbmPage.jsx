import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  RefreshCw,
  Users,
  XCircle,
} from 'lucide-react'
import { getWakakurKbmMonitoring } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './MonitoringKbmPage.css'

function formatTime(time) {
  if (!time) return '-'

  return String(time).slice(0, 5)
}

function formatDate(date) {
  if (!date) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function getStatusLabel(status) {
  return status === 'recorded'
    ? 'Tercatat'
    : 'Belum Tercatat'
}

function MonitoringKbmPage() {
  const { token } = useAuth()

  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [monitoring, setMonitoring] = useState([])

  const [summary, setSummary] = useState({
    total_schedules: 0,
    recorded_schedules: 0,
    not_recorded_schedules: 0,
    complete_attendance: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadMonitoring = useCallback(async () => {
    if (!token) {
      setError('Sesi login tidak ditemukan.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getWakakurKbmMonitoring(
        token,
        date
      )

      setMonitoring(
        response.data?.monitoring ?? []
      )

      setSummary(
        response.data?.summary ?? {
          total_schedules: 0,
          recorded_schedules: 0,
          not_recorded_schedules: 0,
          complete_attendance: 0,
        }
      )
    } catch (err) {
      setError(
        err.message ||
          'Gagal mengambil data monitoring KBM.'
      )
    } finally {
      setLoading(false)
    }
  }, [date, token])

  useEffect(() => {
    loadMonitoring()
  }, [loadMonitoring])

  return (
    <div className="monitoring-kbm-page">
      {/* Header */}
      <div className="monitoring-kbm-header">
        <div>
          <p className="monitoring-kbm-eyebrow">
            WAKAKUR
          </p>

          <h1>Monitoring KBM</h1>

          <p className="monitoring-kbm-description">
            Memantau pencatatan absensi siswa berdasarkan
            jadwal pembelajaran yang telah disetujui.
          </p>
        </div>

        <button
          type="button"
          className="monitoring-kbm-refresh"
          onClick={loadMonitoring}
          disabled={loading}
        >
          <RefreshCw size={17} />

          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* Filter tanggal */}
      <div className="monitoring-kbm-filter-card">
        <div className="monitoring-kbm-filter-label">
          <CalendarDays size={18} />

          <span>Tanggal Monitoring</span>
        </div>

        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          className="monitoring-kbm-date-input"
        />

        <span className="monitoring-kbm-selected-date">
          {formatDate(date)}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="monitoring-kbm-alert">
          <XCircle size={19} />

          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <div className="monitoring-kbm-summary-grid">
        {/* Total Jadwal */}
        <div className="monitoring-kbm-summary-card">
          <div className="monitoring-kbm-summary-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Total Jadwal</span>

            <strong>
              {summary.total_schedules}
            </strong>
          </div>
        </div>

        {/* Sudah Tercatat */}
        <div className="monitoring-kbm-summary-card">
          <div className="monitoring-kbm-summary-icon">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Sudah Tercatat</span>

            <strong>
              {summary.recorded_schedules}
            </strong>
          </div>
        </div>

        {/* Belum Tercatat */}
        <div className="monitoring-kbm-summary-card">
          <div className="monitoring-kbm-summary-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Belum Tercatat</span>

            <strong>
              {summary.not_recorded_schedules}
            </strong>
          </div>
        </div>

        {/* Absensi Lengkap */}
        <div className="monitoring-kbm-summary-card">
          <div className="monitoring-kbm-summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Absensi Lengkap</span>

            <strong>
              {summary.complete_attendance}
            </strong>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="monitoring-kbm-card">
        <div className="monitoring-kbm-card-header">
          <div>
            <h2>Daftar Monitoring KBM</h2>

            <p>
              Data berdasarkan jadwal yang berstatus
              disetujui.
            </p>
          </div>

          <span className="monitoring-kbm-count">
            {monitoring.length} jadwal
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="monitoring-kbm-state">
            <RefreshCw
              size={22}
              className="monitoring-kbm-spin"
            />

            <span>
              Memuat data monitoring KBM...
            </span>
          </div>
        ) : monitoring.length === 0 ? (
          /* Empty state */
          <div className="monitoring-kbm-state">
            <ClipboardCheck size={24} />

            <span>
              Tidak ada jadwal pembelajaran yang
              disetujui.
            </span>
          </div>
        ) : (
          /* Data table */
          <div className="monitoring-kbm-table-wrapper">
            <table className="monitoring-kbm-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Guru</th>
                  <th>Kelas</th>
                  <th>Mata Pelajaran</th>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Absensi Siswa</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {monitoring.map((item, index) => {
                  const recordedStudents =
                    item.attendance
                      ?.recorded_students ?? 0

                  const totalStudents =
                    item.attendance
                      ?.total_students ?? 0

                  const isComplete =
                    item.attendance
                      ?.is_complete ?? false

                  return (
                    <tr key={item.id}>
                      {/* No */}
                      <td>{index + 1}</td>

                      {/* Guru */}
                      <td>
                        <div className="monitoring-kbm-teacher">
                          <strong>
                            {item.teacher?.name || '-'}
                          </strong>

                          {item.teacher?.nip && (
                            <small>
                              NIP: {item.teacher.nip}
                            </small>
                          )}
                        </div>
                      </td>

                      {/* Kelas */}
                      <td>
                        <strong>
                          {item.class?.name || '-'}
                        </strong>
                      </td>

                      {/* Mata Pelajaran */}
                      <td>
                        <div className="monitoring-kbm-subject">
                          <strong>
                            {item.subject?.name || '-'}
                          </strong>

                          {item.subject?.code && (
                            <small>
                              {item.subject.code}
                            </small>
                          )}
                        </div>
                      </td>

                      {/* Hari */}
                      <td>
                        {item.day || '-'}
                      </td>

                      {/* Waktu */}
                      <td>
                        <div className="monitoring-kbm-time">
                          <Clock3 size={15} />

                          {formatTime(
                            item.start_time
                          )}

                          {' - '}

                          {formatTime(
                            item.end_time
                          )}
                        </div>
                      </td>

                      {/* Absensi */}
                      <td>
                        <div className="monitoring-kbm-attendance">
                          <strong>
                            {recordedStudents} /{' '}
                            {totalStudents}
                          </strong>

                          <span>
                            {isComplete
                              ? 'Lengkap'
                              : recordedStudents > 0
                                ? 'Belum lengkap'
                                : 'Belum tercatat'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`monitoring-kbm-status ${
                            item.status ===
                            'recorded'
                              ? 'is-recorded'
                              : 'is-not-recorded'
                          }`}
                        >
                          {item.status ===
                          'recorded' ? (
                            <CheckCircle2
                              size={15}
                            />
                          ) : (
                            <XCircle size={15} />
                          )}

                          {getStatusLabel(
                            item.status
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MonitoringKbmPage