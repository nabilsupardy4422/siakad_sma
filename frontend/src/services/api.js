const API_URL = 'http://127.0.0.1:8000/api'

export async function loginRequest(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Login gagal.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Gagal mengambil data pengguna.')
    error.status = response.status
    throw error
  }

  return data
}

export async function logoutRequest(token) {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Logout gagal.')
    error.status = response.status
    throw error
  }

  return data
}

export async function getSchedules(token) {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Gagal mengambil data jadwal.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export async function createSchedule(token, scheduleData) {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scheduleData),
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Gagal menambahkan jadwal.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export async function updateSchedule(token, id, scheduleData) {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scheduleData),
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Gagal memperbarui jadwal.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export async function deleteSchedule(token, id) {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Gagal menghapus jadwal.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export async function getScheduleOptions(token) {
  const response = await fetch(`${API_URL}/schedule-options`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(
      data.message || 'Gagal mengambil pilihan jadwal.',
    )
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}