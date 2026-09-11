import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function getRolePath(roleName) {
  const rolePaths = {
    TU: '/tu',
    Wakakur: '/wakakur',
    'Guru Mata Pelajaran': '/guru',
    'Wali Kelas': '/wali-kelas',
    Siswa: '/siswa',
  }

  return rolePaths[roleName] || null
}

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated && user) {
    const rolePath = getRolePath(user.role?.name)

    if (rolePath) {
      return <Navigate to={rolePath} replace />
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!email.trim()) {
      setError('Email wajib diisi.')
      return
    }

    if (!password) {
      setError('Password wajib diisi.')
      return
    }

    setIsLoading(true)

    try {
      const loggedInUser = await login(email.trim(), password)
      const rolePath = getRolePath(loggedInUser.role?.name)

      if (!rolePath) {
        setError('Role pengguna tidak dikenali oleh sistem.')
        return
      }

      navigate(rolePath, { replace: true })
    } catch (loginError) {
      if (loginError.status === 422) {
        setError('Email atau password belum diisi dengan benar.')
      } else if (loginError.status === 401) {
        setError('Email atau password salah.')
      } else {
        setError('Tidak dapat terhubung ke server. Silakan coba lagi.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <header className="login-header">
        <Link to="/" className="login-brand">
          <span className="login-brand-mark">
            <span className="login-brand-line" />
            <span className="login-brand-dot" />
          </span>

          <span>
            <strong>SIAKAD</strong>
            <small>SMA</small>
          </span>
        </Link>

        <Link to="/" className="back-home">
          <ArrowLeft size={16} />
          Kembali ke beranda
        </Link>
      </header>

      <section className="login-content">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">
              <LockKeyhole size={22} strokeWidth={2} />
            </div>

            <span className="login-eyebrow">
              Sistem Informasi Akademik Sekolah
            </span>

            <h1>
              Selamat datang
              <br />
              kembali.
            </h1>

            <p>
              Masuk ke SIAKAD untuk mengakses informasi
              dan kebutuhan akademik sesuai akun Anda.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError('')
                  }}
                  placeholder="Masukkan email"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <LockKeyhole className="input-icon" size={18} />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                  }}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Tampilkan password'
                  }
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke SIAKAD</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-card-footer">
            <span>Platform akademik sekolah</span>
            <span className="footer-dot" />
            <span>SIAKAD SMA</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login