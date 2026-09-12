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

        {/* TU */}
        <Route element={<ProtectedRoute allowedRoles={['TU']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/tu" element={<TuDashboard />} />
            <Route path="/tu/jadwal" element={<JadwalPage />} />
          </Route>
        </Route>

        {/* Wakakur */}
        <Route element={<ProtectedRoute allowedRoles={['Wakakur']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/wakakur" element={<WakakurDashboard />} />
            <Route
              path="/wakakur/jadwal"
              element={<ScheduleMonitoringPage />}
            />
          </Route>
        </Route>

        {/* Guru Mata Pelajaran */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={['Guru Mata Pelajaran']}
            />
          }
        >
          <Route element={<DashboardLayout />}>
            <Route path="/guru" element={<GuruDashboard />} />

            <Route
              path="/guru/jadwal"
              element={<TeacherSchedulePage />}
            />

            <Route
              path="/guru/absensi/:scheduleId"
              element={<AttendancePage />}
            />

            <Route
              path="/guru/penilaian/:scheduleId"
              element={<GradePage />}
            />
          </Route>
        </Route>

        {/* Wali Kelas */}
        <Route element={<ProtectedRoute allowedRoles={['Wali Kelas']} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/wali-kelas"
              element={<WaliKelasDashboard />}
            />

            <Route
              path="/wali-kelas/absensi"
              element={<WaliKelasAttendancePage />}
            />
          </Route>
        </Route>

        {/* Siswa */}
        <Route element={<ProtectedRoute allowedRoles={['Siswa']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/siswa" element={<SiswaDashboard />} />

            <Route
              path="/siswa/jadwal"
              element={<StudentSchedulePage />}
            />

            <Route
              path="/siswa/absensi"
              element={<StudentAttendancePage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App