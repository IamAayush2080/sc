// src/pages/Academics.jsx
import { useState } from 'react'

const tabs = ['Courses', 'Timetable', 'Activities', 'Results']

const courses = [
  { icon:'🌸', label:'Ages 3–5',   title:'Early Childhood Development (ECD / Nursery)', desc:'Play-based learning developing literacy, numeracy, motor skills and social interaction for ages 3–5.' },
  { icon:'🔤', label:'Ages 5–6',   title:'Lower KG & Upper KG',             desc:'Foundation literacy, numbers, rhymes, drawing and school readiness in a fun, caring environment.' },
  { icon:'📖', label:'Ages 6–10',  title:'Primary Level – Grades 1 to 5',   desc:'English-medium: Nepali, English, Math, Science, Social Studies, Computer, Moral Science & Arts.' },
  { icon:'📐', label:'Ages 11–13', title:'Lower Secondary – Grades 6 to 8', desc:'Advanced subjects with project work, practical labs, ICT integration and critical thinking skills.' },
  { icon:'🎓', label:'Ages 14–16', title:'Secondary Level – Grades 9 & 10 (SEE)', desc:'NEB-affiliated SEE preparation: rigorous academics, mock tests, career counseling and exam strategy coaching.' },
  { icon:'💻', label:'All Grades', title:'Computer & ICT Education',         desc:'Computer literacy from Grade 1; programming basics and internet skills in secondary level.' },
  { icon:'🧘', label:'All Grades', title:'Health, Physical Education & Yoga', desc:'PE, yoga, and health awareness integrated into weekly schedule for all grade levels.' },
]

const ttRows = [
  ['P1 · 8:00–8:45',  'English','Math','Science','English','Math','Computer'],
  ['P2 · 8:45–9:30',  'Nepali','Science','English','Social','Nepali','HPE'],
  ['P3 · 9:30–10:15', 'Math','Social','Math','Nepali','English','HPE'],
  ['Tiffin Break',null,null,null,null,null,null],
  ['P4 · 10:30–11:15','Science','Nepali','Social','Math','Computer','Arts'],
  ['P5 · 11:15–12:00','Social','Computer','Arts','English','Nepali','Math'],
  ['Lunch Break',null,null,null,null,null,null],
  ['P6 · 12:45–1:30', 'Computer','HPE','Nepali','Science','Social','English'],
]

const subColor = {
  English:'bg-green-100 text-green-800', Math:'bg-blue-100 text-blue-800',
  Science:'bg-amber-100 text-amber-800', Nepali:'bg-rose-100 text-rose-800',
  Social:'bg-teal-100 text-teal-800', Computer:'bg-purple-100 text-purple-800',
  HPE:'bg-orange-100 text-orange-800', Arts:'bg-pink-100 text-pink-800',
}

const activities = [
  { icon:'⚽', tag:'Sports', title:'Annual Sports Day', desc:'Football, volleyball, athletics, kabaddi and badminton — inter-house competitions with trophies.' },
  { icon:'🎭', tag:'Culture', title:'Cultural Programs', desc:'Dance, drama, music and cultural shows on Dashain, Tihar, National Days and Annual Day.' },
  { icon:'🔬', tag:'Science', title:'Science Exhibition', desc:'Annual fair where students showcase models, experiments and innovation projects.' },
  { icon:'📖', tag:'Literacy', title:'Reading & Debate Club', desc:'Weekly reading, essay writing, public speaking, and inter-school debate competitions.' },
  { icon:'🎨', tag:'Arts', title:'Arts & Crafts', desc:'Drawing, painting, rangoli, pottery, and handicraft activities for creativity.' },
  { icon:'🏕️', tag:'Excursion', title:'Educational Trips', desc:'Annual school trips to historical, cultural, and natural sites across Nepal.' },
]

export default function Academics() {
  const [tab, setTab] = useState(0)
  return (
    <div>
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Academics</div>
          <h1 className="font-display text-5xl font-bold mb-4">Curriculum & <span className="text-amber-400">Programs</span></h1>
          <p className="text-white/75 text-lg">From ECD play-based learning to SEE preparation — a complete education journey.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-w">
          <div className="flex gap-2 bg-gray-100 rounded-2xl p-1.5 mb-10 flex-wrap">
            {tabs.map((t,i) => (
              <button key={i} onClick={() => setTab(i)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all min-w-[100px]
                  ${tab===i ? 'bg-white text-green-800 shadow' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
            ))}
          </div>

          {tab === 0 && (
            <div className="flex flex-col gap-4">
              {courses.map((c,i) => (
                <div key={i} className="card card-hover-bar p-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-base">{c.title}</h3>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">{c.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">→</div>
                </div>
              ))}
            </div>
          )}

          {tab === 1 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Sample weekly timetable — Grade 9 (2081 B.S.)</p>
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead><tr>
                    {['Period/Time','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'].map(h => (
                      <th key={h} className="bg-green-800 text-white px-3 py-3 text-center text-xs font-bold whitespace-nowrap first:text-left">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {ttRows.map((row, i) => (
                      row[1] === null
                        ? <tr key={i}><td colSpan={7} className="text-center py-2.5 text-xs font-bold text-gray-400 bg-gray-50 border-b border-gray-100">— {row[0]} —</td></tr>
                        : <tr key={i} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                            {row.map((cell, j) => (
                              <td key={j} className={`px-3 py-2.5 text-center ${j===0?'text-left font-semibold text-xs text-gray-500 whitespace-nowrap':''}`}>
                                {j > 0 ? <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${subColor[cell]||'bg-gray-100 text-gray-700'}`}>{cell}</span> : cell}
                              </td>
                            ))}
                          </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 2 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activities.map((a,i) => (
                <div key={i} className="card card-hover-bar p-6">
                  <div className="text-3xl mb-4">{a.icon}</div>
                  <div className="badge-green text-xs mb-3">{a.tag}</div>
                  <h3 className="font-bold text-base mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 3 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[['95%','SEE Pass Rate 2080'],['12','Distinction Students'],['3.8','Avg GPA Grade 10'],['#?','District Rank 2080']].map(([n,l],i) => (
                <div key={i} className="card p-7 text-center">
                  <div className="font-display text-4xl font-bold text-green-800 mb-2">{n}</div>
                  <div className="text-sm text-gray-500">{l}</div>
                </div>
              ))}
              <div className="sm:col-span-2 lg:col-span-4 bg-green-50 border border-green-200 rounded-2xl p-6 text-center text-sm text-green-800">
                📊 Full class-wise results are available in the <strong>Student Portal</strong>. Login to view your child's complete result history.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
