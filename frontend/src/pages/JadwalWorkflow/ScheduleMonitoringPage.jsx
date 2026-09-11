import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  approveSchedule,
  getScheduleMonitoring,
  rejectSchedule,
} from '../../services/api'
import '../Jadwal/Jadwal.css'

function ScheduleMonitoringPage() {
  const { token } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadSchedules = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getScheduleMonitoring(token)
      setSchedules(response.data || [])
    } catch (err) {
      setError(err.message || 'Gagal mengambil data monitoring jadwal.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  const handleApprove = async (scheduleId) => {
    try {
      setProcessingId(scheduleId)
      setError('')
      setMessage('')

      const response = await approveSchedule(token, scheduleId)

      setMessage(response.message || 'Jadwal berhasil disetujui.')
      await loadSchedules()
    } catch (err) {
      setError(err.message || 'Gagal menyetujui jadwal.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (scheduleId) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menolak jadwal ini?'
    )

    if (!confirmed) {
      return
    }

    try {
      setProcessingId(scheduleId)
      setError('')
      setMessage('')

      const response = await rejectSchedule(token, scheduleId)

      setMessage(response.message || 'Jadwal berhasil ditolak.')
      await loadSchedules()
    } catch (err) {
      setError(err.message || 'Gagal menolak jadwal.')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusLabel = (status) => {
    if (status === 'approved') {
      return 'Disetujui'
    }

    if (status === 'rejected') {
      return 'Ditolak'
    }

    return 'Draft'
  }

  if (loading) {
    return (
      <div className="jadwal-page">
        <div className="jadwal-card">
          <div className="jadwal-empty">
            Memuat data monitoring jadwal...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="jadwal-page">
      <div className="jadwal-header">
        <div>
          <h1>Monitoring Jadwal</h1>
          <p>
            Monitoring dan validasi jadwal yang dikelola oleh TU.
          </p>
        </div>
      </div>

      {message && (
        <div className="jadwal-alert jadwal-alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="jadwal-alert jadwal-alert-error">
          {error}
        </div>
      )}

      <div className="jadwal-card">
        <div className="jadwal-card-header">
          <div>
            <h2>Daftar Jadwal</h2>
            <p>
              Validasi jadwal dilakukan oleh Wakakur sebelum digunakan.
            </p>
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="jadwal-empty">
            Belum ada data jadwal.
          </div>
        ) : (
          <div className="jadwal-table-wrapper">
            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Guru</th>
                  <th>Kelas</th>
                  <th>Mata Pelajaran</th>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((schedule, index) => {
                  const isProcessing = processingId === schedule.id
                  const isDraft = schedule.status === 'draft'

                  return (
                    <tr key={schedule.id}>
                      <td>{index + 1}</td>

                      <td>
                        {schedule.teacher?.user?.name || '-'}
                      </td>

                      <td>
                        {schedule.class?.name || '-'}
                      </td>

                      <td>
                        {schedule.subject?.name || '-'}
                      </td>

                      <td>
                        {schedule.day || '-'}
                      </td>

                      <td>
                        {schedule.start_time
                          ? schedule.start_time.slice(0, 5)
                          : '-'}
                        {' - '}
                        {schedule.end_time
                          ? schedule.end_time.slice(0, 5)
                          : '-'}
                      </td>

                      <td>
                        <span
                          className={`jadwal-status jadwal-status-${schedule.status}`}
                        >
                          {getStatusLabel(schedule.status)}
                        </span>
                      </td>

                      <td>
                        {isDraft ? (
                          <div className="jadwal-actions">
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() =>
                                handleApprove(schedule.id)
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? 'Memproses...'
                                : 'Approve'}
                            </button>

                            <button
                              type="button"
                              className="btn-danger"
                              onClick={() =>
                                handleReject(schedule.id)
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? 'Memproses...'
                                : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
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

export default ScheduleMonitoringPage