import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  RefreshCw,
  Save,
  ClipboardList,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getGrades,
  saveGrades,
} from '../../services/api'
import '../Jadwal/Jadwal.css'

function GradePage() {
  const { token } = useAuth()
  const { scheduleId } = useParams()
  const navigate = useNavigate()

  const [schedule, setSchedule] = useState(null)
  const [students, setStudents] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadGrades = useCallback(async () => {
    if (!token || !scheduleId) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await getGrades(
        token,
        scheduleId,
      )

      setSchedule(response.data?.schedule || null)
      setStudents(response.data?.students || [])
    } catch (err) {
      setError(
        err.message || 'Gagal mengambil data nilai.',
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

  const filledCount = useMemo(() => {
    return students.filter(
      (student) =>
        student.grade?.score !== null &&
        student.grade?.score !== undefined &&
        student.grade?.score !== '',
    ).length
  }, [students])

  const updateScore = (studentId, score) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              grade: {
                ...(student.grade || {}),
                score,
              },
            }
          : student,
      ),
    )

    setError('')
    setSuccess('')
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
      setError(
        'Tidak ada siswa pada kelas jadwal ini.',
      )
      return
    }

    const studentsWithScore = students.filter(
      (student) => {
        const score = student.grade?.score

        return (
          score !== null &&
          score !== undefined &&
          String(score).trim() !== ''
        )
      },
    )

    if (studentsWithScore.length === 0) {
      setError(
        'Belum ada nilai yang diisi.',
      )
      return
    }

    const invalidStudent = studentsWithScore.find(
      (student) =>
        Number.isNaN(
          Number(student.grade?.score),
        ),
    )

    if (invalidStudent) {
      setError(
        `Nilai ${
          invalidStudent.name || 'siswa'
        } harus berupa angka.`,
      )
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      grades: studentsWithScore.map((student) => ({
        student_id: student.id,
        score: Number(student.grade.score),
      })),
    }

    try {
      const response = await saveGrades(
        token,
        scheduleId,
        payload,
      )

      setSuccess(
        response.message ||
          'Nilai berhasil disimpan.',
      )

      await loadGrades()
    } catch (err) {
      setError(
        err.message || 'Gagal menyimpan nilai.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = async () => {
    setSuccess('')
    setError('')
    await loadGrades()
  }

  const handleBack = () => {
    navigate('/guru/jadwal')
  }

  return (
    <section className="jadwal-page">
      <div className="jadwal-page-header">
        <div>
          <div className="jadwal-page-title">
            <ClipboardList size={25} />

            <h1>Input Nilai Siswa</h1>
          </div>

          <p>
            Kelola nilai siswa berdasarkan jadwal
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
                {schedule.class?.name || '-'} ·{' '}
                {schedule.day || '-'} ·{' '}
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
              Memuat data siswa dan nilai...
            </span>
          </div>
        </div>
      ) : schedule ? (
        <>
          <div className="jadwal-card">
            <div className="jadwal-card-header">
              <div>
                <h2>Ringkasan Input Nilai</h2>

                <span>
                  {filledCount} dari {students.length}{' '}
                  siswa telah memiliki nilai.
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
                    Simpan Nilai
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="jadwal-card">
            <div className="jadwal-card-header">
              <div>
                <h2>Daftar Siswa</h2>

                <span>
                  Masukkan nilai untuk setiap siswa.
                </span>
              </div>
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
                      <th>Nilai</th>
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
                            <input
                              type="number"
                              inputMode="decimal"
                              className="nilai-input"
                              value={
                                student.grade?.score ??
                                ''
                              }
                              onChange={(event) =>
                                updateScore(
                                  student.id,
                                  event.target.value,
                                )
                              }
                              disabled={saving}
                              placeholder="Masukkan nilai"
                            />
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
      ) : (
        !error && (
          <div className="jadwal-card">
            <div className="jadwal-state">
              <span>
                Data jadwal tidak ditemukan.
              </span>
            </div>
          </div>
        )
      )}
    </section>
  )
}

export default GradePage