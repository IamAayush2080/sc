// src/pages/Gallery.jsx
import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const categories = ['All', 'Events', 'Sports', 'Culture', 'Academics', 'School', 'Students']

// Placeholder tiles shown when no real photos yet
const PLACEHOLDERS = [
  { emoji:'🏆', label:'Annual Day 2082',     cat:'Events',    bg:'from-green-900 to-green-600' },
  { emoji:'⚽', label:'Football Match',      cat:'Sports',    bg:'from-blue-900 to-blue-600' },
  { emoji:'🎭', label:'Cultural Show',       cat:'Culture',   bg:'from-rose-900 to-rose-600' },
  { emoji:'🔬', label:'Science Fair',        cat:'Academics', bg:'from-purple-900 to-purple-600' },
  { emoji:'🎤', label:'Prize Ceremony',      cat:'Events',    bg:'from-amber-800 to-amber-600' },
  { emoji:'🏃', label:'Athletics Meet',      cat:'Sports',    bg:'from-emerald-900 to-emerald-600' },
  { emoji:'💻', label:'Computer Lab',        cat:'Academics', bg:'from-indigo-900 to-indigo-600' },
  { emoji:'🌺', label:'Dashain Celebration', cat:'Culture',   bg:'from-red-900 to-red-600' },
  { emoji:'🏫', label:'School Building',     cat:'School',    bg:'from-teal-900 to-teal-600' },
  { emoji:'🎓', label:'Graduation 2083',     cat:'Students',  bg:'from-slate-800 to-slate-600' },
  { emoji:'🌳', label:'School Garden',       cat:'School',    bg:'from-lime-900 to-lime-700' },
  { emoji:'📚', label:'Library',             cat:'Students',  bg:'from-violet-900 to-violet-700' },
]

function PhotoCard({ photo, onClick }) {
  const [imgError, setImgError] = useState(false)
  const src = photo.imageUrl
    ? (photo.imageUrl.startsWith('http') ? photo.imageUrl : `${BASE}${photo.imageUrl}`)
    : null

  return (
    <div
      className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
      onClick={onClick}>
      {src && !imgError ? (
        <img src={src} alt={photo.caption || photo.label} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${photo.bg || 'from-green-900 to-green-700'} flex flex-col items-center justify-center text-white gap-2`}>
          <span className="text-5xl">{photo.emoji || '📷'}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
        <div className="w-full px-3 pb-3">
          <p className="text-white text-xs font-bold">{photo.caption || photo.label}</p>
          <p className="text-white/60 text-xs">{photo.category || photo.cat}</p>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [photos, setPhotos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive]   = useState('All')
  const [lightbox, setLB]     = useState(null)

  useEffect(() => {
    fetch(`${API}/gallery`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setPhotos(json.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Use real DB photos if available, else show placeholders
  const allItems = photos.length > 0 ? photos : PLACEHOLDERS
  const filtered = active === 'All'
    ? allItems
    : allItems.filter(p => (p.category || p.cat) === active)

  return (
    <div>
      <section className="hero-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="section-label text-green-300">Gallery</div>
          <h1 className="font-display text-5xl font-bold mb-4">Moments &amp; <span className="text-amber-400">Memories</span></h1>
          <p className="text-white/75 text-lg">Glimpses of life at Evergreen Pacific English School.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-w">
          {photos.length === 0 && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800 flex gap-3 items-start">
              <span className="text-xl flex-shrink-0">📘</span>
              <div>
                <strong>To add real school photos:</strong> Login as Admin → Gallery → Upload Photo.
                Photos will appear here instantly once uploaded.
              </div>
            </div>
          )}

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${active === cat ? 'bg-green-800 text-white border-green-800' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-green-200 border-t-green-700 rounded-full animate-spin" style={{borderWidth:3}} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <PhotoCard key={item._id || i} photo={item} onClick={() => setLB(item)} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-4 text-center py-20 text-gray-400">
                  <div className="text-5xl mb-4">📷</div>
                  <p>No photos in this category yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLB(null)}>
          <div className="max-w-3xl w-full text-center" onClick={e => e.stopPropagation()}>
            {lightbox.imageUrl && !lightbox.imgError ? (
              <img
                src={lightbox.imageUrl.startsWith('http') ? lightbox.imageUrl : `${BASE}${lightbox.imageUrl}`}
                alt={lightbox.caption}
                className="max-h-[70vh] w-auto max-w-full mx-auto rounded-xl"
              />
            ) : (
              <div className={`h-80 rounded-xl bg-gradient-to-br ${lightbox.bg || 'from-green-900 to-green-700'} flex items-center justify-center text-9xl`}>
                {lightbox.emoji || '📷'}
              </div>
            )}
            <p className="text-white font-bold text-lg mt-4">{lightbox.caption || lightbox.label}</p>
            <p className="text-white/50 text-sm mt-1">{lightbox.category || lightbox.cat}</p>
            <button onClick={() => setLB(null)} className="mt-5 px-6 py-2 bg-white/15 border border-white/25 text-white rounded-xl text-sm hover:bg-white/25 transition-colors">
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
