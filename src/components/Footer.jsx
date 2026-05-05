// src/components/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-950 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg border border-white/10">🌿</div>
              <div>
                <div className="font-display text-base font-bold leading-tight">Evergreen Pacific</div>
                <div className="text-xs opacity-50 uppercase tracking-wider">English High School</div>
              </div>
            </div>
            <p className="text-sm opacity-60 leading-relaxed mb-3">
              Providing quality English-medium education from Nursery to Grade 9 since 2047 B.S.
              NEB affiliated. Ministry of Education approved.
            </p>
            <p className="text-xs text-amber-400/80 italic mb-5">
              "Education is an ornament in prosperity and a refuse in adversity"
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/evergreen.pacific.english.school"
                target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold transition-colors border border-white/10"
                title="Facebook">
                f
              </a>
              <a href="mailto:schoolevergreen98@gmail.com"
                className="w-9 h-9 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center text-sm transition-colors border border-white/10"
                title="Email">
                ✉
              </a>
              <a href="tel:9704636313"
                className="w-9 h-9 bg-white/10 hover:bg-green-600 rounded-lg flex items-center justify-center text-sm transition-colors border border-white/10"
                title="Call">
                📞
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-5 opacity-80 uppercase tracking-wider">Quick Links</h4>
            {[
              ['/',           'Home'],
              ['/about',      'About Us'],
              ['/academics',  'Academics'],
              ['/admissions', 'Admissions'],
              ['/faculty',    'Our Teachers'],
              ['/gallery',    'Gallery'],
            ].map(([path, label]) => (
              <Link key={path} to={path}
                className="block text-sm opacity-55 hover:opacity-100 mb-2.5 transition-opacity hover:text-amber-300">
                {label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold mb-5 opacity-80 uppercase tracking-wider">Resources</h4>
            {[
              ['/notices',        'Notice Board'],
              ['/events',         'Events Calendar'],
              ['/portal',         'Student Portal'],
              ['/teacher-portal', 'Teacher Portal'],
              ['/login',          'Login'],
              ['/contact',        'Contact Us'],
            ].map(([path, label]) => (
              <Link key={path} to={path}
                className="block text-sm opacity-55 hover:opacity-100 mb-2.5 transition-opacity hover:text-amber-300">
                {label}
              </Link>
            ))}
          </div>

          {/* Contact — real details from poster */}
          <div>
            <h4 className="text-sm font-bold mb-5 opacity-80 uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2.5 items-start">
                <span className="opacity-60 flex-shrink-0 mt-0.5">📍</span>
                <span className="opacity-70 leading-relaxed">Mayadevi-7, Hatibangai,<br />Rupandehi, Lumbini Province,<br />Nepal</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="opacity-60 flex-shrink-0">📞</span>
                <a href="tel:9704636313" className="opacity-70 hover:opacity-100 hover:text-amber-300 transition-colors font-mono">
                  9704636313
                </a>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="opacity-60 flex-shrink-0">✉️</span>
                <a href="mailto:schoolevergreen98@gmail.com"
                  className="opacity-70 hover:opacity-100 hover:text-amber-300 transition-colors text-xs break-all">
                  schoolevergreen98@gmail.com
                </a>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="opacity-60 flex-shrink-0">🕐</span>
                <span className="opacity-70">Sun – Fri: 8:00 AM – 4:00 PM</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="opacity-60 flex-shrink-0">🎓</span>
                <span className="opacity-70">Nursery to Grade 9</span>
              </div>
            </div>

            {/* Admission badge */}
            <div className="mt-5 bg-amber-500/15 border border-amber-400/25 rounded-xl p-3 text-center">
              <p className="text-amber-300 font-bold text-xs">🎓 Admission Open 2082 B.S.</p>
              <p className="text-white/50 text-xs mt-1">Call: 9704636313</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <span>© 2081 B.S. Evergreen Pacific English High School. All rights reserved.</span>
          <span>NEB Affiliated · Ministry of Education Approved · Est. 2047 B.S.</span>
        </div>
      </div>
    </footer>
  )
}
