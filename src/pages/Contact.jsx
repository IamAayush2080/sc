// src/pages/Contact.jsx
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return toast.error('Please fill name and message')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll reply within 24 hours.')
    setForm({ name:'', email:'', subject:'', message:'' })
    setLoading(false)
  }

  const info = [
    { icon:'📍', label:'Address',      val:'Mayadevi Ward 7, Hati Bangai\nRupandehi, Lumbini Province, Nepal' },
    { icon:'📞', label:'Phone',        val:'9704636313 (Office)\n+977-98XXXXXXXX (Principal)' },
    { icon:'✉️', label:'Email',        val:'schoolevergreen@gmail.com\nprincipal@evergreenpacific.edu.np' },
    { icon:'🕐', label:'School Hours', val:'Sunday–Friday: 8:00 AM – 4:00 PM\nSaturday: Closed' },
    { icon:'📘', label:'Facebook',     val:'facebook.com/evergreen.pacific.english.school', link:'https://www.facebook.com/evergreen.pacific.english.school' },
  ]

  return (
    <div>
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Contact Us</div>
          <h1 className="font-display text-5xl font-bold mb-4">Get In <span className="text-amber-400">Touch</span></h1>
          <p className="text-white/75 text-lg">We're here to help. Reach out to us anytime.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-w grid lg:grid-cols-2 gap-12">

          {/* Info */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-6">School Information</h3>
            {info.map((item, i) => (
              <div key={i} className="flex gap-4 mb-5">
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-bold text-sm text-gray-900 mb-1">{item.label}</div>
                  {item.link
                    ? <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-green-700 hover:underline font-medium">{item.val}</a>
                    : <div className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{item.val}</div>
                  }
                </div>
              </div>
            ))}

            {/* Map box */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-2xl h-52 flex flex-col items-center justify-center gap-3 mt-6">
              <div className="text-5xl">📍</div>
              <p className="font-bold text-green-900">Evergreen Pacific English School</p>
              <p className="text-sm text-gray-500 text-center px-6">Mayadevi Ward 7, Hati Bangai, Rupandehi<br/>~20 mins from Bhairahawa by bus</p>
              <button onClick={() => window.open('https://www.google.com/maps/search/Mayadevi+Rural+Municipality+Rupandehi+Nepal')}
                className="mt-1 px-5 py-2 bg-green-800 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Open in Google Maps 🗺️
              </button>
            </div>
          </div>

          {/* Form */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-6">Send Us a Message</h3>
            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="form-label">Your Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="form-input" placeholder="Full name"/>
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="form-input" placeholder="your@email.com"/>
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <input value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} className="form-input" placeholder="Reason for contact"/>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message:e.target.value})} className="form-input h-32 resize-none" placeholder="Your message..."/>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-green-800 hover:bg-green-700 disabled:bg-green-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  {loading ? '⌛ Sending...' : '📨 Send Message →'}
                </button>
              </form>
            </div>

            {/* Quick contacts */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-5">
              <h4 className="font-bold text-amber-800 mb-3">📞 Quick Contacts</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>🏫 <strong>Admissions:</strong> Call 9704636313 (9 AM–3 PM)</div>
                <div>💰 <strong>Fee Queries:</strong> +977-98XXXXXXXX</div>
                <div>🚨 <strong>Emergency:</strong> +977-9704636313 (24hr)</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
