// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SCHOOL_BG = '/school-building.jpg'

const stats = [
  { num: '450+', label: 'Enrolled Students',   sub: '2081 B.S.' },
  { num: '35+',  label: 'Qualified Teachers',  sub: 'M.Ed. & B.Ed.' },
  { num: '95%',  label: 'SEE Pass Rate',        sub: 'Consistently' },
  { num: '34',   label: 'Years of Excellence', sub: 'Est. 2047 B.S.' },
]

const features = [
  { icon: '🏆', color: 'bg-green-50',    title: 'Outstanding Results',  desc: 'Top SEE scores with 95%+ pass rates and multiple district toppers every year.' },
  { icon: '💻', color: 'bg-blue-50',     title: 'Digital Learning',     desc: 'Computer lab, smart boards, and ICT-integrated curriculum from Grade 1.' },
  { icon: '🌱', color: 'bg-emerald-50',  title: 'Green School',         desc: 'Eco-friendly school in Mayadevi with gardens and a healthy learning environment.' },
  { icon: '🎭', color: 'bg-rose-50',     title: 'Holistic Development', desc: 'Sports, arts, culture, science fairs, and leadership activities for all students.' },
  { icon: '👨‍🏫', color: 'bg-purple-50', title: 'Caring Teachers',     desc: '35+ dedicated educators with advanced degrees and a genuine love for teaching.' },
  { icon: '🔒', color: 'bg-amber-50',    title: 'Safe Environment',     desc: 'CCTV-monitored school with strict discipline and a secure boarding facility.' },
  { icon: '🍽️', color: 'bg-orange-50',  title: 'Boarding & Meals',     desc: 'Nutritious meals, supervised study hours, and comfortable boarding rooms.' },
  { icon: '💰', color: 'bg-teal-50',     title: 'Affordable Quality',   desc: 'Moderate fees with scholarships for meritorious and financially needy students.' },
]

const typeConfig = {
  Important: { badge: 'bg-red-500/30 text-red-200 border border-red-400/40' },
  Event:     { badge: 'bg-blue-500/30 text-blue-200 border border-blue-400/40' },
  General:   { badge: 'bg-white/15 text-white/70 border border-white/20' },
  Academic:  { badge: 'bg-purple-500/30 text-purple-200 border border-purple-400/40' },
  Holiday:   { badge: 'bg-amber-500/30 text-amber-200 border border-amber-400/40' },
}

export default function Home() {
  const [notices, setNotices]   = useState([])
  const [bgLoaded, setBgLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API}/notices`)
      .then(r => r.json())
      .then(json => { if (json.success) setNotices(json.data.slice(0, 4)) })
      .catch(() => {})

    const img = new Image()
    img.src = SCHOOL_BG
    img.onload  = () => setBgLoaded(true)
    img.onerror = () => setBgLoaded(false)
  }, [])

  const displayNotices = notices.length > 0 ? notices : [
    { _id:'1', title:'Admission Open — Nursery to Grade 9 for 2083 B.S.', type:'Important', createdAt: new Date() },
    { _id:'2', title:'Scholarship Applications Open — Deadline Jestha 15', type:'Important', createdAt: new Date() },
    { _id:'3', title:'Annual Sports Day — Jestha 25, All students attend',  type:'Event',     createdAt: new Date() },
    { _id:'4', title:"Parents' Meeting — Baisakh 30 at 10:00 AM",          type:'General',   createdAt: new Date() },
  ]

  return (
    <div>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', padding: '5rem 1rem' }}>

        {/* ── LAYER 1: School photo background ── */}
        {bgLoaded ? (
          <div className="absolute inset-0"
            style={{ backgroundImage: `url('${SCHOOL_BG}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'scale(1.04)' }} />
        ) : (
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg,#021a0c 0%,#0a3d1f 40%,#145c2e 70%,#166534 100%)' }} />
        )}

        {/* ── LAYER 2: Strong multi-stop dark overlay ── */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(1,15,8,0.95) 0%, rgba(2,22,11,0.90) 40%, rgba(4,35,18,0.80) 70%, rgba(5,46,22,0.70) 100%)' }} />

        {/* ── LAYER 3: Extra vignette on all edges ── */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />

        {/* ── LAYER 4: Bottom gradient ── */}
        <div className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, rgba(1,12,6,0.75) 0%, transparent 100%)' }} />

        {/* ── Decorative glow orbs ── */}
        <div className="absolute pointer-events-none"
          style={{ top:'15%', left:'10%', width:'420px', height:'420px', borderRadius:'50%', background:'radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none"
          style={{ bottom:'20%', right:'5%', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 65%)' }} />

        {/* ── CONTENT ── */}
        <div style={{
          maxWidth: '1280px', margin: '0 auto', width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 420px)',
          gap: '3rem',
          position: 'relative', zIndex: 10,
          alignItems: 'center',
        }}>

          {/* LEFT — Identity */}
          <div>
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: '9999px',
              padding: '0.4rem 1.1rem', marginBottom: '1.75rem',
              color: 'rgba(255,255,255,0.88)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.03em',
            }}>
              <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4ade80', display:'inline-block', boxShadow:'0 0 8px #4ade80' }} className="animate-pulse" />
              Est. 2047 B.S. · Mayadevi-7, Hatibangai · NEB Affiliated
            </div>

            {/* ── SCHOOL NAME ── */}
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.01em',
              color: '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.7), 0 0 60px rgba(34,197,94,0.12)',
              marginBottom: '0.4rem',
            }}>
              Evergreen Pacific
            </h1>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)',
              fontWeight: 700, lineHeight: 1.2,
              color: '#FCD34D',
              textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 40px rgba(251,191,36,0.35)',
              marginBottom: '1.25rem',
            }}>
              English High School
            </h2>

            {/* Motto */}
            <div style={{ borderLeft: '3px solid rgba(251,191,36,0.65)', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.875rem', fontStyle: 'italic', lineHeight: 1.65, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
                "Education is an ornament in prosperity and a refuse in adversity"
              </p>
            </div>

            {/* Description */}
            <p style={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: '1rem', lineHeight: 1.8, maxWidth: '30rem', marginBottom: '2rem',
              textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            }}>
              Nurturing <strong style={{ color: '#ffffff', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>450+</strong> bright
              young minds with quality English-medium education from Nursery to Grade 9 — rooted
              in Nepali values, driven by modern excellence.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.25rem' }}>
              <Link to="/admissions" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.85rem 1.75rem', borderRadius: '0.875rem',
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(245,158,11,0.50), 0 2px 8px rgba(0,0,0,0.4)',
                letterSpacing: '0.01em',
              }}>
                📋 Apply for Admission
              </Link>
              <Link to="/about" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.85rem 1.75rem', borderRadius: '0.875rem',
                background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.28)',
                color: '#fff', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              }}>
                Explore School →
              </Link>
            </div>
          </div>

          {/* RIGHT — Notice board card */}
          <div style={{
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: '1.25rem', padding: '1.75rem',
            boxShadow: '0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>📢 Latest Notices</h3>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em',
                background: 'rgba(251,191,36,0.18)', color: '#FCD34D',
                border: '1px solid rgba(251,191,36,0.35)', borderRadius: '9999px',
                padding: '0.2rem 0.75rem',
              }}>● LIVE</span>
            </div>

            {/* Notices */}
            {displayNotices.map((n, i) => {
              const cfg = typeConfig[n.type] || typeConfig.General
              return (
                <Link to="/notices" key={n._id || i} style={{
                  display: 'flex', gap: '0.75rem', textDecoration: 'none',
                  padding: '0.7rem 0',
                  borderBottom: i < displayNotices.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24', flexShrink: 0, marginTop: '0.35rem' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.93)', lineHeight: 1.5, fontWeight: 500 }}>{n.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }} className={cfg.badge}>{n.type}</span>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
                        {new Date(n.createdAt).toLocaleDateString('en-NP', { month:'short', day:'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* View all */}
            <Link to="/notices" style={{
              display: 'block', textAlign: 'center', marginTop: '1rem', padding: '0.6rem',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.75rem', color: 'rgba(255,255,255,0.82)', fontSize: '0.8rem',
              fontWeight: 600, textDecoration: 'none',
            }}>
              View All Notices →
            </Link>

            {/* Admission badge */}
            <div style={{
              marginTop: '0.85rem', padding: '0.75rem 1rem', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(180,83,9,0.15))',
              border: '1px solid rgba(251,191,36,0.35)', borderRadius: '0.875rem',
            }}>
              <p style={{ color: '#FCD34D', fontWeight: 700, fontSize: '0.9rem' }}>🎓 Admission Open 2083 B.S.</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Nursery to Grade 9 · Call: 9704636313
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:'1.75rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem', opacity:0.45 }}>
          <span style={{ color:'white', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:700 }}>Scroll</span>
          <div style={{ width:'1px', height:'30px', background:'linear-gradient(to bottom, white, transparent)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'linear-gradient(135deg,#14532d,#166534,#15803d)', padding:'3.5rem 1rem' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'3rem', fontWeight:800, color:'#fbbf24', lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:'0.875rem', fontWeight:600, marginTop:'0.5rem', opacity:0.9 }}>{s.label}</div>
              <div style={{ fontSize:'0.75rem', marginTop:'0.25rem', opacity:0.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section">
        <div className="container-w">
          <div className="section-label">Why Choose Us</div>
          <div className="section-title">Excellence in <span className="text-green-700">Every Classroom</span></div>
          <p className="section-sub">We blend Nepali values with modern pedagogy to create confident, capable students ready for tomorrow.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className={`card card-hover-bar p-6 border ${f.color}`}>
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-2xl mb-5`}>{f.icon}</div>
                <h3 className="font-bold text-base mb-2 text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section className="section section-alt">
        <div className="container-w">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="section-label">School Life</div>
              <div className="section-title">Moments &amp; <span className="text-green-700">Memories</span></div>
            </div>
            <Link to="/gallery" className="btn-primary">View Full Gallery →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji:'🏆', label:'Prize Distribution', bg:'linear-gradient(135deg,#052e16,#166534)' },
              { emoji:'⚽', label:'Sports Day 2081',    bg:'linear-gradient(135deg,#1e3a5f,#1d4ed8)' },
              { emoji:'🎭', label:'Cultural Program',   bg:'linear-gradient(135deg,#4c0519,#be123c)' },
              { emoji:'🔬', label:'Science Exhibition', bg:'linear-gradient(135deg,#2e1065,#7c3aed)' },
            ].map((g, i) => (
              <Link to="/gallery" key={i}
                className="rounded-2xl h-44 flex flex-col items-center justify-center text-white gap-3 cursor-pointer hover:scale-[1.03] transition-transform shadow-md"
                style={{ background: g.bg }}>
                <span className="text-4xl">{g.emoji}</span>
                <span className="text-sm font-semibold opacity-90">{g.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT + MAP ── */}
      <section className="section">
        <div className="container-w">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">Find Us</div>
              <div className="section-title">Visit Our <span className="text-green-700">School</span></div>
              <div className="space-y-4 mt-6">
                {[
                  ['📍','Address','Mayadevi-7, Hatibangai, Rupandehi, Lumbini Province, Nepal'],
                  ['📞','Phone','9704636313'],
                  ['✉️','Email','schoolevergreen98@gmail.com'],
                  ['🕐','School Hours','Sunday – Friday: 8:00 AM – 4:00 PM'],
                  ['🎓','Grades','Nursery, KG, Grade 1 – Grade 9 (ECD Available)'],
                ].map(([icon,label,value]) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                      <p className="text-gray-800 font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8 flex-wrap">
                <a href="tel:9704636313" className="px-6 py-3 bg-green-800 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm flex items-center gap-2">📞 Call Now</a>
                <Link to="/contact" className="px-6 py-3 border-2 border-green-800 text-green-800 font-semibold rounded-xl hover:bg-green-50 transition-colors text-sm">Send Message</Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-80">
              <iframe
                title="Evergreen Pacific English High School"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1!2d83.4!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAwLjAiTiA4M8KwMjQnMDAuMCJF!5e0!3m2!1sen!2snp!4v1"
                width="100%" height="100%" style={{ border:0 }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ADMISSION CTA ── */}
      <section className="section">
        <div className="container-w text-center">
          <div className="rounded-3xl p-12 text-white relative overflow-hidden"
            style={{ background:'linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%)' }}>
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'24px 24px' }} />
            <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
              style={{ background:'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)', borderRadius:'50%' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-5">🌿</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontWeight:800, marginBottom:'1rem' }}>
                Ready to Join Our Family?
              </h2>
              <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'1.05rem', marginBottom:'0.75rem', maxWidth:'34rem', margin:'0 auto 0.75rem' }}>
                Give your child the best start in life. Admissions open for 2083 B.S. — Nursery to Grade 9.
              </p>
              <p style={{ color:'#fcd34d', fontWeight:600, fontSize:'0.9rem', marginBottom:'2rem' }}>
                📞 9704636313 &nbsp;·&nbsp; ✉️ schoolevergreen98@gmail.com
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/admissions"
                  style={{ padding:'0.9rem 2rem', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', fontWeight:700, borderRadius:'0.875rem', textDecoration:'none', boxShadow:'0 4px 20px rgba(245,158,11,0.45)' }}>
                  Apply for Admission →
                </Link>
                <Link to="/contact"
                  style={{ padding:'0.9rem 2rem', background:'rgba(255,255,255,0.10)', border:'1.5px solid rgba(255,255,255,0.25)', color:'#fff', fontWeight:600, borderRadius:'0.875rem', textDecoration:'none' }}>
                  Contact School
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}