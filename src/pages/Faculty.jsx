// src/pages/Faculty.jsx
import { useState, useEffect } from 'react'

const API  = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const STATIC_TEACHERS = [
  { _id:'T001', tid:'T001', name:'Ram Prasad Sharma', subject:'Administration', qual:'M.Ed.',      role:'Principal',       joined:'2067' },
  { _id:'T002', tid:'T002', name:'Sunita Thapa',      subject:'English',        qual:'B.Ed.',      role:'Vice Principal',  joined:'2073' },
  { _id:'T003', tid:'T003', name:'Dipesh KC',         subject:'Science',        qual:'M.Sc.',      role:'HOD Science',     joined:'2075' },
  { _id:'T004', tid:'T004', name:'Anita Rai',         subject:'Computer/ICT',   qual:'B.Sc. CSIT', role:'ICT Teacher',     joined:'2077' },
  { _id:'T005', tid:'T005', name:'Suresh Poudel',     subject:'Mathematics',    qual:'M.Ed.',      role:'HOD Math',        joined:'2070' },
  { _id:'T006', tid:'T006', name:'Kamala Shrestha',   subject:'Arts & Culture', qual:'M.A.',       role:'Arts Teacher',    joined:'2072' },
  { _id:'T007', tid:'T007', name:'Binod Adhikari',    subject:'HPE / Sports',   qual:'B.P.Ed.',    role:'Sports Teacher',  joined:'2074' },
  { _id:'T008', tid:'T008', name:'Meena Gurung',      subject:'Nepali',         qual:'B.Ed.',      role:'Teacher',         joined:'2073' },
  { _id:'T009', tid:'T009', name:'Prakash Yadav',     subject:'Social Studies', qual:'B.Ed.',      role:'Teacher',         joined:'2076' },
  { _id:'T010', tid:'T010', name:'Sushila Panta',     subject:'Primary',        qual:'B.Ed.',      role:'Teacher',         joined:'2078' },
]

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function TeacherAvatar({ teacher, wrapClass = '', imgClass = '', fallbackClass = '' }) {
  const [err, setErr] = useState(false)
  const src = teacher.photoUrl
    ? (teacher.photoUrl.startsWith('http') ? teacher.photoUrl : `${BASE}${teacher.photoUrl}`)
    : null
  return (
    <div className={wrapClass}>
      {src && !err
        ? <img src={src} alt={teacher.name} className={imgClass} onError={() => setErr(true)} />
        : <span className={fallbackClass}>{getInitials(teacher.name)}</span>
      }
    </div>
  )
}

function TeacherCard({ teacher }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="h-40 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center overflow-hidden">
        <TeacherAvatar
          teacher={teacher}
          wrapClass="w-full h-full flex items-center justify-center"
          imgClass="w-full h-full object-cover object-top"
          fallbackClass="text-3xl font-bold text-white"
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{teacher.name}</h3>
        <p className="text-green-700 text-xs font-semibold mb-3">{teacher.role}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500"><span>📚</span><span>{teacher.subject}</span></div>
          {teacher.qual   && <div className="flex items-center gap-2 text-xs text-gray-500"><span>🎓</span><span>{teacher.qual}</span></div>}
          {teacher.phone  && <div className="flex items-center gap-2 text-xs text-gray-500"><span>📞</span><span>{teacher.phone}</span></div>}
        </div>
      </div>
    </div>
  )
}

export function Faculty() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API}/teachers/public`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.length > 0) setTeachers(json.data)
        else setTeachers(STATIC_TEACHERS)
      })
      .catch(() => setTeachers(STATIC_TEACHERS))
      .finally(() => setLoading(false))
  }, [])

  const principal = teachers.find(t =>
    t.role?.toLowerCase().includes('principal') && !t.role?.toLowerCase().includes('vice')
  )

  return (
    <div>
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Faculty</div>
          <h1 className="font-display text-5xl font-bold mb-4">Our <span className="text-amber-400">Teaching Team</span></h1>
          <p className="text-white/75 text-lg">35+ dedicated educators committed to nurturing every student's potential.</p>
        </div>
      </section>

      {principal && (
        <section className="section pb-4">
          <div className="container-w">
            <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-3xl p-8 text-white flex gap-8 items-center flex-wrap">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/25 flex-shrink-0">
                <TeacherAvatar
                  teacher={principal}
                  wrapClass="w-full h-full flex items-center justify-center bg-white/10"
                  imgClass="w-full h-full object-cover"
                  fallbackClass="text-4xl font-bold text-white"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-green-300 mb-2">School Principal</div>
                <h2 className="font-display text-3xl font-bold mb-2">{principal.name}</h2>
                <div className="text-green-200 text-sm mb-4">{principal.qual} · Joined {principal.joined?.slice(0,4) || '—'} B.S.</div>
                <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                  "At Evergreen Pacific, we believe every child carries a unique potential. Our mission is to discover
                  that potential and nurture it with love, discipline, and quality education."
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-w">
          <div className="section-label">All Faculty</div>
          <h2 className="section-title mb-8">Teachers &amp; <span className="text-green-700">Staff</span></h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-[3px] border-green-200 border-t-green-700 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {teachers.map(t => <TeacherCard key={t._id} teacher={t} />)}
            </div>
          )}

          <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
            <strong>📸 Adding teacher photos:</strong> Login as Admin → Teachers → click the <em>Photo</em> button next to any teacher.
            You can upload a file directly or place the image in
            <code className="bg-blue-100 px-1 rounded mx-1">backend/public/uploads/teachers/</code>
            and enter the path manually (e.g. <code className="bg-blue-100 px-1 rounded">/uploads/teachers/ram-sir.jpg</code>).
          </div>
        </div>
      </section>
    </div>
  )
}

export default Faculty
