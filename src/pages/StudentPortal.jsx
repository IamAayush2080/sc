// src/pages/StudentPortal.jsx — with Exam Results tab
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'
import { LogOut, User, Calendar, DollarSign, Bell, Clock, Award, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TIMETABLE = [
  { period: 'P1 · 8:00–8:45',   sun:'English',  mon:'Math',     tue:'Science',  wed:'English', thu:'Math',     fri:'Computer' },
  { period: 'P2 · 8:45–9:30',   sun:'Nepali',   mon:'Science',  tue:'English',  wed:'Social',  thu:'Nepali',   fri:'HPE'      },
  { period: 'P3 · 10:30–11:15', sun:'Math',     mon:'Nepali',   tue:'Math',     wed:'Nepali',  thu:'English',  fri:'Arts'     },
  { period: 'P4 · 11:15–12:00', sun:'Science',  mon:'Computer', tue:'HPE',      wed:'Math',    thu:'Computer', fri:'Math'     },
  { period: 'P5 · 12:45–1:30',  sun:'Social',   mon:'Social',   tue:'Nepali',   wed:'Science', thu:'Social',   fri:'English'  },
]
const SUB_BG = {
  English:'bg-green-100 text-green-800', Math:'bg-blue-100 text-blue-800',
  Science:'bg-amber-100 text-amber-800', Nepali:'bg-rose-100 text-rose-800',
  Social:'bg-teal-100 text-teal-800',   Computer:'bg-purple-100 text-purple-800',
  HPE:'bg-orange-100 text-orange-800',  Arts:'bg-pink-100 text-pink-800',
}
const TABS = [
  { id:'profile',    Icon:User,     label:'Profile'    },
  { id:'results',    Icon:Award,    label:'Results'    },
  { id:'attendance', Icon:Calendar, label:'Attendance' },
  { id:'fees',       Icon:DollarSign,label:'Fees'      },
  { id:'notices',    Icon:Bell,     label:'Notices'    },
  { id:'timetable',  Icon:Clock,    label:'Timetable'  },
]

function Badge({ children, color='green' }) {
  const m = { green:'bg-green-100 text-green-800', red:'bg-red-100 text-red-700', blue:'bg-blue-100 text-blue-700', amber:'bg-amber-100 text-amber-800', gray:'bg-gray-100 text-gray-600', purple:'bg-purple-100 text-purple-700' }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${m[color]||m.gray}`}>{children}</span>
}

function useStudentData(endpoint, token) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const load = useCallback(async () => {
    if (!token) return
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (json.success) setData(json.data)
      else setError(json.message)
    } catch { setError('Network error') }
    finally  { setLoading(false) }
  }, [endpoint, token])
  useEffect(() => { load() }, [load])
  return { data, loading, error, reload: load }
}

// ── Grade color helper ───────────────────────────────────────
function gradeColor(grade) {
  const m = { 'A+':'text-emerald-700', A:'text-green-700', 'B+':'text-blue-700', B:'text-blue-600', 'C+':'text-amber-700', C:'text-amber-600', D:'text-orange-600', NG:'text-red-600', AB:'text-gray-400' }
  return m[grade] || 'text-gray-600'
}
function gradeBg(grade) {
  const m = { 'A+':'bg-emerald-50 border-emerald-200', A:'bg-green-50 border-green-200', 'B+':'bg-blue-50 border-blue-200', B:'bg-blue-50 border-blue-200', 'C+':'bg-amber-50 border-amber-200', C:'bg-amber-50 border-amber-200', D:'bg-orange-50 border-orange-200', NG:'bg-red-50 border-red-200', AB:'bg-gray-50 border-gray-200' }
  return m[grade] || 'bg-gray-50 border-gray-200'
}

// ════════════════════════════════════════════════════════════
// RESULTS TAB with PDF
// ════════════════════════════════════════════════════════════
function ResultsTab({ token, student }) {
  const { data: results, loading } = useStudentData('/students/me/results', token)
  const [selected, setSelected]   = useState(null)
  const printRef = useRef()

  useEffect(() => {
    if (results?.length > 0 && !selected) setSelected(results[0])
  }, [results])

  const printResult = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
      <head>
        <title>Result Card — ${student?.name} — ${selected?.examId?.examName}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
          body { padding: 24px; color: #111; }
          .header { text-align: center; border-bottom: 3px solid #166534; padding-bottom: 16px; margin-bottom: 20px; }
          .school-name { font-size: 22px; font-weight: 800; color: #166534; }
          .school-sub  { font-size: 12px; color: #666; margin-top: 2px; }
          .exam-title  { font-size: 17px; font-weight: 700; margin-top: 10px; }
          .info-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; font-size: 13px; }
          .info-item   { display: flex; gap: 8px; }
          .info-label  { color: #555; min-width: 80px; }
          .info-value  { font-weight: 600; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
          th { background: #166534; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) td { background: #f9fafb; }
          .fail { color: #dc2626; font-weight: 700; }
          .pass { color: #166534; font-weight: 700; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
          .sum-box { border: 2px solid #e5e7eb; border-radius: 10px; padding: 12px; text-align: center; }
          .sum-val  { font-size: 22px; font-weight: 800; color: #166534; }
          .sum-lbl  { font-size: 11px; color: #777; margin-top: 4px; }
          .result-banner { padding: 10px 16px; border-radius: 8px; text-align: center; font-weight: 800; font-size: 16px; margin-bottom: 16px; }
          .passed { background: #dcfce7; color: #166534; border: 2px solid #86efac; }
          .failed { background: #fee2e2; color: #dc2626; border: 2px solid #fca5a5; }
          .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 20px; }
          .sig-line { border-top: 1px solid #999; width: 130px; margin-top: 24px; padding-top: 4px; text-align: center; font-size: 11px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">🌿 Evergreen Pacific English Boarding School</div>
          <div class="school-sub">Mayadevi, Rupandehi, Lumbini Province · Nepal</div>
          <div class="exam-title">${selected?.examId?.examName || 'Examination'} — Result Card</div>
          <div class="school-sub">Academic Year: ${selected?.examId?.academicYear || '2081'}</div>
        </div>

        <div class="info-grid">
          <div class="info-item"><span class="info-label">Name:</span><span class="info-value">${student?.name}</span></div>
          <div class="info-item"><span class="info-label">Student ID:</span><span class="info-value">${student?.sid}</span></div>
          <div class="info-item"><span class="info-label">Class:</span><span class="info-value">${student?.grade}</span></div>
          <div class="info-item"><span class="info-label">Roll No:</span><span class="info-value">${student?.rollNo || '—'}</span></div>
          <div class="info-item"><span class="info-label">Exam:</span><span class="info-value">${selected?.examId?.examType || '—'}</span></div>
          <div class="info-item"><span class="info-label">Rank:</span><span class="info-value">${selected?.rank ? `#${selected.rank}` : '—'}</span></div>
        </div>

        <div class="summary">
          <div class="sum-box"><div class="sum-val">${selected?.percentage?.toFixed(1)}%</div><div class="sum-lbl">Percentage</div></div>
          <div class="sum-box"><div class="sum-val">${selected?.gpa?.toFixed(2)}</div><div class="sum-lbl">GPA</div></div>
          <div class="sum-box"><div class="sum-val">${selected?.overallGrade}</div><div class="sum-lbl">Overall Grade</div></div>
          <div class="sum-box"><div class="sum-val">${selected?.rank ? '#' + selected.rank : '—'}</div><div class="sum-lbl">Class Rank</div></div>
        </div>

        <div class="result-banner ${selected?.isPassed ? 'passed' : 'failed'}">
          ${selected?.isPassed ? '✅ PASSED' : '❌ FAILED / NOT PASSED'}
        </div>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Full Marks</th>
              <th>Pass Marks</th>
              <th>Theory</th>
              <th>Practical</th>
              <th>Total</th>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${(selected?.marks || []).map(m => `
              <tr>
                <td style="font-weight:600">${m.subject}</td>
                <td style="text-align:center">${m.fullMarks}</td>
                <td style="text-align:center">${m.passMarks}</td>
                <td style="text-align:center">${m.theoryMarks ?? '—'}</td>
                <td style="text-align:center">${m.practicalMarks || '—'}</td>
                <td style="text-align:center;font-weight:700" class="${m.isPassed ? 'pass' : 'fail'}">${m.totalMarks}</td>
                <td style="text-align:center;font-weight:800" class="${m.isPassed ? 'pass' : 'fail'}">${m.grade}</td>
                <td style="text-align:center">${m.gradePoint?.toFixed(1)}</td>
                <td>${m.remarks || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>
            <div class="sig-line">Class Teacher</div>
          </div>
          <div style="text-align:center;font-size:11px;color:#888">
            <div>Printed on: ${new Date().toLocaleDateString()}</div>
            <div style="margin-top:4px">Evergreen Pacific English Boarding School</div>
          </div>
          <div style="text-align:right">
            <div class="sig-line">Principal</div>
          </div>
        </div>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  if (loading) return <div className="py-16 text-center text-gray-400">Loading results…</div>

  if (!results || results.length === 0) return (
    <div className="text-center py-16 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
      <div className="text-5xl mb-4">🏆</div>
      <p className="font-semibold">No results published yet.</p>
      <p className="text-sm mt-2">Results will appear here once the admin finalizes and publishes them.</p>
    </div>
  )

  return (
    <div>
      {/* Exam selector */}
      {results.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {results.map(r => (
            <button key={r._id} onClick={() => setSelected(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all
                ${selected?._id === r._id ? 'bg-green-900 text-white border-green-900' : 'bg-white border-gray-200 text-gray-600 hover:border-green-400'}`}>
              {r.examId?.examName || 'Exam'} · {r.examId?.examType}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div ref={printRef}>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {[
              [selected.percentage?.toFixed(1) + '%', 'Percentage', selected.isPassed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'],
              [selected.gpa?.toFixed(2),              'GPA (4.0)',  'bg-blue-50 border-blue-200 text-blue-700'],
              [selected.overallGrade,                 'Overall Grade', `${gradeBg(selected.overallGrade)} ${gradeColor(selected.overallGrade)}`],
              [selected.rank ? `#${selected.rank}` : '—', 'Class Rank', 'bg-purple-50 border-purple-200 text-purple-700'],
            ].map(([v, l, cls], i) => (
              <div key={i} className={`border rounded-2xl p-5 text-center ${cls}`}>
                <div className="text-3xl font-bold">{v}</div>
                <div className="text-xs font-semibold mt-1 opacity-70">{l}</div>
              </div>
            ))}
          </div>

          {/* Pass/Fail banner */}
          <div className={`rounded-xl px-5 py-3 text-center font-bold text-sm mb-5 border ${selected.isPassed ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-700'}`}>
            {selected.isPassed ? '✅ CONGRATULATIONS! You have PASSED this examination.' : '❌ Result: Not Passed. Please work harder. You can do it!'}
          </div>

          {/* Subject-wise marks */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">{selected.examId?.examName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selected.examId?.examType} · {selected.examId?.academicYear}</p>
              </div>
              <button onClick={printResult}
                className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors">
                <Download size={13} /> Save as PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {['Subject', 'Full Marks', 'Pass Marks', 'Theory', 'Practical', 'Total', 'Grade', 'Points', 'Remarks'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selected.isAbsent ? (
                    <tr><td colSpan={9} className="text-center py-8 text-red-500 font-bold">ABSENT — No marks recorded</td></tr>
                  ) : (
                    (selected.marks || []).map((m, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${!m.isPassed ? 'bg-red-50' : 'hover:bg-green-50'} transition-colors`}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{m.subject}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{m.fullMarks}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{m.passMarks}</td>
                        <td className="px-4 py-3 text-center">{m.theoryMarks ?? '—'}</td>
                        <td className="px-4 py-3 text-center">{m.practicalMarks || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold text-base ${m.isPassed ? 'text-green-700' : 'text-red-600'}`}>{m.totalMarks}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-black text-lg ${gradeColor(m.grade)}`}>{m.grade}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{m.gradePoint?.toFixed(1)}</td>
                        <td className="px-4 py-3">
                          <Badge color={m.isPassed ? 'green' : 'red'}>{m.remarks}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Attendance section ───────────────────────────────────────
function AttendanceSection({ token }) {
  const { data: records, loading } = useStudentData('/students/me/attendance', token)
  const grouped = {}
  if (records) {
    records.forEach(r => {
      const k = r.date?.slice(0, 7) || 'Unknown'
      if (!grouped[k]) grouped[k] = { P:0, A:0, L:0, total:0 }
      grouped[k][r.status] = (grouped[k][r.status] || 0) + 1
      grouped[k].total++
    })
  }
  const totPresent = records?.filter(r => r.status === 'P').length || 0
  const totDays    = records?.length || 0
  const attPct     = totDays > 0 ? ((totPresent / totDays) * 100).toFixed(1) : '—'

  if (loading) return <div className="py-16 text-center text-gray-400">Loading attendance…</div>
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[[totPresent,'Present','bg-green-50 border-green-200 text-green-700'],
          [totDays-totPresent,'Absent','bg-red-50 border-red-200 text-red-600'],
          [`${attPct}%`,'Attendance %','bg-blue-50 border-blue-200 text-blue-700']
        ].map(([v,l,cls],i) => (
          <div key={i} className={`${cls} border rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-bold">{v}</div>
            <div className="text-xs mt-1 opacity-70">{l}</div>
          </div>
        ))}
      </div>
      {totDays === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">📅</div><p>No attendance records yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50">
                {['Month','Total','Present','Absent','Leave','%'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {Object.entries(grouped).map(([month, g], i) => {
                  const p = g.total > 0 ? ((g.P / g.total)*100).toFixed(0) : 0
                  return (
                    <tr key={i} className="border-b border-gray-100 hover:bg-green-50">
                      <td className="px-4 py-3 font-semibold">{month}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{g.total}</td>
                      <td className="px-4 py-3 text-green-700 font-bold">{g.P}</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{g.A}</td>
                      <td className="px-4 py-3 text-amber-600 font-bold">{g.L||0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5" style={{minWidth:50}}>
                            <div className="bg-green-600 h-1.5 rounded-full" style={{width:`${p}%`}} />
                          </div>
                          <span className="text-xs font-bold">{p}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Fees section ─────────────────────────────────────────────
function FeesSection({ token }) {
  const { data: fees, loading } = useStudentData('/students/me/fees', token)
  const totalPaid    = fees?.filter(f => f.status==='Paid').reduce((a,f)=>a+(f.amount||0),0)||0
  const totalPending = fees?.filter(f => f.status==='Pending').reduce((a,f)=>a+(f.amount||0),0)||0
  if (loading) return <div className="py-16 text-center text-gray-400">Loading fees…</div>
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="text-2xl font-bold text-green-700">Rs {totalPaid.toLocaleString()}</div>
          <div className="text-sm text-green-600 font-semibold mt-1">Total Paid</div>
        </div>
        <div className={`border rounded-2xl p-5 ${totalPending>0?'bg-red-50 border-red-200':'bg-gray-50 border-gray-200'}`}>
          <div className={`text-2xl font-bold ${totalPending>0?'text-red-700':'text-gray-600'}`}>Rs {totalPending.toLocaleString()}</div>
          <div className={`text-sm font-semibold mt-1 ${totalPending>0?'text-red-600':'text-gray-500'}`}>{totalPending>0?'Amount Due':'No Dues ✅'}</div>
        </div>
      </div>
      {(!fees||fees.length===0) ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">💰</div><p>No fee records yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50">
                {['Month','Amount','Paid On','Receipt','Status'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {fees.map((f,i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-green-50">
                    <td className="px-4 py-3 font-semibold">{f.month||'—'}</td>
                    <td className="px-4 py-3 font-mono">Rs {(f.amount||0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{f.paidDate||'—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.receiptNo||'—'}</td>
                    <td className="px-4 py-3"><Badge color={f.status==='Paid'?'green':'red'}>{f.status}</Badge></td>
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

// ── Notices section ──────────────────────────────────────────
function NoticesSection() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${API}/notices`).then(r=>r.json()).then(json=>{ if(json.success) setNotices(json.data.slice(0,10)) }).catch(()=>{}).finally(()=>setLoading(false))
  }, [])
  const NC = { Important:'red', Event:'blue', Academic:'purple', General:'gray', Holiday:'amber' }
  if (loading) return <div className="py-16 text-center text-gray-400">Loading notices…</div>
  return (
    <div className="flex flex-col gap-4">
      {notices.length===0 && <div className="text-center py-16 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl"><div className="text-4xl mb-3">📋</div><p>No notices yet.</p></div>}
      {notices.map((n,i) => (
        <div key={n._id||i} className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex gap-2 mb-2 flex-wrap items-center">
            <Badge color={NC[n.type]||'gray'}>{n.type}</Badge>
            <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString('en-NP',{year:'numeric',month:'long',day:'numeric'})}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">{n.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{n.content}</p>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════
export default function StudentPortal() {
  const [tab, setTab] = useState('profile')
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()
  const { data: student, loading: studentLoading } = useStudentData('/students/me', token)

  if (studentLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-green-200 border-t-green-700 animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading your portal…</p>
      </div>
    </div>
  )

  const s = student || {}

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}>
      <header className="bg-green-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-base border border-white/20">🌿</div>
            <div>
              <div className="text-sm font-bold leading-tight">Evergreen Pacific</div>
              <div className="text-xs opacity-50">Student Portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold hidden sm:block">Hi, {(user?.name||s.name||'').split(' ')[0]} 👋</span>
            <button onClick={()=>{logout();navigate('/')}}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold transition-colors">
              <LogOut size={13}/> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-2xl p-5 text-white mb-5 flex items-center gap-4 flex-wrap shadow-lg">
          <div className="w-14 h-14 bg-white/15 rounded-full border-2 border-white/25 flex items-center justify-center text-3xl flex-shrink-0">🎓</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">{user?.name||s.name||'Student'}</h1>
            <p className="text-green-200 text-sm font-semibold">
              {s.grade||'—'} · Roll #{s.rollNo||'—'} · {s.sid||'—'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold">{s.type||'Day Scholar'}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.status==='Active'?'bg-green-400/30 border-green-300/30':'bg-red-400/30 border-red-300/30'}`}>
              {s.status==='Active'?'✅ Active':s.status||'Active'}
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 mb-5 flex overflow-x-auto gap-1">
          {TABS.map(({id, Icon, label}) => (
            <button key={id} onClick={()=>setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0
                ${tab===id?'bg-green-900 text-white shadow':'text-gray-500 hover:text-green-800 hover:bg-green-50'}`}>
              <Icon size={13}/>{label}
            </button>
          ))}
        </div>

        {tab==='profile' && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-900 to-green-700 px-5 py-6 text-white flex items-center gap-4">
              <div className="w-16 h-16 bg-white/15 rounded-full border-2 border-white/25 flex items-center justify-center text-3xl">🎓</div>
              <div>
                <h2 className="text-xl font-bold">{s.name||user?.name||'—'}</h2>
                <p className="text-green-200 text-sm">{s.sid||'—'} · {s.grade||'—'} · Roll #{s.rollNo||'—'}</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {[['Student ID',s.sid||'—'],['Grade',s.grade||'—'],['Roll Number',s.rollNo||'—'],['Gender',s.gender||'—'],['Student Type',s.type||'Day'],['Date of Birth',s.dob||'—'],['Parent/Guardian',s.parent||'—'],['Contact Phone',s.phone||'—'],['Address',s.address||'—'],['Status',s.status||'Active']].map(([l,v])=>(
                <div key={l} className="flex justify-between items-center px-5 py-3.5 text-sm">
                  <span className="text-gray-500 font-medium">{l}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t text-xs text-gray-400">
              🔑 Your login: phone <strong>{s.phone}</strong> · password: <strong>evergreen{String(s.phone||'').replace(/\D/g,'').slice(0,4)}</strong>
            </div>
          </div>
        )}

        {tab==='results'    && <ResultsTab token={token} student={student} />}
        {tab==='attendance' && <AttendanceSection token={token} />}
        {tab==='fees'       && <FeesSection token={token} />}
        {tab==='notices'    && <NoticesSection />}
        {tab==='timetable'  && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold">🗓️ Weekly Timetable</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-gray-50">
                  {['Period','Sun','Mon','Tue','Wed','Thu','Fri'].map(h=>(
                    <th key={h} className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {TIMETABLE.map((row,i)=>(
                    <tr key={i} className="border-b border-gray-100 hover:bg-green-50">
                      <td className="px-3 py-3 font-mono text-xs font-bold text-gray-500 whitespace-nowrap">{row.period}</td>
                      {[row.sun,row.mon,row.tue,row.wed,row.thu,row.fri].map((sub,j)=>(
                        <td key={j} className="px-3 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold whitespace-nowrap ${SUB_BG[sub]||'bg-gray-100 text-gray-600'}`}>{sub}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="text-center py-8 text-xs text-gray-400">© 2083 B.S. Evergreen Pacific English Boarding School</div>
    </div>
  )
}
