import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isInitializing, user } = useAuth()

  if (isInitializing) {
    return (
      <main style={{ padding: '40px', fontFamily: 'inherit' }}>
        <p>Memeriksa sesi...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const roleName = user?.role?.name

  if (allowedRoles && !allowedRoles.includes(roleName)) {
    return <Navigate to={getRolePath(roleName)} replace />
  }

  return <Outlet />
}

function getRolePath(roleName) {
  const rolePaths = {
    TU: '/tu',
    Wakakur: '/wakakur',
    'Guru Mata Pelajaran': '/guru',
    'Wali Kelas': '/wali-kelas',
    Siswa: '/siswa',
  }

  return rolePaths[roleName] || '/login'
}

export default ProtectedRoute