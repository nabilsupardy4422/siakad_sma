import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  createSchedule,
  deleteSchedule,
  getScheduleOptions,
  getSchedules,
  resubmitSchedule,
  updateSchedule,
} from '../../services/api'
import './Jadwal.css'

const initialForm = {
  teacher_id: '',
  class_id: '',
  subject_id: '',
  day: 'Senin',
  start_time: '',
  end_time: '',
  status: 'draft',
}

function JadwalPage() {
  const { token } = useAuth()

  const [schedules, setSchedules] = useState([])
  const [options, setOptions] = useState({
    teachers: [],
    classes: [],
    subjects: [],
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [resubmittingId, setResubmittingId] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [success, setSuccess] = useState('')

  const loadSchedules = useCallback(async () => {
    if (!token) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await getSchedules(token)
      setSchedules(response.data || [])
    } catch (err) {
      setError(err.message || 'Gagal mengambil data jadwal.')
    } finally {
      setLoading(false)
    }
  }, [token])

  const loadOptions = useCallback(async () => {
    if (!token) {
      return
    }

    try {
      const response = await getScheduleOptions(token)

      setOptions({
        teachers: response.data?.teachers || [],
        classes: response.data?.classes || [],
        subjects: response.data?.subjects || [],
      })
    } catch (err) {
      setError(err.message || 'Gagal mengambil data pilihan jadwal.')
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      return
    }

    const loadPageData = async () => {
      setLoading(true)
      setError('')

      try {
        const [scheduleResponse, optionResponse] = await Promise.all([
          getSchedules(token),
          getScheduleOptions(token),
        ])

        setSchedules(scheduleResponse.data || [])

        setOptions({
          teachers: optionResponse.data?.teachers || [],
          classes: optionResponse.data?.classes || [],
          subjects: optionResponse.data?.subjects || [],
        })
      } catch (err) {
        setError(err.message || 'Gagal mengambil data jadwal.')
      } finally {
        setLoading(false)
      }
    }

    loadPageData()
  }, [token])

  const resetForm = () => {
    setForm(initialForm)
    setEditingSchedule(null)
    setFormError('')
    setFormErrors({})
  }

  const openCreateForm = () => {
    resetForm()
    setSuccess('')
    setError('')
    setShowForm(true)
  }

  const openEditForm = (schedule) => {
    setEditingSchedule(schedule)
    setSuccess('')
    setError('')
    setFormError('')
    setFormErrors({})

    setForm({
      teacher_id: String(schedule.teacher_id ?? ''),
      class_id: String(schedule.class_id ?? ''),
      subject_id: String(schedule.subject_id ?? ''),
      day: schedule.day || 'Senin',
      start_time: schedule.start_time?.slice(0, 5) || '',
      end_time: schedule.end_time?.slice(0, 5) || '',
      status: schedule.status || 'draft',
    })

    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    resetForm()
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setFormErrors((current) => ({
      ...current,
      [name]: undefined,
    }))

    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!token) {
      setFormError('Sesi login tidak ditemukan. Silakan login kembali.')
      return
    }

    setSaving(true)
    setFormError('')
    setFormErrors({})
    setSuccess('')
    setError('')

    const payload = {
      teacher_id: Number(form.teacher_id),
      class_id: Number(form.class_id),
      subject_id: Number(form.subject_id),
      day: form.day,
      start_time: form.start_time,
      end_time: form.end_time,
      status: form.status,
    }

    try {
      if (editingSchedule) {
        await updateSchedule(token, editingSchedule.id, payload)
        setSuccess('Jadwal berhasil diperbarui.')
      } else {
        await createSchedule(token, payload)
        setSuccess('Jadwal berhasil ditambahkan.')
      }

      setShowForm(false)
      resetForm()
      await loadSchedules()
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan jadwal.')
      setFormErrors(err.errors || {})
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (schedule) => {
    if (!token) {
      return
    }

    const confirmed = window.confirm(
      `Hapus jadwal ${schedule.subject?.name || ''} - ${schedule.class?.name || ''} pada ${schedule.day}?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingId(schedule.id)
    setError('')
    setSuccess('')

    try {
      await deleteSchedule(token, schedule.id)

      setSuccess('Jadwal berhasil dihapus.')
      await loadSchedules()
    } catch (err) {
      setError(err.message || 'Gagal menghapus jadwal.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleResubmit = async (schedule) => {
    if (!token) {
      return
    }

    const confirmed = window.confirm(
      `Kirim ulang jadwal ${schedule.subject?.name || ''} - ${schedule.class?.name || ''} pada ${schedule.day} untuk divalidasi kembali oleh Wakakur?`,
    )

    if (!confirmed) {
      return
    }

    setResubmittingId(schedule.id)
    setError('')
    setSuccess('')

    try {
      const response = await resubmitSchedule(token, schedule.id)

      setSuccess(
        response.message ||
          'Jadwal berhasil dikirim ulang untuk validasi.',
      )

      await loadSchedules()
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang jadwal.')
    } finally {
      setResubmittingId(null)
    }
  }

  return (
    <section className="jadwal-page">
      <div className="jadwal-page-header">
        <div>
          <div className="jadwal-page-title">
            <CalendarDays size={25} />
            <h1>Manajemen Jadwal</h1>
          </div>

          <p>
            Kelola jadwal pelajaran, guru, kelas, dan mata pelajaran.
          </p>
        </div>

        <div className="jadwal-page-actions">
          <button
            type="button"
            className="jadwal-refresh-button"
            onClick={loadSchedules}
            disabled={loading || saving || resubmittingId !== null}
          >
            <RefreshCw
              size={17}
              className={loading ? 'is-spinning' : ''}
            />
            Refresh
          </button>

          <button
            type="button"
            className="jadwal-primary-button"
            onClick={openCreateForm}
            disabled={saving || resubmittingId !== null}
          >
            <Plus size={18} />
            Tambah Jadwal
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

      {showForm && (
        <div className="jadwal-card jadwal-form-card">
          <div className="jadwal-card-header">
            <div>
              <h2>
                {editingSchedule
                  ? 'Edit Jadwal'
                  : 'Tambah Jadwal'}
              </h2>

              <span>
                {editingSchedule
                  ? 'Perbarui data jadwal'
                  : 'Masukkan data jadwal baru'}
              </span>
            </div>

            <button
              type="button"
              className="jadwal-close-button"
              onClick={closeForm}
              disabled={saving}
              aria-label="Tutup form"
            >
              <X size={20} />
            </button>
          </div>

          {formError && (
            <div className="jadwal-alert jadwal-alert-error">
              {formError}
            </div>
          )}

          <form
            className="jadwal-form"
            onSubmit={handleSubmit}
          >
            <div className="jadwal-form-grid">
              <div className="jadwal-form-field">
                <label htmlFor="teacher_id">
                  Guru
                </label>

                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={form.teacher_id}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="">
                    Pilih guru
                  </option>

                  {options.teachers.map((teacher) => (
                    <option
                      key={teacher.id}
                      value={teacher.id}
                    >
                      {teacher.user?.name ||
                        `Guru ${teacher.id}`}
                      {teacher.nip
                        ? ` - ${teacher.nip}`
                        : ''}
                    </option>
                  ))}
                </select>

                {formErrors.teacher_id && (
                  <small className="jadwal-field-error">
                    {formErrors.teacher_id[0]}
                  </small>
                )}
              </div>

              <div className="jadwal-form-field">
                <label htmlFor="class_id">
                  Kelas
                </label>

                <select
                  id="class_id"
                  name="class_id"
                  value={form.class_id}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="">
                    Pilih kelas
                  </option>

                  {options.classes.map((classItem) => (
                    <option
                      key={classItem.id}
                      value={classItem.id}
                    >
                      {classItem.name}
                      {classItem.level
                        ? ` - Level ${classItem.level}`
                        : ''}
                    </option>
                  ))}
                </select>

                {formErrors.class_id && (
                  <small className="jadwal-field-error">
                    {formErrors.class_id[0]}
                  </small>
                )}
              </div>

              <div className="jadwal-form-field">
                <label htmlFor="subject_id">
                  Mata Pelajaran
                </label>

                <select
                  id="subject_id"
                  name="subject_id"
                  value={form.subject_id}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="">
                    Pilih mata pelajaran
                  </option>

                  {options.subjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.name}
                      {subject.code
                        ? ` (${subject.code})`
                        : ''}
                    </option>
                  ))}
                </select>

                {formErrors.subject_id && (
                  <small className="jadwal-field-error">
                    {formErrors.subject_id[0]}
                  </small>
                )}
              </div>

              <div className="jadwal-form-field">
                <label htmlFor="day">
                  Hari
                </label>

                <select
                  id="day"
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>

                {formErrors.day && (
                  <small className="jadwal-field-error">
                    {formErrors.day[0]}
                  </small>
                )}
              </div>

              <div className="jadwal-form-field">
                <label htmlFor="start_time">
                  Jam Mulai
                </label>

                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />

                {formErrors.start_time && (
                  <small className="jadwal-field-error">
                    {formErrors.start_time[0]}
                  </small>
                )}
              </div>

              <div className="jadwal-form-field">
                <label htmlFor="end_time">
                  Jam Selesai
                </label>

                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={form.end_time}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />

                {formErrors.end_time && (
                  <small className="jadwal-field-error">
                    {formErrors.end_time[0]}
                  </small>
                )}
              </div>

              <div className="jadwal-form-field">
                <label htmlFor="status">
                  Status
                </label>

                <input
                  id="status"
                  name="status"
                  type="text"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="draft"
                  required
                  disabled={saving}
                />

                {formErrors.status && (
                  <small className="jadwal-field-error">
                    {formErrors.status[0]}
                  </small>
                )}
              </div>
            </div>

            <div className="jadwal-form-actions">
              <button
                type="button"
                className="jadwal-secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Batal
              </button>

              <button
                type="submit"
                className="jadwal-primary-button"
                disabled={saving}
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
                    {editingSchedule ? (
                      <Pencil size={17} />
                    ) : (
                      <Plus size={17} />
                    )}

                    {editingSchedule
                      ? 'Simpan Perubahan'
                      : 'Simpan Jadwal'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="jadwal-card">
        <div className="jadwal-card-header">
          <div>
            <h2>Daftar Jadwal</h2>
            <span>
              {schedules.length} jadwal
            </span>
          </div>
        </div>

        {loading ? (
          <div className="jadwal-state">
            <RefreshCw
              size={20}
              className="is-spinning"
            />
            <span>Memuat data jadwal...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="jadwal-state">
            <CalendarDays size={28} />
            <span>Belum ada data jadwal.</span>
          </div>
        ) : (
          <div className="jadwal-table-wrapper">
            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Mata Pelajaran</th>
                  <th>Guru</th>
                  <th>Kelas</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((schedule, index) => {
                  const isDeleting =
                    deletingId === schedule.id
                  const isResubmitting =
                    resubmittingId === schedule.id

                  return (
                    <tr key={schedule.id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{schedule.day}</strong>
                      </td>

                      <td>
                        {schedule.start_time?.slice(0, 5)} -{' '}
                        {schedule.end_time?.slice(0, 5)}
                      </td>

                      <td>
                        <div className="jadwal-subject">
                          <strong>
                            {schedule.subject?.name || '-'}
                          </strong>

                          <small>
                            {schedule.subject?.code || '-'}
                          </small>
                        </div>
                      </td>

                      <td>
                        {schedule.teacher?.user?.name || '-'}
                      </td>

                      <td>
                        {schedule.class?.name || '-'}
                      </td>

                      <td>
                        <span className="jadwal-status">
                          {schedule.status || '-'}
                        </span>
                      </td>

                      <td>
                        <div className="jadwal-row-actions">
                          <button
                            type="button"
                            className="jadwal-action-button jadwal-edit-button"
                            onClick={() =>
                              openEditForm(schedule)
                            }
                            disabled={
                              saving ||
                              isDeleting ||
                              isResubmitting
                            }
                            title="Edit jadwal"
                          >
                            <Pencil size={16} />
                          </button>

                          {schedule.status === 'rejected' && (
                            <button
                              type="button"
                              className="jadwal-action-button jadwal-edit-button"
                              onClick={() =>
                                handleResubmit(schedule)
                              }
                              disabled={
                                saving ||
                                isDeleting ||
                                resubmittingId !== null
                              }
                              title="Kirim ulang untuk validasi"
                            >
                              {isResubmitting ? (
                                <RefreshCw
                                  size={16}
                                  className="is-spinning"
                                />
                              ) : (
                                <RefreshCw size={16} />
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            className="jadwal-action-button jadwal-delete-button"
                            onClick={() =>
                              handleDelete(schedule)
                            }
                            disabled={
                              saving ||
                              isDeleting ||
                              isResubmitting
                            }
                            title="Hapus jadwal"
                          >
                            {isDeleting ? (
                              <RefreshCw
                                size={16}
                                className="is-spinning"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default JadwalPage