// src/pages/Admissions.jsx
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Admissions() {
  const [form, setForm] = useState({ sName:'', dob:'', grade:'', gender:'', fName:'', mName:'', phone:'', email:'', address:'', prevSchool:'', type:'Day Scholar', scholarship:'No' })
  const [submitted, setSubmitted] = useState(false)
  const [refNo, setRefNo] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.sName.trim() || !form.grade || !form.phone.trim()) {
      return toast.error('Please fill all required fields')
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const ref = `EP-2082-${Math.floor(Math.random() * 9000 + 1000)}`
    setRefNo(ref)
    setSubmitted(true)
    setLoading(false)
    toast.success('Application submitted successfully!')
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Admissions 2082 B.S.</div>
          <h1 className="font-display text-5xl font-bold mb-4">Join Our <span className="text-amber-400">School Family</span></h1>
          <p className="text-white/75 text-lg">Applications are open for ECD to Grade 10 for the academic year 2082 B.S.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-w">
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* Info Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[
                { icon:'📋', title:'Admission Process', body:'1. Fill the online form\n2. Submit documents to office\n3. Entrance assessment (Grade 2+)\n4. Parent interview\n5. Confirmation & fee payment' },
                { icon:'📁', title:'Required Documents', body:'• Birth certificate (photocopy)\n• 4 passport-size photos\n• Transfer Certificate (if any)\n• Parent\'s citizenship copy\n• Character certificate' },
                { icon:'💰', title:'Fee Structure 2082', body:'ECD–Grade 3: Rs 800/month\nGrade 4–7: Rs 1,000/month\nGrade 8–10: Rs 1,200/month\nAdmission: Rs 2,000 (one-time)\nBoarding + Meals: Rs 5,000/month' },
                { icon:'📅', title:'Important Dates', body:'Admission opens: Baisakh 1, 2082\nEntrance test: Baisakh 15, 2082\nScholarship exam: Jestha 18\nSession begins: Baisakh 1, 2082' },
              ].map((box, i) => (
                <div key={i} className="bg-green-50 border border-green-200 rounded-2xl p-5">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2"><span>{box.icon}</span>{box.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{box.body}</p>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h4 className="font-bold text-amber-800 mb-1">★ Scholarships Available</h4>
                <p className="text-sm text-gray-600">Merit and need-based scholarships covering up to 100% of tuition. Apply before Jestha 15.</p>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="font-display text-2xl font-bold text-green-900 mb-2">Application Submitted!</h3>
                    <p className="text-gray-500 mb-4">Your reference number:</p>
                    <div className="inline-block bg-green-50 border border-green-300 text-green-800 font-bold text-xl px-6 py-3 rounded-xl mb-6">{refNo}</div>
                    <p className="text-sm text-gray-500 mb-8">We will contact you within 2 working days. Please keep this reference number safe.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ sName:'',dob:'',grade:'',gender:'',fName:'',mName:'',phone:'',email:'',address:'',prevSchool:'',type:'Day Scholar',scholarship:'No' }) }}
                      className="btn-secondary text-sm">Submit Another Application</button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold mb-1">Online Admission Form</h2>
                    <p className="text-gray-400 text-sm mb-6">Fill all required (*) fields. We'll contact you within 2 working days.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="form-label">Student Full Name *</label>
                          <input value={form.sName} onChange={e => set('sName', e.target.value)} className="form-input" placeholder="As in birth certificate"/>
                        </div>
                        <div>
                          <label className="form-label">Date of Birth *</label>
                          <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} className="form-input"/>
                        </div>
                        <div>
                          <label className="form-label">Applying for Grade *</label>
                          <select value={form.grade} onChange={e => set('grade', e.target.value)} className="form-input">
                            <option value="">Select Grade</option>
                            {['ECD/Nursery','LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'].map(g => <option key={g}>{g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Gender *</label>
                          <select value={form.gender} onChange={e => set('gender', e.target.value)} className="form-input">
                            <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Father's Name *</label>
                          <input value={form.fName} onChange={e => set('fName', e.target.value)} className="form-input" placeholder="Father's full name"/>
                        </div>
                        <div>
                          <label className="form-label">Mother's Name *</label>
                          <input value={form.mName} onChange={e => set('mName', e.target.value)} className="form-input" placeholder="Mother's full name"/>
                        </div>
                        <div>
                          <label className="form-label">Contact Number *</label>
                          <input value={form.phone} onChange={e => set('phone', e.target.value)} className="form-input" placeholder="98XXXXXXXX"/>
                        </div>
                        <div>
                          <label className="form-label">Email Address</label>
                          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="form-input" placeholder="Optional"/>
                        </div>
                        <div className="col-span-2">
                          <label className="form-label">Home Address *</label>
                          <input value={form.address} onChange={e => set('address', e.target.value)} className="form-input" placeholder="Village / Ward / Municipality / District"/>
                        </div>
                        <div>
                          <label className="form-label">Previous School</label>
                          <input value={form.prevSchool} onChange={e => set('prevSchool', e.target.value)} className="form-input" placeholder="If applicable"/>
                        </div>
                        <div>
                          <label className="form-label">Day / Boarding</label>
                          <select value={form.type} onChange={e => set('type', e.target.value)} className="form-input">
                            <option>Day Scholar</option><option>Boarding</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="form-label">Scholarship Need?</label>
                          <select value={form.scholarship} onChange={e => set('scholarship', e.target.value)} className="form-input">
                            <option>No</option><option>Yes – Merit based</option><option>Yes – Need based</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full py-4 bg-green-800 hover:bg-green-700 disabled:bg-green-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-base">
                        {loading ? <><span className="animate-spin">⌛</span> Submitting...</> : '📝 Submit Application →'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
