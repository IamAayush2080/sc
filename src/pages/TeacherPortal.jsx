// src/pages/TeacherPortal.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'
import { LogOut, Users, ClipboardList, BookOpen, BarChart2, Save, RefreshCw, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TABS = [
  { id: 'dashboard',  icon: '📊', label: 'Dashboard' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'marks',      icon: '📝', label: 'Enter Marks' },
]

function Badge({ children, color = 'green' }) {
  const m = {
    green: 'bg-green-100 text-green-800', red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700', amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-600', purple: 'bg-purple-100 text-purple-700',
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${m[color] || m.gray}`}>{children}</span>
}

function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 rounded-full border-[3px] border-green-200 border-t-green-700 animate-spin" />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// ATTENDANCE TAB
// ════════════════════════════════════════════════════════════
function AttendanceTab({ teacher, token }) {
  const grades = teacher?.assignedGrades || []
  const [grade, setGrade]     = useState(grades[0] || '')
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [att, setAtt]         = useState({})
  const [loadingStu, setLS]   = useState(false)
  const [saving, setSaving]   = useState(false)
  const [existingLoaded, setExisting] = useState(false)

  const loadStudents = useCallback(async () => {
    if (!grade) return
    setLS(true)
    try {
      const [stuRes, attRes] = await Promise.all([
        fetch(`${API}/students/by-grade/${encodeURIComponent(grade)}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/attendance?grade=${encodeURIComponent(grade)}&date=${date}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ])
      const stuList = stuRes.data || []
      setStudents(stuList)

      // Pre-fill existing attendance or default to Present
      const existing = {}
      if (attRes.data?.length > 0) {
        attRes.data.forEach(a => { existing[a.studentId] = a.status })
        setExisting(true)
      } else {
        stuList.forEach(s => { existing[s._id] = 'P' })
        setExisting(false)
      }
      setAtt(existing)
    } catch { toast.error('Failed to load students') }
    setLS(false)
  }, [grade, date, token])

  useEffect(() => { loadStudents() }, [loadStudents])

  const markAll = (status) => {
    const updated = {}
    students.forEach(s => { updated[s._id] = status })
    setAtt(updated)
  }

  const save = async () => {
    if (students.length === 0) return toast.error('No students to mark attendance for.')
    setSaving(true)
    try {
      const records = students.map(s => ({
        studentId: s._id, studentName: s.name, rollNo: s.rollNo, phone: s.phone, status: att[s._id] || 'P'
      }))
      const res = await fetch(`${API}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ grade, date, records }),
      })
      const data = await res.json()
      if (data.success) { toast.success(data.message); setExisting(true) }
      else toast.error(data.message)
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const present = Object.values(att).filter(v => v === 'P').length
  const absent  = Object.values(att).filter(v => v === 'A').length
  const leave   = Object.values(att).filter(v => v === 'L').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold text-gray-900">Mark Attendance</h2>
        <button onClick={save} disabled={saving || students.length === 0} className="btn-primary text-sm">
          <Save size={15} /> {saving ? 'Saving…' : 'Save Attendance'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={grade} onChange={e => setGrade(e.target.value)} className="form-input w-auto cursor-pointer text-sm">
          {grades.length === 0 && <option value="">No classes assigned</option>}
          {grades.map(g => <option key={g}>{g}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input w-auto text-sm" />
        <button onClick={loadStudents} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          [present, 'Present', 'bg-green-50 border-green-200 text-green-700'],
          [absent,  'Absent',  'bg-red-50 border-red-200 text-red-600'],
          [leave,   'Leave',   'bg-amber-50 border-amber-200 text-amber-600'],
          [students.length, 'Total', 'bg-gray-50 border-gray-200 text-gray-700'],
        ].map(([v, l, cls]) => (
          <div key={l} className={`border rounded-xl px-4 py-2.5 text-center min-w-[72px] ${cls}`}>
            <div className="text-2xl font-bold">{v}</div>
            <div className="text-xs font-semibold mt-0.5">{l}</div>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {existingLoaded && <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 font-semibold">✓ Saved before</span>}
          {['P','A','L'].map(s => (
            <button key={s} onClick={() => markAll(s)}
              className="px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors bg-white hover:bg-gray-50 border-gray-200 text-gray-600">
              Mark All {s === 'P' ? 'Present' : s === 'A' ? 'Absent' : 'Leave'}
            </button>
          ))}
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">🏫</div>
          <p className="font-semibold">No classes assigned to you yet.</p>
          <p className="text-sm mt-2">Ask admin to assign classes to your profile.</p>
        </div>
      ) : loadingStu ? <LoadingSpinner text="Loading students…" /> : students.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">👥</div>
          <p>No active students in {grade}.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id} className={`border-b border-gray-100 transition-colors ${att[s._id] === 'A' ? 'bg-red-50' : att[s._id] === 'L' ? 'bg-amber-50' : 'hover:bg-green-50'}`}>
                    <td className="px-4 py-3 font-bold text-gray-500 text-sm w-12">{s.rollNo || (i + 1)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden sm:table-cell">{s.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        {[['P', 'Present', 'bg-green-700 text-white', 'bg-white border-gray-200 text-gray-500 hover:border-green-400'],
                          ['A', 'Absent',  'bg-red-600 text-white',   'bg-white border-gray-200 text-gray-500 hover:border-red-400'],
                          ['L', 'Leave',   'bg-amber-500 text-white', 'bg-white border-gray-200 text-gray-500 hover:border-amber-400']
                        ].map(([val, label, activeCls, inactiveCls]) => (
                          <button key={val} onClick={() => setAtt(p => ({ ...p, [s._id]: val }))}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${att[s._id] === val ? activeCls : inactiveCls}`}>
                            {label}
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
// MARKS ENTRY TAB
// ════════════════════════════════════════════════════════════
function MarksTab({ teacher, token }) {
  const grades = teacher?.assignedGrades || []
  const [grade, setGrade]     = useState(grades[0] || '')
  const [exams, setExams]     = useState([])
  const [examId, setExamId]   = useState('')
  const [exam, setExam]       = useState(null)
  const [students, setStudents] = useState([])
  const [results, setResults] = useState({}) // { studentId: { marks: [], isAbsent: false } }
  const [loading, setLoading] = useState(false)
  const [saving, setSaving]   = useState(null) // studentId being saved
  const [saved, setSaved]     = useState({})   // { studentId: true }

  // Load exams for grade
  useEffect(() => {
    if (!grade) return
    fetch(`${API}/exams?grade=${encodeURIComponent(grade)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => {
        setExams(json.data || [])
        setExamId('')
        setExam(null)
      })
  }, [grade, token])

  // Load exam details + students + existing results
  useEffect(() => {
    if (!examId) return
    setLoading(true)
    Promise.all([
      fetch(`${API}/exams/${examId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/students/by-grade/${encodeURIComponent(grade)}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/results/exam/${examId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([examData, stuData, resData]) => {
      const ex  = examData.data
      const stu = stuData.data  || []
      const res = resData.data  || []
      setExam(ex)
      setStudents(stu)

      // Build initial results state
      const init = {}
      stu.forEach(s => {
        const existing = res.find(r => r.studentId?.toString() === s._id?.toString())
        if (existing) {
          init[s._id] = { marks: existing.marks, isAbsent: existing.isAbsent }
          setSaved(p => ({ ...p, [s._id]: true }))
        } else {
          init[s._id] = {
            isAbsent: false,
            marks: (ex?.subjects || []).map(sub => ({
              subject: sub.name, theoryMarks: '', practicalMarks: '', fullMarks: sub.fullMarks, passMarks: sub.passMarks
            }))
          }
        }
      })
      setResults(init)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [examId, grade, token])

  const updateMark = (studentId, subjectIdx, field, value) => {
    setResults(prev => {
      const copy = { ...prev }
      const marks = [...(copy[studentId]?.marks || [])]
      marks[subjectIdx] = { ...marks[subjectIdx], [field]: value === '' ? '' : Number(value) }
      copy[studentId] = { ...copy[studentId], marks }
      return copy
    })
    setSaved(p => ({ ...p, [studentId]: false }))
  }

  const toggleAbsent = (studentId, val) => {
    setResults(prev => ({ ...prev, [studentId]: { ...prev[studentId], isAbsent: val } }))
    setSaved(p => ({ ...p, [studentId]: false }))
  }

  const saveStudent = async (studentId) => {
    setSaving(studentId)
    try {
      const r      = results[studentId]
      const marks  = r.marks.map(m => ({
        subject: m.subject,
        theoryMarks:    Number(m.theoryMarks    || 0),
        practicalMarks: Number(m.practicalMarks || 0),
        fullMarks: m.fullMarks,
        passMarks: m.passMarks,
      }))
      const res = await fetch(`${API}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examId, studentId, marks, isAbsent: r.isAbsent }),
      })
      const data = await res.json()
      if (data.success) { setSaved(p => ({ ...p, [studentId]: true })); toast.success(`Marks saved for ${students.find(s => s._id === studentId)?.name}`) }
      else toast.error(data.message)
    } catch { toast.error('Network error') }
    setSaving(null)
  }

  const saveAll = async () => {
    for (const s of students) {
      await saveStudent(s._id)
    }
    toast.success('All marks saved!')
  }

  if (grades.length === 0) return (
    <div className="text-center py-20 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
      <div className="text-4xl mb-3">🏫</div>
      <p className="font-semibold">No classes assigned to you yet.</p>
      <p className="text-sm mt-2">Ask admin to assign classes to your profile.</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold text-gray-900">Enter Marks</h2>
        {exam && students.length > 0 && (
          <button onClick={saveAll} className="btn-primary text-sm">
            <Save size={15} /> Save All Students
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={grade} onChange={e => { setGrade(e.target.value); setExamId('') }} className="form-input w-auto cursor-pointer text-sm">
          {grades.map(g => <option key={g}>{g}</option>)}
        </select>
        <select value={examId} onChange={e => setExamId(e.target.value)} className="form-input w-auto cursor-pointer text-sm" disabled={exams.length === 0}>
          <option value="">{exams.length === 0 ? 'No exams for this class' : '— Select Exam —'}</option>
          {exams.map(e => <option key={e._id} value={e._id}>{e.examName} ({e.examType})</option>)}
        </select>
      </div>

      {!examId && (
        <div className="text-center py-20 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="text-5xl mb-3">📝</div>
          <p className="font-semibold">Select a class and exam to enter marks</p>
          <p className="text-xs mt-2">Admin must create the exam first from the Admin Panel → Exams</p>
        </div>
      )}

      {examId && loading && <LoadingSpinner text="Loading students and marks…" />}

      {examId && !loading && exam && (
        <>
          {/* Exam info banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-4 flex-wrap">
            <div>
              <p className="font-bold text-green-900">{exam.examName}</p>
              <p className="text-xs text-green-700">{exam.examType} · {grade} · Academic Year {exam.academicYear}</p>
            </div>
            <div className="ml-auto flex gap-2 flex-wrap">
              {exam.subjects?.map(s => (
                <span key={s.name} className="text-xs bg-white border border-green-200 rounded-full px-2.5 py-1 font-semibold text-green-800">
                  {s.name} ({s.fullMarks})
                </span>
              ))}
            </div>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No active students in {grade}.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {students.map(s => {
                const r = results[s._id] || { marks: [], isAbsent: false }
                const isSaved = saved[s._id]
                const isSaving = saving === s._id

                return (
                  <div key={s._id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${isSaved ? 'border-green-300' : 'border-gray-200'}`}>
                    {/* Student header */}
                    <div className={`flex items-center justify-between px-5 py-3 ${isSaved ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-800 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {s.rollNo || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.sid}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isSaved && <span className="text-xs text-green-700 font-bold">✅ Saved</span>}
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                          <input type="checkbox" checked={r.isAbsent} onChange={e => toggleAbsent(s._id, e.target.checked)}
                            className="accent-red-600 w-3.5 h-3.5 cursor-pointer" />
                          Absent (all)
                        </label>
                        <button onClick={() => saveStudent(s._id)} disabled={isSaving}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isSaved ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-green-800 text-white hover:bg-green-700'}`}>
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>

                    {/* Marks input grid */}
                    {!r.isAbsent && (
                      <div className="p-4 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left py-2 pr-4 text-xs text-gray-400 font-bold uppercase">Subject</th>
                              <th className="text-center py-2 px-2 text-xs text-gray-400 font-bold uppercase">Full Marks</th>
                              <th className="text-center py-2 px-2 text-xs text-gray-400 font-bold uppercase">Pass Marks</th>
                              <th className="text-center py-2 px-2 text-xs text-gray-400 font-bold uppercase">Theory</th>
                              {exam.subjects?.some(sub => sub.hasPractical) && (
                                <th className="text-center py-2 px-2 text-xs text-gray-400 font-bold uppercase">Practical</th>
                              )}
                              <th className="text-center py-2 px-2 text-xs text-gray-400 font-bold uppercase">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(r.marks || []).map((m, idx) => {
                              const subCfg = exam.subjects?.find(sub => sub.name === m.subject) || {}
                              const total  = (Number(m.theoryMarks) || 0) + (Number(m.practicalMarks) || 0)
                              const fm     = (subCfg.fullMarks || 100) + (subCfg.practicalFM || 0)
                              const pm     = subCfg.passMarks || 35
                              const failed = total < pm
                              return (
                                <tr key={idx} className="border-t border-gray-100">
                                  <td className="py-2 pr-4 font-semibold text-gray-800">{m.subject}</td>
                                  <td className="py-2 px-2 text-center text-gray-500 text-xs">{fm}</td>
                                  <td className="py-2 px-2 text-center text-gray-500 text-xs">{pm}</td>
                                  <td className="py-2 px-2 text-center">
                                    <input
                                      type="number" min="0" max={subCfg.fullMarks || 100}
                                      value={m.theoryMarks === '' ? '' : m.theoryMarks}
                                      onChange={e => updateMark(s._id, idx, 'theoryMarks', e.target.value)}
                                      className={`w-16 text-center border-2 rounded-lg py-1 text-sm font-semibold focus:outline-none transition-colors
                                        ${failed ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-green-500'}`}
                                    />
                                  </td>
                                  {exam.subjects?.some(sub => sub.hasPractical) && (
                                    <td className="py-2 px-2 text-center">
                                      {subCfg.hasPractical ? (
                                        <input
                                          type="number" min="0" max={subCfg.practicalFM || 50}
                                          value={m.practicalMarks === '' ? '' : m.practicalMarks}
                                          onChange={e => updateMark(s._id, idx, 'practicalMarks', e.target.value)}
                                          className="w-16 text-center border-2 border-gray-200 rounded-lg py-1 text-sm font-semibold focus:outline-none focus:border-green-500"
                                        />
                                      ) : <span className="text-gray-300">—</span>}
                                    </td>
                                  )}
                                  <td className="py-2 px-2 text-center">
                                    <span className={`font-bold text-sm ${failed ? 'text-red-600' : 'text-green-700'}`}>{total || '—'}</span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {r.isAbsent && (
                      <div className="px-5 py-4 text-sm text-red-500 font-semibold italic">Absent — no marks entered</div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ════════════════════════════════════════════════════════════
function DashboardTab({ teacher }) {
  const grades = teacher?.assignedGrades || []
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900">Welcome, {teacher?.name?.split(' ')[0] || 'Teacher'}!</h2>
        <p className="text-gray-400 text-sm mt-1">{teacher?.subject} Teacher · {teacher?.tid}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { emoji: '🏫', label: 'Assigned Classes', value: grades.length || 0, color: 'bg-green-50 text-green-700' },
          { emoji: '📚', label: 'Subject',           value: teacher?.subject || '—', color: 'bg-blue-50 text-blue-700' },
          { emoji: '👤', label: 'Role',              value: teacher?.role || 'Teacher', color: 'bg-purple-50 text-purple-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-5`}>
            <div className="text-3xl mb-3">{s.emoji}</div>
            <div className="font-bold text-xl">{s.value}</div>
            <div className="text-sm opacity-70 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {grades.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-gray-700 mb-4">📋 Your Assigned Classes</h3>
          <div className="flex flex-wrap gap-3">
            {grades.map(g => (
              <div key={g} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <span className="text-base">🏫</span>
                <span className="font-bold text-green-800 text-sm">{g}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
          <strong>⚠️ No classes assigned yet.</strong> Ask the school admin to assign classes to your profile so you can mark attendance and enter marks.
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-gray-700 mb-3">📅 Quick: Attendance</h3>
          <p className="text-xs text-gray-500">Go to the <strong>Attendance</strong> tab to mark today's attendance for your classes.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-gray-700 mb-3">📝 Quick: Marks Entry</h3>
          <p className="text-xs text-gray-500">Go to the <strong>Enter Marks</strong> tab to enter exam marks once admin has set up the exam.</p>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// MAIN TEACHER PORTAL
// ════════════════════════════════════════════════════════════
export default function TeacherPortal() {
  const [tab, setTab]           = useState('dashboard')
  const [teacher, setTeacher]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/teachers/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setTeacher(json.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner text="Loading teacher portal…" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-green-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-base border border-white/20">🌿</div>
            <div>
              <div className="text-sm font-bold leading-tight">Evergreen Pacific</div>
              <div className="text-xs opacity-50">Teacher Portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold hidden sm:block">
              👨‍🏫 {teacher?.name?.split(' ')[0] || user?.name?.split(' ')[0]} · {teacher?.subject}
            </span>
            <button onClick={() => { logout(); navigate('/') }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold transition-colors">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Teacher info card */}
        <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-2xl p-5 text-white mb-5 flex items-center gap-4 flex-wrap shadow-lg">
          <div className="w-14 h-14 bg-white/15 rounded-full border-2 border-white/25 flex items-center justify-center text-2xl flex-shrink-0">
            👨‍🏫
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">{teacher?.name || user?.name}</h1>
            <p className="text-green-200 text-sm">{teacher?.subject} · {teacher?.tid || '—'} · {teacher?.qual || '—'}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(teacher?.assignedGrades || []).map(g => (
              <span key={g} className="bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold">{g}</span>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 mb-5 flex overflow-x-auto gap-1">
          {TABS.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0
                ${tab === id ? 'bg-green-900 text-white shadow' : 'text-gray-500 hover:text-green-800 hover:bg-green-50'}`}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'dashboard'  && <DashboardTab teacher={teacher} />}
        {tab === 'attendance' && <AttendanceTab teacher={teacher} token={token} />}
        {tab === 'marks'      && <MarksTab teacher={teacher} token={token} />}
      </div>

      <div className="text-center py-6 text-xs text-gray-400">
        © 2083 B.S. Evergreen Pacific English Boarding School
      </div>
    </div>
  )
}
