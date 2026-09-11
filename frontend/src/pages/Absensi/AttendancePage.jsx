import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Save,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getAttendance,
  saveAttendance,
} from '../../services/api'
import '../Jadwal/Jadwal.css'

const ATTENDANCE_STATUSES = [
  {
    value: 'hadir',
    label: 'Hadir',
  },
  {
    value: 'izin',
    label: 'Izin',
  },
  {
    value: 'sakit',
    label: 'Sakit',
  },
  {
    value: 'alpa',
    label: 'Alpa',
  },
]

function getTodayDate() {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function AttendancePage() {
  const { token } = useAuth()
  const { scheduleId } = useParams()
  const navigate = useNavigate()

  const [date, setDate] = useState(getTodayDate())
  const [schedule, setSchedule] = useState(null)
  const [students, setStudents] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadAttendance = useCallback(async () => {
    if (!token || !scheduleId || !date) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await getAttendance(
        token,
        scheduleId,
        date,
      )

      setSchedule(response.data?.schedule || null)
      setStudents(response.data?.students || [])
    } catch (err) {
      setError(
        err.message || 'Gagal mengambil data absensi.',
      )

      setSchedule(null)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [token, scheduleId, date])

  useEffect(() => {
    loadAttendance()
  }, [loadAttendance])

  const attendanceSummary = useMemo(() => {
    return ATTENDANCE_STATUSES.reduce(
      (summary, status) => {
        summary[status.value] = students.filter(
          (student) =>
            student.attendance?.status === status.value,
        ).length

        return summary
      },
      {},
    )
  }, [students])

  const updateStudentStatus = (studentId, status) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: {
                ...(student.attendance || {}),
                status,
                date,
              },
            }
          : student,
      ),
    )

    setSuccess('')
    setError('')
  }

  const handleSave = async () => {
    if (!token) {
      setError(
        'Sesi login tidak ditemukan. Silakan login kembali.',
      )
      return
    }

    if (!schedule) {
      setError('Data jadwal tidak ditemukan.')
      return
    }

    if (students.length === 0) {
      setError('Tidak ada siswa pada kelas jadwal ini.')
      return
    }

    const incompleteStudent = students.find(
      (student) => !student.attendance?.status,
    )

    if (incompleteStudent) {
      setError(
        `Status absensi untuk ${
          incompleteStudent.name || 'siswa'
        } belum dipilih.`,
      )
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      date,
      attendances: students.map((student) => ({
        student_id: student.id,
        status: student.attendance.status,
      })),
    }

    try {
      const response = await saveAttendance(
        token,
        scheduleId,
        payload,
      )

      setSuccess(
        response.message ||
          'Absensi berhasil disimpan.',
      )

      await loadAttendance()
    } catch (err) {
      setError(
        err.message || 'Gagal menyimpan absensi.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDateChange = (event) => {
    setDate(event.target.value)
    setSuccess('')
    setError('')
  }

  const handleRefresh = async () => {
    setSuccess('')
    setError('')
    await loadAttendance()
  }

  const handleBack = () => {
    navigate('/guru/jadwal')
  }

  return (
    <section className="jadwal-page">
      <div className="jadwal-page-header">
        <div>
          <div className="jadwal-page-title">
            <CalendarDays size={25} />

            <h1>Absensi Siswa</h1>
          </div>

          <p>
            Catat kehadiran siswa berdasarkan jadwal
            mengajar.
          </p>
        </div>

        <div className="jadwal-page-actions">
          <button
            type="button"
            className="jadwal-secondary-button"
            onClick={handleBack}
            disabled={saving}
          >
            <ArrowLeft size={17} />
            Kembali
          </button>

          <button
            type="button"
            className="jadwal-refresh-button"
            onClick={handleRefresh}
            disabled={loading || saving}
          >
            <RefreshCw
              size={17}
              className={
                loading ? 'is-spinning' : ''
              }
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

      {success && (
        <div className="jadwal-alert jadwal-alert-success">
          {success}
        </div>
      )}

      {schedule && (
        <div className="jadwal-card">
          <div className="jadwal-card-header">
            <div>
              <h2>
                {schedule.subject?.name ||
                  'Mata Pelajaran'}
              </h2>

              <span>
                {schedule.class?.name || '-'} •{' '}
                {schedule.day || '-'} •{' '}
                {schedule.start_time?.slice(0, 5) ||
                  '-'}{' '}
                -{' '}
                {schedule.end_time?.slice(0, 5) ||
                  '-'}
              </span>
            </div>

            <span className="jadwal-status">
              {schedule.status || '-'}
            </span>
          </div>

          <div className="jadwal-form-field">
            <label htmlFor="attendance-date">
              Tanggal Absensi
            </label>

            <input
              id="attendance-date"
              type="date"
              value={date}
              onChange={handleDateChange}
              disabled={loading || saving}
            />
          </div>
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
              Memuat data siswa dan absensi...
            </span>
          </div>
        </div>
      ) : (
        schedule && (
          <>
            <div className="jadwal-card">
              <div className="jadwal-card-header">
                <div>
                  <h2>Ringkasan Kehadiran</h2>

                  <span>
                    {students.length} siswa
                  </span>
                </div>
              </div>

              <div className="attendance-summary">
                {ATTENDANCE_STATUSES.map(
                  (status) => (
                    <div
                      key={status.value}
                      className="attendance-summary-item"
                    >
                      <strong>
                        {attendanceSummary[
                          status.value
                        ] || 0}
                      </strong>

                      <span>
                        {status.label}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="jadwal-card">
              <div className="jadwal-card-header">
                <div>
                  <h2>Daftar Siswa</h2>

                  <span>
                    Pilih status kehadiran setiap siswa.
                  </span>
                </div>

                <button
                  type="button"
                  className="jadwal-primary-button"
                  onClick={handleSave}
                  disabled={
                    saving ||
                    students.length === 0
                  }
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="is-spinning"
                      />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Simpan Absensi
                    </>
                  )}
                </button>
              </div>

              {students.length === 0 ? (
                <div className="jadwal-state">
                  <span>
                    Belum ada siswa pada kelas ini.
                  </span>
                </div>
              ) : (
                <div className="jadwal-table-wrapper">
                  <table className="jadwal-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>NIS</th>
                        <th>Nama Siswa</th>
                        <th>Status Kehadiran</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map(
                        (student, index) => (
                          <tr key={student.id}>
                            <td>{index + 1}</td>

                            <td>
                              {student.nis || '-'}
                            </td>

                            <td>
                              <strong>
                                {student.name || '-'}
                              </strong>
                            </td>

                            <td>
                              <select
                                value={
                                  student.attendance
                                    ?.status || ''
                                }
                                onChange={(event) =>
                                  updateStudentStatus(
                                    student.id,
                                    event.target.value,
                                  )
                                }
                                disabled={saving}
                              >
                                <option value="">
                                  Pilih status
                                </option>

                                {ATTENDANCE_STATUSES.map(
                                  (status) => (
                                    <option
                                      key={
                                        status.value
                                      }
                                      value={
                                        status.value
                                      }
                                    >
                                      {status.label}
                                    </option>
                                  ),
                                )}
                              </select>
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
        )
      )}
    </section>
  )
}

export default AttendancePage