// src/pages/Events.jsx
const events = [
  { title:'Annual Sports Day 🏆',     date:'Jestha 25, 2083',  cat:'sports',    bg:'from-green-900 to-green-700',   venue:'School Ground', time:'7:30 AM', desc:'Grand annual sports event with inter-house football, volleyball, athletics and kabaddi. Parents welcome!' },
  { title:'Annual Science Fair 🔬',   date:'Ashadh 1, 2083',   cat:'academic',  bg:'from-purple-900 to-purple-700', venue:'School Hall',   time:'10:00 AM',desc:'Students from Grade 6–10 showcase working models, experiments and innovation projects. Open to public!' },
  { title:'Cultural Night 🎭',        date:'Shrawan 15, 2083', cat:'culture',   bg:'from-rose-900 to-rose-700',     venue:'School Ground', time:'5:00 PM', desc:'Annual cultural program featuring traditional dance, music, drama, and cultural presentations.' },
  { title:'First Terminal Exams 📝',  date:'Falgun 20, 2083',  cat:'exam',      bg:'from-blue-900 to-blue-700',     venue:'All Classes',   time:'8:00 AM', desc:'First terminal examinations for all grades. Admit cards distributed 5 days prior.' },
  { title:'Prize Distribution 🏅',   date:'Kartik 1, 2083',   cat:'ceremony',  bg:'from-emerald-900 to-emerald-700',venue:'Main Hall',    time:'11:00 AM',desc:'Annual prize ceremony to honor academic toppers, sports champions, and outstanding achievers.' },
  { title:'Graduation Day 🎓',        date:'Chaitra 15, 2083', cat:'ceremony',  bg:'from-amber-900 to-amber-700',   venue:'Main Ground',   time:'9:00 AM', desc:'Graduation ceremony for SEE (Grade 10) completers. Certificates, medals, and farewell.' },
]

export function Events() {
  return (
    <div>
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Events Calendar</div>
          <h1 className="font-display text-5xl font-bold mb-4">Upcoming <span className="text-amber-400">Events 2083–84</span></h1>
          <p className="text-white/75 text-lg">Mark your calendars for these important school events.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-w grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <div key={i} className="card overflow-hidden hover:shadow-xl transition-all">
              <div className={`bg-gradient-to-br ${ev.bg} p-6 text-white`}>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{ev.date}</div>
                <h3 className="font-display text-xl font-bold">{ev.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{ev.desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge-green text-xs">🏛️ {ev.venue}</span>
                  <span className="badge-amber text-xs">🕐 {ev.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Events
