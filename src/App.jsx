// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Admissions from './pages/Admissions'
import Faculty from './pages/Faculty'
import Gallery from './pages/Gallery'
import Notices from './pages/Notices'
import Events from './pages/Events'
import Contact from './pages/Contact'
import Login from './pages/Login'
import StudentPortal from './pages/StudentPortal'
import TeacherPortal from './pages/TeacherPortal'
import AdminDashboard from './pages/AdminDashboard'

// ── Auth Context ─────────────────────────────────────────────
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

// Pages that use full-screen layout (no Navbar/Footer)
const FULL_SCREEN = ['/login', '/admin', '/portal', '/teacher-portal']

export default function App() {
  const [user, setUser]   = useState(() => { try { return JSON.parse(localStorage.getItem('ep_user')) } catch { return null } })
  const [token, setToken] = useState(() => localStorage.getItem('ep_token') || null)

  const login = (userData, tok) => {
    setUser(userData)
    setToken(tok)
    localStorage.setItem('ep_user',  JSON.stringify(userData))
    localStorage.setItem('ep_token', tok)
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('ep_user')
    localStorage.removeItem('ep_token')
  }

  const isFullScreen = (path) => FULL_SCREEN.some(p => path === p || path.startsWith(p + '/'))
  const path = window.location.pathname
  const showShell = !isFullScreen(path)

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <div className="min-h-screen flex flex-col">
        {showShell && <Navbar />}
        <main className="flex-1">
          <Routes>
            {/* ── Public ── */}
            <Route path="/"           element={<Home />} />
            <Route path="/about"      element={<About />} />
            <Route path="/academics"  element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/faculty"    element={<Faculty />} />
            <Route path="/gallery"    element={<Gallery />} />
            <Route path="/notices"    element={<Notices />} />
            <Route path="/events"     element={<Events />} />
            <Route path="/contact"    element={<Contact />} />
            <Route path="/login"      element={<Login />} />

            {/* ── Protected: Student portal ── */}
            <Route path="/portal" element={
              <ProtectedRoute roles={['student']}>
                <StudentPortal />
              </ProtectedRoute>
            } />

            {/* ── Protected: Teacher portal ── */}
            <Route path="/teacher-portal" element={
              <ProtectedRoute roles={['teacher']}>
                <TeacherPortal />
              </ProtectedRoute>
            } />

            {/* ── Protected: Admin only ── */}
            <Route path="/admin/*" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="text-8xl mb-6">🌿</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        {showShell && <Footer />}
      </div>
    </AuthContext.Provider>
  )
}
