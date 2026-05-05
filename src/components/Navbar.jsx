// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { Menu, X, LogOut, User } from 'lucide-react'

const navLinks = [
  { label: 'Home',       path: '/' },
  { label: 'About',      path: '/about' },
  { label: 'Academics',  path: '/academics' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Faculty',    path: '/faculty' },
  { label: 'Gallery',    path: '/gallery' },
  { label: 'Notices',    path: '/notices' },
  { label: 'Events',     path: '/events' },
  { label: 'Contact',    path: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Ticker bar */}
      <div className="bg-green-900 text-white py-2 overflow-hidden hidden md:block">
        <div className="ticker-scroll flex gap-16 whitespace-nowrap text-xs font-semibold">
          {[
            '🌿 Admissions Open 2082 B.S. – Apply Now!',
            '★ Annual Sports Day – Jestha 25',
            '★ SEE Results: 95%+ Pass Rate 2081',
            '★ Scholarship Exam: Jestha 18 – Register by Jestha 15',
            '★ Parents Meeting: Baisakh 30 at 10:00 AM',
            '★ NEB Affiliated | Est. 2067 B.S. | 450+ Students',
            '🌿 Admissions Open 2082 B.S. – Apply Now!',
            '★ Annual Sports Day – Jestha 25',
            '★ SEE Results: 95%+ Pass Rate 2081',
          ].map((t, i) => <span key={i} className="opacity-90">{t}</span>)}
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'} border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-900 to-green-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">🌿</div>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-bold text-green-900 leading-tight">Evergreen Pacific English School</div>
              <div className="text-xs text-gray-400 tracking-wider uppercase">Mayadevi · Rupandehi · Nepal</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap
                  ${isActive(l.path) ? 'bg-green-50 text-green-800 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-green-800'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === 'admin' ? '/admin' : '/portal'}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
                  <User size={15} /> {user.name.split(' ')[0]}
                </Link>
                <button onClick={() => { logout(); navigate('/') }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/portal" className="px-4 py-2 border-2 border-green-800 text-green-800 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors">
                  Student Portal
                </Link>
                <Link to="/login" className="px-4 py-2 bg-green-800 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                  Admin Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${isActive(l.path) ? 'bg-green-50 text-green-800 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/portal'} className="px-4 py-3 rounded-xl text-sm font-semibold text-green-800 bg-green-50">
                  🎓 {user.name} ({user.role})
                </Link>
                <button onClick={() => { logout(); navigate('/') }} className="px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 text-left">
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/portal" className="px-4 py-3 rounded-xl text-sm font-semibold text-green-800 bg-green-50">🎓 Student Portal</Link>
                <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-green-800 text-center">⚙️ Admin Login</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
