import { useEffect, useState } from 'react'
import {
  ClipboardCheck,
  ClipboardList,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getTeacherSchedules } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import '../Jadwal/Jadwal.css'

function TeacherSchedulePage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSchedules() {
      try {
        setLoading(true)
        setError('')

        const response = await getTeacherSchedules(token)
        setSchedules(response.data || [])
      } catch (err) {
        setError(
          err.message || 'Gagal mengambil jadwal mengajar.',
        )
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadSchedules()
    }
  }, [token])

  return (
    <div className="jadwal-page">
      <div className="jadwal-header">
        <div>
          <h1>Jadwal Mengajar</h1>
          <p>Jadwal mengajar Anda.</p>
        </div>
      </div>

      <div className="jadwal-card">
        {loading && <p>Memuat jadwal mengajar...</p>}

        {!loading && error && (
          <div className="jadwal-error">
            {error}
          </div>
        )}

        {!loading && !error && schedules.length === 0 && (
          <p>Belum ada jadwal mengajar.</p>
        )}

        {!loading && !error && schedules.length > 0 && (
          <div className="jadwal-table-wrapper">
            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Jam</th>
                  <th>Kelas</th>
                  <th>Mata Pelajaran</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.day}</td>

                    <td>
                      {schedule.start_time} -{' '}
                      {schedule.end_time}
                    </td>

                    <td>
                      {schedule.class?.name || '-'}
                    </td>

                    <td>
                      {schedule.subject?.name || '-'}
                    </td>

                    <td>
                      {schedule.status || '-'}
                    </td>

                    <td>
                      {schedule.status === 'approved' ? (
                        <div className="jadwal-row-actions">
                          <button
                            type="button"
                            className="jadwal-primary-button"
                            onClick={() =>
                              navigate(
                                `/guru/absensi/${schedule.id}`,
                              )
                            }
                          >
                            <ClipboardCheck size={16} />
                            Absensi
                          </button>

                          <button
                            type="button"
                            className="jadwal-primary-button"
                            onClick={() =>
                              navigate(
                                `/guru/penilaian/${schedule.id}`,
                              )
                            }
                          >
                            <ClipboardList size={16} />
                            Penilaian
                          </button>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherSchedulePage