import { useEffect, useState } from 'react'
import { getStudentSchedules } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import '../Jadwal/Jadwal.css'

function StudentSchedulePage() {
  const { token } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSchedules() {
      try {
        setLoading(true)
        setError('')

        const response = await getStudentSchedules(token)
        setSchedules(response.data || [])
      } catch (err) {
        setError(err.message || 'Gagal mengambil jadwal pelajaran.')
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
          <h1>Jadwal Pelajaran</h1>
          <p>Jadwal pelajaran berdasarkan kelas Anda.</p>
        </div>
      </div>

      <div className="jadwal-card">
        {loading && <p>Memuat jadwal pelajaran...</p>}

        {!loading && error && (
          <div className="jadwal-error">{error}</div>
        )}

        {!loading && !error && schedules.length === 0 && (
          <p>Belum ada jadwal pelajaran.</p>
        )}

        {!loading && !error && schedules.length > 0 && (
          <div className="jadwal-table-wrapper">
            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Jam</th>
                  <th>Mata Pelajaran</th>
                  <th>Guru</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.day}</td>
                    <td>
                      {schedule.start_time} - {schedule.end_time}
                    </td>
                    <td>{schedule.subject?.name || '-'}</td>
                    <td>{schedule.teacher?.user?.name || '-'}</td>
                    <td>{schedule.status || '-'}</td>
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

export default StudentSchedulePage