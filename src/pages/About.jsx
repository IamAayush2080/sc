// src/pages/About.jsx
import { Link } from 'react-router-dom'

const facilities = [
  { icon:'🏫', title:'Smart Classrooms',   desc:'Well-lit, ventilated rooms with modern furniture and smart teaching aids.' },
  { icon:'💻', title:'Computer Lab',       desc:'Fully equipped lab with internet for ICT education and digital skills.' },
  { icon:'🔬', title:'Science Laboratory', desc:'Well-stocked lab for Physics, Chemistry, and Biology practicals.' },
  { icon:'📚', title:'Library (Under construction)', desc:'Rich collection of textbooks, reference books, and English/Nepali literature.' },
  { icon:'⚽', title:'Sports Ground',      desc:'Spacious ground for football, volleyball, badminton, athletics and cricket.' },
  { icon:'🏠', title:'Boarding Hostel (Available Soon)', desc:'Safe, comfortable rooms with nutritious meals and supervised study hours.' },
]

const team = [
  { name:'Mr. Ram Prasad Sharma', role:'Principal',       emoji:'👨‍💼', bg:'from-green-200 to-green-100',   qual:'M.Ed. · 20+ years experience' },
  { name:'Ms. Sunita Thapa',      role:'Vice Principal',  emoji:'👩‍🏫', bg:'from-pink-200 to-pink-100',     qual:'B.Ed. English · 15 years' },
  { name:'Mr. Dipesh KC',         role:'Head of Science', emoji:'👨‍🔬', bg:'from-blue-200 to-blue-100',     qual:'M.Sc. Physics · 12 years' },
  { name:'Ms. Anita Rai',         role:'ICT Coordinator', emoji:'👩‍💻', bg:'from-purple-200 to-purple-100', qual:'B.Sc. CSIT · 8 years' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="section-label text-green-300">About Us</div>
          <h1 className="font-display text-5xl font-bold mb-5">Our Story & <span className="text-amber-400">Mission</span></h1>
          <p className="text-white/75 text-lg leading-relaxed">15+ years of nurturing young minds in Mayadevi, Rupandehi — rooted in Nepali values, reaching for global excellence.</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container-w">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Who We Are</div>
              <h2 className="section-title">Evergreen Pacific <span className="text-green-700">English School</span></h2>
              <p className="text-gray-500 leading-relaxed mb-5">Evergreen Pacific English Boarding School is located in Mayadevi Rural Municipality, Ward 7, Hati Bangai, Rupandehi district, Lumbini Province, Nepal. Established to provide quality English-medium education, the school has grown to serve <strong className="text-gray-900">450+ students</strong> across ECD to Grade 10.</p>
              <p className="text-gray-500 leading-relaxed mb-8">Our boarding facility provides a safe, home-like environment for students from neighboring villages and districts, with nutritious meals, supervised study hours, and regular parent communication.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admissions" className="btn-primary">Apply Now →</Link>
                <Link to="/contact" className="btn-secondary">Contact Us</Link>
              </div>
            </div>

            {/* ── School building photo ── */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-72">
                <img
                  src="/school-building.jpg"
                  alt="Evergreen Pacific English High School building"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                />
                {/* Fallback if image fails to load */}
                <div style={{ display: 'none', width: '100%', height: '100%', background: 'linear-gradient(135deg,#14532d,#166534)', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                  🏫
                </div>
              </div>

              {/* Years badge */}
              <div className="absolute -bottom-5 -right-5 bg-amber-500 text-white rounded-2xl p-4 text-center shadow-xl">
                <div className="font-display text-3xl font-bold">15+</div>
                <div className="text-xs font-bold mt-0.5">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section section-alt">
        <div className="container-w">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon:'🌟', title:'Our Vision', text:'To be the leading educational institution in Rupandehi, producing responsible, skilled, and compassionate citizens for Nepal and the world.' },
              { icon:'🎯', title:'Our Mission', text:'Quality English-medium education integrating national values, critical thinking, digital literacy, and holistic development from ECD to Grade 10.' },
              { icon:'💚', title:'Core Values', text:'Integrity · Discipline · Excellence · Innovation · Inclusiveness · Environmental Consciousness — the pillars of our community.' },
            ].map((v, i) => (
              <div key={i} className="bg-white border border-green-200 rounded-2xl p-7">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-lg text-green-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-w">
          <div className="section-label">Leadership</div>
          <div className="section-title">Our <span className="text-green-700">Team</span></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((t, i) => (
              <div key={i} className="card text-center">
                <div className={`h-44 bg-gradient-to-b ${t.bg} flex items-center justify-center text-6xl`}>{t.emoji}</div>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-1">{t.name}</h3>
                  <div className="text-green-700 text-sm font-semibold mb-2">{t.role}</div>
                  <p className="text-gray-400 text-xs">{t.qual}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section section-alt">
        <div className="container-w">
          <div className="section-label">School</div>
          <div className="section-title">Our <span className="text-green-700">Facilities</span></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((f, i) => (
              <div key={i} className="card card-hover-bar p-6 flex gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{f.icon}</div>
                <div><h3 className="font-bold mb-1">{f.title}</h3><p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}