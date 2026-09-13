import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/landing/Navbar'
import Hero from './components/landing/Hero'
import Features from './components/landing/Features'
import About from './components/landing/About'
import CTA from './components/landing/CTA'
import Footer from './components/landing/Footer'
import Login from './pages/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardLayout from './components/dashboard/DashboardLayout'
import TuDashboard from './pages/Dashboard/TuDashboard'
import WakakurDashboard from './pages/Dashboard/WakakurDashboard'
import GuruDashboard from './pages/Dashboard/GuruDashboard'
import WaliKelasDashboard from './pages/Dashboard/WaliKelasDashboard'
import SiswaDashboard from './pages/Dashboard/SiswaDashboard'
import JadwalPage from './pages/Jadwal/JadwalPage'
import ScheduleMonitoringPage from './pages/JadwalWorkflow/ScheduleMonitoringPage'
import TeacherSchedulePage from './pages/JadwalWorkflow/TeacherSchedulePage'
import StudentSchedulePage from './pages/JadwalWorkflow/StudentSchedulePage'
import AttendancePage from './pages/Absensi/AttendancePage'
import StudentAttendancePage from './pages/Absensi/StudentAttendancePage'
import WaliKelasAttendancePage from './pages/Absensi/WaliKelasAttendancePage'
import WaliKelasGradePage from './pages/Penilaian/WaliKelasGradePage'
import StudentGradePage from './pages/Penilaian/StudentGradePage'
import TeacherGradeViewPage from './pages/Penilaian/TeacherGradeViewPage'
import WakakurGradeMonitoringPage from './pages/Penilaian/WakakurGradeMonitoringPage'
import GradePage from './pages/Penilaian/GradePage'
import './App.css'

function LandingPage() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <About />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* =====================================================
            TU
        ====================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['TU']} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/tu"
              element={<TuDashboard />}
            />

            <Route
              path="/tu/jadwal"
              element={<JadwalPage />}
            />
          </Route>
        </Route>

        {/* =====================================================
            WAKAKUR
        ====================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['Wakakur']} />}>
          <Route element={<DashboardLayout />}>

            {/* Dashboard Wakakur */}
            <Route
              path="/wakakur"
              element={<WakakurDashboard />}
            />

            {/* Jadwal */}
            <Route
              path="/wakakur/jadwal"
              element={<ScheduleMonitoringPage />}
            />

            {/* Monitoring KBM */}
            <Route
              path="/wakakur/monitoring"
              element={<ScheduleMonitoringPage />}
            />

            {/* Evaluasi Akademik / Monitoring Nilai */}
            <Route
              path="/wakakur/evaluasi"
              element={<WakakurGradeMonitoringPage />}
            />

          </Route>
        </Route>

        {/* =====================================================
            GURU MATA PELAJARAN
        ====================================================== */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={['Guru Mata Pelajaran']}
            />
          }
        >
          <Route element={<DashboardLayout />}>

            {/* Dashboard Guru */}
            <Route
              path="/guru"
              element={<GuruDashboard />}
            />

            {/* Jadwal Mengajar Guru */}
            <Route
              path="/guru/jadwal"
              element={<TeacherSchedulePage />}
            />

            {/* =================================================
                ABSENSI GURU
            ================================================== */}
            <Route
              path="/guru/absensi/:scheduleId"
              element={<AttendancePage />}
            />

            {/* =================================================
                PENILAIAN GURU
                Core input/update milik Nabil
            ================================================== */}

            {/* Input / Update Nilai */}
            <Route
              path="/guru/penilaian/:scheduleId"
              element={<GradePage />}
            />

            {/* Read-only Grade View / Monitoring
                Bagian Claudio */}
            <Route
              path="/guru/penilaian/:scheduleId/view"
              element={<TeacherGradeViewPage />}
            />

          </Route>
        </Route>

        {/* =====================================================
            WALI KELAS
        ====================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['Wali Kelas']} />}>
          <Route element={<DashboardLayout />}>

            {/* Dashboard Wali Kelas */}
            <Route
              path="/wali-kelas"
              element={<WaliKelasDashboard />}
            />

            {/* Rekap Absensi */}
            <Route
              path="/wali-kelas/absensi"
              element={<WaliKelasAttendancePage />}
            />

            {/* Rekap Nilai */}
            <Route
              path="/wali-kelas/nilai"
              element={<WaliKelasGradePage />}
            />

          </Route>
        </Route>

        {/* =====================================================
            SISWA
        ====================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['Siswa']} />}>
          <Route element={<DashboardLayout />}>

            {/* Dashboard Siswa */}
            <Route
              path="/siswa"
              element={<SiswaDashboard />}
            />

            {/* Jadwal Siswa */}
            <Route
              path="/siswa/jadwal"
              element={<StudentSchedulePage />}
            />

            {/* Riwayat Absensi */}
            <Route
              path="/siswa/absensi"
              element={<StudentAttendancePage />}
            />

            {/* Nilai Siswa */}
            <Route
              path="/siswa/nilai"
              element={<StudentGradePage />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App