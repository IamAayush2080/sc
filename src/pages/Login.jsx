// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

const API = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api'

export default function Login() {
  const [mode, setMode]       = useState('student') // 'student' | 'admin'
  const [form, setForm]       = useState({ identifier: '', password: '' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const isStudent = mode === 'student'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.identifier.trim() || !form.password.trim())
      return toast.error(`Please enter your ${isStudent ? 'phone number' : 'email'} and password.`)

    setLoading(true)
    try {
      let res, data
      if (isStudent) {
        // Student login — POST /api/auth/student-login  { phone, password }
        res  = await fetch(`${API}/auth/student-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: form.identifier.trim(), password: form.password }),
        })
        data = await res.json()
      } else {
        // Admin / teacher login — POST /api/auth/login  { email, password }
        res  = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.identifier.trim(), password: form.password }),
        })
        data = await res.json()
      }

      if (!data.success) throw new Error(data.message || 'Invalid credentials.')

      login(data.user, data.token)
      toast.success(`Welcome, ${data.user.name.split(' ')[0]}! 👋`)

      if (data.user.role === 'admin') navigate('/admin')
      else if (data.user.role === 'teacher') navigate('/teacher-portal')
      else navigate('/portal')

    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex"
      style={{ background: 'linear-gradient(145deg, #0d3d1f 0%, #166534 55%, #15803d 100%)' }}>

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-2xl border border-white/20">🌿</div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">Evergreen Pacific</div>
            <div className="text-white/50 text-xs">English Boarding School</div>
          </div>
        </Link>

        <div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Welcome<br /><span className="text-amber-400">Back to School</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md">
            Students: log in with your registered phone number and your personal password.
            Admin staff: use your email credentials.
          </p>

          {/* Credential guide card */}
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5">
            <p className="text-white font-semibold mb-3 text-sm">🔑 How to Log In</p>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-white/90 text-sm font-semibold">Students</p>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Username: <strong className="text-white/80">your registered phone number</strong><br />
                    Password: <strong className="text-white/80">evergreen + first 4 digits</strong><br />
                    <span className="text-amber-300/80">e.g. phone 9841012345 → password: evergreen9841</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">⚙️</span>
                <div>
                  <p className="text-white/90 text-sm font-semibold">Admin / Staff</p>
                  <p className="text-white/55 text-xs">Email + password provided by school admin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {[['450+', 'Students'], ['35+', 'Teachers'], ['34', 'Years']].map(([n, l]) => (
              <div key={l} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
                <div className="text-white font-bold text-xl">{n}</div>
                <div className="text-white/50 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/30 text-xs">© 2083 B.S. Evergreen Pacific English Boarding School</div>
      </div>

      {/* Right login panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl border border-white/20">🌿</div>
            <div className="text-white font-bold">Evergreen Pacific English School</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">

            {/* Mode toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-7 gap-1">
              <button
                onClick={() => { setMode('student'); setForm({ identifier: '', password: '' }) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isStudent ? 'bg-green-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                🎓 Student Login
              </button>
              <button
                onClick={() => { setMode('admin'); setForm({ identifier: '', password: '' }) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  !isStudent ? 'bg-green-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                ⚙️ Admin Login
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {isStudent ? 'Student Portal' : 'Admin Panel'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isStudent
                ? 'Enter your phone number and password to access your portal.'
                : 'Enter your admin email and password to continue.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">
                  {isStudent ? 'Phone Number (Registered)' : 'Email Address'}
                </label>
                <input
                  type={isStudent ? 'tel' : 'email'}
                  value={form.identifier}
                  onChange={e => setForm({ ...form, identifier: e.target.value })}
                  className="form-input"
                  placeholder={isStudent ? '9841012345' : 'admin@evergreen.edu.np'}
                  autoComplete={isStudent ? 'tel' : 'email'}
                  required
                />
                {isStudent && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Use the phone number your parent gave to the school
                  </p>
                )}
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="form-input pr-12"
                    placeholder={isStudent ? 'evergreen + first 4 digits of phone' : 'Enter password'}
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {isStudent && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                    💡 Default password: <strong>evergreen</strong> + first 4 digits of your phone<br />
                    Example: phone <strong>9841012345</strong> → password <strong>evergreen9841</strong>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-green-900 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <LogIn size={16} />}
                {loading ? 'Signing in…' : `Sign In as ${isStudent ? 'Student' : 'Admin'}`}
              </button>
            </form>

            <div className="mt-6 text-center">
              {isStudent ? (
                <p className="text-sm text-gray-400">
                  Forgot password?{' '}
                  <Link to="/contact" className="text-green-700 font-semibold hover:underline">
                    Contact your class teacher
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Issues logging in?{' '}
                  <Link to="/contact" className="text-green-700 font-semibold hover:underline">
                    Contact admin office
                  </Link>
                </p>
              )}
            </div>
          </div>

          <Link to="/" className="flex items-center justify-center gap-2 mt-6 text-white/50 hover:text-white text-sm transition-colors">
            ← Back to School Website
          </Link>
        </div>
      </div>
    </div>
  )
}
