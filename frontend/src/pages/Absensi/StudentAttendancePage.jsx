import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getStudentAttendance } from '../../services/api'
import '../Jadwal/Jadwal.css'

const STATUS_LABELS = {
  hadir: 'Hadir',
  izin: 'Izin',
  sakit: 'Sakit',
  alpa: 'Alpa',
}

function formatDate(dateString) {
  if (!dateString) {
    return '-'
  }

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function StudentAttendancePage() {
  const { token } = useAuth()

  const [attendances, setAttendances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAttendance = async () => {
    if (!token) {
      setAttendances([])
      setError('Sesi login tidak ditemukan. Silakan login kembali.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getStudentAttendance(token)

      setAttendances(response.data || [])
    } catch (err) {
      setAttendances([])
      setError(
        err.message || 'Gagal mengambil riwayat presensi.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttendance()
  }, [token])

  const summary = useMemo(() => {
    return attendances.reduce(
      (result, attendance) => {
        const status = attendance.status

        if (Object.prototype.hasOwnProperty.call(result, status)) {
          result[status] += 1
        }

        return result
      },
      {
        hadir: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,
      },
    )
  }, [attendances])

  return (
    <section className="jadwal-page">
      <div className="jadwal-page-header">
        <div>
          <div className="jadwal-page-title">
            <CalendarDays size={25} />
            <h1>Riwayat Presensi</h1>
          </div>

          <p>
            Melihat riwayat presensi Anda.
          </p>
        </div>

        <div className="jadwal-page-actions">
          <button
            type="button"
            className="jadwal-refresh-button"
            onClick={loadAttendance}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? 'is-spinning' : ''}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="jadwal-alert jadwal-alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="jadwal-card">
          <div className="jadwal-state">
            <RefreshCw
              size={20}
              className="is-spinning"
            />

            <span>
              Memuat riwayat presensi...
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="jadwal-card">
            <div className="jadwal-card-header">
              <div>
                <h2>Ringkasan Presensi</h2>

                <span>
                  {attendances.length} data presensi
                </span>
              </div>
            </div>

            <div className="attendance-summary">
              {Object.entries(STATUS_LABELS).map(
                ([status, label]) => (
                  <div
                    key={status}
                    className="attendance-summary-item"
                  >
                    <strong>
                      {summary[status]}
                    </strong>

                    <span>{label}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="jadwal-card">
            <div className="jadwal-card-header">
              <div>
                <h2>Riwayat Presensi</h2>

                <span>
                  Data presensi berdasarkan akun siswa
                </span>
              </div>
            </div>

            {attendances.length === 0 ? (
              <div className="jadwal-state">
                <span>
                  Belum ada data presensi.
                </span>
              </div>
            ) : (
              <div className="jadwal-table-wrapper">
                <table className="jadwal-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Mata Pelajaran</th>
                      <th>Guru</th>
                      <th>Jam</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendances.map(
                      (attendance, index) => (
                        <tr key={attendance.id}>
                          <td>{index + 1}</td>

                          <td>
                            {formatDate(
                              attendance.date,
                            )}
                          </td>

                          <td>
                            <strong>
                              {attendance.schedule
                                ?.subject?.name || '-'}
                            </strong>
                          </td>

                          <td>
                            {attendance.schedule
                              ?.teacher?.name || '-'}
                          </td>

                          <td>
                            {attendance.schedule
                              ?.start_time
                              ?.slice(0, 5) || '-'}
                            {' - '}
                            {attendance.schedule
                              ?.end_time
                              ?.slice(0, 5) || '-'}
                          </td>

                          <td>
                            {STATUS_LABELS[
                              attendance.status
                            ] ||
                              attendance.status ||
                              '-'}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default StudentAttendancePage