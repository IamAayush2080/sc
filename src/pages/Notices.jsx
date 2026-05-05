// src/pages/Notices.jsx
import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const typeConfig = {
  Important: { label:'⚠️ Important', cls:'badge-red' },
  Event:     { label:'🎉 Event',     cls:'badge-amber' },
  General:   { label:'📋 General',   cls:'badge-green' },
  Academic:  { label:'📚 Academic',  cls:'badge-blue' },
  Holiday:   { label:'🏖️ Holiday',   cls:'badge-amber' },
}

// Static fallback shown when DB has no notices yet
const STATIC_NOTICES = [
  { _id:'1', title:'Annual Examination Schedule 2082/83 Released', content:'Final exams for Grades 6–10 commence Jestha 20. Admit cards available from school office from Jestha 15. Students must carry admit cards on all exam days.', type:'Important', createdAt: new Date() },
  { _id:'2', title:'Annual Sports Day 2083 — Jestha 25', content:'Grand Annual Sports Day at school ground. Inter-house competitions: football, volleyball, athletics, kabaddi. Parents cordially invited. Students report by 7:30 AM.', type:'Event', createdAt: new Date() },
  { _id:'3', title:'Scholarship Applications Open for 2082 B.S.', content:'Merit and need-based scholarships available. Applications by Jestha 15. Scholarship exam on Jestha 18. Covers up to 100% of tuition fee.', type:'Important', createdAt: new Date() },
  { _id:'4', title:"Parents' Meeting — Baisakh 30, 10:00 AM", content:"All parents and guardians must attend. Class-wise progress reports will be distributed and discussed. Attendance is mandatory for all classes.", type:'General', createdAt: new Date() },
  { _id:'5', title:'Science Exhibition Registration Open — Grade 6–10', content:'Register project ideas with science teacher by Baisakh 25. Projects on environment, health, and technology are encouraged.', type:'Academic', createdAt: new Date() },
  { _id:'6', title:'School Uniform Policy Reminder', content:'All students must wear complete school uniform daily. Students without proper uniform will not be permitted to class.', type:'General', createdAt: new Date() },
]

export function Notices() {
  const [notices, setNotices]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch(`${API}/notices`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) setNotices(json.data)
        else setNotices(STATIC_NOTICES)
      })
      .catch(() => setNotices(STATIC_NOTICES))
      .finally(() => setLoading(false))
  }, [])

  const display = notices.length > 0 ? notices : STATIC_NOTICES
  const filtered = filter === 'all'
    ? display
    : display.filter(n => n.type?.toLowerCase() === filter)

  return (
    <div>
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Notice Board</div>
          <h1 className="font-display text-5xl font-bold mb-4">Announcements &amp; <span className="text-amber-400">Updates</span></h1>
          <p className="text-white/70 text-lg">Stay up to date with everything happening at Evergreen Pacific.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-w">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[['all','All'],['important','Important'],['event','Events'],['general','General'],['academic','Academic'],['holiday','Holiday']].map(([k,l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${filter===k ? 'bg-green-800 text-white border-green-800' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'}`}>{l}</button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-green-200 border-t-green-700 rounded-full animate-spin" style={{borderWidth:3}} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-4xl mb-3">📋</div>
                  <p>No notices in this category.</p>
                </div>
              )}
              {filtered.map((n, i) => {
                const cfg = typeConfig[n.type] || typeConfig.General
                const d = new Date(n.createdAt)
                const isOpen = expanded === (n._id || i)
                return (
                  <div key={n._id || i}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-green-300 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : (n._id || i))}>
                    <div className="flex gap-5 p-5">
                      {/* Date badge */}
                      <div className="bg-green-800 text-white rounded-xl px-3 py-2.5 text-center flex-shrink-0 min-w-[56px] self-start">
                        <div className="font-display text-2xl font-bold leading-none">{d.getDate()}</div>
                        <div className="text-xs font-semibold mt-1 opacity-75">{d.toLocaleString('default',{month:'short'})}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2 flex-wrap items-center">
                          <span className={`${cfg.cls} text-xs`}>{cfg.label}</span>
                          <span className="text-xs text-gray-400">{d.toLocaleDateString('en-NP', {year:'numeric',month:'long',day:'numeric'})}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1 leading-snug">{n.title}</h4>
                        {!isOpen && (
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{n.content}</p>
                        )}
                        {isOpen && (
                          <p className="text-sm text-gray-600 leading-relaxed mt-1">{n.content}</p>
                        )}
                        <button className="mt-2 text-xs text-green-700 font-semibold hover:text-green-900">
                          {isOpen ? 'Show less ▲' : 'Read more ▼'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Notices
