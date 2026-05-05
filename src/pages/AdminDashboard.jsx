// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import {
  BarChart2, Users, BookOpen, ClipboardList, DollarSign,
  Bell, Image, Calendar, MessageSquare, Menu, X, LogOut,
  Plus, Edit2, Trash2, Eye, Save, RefreshCw, Upload
} from 'lucide-react'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Sidebar menu ─────────────────────────────────────────────
const MENU = [
  { icon: BarChart2,     label: 'Dashboard',  path: '/admin' },
  { icon: Users,         label: 'Students',   path: '/admin/students' },
  { icon: BookOpen,      label: 'Teachers',   path: '/admin/teachers' },
  { icon: ClipboardList, label: 'Attendance', path: '/admin/attendance' },
  { icon: DollarSign,    label: 'Fees',       path: '/admin/fees' },
  { icon: Bell,          label: 'Notices',    path: '/admin/notices' },
  { icon: Image,         label: 'Gallery',    path: '/admin/gallery' },
  { icon: MessageSquare, label: 'Messaging',  path: '/admin/sms' },
  { icon: BookOpen,      label: 'Exams',       path: '/admin/exams' },
]

// ── Shared helpers ────────────────────────────────────────────
function useApi(endpoint, options = {}) {
  const { token } = useAuth()
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      if (json.success) setData(json.data || [])
      else setError(json.message)
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }, [endpoint, token])

  useEffect(() => { load() }, [load])
  return { data, setData, loading, error, reload: load }
}

async function apiCall(method, endpoint, body, token, isFormData = false) {
  const headers = { Authorization: `Bearer ${token}` }
  if (!isFormData) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

// ── UI Components ─────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxW = 560 }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full shadow-2xl"
        style={{ maxWidth: maxW, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-base text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={18}/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Confirm Action" maxW={380}>
      <div className="text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <p className="font-bold text-gray-900 mb-2">{title}</p>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold">Yes, Delete</button>
        </div>
      </div>
    </Modal>
  )
}

function Badge({ children, color = 'green' }) {
  const map = { green:'bg-green-100 text-green-800', red:'bg-red-100 text-red-700',
    blue:'bg-blue-100 text-blue-700', amber:'bg-amber-100 text-amber-800',
    gray:'bg-gray-100 text-gray-600', purple:'bg-purple-100 text-purple-700' }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[color]||map.gray}`}>{children}</span>
}

function Inp({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" {...props} />
    </div>
  )
}
function Sel({ label, children, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <select className="form-input cursor-pointer" {...props}>{children}</select>
    </div>
  )
}
function Tex({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <textarea className="form-input resize-none" {...props} />
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-green-200 border-t-green-700 rounded-full animate-spin" style={{borderWidth:3}} />
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ sideOpen, setSideOpen }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <>
      <aside className={`fixed left-0 top-0 h-full w-60 bg-green-950 text-white z-40 flex flex-col transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-700/60 rounded-xl flex items-center justify-center text-lg">🌿</div>
            <div>
              <div className="text-sm font-bold leading-tight">Evergreen Pacific</div>
              <div className="text-xs opacity-40 mt-0.5">Admin Panel</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">{user?.name}</div>
              <div className="text-xs opacity-40 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {MENU.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all
                  ${active ? 'bg-green-700 text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}>
                <item.icon size={15} />{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/8 transition-all font-medium">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
      {sideOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}
    </>
  )
}

// ════════════════════════════════════════════════════════════
// DASHBOARD HOME — fetches real counts from DB
// ════════════════════════════════════════════════════════════
function DashboardHome() {
  const { token } = useAuth()
  const [counts, setCounts] = useState({ students: 0, teachers: 0, notices: 0, fees: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` }
    Promise.all([
      fetch(`${API}/students`, { headers }).then(r => r.json()),
      fetch(`${API}/teachers`, { headers }).then(r => r.json()),
      fetch(`${API}/notices`).then(r => r.json()),
      fetch(`${API}/fees`, { headers }).then(r => r.json()),
    ]).then(([s, t, n, f]) => {
      const paid = f.data?.filter(x => x.status === 'Paid') || []
      const total = paid.reduce((acc, x) => acc + (x.amount || 0), 0)
      setCounts({
        students: s.data?.length || 0,
        teachers: t.data?.length || 0,
        notices:  n.data?.length || 0,
        fees:     total,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [token])

  const stats = [
    { n: loading ? '…' : counts.students,  l: 'Total Students',  icon: '👥', bg: 'bg-green-50',  tc: 'text-green-700' },
    { n: loading ? '…' : counts.teachers,  l: 'Teachers',        icon: '👨‍🏫', bg: 'bg-blue-50',   tc: 'text-blue-700' },
    { n: loading ? '…' : counts.notices,   l: 'Active Notices',  icon: '📢', bg: 'bg-rose-50',   tc: 'text-rose-700' },
    { n: loading ? '…' : `Rs ${counts.fees.toLocaleString()}`, l: 'Fees Collected', icon: '💰', bg: 'bg-purple-50', tc: 'text-purple-700' },
  ]

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-NP', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-5`}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display text-2xl font-bold ${s.tc}`}>{s.n}</div>
            <div className="text-sm text-gray-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h3 className="font-bold text-sm text-green-800 mb-4">📋 Quick Actions</h3>
        <div className="flex flex-col gap-2">
          {[
            ['/admin/students','👥 Add Student'],
            ['/admin/teachers','👨‍🏫 Add Teacher'],
            ['/admin/notices', '📢 Post Notice'],
            ['/admin/gallery', '📷 Upload Photo'],
            ['/admin/fees',    '💰 Record Fee'],
          ].map(([path, label]) => (
            <Link key={path} to={path}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-green-200 rounded-xl text-sm font-medium text-green-800 hover:bg-green-100 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// STUDENTS — Real API CRUD
// ════════════════════════════════════════════════════════════
const GRADES = ['ECD','Nursery','KG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10']
const BLANK_STUDENT = { name:'', grade:'Grade 1', gender:'Male', type:'Day', parent:'', phone:'', dob:'', address:'', status:'Active' }

function StudentsPanel() {
  const { token } = useAuth()
  const { data: students, setData: setStudents, loading, reload } = useApi('/students')
  const [search, setSearch]   = useState('')
  const [filterGrade, setFG]  = useState('All')
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState(BLANK_STUDENT)
  const [delTarget, setDel]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [credModal, setCredModal] = useState(null) // {name,username,password}

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    return (!q || s.name?.toLowerCase().includes(q) || s.sid?.toLowerCase().includes(q) || s.parent?.toLowerCase().includes(q))
      && (filterGrade === 'All' || s.grade === filterGrade)
  })

  const save = async () => {
    if (!form.name?.trim() || !form.parent?.trim() || !form.phone?.trim())
      return toast.error('Name, parent, and phone are required.')
    setSaving(true)
    try {
      let res
      if (modal.mode === 'add') {
        res = await apiCall('POST', '/students', form, token)
        if (res.success) {
          setStudents(p => [res.data, ...p])
          toast.success(`Student "${form.name}" added!`)
          if (res.credentials) setCredModal({ name: form.name, ...res.credentials })
        }
      } else {
        res = await apiCall('PUT', `/students/${modal.data._id}`, form, token)
        if (res.success) { setStudents(p => p.map(s => s._id === modal.data._id ? res.data : s)); toast.success('Student updated.') }
      }
      if (!res.success) toast.error(res.message)
      else setModal(null)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const confirmDel = async () => {
    try {
      const res = await apiCall('DELETE', `/students/${delTarget._id}`, null, token)
      if (res.success) { setStudents(p => p.filter(s => s._id !== delTarget._id)); toast.success('Student removed.') }
      else toast.error(res.message)
    } catch { toast.error('Network error') }
    setDel(null)
  }

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Student Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} students enrolled</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reload} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"><RefreshCw size={15}/></button>
          <button onClick={async () => {
            if (!filterGrade || filterGrade === 'All') return toast.error('Select a specific grade first.')
            if (!confirm(`Auto-assign roll numbers to all students in ${filterGrade} alphabetically?`)) return
            try {
              const res = await apiCall('POST', `/students/assign-rolls/${encodeURIComponent(filterGrade)}`, null, token)
              if (res.success) { toast.success(res.message); reload() }
              else toast.error(res.message)
            } catch { toast.error('Network error') }
          }} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
            🔢 Assign Roll Nos
          </button>
          <button onClick={() => { setForm({...BLANK_STUDENT}); setModal({mode:'add'}) }} className="btn-primary text-sm"><Plus size={15}/> Add Student</button>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, ID, parent…" className="form-input max-w-xs text-sm" />
        <select value={filterGrade} onChange={e=>setFG(e.target.value)} className="form-input w-auto cursor-pointer text-sm">
          <option>All</option>
          {GRADES.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Roll</th><th>ID</th><th>Name</th><th>Grade</th><th>Parent</th><th>Phone</th><th>Type</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-green-50 transition-colors">
                    <td className="font-bold text-gray-500 w-10">{s.rollNo || '—'}</td>
                    <td className="font-mono text-xs text-gray-400">{s.sid}</td>
                    <td className="font-semibold text-gray-900">{s.name}</td>
                    <td>{s.grade}</td>
                    <td>{s.parent}</td>
                    <td className="font-mono text-xs">{s.phone}</td>
                    <td><Badge color={s.type==='Boarding'?'blue':'green'}>{s.type}</Badge></td>
                    <td><Badge color={s.status==='Active'?'green':'gray'}>{s.status}</Badge></td>
                    <td>
                      <div className="flex gap-1.5">
                        <button onClick={() => { setForm({...s}); setModal({mode:'edit',data:s}) }}
                          className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                          <Edit2 size={11}/> Edit
                        </button>
                        <button onClick={() => setDel(s)}
                          className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1">
                          <Trash2 size={11}/> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    {loading ? 'Loading…' : 'No students found. Add your first student!'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!modal} onClose={()=>setModal(null)}
        title={modal?.mode === 'add' ? 'Add New Student' : 'Edit Student'} maxW={600}>
        <div className="grid grid-cols-2 gap-x-4">
          <Inp label="Full Name *"       value={form.name}   onChange={f('name')}   placeholder="Aarav Sharma" />
          <Sel label="Grade *"           value={form.grade}  onChange={f('grade')}>
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </Sel>
          <Sel label="Gender"            value={form.gender} onChange={f('gender')}>
            <option>Male</option><option>Female</option><option>Other</option>
          </Sel>
          <Sel label="Student Type"      value={form.type}   onChange={f('type')}>
            <option>Day</option><option>Boarding</option>
          </Sel>
          <Inp label="Parent/Guardian *" value={form.parent} onChange={f('parent')} placeholder="Ram Sharma" />
          <Inp label="Phone *"           value={form.phone}  onChange={f('phone')}  placeholder="98XXXXXXXX" />
          <Inp label="Date of Birth"     value={form.dob}    onChange={f('dob')}    type="date" />
          <Inp label="Roll Number"       value={form.rollNo||''} onChange={f('rollNo')} type="number" placeholder="Auto-assigned if blank" />
          <Sel label="Status"            value={form.status} onChange={f('status')}>
            <option>Active</option><option>Inactive</option><option>Transferred</option>
          </Sel>
          <div className="col-span-2">
            <Inp label="Address" value={form.address} onChange={f('address')} placeholder="Pokhara-8, Kaski" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={()=>setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm">
            <Save size={14}/> {saving ? 'Saving…' : modal?.mode==='add' ? 'Add Student' : 'Save Changes'}
          </button>
        </div>
      </Modal>

      {/* Credentials popup shown after adding a new student */}
      <Modal open={!!credModal} onClose={()=>setCredModal(null)} title="🔑 Student Login Created" maxW={420}>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
          <p className="font-bold text-green-900 text-sm mb-3">Share these credentials with the student/parent:</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white border border-green-200 rounded-lg px-4 py-2.5">
              <span className="text-xs font-semibold text-gray-500">Student Name</span>
              <span className="font-bold text-gray-900">{credModal?.name}</span>
            </div>
            <div className="flex justify-between items-center bg-white border border-green-200 rounded-lg px-4 py-2.5">
              <span className="text-xs font-semibold text-gray-500">Username (Phone)</span>
              <span className="font-bold font-mono text-green-800">{credModal?.username}</span>
            </div>
            <div className="flex justify-between items-center bg-white border border-green-200 rounded-lg px-4 py-2.5">
              <span className="text-xs font-semibold text-gray-500">Password</span>
              <span className="font-bold font-mono text-green-800">{credModal?.password}</span>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-5">
          ℹ️ Password = <strong>"evergreen"</strong> + first 4 digits of phone number.<br />
          Students can log in at <strong>/login</strong> → Student Login tab.
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => { navigator.clipboard?.writeText(`Username: ${credModal?.username}\nPassword: ${credModal?.password}`); toast.success('Copied to clipboard!') }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200">
            📋 Copy
          </button>
          <button onClick={()=>setCredModal(null)} className="btn-primary text-sm">Done ✓</button>
        </div>
      </Modal>

      <ConfirmModal open={!!delTarget} onClose={()=>setDel(null)} onConfirm={confirmDel}
        title={`Delete "${delTarget?.name}"?`}
        message="This will permanently remove the student record." />
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TEACHERS — Real API CRUD + photo upload
// ════════════════════════════════════════════════════════════
const SUBJECTS = ['English','Nepali','Mathematics','Science','Social Studies','Computer/ICT','HPE','Arts','Music','Primary (All Subjects)','Administration']
const BLANK_TEACHER = { name:'', subject:'Mathematics', phone:'', qual:'', joined:'', status:'Active', role:'Teacher', email:'', password:'' }

function TeachersPanel() {
  const { token } = useAuth()
  const { data: teachers, setData: setTeachers, loading, reload } = useApi('/teachers')
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(BLANK_TEACHER)
  const [delTarget, setDel]     = useState(null)
  const [search, setSearch]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [photoModal, setPhotoModal] = useState(null)
  const [photoFile, setPhotoFile]   = useState(null)
  const [photoPath, setPhotoPath]   = useState('')
  const [photoMode, setPhotoMode]   = useState('upload') // 'upload' | 'path'
  const [gradeModal, setGradeModal] = useState(null)
  const [assignedGrades, setAssignedGrades] = useState([])
  const fileRef = useRef()

  const filtered = teachers.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.subject?.toLowerCase().includes(search.toLowerCase())
  )

  const save = async () => {
    if (!form.name?.trim() || !form.phone?.trim()) return toast.error('Name and phone are required.')
    if (modal.mode === 'add' && !form.email?.trim()) return toast.error('Email is required to create teacher login.')
    setSaving(true)
    try {
      // On edit, remove password from payload if blank (so existing password is kept)
      const payload = { ...form }
      if (modal.mode === 'edit' && !payload.password?.trim()) delete payload.password

      let res
      if (modal.mode === 'add') {
        res = await apiCall('POST', '/teachers', payload, token)
        if (res.success) {
          setTeachers(p => [res.data, ...p])
          toast.success(`Teacher "${form.name}" added! They can now login with their email.`)
        }
      } else {
        res = await apiCall('PUT', `/teachers/${modal.data._id}`, payload, token)
        if (res.success) {
          setTeachers(p => p.map(t => t._id === modal.data._id ? res.data : t))
          toast.success('Teacher updated.')
        }
      }
      if (!res.success) toast.error(res.message)
      else setModal(null)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const savePhoto = async () => {
    if (!photoModal) return
    try {
      if (photoMode === 'upload' && photoFile) {
        const fd = new FormData(); fd.append('photo', photoFile)
        const res = await apiCall('PUT', `/teachers/${photoModal._id}/photo`, fd, token, true)
        if (res.success) {
          setTeachers(p => p.map(t => t._id === photoModal._id ? { ...t, photoUrl: res.photoUrl } : t))
          toast.success('Photo uploaded!')
        } else toast.error(res.message)
      } else if (photoMode === 'path' && photoPath) {
        const res = await apiCall('PUT', `/teachers/${photoModal._id}/photo-path`, { photoPath }, token)
        if (res.success) {
          setTeachers(p => p.map(t => t._id === photoModal._id ? { ...t, photoUrl: photoPath } : t))
          toast.success('Photo path saved!')
        } else toast.error(res.message)
      } else {
        toast.error('Please select a file or enter a path.')
        return
      }
    } catch { toast.error('Network error') }
    setPhotoModal(null); setPhotoFile(null); setPhotoPath('')
  }

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const BASE = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Teacher Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{teachers.length} teachers on staff</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl"><RefreshCw size={15}/></button>
          <button onClick={() => { setForm({...BLANK_TEACHER}); setModal({mode:'add'}) }} className="btn-primary text-sm"><Plus size={15}/> Add Teacher</button>
        </div>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teachers…" className="form-input max-w-xs text-sm mb-5" />

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Photo</th><th>ID</th><th>Name</th><th>Subject</th><th>Phone</th><th>Qualification</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t._id} className="hover:bg-green-50 transition-colors">
                    <td>
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                        {t.photoUrl
                          ? <img src={t.photoUrl.startsWith('/') ? `${BASE}${t.photoUrl}` : t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                          : <span className="text-base">👨‍🏫</span>
                        }
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-400">{t.tid}</td>
                    <td className="font-semibold">{t.name}</td>
                    <td><Badge color="purple">{t.subject}</Badge></td>
                    <td className="font-mono text-xs">{t.phone}</td>
                    <td className="text-gray-500">{t.qual}</td>
                    <td className="text-gray-500 text-xs">{t.role}</td>
                    <td><Badge color={t.status==='Active'?'green':'gray'}>{t.status}</Badge></td>
                    <td>
                      <div className="flex gap-1.5">
                        <button onClick={() => { setPhotoModal(t); setPhotoMode('upload'); setPhotoFile(null); setPhotoPath('') }}
                          className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 flex items-center gap-1">
                          <Upload size={11}/> Photo
                        </button>
                        <button onClick={() => { setGradeModal(t); setAssignedGrades(t.assignedGrades||[]) }}
                          className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 flex items-center gap-1">
                          🏫 Classes
                        </button>
                        <button onClick={() => { setForm({...t}); setModal({mode:'edit',data:t}) }}
                          className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                          <Edit2 size={11}/> Edit
                        </button>
                        <button onClick={() => setDel(t)}
                          className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1">
                          <Trash2 size={11}/> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No teachers found. Add your first teacher!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.mode==='add' ? 'Add Teacher' : 'Edit Teacher'} maxW={620}>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2"><Inp label="Full Name *" value={form.name} onChange={f('name')} placeholder="Ram Prasad Sharma" /></div>
          <Sel label="Subject *" value={form.subject} onChange={f('subject')}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</Sel>
          <Inp label="Phone *" value={form.phone} onChange={f('phone')} placeholder="98XXXXXXXX" />
          <Inp label="Qualification" value={form.qual} onChange={f('qual')} placeholder="M.Ed., B.Sc., etc." />
          <Inp label="Join Date" type="date" value={form.joined} onChange={f('joined')} />
          <Inp label="Role / Title" value={form.role} onChange={f('role')} placeholder="Teacher, HOD, etc." />
          <Sel label="Status" value={form.status} onChange={f('status')}>
            <option>Active</option><option>On Leave</option><option>Resigned</option>
          </Sel>
        </div>

        {/* Login credentials section */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🔑 Login Credentials (for Teacher Portal)</p>
          <div className="grid grid-cols-2 gap-x-4">
            <Inp
              label={modal?.mode==='add' ? 'Email * (login username)' : 'Email (login username)'}
              type="email"
              value={form.email||''}
              onChange={f('email')}
              placeholder="ram@evergreen.edu.np"
            />
            <div className="mb-4">
              <label className="form-label">
                {modal?.mode==='add' ? 'Password *' : 'New Password (leave blank to keep)'}
              </label>
              <input
                type="password"
                value={form.password||''}
                onChange={f('password')}
                placeholder={modal?.mode==='add' ? 'Set login password' : 'Leave blank = no change'}
                className="form-input"
              />
            </div>
          </div>
          {modal?.mode==='add' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              💡 Teacher will log in at <strong>/login</strong> → Admin Login tab using their email and password you set here.
              If you leave password blank, it defaults to <strong>Evergreen@{new Date().getFullYear()}</strong>
            </div>
          )}
          {modal?.mode==='edit' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              ✏️ To create or update login: fill in email (and optionally new password) then Save.
              Leave password blank to keep existing password.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={()=>setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm">
            <Save size={14}/> {saving ? 'Saving…' : modal?.mode==='add' ? 'Add Teacher' : 'Save Changes'}
          </button>
        </div>
      </Modal>

      {/* Photo Modal */}
      <Modal open={!!photoModal} onClose={()=>setPhotoModal(null)} title={`Set Photo — ${photoModal?.name}`} maxW={440}>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setPhotoMode('upload')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${photoMode==='upload' ? 'bg-green-800 text-white border-green-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            📁 Upload File
          </button>
          <button onClick={()=>setPhotoMode('path')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${photoMode==='path' ? 'bg-green-800 text-white border-green-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            🔗 Manual Path
          </button>
        </div>

        {photoMode === 'upload' ? (
          <div>
            <div onClick={()=>fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all mb-4">
              {photoFile
                ? <p className="text-green-700 font-semibold">✅ {photoFile.name}</p>
                : <><div className="text-3xl mb-2">📷</div><p className="text-gray-500 text-sm">Click to select teacher photo</p><p className="text-xs text-gray-400 mt-1">JPG, PNG — max 3MB</p></>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if(e.target.files[0]) setPhotoFile(e.target.files[0]) }} />
          </div>
        ) : (
          <div className="mb-4">
            <label className="form-label">Image Path (relative to backend/public/)</label>
            <input value={photoPath} onChange={e=>setPhotoPath(e.target.value)}
              className="form-input text-sm" placeholder="/uploads/teachers/ram-sir.jpg" />
            <p className="text-xs text-gray-400 mt-1.5">Place the image in <code>backend/public/uploads/teachers/</code>, then enter the path above.</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={()=>setPhotoModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={savePhoto} className="btn-primary text-sm"><Upload size={14}/> Save Photo</button>
        </div>
      </Modal>

      {/* Assign Classes Modal */}
      <Modal open={!!gradeModal} onClose={()=>setGradeModal(null)} title={`Assign Classes — ${gradeModal?.name}`} maxW={440}>
        <p className="text-sm text-gray-500 mb-4">Select which grades this teacher can mark attendance and enter exam marks for.</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {GRADES.map(g => (
            <label key={g} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all
              ${assignedGrades.includes(g) ? 'bg-green-50 border-green-500 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300'}`}>
              <input type="checkbox" checked={assignedGrades.includes(g)}
                onChange={e => setAssignedGrades(p => e.target.checked ? [...p, g] : p.filter(x => x !== g))}
                className="accent-green-700 w-4 h-4 cursor-pointer" />
              <span className="text-sm font-semibold">{g}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={()=>setGradeModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={async () => {
            try {
              const res = await apiCall('PUT', `/teachers/${gradeModal._id}/assign-grades`, { grades: assignedGrades }, token)
              if (res.success) {
                setTeachers(p => p.map(t => t._id === gradeModal._id ? res.data : t))
                toast.success(`Classes assigned to ${gradeModal.name}`)
                setGradeModal(null)
              } else toast.error(res.message)
            } catch { toast.error('Network error') }
          }} className="btn-primary text-sm">
            <Save size={14}/> Save Classes
          </button>
        </div>
      </Modal>

      <ConfirmModal open={!!delTarget} onClose={()=>setDel(null)}
        onConfirm={async () => {
          try {
            const res = await apiCall('DELETE', `/teachers/${delTarget._id}`, null, token)
            if (res.success) { setTeachers(p => p.filter(t => t._id !== delTarget._id)); toast.success('Teacher removed.') }
            else toast.error(res.message)
          } catch { toast.error('Network error') }
          setDel(null)
        }}
        title={`Delete "${delTarget?.name}"?`} message="This will permanently remove the teacher record." />
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// NOTICES — Real API CRUD
// ════════════════════════════════════════════════════════════
const NOTICE_TYPES = ['General','Important','Event','Academic','Holiday']
const TYPE_COLOR   = { Important:'red', Event:'blue', Academic:'purple', General:'gray', Holiday:'amber' }
const BLANK_NOTICE = { title:'', type:'General', content:'', smsSent:false }

function NoticesPanel() {
  const { token } = useAuth()
  const { data: notices, setData: setNotices, loading, reload } = useApi('/notices')
  const [modal, setModal]   = useState(null)
  const [form, setForm]     = useState(BLANK_NOTICE)
  const [delId, setDelId]   = useState(null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title?.trim() || !form.content?.trim()) return toast.error('Title and content are required.')
    setSaving(true)
    try {
      let res
      if (modal.mode === 'add') {
        res = await apiCall('POST', '/notices', form, token)
        if (res.success) { setNotices(p => [res.data, ...p]); toast.success('Notice posted!') }
      } else {
        res = await apiCall('PUT', `/notices/${modal.data._id}`, form, token)
        if (res.success) { setNotices(p => p.map(n => n._id === modal.data._id ? res.data : n)); toast.success('Notice updated.') }
      }
      if (!res.success) toast.error(res.message)
      else setModal(null)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold">Notice Management</h2>
        <div className="flex gap-2">
          <button onClick={reload} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl"><RefreshCw size={15}/></button>
          <button onClick={() => { setForm({...BLANK_NOTICE}); setModal({mode:'add'}) }} className="btn-primary text-sm">
            <Bell size={15}/> Post Notice
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="flex flex-col gap-4">
          {notices.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p>No notices yet. Post your first notice!</p>
            </div>
          )}
          {notices.map(n => (
            <div key={n._id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <Badge color={TYPE_COLOR[n.type]||'gray'}>{n.type}</Badge>
                    {n.smsSent && <Badge color="amber">📱 SMS</Badge>}
                    <span className="text-xs text-gray-400 self-center">{new Date(n.createdAt).toLocaleDateString('en-NP')}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{n.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{n.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setForm({title:n.title,type:n.type,content:n.content,smsSent:n.smsSent}); setModal({mode:'edit',data:n}) }}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                    <Edit2 size={11}/> Edit
                  </button>
                  <button onClick={() => setDelId(n._id)}
                    className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1">
                    <Trash2 size={11}/> Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.mode==='add' ? 'Post New Notice' : 'Edit Notice'} maxW={600}>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2"><Inp label="Notice Title *" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Enter title" /></div>
          <Sel label="Type" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
            {NOTICE_TYPES.map(t => <option key={t}>{t}</option>)}
          </Sel>
          <div className="flex items-center gap-3 mb-4">
            <input type="checkbox" id="sms-chk" checked={form.smsSent} onChange={e=>setForm(p=>({...p,smsSent:e.target.checked}))} className="accent-green-700 w-4 h-4 cursor-pointer" />
            <label htmlFor="sms-chk" className="text-sm font-semibold text-gray-700 cursor-pointer">Send SMS to parents</label>
          </div>
          <div className="col-span-2">
            <Tex label="Content *" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="Full notice text…" style={{ minHeight:120 }} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={()=>setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm">{saving ? 'Posting…' : modal?.mode==='add' ? 'Post Notice' : 'Save Changes'}</button>
        </div>
      </Modal>

      <ConfirmModal open={!!delId} onClose={()=>setDelId(null)}
        onConfirm={async () => {
          try {
            const res = await apiCall('DELETE', `/notices/${delId}`, null, token)
            if (res.success) { setNotices(p => p.filter(n => n._id !== delId)); toast.success('Notice deleted.') }
            else toast.error(res.message)
          } catch { toast.error('Network error') }
          setDelId(null)
        }}
        title="Delete this notice?" message="This notice will be permanently removed." />
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// GALLERY — Real API upload + path entry
// ════════════════════════════════════════════════════════════
const GALLERY_CATS = ['Events','Sports','Culture','Academics','School','Students']

function GalleryPanel() {
  const { token } = useAuth()
  const { data: photos, setData: setPhotos, loading, reload } = useApi('/gallery')
  const [filter, setFilter]   = useState('All')
  const [modal, setModal]     = useState(false)
  const [pathModal, setPathModal] = useState(false)
  const [form, setForm]       = useState({ caption:'', category:'Events' })
  const [pathForm, setPathForm] = useState({ caption:'', category:'School', imagePath:'' })
  const [preview, setPrev]    = useState(null)
  const [file, setFile]       = useState(null)
  const [delId, setDelId]     = useState(null)
  const [lightbox, setLB]     = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const BASE = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'
  const filtered = filter === 'All' ? photos : photos.filter(p => p.category === filter)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return }
    if (!f.type.startsWith('image/')) { toast.error('Please select an image file.'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPrev(ev.target.result)
    reader.readAsDataURL(f)
  }

  const upload = async () => {
    if (!form.caption.trim()) { toast.error('Caption is required.'); return }
    if (!file) { toast.error('Please select an image.'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', form.caption)
      fd.append('category', form.category)
      const res = await apiCall('POST', '/gallery', fd, token, true)
      if (res.success) {
        setPhotos(p => [res.data, ...p])
        toast.success(`"${form.caption}" added to gallery!`)
        setModal(false); setFile(null); setPrev(null)
      } else toast.error(res.message)
    } catch { toast.error('Upload failed. Check your connection.') }
    setUploading(false)
  }

  const addByPath = async () => {
    if (!pathForm.caption.trim() || !pathForm.imagePath.trim()) {
      toast.error('Caption and image path are required.'); return
    }
    try {
      const res = await apiCall('POST', '/gallery/path', pathForm, token)
      if (res.success) { setPhotos(p => [res.data, ...p]); toast.success('Photo added!'); setPathModal(false) }
      else toast.error(res.message)
    } catch { toast.error('Network error') }
  }

  const getImgSrc = (photo) => {
    if (!photo.imageUrl) return null
    if (photo.imageUrl.startsWith('http')) return photo.imageUrl
    return `${BASE}${photo.imageUrl}`
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Gallery Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{photos.length} photos</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reload} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl"><RefreshCw size={15}/></button>
          <button onClick={() => { setPathForm({caption:'',category:'School',imagePath:''}); setPathModal(true) }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
            🔗 Add by Path
          </button>
          <button onClick={() => { setForm({caption:'',category:'Events'}); setPrev(null); setFile(null); setModal(true) }} className="btn-primary text-sm">
            <Plus size={15}/> Upload Photo
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">💡</span>
        <div>
          <strong>Two ways to add photos:</strong> Use <em>Upload Photo</em> to upload directly, or use <em>Add by Path</em> if you manually placed the image in
          <code className="bg-amber-100 px-1 rounded mx-1">backend/public/uploads/gallery/</code>and enter the path like <code className="bg-amber-100 px-1 rounded">/uploads/gallery/annual-day.jpg</code>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...GALLERY_CATS].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all
              ${filter===c ? 'bg-green-800 text-white border-green-800' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📷</div>
              <p className="font-medium">No photos here yet. Upload some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(p => (
                <div key={p._id} className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                  onClick={() => setLB(p)}>
                  {getImgSrc(p)
                    ? <img src={getImgSrc(p)} alt={p.caption} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-green-800 flex items-center justify-center text-4xl">📷</div>
                  }
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                    <div className="w-full px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs font-bold leading-tight">{p.caption}</p>
                      <p className="text-white/60 text-xs">{p.category}</p>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setDelId(p._id) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-600/80 hover:bg-red-600 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Upload Photo to Gallery">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2">
            <Inp label="Caption *" value={form.caption} onChange={e=>setForm(p=>({...p,caption:e.target.value}))} placeholder="Annual Sports Day 2081" />
          </div>
          <Sel label="Category" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
            {GALLERY_CATS.map(c => <option key={c}>{c}</option>)}
          </Sel>
        </div>
        <div onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5
            ${preview ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-green-400'}`}>
          {preview ? (
            <div>
              <img src={preview} alt="preview" className="max-h-48 max-w-full mx-auto rounded-xl mb-3 shadow" />
              <p className="text-green-700 text-sm font-bold">✅ {file?.name}</p>
              <p className="text-gray-400 text-xs mt-1">Click to change</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3">📁</div>
              <p className="font-semibold text-gray-600">Click to select image</p>
              <p className="text-sm text-gray-400 mt-2">PNG, JPG, WEBP — up to 5MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="flex justify-end gap-3">
          <button onClick={() => setModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={upload} disabled={uploading} className="btn-primary text-sm">
            <Upload size={14}/> {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </div>
      </Modal>

      {/* Add by Path Modal */}
      <Modal open={pathModal} onClose={() => setPathModal(false)} title="Add Photo by Manual Path" maxW={480}>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700">
          Place your image file in <code className="bg-blue-100 px-1 rounded">backend/public/uploads/gallery/</code> first, then enter the path below.
        </div>
        <Inp label="Caption *" value={pathForm.caption} onChange={e=>setPathForm(p=>({...p,caption:e.target.value}))} placeholder="School Building Front View" />
        <Sel label="Category" value={pathForm.category} onChange={e=>setPathForm(p=>({...p,category:e.target.value}))}>
          {GALLERY_CATS.map(c => <option key={c}>{c}</option>)}
        </Sel>
        <Inp label="Image Path *" value={pathForm.imagePath} onChange={e=>setPathForm(p=>({...p,imagePath:e.target.value}))} placeholder="/uploads/gallery/school-building.jpg" />
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={() => setPathModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={addByPath} className="btn-primary text-sm">Add to Gallery</button>
        </div>
      </Modal>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLB(null)}>
          <div className="max-w-3xl w-full text-center" onClick={e => e.stopPropagation()}>
            {getImgSrc(lightbox)
              ? <img src={getImgSrc(lightbox)} alt={lightbox.caption} className="max-h-[70vh] w-auto max-w-full mx-auto rounded-xl" />
              : <div className="h-80 rounded-xl bg-green-800 flex items-center justify-center text-9xl">📷</div>
            }
            <p className="text-white font-bold text-lg mt-4">{lightbox.caption}</p>
            <p className="text-white/50 text-sm mt-1">{lightbox.category}</p>
            <button onClick={() => setLB(null)} className="mt-5 px-6 py-2 bg-white/15 border border-white/25 text-white rounded-xl text-sm hover:bg-white/25">
              Close ✕
            </button>
          </div>
        </div>
      )}

      <ConfirmModal open={!!delId} onClose={() => setDelId(null)}
        onConfirm={async () => {
          try {
            const res = await apiCall('DELETE', `/gallery/${delId}`, null, token)
            if (res.success) { setPhotos(p => p.filter(ph => ph._id !== delId)); toast.success('Photo deleted.') }
            else toast.error(res.message)
          } catch { toast.error('Network error') }
          setDelId(null)
        }}
        title="Delete this photo?" message="This photo will be permanently removed from the gallery." />
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// ATTENDANCE
// ════════════════════════════════════════════════════════════
function AttendancePanel() {
  const { token } = useAuth()
  const { data: allStudents } = useApi('/students')
  const [grade, setGrade] = useState('Grade 9')
  const [date, setDate]   = useState(new Date().toISOString().split('T')[0])
  const [att, setAtt]     = useState({})
  const [saving, setSaving] = useState(false)

  const students = allStudents.filter(s => s.grade === grade && s.status === 'Active')

  useEffect(() => {
    setAtt(Object.fromEntries(students.map(s => [s._id, 'P'])))
  }, [grade, allStudents])

  const present = Object.values(att).filter(v => v === 'P').length
  const absent  = Object.values(att).filter(v => v === 'A').length

  const saveAtt = async () => {
    if (students.length === 0) return toast.error('No active students in this grade.')
    setSaving(true)
    try {
      const records = students.map(s => ({
        studentId: s._id, studentName: s.name,
        phone: s.phone, status: att[s._id] || 'P'
      }))
      const res = await apiCall('POST', '/attendance', { grade, date, records }, token)
      if (res.success) toast.success(res.message)
      else toast.error(res.message)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const grades = [...new Set(allStudents.map(s => s.grade))].filter(Boolean)

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold">Mark Attendance</h2>
        <button onClick={saveAtt} disabled={saving} className="btn-primary text-sm">
          <Save size={15}/> {saving ? 'Saving…' : 'Save & SMS Notify'}
        </button>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={grade} onChange={e=>setGrade(e.target.value)} className="form-input w-auto cursor-pointer text-sm">
          {grades.length > 0 ? grades.map(g => <option key={g}>{g}</option>) : <option>No grades</option>}
        </select>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="form-input w-auto text-sm" />
      </div>
      <div className="flex gap-4 mb-5">
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-center">
          <div className="font-bold text-green-700 text-xl">{present}</div>
          <div className="text-xs text-green-600 font-semibold">Present</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-center">
          <div className="font-bold text-red-700 text-xl">{absent}</div>
          <div className="text-xs text-red-600 font-semibold">Absent</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-center">
          <div className="font-bold text-gray-700 text-xl">{students.length}</div>
          <div className="text-xs text-gray-500 font-semibold">Total</div>
        </div>
      </div>
      {students.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">👥</div>
          <p>No active students in {grade}. Add students first.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>#</th><th>Name</th><th>Phone</th><th className="text-center">Attendance</th></tr></thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id} className="hover:bg-green-50">
                    <td className="text-gray-400 text-xs">{i+1}</td>
                    <td className="font-semibold">{s.name}</td>
                    <td className="font-mono text-xs">{s.phone}</td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        {['P','A','L'].map(status => (
                          <button key={status} onClick={() => setAtt(p => ({...p, [s._id]: status}))}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all
                              ${att[s._id]===status
                                ? status==='P' ? 'bg-green-700 text-white border-green-700'
                                  : status==='A' ? 'bg-red-600 text-white border-red-600'
                                  : 'bg-amber-500 text-white border-amber-500'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                            {status==='P'?'Present':status==='A'?'Absent':'Leave'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


// ════════════════════════════════════════════════════════════
// MESSAGING
// ════════════════════════════════════════════════════════════
function MessagingPanel() {
  const { token } = useAuth()
  const [msg, setMsg]   = useState('')
  const [group, setGroup] = useState('All Parents')
  const [sending, setSending] = useState(false)

  const sendSMS = async () => {
    if (!msg.trim()) return toast.error('Enter a message.')
    setSending(true)
    try {
      const res = await apiCall('POST', '/sms/send', { group, message: msg }, token)
      if (res.success) { toast.success(res.message); setMsg('') }
      else toast.error(res.message)
    } catch { toast.error('Network error') }
    setSending(false)
  }

  return (
    <div className="fade-in">
      <h2 className="font-display text-2xl font-bold mb-6">Messaging</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl">
        <h3 className="font-bold text-sm text-gray-700 mb-4">📱 Send SMS to Parents</h3>
        <Sel label="Send to" value={group} onChange={e=>setGroup(e.target.value)}>
          <option>All Parents</option>
        </Sel>
        <Tex label="Message *" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type your message here…" style={{minHeight:100}} />
        <p className="text-xs text-gray-400 mb-4">{msg.length}/160 characters (1 SMS)</p>
        <button onClick={sendSMS} disabled={sending} className="btn-primary text-sm">
          <MessageSquare size={14}/> {sending ? 'Sending…' : 'Send SMS'}
        </button>
      </div>
    </div>
  )
}


// ════════════════════════════════════════════════════════════
// FEES PANEL — class/roll-wise with generate button
// ════════════════════════════════════════════════════════════
const BLANK_FEE2 = { studentName:'', grade:'', rollNo:'', month:'', amount:'', status:'Pending', receiptNo:'', paidDate:'' }

function FeesPanel() {
  const { token } = useAuth()
  const [fees, setFees]         = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [gradeFilter, setGF]    = useState('All')
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(BLANK_FEE2)
  const [saving, setSaving]     = useState(false)
  const [genModal, setGenModal] = useState(false)
  const [genForm, setGenForm]   = useState({ grade:'Grade 1', month:'', amount:'' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const url = gradeFilter === 'All' ? '/fees' : `/fees?grade=${encodeURIComponent(gradeFilter)}`
      const [fRes, sRes] = await Promise.all([
        fetch(`${API}${url}`, { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
        fetch(`${API}/students`,{ headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()),
      ])
      if (fRes.success) setFees(fRes.data)
      if (sRes.success) setStudents(sRes.data)
    } catch {}
    setLoading(false)
  }, [token, gradeFilter])

  useEffect(() => { load() }, [load])

  const grades = ['All', ...new Set(students.map(s=>s.grade).filter(Boolean)).values()]

  const totalPaid    = fees.filter(f=>f.status==='Paid').reduce((a,f)=>a+(f.amount||0),0)
  const totalPending = fees.filter(f=>f.status==='Pending').reduce((a,f)=>a+(f.amount||0),0)

  const save = async () => {
    if (!form.studentName?.trim() || !form.amount) return toast.error('Student name and amount required.')
    setSaving(true)
    try {
      let res
      if (modal.mode === 'add') {
        res = await apiCall('POST', '/fees', form, token)
        if (res.success) { setFees(p=>[res.data,...p]); toast.success('Fee record added!') }
      } else {
        res = await apiCall('PUT', `/fees/${modal.data._id}`, form, token)
        if (res.success) { setFees(p=>p.map(f=>f._id===modal.data._id?res.data:f)); toast.success('Updated.') }
      }
      if (!res.success) toast.error(res.message); else setModal(null)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const generateFees = async () => {
    if (!genForm.grade || !genForm.month || !genForm.amount) return toast.error('All fields required.')
    try {
      const res = await apiCall('POST', '/fees/generate', { grade:genForm.grade, month:genForm.month, amount:Number(genForm.amount) }, token)
      if (res.success) { toast.success(res.message); setGenModal(false); load() }
      else toast.error(res.message)
    } catch { toast.error('Network error') }
  }

  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Fee Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{fees.length} records</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={load} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl"><RefreshCw size={15}/></button>
          <button onClick={()=>setGenModal(true)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold flex items-center gap-2">
            ⚡ Generate Class Fees
          </button>
          <button onClick={()=>{ setForm({...BLANK_FEE2}); setModal({mode:'add'}) }} className="btn-primary text-sm"><Plus size={15}/> Add Fee</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="text-2xl font-bold text-green-700">Rs {totalPaid.toLocaleString()}</div>
          <div className="text-sm text-green-600 font-semibold mt-1">Total Collected</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="text-2xl font-bold text-red-700">Rs {totalPending.toLocaleString()}</div>
          <div className="text-sm text-red-600 font-semibold mt-1">Total Pending</div>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={gradeFilter} onChange={e=>setGF(e.target.value)} className="form-input w-auto cursor-pointer text-sm">
          {grades.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Roll</th><th>Student</th><th>Grade</th><th>Month</th><th>Amount</th><th>Status</th><th>Paid</th><th>Receipt</th><th>Actions</th></tr></thead>
              <tbody>
                {fees.length===0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">No fee records. Use "Generate Class Fees" to create records for a whole class.</td></tr>}
                {fees.map(fee=>(
                  <tr key={fee._id} className="hover:bg-green-50">
                    <td className="font-bold text-gray-500">{fee.rollNo||'—'}</td>
                    <td className="font-semibold">{fee.studentName}</td>
                    <td>{fee.grade}</td>
                    <td>{fee.month}</td>
                    <td className="font-mono">Rs {(fee.amount||0).toLocaleString()}</td>
                    <td><Badge color={fee.status==='Paid'?'green':'red'}>{fee.status}</Badge></td>
                    <td className="text-xs text-gray-400">{fee.paidDate||'—'}</td>
                    <td className="font-mono text-xs">{fee.receiptNo||'—'}</td>
                    <td>
                      <button onClick={()=>{ setForm({...fee}); setModal({mode:'edit',data:fee}) }}
                        className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                        <Edit2 size={11}/> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.mode==='add'?'Add Fee Record':'Edit Fee Record'} maxW={560}>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2"><Inp label="Student Name *" value={form.studentName} onChange={f('studentName')} placeholder="Aarav Sharma" /></div>
          <Inp label="Grade" value={form.grade} onChange={f('grade')} placeholder="Grade 9" />
          <Inp label="Roll No" type="number" value={form.rollNo} onChange={f('rollNo')} placeholder="1" />
          <Inp label="Month" value={form.month} onChange={f('month')} placeholder="Baisakh 2082" />
          <Inp label="Amount (Rs) *" type="number" value={form.amount} onChange={f('amount')} placeholder="1200" />
          <Sel label="Status" value={form.status} onChange={f('status')}><option>Pending</option><option>Paid</option></Sel>
          <Inp label="Paid Date" type="date" value={form.paidDate} onChange={f('paidDate')} />
          <div className="col-span-2"><Inp label="Receipt No" value={form.receiptNo} onChange={f('receiptNo')} placeholder="RCP-001" /></div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={()=>setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm"><Save size={14}/> {saving?'Saving…':modal?.mode==='add'?'Add':'Save'}</button>
        </div>
      </Modal>

      {/* Generate fees modal */}
      <Modal open={genModal} onClose={()=>setGenModal(false)} title="⚡ Generate Fees for Entire Class" maxW={440}>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700">
          This will create a Pending fee record for every active student in the selected class for the selected month.
        </div>
        <Sel label="Grade *" value={genForm.grade} onChange={e=>setGenForm(p=>({...p,grade:e.target.value}))}>
          {GRADES.map(g=><option key={g}>{g}</option>)}
        </Sel>
        <Inp label="Month *" value={genForm.month} onChange={e=>setGenForm(p=>({...p,month:e.target.value}))} placeholder="Baisakh 2082" />
        <Inp label="Amount (Rs) *" type="number" value={genForm.amount} onChange={e=>setGenForm(p=>({...p,amount:e.target.value}))} placeholder="1200" />
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={()=>setGenModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={generateFees} className="btn-primary text-sm">⚡ Generate Records</button>
        </div>
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// EXAMS PANEL — admin creates exams, assigns subjects, finalizes
// ════════════════════════════════════════════════════════════
const DEFAULT_SUBJECTS = [
  { name:'English',       fullMarks:100, passMarks:35, hasTheory:true, hasPractical:false, practicalFM:0 },
  { name:'Nepali',        fullMarks:100, passMarks:35, hasTheory:true, hasPractical:false, practicalFM:0 },
  { name:'Mathematics',   fullMarks:100, passMarks:35, hasTheory:true, hasPractical:false, practicalFM:0 },
  { name:'Science',       fullMarks:75,  passMarks:27, hasTheory:true, hasPractical:true,  practicalFM:25 },
  { name:'Social Studies',fullMarks:100, passMarks:35, hasTheory:true, hasPractical:false, practicalFM:0 },
  { name:'Computer/ICT',  fullMarks:75,  passMarks:27, hasTheory:true, hasPractical:true,  practicalFM:25 },
  { name:'HPE',           fullMarks:50,  passMarks:20, hasTheory:true, hasPractical:false, practicalFM:0 },
]

function ExamsPanel() {
  const { token } = useAuth()
  const { data: exams, setData: setExams, loading, reload } = useApi('/exams')
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState({ examName:'', examType:'Terminal', grade:'Grade 9', academicYear:'2081', subjects: DEFAULT_SUBJECTS })
  const [saving, setSaving]     = useState(false)
  const [finalizing, setFin]    = useState(null)
  const [resultsModal, setRM]   = useState(null)
  const [results, setResults]   = useState([])

  const openCreate = () => {
    setForm({ examName:'', examType:'Terminal', grade:'Grade 9', academicYear:'2081', subjects: JSON.parse(JSON.stringify(DEFAULT_SUBJECTS)) })
    setModal({mode:'add'})
  }

  const save = async () => {
    if (!form.examName.trim() || !form.grade) return toast.error('Exam name and grade required.')
    setSaving(true)
    try {
      let res
      if (modal.mode === 'add') {
        res = await apiCall('POST', '/exams', form, token)
        if (res.success) { setExams(p=>[res.data,...p]); toast.success('Exam created!') }
      } else {
        res = await apiCall('PUT', `/exams/${modal.data._id}`, form, token)
        if (res.success) { setExams(p=>p.map(e=>e._id===modal.data._id?res.data:e)); toast.success('Exam updated.') }
      }
      if (!res.success) toast.error(res.message); else setModal(null)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const finalize = async (examId, examName) => {
    if (!confirm(`Finalize & publish results for "${examName}"? This will calculate ranks for all students and make results visible to students.`)) return
    setFin(examId)
    try {
      const res = await apiCall('POST', `/results/finalize/${examId}`, null, token)
      if (res.success) { toast.success(res.message); reload() }
      else toast.error(res.message)
    } catch { toast.error('Network error') }
    setFin(null)
  }

  const viewResults = async (exam) => {
    try {
      const res = await fetch(`${API}/results/exam/${exam._id}`, { headers:{ Authorization:`Bearer ${token}` } })
      const data = await res.json()
      setResults(data.data || [])
      setRM(exam)
    } catch { toast.error('Network error') }
  }

  const updateSubject = (idx, field, value) => {
    setForm(p => {
      const subs = [...p.subjects]
      subs[idx] = { ...subs[idx], [field]: field.includes('Marks') || field.includes('FM') ? Number(value) : field === 'hasTheory' || field === 'hasPractical' ? value : value }
      return { ...p, subjects: subs }
    })
  }

  const addSubject = () => setForm(p => ({ ...p, subjects: [...p.subjects, { name:'', fullMarks:100, passMarks:35, hasTheory:true, hasPractical:false, practicalFM:0 }] }))
  const removeSubject = idx => setForm(p => ({ ...p, subjects: p.subjects.filter((_,i)=>i!==idx) }))

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Examination Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{exams.length} exams configured</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl"><RefreshCw size={15}/></button>
          <button onClick={openCreate} className="btn-primary text-sm"><Plus size={15}/> Create Exam</button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">📋</span>
        <div>
          <strong>Workflow:</strong> Create Exam → Teacher enters marks → Admin clicks Finalize → Results published to students.
          Teachers can only enter marks for classes assigned to them (set in Teachers → Assign Classes).
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="flex flex-col gap-4">
          {exams.length === 0 && (
            <div className="text-center py-20 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="text-5xl mb-4">📝</div>
              <p className="font-semibold">No exams created yet.</p>
              <p className="text-sm mt-2">Create an exam to allow teachers to enter marks.</p>
            </div>
          )}
          {exams.map(exam => (
            <div key={exam._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-green-300 transition-colors">
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2 flex-wrap items-center">
                    <Badge color="blue">{exam.grade}</Badge>
                    <Badge color="purple">{exam.examType}</Badge>
                    <Badge color={exam.isPublished?'green':'amber'}>{exam.isPublished?'✅ Published':'⏳ Pending'}</Badge>
                    <span className="text-xs text-gray-400">{exam.academicYear} B.S.</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{exam.examName}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exam.subjects?.map(s=>(
                      <span key={s.name} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.name} ({s.fullMarks})</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-col sm:flex-row items-end">
                  <button onClick={()=>viewResults(exam)}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
                    <Eye size={11}/> Results ({exam.resultsCount||0})
                  </button>
                  <button onClick={()=>{ setForm({examName:exam.examName,examType:exam.examType,grade:exam.grade,academicYear:exam.academicYear,subjects:exam.subjects}); setModal({mode:'edit',data:exam}) }}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 flex items-center gap-1">
                    <Edit2 size={11}/> Edit
                  </button>
                  {!exam.isPublished && (
                    <button onClick={()=>finalize(exam._id, exam.examName)} disabled={finalizing===exam._id}
                      className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                      {finalizing===exam._id?'Finalizing…':'🏆 Finalize & Publish'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.mode==='add'?'Create New Exam':'Edit Exam'} maxW={700}>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2">
            <Inp label="Exam Name *" value={form.examName} onChange={e=>setForm(p=>({...p,examName:e.target.value}))} placeholder="First Terminal Examination 2081" />
          </div>
          <Sel label="Grade *" value={form.grade} onChange={e=>setForm(p=>({...p,grade:e.target.value}))}>
            {GRADES.map(g=><option key={g}>{g}</option>)}
          </Sel>
          <Sel label="Exam Type" value={form.examType} onChange={e=>setForm(p=>({...p,examType:e.target.value}))}>
            {['Unit Test','First Terminal','Half Yearly','Second Terminal','Annual','Pre-Board'].map(t=><option key={t}>{t}</option>)}
          </Sel>
          <Inp label="Academic Year" value={form.academicYear} onChange={e=>setForm(p=>({...p,academicYear:e.target.value}))} placeholder="2081" />
        </div>

        <div className="mt-4 mb-2 flex items-center justify-between">
          <h4 className="font-bold text-sm text-gray-700">📚 Subjects & Marks Configuration</h4>
          <button onClick={addSubject} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100">
            + Add Subject
          </button>
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50">
                <th className="text-left px-3 py-2 font-bold text-gray-500">Subject</th>
                <th className="text-center px-3 py-2 font-bold text-gray-500">Full Marks</th>
                <th className="text-center px-3 py-2 font-bold text-gray-500">Pass Marks</th>
                <th className="text-center px-3 py-2 font-bold text-gray-500">Practical?</th>
                <th className="text-center px-3 py-2 font-bold text-gray-500">Prac. FM</th>
                <th className="text-center px-3 py-2 font-bold text-gray-500">Del</th>
              </tr></thead>
              <tbody>
                {form.subjects.map((s, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <input value={s.name} onChange={e=>updateSubject(idx,'name',e.target.value)}
                        className="w-32 border-2 border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-green-500" placeholder="Subject" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="number" value={s.fullMarks} onChange={e=>updateSubject(idx,'fullMarks',e.target.value)}
                        className="w-16 border-2 border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-green-500" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="number" value={s.passMarks} onChange={e=>updateSubject(idx,'passMarks',e.target.value)}
                        className="w-16 border-2 border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-green-500" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={s.hasPractical} onChange={e=>updateSubject(idx,'hasPractical',e.target.checked)}
                        className="accent-green-700 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      {s.hasPractical ? (
                        <input type="number" value={s.practicalFM} onChange={e=>updateSubject(idx,'practicalFM',e.target.value)}
                          className="w-16 border-2 border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-green-500" />
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={()=>removeSubject(idx)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={()=>setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm"><Save size={14}/> {saving?'Saving…':modal?.mode==='add'?'Create Exam':'Save Changes'}</button>
        </div>
      </Modal>

      {/* Results view + PDF modal */}
      <Modal open={!!resultsModal} onClose={()=>setRM(null)} title={`Results — ${resultsModal?.examName}`} maxW={900}>
        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No marks entered yet for this exam.</p>
            <p className="text-xs mt-2">Assign the teacher to this class, then they can enter marks from their portal.</p>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex gap-3">
                {[
                  [results.length, 'Total', 'bg-gray-100 text-gray-700'],
                  [results.filter(r=>r.isPassed).length, 'Passed', 'bg-green-100 text-green-700'],
                  [results.filter(r=>!r.isPassed&&!r.isAbsent).length, 'Failed', 'bg-red-100 text-red-700'],
                  [results.filter(r=>r.isAbsent).length, 'Absent', 'bg-amber-100 text-amber-700'],
                ].map(([v,l,cls])=>(
                  <div key={l} className={`${cls} rounded-xl px-3 py-2 text-center`}>
                    <div className="font-bold text-lg leading-none">{v}</div>
                    <div className="text-xs mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => {
                    // Build subject columns dynamically from first result
                    const subjects = results[0]?.marks?.map(m => m.subject) || []
                    const sorted   = [...results].sort((a,b) => (a.rank||999)-(b.rank||999))
                    const passCount = sorted.filter(r=>r.isPassed).length
                    const avgPct    = sorted.length > 0
                      ? (sorted.reduce((a,r)=>a+(r.percentage||0),0)/sorted.length).toFixed(1)
                      : 0
                    const topStudent = sorted[0]

                    const win = window.open('', '_blank')
                    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${resultsModal?.examName} — ${resultsModal?.grade} Result Sheet</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#111;padding:16px}
    .header{text-align:center;border-bottom:3px solid #166534;padding-bottom:12px;margin-bottom:14px}
    .school{font-size:20px;font-weight:800;color:#166534}
    .school-sub{font-size:11px;color:#555;margin-top:2px}
    .exam-title{font-size:15px;font-weight:700;margin-top:8px;color:#111}
    .meta{display:flex;justify-content:space-between;margin-bottom:12px;font-size:10px;color:#555;flex-wrap:wrap;gap:4px}
    .summary-boxes{display:flex;gap:10px;margin-bottom:14px}
    .sbox{border:1px solid #e5e7eb;border-radius:8px;padding:8px 14px;text-align:center;min-width:80px}
    .sbox-val{font-size:18px;font-weight:800;color:#166534}
    .sbox-lbl{font-size:9px;color:#777;margin-top:2px;text-transform:uppercase;letter-spacing:.5px}
    table{width:100%;border-collapse:collapse;font-size:10px;margin-bottom:14px}
    thead tr{background:#166534;color:#fff}
    th{padding:6px 5px;text-align:center;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;white-space:nowrap}
    th.left{text-align:left}
    td{padding:5px;border-bottom:1px solid #f0f0f0;text-align:center;vertical-align:middle}
    td.left{text-align:left}
    tr:nth-child(even) td{background:#f9fafb}
    tr:hover td{background:#f0fdf4}
    .pass{color:#15803d;font-weight:700}
    .fail{color:#dc2626;font-weight:700}
    .absent{color:#d97706;font-weight:700}
    .rank{background:#fef9c3;color:#854d0e;font-weight:800;border-radius:4px;padding:1px 5px}
    .rank1{background:#ffd700;color:#78350f}
    .rank2{background:#e5e7eb;color:#374151}
    .rank3{background:#fed7aa;color:#7c2d12}
    .footer{border-top:1px solid #e5e7eb;padding-top:12px;margin-top:16px;display:flex;justify-content:space-between;align-items:flex-end}
    .sig{text-align:center}
    .sig-line{border-top:1px solid #999;width:120px;margin:20px auto 4px;font-size:10px;color:#666}
    .note{font-size:9px;color:#888;text-align:center;margin-top:8px}
    @media print{body{padding:8px} .no-print{display:none}}
  </style>
</head>
<body>
  <div class="header">
    <div class="school">🌿 Evergreen Pacific English Boarding School</div>
    <div class="school-sub">Mayadevi, Rupandehi, Lumbini Province · Nepal · Affiliated to NEB</div>
    <div class="exam-title">${resultsModal?.examName} — Class Result Sheet</div>
    <div class="school-sub" style="margin-top:4px">Academic Year: ${resultsModal?.academicYear || '2081'} B.S.</div>
  </div>

  <div class="meta">
    <span><strong>Class:</strong> ${resultsModal?.grade}</span>
    <span><strong>Exam Type:</strong> ${resultsModal?.examType}</span>
    <span><strong>Total Students:</strong> ${sorted.length}</span>
    <span><strong>Pass %:</strong> ${sorted.length > 0 ? ((passCount/sorted.length)*100).toFixed(1) : 0}%</span>
    <span><strong>Class Average:</strong> ${avgPct}%</span>
    <span><strong>Topper:</strong> ${topStudent?.studentName || '—'} (${topStudent?.percentage?.toFixed(1) || 0}%)</span>
    <span><strong>Printed:</strong> ${new Date().toLocaleDateString('en-NP', {year:'numeric',month:'long',day:'numeric'})}</span>
  </div>

  <div class="summary-boxes">
    ${[
      [sorted.length, 'Total'],
      [passCount, 'Passed'],
      [sorted.filter(r=>!r.isPassed&&!r.isAbsent).length, 'Failed'],
      [sorted.filter(r=>r.isAbsent).length, 'Absent'],
      [avgPct+'%', 'Avg %'],
    ].map(([v,l])=>`<div class="sbox"><div class="sbox-val">${v}</div><div class="sbox-lbl">${l}</div></div>`).join('')}
  </div>

  <table>
    <thead>
      <tr>
        <th class="left">Roll</th>
        <th class="left">Student Name</th>
        ${subjects.map(s=>`<th>${s.replace(' Studies','').replace('/ICT','')}</th>`).join('')}
        <th>Total</th>
        <th>Full M.</th>
        <th>%</th>
        <th>GPA</th>
        <th>Grade</th>
        <th>Rank</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      ${sorted.map(r => {
        const rankCls = r.rank===1?'rank1':r.rank===2?'rank2':r.rank===3?'rank3':'rank'
        const statusCls = r.isAbsent?'absent':r.isPassed?'pass':'fail'
        const statusText = r.isAbsent?'Absent':r.isPassed?'PASS':'FAIL'
        return `<tr>
          <td class="left" style="font-weight:700;color:#555">${r.rollNo||'—'}</td>
          <td class="left" style="font-weight:600">${r.studentName}</td>
          ${(r.marks||[]).map(m=>`<td class="${m.isPassed?'pass':'fail'}">${r.isAbsent?'AB':m.totalMarks}</td>`).join('')}
          <td style="font-weight:700">${r.isAbsent?'—':r.totalObtained}</td>
          <td style="color:#555">${r.totalFullMarks}</td>
          <td style="font-weight:700">${r.isAbsent?'—':r.percentage?.toFixed(1)+'%'}</td>
          <td>${r.isAbsent?'—':r.gpa?.toFixed(2)}</td>
          <td style="font-weight:800;color:#166534">${r.isAbsent?'AB':r.overallGrade}</td>
          <td>${r.isAbsent?'—':`<span class="${rankCls}">#${r.rank||'—'}</span>`}</td>
          <td class="${statusCls}">${statusText}</td>
        </tr>`
      }).join('')}
    </tbody>
  </table>

  <div class="note">
    Grading: A+(4.0)≥90% · A(3.6)≥80% · B+(3.2)≥70% · B(2.8)≥60% · C+(2.4)≥50% · C(2.0)≥40% · D(1.6)≥35% · NG below pass marks
  </div>

  <div class="footer">
    <div class="sig"><div class="sig-line">Class Teacher</div></div>
    <div style="text-align:center;font-size:10px;color:#888">
      <div>Evergreen Pacific English Boarding School</div>
      <div style="margin-top:2px">Mayadevi, Rupandehi · Generated: ${new Date().toLocaleString()}</div>
    </div>
    <div class="sig"><div class="sig-line">Principal</div></div>
  </div>

  <script>window.onload=()=>setTimeout(()=>{window.print()},400)</script>
</body>
</html>`)
                    win.document.close()
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  📄 Download PDF
                </button>
                <button onClick={()=>setRM(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Close</button>
              </div>
            </div>

            {/* Preview table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-green-900 text-white">
                    <th className="text-left px-3 py-2.5 font-bold">Roll</th>
                    <th className="text-left px-3 py-2.5 font-bold">Name</th>
                    {results[0]?.marks?.map(m=>(
                      <th key={m.subject} className="px-2 py-2.5 font-bold text-center whitespace-nowrap">
                        {m.subject.replace(' Studies','').replace('/ICT','')}
                      </th>
                    ))}
                    <th className="px-2 py-2.5 font-bold text-center">Total</th>
                    <th className="px-2 py-2.5 font-bold text-center">%</th>
                    <th className="px-2 py-2.5 font-bold text-center">GPA</th>
                    <th className="px-2 py-2.5 font-bold text-center">Grade</th>
                    <th className="px-2 py-2.5 font-bold text-center">Rank</th>
                    <th className="px-2 py-2.5 font-bold text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[...results].sort((a,b)=>(a.rank||999)-(b.rank||999)).map((r,i)=>(
                    <tr key={i} className={`border-b border-gray-100 ${r.isAbsent?'bg-amber-50':r.isPassed?'hover:bg-green-50':'bg-red-50'}`}>
                      <td className="px-3 py-2 font-bold text-gray-500">{r.rollNo||'—'}</td>
                      <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">{r.studentName}</td>
                      {(r.marks||[]).map((m,j)=>(
                        <td key={j} className={`px-2 py-2 text-center font-bold ${r.isAbsent?'text-amber-500':m.isPassed?'text-green-700':'text-red-600'}`}>
                          {r.isAbsent ? 'AB' : m.totalMarks}
                        </td>
                      ))}
                      <td className="px-2 py-2 text-center font-bold">{r.isAbsent?'—':r.totalObtained}</td>
                      <td className="px-2 py-2 text-center font-bold">{r.isAbsent?'—':r.percentage?.toFixed(1)+'%'}</td>
                      <td className="px-2 py-2 text-center">{r.isAbsent?'—':r.gpa?.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center font-black text-green-700">{r.isAbsent?'AB':r.overallGrade}</td>
                      <td className="px-2 py-2 text-center">
                        {r.rank ? <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${r.rank<=3?'bg-amber-100 text-amber-800':'text-gray-600'}`}>#{r.rank}</span> : '—'}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.isAbsent?'bg-amber-100 text-amber-700':r.isPassed?'bg-green-100 text-green-800':'bg-red-100 text-red-700'}`}>
                          {r.isAbsent?'Absent':r.isPassed?'Pass':'Fail'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {results.length === 0 && (
          <div className="flex justify-end mt-4">
            <button onClick={()=>setRM(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Close</button>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [sideOpen, setSideOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sideOpen={sideOpen} setSideOpen={setSideOpen} />
      <div className="lg:pl-60">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3 lg:hidden">
          <button onClick={() => setSideOpen(true)} className="p-2 text-gray-600 hover:text-green-700">
            <Menu size={20}/>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="font-bold text-sm text-gray-800">Admin Panel</span>
          </div>
        </div>

        <div className="p-5 lg:p-8">
          <Routes>
            <Route index       element={<DashboardHome />} />
            <Route path="students"   element={<StudentsPanel />} />
            <Route path="teachers"   element={<TeachersPanel />} />
            <Route path="attendance" element={<AttendancePanel />} />
            <Route path="fees"       element={<FeesPanel />} />
            <Route path="notices"    element={<NoticesPanel />} />
            <Route path="gallery"    element={<GalleryPanel />} />
            <Route path="sms"        element={<MessagingPanel />} />
            <Route path="exams"      element={<ExamsPanel />} />
            <Route path="*"          element={<DashboardHome />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
